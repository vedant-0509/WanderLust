let taxSwitch = document.getElementById("flexSwitchCheckDefault");

taxSwitch.addEventListener("change", () => {

    let originalPrices = document.querySelectorAll(".original-price");
    let taxPrices = document.querySelectorAll(".tax-para");

    if(taxSwitch.checked){
        originalPrices.forEach((price) => {
            price.style.display = "none";
        });
        taxPrices.forEach((tax) => {
            tax.style.display = "block";
        });

    } else {
        originalPrices.forEach((price) => {
            price.style.display = "block";
        });
        taxPrices.forEach((tax) => {
            tax.style.display = "none";
        });
    }
});