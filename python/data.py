import requests
import pandas as pd
from bs4 import BeautifulSoup
import time

# --- 1. ESG Data from CSRHub (Free Tier) ---
def get_esg_scores(companies):
    esg_data = []
    for company in companies:
        try:
            url = f"https://www.csrhub.com/CSR_and_sustainability_information/{company}"
            response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract scores (CSRHub's current layout)
            overall_score = soup.find('div', class_='overall-score').text.strip()
            environmental = soup.find('div', class_='environmental-pillar').text.strip()
            
            esg_data.append({
                "Company": company,
                "Overall_Score": overall_score,
                "Environmental": environmental
            })
            time.sleep(3)  # Respect crawl delay
            
        except Exception as e:
            print(f"Error getting {company}: {str(e)}")
            continue
            
    return pd.DataFrame(esg_data)

# --- 2. Verified Emissions Data (EPA API) ---
def get_emissions_data():
    try:
        # EPA Facility Level GHG Data
        url = "https://data.epa.gov/efservice/getFacilityInfo/ROWS/0:100/JSON"
        data = requests.get(url).json()
        
        # Process to DataFrame
        df = pd.DataFrame(data)
        return df[['FACILITY_NAME', 'GHG_QUANTITY']].dropna().head(20)
        
    except Exception as e:
        print(f"Emissions API error: {e}")
        return pd.DataFrame()

# --- Main Execution ---
def main():
    print("🔄 Fetching ESG scores...")
    companies = ["Apple", "Microsoft", "Amazon", "Tesla"]  # Use full names for CSRHub
    esg_df = get_esg_scores(companies)
    
    print("\n🔄 Getting verified emissions...")
    emissions_df = get_emissions_data()
    
    # Save results
    if not esg_df.empty:
        esg_df.to_csv("verified_esg_scores.csv", index=False)
        print("\n✅ ESG Data Saved:")
        print(esg_df)
    
    if not emissions_df.empty:
        emissions_df.to_csv("verified_emissions.csv", index=False)
        print("\n✅ Emissions Data Saved:")
        print(emissions_df)

if __name__ == "__main__":
    main()