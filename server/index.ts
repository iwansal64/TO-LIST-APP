//? Setup express js
import express = require("express");
import body_parse = require('body-parser');

const app = express();

app.use(body_parse.json());

app.use((req, res, next) => {
    //? Logging
    console.log(`[${new Date().toISOString()}]\nMethod: ${req.method}\nDestination: ${req.url}\n`);

    if (req.method == "GET") {
        console.log("Query: " + JSON.stringify(req.query));
    }
    else if (req.method == "POST") {
        console.log("Body: " + JSON.stringify(req.body));
    }

    const headers = req.headers;
    console.log("Headers: " + JSON.stringify(headers) + "\n");

    //? Authentication
    if (!Object.keys(headers).includes("authentication") || headers["authentication"] != "XjRXvmXKog6NrUcduyEiWkeq55MmeQWErVQ3UJfMWyWtWPF4") {
        res.statusCode = 401;
        res.send("Authentication Failed!\n");
        console.log("Authentication Failed!\n");
        return;
    }

    next();
})


//? ==============================  GET  ============================== ?//
//? User GET Request (get user data)
app.get("/user", (req, res) => {
    const data = req.query;
    let result = {
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
app.post("/user", (req, res) => {
    const data = req.body;
    let result = {
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
app.put("/user", (req, res) => {
    const data = req.body;
    let result = {
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
app.delete("/user", (req, res) => {
    const data = req.body;
    let result = {
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