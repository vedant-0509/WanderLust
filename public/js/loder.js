// public/js/loader.js

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader-wrapper");

    if (loader) {
        loader.style.opacity = "0";
        loader.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    }
});