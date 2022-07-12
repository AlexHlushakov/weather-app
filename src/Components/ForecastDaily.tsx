import React, {useEffect, useState} from 'react';
import {setBaseUrl, WeatherAPI} from "../api/api";


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
            <div>
                {forecastDaily.map(item =>(
                    <div key={item.id}>
                        <b>Date: </b><span>{item.time}</span>
                        <b>Max Temp: </b><span>{item.temperature_2m_max}°C</span>
                        <b>Min Temp: </b><span>{item.temperature_2m_min}°C</span>
                    </div>
                    ))}
            </div>
        )
    }

}
export default ForecastDaily