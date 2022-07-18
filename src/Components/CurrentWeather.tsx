import React, {useEffect, useState} from 'react';
import {setBaseUrl, WeatherAPI} from "../api/api";
import ForecastHourly from "./ForecastHourly";
import WeatherCondition from "./WeatherCondition";
import styles from './Weather.module.scss'


type PropTypes = {
    location: {
        locationParameters:
            {
                latitude: number,
                longitude: number,
                timeZone: string
            },
        locationCity: string,
        country_code: string
    },
    changeLocation: (value: boolean) => void
}

const CurrentWeather: React.FC<PropTypes> = (props) =>{


    //set useState constants

    const [currentWeather, setCurrentWeather] = useState({
        "temperature": 0,
        "windspeed": 0,
        "winddirection": 0,
        "weathercode": 0,
        "time": ''
    })
    const [loading, setLoading] = useState(true)



    // initial page Loading with
    useEffect(() =>{

        const getCurrentWeather = async () =>{
            setLoading(true)
            await setBaseUrl(props.location.locationParameters)
            let response = await WeatherAPI.getCurrentWeather();
            Promise.all([response]).then(() =>{
                    setCurrentWeather(response)
                }
            )
        }

        getCurrentWeather().then(() =>{
            setLoading(false)
        })
    }, [props.location.locationParameters])


    const handleClick = () =>{
        props.changeLocation(false)
    }



    if(loading){
        return <div>Loading...</div>
    } else{
        return(
            <main>
                <div>
                    <div className={styles.app_header}>
                        <h2>Alex Weather</h2>
                        <div>
                            <b>Location: </b><span>{props.location.locationCity}</span>
                        </div>
                        <button onClick={handleClick}>Change Location</button>
                        <a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>
                    </div>
                    <div className={styles.current_weather_block}>
                            <WeatherCondition weathercode={currentWeather.weathercode}/>
                            <span className={styles.current_weather_temp}>{Math.round(currentWeather.temperature)}°C</span>
                            <span className={styles.current_weather_date}>{currentWeather.time.replace('T', ' ')}</span>
                    </div>
                </div>
                <ForecastHourly location={props.location} currentTime={currentWeather.time}/>
            </main>
        )
    }

}
export default CurrentWeather