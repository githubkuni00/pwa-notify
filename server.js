const express = require("express");
const cors = require('cors');
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const PushNotifications = require("node-pushnotifications");

const app = express();

// Mengaktifkan middleware CORS
app.use(cors());

app.use(cors({
  origin: 'https://pwa-notify.vercel.app/'
}));

// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

const publicVapidKey = "BF_wXa1EQUAqRFOHc7IFpUMPu2W5u_tRBQH5Jhti_918LTXVppU99I4Cu66bRTGy2rU_M2pVFsKg7r5onl3Ub2A"; // REPLACE_WITH_YOUR_KEY
const privateVapidKey = "hQaI-8-Boi4_KjR8p3WLvzau0fNyyxq6V-UX5ZDuqIg"; //REPLACE_WITH_YOUR_KEY

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
    } else {
      console.log(result);
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

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
