const express = require("express");
const cors = require('cors');
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const PushNotifications = require("node-pushnotifications");

const app = express();

// Mengaktifkan middleware CORS tanpa pembatasan endpoint
app.use(cors());

// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey = "BF_wXa1EQUAqRFOHc7IFpUMPu2W5u_tRBQH5Jhti_918LTXVppU99I4Cu66bRTGy2rU_M2pVFsKg7r5onl3Ub2A"; // REPLACE_WITH_YOUR_KEY
const privateVapidKey = "hQaI-8-Boi4_KjR8p3WLvzau0fNyyxq6V-UX5ZDuqIg"; // REPLACE_WITH_YOUR_KEY

app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  const settings = {
    web: {
      vapidDetails: {
        subject: "mailto: <cloud.oceanobjectstorage@gmail.com>", // REPLACE_WITH_YOUR_EMAIL
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

  // Send 201 - resource created
  const push = new PushNotifications(settings);

  // Create payload
  const payload = { title: "Notification from Knock" };
  push.send(subscription, payload, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error sending push notification");
    } else {
      console.log(result);
      res.status(200).send("Push notification sent successfully");
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/main.js", (req, res) => {
  res.sendFile(__dirname + "/main.js");
});
app.get("/sw.js", (req, res) => {
  res.sendFile(__dirname + "/sw.js");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
