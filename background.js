
const API_KEY = "AIzaSyA9-6AE2epOM81DLe1SuZlHxD_uYbroC2c"; 

// Store product data
let productData = { 
    product: "Loading...", 
    carbon: "Fetching data...", 
    sustain: "Unknown" 
  };
  
  // Unified message handler
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle product data updates from content script
    if (message.event === "productData") {
      productData = { 
        product: message.product, 
        carbon: message.carbon || "Calculating...",
        sustain: message.sustain || "Unknown"
      };
      console.log("Updated Product Data:", productData);
      sendResponse({ status: "Received successfully!" });
      return true;
    }
    
    // Handle requests for stored product data
    if (message.event === "getProductData") {
      sendResponse(productData);
      return true;
    }
    
    // Handle sustainability check requests
    if (message.action === "checkSustainability") {
      checkSustainability(message.productName, message.carbonFootprint)
        .then(result => {
          // Update product data with new sustainability info
          productData.sustain = result.includes("Sustainable") 
            ? "Sustainable ✅" 
            : "Not Sustainable ❌";
          sendResponse(result);
        })
        .catch(error => {
          console.error("Sustainability check failed:", error);
          sendResponse("Error: " + error.message);
        });
      return true; // Required for async response
    }
  });
  
  // Gemini API Call Function (with your original URL)
  async function checkSustainability(productName, carbonFootprint) {
  
    const prompt = `Product: ${productName}\nCarbon Footprint: ${carbonFootprint} kg CO₂\n` +
                  `Is this sustainable? Respond with "Sustainable: [reason]" or "Not Sustainable: [reason]"`;
  
    // Using your original v1beta endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-03-25:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "API request failed");
    }
  
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  }