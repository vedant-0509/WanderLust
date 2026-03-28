let stars = document.querySelectorAll(".add-review .star");
let output = document.getElementById("output");
let ratingInput = document.getElementById("ratingInput");

function gfg(n) {
    remove();

    for (let i = 0; i < n; i++) {
        stars[i].classList.add("active"); // ✅ better
    }

    output.innerText = "Rating is: " + n + "/5";
    ratingInput.value = n;
}

function remove() {
    stars.forEach(star => star.classList.remove("active"));
}