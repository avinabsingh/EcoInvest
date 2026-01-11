// sustainability.js

async function loadSustainabilityThresholds() {
    const response = await fetch(chrome.runtime.getURL("Sustainability_threshhold.csv"));
    const text = await response.text();
    const lines = text.split("\n").slice(1); // Skip header

    return lines
        .map(line => line.trim().split(","))
        .filter(parts => parts.length === 4 && !isNaN(parseFloat(parts[3])))
        .map(([category, low, high, threshold]) => ({
            category: category.trim().toLowerCase(),
            low: parseFloat(low),
            high: parseFloat(high),
            threshold: parseFloat(threshold)
        }));
}

function getClosestCategory(productName, thresholds) {
    const lowerName = productName.toLowerCase();
    return thresholds.find(item => lowerName.includes(item.category));
}

