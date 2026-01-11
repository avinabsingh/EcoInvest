
let productName, price, weight;
const DEFAULT_PRODUCT_WEIGHT = "1 kg";
const DEFAULT_EMISSION_FACTOR = 1.5;

async function loadEmissionFactors() {
    try {
        const response = await fetch(chrome.runtime.getURL("emission_factors.csv"));
        const text = await response.text();
        const lines = text.split("\n").slice(1);

        return lines.map(line => line.trim().split(","))
            .filter(parts => parts.length === 2 && !isNaN(parseFloat(parts[1])))
            .map(([name, factor]) => ({ 
                name: name.trim().toLowerCase(), 
                factor: parseFloat(factor) 
            }));
    } catch (error) {
        console.error("Error loading emission factors:", error);
        return [];
    }
}

async function getCarbonFootprint(material, weightString) {
    const emissionData = await loadEmissionFactors();
    let factor = DEFAULT_EMISSION_FACTOR;
    let matchedMaterial = material;

    const weight = parseFloat(weightString.replace(/[^\d.]/g, "")) || 1;

    if (material && material.toLowerCase() !== "not available") {
        const lowerMaterial = material.toLowerCase();
        const match = emissionData.find(item => item.name === lowerMaterial) ||
                      emissionData.find(item => lowerMaterial.includes(item.name));
        if (match) {
            factor = match.factor;
            matchedMaterial = match.name;
        }
    } else {
        const lowerTitle = productName?.toLowerCase() || "";
        const titleMatch = emissionData.find(item => lowerTitle.includes(item.name));
        if (titleMatch) {
            factor = titleMatch.factor;
            matchedMaterial = titleMatch.name;
        } else {
            console.warn("No material matched in title. Using default factor.");
        }
    }

    return (factor * weight).toFixed(2);
}

async function checkSustainability(productName, carbonFootprint) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: "checkSustainability",
        productName,
        carbonFootprint
      });
      
      if (response.includes("Sustainable")) {
        return "Sustainable ✅";
      } else if (response.includes("Not Sustainable")) {
        return "Not Sustainable ❌";
      }
      return response;
    } catch (error) {
      console.error("Error:", error);
      return "Error checking sustainability";
    }
  }
  
async function extractProductDetails() {
    if (!window.location.href.includes("amazon") || !document.querySelector("#productTitle")) {
        return;
    }

    try {
        productName = document.querySelector("#productTitle")?.innerText.trim();
        price = document.querySelector(".a-price .a-offscreen")?.innerText || "Price not available";

        let weightElement = [...document.querySelectorAll("tr")]
            .find(tr => tr.querySelector("th")?.innerText.includes("Item Weight"))
            ?.querySelector("td");

        weight = weightElement ? weightElement.innerText.trim() : DEFAULT_PRODUCT_WEIGHT;

        let materialRow = [...document.querySelectorAll("tr")]
            .find(tr => tr.querySelector("th.a-color-secondary.a-size-base.prodDetSectionEntry")?.innerText.trim().toLowerCase() === "material");

        let material = materialRow 
            ? materialRow.querySelector("td.a-size-base.prodDetAttrValue")?.innerText.trim() 
            : "Not available";

        console.log("Product Details:", {productName, price, weight, material});

        const carbonFootprint = await getCarbonFootprint(material, weight);
        const sustainabilityStatus = await checkSustainability(productName, carbonFootprint);

        console.log("Analysis Results:", {
            carbonFootprint: `${carbonFootprint} kg CO₂`,
            sustainabilityStatus
        });

        chrome.runtime.sendMessage(
            { 
                event: "productData", 
                product: productName, 
                price: price,
                carbon: `${carbonFootprint} kg CO₂`,
                sustain: sustainabilityStatus
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Message error:", chrome.runtime.lastError);
                }
            }
        );
    } catch (error) {
        console.error("Error in extractProductDetails:", error);
    }
}

const observer = new MutationObserver((mutations, obs) => {
    if (document.querySelector("#productTitle")) {
        extractProductDetails();
        obs.disconnect();
    }
});

observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: true,
    characterData: true 
});

