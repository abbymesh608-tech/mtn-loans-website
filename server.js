const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/inquiry", async (req, res) => {
  try {
    const { name, phone, amount, message } = req.body;

    if (!name || !phone || !amount) {
      return res.status(400).json({
        success: false,
        error: "Please complete all required fields."
      });
    }

    const token = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!token || !chatId) {
      throw new Error("Telegram configuration is missing.");
    }

    const text =
      `New loan inquiry\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Amount: ${amount}\n` +
      `Message: ${message || "None"}`;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error("Telegram API error:", details);
      throw new Error("Telegram message failed");
    }

    res.json({ success: true });

  } catch (error) {
    console.error("Inquiry error:", error.message);
    res.status(500).json({
      success: false,
      error: "Unable to send inquiry."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.post("/apply", (req, res) => {
    res.send(app.post("/apply", async (req, res) => {
    try {
        const token = process.env.BOT_TOKEN;
        const chatId = process.env.CHAT_ID;

        if (!token || !chatId) {
            return res.status(500).send("Telegram is not configured.");
        }

        const message = "New website application received.";

        const response = await fetch(
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

        const result = await response.json();

        if (!result.ok) {
            throw new Error("Telegram notification failed.");
        }

        res.send("Application received successfully!");

    } catch (error) {
        console.error("Telegram error:", error.message);
        res.status(500).send("Application notification failed.");
    }
});app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});