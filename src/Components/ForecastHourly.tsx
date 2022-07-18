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
    },
    currentTime: string
}

type ForecastObject = {
        "id": number,
        "time": string,
        "temperature_2m": number,
        "apparent_temperature": number,
        "weathercode": number
    }

const  ForecastHourly: React.FC<PropTypes> =(props) =>{

    const [forecastHourly, setForecastHourly] = useState([
        {
            "id": 0,
            "time": '',
            "temperature_2m": 0,
            "apparent_temperature": 0,
            "weathercode": 0

        }
    ])
    const [loading, setLoading] = useState(true)


    useEffect(()=>{

        let responseContainer = {
            "time": ['', '', ''],
            "temperature_2m": [0, 0, 0],
            "apparent_temperature": [0, 0, 0],
            "weathercode": [0, 0, 0]
        }

        let forecastContainer: Array<ForecastObject> = []

        const getHourlyWeather = async () =>{
            setLoading(true)
            await setBaseUrl(props.location.locationParameters)
            let response = await WeatherAPI.getHourlyWeather();
            Promise.all([response]).then(() =>{
                responseContainer = response;
                let currentHour = parseInt(props.currentTime.slice(-5, -3));
                for(let i = currentHour; i < currentHour + 24; i++){
                    if(responseContainer.time[i] !== undefined){
                        let timeFormat = responseContainer.time[i].slice(-5, responseContainer.time[i].length)
                          let newElement: ForecastObject = {
                              id: i,
                              time: timeFormat,
                              temperature_2m: responseContainer.temperature_2m[i],
                              apparent_temperature: responseContainer.apparent_temperature[i],
                              weathercode: responseContainer.weathercode[i]
                          }
                          forecastContainer.push(newElement);
                    } else {
                        console.error(responseContainer.weathercode[i])
                    }
                }
                setForecastHourly(forecastContainer)
                }
            )
        }

        getHourlyWeather().then(() =>{
            setLoading(false)
        })
    }, [])


    if(loading){
        return <div>Loading...</div>
    } else{
        return(
            <div className={styles.hourly_container}>
                {forecastHourly.map(item => (
                    <div key={item.id} className={styles.hour_card}>
                        <WeatherCondition weathercode={item.weathercode}/>
                        <span id={item.id.toString()} style={{
                            fontSize: "24px", fontWeight: "400"
                        }}>{item.time}</span>
                        <span style={{
                            fontSize: "26px", fontWeight: "300",
                            paddingTop: "10px"
                        }}>{item.temperature_2m}°C</span>
                        <div style={{
                            padding: "10px 0"
                        }}>
                            <span style={{
                                fontSize: "18px", fontWeight: "400",
                                paddingTop: "10px"
                            }}>Feels like: </span>
                            <span style={{
                                fontSize: "22px", fontWeight: "300",
                                paddingTop: "10px"
                            }}>{item.apparent_temperature}°C</span>
                        </div>
                         </div>
                    ))}
            </div>
        )
    }

}
export default ForecastHourly