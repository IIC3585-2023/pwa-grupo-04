var express = require("express");

//---returns an instance of the express server---
var app = express();

var FCM = require("fcm-node");

//---parse the body of the request and set the
// body property on the request object---
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

//---the array to store all the subscriber IDs---
var subscribers = [];

var serverKey =
  "AAAA3A7a9uQ:APA91bGiwk0BPbvYTUElY56SqCmn_9R6HJp1yRAyPkf4GUd5u7Z8LjAcFv__eslpGzaN6Bj7u-zEJMjKXVBGzJQaaEAXZQVLm_MJvpABFDIOUCy1R7m8FFCzYJJOzqMmO5kcUUr8uy-5";
var fcm = new FCM(serverKey);

app.get("/push-1", function (req, res) {
  var message = {
    registration_ids: subscribers,
    data: { notification: { title: "SIUUUUUUUU", body: "Grande Messi" } },
  };
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
      console.log(err);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
  res.sendStatus(200);
});

app.get("/push-2", function (req, res) {
  var message = {
    registration_ids: subscribers,
    data: {
      notification: {
        title: "Feliz día de las madres",
        body: "Te desea Falabella",
      },
    },
  };
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
      console.log(err);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
  res.sendStatus(200);
});

app.post("/subscribers/", function (req, res) {
  //---check that the regid field is there---
  if (!req.body.hasOwnProperty("subscriptionid")) {
    res.statusCode = 400;
    res.send("Error 400: Post syntax incorrect.");
    return;
  }
  if (!subscribers.includes(req.body.subscriptionid)) {
    subscribers.push(req.body.subscriptionid);
  }

  res.statusCode = 200;
  res.send("SubscriptionID received");
});

app.delete("/subscribers/:id", function (req, res) {
  console.log(req.params.id);
  const index = subscribers.indexOf(req.params.id);
  if (index !== -1) {
    subscribers.splice(index, 1);
  }
  res.statusCode = 200;
  res.send("SubscriptionID deleted");
});

app.listen(8080);
console.log("Rest Service Listening on port 8080");
