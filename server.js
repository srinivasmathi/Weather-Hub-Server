
const express = require('express')
const app = express();

app.use(express.urlencoded({extended : true}));

require('dotenv').config();

app.get("/",function(req,res){
    res.send("<div><h1>Hello world</h1></div>");
})

app.listen(process.env.PORT || 4000, () => {
    console.log("server started on port 4000");
})