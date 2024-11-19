"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//? Setup express js
var express = require("express");
var body_parse = require("body-parser");
var app = express();
app.use(body_parse.json());
app.use(function (req, res, next) {
    //? Logging
    console.log("[".concat(new Date().toISOString(), "]\nMethod: ").concat(req.method, "\nDestination: ").concat(req.url, "\n"));
    if (req.method == "GET") {
        console.log("Query: " + JSON.stringify(req.query));
    }
    else if (req.method == "POST") {
        console.log("Body: " + JSON.stringify(req.body));
    }
    var headers = req.headers;
    console.log("Headers: " + JSON.stringify(headers) + "\n");
    //? Authentication
    if (!Object.keys(headers).includes("authentication") || headers["authentication"] != "XjRXvmXKog6NrUcduyEiWkeq55MmeQWErVQ3UJfMWyWtWPF4") {
        res.statusCode = 401;
        res.send("Authentication Failed!\n");
        console.log("Authentication Failed!\n");
        return;
    }
    next();
});
//? ==============================  GET  ============================== ?//
//? User GET Request (get user data)
app.get("/user", function (req, res) {
    var data = req.query;
    var result = {
        "success": false,
        "message": ""
    };
    if (Object.keys(data).length == 0) {
        res.statusCode = 400;
        result["message"] += "Search parameters in the request's query aren't specified!";
    }
    else {
        result["success"] = true;
    }
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(result) + "\n");
});
//? ==============================  POST  ============================== ?//
//? User POST Request (add user data)
app.post("/user", function (req, res) {
    var data = req.body;
    var result = {
        "success": false,
        "message": ""
    };
    if (!("data" in data)) {
        res.statusCode = 400;
        result["message"] += "Data in the request's body aren't specified!";
    }
    else {
        result["success"] = true;
    }
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(result) + "\n");
});
//? ==============================  PUT  ============================== ?//
//? User PUT Request (update user data)
app.put("/user", function (req, res) {
    var data = req.body;
    var result = {
        "success": false,
        "message": ""
    };
    if (!("params" in data) || !("changes" in data)) {
        res.statusCode = 400;
        result["message"] += "Edit data in the request's body isn't complete!";
    }
    else {
        result["success"] = true;
    }
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(result) + "\n");
});
//? ==============================  DELETE  ============================== ?//
//? User DELETE Request (delete user data)
app.delete("/user", function (req, res) {
    var data = req.body;
    var result = {
        "success": false,
        "message": ""
    };
    if (!("data" in data)) {
        res.statusCode = 400;
        result["message"] += "Delete parameters in the request's body aren't specified!";
    }
    else {
        result["success"] = true;
    }
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(result) + "\n");
});
app.listen(3000);
