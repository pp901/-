(() => {
    "use strict";

    const categories = [
        { id: "mobilization", name: "革命动员", count: 28, icon: "号", desc: "宣传革命思想，号召群众参加革命，激发革命热情。" },
        { id: "land", name: "土地革命", count: 22, icon: "田", desc: "宣传土地政策，发动群众开展土地革命，废除封建剥削。" },
        { id: "army", name: "军民关系", count: 18, icon: "民", desc: "宣传军民团结，强调军民鱼水情深，共同保卫根据地。" },
        { id: "party", name: "党的建设", count: 16, icon: "党", desc: "宣传党的领导与组织建设，巩固基层革命力量。" },
        { id: "education", name: "生产教育", count: 14, icon: "学", desc: "开展文化启蒙与生产教育，提升群众组织能力。" },
        { id: "memorial", name: "纪念宣传", count: 12, icon: "旗", desc: "纪念革命事件与人物，传递坚定的理想信念。" },
        { id: "mass", name: "群众工作", count: 16, icon: "众", desc: "发动、组织和服务群众，夯实革命根据地基础。" }
    ];

    const records = [
        {
            id: 1,
            text: "团结紧张，严肃活泼",
            category: "mobilization",
            period: "1928年春",
            year: "1928",
            place: "茨坪·红军医院旧址墙面",
            shortPlace: "茨坪",
            carrier: "墙体",
            condition: "较好",
            tags: ["革命动员", "群众宣传"],
            intro: "以简练有力的语言强调革命队伍应有的组织纪律与精神面貌，是根据地政治动员中兼具号召力和教育意义的表达。"
        },
        {
            id: 2,
            text: "工农兵联合起来，打倒土豪劣绅！",
            category: "land",
            period: "1928年夏",
            year: "1928",
            place: "龙市·会师旧址墙面",
            shortPlace: "龙市",
            carrier: "墙体",
            condition: "较好",
            tags: ["工农兵联合", "打土豪", "土地革命", "革命动员"],
            intro: "土地革命时期革命力量在井冈山地区广泛书写的动员口号之一，集中反映了工农联合、打倒封建势力、建立革命政权的政治诉求。"
        },
        {
            id: 3,
            text: "红军是工农的军队",
            category: "army",
            period: "1928年秋",
            year: "1928",
            place: "大井·红军造币厂旧址墙面",
            shortPlace: "大井",
            carrier: "墙体",
            condition: "较好",
            tags: ["军民关系", "红军宣传"],
            intro: "明确红军的人民属性，向群众说明革命军队的宗旨与立场，是建立军民互信的重要宣传标语。"
        },
        {
            id: 4,
            text: "跟着红军干革命",
            category: "mobilization",
            period: "1928年秋",
            year: "1928",
            place: "黄洋界·哨口工事墙面",
            shortPlace: "黄洋界",
            carrier: "墙体",
            condition: "残存",
            tags: ["革命动员", "群众工作"],
            intro: "以直接明快的语言号召群众支持和参加革命，体现早期根据地宣传工作的群众化表达。"
        },
        {
            id: 5,
            text: "打土豪，分田地",
            category: "land",
            period: "1928年夏",
            year: "1928",
            place: "龙市·龙江书院旧址墙面",
            shortPlace: "龙市",
            carrier: "墙体",
            condition: "较好",
            tags: ["土地革命", "群众动员"],
            intro: "高度概括土地革命的基本诉求，以群众易于理解和传播的方式说明革命行动目标。"
        },
        {
            id: 6,
            text: "没收一切土地，分配给工农",
            category: "land",
            period: "1928年夏",
            year: "1928",
            place: "柏露·红军驻地旧址墙面",
            shortPlace: "柏露",
            carrier: "墙体",
            condition: "一般",
            tags: ["土地革命", "分配政策"],
            intro: "围绕土地再分配政策开展的宣传表达，见证根据地土地革命的探索过程。"
        },
        {
            id: 7,
            text: "实行耕者有其田",
            category: "land",
            period: "1928年秋",
            year: "1928",
            place: "茅坪·八角楼旧址墙面",
            shortPlace: "茅坪",
            carrier: "墙体",
            condition: "较好",
            tags: ["土地革命", "土地政策"],
            intro: "直指农民最迫切的土地诉求，体现革命根据地争取群众支持的政策方向。"
        },
        {
            id: 8,
            text: "打倒土豪，实行分田",
            category: "land",
            period: "1928年秋",
            year: "1928",
            place: "宁冈·古城旧址墙面",
            shortPlace: "宁冈",
            carrier: "墙体",
            condition: "一般",
            tags: ["土地革命", "分田运动"],
            intro: "把革命对象和行动目标并置，具有鲜明、直接的群众动员特征。"
        },
        {
            id: 9,
            text: "军民团结如一人",
            category: "army",
            period: "1928年秋",
            year: "1928",
            place: "小井·红军医院旧址墙面",
            shortPlace: "小井",
            carrier: "墙体",
            condition: "较好",
            tags: ["军民关系", "军民团结"],
            intro: "强调红军与群众命运与共的关系，是井冈山根据地军民鱼水情的生动表达。"
        },
        {
            id: 10,
            text: "人民拥护红军，红军爱护人民",
            category: "army",
            period: "1928年秋",
            year: "1928",
            place: "茨坪·红军驻地旧址墙面",
            shortPlace: "茨坪",
            carrier: "墙体",
            condition: "较好",
            tags: ["军民关系", "群众纪律"],
            intro: "用对仗句式说明军民相互支持、相互爱护的原则，通俗且便于记忆。"
        },
        {
            id: 11,
            text: "帮助红军就是帮助自己",
            category: "army",
            period: "1928年冬",
            year: "1928",
            place: "新城·红军驻地旧址墙面",
            shortPlace: "新城",
            carrier: "墙体",
            condition: "残存",
            tags: ["军民关系", "群众动员"],
            intro: "把支持红军同群众切身利益相联系，提升宣传动员的现实感与说服力。"
        },
        {
            id: 12,
            text: "保护红军就是保护自己",
            category: "army",
            period: "1928年冬",
            year: "1928",
            place: "大陇·红军交通站旧址",
            shortPlace: "大陇",
            carrier: "墙体",
            condition: "一般",
            tags: ["军民关系", "根据地保卫"],
            intro: "强调军民共同利益与共同责任，引导群众参与革命根据地的守护。"
        },
        {
            id: 13,
            text: "支部建在连上",
            category: "party",
            period: "1927年秋",
            year: "1927",
            place: "三湾·改编旧址展陈",
            shortPlace: "三湾",
            carrier: "展板",
            condition: "完整",
            tags: ["党的建设", "组织建设"],
            intro: "三湾改编确立的重要组织原则，奠定党对军队绝对领导的组织基础。"
        },
        {
            id: 14,
            text: "党指挥枪",
            category: "party",
            period: "1928年春",
            year: "1928",
            place: "茅坪·红军旧址展陈",
            shortPlace: "茅坪",
            carrier: "木牌",
            condition: "完整",
            tags: ["党的建设", "政治建军"],
            intro: "以极凝练的语言表达党对人民军队的领导原则，是政治建军思想的重要概括。"
        },
        {
            id: 15,
            text: "一切行动听指挥",
            category: "party",
            period: "1928年春",
            year: "1928",
            place: "茨坪·红四军军部旧址",
            shortPlace: "茨坪",
            carrier: "墙体",
            condition: "较好",
            tags: ["党的建设", "组织纪律"],
            intro: "强调统一指挥和严明纪律，是提高革命队伍组织力、战斗力的重要要求。"
        },
        {
            id: 16,
            text: "扩大红军，保卫革命根据地",
            category: "mobilization",
            period: "1928年秋",
            year: "1928",
            place: "黄洋界·哨口旧址墙面",
            shortPlace: "黄洋界",
            carrier: "墙体",
            condition: "较好",
            tags: ["革命动员", "根据地保卫"],
            intro: "在根据地保卫斗争中号召群众参军参战，把扩大革命力量与守护根据地紧密联系。"
        },
        {
            id: 17,
            text: "建立工农民主政权",
            category: "party",
            period: "1928年春",
            year: "1928",
            place: "茅坪·湘赣边界旧址墙面",
            shortPlace: "茅坪",
            carrier: "墙体",
            condition: "一般",
            tags: ["党的建设", "红色政权"],
            intro: "宣传建立代表工农利益的新型政权，呈现根据地政权建设的政治目标。"
        },
        {
            id: 18,
            text: "读书识字，明白革命道理",
            category: "education",
            period: "1928年冬",
            year: "1928",
            place: "茨坪·工农兵政府旧址",
            shortPlace: "茨坪",
            carrier: "纸本",
            condition: "修复",
            tags: ["生产教育", "文化启蒙"],
            intro: "把扫盲教育同革命教育结合，体现根据地文化建设服务群众、服务革命的特点。"
        },
        {
            id: 19,
            text: "自己动手，丰衣足食",
            category: "education",
            period: "1929年初",
            year: "1929",
            place: "大井·生产合作旧址",
            shortPlace: "大井",
            carrier: "墙体",
            condition: "一般",
            tags: ["生产教育", "自力更生"],
            intro: "倡导自力更生与生产自救，反映根据地克服物资困难的实践智慧。"
        },
        {
            id: 20,
            text: "打倒帝国主义",
            category: "memorial",
            period: "1928年冬",
            year: "1928",
            place: "龙市·宣传栏旧址",
            shortPlace: "龙市",
            carrier: "木牌",
            condition: "修复",
            tags: ["纪念宣传", "革命目标"],
            intro: "表达反帝反封建的革命立场，把地方根据地斗争置于更广阔的民族解放图景中。"
        },
        {
            id: 21,
            text: "红色区域不断扩大",
            category: "mobilization",
            period: "1929年初",
            year: "1929",
            place: "大井·群众宣传墙面",
            shortPlace: "大井",
            carrier: "墙体",
            condition: "残存",
            tags: ["革命动员", "根据地建设"],
            intro: "以充满信心的表达鼓舞根据地军民，展现红色政权发展壮大的愿景。"
        },
        {
            id: 22,
            text: "农民协会万岁",
            category: "mass",
            period: "1927年秋",
            year: "1927",
            place: "茅坪·农民协会旧址",
            shortPlace: "茅坪",
            carrier: "墙体",
            condition: "一般",
            tags: ["群众工作", "农民协会"],
            intro: "肯定农民协会在组织群众、发动群众中的作用，体现革命力量对基层群众组织的重视。"
        },
        {
            id: 23,
            text: "贫苦农民联合起来",
            category: "mass",
            period: "1928年春",
            year: "1928",
            place: "柏露·农会旧址墙面",
            shortPlace: "柏露",
            carrier: "墙体",
            condition: "较好",
            tags: ["群众工作", "组织群众"],
            intro: "号召贫苦农民形成组织力量，是根据地群众路线的早期实践表达。"
        },
        {
            id: 24,
            text: "发扬井冈精神，建设新中国",
            category: "memorial",
            period: "1929年后",
            year: "1929",
            place: "多地·后续传播点",
            shortPlace: "多地",
            carrier: "墙体",
            condition: "修复",
            tags: ["纪念宣传", "精神传承"],
            intro: "后续传播中形成的纪念性表达，体现井冈山精神在不同时代语境中的延续。"
        }
    ];

    const timelineEvents = [
        {
            index: 1,
            period: "1927 秋",
            title: "上井冈山",
            place: "茨坪",
            summary: "革命队伍转战井冈山，开辟农村革命根据地。",
            tags: [["革命动员", 12], ["土地革命", 8], ["军民关系", 8]],
            records: [23, 22, 13]
        },
        {
            index: 2,
            period: "1928 春",
            title: "工农武装割据形成",
            place: "茅坪",
            summary: "加强政权建设与武装力量，工农武装割据局面初步形成。",
            tags: [["党的建设", 12], ["武装斗争", 10], ["群众工作", 8]],
            records: [14, 17, 15]
        },
        {
            index: 3,
            period: "1928 夏",
            title: "土地革命推进",
            place: "龙市",
            summary: "土地革命深入开展，苏区建设稳步推进，群众基础不断巩固。",
            tags: [["土地革命", 28], ["群众动员", 18], ["生产教育", 10]],
            records: [2, 5, 6]
        },
        {
            index: 4,
            period: "1928 秋",
            title: "黄洋界保卫战前后",
            place: "黄洋界",
            summary: "黄洋界保卫战胜利，苏区军民斗志高昂，标语成为战斗号角。",
            tags: [["军民关系", 20], ["武装斗争", 16], ["革命动员", 12]],
            records: [3, 4, 16]
        },
        {
            index: 5,
            period: "1929 初",
            title: "根据地经验扩展",
            place: "大井",
            summary: "井冈山经验向周边发展，红色政权得到巩固与扩展。",
            tags: [["根据地建设", 12], ["党的建设", 10], ["宣传工作", 8]],
            records: [19, 21, 20]
        },
        {
            index: 6,
            period: "影响与传承",
            title: "井冈山精神广泛传播",
            place: "多地",
            summary: "井冈山精神广泛传播，影响深远，成为革命精神的重要源泉。",
            tags: [["精神传承", 10], ["革命传统", 8], ["群众动员", 6]],
            records: [24, 1, 10]
        }
    ];

    const archiveApp = document.getElementById("archiveApp");
    const content = document.getElementById("archiveContent");
    const archiveNav = document.getElementById("archiveNav");
    const originalNavLinks = document.getElementById("navLinks");
    const isStandalonePage = document.body.dataset.archivePage === "true";

    if (!archiveApp || !content || !archiveNav) return;

    const state = {
        route: "home",
        detailId: 2,
        category: "all",
        search: "",
        period: "all",
        carrier: "all",
        timelineMode: "time",
        lastMainHash: "#hero"
    };

    const getCategory = (id) => categories.find(category => category.id === id) || categories[0];
    const getRecord = (id) => records.find(record => record.id === Number(id)) || records[1];
    const padId = (id) => String(id).padStart(5, "0");

    function footerMarkup() {
        return `
            <footer class="da-footer">
                <div class="da-footer-star">★</div>
                <p>传承红色记忆 · 赓续井冈精神</p>
                <small>标语数据与地点信息为栏目原型示例，后续可接入真实调研档案</small>
            </footer>
        `;
    }

    function recordCard(record, compact = false) {
        const category = getCategory(record.category);
        return `
            <button class="da-record-card${compact ? " is-compact" : ""}" type="button" data-record-id="${record.id}" aria-label="查看标语：${record.text}">
                <div class="da-record-photo">
                    <span class="da-record-badge">${category.name}</span>
                    <span class="da-record-slogan">${record.text}</span>
                </div>
                <div class="da-record-body">
                    <h3>${record.text}</h3>
                    <div class="da-record-meta">
                        <span>⌖ ${record.place}</span>
                        <span>◷ ${record.period}</span>
                    </div>
                </div>
                ${compact ? "" : `
                    <div class="da-record-footer">
                        <strong>查看档案</strong>
                        <span>☆ JGSSLG-${record.year}-${padId(record.id)}</span>
                    </div>
                `}
            </button>
        `;
    }

    function renderHome() {
        const latest = records.slice(0, 3);
        return `
            <section class="da-view" aria-labelledby="da-home-title">
                <div class="da-hero">
                    <div class="da-container">
                        <div class="da-hero-content">
                            <div class="da-kicker">井冈山革命根据地 · 数字人文专题</div>
                            <h1 class="da-hero-title" id="da-home-title">井冈山革命根据地<br>标语数字档案</h1>
                            <p class="da-hero-lead">本栏目致力于井冈山革命根据地历史标语的收集、整理与可视化呈现，让红色记忆在数字时代焕发新的生命力。</p>
                            <div class="da-quote">
                                星星之火，可以燎原。<br>工农兵联合起来，打倒土豪劣绅！
                                <span>—— 井冈山革命根据地标语</span>
                            </div>
                        </div>
                    </div>
                    <span class="da-scroll-cue" aria-hidden="true"></span>
                </div>
                <div class="da-home-body">
                    <div class="da-container">
                        <div class="da-stats" aria-label="档案统计">
                            <div class="da-stat"><span class="da-stat-icon">档</span><div class="da-stat-copy"><small>已收集标语</small><strong>126</strong><em>条</em></div></div>
                            <div class="da-stat"><span class="da-stat-icon">类</span><div class="da-stat-copy"><small>分类主题</small><strong>7</strong><em>个</em></div></div>
                            <div class="da-stat"><span class="da-stat-icon">迹</span><div class="da-stat-copy"><small>调研地点</small><strong>12</strong><em>处</em></div></div>
                            <div class="da-stat"><span class="da-stat-icon">图</span><div class="da-stat-copy"><small>实地照片</small><strong>430</strong><em>张</em></div></div>
                        </div>

                        <section class="da-content-block" aria-labelledby="da-category-title">
                            <div class="da-section-head">
                                <h2 class="da-section-title" id="da-category-title">分类浏览</h2>
                                <button class="da-more" type="button" data-da-route="categories">查看全部分类 ›</button>
                            </div>
                            <div class="da-category-cards">
                                ${categories.slice(0, 5).map((category, index) => `
                                    <button class="da-category-card" type="button" data-category-open="${category.id}"
                                        style="--card-pos:${67 + index * 7}%; --card-wash:${["rgba(148,18,19,.28)","rgba(137,89,35,.22)","rgba(33,42,38,.14)","rgba(112,55,18,.18)","rgba(61,72,47,.18)"][index]}">
                                        <span class="da-category-card-content">
                                            <span class="da-category-card-icon">${category.icon}</span>
                                            ${category.name}
                                            <small>${category.count} ARCHIVES</small>
                                        </span>
                                    </button>
                                `).join("")}
                            </div>
                        </section>

                        <section class="da-content-block" aria-labelledby="da-latest-title">
                            <div class="da-section-head">
                                <h2 class="da-section-title" id="da-latest-title">最新标语档案</h2>
                                <button class="da-more" type="button" data-da-route="categories">查看全部 ›</button>
                            </div>
                            <div class="da-record-grid">${latest.map(record => recordCard(record)).join("")}</div>
                        </section>
                    </div>
                    ${footerMarkup()}
                </div>
            </section>
        `;
    }

    function innerHero(title, lead, id) {
        return `
            <section class="da-page-hero" aria-labelledby="${id}">
                <div class="da-container da-page-hero-inner">
                    <h1 id="${id}">${title}</h1>
                    <p>${lead}</p>
                </div>
            </section>
        `;
    }

    function renderCategories() {
        return `
            <section class="da-view">
                ${innerHero("标语分类档案", "按主题分类浏览井冈山革命根据地的标语，了解不同时期、不同领域的宣传内容与历史背景。", "da-category-page-title")}
                <div class="da-page-main">
                    <div class="da-container">
                        <section class="da-distribution" aria-label="各类别档案量分布">
                            <div class="da-total">
                                <span class="da-stat-icon">档</span>
                                <div><small>全部标语总数</small><strong>126</strong> 条</div>
                            </div>
                            <div class="da-dist-bars">
                                ${categories.map(category => `
                                    <div class="da-dist-item">
                                        <span>${category.name}</span>
                                        <strong>${category.count}</strong>
                                        <div class="da-dist-track"><i style="--w:${Math.round(category.count / 28 * 100)}%"></i></div>
                                    </div>
                                `).join("")}
                            </div>
                            <div class="da-search-result"><small>当前检索结果</small><strong id="daSearchCount">${records.length}</strong> 条</div>
                        </section>

                        <div class="da-catalog-layout">
                            <aside class="da-sidebar" aria-label="主题分类筛选">
                                <button class="da-side-filter ${state.category === "all" ? "is-active" : ""}" type="button" data-category-filter="all">
                                    <span>全</span>全部<small>126</small>
                                </button>
                                ${categories.map(category => `
                                    <button class="da-side-filter ${state.category === category.id ? "is-active" : ""}" type="button" data-category-filter="${category.id}">
                                        <span>${category.icon}</span>${category.name}<small>${category.count}</small>
                                    </button>
                                `).join("")}
                                <div class="da-sidebar-note">
                                    <strong>☆ 关于分类</strong>
                                    标语按主题内容进行人工分类，部分标语可归入多个主题，此处按最主要语义归档。
                                </div>
                            </aside>

                            <section class="da-catalog" aria-label="标语检索结果">
                                <div class="da-filterbar">
                                    <label class="da-searchbox">
                                        <input id="daSearchInput" type="search" value="${state.search}" placeholder="搜索标语关键词，如：团结、打倒土豪……" aria-label="搜索标语关键词">
                                    </label>
                                    <select id="daPeriodFilter" aria-label="筛选时间">
                                        <option value="all"${state.period === "all" ? " selected" : ""}>时间范围</option>
                                        <option value="1927"${state.period === "1927" ? " selected" : ""}>1927年</option>
                                        <option value="1928"${state.period === "1928" ? " selected" : ""}>1928年</option>
                                        <option value="1929"${state.period === "1929" ? " selected" : ""}>1929年及以后</option>
                                    </select>
                                    <select id="daCarrierFilter" aria-label="筛选载体">
                                        <option value="all"${state.carrier === "all" ? " selected" : ""}>载体类型</option>
                                        <option value="墙体"${state.carrier === "墙体" ? " selected" : ""}>墙体</option>
                                        <option value="木牌"${state.carrier === "木牌" ? " selected" : ""}>木牌</option>
                                        <option value="纸本"${state.carrier === "纸本" ? " selected" : ""}>纸本</option>
                                        <option value="展板"${state.carrier === "展板" ? " selected" : ""}>展板</option>
                                    </select>
                                    <button class="da-reset" type="button" data-reset-filters>重置</button>
                                </div>
                                <div class="da-results-copy" id="daResultsCopy"></div>
                                <div id="daCatalogResults"></div>
                            </section>
                        </div>
                    </div>
                </div>
                ${footerMarkup()}
            </section>
        `;
    }

    function filteredRecords() {
        const keyword = state.search.trim().toLowerCase();
        return records.filter(record => {
            const matchesCategory = state.category === "all" || record.category === state.category;
            const matchesPeriod = state.period === "all" || (state.period === "1929" ? Number(record.year) >= 1929 : record.year === state.period);
            const matchesCarrier = state.carrier === "all" || record.carrier === state.carrier;
            const haystack = [record.text, record.place, record.period, record.intro, ...record.tags].join(" ").toLowerCase();
            const matchesSearch = !keyword || haystack.includes(keyword);
            return matchesCategory && matchesPeriod && matchesCarrier && matchesSearch;
        });
    }

    function renderCatalogResults() {
        const target = document.getElementById("daCatalogResults");
        if (!target) return;

        const result = filteredRecords();
        const count = document.getElementById("daSearchCount");
        const copy = document.getElementById("daResultsCopy");
        if (count) count.textContent = result.length;
        if (copy) copy.innerHTML = `共 <strong style="color:var(--da-red)">${result.length}</strong> 条示例档案`;

        document.querySelectorAll("[data-category-filter]").forEach(button => {
            button.classList.toggle("is-active", button.dataset.categoryFilter === state.category);
        });

        if (!result.length) {
            target.innerHTML = `<div class="da-empty"><div><strong>未找到匹配档案</strong>请尝试更换关键词或重置筛选条件</div></div>`;
            return;
        }

        const visibleCategories = state.category === "all" ? categories : categories.filter(category => category.id === state.category);
        target.innerHTML = visibleCategories.map(category => {
            const categoryRecords = result.filter(record => record.category === category.id);
            if (!categoryRecords.length) return "";
            return `
                <section class="da-group">
                    <div class="da-group-head">
                        <h2>${category.name} <small>（${categoryRecords.length} 条示例）</small></h2>
                        <p>${category.desc}</p>
                    </div>
                    <div class="da-record-grid">${categoryRecords.map(record => recordCard(record, true)).join("")}</div>
                </section>
            `;
        }).join("");
    }

    function renderDetail() {
        const record = getRecord(state.detailId);
        const category = getCategory(record.category);
        const related = records.filter(item => item.id !== record.id && item.category === record.category).slice(0, 3);
        while (related.length < 3) {
            const fallback = records.find(item => item.id !== record.id && !related.some(relatedItem => relatedItem.id === item.id));
            if (!fallback) break;
            related.push(fallback);
        }
        return `
            <section class="da-view" aria-labelledby="da-detail-title">
                <div class="da-detail-hero">
                    <div class="da-container da-detail-hero-inner">
                        <div class="da-breadcrumb">
                            <button type="button" data-da-route="home">首页</button><span>/</span>
                            <button type="button" data-category-open="${record.category}">标语档案</button><span>/</span>
                            <span>${category.name}</span><span>/</span><span>详情</span>
                        </div>
                        <h1 class="da-detail-title" id="da-detail-title">${record.text}</h1>
                        <div class="da-detail-quote">
                            星星之火，可以燎原。<br>${record.text}
                            <span>—— 井冈山革命根据地标语</span>
                        </div>
                    </div>
                </div>

                <div class="da-container da-detail-main">
                    <div class="da-detail-grid">
                        <aside class="da-info-card">
                            <h2>基本信息</h2>
                            <div class="da-info-row"><span>类</span><span>所属分类</span><strong>${category.name}</strong></div>
                            <div class="da-info-row"><span>⌖</span><span>采集地点</span><strong>${record.place}</strong></div>
                            <div class="da-info-row"><span>◷</span><span>年代</span><strong>${record.period}</strong></div>
                            <div class="da-info-row"><span>层</span><span>载体</span><strong>${record.carrier}</strong></div>
                            <div class="da-info-row"><span>盾</span><span>保存状况</span><strong>${record.condition}</strong></div>
                            <div class="da-info-row"><span>签</span><span>档案编号</span><strong>JGSSLG-${record.year}-${padId(record.id)}</strong></div>
                        </aside>

                        <article>
                            <section class="da-article-section">
                                <h2>标语简介</h2>
                                <p>${record.intro} 标语文字简练有力，采用醒目的红色书写于群众日常活动空间，兼具政治传播、社会动员和历史见证价值。</p>
                            </section>
                            <section class="da-article-section">
                                <h2>历史背景</h2>
                                <p>1927年秋，革命力量转战井冈山，开始创建农村革命根据地。随着土地革命、武装斗争和政权建设逐步展开，墙体标语成为向基层群众解释革命目标、宣传政策主张的重要媒介。它们将宏大的政治理念转化为通俗、可记忆、可传播的语言。</p>
                            </section>
                            <section class="da-article-section">
                                <h2>田野记录</h2>
                                <ul>
                                    <li>该档案点位于${record.place}，处于村落主要活动空间附近，具有明显的宣传作用。</li>
                                    <li>文字以红色颜料书写，字体接近手写楷体，现存状况评定为“${record.condition}”。</li>
                                    <li>档案已完成位置、载体、文本与主题的基础著录，后续可补充测绘、影像与口述材料。</li>
                                </ul>
                            </section>
                        </article>
                    </div>

                    <div class="da-tags-row">
                        <strong>相关标签</strong>
                        ${record.tags.map(tag => `<span class="da-tag">${tag}</span>`).join("")}
                        <span class="da-tag">井冈山根据地</span>
                        <div class="da-detail-actions">
                            <button class="da-primary-button" type="button" data-category-open="${record.category}">← 返回分类浏览</button>
                        </div>
                    </div>

                    <section class="da-related" aria-labelledby="da-related-title">
                        <div class="da-section-head">
                            <h2 class="da-section-title" id="da-related-title">相关标语</h2>
                            <button class="da-more" type="button" data-category-open="${record.category}">查看全部相关标语 ›</button>
                        </div>
                        <div class="da-record-grid">${related.map(item => recordCard(item)).join("")}</div>
                    </section>
                </div>
                ${footerMarkup()}
            </section>
        `;
    }

    function miniRecord(id) {
        const record = getRecord(id);
        return `
            <button class="da-event-mini" type="button" data-record-id="${record.id}" aria-label="查看${record.text}">
                <span class="da-event-mini-image"><span>${record.text}</span></span>
                <span>${record.text}</span>
            </button>
        `;
    }

    function timelineContent() {
        let events = [...timelineEvents];
        if (state.timelineMode === "place") {
            events = [...events].sort((a, b) => a.place.localeCompare(b.place, "zh-CN"));
        }
        if (state.timelineMode === "theme") {
            events = [timelineEvents[2], timelineEvents[0], timelineEvents[3], timelineEvents[1], timelineEvents[4], timelineEvents[5]];
        }

        return events.map((event, index) => {
            const side = index % 2 === 0 ? "is-left" : "is-right";
            const card = `
                <article class="da-event-card">
                    <div class="da-event-titleline">
                        <h2><strong>${event.period}：</strong>${event.title}</h2>
                        <span class="da-place-chip">⌖ ${event.place}</span>
                    </div>
                    <p>${event.summary}</p>
                    <div class="da-event-tags">${event.tags.map(tag => `<span>${tag[0]}　${tag[1]} 条</span>`).join("")}</div>
                </article>
            `;
            const minis = `<div class="da-event-placeholder">${event.records.map(miniRecord).join("")}</div>`;
            return `
                <div class="da-timeline-event ${side}">
                    ${side === "is-left" ? card : minis}
                    <span class="da-event-node">${event.index}</span>
                    ${side === "is-left" ? minis : card}
                </div>
            `;
        }).join("");
    }

    function renderTimeline() {
        return `
            <section class="da-view">
                ${innerHero("标语时间线索总览", "串联井冈山革命根据地各个历史阶段的标语演变与传播轨迹，在历史脉络中感受革命斗争的步步推进与精神传承。", "da-timeline-title")}
                <div class="da-page-main da-timeline-intro">
                    <div class="da-container">
                        <div class="da-timeline-stats" aria-label="时间线概览">
                            <div class="da-timeline-stat"><span>档</span><div><small>标语总数</small><strong>126</strong> 条</div></div>
                            <div class="da-timeline-stat"><span>◫</span><div><small>时间跨度</small><strong>1927–1929</strong></div></div>
                            <div class="da-timeline-stat"><span>⚑</span><div><small>历史阶段</small><strong>6</strong> 个</div></div>
                            <div class="da-timeline-stat"><span>⌖</span><div><small>主要地点</small><strong>5</strong> 处</div></div>
                        </div>

                        <div class="da-timeline-controls">
                            <button class="da-timeline-pill ${state.timelineMode === "time" ? "is-active" : ""}" type="button" data-timeline-mode="time">按时间浏览</button>
                            <button class="da-timeline-pill ${state.timelineMode === "place" ? "is-active" : ""}" type="button" data-timeline-mode="place">按地点串联</button>
                            <button class="da-timeline-pill ${state.timelineMode === "theme" ? "is-active" : ""}" type="button" data-timeline-mode="theme">按主题联想</button>
                            <div class="da-timeline-legend" aria-label="时间线图例">
                                <span><i style="--legend:#a41016"></i>时间节点</span>
                                <span><i style="--legend:#cca46c"></i>重要事件</span>
                                <span><i style="--legend:#a64d25"></i>代表标语</span>
                                <span><i style="--legend:#c79c8b"></i>地点关联</span>
                            </div>
                        </div>

                        <div class="da-timeline">${timelineContent()}</div>

                        <section class="da-paths" aria-labelledby="da-path-title">
                            <div class="da-section-head">
                                <h2 class="da-section-title" id="da-path-title">时间线中的关联路径</h2>
                            </div>
                            <div class="da-path-grid">
                                ${[
                                    ["土地革命 → 群众动员", [["分田地","1927–1928"],["土地政策","1928夏"],["一切依靠群众","1929初"]]],
                                    ["军民关系 → 黄洋界保卫", [["红军是工农军队","1927–1928"],["军民团结","1928秋"],["黄洋界上炮声隆","1928秋"]]],
                                    ["党的建设 → 根据地巩固", [["加强党的领导","1927–1928"],["巩固根据地政权","1928夏"],["扩大红色区域","1929初"]]]
                                ].map(path => `
                                    <article class="da-path-card">
                                        <h3>${path[0]}</h3>
                                        <div class="da-path-flow">
                                            ${path[1].map((point, index) => `
                                                ${index ? `<span class="da-path-arrow"></span>` : ""}
                                                <span class="da-path-point"><strong>${index + 1}</strong><small>${point[0]}<br>${point[1]}</small></span>
                                            `).join("")}
                                        </div>
                                    </article>
                                `).join("")}
                            </div>
                        </section>
                    </div>
                </div>
                ${footerMarkup()}
            </section>
        `;
    }

    function updateHeader() {
        archiveNav.querySelectorAll("[data-da-route]").forEach(button => {
            button.classList.toggle("is-active", button.dataset.daRoute === state.route);
        });
    }

    function renderRoute() {
        if (state.route === "categories") {
            content.innerHTML = renderCategories();
            renderCatalogResults();
        } else if (state.route === "detail") {
            content.innerHTML = renderDetail();
        } else if (state.route === "timeline") {
            content.innerHTML = renderTimeline();
        } else {
            content.innerHTML = renderHome();
        }
        updateHeader();
        archiveApp.scrollTo({ top: 0, behavior: "instant" });
    }

    function routeHash(route, id) {
        if (route === "detail") return `#archive-detail-${id || state.detailId}`;
        return `#archive-${route}`;
    }

    function openArchive(route = "home", options = {}) {
        const { id, replace = false, preserveScroll = false } = options;
        if (!archiveApp.classList.contains("is-open")) {
            if (!location.hash.startsWith("#archive-")) {
                state.lastMainHash = location.hash || "#hero";
            }
            document.body.classList.add("archive-mode");
            archiveApp.classList.add("is-open");
            archiveApp.setAttribute("aria-hidden", "false");
            originalNavLinks?.classList.remove("open");
        }

        state.route = ["home", "categories", "detail", "timeline"].includes(route) ? route : "home";
        if (id) state.detailId = Number(id);
        const hash = routeHash(state.route, state.detailId);
        if (replace) history.replaceState(null, "", hash);
        else if (location.hash !== hash) history.pushState(null, "", hash);
        renderRoute();
        if (!preserveScroll) archiveApp.scrollTop = 0;
    }

    function closeArchive(targetHash = state.lastMainHash || "#hero") {
        archiveApp.classList.remove("is-open");
        archiveApp.setAttribute("aria-hidden", "true");
        document.body.classList.remove("archive-mode");
        const safeHash = targetHash.startsWith("#archive-") ? "#hero" : targetHash;
        history.pushState(null, "", safeHash);
        const target = document.querySelector(safeHash);
        if (target) target.scrollIntoView({ behavior: "smooth" });
    }

    function syncFromHash() {
        const match = location.hash.match(/^#archive-(home|categories|timeline)$/);
        const detailMatch = location.hash.match(/^#archive-detail-(\d+)$/);
        if (detailMatch) {
            openArchive("detail", { id: Number(detailMatch[1]), replace: true });
        } else if (match) {
            openArchive(match[1], { replace: true });
        } else if (archiveApp.classList.contains("is-open")) {
            archiveApp.classList.remove("is-open");
            archiveApp.setAttribute("aria-hidden", "true");
            document.body.classList.remove("archive-mode");
        }
    }

    document.querySelectorAll("[data-open-archive]").forEach(button => {
        button.addEventListener("click", () => openArchive("home"));
    });

    document.getElementById("archiveBrand")?.addEventListener("click", () => openArchive("home"));
    document.getElementById("archiveClose")?.addEventListener("click", () => closeArchive());

    archiveNav.addEventListener("click", event => {
        const routeButton = event.target.closest("[data-da-route]");
        if (routeButton) {
            const route = routeButton.dataset.daRoute;
            openArchive(route, route === "detail" ? { id: state.detailId || 2 } : {});
            return;
        }
        const mainTarget = event.target.closest("[data-main-target]");
        if (mainTarget) closeArchive(`#${mainTarget.dataset.mainTarget}`);
    });

    content.addEventListener("click", event => {
        const recordButton = event.target.closest("[data-record-id]");
        if (recordButton) {
            openArchive("detail", { id: Number(recordButton.dataset.recordId) });
            return;
        }

        const categoryButton = event.target.closest("[data-category-open]");
        if (categoryButton) {
            state.category = categoryButton.dataset.categoryOpen;
            state.search = "";
            state.period = "all";
            state.carrier = "all";
            openArchive("categories");
            return;
        }

        const routeButton = event.target.closest("[data-da-route]");
        if (routeButton) {
            openArchive(routeButton.dataset.daRoute);
            return;
        }

        const filterButton = event.target.closest("[data-category-filter]");
        if (filterButton) {
            state.category = filterButton.dataset.categoryFilter;
            renderCatalogResults();
            return;
        }

        if (event.target.closest("[data-reset-filters]")) {
            state.category = "all";
            state.search = "";
            state.period = "all";
            state.carrier = "all";
            content.innerHTML = renderCategories();
            renderCatalogResults();
            return;
        }

        const timelineButton = event.target.closest("[data-timeline-mode]");
        if (timelineButton) {
            state.timelineMode = timelineButton.dataset.timelineMode;
            content.innerHTML = renderTimeline();
        }
    });

    content.addEventListener("input", event => {
        if (event.target.id === "daSearchInput") {
            state.search = event.target.value;
            renderCatalogResults();
        }
    });

    content.addEventListener("change", event => {
        if (event.target.id === "daPeriodFilter") {
            state.period = event.target.value;
            renderCatalogResults();
        } else if (event.target.id === "daCarrierFilter") {
            state.carrier = event.target.value;
            renderCatalogResults();
        }
    });

    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("keydown", event => {
        if (event.key === "Escape" && archiveApp.classList.contains("is-open")) closeArchive();
    });

    if (isStandalonePage && !location.hash.startsWith("#archive-")) {
        history.replaceState(null, "", "#archive-home");
    }

    syncFromHash();
})();
