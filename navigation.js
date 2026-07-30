(() => {
    "use strict";

    const connection = navigator.connection;
    const shouldPrefetch = !connection?.saveData && !["slow-2g", "2g"].includes(connection?.effectiveType);
    if (!shouldPrefetch) return;

    const prefetched = new Set();

    function getPageUrl(link) {
        if (!link || link.target || link.hasAttribute("download")) return null;

        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin || !url.pathname.endsWith(".html")) return null;
        if (url.pathname === window.location.pathname) return null;

        url.hash = "";
        return url.href;
    }

    function prefetch(link) {
        const href = getPageUrl(link);
        if (!href || prefetched.has(href)) return;

        prefetched.add(href);
        const hint = document.createElement("link");
        hint.rel = "prefetch";
        hint.as = "document";
        hint.href = href;
        document.head.appendChild(hint);
    }

    document.addEventListener("pointerover", (event) => {
        prefetch(event.target.closest("a[href]"));
    }, { passive: true });

    document.addEventListener("focusin", (event) => {
        prefetch(event.target.closest("a[href]"));
    });

    document.addEventListener("touchstart", (event) => {
        prefetch(event.target.closest("a[href]"));
    }, { passive: true });

    const warmNavigation = () => {
        document.querySelectorAll("header a[href], nav a[href]").forEach(prefetch);
    };

    if ("requestIdleCallback" in window) {
        window.requestIdleCallback(warmNavigation, { timeout: 1800 });
    } else {
        window.setTimeout(warmNavigation, 900);
    }
})();
