(() => {
    "use strict";

    const DATA_URL = "assets/archive-data.json";
    const PAGE_SIZE = 20;

    const state = {
        data: null,
        query: "",
        periodId: "all",
        themeId: "all",
        visibleLimitJG: PAGE_SIZE,
        visibleLimitCZ: PAGE_SIZE,
        currentRecordId: null,
        searchTimer: null
    };

    const elements = {
        searchForm: document.getElementById("archiveSearchForm"),
        searchInput: document.getElementById("archiveSearchInput"),
        searchClear: document.getElementById("archiveSearchClear"),
        searchStatus: document.getElementById("archiveSearchStatus"),
        archiveComposition: document.getElementById("archiveComposition"),
        periodStats: document.getElementById("periodStats"),
        themeGroups: document.getElementById("themeGroups"),
        activeFilter: document.getElementById("activeArchiveFilter"),
        recordListJG: document.getElementById("archiveRecordListJG"),
        recordListCZ: document.getElementById("archiveRecordListCZ"),
        empty: document.getElementById("archiveEmpty"),
        loadMore: document.getElementById("archiveLoadMore"),
        loadMoreWrap: document.getElementById("archiveLoadMoreWrap"),
        resetFilter: document.getElementById("resetArchiveFilter"),
        catalog: document.getElementById("catalog"),
        dialog: document.getElementById("archiveRecordDialog"),
        dialogIndex: document.getElementById("recordDialogIndex"),
        dialogBreadcrumb: document.getElementById("recordDialogBreadcrumb"),
        dialogDetail: document.getElementById("archiveRecordDetail"),
        dialogClose: document.getElementById("archiveRecordClose"),
        previousRecord: document.getElementById("previousRecord"),
        nextRecord: document.getElementById("nextRecord")
    };

    const numberFormatter = new Intl.NumberFormat("zh-CN");

    function normalize(value) {
        return String(value || "")
            .normalize("NFKC")
            .toLocaleLowerCase("zh-CN")
            .replace(/\s+/g, " ")
            .trim();
    }

    function createElement(tag, className = "", text = "") {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    }

    function getPeriod(periodId) {
        return state.data?.periods.find((period) => period.id === periodId) || null;
    }

    function getTheme(themeId) {
        return state.data?.periods
            .flatMap((period) => period.themes)
            .find((theme) => theme.id === themeId) || null;
    }

    function getRecord(recordId) {
        return state.data?.records.find((record) => record.id === recordId) || null;
    }

    function getFilteredRecords() {
        if (!state.data) return [];

        const terms = normalize(state.query).split(" ").filter(Boolean);

        return state.data.records.filter((record) => {
            if (state.periodId !== "all" && record.periodId !== state.periodId) return false;
            if (state.themeId !== "all" && record.themeId !== state.themeId) return false;
            if (!terms.length) return true;

            const searchable = normalize([
                record.text,
                record.period,
                record.theme,
                record.subcategory,
                record.place,
                record.source,
                record.description
            ].join(" "));

            return terms.every((term) => searchable.includes(term));
        });
    }

    function getRecordsByPeriod(periodId) {
        return getFilteredRecords().filter((record) => record.periodId === periodId);
    }

    function getPeriodMetrics(period) {
        const records = state.data.records.filter((record) => record.periodId === period.id);
        const subcategories = new Set(
            records.map((record) => record.subcategory).filter(Boolean)
        );
        const topTheme = [...period.themes].sort((a, b) => b.count - a.count)[0];
        const traceCount = records.filter((record) => record.place || record.source).length;

        return {
            records,
            subcategoryCount: subcategories.size,
            topTheme,
            traceCount,
            share: (period.count / state.data.meta.total) * 100
        };
    }

    function renderComposition() {
        elements.archiveComposition.replaceChildren();

        const heading = createElement("div", "composition-heading");
        const totalThemes = state.data.periods.reduce(
            (sum, period) => sum + period.themes.length,
            0
        );
        const totalSubcategories = new Set(
            state.data.records
                .map((record) => `${record.periodId}:${record.subcategory}`)
                .filter((value) => !value.endsWith(":"))
        ).size;

        heading.append(
            createElement("strong", "", "档案构成"),
            createElement("span", "", `${totalThemes} 条主题线索 · ${totalSubcategories} 个细分类目`)
        );

        const track = createElement("div", "composition-track");
        state.data.periods.forEach((period) => {
            const metrics = getPeriodMetrics(period);
            const button = createElement("button", `composition-segment is-${period.id}`);
            button.type = "button";
            button.dataset.period = period.id;
            button.style.setProperty("--segment-share", `${metrics.share}%`);
            button.setAttribute(
                "aria-label",
                `查看${period.name}的 ${numberFormatter.format(period.count)} 条标语`
            );
            button.append(
                createElement("span", "", period.name),
                createElement("strong", "", `${metrics.share.toFixed(1)}%`)
            );
            track.appendChild(button);
        });

        elements.archiveComposition.append(heading, track);
    }

    function renderPeriodStats() {
        elements.periodStats.replaceChildren();

        state.data.periods.forEach((period, index) => {
            const metrics = getPeriodMetrics(period);
            const article = createElement("article", `period-stat is-${period.id}`);
            article.dataset.watermark = period.id === "jinggang" ? "井" : "征";

            const top = createElement("div", "period-stat-top");
            top.append(
                createElement("span", "", period.name),
                createElement("i", "", `${String(index + 1).padStart(2, "0")} / PERIOD`)
            );

            const headline = createElement("div", "period-stat-headline");
            const count = createElement("div", "period-stat-number");
            count.append(
                createElement("strong", "", numberFormatter.format(period.count)),
                createElement("span", "", "条标语")
            );

            const share = createElement("div", "period-stat-share");
            share.append(
                createElement("strong", "", `${metrics.share.toFixed(1)}%`),
                createElement("span", "", "档案占比")
            );
            headline.append(count, share);

            const insights = createElement("dl", "period-insights");
            [
                ["主题线索", `${period.themes.length} 项`],
                ["细分类目", `${metrics.subcategoryCount} 项`],
                ["地点 / 出处线索", `${numberFormatter.format(metrics.traceCount)} 条`]
            ].forEach(([label, value]) => {
                const item = createElement("div", "period-insight");
                item.append(
                    createElement("dt", "", label),
                    createElement("dd", "", value)
                );
                insights.appendChild(item);
            });

            const distribution = createElement("div", "period-distribution");
            const distributionHeading = createElement("div", "distribution-heading");
            distributionHeading.append(
                createElement("span", "", "主题分布"),
                createElement(
                    "strong",
                    "",
                    `最大主题：${metrics.topTheme.name} ${numberFormatter.format(metrics.topTheme.count)} 条`
                )
            );
            distribution.appendChild(distributionHeading);

            period.themes.forEach((theme) => {
                const row = createElement("button", "distribution-row");
                row.type = "button";
                row.dataset.period = period.id;
                row.dataset.theme = theme.id;
                row.setAttribute("aria-label", `查看${theme.name}主题档案`);

                const label = createElement("span", "distribution-label");
                label.append(
                    createElement("b", "", theme.name),
                    createElement("i", "", numberFormatter.format(theme.count))
                );

                const meter = createElement("span", "distribution-meter");
                const fill = createElement("span", "distribution-fill");
                fill.style.setProperty("--theme-share", `${(theme.count / period.count) * 100}%`);
                meter.appendChild(fill);

                row.append(label, meter);
                distribution.appendChild(row);
            });

            const footer = createElement("button", "period-stat-footer", `查看${period.name}全部标语`);
            footer.type = "button";
            footer.dataset.period = period.id;
            footer.appendChild(createElement("span", "", "→"));

            article.append(top, headline, insights, distribution, footer);
            elements.periodStats.appendChild(article);
        });
    }

    function getThemeSample(themeId) {
        const records = state.data.records.filter((record) => record.themeId === themeId);
        const candidates = records.filter(
            (record) => record.text.length >= 8 && record.text.length <= 48
        );
        const pool = candidates.length ? candidates : records;

        return [...pool].sort(
            (a, b) => Math.abs(a.text.length - 24) - Math.abs(b.text.length - 24)
        )[0] || null;
    }

    function renderThemeGroups() {
        elements.themeGroups.replaceChildren();

        state.data.periods.forEach((period, periodIndex) => {
            const section = createElement("section", "theme-group");
            const header = createElement("header", "theme-group-header");
            header.append(
                createElement("span", "", `${String(periodIndex + 1).padStart(2, "0")} / ${period.id.toUpperCase()}`),
                createElement("h3", "", period.name),
                createElement("p", "", `${numberFormatter.format(period.count)} 条记录 · ${period.themes.length} 个主题`)
            );

            const grid = createElement("div", "theme-card-grid");
            const spans = period.themes.length === 7
                ? [7, 5, 4, 4, 4, 5, 7]
                : [7, 5, 4, 4, 4];

            period.themes.forEach((theme, themeIndex) => {
                const button = createElement("button", "theme-card");
                button.type = "button";
                button.dataset.period = period.id;
                button.dataset.theme = theme.id;
                button.dataset.symbol = theme.name.slice(0, 1);
                button.setAttribute("aria-pressed", String(state.themeId === theme.id));
                button.classList.toggle("is-active", state.themeId === theme.id);
                button.classList.add(`theme-card--span-${spans[themeIndex]}`);

                const top = createElement("span", "theme-card-top");
                top.append(
                    createElement("span", "theme-index", `线索 ${String(themeIndex + 1).padStart(2, "0")}`),
                    createElement("span", "theme-symbol", theme.name.slice(0, 1))
                );

                const heading = createElement("span", "theme-card-heading");
                heading.append(
                    createElement("strong", "theme-name", theme.name),
                    createElement(
                        "span",
                        "theme-share",
                        `${((theme.count / period.count) * 100).toFixed(1)}% / 本时期`
                    )
                );

                const sample = getThemeSample(theme.id);
                const clue = createElement(
                    "span",
                    "theme-clue",
                    sample ? `“${sample.text}”` : ""
                );

                const footer = createElement("span", "theme-card-footer");
                const count = createElement("span", "theme-count");
                count.append(
                    createElement("strong", "", numberFormatter.format(theme.count)),
                    createElement("i", "", "条标语")
                );
                footer.append(
                    count,
                    createElement("span", "theme-enter", "进入主题档案 ↗")
                );

                const meter = createElement("span", "theme-card-meter");
                const fill = createElement("span", "");
                fill.style.setProperty("--theme-card-share", `${(theme.count / period.count) * 100}%`);
                meter.appendChild(fill);

                button.append(top, heading, clue, footer, meter);
                grid.appendChild(button);
            });

            section.append(header, grid);
            elements.themeGroups.appendChild(section);
        });
    }

    function createRecordRow(record) {
        const button = createElement("button", "record-row");
        button.type = "button";
        button.dataset.record = record.id;
        button.setAttribute("aria-label", `查看标语详情：${record.text}`);

        const code = createElement("span", "record-code", record.id.toUpperCase());
        const main = createElement("span", "record-main");
        main.appendChild(createElement("h3", "", record.text));

        const primaryNote = record.place || record.source;
        if (primaryNote) {
            main.appendChild(
                createElement(
                    "p",
                    "",
                    `${record.place ? "保存地" : "出处"}：${primaryNote}`
                )
            );
        }

        button.append(
            code,
            main,
            createElement("span", "record-arrow", "↗")
        );

        return button;
    }

    function renderColumn(container, records, limitKey) {
        container.replaceChildren();
        const limit = state[limitKey];
        const visible = records.slice(0, limit);
        visible.forEach((record) => container.appendChild(createRecordRow(record)));
        return records.length > limit;
    }

    function updateActiveState() {
        elements.periodStats.querySelectorAll("[data-period]").forEach((button) => {
            const active = state.periodId === button.dataset.period;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        elements.themeGroups.querySelectorAll("[data-theme]").forEach((button) => {
            const active = state.themeId === button.dataset.theme;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    function updateFilterSummary(jgRecords, czRecords) {
        const period = getPeriod(state.periodId);
        const theme = getTheme(state.themeId);
        const total = jgRecords.length + czRecords.length;
        const parts = [];

        if (period) parts.push(period.name);
        if (theme) parts.push(theme.name);
        if (state.query) parts.push(`关键词"${state.query}"`);

        elements.activeFilter.replaceChildren();
        elements.activeFilter.appendChild(
            createElement("span", "", parts.length ? "当前范围" : "全部档案")
        );

        if (parts.length) {
            elements.activeFilter.appendChild(
                createElement("strong", "", parts.join(" / "))
            );
        }

        elements.activeFilter.appendChild(
            createElement("span", "", `共 ${numberFormatter.format(total)} 条`)
        );

        elements.resetFilter.hidden = !parts.length;
        elements.searchClear.hidden = !state.query;
        elements.searchStatus.textContent = state.query
            ? `找到 ${numberFormatter.format(total)} 条匹配记录`
            : `共收录 ${numberFormatter.format(state.data.meta.total)} 条标语记录`;
    }

    function renderCatalog() {
        const jgRecords = getRecordsByPeriod("jinggang");
        const czRecords = getRecordsByPeriod("longmarch");

        const hasMoreJG = renderColumn(elements.recordListJG, jgRecords, "visibleLimitJG");
        const hasMoreCZ = renderColumn(elements.recordListCZ, czRecords, "visibleLimitCZ");

        const hasRecords = jgRecords.length > 0 || czRecords.length > 0;
        elements.empty.hidden = hasRecords;
        elements.loadMore.hidden = !(hasMoreJG || hasMoreCZ);

        if (!elements.loadMore.hidden) {
            const remainingJG = Math.max(0, jgRecords.length - state.visibleLimitJG);
            const remainingCZ = Math.max(0, czRecords.length - state.visibleLimitCZ);
            const remaining = remainingJG + remainingCZ;
            elements.loadMore.firstChild.textContent = `继续加载（余 ${numberFormatter.format(remaining)} 条）`;
        }

        updateFilterSummary(jgRecords, czRecords);
        updateActiveState();
        updateDialogNavigation();
    }

    function setFilter(periodId = "all", themeId = "all", shouldScroll = true) {
        state.periodId = periodId;
        state.themeId = themeId;
        state.visibleLimitJG = PAGE_SIZE;
        state.visibleLimitCZ = PAGE_SIZE;
        renderCatalog();

        if (shouldScroll) {
            elements.catalog.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function setQuery(value) {
        state.query = value.trim();
        state.visibleLimitJG = PAGE_SIZE;
        state.visibleLimitCZ = PAGE_SIZE;
        renderCatalog();
    }

    function resetArchive() {
        state.query = "";
        state.periodId = "all";
        state.themeId = "all";
        state.visibleLimitJG = PAGE_SIZE;
        state.visibleLimitCZ = PAGE_SIZE;
        elements.searchInput.value = "";
        renderCatalog();
    }

    function addDetailField(list, label, value) {
        if (!value) return;

        const wrapper = createElement("div", "record-detail-field");
        wrapper.append(
            createElement("dt", "", label),
            createElement("dd", "", value)
        );
        list.appendChild(wrapper);
    }

    function renderRecordDetail(record) {
        elements.dialogIndex.textContent = `ARCHIVE RECORD / ${record.id.toUpperCase()}`;
        elements.dialogBreadcrumb.textContent = `${record.period} / ${record.theme}`;
        elements.dialogDetail.replaceChildren();

        const title = createElement("h2", "", record.text);
        title.id = "recordDialogTitle";

        const classification = createElement("div", "record-classification");
        [record.period, record.theme, record.subcategory]
            .filter((value, index, values) => value && values.indexOf(value) === index)
            .forEach((value) => classification.appendChild(createElement("span", "", value)));

        const fields = createElement("dl", "record-detail-fields");
        addDetailField(fields, "保存地", record.place);
        addDetailField(fields, "备注 / 出处", record.source);
        addDetailField(fields, "标语说明", record.description);

        elements.dialogDetail.append(title, classification);
        if (fields.children.length) elements.dialogDetail.appendChild(fields);

    }

    function getDialogRecordSet() {
        return state.data?.records || [];
    }

    function updateDialogNavigation() {
        if (!state.currentRecordId || !state.data) return;

        const records = getDialogRecordSet();
        const index = records.findIndex((record) => record.id === state.currentRecordId);
        elements.previousRecord.disabled = index <= 0;
        elements.nextRecord.disabled = index < 0 || index >= records.length - 1;
        elements.previousRecord.dataset.record = index > 0 ? records[index - 1].id : "";
        elements.nextRecord.dataset.record = index >= 0 && index < records.length - 1
            ? records[index + 1].id
            : "";
    }

    function openRecord(recordId, updateUrl = true) {
        const record = getRecord(recordId);
        if (!record) return;

        state.currentRecordId = record.id;
        renderRecordDetail(record);
        updateDialogNavigation();

        if (!elements.dialog.open) {
            elements.dialog.showModal();
            document.body.classList.add("dialog-open");
        }

        if (updateUrl) {
            const hash = `#slogan-${record.id}`;
            if (window.location.hash !== hash) {
                window.history.pushState({ recordId: record.id }, "", hash);
            }
        }

        window.requestAnimationFrame(() => elements.dialogClose.focus());
    }

    function closeRecord(updateUrl = true) {
        if (elements.dialog.open) elements.dialog.close();
        document.body.classList.remove("dialog-open");
        state.currentRecordId = null;

        if (updateUrl && window.location.hash.startsWith("#slogan-")) {
            window.history.replaceState(null, "", "#catalog");
        }
    }

    function routeFromHash() {
        if (!state.data) return;

        const match = window.location.hash.match(/^#slogan-(jg-\d{4}|cz-\d{4})$/);
        if (match) {
            openRecord(match[1], false);
        } else if (elements.dialog.open) {
            closeRecord(false);
        }
    }

    function openAdjacentRecord(event) {
        const recordId = event.currentTarget.dataset.record;
        if (!recordId) return;

        const record = getRecord(recordId);
        if (!record) return;

        state.currentRecordId = record.id;
        renderRecordDetail(record);
        updateDialogNavigation();
        window.history.replaceState({ recordId: record.id }, "", `#slogan-${record.id}`);
        elements.dialogDetail.scrollTop = 0;
    }

    function bindEvents() {
        elements.searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            window.clearTimeout(state.searchTimer);
            setQuery(elements.searchInput.value);
            elements.catalog.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        elements.searchInput.addEventListener("input", () => {
            window.clearTimeout(state.searchTimer);
            state.searchTimer = window.setTimeout(() => {
                setQuery(elements.searchInput.value);
            }, 140);
        });

        elements.searchClear.addEventListener("click", () => {
            elements.searchInput.value = "";
            setQuery("");
            elements.searchInput.focus();
        });

        elements.archiveComposition.addEventListener("click", (event) => {
            const button = event.target.closest("[data-period]");
            if (!button) return;
            setFilter(button.dataset.period, "all");
        });

        elements.periodStats.addEventListener("click", (event) => {
            const themeButton = event.target.closest("[data-theme]");
            if (themeButton) {
                setFilter(themeButton.dataset.period, themeButton.dataset.theme);
                return;
            }

            const periodButton = event.target.closest("[data-period]");
            if (!periodButton) return;
            setFilter(periodButton.dataset.period, "all");
        });

        elements.themeGroups.addEventListener("click", (event) => {
            const button = event.target.closest("[data-theme]");
            if (!button) return;
            setFilter(button.dataset.period, button.dataset.theme);
        });

        elements.recordListJG.addEventListener("click", (event) => {
            const button = event.target.closest("[data-record]");
            if (!button) return;
            openRecord(button.dataset.record);
        });

        elements.recordListCZ.addEventListener("click", (event) => {
            const button = event.target.closest("[data-record]");
            if (!button) return;
            openRecord(button.dataset.record);
        });

        elements.loadMore.addEventListener("click", () => {
            state.visibleLimitJG += PAGE_SIZE;
            state.visibleLimitCZ += PAGE_SIZE;
            renderCatalog();
        });

        elements.resetFilter.addEventListener("click", resetArchive);
        elements.dialogClose.addEventListener("click", () => closeRecord());
        elements.previousRecord.addEventListener("click", openAdjacentRecord);
        elements.nextRecord.addEventListener("click", openAdjacentRecord);

        elements.dialog.addEventListener("cancel", (event) => {
            event.preventDefault();
            closeRecord();
        });

        elements.dialog.addEventListener("click", (event) => {
            if (event.target === elements.dialog) closeRecord();
        });

        window.addEventListener("popstate", routeFromHash);
        window.addEventListener("hashchange", routeFromHash);
    }

    async function initializeArchive() {
        bindEvents();

        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            if (!Array.isArray(data.records) || !Array.isArray(data.periods)) {
                throw new Error("invalid archive data");
            }

            state.data = data;
            renderComposition();
            renderPeriodStats();
            renderThemeGroups();
            renderCatalog();
            routeFromHash();
        } catch (error) {
            elements.periodStats.replaceChildren();
            elements.themeGroups.replaceChildren();
            elements.recordListJG.replaceChildren();
            elements.recordListCZ.replaceChildren();
            elements.searchStatus.textContent = "档案数据暂时无法读取";
            elements.empty.hidden = false;
            elements.empty.querySelector("strong").textContent = "档案数据加载失败";
            elements.empty.querySelector("p").textContent = "请刷新页面后重试。";
            console.error("Archive initialization failed:", error);
        }
    }

    initializeArchive();
})();
