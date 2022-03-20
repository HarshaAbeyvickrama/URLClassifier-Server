import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import {categorize, foo, getCategory, validate} from './classifier.js'
import DBConnection from "./db/dbConnection.cjs";

let port = process.env.PORT || 3000;

//Creating and connecting to db
const dbConnection = new DBConnection('./db/urlClassifier.sqlite3');
dbConnection.seed();

const app = express();
app.use(cors({origin: "*"}));
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

app.get("/", (req, res) => {
    res.send("Hellsssso Word");
});

app.get("/test", (req, res) => {
    foo();
});

app.get("/all", (req, res) => {
    dbConnection.all("SELECT * FROM history").then(result => {
        categorize(result);
    })
});

app.post("/api/history", async (req, res) => {
    let result = await validate(req.body);
    let summedResult = result.reduce((acc, curr) => {
        let item = acc.find(item => item.url === curr.url);
        if (item) {
            item.visitCount += curr.visitCount;
        } else {
            acc.push(curr);
        }
        return acc;
    }, []);
    summedResult.forEach((item) => {
        dbConnection.crateHistory(item);
    })

    // Promise.all(result.map(item =>
    //     getCategory(item.url).then(response => console.log(response))
    // )).then(data =>{
    //     console.log(data);
    // })
    // res.send(req.body);

});

app.get("/category/:url", async (req, res) => {
    const category = getCategory(req.params['url']);
    console.log(category);
    res.send(category);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


