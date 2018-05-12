var express = require('express');
var router = express.Router();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

// App configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

app.get("/", function(req, res) {
    res.send("Hello World!");
});

module.exports = router;