import express  from "express";
import axios from "axios";


const app = express();
const port =process.env.PORT || 3030;
const apiKey ="aebcd8c137e063d2e4c27ec547e2d40e";
const weatherApiKey="fca2a9d5c5b9def40df767be2a827680";
let userCityName=""; 
let longitude = "";
let latitude = "";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",async(req,res)=>{
    res.render("index.ejs");
});

app.post("/submit",async(req,res)=>{
   userCityName = req.body["city"];
    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${userCityName}&limit=5&appid=${apiKey}`);
        const result = response.data;
        // const content = JSON.stringify(result);
        // console.log(result);
        console.log(result[0].lon,result[0].lat);
        longitude=result[0].lon;
        latitude=result[0].lat;
        console.log(longitude,latitude);
        // res.render("index.ejs", { data : result });
       } catch (error) {
         console.error("Failed to make request:", error.message);
         res.render("index.ejs", {
           error: error.message,
         });
       }

// Getting Weather

       try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`);
        const result = response.data;
        const content = JSON.stringify(result);
        console.log(result);
        console.log(result.weather[0].description);
        let celsius = result.main.temp - 273.15;
        celsius = celsius.toFixed(0);
        var iconcode = result.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        
        res.render("index.ejs", { dataDescription : result.weather[0].description, dataTemp : celsius, dataName : result.name, dataIcon :  iconurl});
       } catch (error) {
         console.error("Failed to make request:", error.message);
         res.render("index.ejs", {
           error: error.message,
         });
       }
    
});

app.listen(port,()=>{
    console.log("Server is running on port: "+port);
})