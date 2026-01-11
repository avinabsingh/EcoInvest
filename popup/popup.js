document.addEventListener("DOMContentLoaded", () => {
    const getCarbonBtn = document.getElementById("get-carbon");
    const carbonInfoDiv = document.getElementById("carbon-info");
    const productInfo = document.getElementById("product-info");
    const carbonScore = document.getElementById("carbon-score");
    const sustainable = document.getElementById("sustainabilty");
    const getAlt = document.getElementById("sustainabilty");

    getCarbonBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ event: "getProductData" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }
            console.log("Received data:", response);

            productInfo.innerText = response.product || "No product found";
            carbonScore.innerText = "Carbon Footprint: " + (response.carbon || "--");
            sustainable.innerText = response.sustain || "No data";
            carbonInfoDiv.style.display = "block";
        });
    });

});