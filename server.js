
const { on } = require('events');
const express = require('express');
const app = express();

const https = require('https');

app.use(express.urlencoded({extended : true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

require('dotenv').config();

app.get("/",function(req,res){
    res.send("<div><h1>Hello world</h1></div>");
})

function getWeatherInfo(url){

    return new Promise((resolve,reject)=>{

        https.get(url,function(response){

            if(response.statusCode === 200){
                response.on("data",function(data){
                    resolve(JSON.parse(data));
                })
            }else{
                reject("Data not fetched");
            }

        })
    })
}

app.get("/:cityName",function(req,res){

    async function run(){

        try{
            const cityName = req.params.cityName;
            const url1 = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&appid=" + process.env.API_KEY + "&units=metric";
            const url2 = "https://api.openweathermap.org/data/2.5/forecast?q="+ cityName +"&appid="+ process.env.API_KEY + "&units=metric&cnt=6";

            const response1 = await getWeatherInfo(url1);
            const response2 = await getWeatherInfo(url2);

            res.json([
                extractWeather(response1),
                extractForecastedWeather(response2)
            ]);

        }catch(error){
            console.log(error);
            res.status(404).json({
                err : error
            });
        }
        
    }
    run();
})
  
function extractForecastedWeather(data){

    forecastWeather =[]
    data.list.forEach(function(item){

        forecastWeather.push({...extractWeather(item),datetime:getTime(item.dt)});

    })
    return forecastWeather;
}
  
  function extractWeather(jsonData){
    
    return currentWeather = {
        description:jsonData.weather[0].description,
        iconURL : "http://openweathermap.org/img/wn/"+jsonData.weather[0].icon+".png",
        cityName : jsonData.name,
        temperature : Math.round(jsonData.main.temp),
        feelsLike: Math.round(jsonData.main.feels_like),
        highTemp : jsonData.main.temp_max,
        lowTemp : jsonData.main.temp_min,
        pressure : jsonData.main.pressure,
        humidity : jsonData.main.humidity,
        datetime : getDate(),
        windSpeed : jsonData.wind.speed,
        visibility : jsonData.visibility 
    };
}

function getDate(){
    const date = new Date();
    options = {
        hour:"numeric",
        minute:"numeric",
        weekday:"short",
        day:"numeric",
        month:"long",
    }
    const strDate = date.toLocaleDateString("en-US",options)
    return strDate;
}
  
  
function getTime(number){
    const time = new Date(number*1000).toLocaleTimeString("en-US",{hour:"numeric",minute:"numeric"})
    return time.toString()
}

app.listen(process.env.PORT || 4000, () => {
    console.log("server started on port 4000");
})