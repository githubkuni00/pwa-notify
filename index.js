const express = require("express");
const cors = require('cors');
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const PushNotifications = require("node-pushnotifications");

const app = express();

// Mengaktifkan middleware CORS
app.use(cors());

// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey = "BF_wXa1EQUAqRFOHc7IFpUMPu2W5u_tRBQH5Jhti_918LTXVppU99I4Cu66bRTGy2rU_M2pVFsKg7r5onl3Ub2A"; // REPLACE_WITH_YOUR_KEY
const privateVapidKey = "hQaI-8-Boi4_KjR8p3WLvzau0fNyyxq6V-UX5ZDuqIg"; // REPLACE_WITH_YOUR_KEY

// Array to store subscriptions
let subscriptions = [];

app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  subscriptions.push(subscription); // Store the subscription

  res.status(201).json({ message: "Subscription added successfully" });
});

app.post("/send-notification", (req, res) => {
  const payload = JSON.stringify({ title: "Notification from Knock" });

  subscriptions.forEach((subscription) => {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh
      }
    };

    const settings = {
      web: {
        vapidDetails: {
          subject: "mailto: <cloud.oceanobjectstorage@gmail.com>",
          publicKey: publicVapidKey,
          privateKey: privateVapidKey,
        },
        gcmAPIKey: "gcmkey",
        TTL: 2419200,
        contentEncoding: "aes128gcm",
        headers: {},
      },
      isAlwaysUseFCM: false,
    };

    const push = new PushNotifications(settings);

    push.send(pushSubscription, payload, (err, result) => {
      if (err) {
        console.error("Error sending push notification:", err);
      } else {
        console.log("Push notification sent successfully:", result);
      }
    });
  });

  res.status(200).json({ message: "Push notifications sent successfully" });
});

// Handle CORS preflight request
app.options("/subscribe", cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/main.js", (req, res) => {
  res.sendFile(__dirname + "/main.js");
});
app.get("/sw.js", (req, res) => {
  res.sendFile(__dirname + "/sw.js");
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
