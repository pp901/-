(() => {
    "use strict";

    const header = document.getElementById("siteHeader");
    const hero = document.getElementById("hero");
    const nav = document.getElementById("mainNav");
    const menuButton = document.getElementById("menuToggle");

    function setMenu(open) {
        if (!nav || !menuButton) return;
        nav.classList.toggle("is-open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
        menuButton.querySelector("use")?.setAttribute("href", open ? "#icon-close" : "#icon-menu");
        document.body.classList.toggle("nav-open", open);
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

    if (header && hero && "IntersectionObserver" in window) {
        const headerObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle("is-scrolled", entry.intersectionRatio < 0.92);
        }, { threshold: [0.92] });
        headerObserver.observe(hero);
    }

    const revealItems = document.querySelectorAll(".reveal");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealItems.forEach((item) => revealObserver.observe(item));
})();
