import React, {useEffect, useState} from 'react';
import {setBaseUrl, WeatherAPI} from "../api/api";
import clear from '../assets/img/clear.png'
import mainlyClear from '../assets/img/mainly-clear.png'
import partlyCloudy from '../assets/img/partly-cloudy.png'
import overcast from '../assets/img/overcast.png'


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


    const getWeatherCondition = (code:number) =>{
        switch (code) {
            case 0:{
                return clear
            }
            case 1:{
                return mainlyClear
            }
            case 2:{
                return partlyCloudy
            }
            case 3:{
                return overcast
            }
        }
    }

    const handleClick = () =>{
        props.changeLocation(false)
    }



    if(loading){
        return <div>Loading...</div>
    } else{
        return(
            <main>
                <div>
                    <h2>Alex Weather</h2>
                    <b>Location: </b><span>{props.location.locationCity}</span>
                    <button onClick={handleClick}>Change Location</button>
                    <br/>
                    <a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>
                    <div>
                            <div>
                                <img src={getWeatherCondition(currentWeather.weathercode)} alt=""/>
                            </div>
                            <span>{Math.round(currentWeather.temperature)}°C</span>
                            <p>{currentWeather.time.replace('T', ' ')}</p>
                    </div>
                </div>
            </main>
        )
    }

}
export default CurrentWeather