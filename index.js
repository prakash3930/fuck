const express = require('express');
const { scraingPuppeteer } = require('./scraping');
const app = express();
const port = process.env.PORT || 8000;
require("dotenv").config();


app.get('/',async(req,res)=>{
    res.send("Render puppeteer script is up and running.")
})

app.get('/scrap',async(req,res)=>{
   await scraingPuppeteer(req,res)
})

app.get('/script',async(req,res)=>{
    res.send("welcome script")
})


app.listen(port,()=>{
    console.log(`app listen on port http://localhost:${port}`);
})