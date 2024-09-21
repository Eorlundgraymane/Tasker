//Dependencies

import express from 'express';
import ejs from 'ejs'
import bodyParser from 'body-parser';

//Database

//Routers

import mainRouter from "./routers/mainRouter.js"

//App Config

const app = express();
app.set('view-engine', ejs)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mainRouter);

//Server setup

app.listen(3000, () => {
    console.log("Tasker is Up on http://localhost:3000/");
})

