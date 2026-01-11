const mongoose = require("mongoose");
const initData = require("./data.js");
const initInvestmentData = require("./investData.js");
const ProductEmission = require("../models/Product.js");
const Invest = require("../models/Invest.js");

const MONGO_URL = "mongodb+srv://admin:admin123@cluster0.j6gihrp.mongodb.net/ecoInvestDB?retryWrites=true&w=majority";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connection successful");
        initDB(); 
    })
    .catch((err) => {
        console.log("DB connection error:", err);
    });

async function initDB() {
    try {
        await ProductEmission.deleteMany({});
        await ProductEmission.insertMany(initData.data);
        console.log("Data was initialized.");
    } catch (err) {
        console.error("Error initializing data:", err);
    } finally {
        mongoose.connection.close(); 
    }


    // try {
    //     await Invest.deleteMany({});
    //     await Invest.insertMany(initInvestmentData.data);
    //     console.log("Data was initialized.");
    // } catch (err) {
    //     console.error("Error initializing data:", err);
    // } finally {
    //     mongoose.connection.close(); 
    // }

}
