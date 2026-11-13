const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve website files
app.use(express.static(__dirname));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Loan application and Telegram notification
app.post("/apply", async (req, res) => {
    try {
        const token = process.env.BOT_TOKEN;
        const chatId = process.env.CHAT_ID;

        if (!token || !chatId) {
            console.error("Telegram environment variables missing");
            return res.status(500).send("Telegram is not configured.");
        }

        const message = "New website application received.";

        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            }
        );

        const result = await telegramResponse.json();

        if (!result.ok) {
            console.error("Telegram API error:", result.description);
            return res.status(502).send("Telegram notification failed.");
        }

        console.log("Telegram notification sent successfully");

        res.send("Application received successfully!");

    } catch (error) {
        console.error("Application error:", error.message);
        res.status(500).send("Something went wrong. Please try again.");
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});