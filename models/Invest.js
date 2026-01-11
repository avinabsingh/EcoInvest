const mongoose = require("mongoose");

const InvestDataSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  logo: { type: String },
  symbol: { type: String, required: true },
  environmentalScore: Number,
  socialScore: Number,
  governanceScore: Number,
  ESGScore: Number,
  ESGRiskRating: String,
  industryRank: String,
  description: String,

  // New fields
  carbonFootprint: Number, // metric tons CO2e
  renewableEnergy: Number, // percentage
  waterUsage: Number, // million cubic meters
  wasteReduction: Number, // percentage reduction
  employeeSatisfaction: Number, // percentage
  diversityScore: Number, // out of 100
  communityInvestment: Number, // million dollars
  boardDiversity: Number, // percentage
  executivePayRatio: Number, // CEO pay ratio
  ethicsCompliance: Number // out of 100
});

module.exports = mongoose.model("Invest", InvestDataSchema);
