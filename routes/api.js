var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./book");
var storyRouter = require("./story");

var app = express();

app.use("/auth/", authRouter);
app.use("/book/", bookRouter);
app.use("/story/", storyRouter);

module.exports = app;