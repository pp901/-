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

    function renderPeriodStats() {
        elements.periodStats.replaceChildren();

        state.data.periods.forEach((period, index) => {
            const button = createElement("button", "period-stat");
            button.type = "button";
            button.dataset.period = period.id;
            button.dataset.watermark = period.id === "jinggang" ? "井" : "征";
            button.setAttribute("aria-pressed", String(state.periodId === period.id));
            button.classList.toggle("is-active", state.periodId === period.id);

            const top = createElement("div", "period-stat-top");
            top.append(
                createElement("span", "", period.name),
                createElement("i", "", `${String(index + 1).padStart(2, "0")} / PERIOD`)
            );

            const count = createElement(
                "strong",
                "period-stat-number",
                numberFormatter.format(period.count)
            );

            const footer = createElement("div", "period-stat-footer");
            footer.append(
                createElement("span", "", `${period.themes.length} 个主题分类`),
                createElement("span", "", "→")
            );

            button.append(top, count, footer);
            elements.periodStats.appendChild(button);
        });
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

            period.themes.forEach((theme, themeIndex) => {
                const button = createElement("button", "theme-card");
                button.type = "button";
                button.dataset.period = period.id;
                button.dataset.theme = theme.id;
                button.setAttribute("aria-pressed", String(state.themeId === theme.id));
                button.classList.toggle("is-active", state.themeId === theme.id);

                button.append(
                    createElement("span", "theme-index", `${String(themeIndex + 1).padStart(2, "0")} / THEME`),
                    createElement("strong", "theme-name", theme.name)
                );

                if (theme.description) {
                    const description = createElement("p", "theme-description", theme.description);
                    description.title = theme.description;
                    button.appendChild(description);
                } else {
                    button.appendChild(createElement("span", "theme-description", ""));
                }

                button.appendChild(
                    createElement("span", "theme-count", numberFormatter.format(theme.count))
                );
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

        elements.dialogDetail.appendChild(
            createElement(
                "p",
                "record-detail-source",
                `数据定位：《${state.data.meta.sourceFile}》第 ${record.sourceLine} 行`
            )
        );
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

        elements.periodStats.addEventListener("click", (event) => {
            const button = event.target.closest("[data-period]");
            if (!button) return;
            setFilter(button.dataset.period, "all");
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
