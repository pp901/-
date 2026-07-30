(() => {
    "use strict";

    const sloganData = [
        {
            id: 1,
            text: "星星之火，可以燎原",
            period: "jinggang",
            periodLabel: "井冈山斗争",
            desc: "毛泽东同志在井冈山斗争时期提出的著名论断，揭示了中国革命必胜的信念，是“农村包围城市”道路的思想基石。"
        },
        {
            id: 2,
            text: "红军不怕远征难，万水千山只等闲",
            period: "changzheng",
            periodLabel: "长征途中",
            desc: "革命乐观主义与英雄主义的集中体现，展现了红军将士在极端困境中保持斗志不灭的精神风貌。"
        },
        {
            id: 3,
            text: "实事求是、敢闯新路",
            period: "jinggang",
            periodLabel: "井冈山斗争",
            desc: "井冈山精神的核心要义，为后续革命实践提供了方法论指引，是马克思主义中国化的生动体现。"
        },
        {
            id: 4,
            text: "雄关漫道真如铁，而今迈步从头越",
            period: "changzheng",
            periodLabel: "长征途中",
            desc: "遵义会议后毛泽东所作，体现了红军在经历挫折后重整旗鼓、坚定前行的钢铁意志。"
        },
        {
            id: 5,
            text: "支部建在连上",
            period: "jinggang",
            periodLabel: "井冈山斗争",
            desc: "三湾改编确立的党对军队绝对领导原则，为红军在长征中保持建制不散提供了根本政治保障。"
        },
        {
            id: 6,
            text: "更喜岷山千里雪，三军过后尽开颜",
            period: "changzheng",
            periodLabel: "长征途中",
            desc: "长征胜利在望时的豪迈情怀，展现了中国共产党人战胜一切困难的革命浪漫主义精神。"
        }
    ];

    const state = {
        filter: "all",
        query: "",
        saved: loadSavedSlogans()
    };

    const elements = {
        header: document.getElementById("siteHeader"),
        nav: document.getElementById("mainNav"),
        menuToggle: document.getElementById("menuToggle"),
        searchToggle: document.getElementById("searchToggle"),
        searchPanel: document.getElementById("searchPanel"),
        searchClose: document.getElementById("searchClose"),
        searchForm: document.getElementById("searchPanel"),
        searchInput: document.getElementById("siteSearch"),
        searchError: document.getElementById("searchError"),
        filterTabs: document.getElementById("filterTabs"),
        sloganGrid: document.getElementById("sloganGrid"),
        sloganEmpty: document.getElementById("sloganEmpty"),
        clearSearch: document.getElementById("clearSearch"),
        aiReader: document.getElementById("aiReader"),
        aiTab: document.getElementById("aiTab"),
        aiClose: document.getElementById("aiClose"),
        aiForm: document.getElementById("aiForm"),
        aiInput: document.getElementById("aiInput"),
        aiMessages: document.getElementById("aiMessages"),
        toast: document.getElementById("toast")
    };

    let toastTimer = null;

    function loadSavedSlogans() {
        try {
            const saved = JSON.parse(localStorage.getItem("xinhuo-saved-slogans") || "[]");
            return new Set(Array.isArray(saved) ? saved.map(Number) : []);
        } catch {
            return new Set();
        }
    }

    function persistSavedSlogans() {
        try {
            localStorage.setItem("xinhuo-saved-slogans", JSON.stringify([...state.saved]));
        } catch {
            showToast("当前浏览器未允许本地保存，收藏仅在本次浏览中有效。");
        }
    }

    function showToast(message) {
        if (!elements.toast) return;
        window.clearTimeout(toastTimer);
        elements.toast.textContent = message;
        elements.toast.hidden = false;
        toastTimer = window.setTimeout(() => {
            elements.toast.hidden = true;
        }, 2600);
    }

    function iconUse(id) {
        return `<svg aria-hidden="true"><use href="#${id}"></use></svg>`;
    }

    function normalized(value) {
        return value.trim().toLocaleLowerCase("zh-CN");
    }

    function getVisibleSlogans() {
        const query = normalized(state.query);

        return sloganData.filter((slogan) => {
            const matchesPeriod = state.filter === "all" || slogan.period === state.filter;
            const searchable = normalized(`${slogan.text} ${slogan.periodLabel} ${slogan.desc} 政治动员`);
            const matchesQuery = !query || searchable.includes(query);
            return matchesPeriod && matchesQuery;
        });
    }

    function renderSlogans() {
        if (!elements.sloganGrid || !elements.sloganEmpty) return;

        const visibleSlogans = getVisibleSlogans();
        elements.sloganGrid.innerHTML = visibleSlogans.map((slogan) => {
            const isSaved = state.saved.has(slogan.id);

            return `
                <article class="slogan-card" data-id="${slogan.id}">
                    <span class="slogan-index">${String(slogan.id).padStart(2, "0")}</span>
                    <div class="slogan-content">
                        <h3 class="slogan-text">“${slogan.text}”</h3>
                        <div class="slogan-meta">
                            <span class="slogan-period">${slogan.periodLabel}</span>
                            <span class="slogan-topic">政治动员</span>
                        </div>
                        <p class="slogan-desc">${slogan.desc}</p>
                        <div class="slogan-actions">
                            <button class="${isSaved ? "is-saved" : ""}" type="button"
                                    data-action="save" aria-pressed="${isSaved}">
                                ${iconUse("icon-bookmark")}
                                <span>${isSaved ? "已收藏" : "收藏"}</span>
                            </button>
                            <button type="button" data-action="share">
                                ${iconUse("icon-share")}
                                <span>分享</span>
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join("");

        const hasResults = visibleSlogans.length > 0;
        elements.sloganGrid.hidden = !hasResults;
        elements.sloganEmpty.hidden = hasResults;
    }

    function setFilter(filter) {
        state.filter = filter;
        document.querySelectorAll(".filter-tab").forEach((tab) => {
            const isActive = tab.dataset.filter === filter;
            tab.classList.toggle("is-active", isActive);
            tab.setAttribute("aria-pressed", String(isActive));
        });
        renderSlogans();
    }

    async function shareSlogan(slogan) {
        const shareData = {
            title: "信火追源 · 标语选读",
            text: `“${slogan.text}”——${slogan.periodLabel}`,
            url: `${window.location.origin}${window.location.pathname}#slogan`
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showToast("分享面板已打开。");
                return;
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                showToast("标语与链接已复制。");
                return;
            }

            showToast("当前浏览器不支持直接分享，请复制页面地址。");
        } catch (error) {
            if (error?.name !== "AbortError") {
                showToast("暂时无法分享，请稍后再试。");
            }
        }
    }

    elements.filterTabs?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter]");
        if (!button) return;
        setFilter(button.dataset.filter);
    });

    elements.sloganGrid?.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-action]");
        const card = event.target.closest(".slogan-card");
        if (!actionButton || !card) return;

        const id = Number(card.dataset.id);
        const slogan = sloganData.find((item) => item.id === id);
        if (!slogan) return;

        if (actionButton.dataset.action === "save") {
            if (state.saved.has(id)) {
                state.saved.delete(id);
                showToast("已从收藏中移除。");
            } else {
                state.saved.add(id);
                showToast("已收藏这条标语。");
            }
            persistSavedSlogans();
            renderSlogans();
        }

        if (actionButton.dataset.action === "share") {
            shareSlogan(slogan);
        }
    });

    function setMenu(open) {
        if (!elements.nav || !elements.menuToggle) return;
        elements.nav.classList.toggle("is-open", open);
        elements.menuToggle.setAttribute("aria-expanded", String(open));
        elements.menuToggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
        elements.menuToggle.querySelector("use")?.setAttribute("href", open ? "#icon-close" : "#icon-menu");
        document.body.classList.toggle("nav-open", open);
    }

    function setSearch(open) {
        if (!elements.searchPanel || !elements.searchToggle) return;
        elements.searchPanel.hidden = !open;
        elements.searchToggle.setAttribute("aria-expanded", String(open));
        elements.searchToggle.setAttribute("aria-label", open ? "关闭站内检索" : "打开站内检索");
        if (open) {
            setMenu(false);
            window.requestAnimationFrame(() => elements.searchInput?.focus());
        }
    }

    elements.menuToggle?.addEventListener("click", () => {
        const isOpen = elements.menuToggle.getAttribute("aria-expanded") === "true";
        setSearch(false);
        setMenu(!isOpen);
    });

    elements.nav?.querySelectorAll("a, button").forEach((item) => {
        item.addEventListener("click", () => setMenu(false));
    });

    elements.searchToggle?.addEventListener("click", () => {
        const isOpen = elements.searchToggle.getAttribute("aria-expanded") === "true";
        setSearch(!isOpen);
    });

    elements.searchClose?.addEventListener("click", () => setSearch(false));

    elements.searchForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = elements.searchInput?.value.trim() || "";

        if (!query) {
            elements.searchError.textContent = "请输入要检索的标语或关键词。";
            elements.searchError.hidden = false;
            elements.searchInput?.focus();
            return;
        }

        elements.searchError.hidden = true;
        state.query = query;
        setFilter("all");
        setSearch(false);
        document.getElementById("slogan")?.scrollIntoView({ behavior: "smooth", block: "start" });
        showToast(`已显示与“${query}”相关的首页标语。`);
    });

    elements.searchInput?.addEventListener("input", () => {
        if (elements.searchInput.value.trim()) {
            elements.searchError.hidden = true;
        }
    });

    elements.clearSearch?.addEventListener("click", () => {
        state.query = "";
        if (elements.searchInput) elements.searchInput.value = "";
        setFilter("all");
        showToast("已清除检索条件。");
    });

    function setAiReader(open) {
        if (!elements.aiReader || !elements.aiTab) return;
        elements.aiReader.classList.toggle("is-open", open);
        elements.aiReader.setAttribute("aria-hidden", String(!open));
        elements.aiTab.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("ai-open", open && window.matchMedia("(max-width: 680px)").matches);

        if (open) {
            setMenu(false);
            setSearch(false);
            window.requestAnimationFrame(() => elements.aiInput?.focus());
        }
    }

    function chooseAiReply(question) {
        const prompt = normalized(question);

        if (prompt.includes("星星之火") || prompt.includes("燎原")) {
            return {
                text: "这句话把处于局部、弱小状态的革命力量理解为能够持续扩展的“火种”。阅读时可重点关注它如何回应当时对革命前途的疑问，并将信念表达转化为继续组织群众的行动判断。",
                linkText: "关联档案：星星之火，可以燎原"
            };
        }

        if (prompt.includes("支部") || prompt.includes("连上")) {
            return {
                text: "“支部建在连上”首先是一项组织原则。它使政治动员不只停留在口号层面，而是落实到基层组织、日常教育与行动纪律之中，这也是队伍在长征艰难条件下保持凝聚力的重要线索。",
                linkText: "关联档案：支部建在连上"
            };
        }

        if (prompt.includes("比较") || prompt.includes("两个时期") || prompt.includes("长征")) {
            return {
                text: "井冈山时期更突出根据地创建、土地政策与军民关系，长征时期则更强调突破困境、统一意志与沿途群众工作。两者的连续性在于：都以通俗语言解释政治目标，并依靠基层组织把表达转化为行动。",
                linkText: "查看：井冈山与长征时期标语选读"
            };
        }

        if (prompt.includes("关联") || prompt.includes("推荐")) {
            return {
                text: "可将“支部建在连上”“实事求是、敢闯新路”与长征时期体现纪律、信念和革命乐观主义的标语并读。建议同时核对年代、地点、传播对象和史料来源。",
                linkText: "打开首页标语选读"
            };
        }

        return {
            text: "可以先把问题拆成四项：标语面向谁、使用什么语言形式、希望促成何种行动、处于怎样的历史语境。当前回答是辅助批注，进一步研究还需回到原始史料与专题成果。",
            linkText: "从标语选读开始核对"
        };
    }

    function appendAiMessage(type, text, linkText = "") {
        if (!elements.aiMessages) return;
        const article = document.createElement("article");
        article.className = `message message-${type}`;

        const label = document.createElement("span");
        label.textContent = type === "user" ? "你的问题" : `共读批注 ${String(elements.aiMessages.children.length + 1).padStart(2, "0")}`;

        const paragraph = document.createElement("p");
        paragraph.textContent = text;

        article.append(label, paragraph);

        if (linkText) {
            const link = document.createElement("a");
            link.href = "#slogan";
            link.textContent = linkText;
            link.addEventListener("click", () => setAiReader(false));
            article.appendChild(link);
        }

        elements.aiMessages.appendChild(article);
        elements.aiMessages.scrollTop = elements.aiMessages.scrollHeight;
    }

    function submitAiQuestion(question) {
        const cleanQuestion = question.trim();
        if (!cleanQuestion) return;

        appendAiMessage("user", cleanQuestion);
        const reply = chooseAiReply(cleanQuestion);
        appendAiMessage("assistant", reply.text, reply.linkText);

        if (elements.aiInput) elements.aiInput.value = "";
    }

    elements.aiTab?.addEventListener("click", () => {
        const isOpen = elements.aiTab.getAttribute("aria-expanded") === "true";
        setAiReader(!isOpen);
    });

    elements.aiClose?.addEventListener("click", () => setAiReader(false));

    document.querySelectorAll("[data-open-ai]").forEach((trigger) => {
        trigger.addEventListener("click", () => setAiReader(true));
    });

    document.querySelectorAll("[data-prompt]").forEach((button) => {
        button.addEventListener("click", () => {
            setAiReader(true);
            submitAiQuestion(button.dataset.prompt || "");
        });
    });

    elements.aiForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        submitAiQuestion(elements.aiInput?.value || "");
    });

    document.querySelectorAll("[data-open-archive]").forEach((trigger) => {
        trigger.addEventListener("click", () => {
            setAiReader(false);
            setSearch(false);
            setMenu(false);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        setMenu(false);
        setSearch(false);
        setAiReader(false);
    });

    function initializeHeaderState() {
        if (!elements.header) return;
        const hero = document.getElementById("hero");
        if (!hero || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(([entry]) => {
            elements.header.classList.toggle("is-scrolled", entry.intersectionRatio < 0.92);
        }, { threshold: [0.92] });

        observer.observe(hero);
    }

    function initializeNavHighlight() {
        if (!("IntersectionObserver" in window)) return;

        const sections = ["hero", "slogan", "footprint", "recommendations", "experience"]
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visible) return;
            navLinks.forEach((link) => {
                link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
            });
        }, {
            rootMargin: "-22% 0px -60% 0px",
            threshold: [0, 0.2, 0.55]
        });

        sections.forEach((section) => observer.observe(section));
    }

    function initializeReveals() {
        const revealItems = document.querySelectorAll(".reveal");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion || !("IntersectionObserver" in window)) {
            revealItems.forEach((item) => item.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: "0px 0px -8% 0px",
            threshold: 0.08
        });

        revealItems.forEach((item) => observer.observe(item));
    }

    renderSlogans();
    initializeHeaderState();
    initializeNavHighlight();
    initializeReveals();
})();
