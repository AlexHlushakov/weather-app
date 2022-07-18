import React from "react";
import styles from './Weather.module.scss'
import clear from "../assets/img/clear.png";
import mainlyClear from "../assets/img/mainly-clear.png";
import partlyCloudy from "../assets/img/partly-cloudy.png";
import overcast from "../assets/img/overcast.png";
import slightRain from "../assets/img/lightRain.png";
import mediumRain from "../assets/img/medium-rain.png";
import heavyRain from "../assets/img/heavy-rain.png";
import slightSnow from "../assets/img/slight-snow.png";
import mediumSnow from "../assets/img/medium-snow.png";
import heavySnow from "../assets/img/heavy-snow.png";
import thunder from "../assets/img/thunderstorm.png";




type PropTypes ={
    weathercode: number
}


const WeatherCondition: React.FC<PropTypes> = (props) =>{


    const getWeatherCondition = (code:number) =>{
        switch (code) {
            case 0: return clear

            case 1: return mainlyClear

            case 2: return partlyCloudy

            case 3 || 45 || 48: return overcast

            case 51 || 53 : return slightRain

            case 61 || 56: return slightRain

            case 80 || 55  || 57: return slightRain

            case 63 || 66 : return mediumRain

            case 65 || 67 : return heavyRain

            case 81 || 82 : return heavyRain

            case 71: return slightSnow

            case 73 || 85 : return mediumSnow

            case 75 || 77 || 86 : return heavySnow

            case 95 || 96 || 99: return thunder
        }
    }


        return(<div className={styles.weather_img_block}>
                <img className={styles.weather_img} src={getWeatherCondition(props.weathercode)} alt=""/>
            </div>)

}
export default WeatherCondition