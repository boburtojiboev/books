console.log("Web Serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router");
const cookieParser = require("cookie-parser");
let session = require("express-session");
const cors = require("cors");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// MongoDB chaqirish
// const db = require("./server").db();
// const mongodb = require("mongodb");

// 1 Kirish code lar
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

// 2: session code
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 45, //for 45minutes
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(function (req, res, next) {
  res.locals.member = req.session.member;
  next();
});

// 3 views code
app.set("views", "views");
app.set("view engine", "ejs");

// 4 Routing code
app.use("/", router);

module.exports = app;
