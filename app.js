const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Invest = require("./models/Invest.js");
const ProductEmission = require("./models/Product.js");
const User = require("./models/user.js");

const methodOverride = require("method-override");
const session = require("express-session");

// 🔹 Groq + dotenv (CommonJS FIXED)
require("dotenv").config();


console.log("Groq key loaded:", process.env.GROQ_API_KEY ? "YES" : "NO");

const Groq = require("groq-sdk");

// 🔹 Groq Client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ---------------- MIDDLEWARE ----------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// ---------------- DATABASE ----------------
async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin123@cluster0.j6gihrp.mongodb.net/ecoInvestDB?retryWrites=true&w=majority"
    );
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
main();

// ---------------- SESSION ----------------
const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionOption));

// ---------------- PASSPORT ----------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

// ---------------- ROUTES ----------------

// Home
app.get("/", (req, res) => {
  res.render("main.ejs");
});

app.get("/Home", (req, res) => {
  res.render("main.ejs");
});

// Compare Investments
app.get("/compare-investments", async (req, res) => {
  const data = await Invest.find({});
  res.render("comparison.ejs", { data });
});

// Compare Products
app.get("/compare-products", async (req, res) => {
  const productData = await ProductEmission.find({});
  res.render("compareProduct.ejs", { productData });
});

// ---------------- AUTH ----------------
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  } catch (err) {
    res.render("signup.ejs", { error: err.message });
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

// ---------------- 🤖 GROQ AI CHATBOT ----------------

// Render chatbot page
app.get("/chatbot", (req, res) => {
  res.render("chat.ejs");
});

// Handle chatbot message
app.post("/chatbot", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant for EcoInvest. Help users with sustainable investments and eco-friendly products.",
        },
        { role: "user", content: userMessage },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("Groq Error:", err);
    res.status(500).json({ reply: "AI service error" });
  }
});


// ---------------- SERVER ----------------
app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});
