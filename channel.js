(() => {
    "use strict";

    const menuButton = document.getElementById("channelMenuButton");
    const nav = document.getElementById("channelNav");

    function setMenu(open) {
        if (!menuButton || !nav) return;
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
        nav.classList.toggle("is-open", open);
        document.body.classList.toggle("menu-open", open);
    }

    menuButton?.addEventListener("click", () => {
        setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });

    nav?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setMenu(false);
    });

    const revealItems = document.querySelectorAll(".reveal");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });

        revealItems.forEach((item) => observer.observe(item));
    }

    const aiOutput = document.getElementById("aiDemoOutput");
    const aiPrompts = document.querySelectorAll("[data-ai-answer]");

    aiPrompts.forEach((button) => {
        button.addEventListener("click", () => {
            aiPrompts.forEach((item) => item.classList.toggle("is-active", item === button));
            if (aiOutput) aiOutput.textContent = button.dataset.aiAnswer || "";
        });
    });
})();
