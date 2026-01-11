import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const chatCompletion = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [
                { role: "system", content: "You are a helpful project assistant." },
                { role: "user", content: userMessage }
            ]
        });

        res.json({
            reply: chatCompletion.choices[0].message.content
        });
    } catch (err) {
        res.status(500).json({ error: "AI response failed" });
    }
});

app.listen(3000, () => {
    console.log("Groq AI server running on port 3000");
});
