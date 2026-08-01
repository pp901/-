(() => {
    "use strict";

    const API = "/api/counter";

    const html = `
        <div class="visitor-badge" id="visitorBadge" aria-label="网站访问计数">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.062 11.576a10.031 10.031 0 0 1 19.876 0"/>
                <path d="M12 7.75v6"/>
                <circle cx="12" cy="17" r="1"/>
            </svg>
            <span>访问</span>
            <span class="visitor-count" id="visitorCount">—</span>
            <span>次</span>
        </div>
    `;

    function renderBadge(data) {
        const countEl = document.getElementById("visitorCount");
        if (countEl && data && data.total != null) {
            countEl.textContent = data.total.toLocaleString("zh-CN");
        }
    }

    async function fetchCount() {
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error("counter fetch failed");
            const data = await res.json();
            renderBadge(data);
        } catch {
            const el = document.getElementById("visitorBadge");
            if (el) el.style.display = "none";
        }
    }

    async function incrementAndFetch() {
        try {
            const res = await fetch(API, { method: "POST" });
            if (!res.ok) throw new Error("counter increment failed");
            const data = await res.json();
            renderBadge(data);
        } catch {
            const el = document.getElementById("visitorBadge");
            if (el) el.style.display = "none";
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.body.insertAdjacentHTML("beforeend", html);
        incrementAndFetch();
    });
})();
