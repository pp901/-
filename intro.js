(() => {
    "use strict";

    const field = document.getElementById("sparkField");
    const exploreButton = document.getElementById("exploreButton");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (field && !reduceMotion) {
        const fragment = document.createDocumentFragment();

        for (let index = 0; index < 28; index += 1) {
            const spark = document.createElement("span");
            const seed = (index * 47) % 101;
            spark.className = "spark";
            spark.style.left = `${4 + (seed * 0.93)}%`;
            spark.style.setProperty("--size", `${2 + (index % 4)}px`);
            spark.style.setProperty("--duration", `${7 + (index % 8) * 0.72}s`);
            spark.style.setProperty("--delay", `${-1 * (index % 13) * 0.63}s`);
            spark.style.setProperty("--drift", `${-45 + (seed % 90)}px`);
            fragment.appendChild(spark);
        }

        field.appendChild(fragment);
    }

    exploreButton?.addEventListener("click", (event) => {
        if (reduceMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        document.body.classList.add("is-leaving");
        window.setTimeout(() => {
            window.location.href = exploreButton.href;
        }, 520);
    });
})();
