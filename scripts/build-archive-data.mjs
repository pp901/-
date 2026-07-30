import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const sourcePath = path.join(projectRoot, "整合.md");
const outputPath = path.join(projectRoot, "assets", "archive-data.json");

const source = fs.readFileSync(sourcePath, "utf8");
const lines = source.split(/\r?\n/);

const periods = [
    {
        id: "jinggang",
        name: "井冈山精神",
        sourceTitle: "井冈山红色标语总结",
        themes: []
    },
    {
        id: "longmarch",
        name: "长征",
        sourceTitle: "长征时期红色标语整合",
        themes: []
    }
];

const periodById = new Map(periods.map((period) => [period.id, period]));
const records = [];
const periodCounters = { jinggang: 0, longmarch: 0 };

let currentPeriod = null;
let currentTheme = null;
let currentSubcategory = "";
let tableStarted = false;

function cleanMarkdown(value) {
    return value
        .replace(/\*\*/g, "")
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function isDivider(cells) {
    return cells.some((cell) => /^:?-{3,}:?$/.test(cell));
}

function createTheme(period, title, sourceLine) {
    const theme = {
        id: `${period.id}-${String(period.themes.length + 1).padStart(2, "0")}`,
        name: title.replace(/^[一二三四五六七八九十]+、/, "").trim(),
        description: "",
        sourceLine,
        count: 0
    };

    period.themes.push(theme);
    return theme;
}

for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const sourceLine = index + 1;

    if (line.startsWith("### ")) {
        const heading = line.slice(4).trim();

        if (heading === "井冈山红色标语总结") {
            currentPeriod = periodById.get("jinggang");
            currentTheme = null;
        } else if (heading === "长征时期红色标语整合") {
            currentPeriod = periodById.get("longmarch");
            currentTheme = null;
        } else if (currentPeriod?.id === "longmarch") {
            currentTheme = createTheme(currentPeriod, heading, sourceLine);
        }

        currentSubcategory = "";
        tableStarted = false;
        continue;
    }

    if (line.startsWith("#### ") && currentPeriod?.id === "jinggang") {
        currentTheme = createTheme(currentPeriod, line.slice(5).trim(), sourceLine);
        currentSubcategory = "";
        tableStarted = false;
        continue;
    }

    if (
        currentPeriod?.id === "longmarch"
        && currentTheme
        && !tableStarted
        && line.trim()
        && !line.startsWith("|")
    ) {
        currentTheme.description = cleanMarkdown(
            `${currentTheme.description} ${line.trim()}`
        );
        continue;
    }

    if (!line.startsWith("|") || !line.endsWith("|") || !currentPeriod || !currentTheme) {
        continue;
    }

    const cells = line
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim());

    if (cells.length !== 3 || isDivider(cells)) continue;
    if (cells[0] === "标语内容" || cells[0] === "小类") {
        tableStarted = true;
        continue;
    }

    tableStarted = true;

    let text = "";
    let place = "";
    let sourceNote = "";
    let description = "";
    let subcategory = currentTheme.name;

    if (currentPeriod.id === "jinggang") {
        text = cleanMarkdown(cells[0]);
        place = cleanMarkdown(cells[1]);
        description = cleanMarkdown(cells[2]);
    } else {
        const suppliedSubcategory = cleanMarkdown(cells[0]);
        if (suppliedSubcategory) currentSubcategory = suppliedSubcategory;

        subcategory = currentSubcategory || currentTheme.name;
        text = cleanMarkdown(cells[1]);
        sourceNote = cleanMarkdown(cells[2]);
    }

    if (!text) continue;

    periodCounters[currentPeriod.id] += 1;
    currentTheme.count += 1;

    records.push({
        id: `${currentPeriod.id === "jinggang" ? "jg" : "cz"}-${String(periodCounters[currentPeriod.id]).padStart(4, "0")}`,
        periodId: currentPeriod.id,
        period: currentPeriod.name,
        themeId: currentTheme.id,
        theme: currentTheme.name,
        subcategory,
        text,
        place,
        source: sourceNote,
        description,
        sourceLine
    });
}

for (const period of periods) {
    period.count = records.filter((record) => record.periodId === period.id).length;
}

const archiveData = {
    meta: {
        total: records.length
    },
    periods,
    records
};

fs.writeFileSync(outputPath, `${JSON.stringify(archiveData)}\n`, "utf8");

console.log(
    `archive-data: ${archiveData.meta.total} records `
    + `(井冈山精神 ${periodCounters.jinggang}, 长征 ${periodCounters.longmarch})`
);
