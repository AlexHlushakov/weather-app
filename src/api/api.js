import axios from "axios";
import React from "react";

let latitude = 0;
let longitude = 0;
let timeZone = '';


const getBaseUrl = () =>{
    return  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&windspeed_unit=ms&timezone=${timeZone}`;
}

export const setBaseUrl = (location) =>{
    timeZone = location.timeZone.replace('/', '%2F');
    latitude = location.latitude;
    longitude = location.longitude;
}




export const LocationAPI = {
    searchLocation(cityName){
        return axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`).then(res => res.data.results);
    }
}

export const WeatherAPI = {
    getCurrentWeather(){
        let baseUrl = getBaseUrl();
        return axios.get(`${baseUrl}&current_weather=true`).then(res => res.data.current_weather);
    },
    getHourlyWeather(){
        let baseUrl = getBaseUrl();
        return axios.get(`${baseUrl}&hourly=temperature_2m,apparent_temperature,weathercode`).then(res => res.data.hourly);
    },
    getDailyWeather(){
        let baseUrl = getBaseUrl();
        return axios.get(`${baseUrl}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset`).then(res => res.data.daily);
    }
}