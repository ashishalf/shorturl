const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const { connectMongoDB } = require("./connection");

const static = require("./router/static");
const router = require("./router/url");
const userRoute = require("./router/user");
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

connectMongoDB("mongodb://127.0.0.1:27017/url-shortener").then(() =>
  console.log("MongoDB Connected.")
);

app.use("/", checkAuth, static);
app.use("/user", userRoute);
app.use("/url", restrictToLoggedinUserOnly, router);

app.listen(PORT, () => console.log(`Server On: ${PORT}`));
