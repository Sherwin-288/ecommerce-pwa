const webPush = require("web-push");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Server is running! Use Postman to test push notifications.");
  });
  
// Replace these keys with your actual VAPID keys
const vapidKeys = {
  publicKey: "BKmKrbw8S4XP-QsseV9SklbG-bNjD7e4dBrRcZVsMbu2jyo71B6faw_nRmk-caywVYhUxdVEvuuD1RE90rsc7Dw",
  privateKey: "O9jDCNNYqcJ1Ib4FLPmb41neoWk0kHDe2F3YRpfnis8",
};

// Configure web-push
webPush.setVapidDetails(
  "mailto:sherwinsnadar.004@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Store subscriptions (In production, store in a database)
let subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription added!" });
});

// Send notification to all subscribed clients
app.post("/send-notification", (req, res) => {
  const notificationPayload = {
    title: "🚀 New Notification!",
    body: "This is a test push notification from the server!",
  };

  const payload = JSON.stringify(notificationPayload);

  subscriptions.forEach((sub, index) => {
    webPush.sendNotification(sub, payload).catch(err => {
      console.error("❌ Push Notification Failed:", err);
    });
  });

  res.status(200).json({ message: "Notification sent!" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
