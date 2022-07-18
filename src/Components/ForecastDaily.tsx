import React, {useEffect, useState} from 'react';
import {setBaseUrl, WeatherAPI} from "../api/api";
import styles from "./Weather.module.scss"
import WeatherCondition from "./WeatherCondition";


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
    }
}

type ForecastObject = {
    "id": number,
    "time": string,
    "weathercode": number,
    "temperature_2m_max": number,
    "temperature_2m_min": number,
    "sunrise": string,
    "sunset": string
}

const  ForecastDaily: React.FC<PropTypes> = (props) =>{

    const [forecastDaily, setForecastDaily] = useState([
        {
            id: 0,
            time: '',
            weathercode: 0,
            temperature_2m_max: 0,
            temperature_2m_min: 0,
            sunrise: '',
            sunset: ''
        }
    ])

    const [loading, setLoading] = useState(true)



    useEffect(() =>{

        let responseContainer = {
            time: [],
            weathercode: [],
            temperature_2m_max: [],
            temperature_2m_min: [],
            sunrise: [],
            sunset: []
        }

        let forecastContainer: Array<ForecastObject> = []


        const getDailyWeather = async () =>{
            setLoading(true)
            await setBaseUrl(props.location.locationParameters)
            let response = await WeatherAPI.getDailyWeather();
            Promise.all([response]).then(() =>{
                responseContainer = response;
                for(let i = 0; i < 7; i++){
                    if(responseContainer.time[i] !== undefined){
                        let newElement: ForecastObject = {
                            id: i,
                            time: responseContainer.time[i],
                            weathercode: responseContainer.weathercode[i],
                            temperature_2m_max: responseContainer.temperature_2m_max[i],
                            temperature_2m_min: responseContainer.temperature_2m_min[i],
                            sunrise: responseContainer.sunrise[i],
                            sunset: responseContainer.sunset[i]
                        }
                        forecastContainer.push(newElement)
                    } else{
                        console.error(responseContainer.time[i])
                    }
                }
                setForecastDaily(forecastContainer)

        })
        }

        getDailyWeather().then(() =>{
            console.log(forecastDaily)
            setLoading(false)
        })
    }, [])



    if(loading){
        return <div>Loading...</div>
    } else{
        return(
            <div className={styles.daily_container}>
                {forecastDaily.map(item =>(
                    <div key={item.id} className={styles.daily_block}>
                        <div className={styles.daily_img_container}>
                            <WeatherCondition weathercode={item.weathercode}/>
                        </div>
                        <b className={styles.daily_date_bold}>Date: </b><span className={styles.daily_date_data}>{item.time}</span>
                        <b className={styles.daily_maxtemp_bold}>Max Temp: </b><span className={styles.daily_maxtemp_data}>{item.temperature_2m_max}°C</span>
                        <b className={styles.daily_mintemp_bold}>Min Temp: </b><span className={styles.daily_mintemp_data}>{item.temperature_2m_min}°C</span>
                    </div>
                    ))}
            </div>
        )
    }

}
export default ForecastDaily