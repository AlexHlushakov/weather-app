import React, { useEffect, useState} from 'react';
import CurrentWeather from "./CurrentWeather";
import ForecastHourly from "./ForecastHourly";
import ForecastDaily from "./ForecastDaily";
import {LocationAPI} from "../api/api";
import styles from "./Weather.module.css"


const Weather = () =>{

    const [loading, setLoading] = useState(true)
    const [location, setLocation] = useState({locationParameters: {latitude: 50.4375, longitude: 30.5625, timeZone: 'Europe/Moscow'}, locationCity: 'Kiev', country_code: 'UA'})
    const [isLocationStored, setIsLocationStored] = useState(true)
    const [searchResult, setSearchResult] = useState ([
        {"id": 0,
        "name": '',
        "latitude": 0,
        "longitude": 0,
        "country_code": '',
        "admin1_id": 0,
        "timezone": '',
        "population": 0,
        "country_id": 0,
        "country": '',
        "admin1": ''}
    ] )
    const [inputValue, setInputValue] = useState('')


    useEffect(() =>{

        setLoading(true);

        const getLocalLocation = () =>{
            const locationLocal = localStorage.getItem('location')
            if (locationLocal){
                setLocation(JSON.parse(locationLocal))
            } else{setIsLocationStored(false)}
        }

    getLocalLocation();
        setLoading(false)
}, [])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{

        setInputValue(event.target.value)
    }

    const keyPress = (event: React.KeyboardEvent) =>{
        if(event.key === 'Enter'){
            searchLocation(inputValue)
        }
    }

    const searchLocation = (city: string) =>{
        LocationAPI.searchLocation(city).then(response => setSearchResult(response))
    }

    const setNewLocation = (event: React.MouseEvent) =>{
        // @ts-ignore
        let cityId = parseInt(event.target.parentNode.id, 10);


        for(let i = 0; i < searchResult.length; i++){
            if(searchResult[i].id === cityId){
                let newLocation = {locationParameters: {latitude: searchResult[i].latitude,
                        longitude: searchResult[i].longitude, timeZone: searchResult[i].timezone},
                    locationCity: `${searchResult[i].name}, ${searchResult[i].country_code}`, country_code: searchResult[i].country_code}
                setLocation(newLocation)
                localStorage.setItem('location', JSON.stringify(newLocation));
                setIsLocationStored(true);
            }
        }

        console.log(location)
    }


    if(loading){
        return <div>Loading...</div>
    } else{
        if(isLocationStored){
           return(
               <div className={styles.container}>
                   <CurrentWeather location={location} changeLocation={setIsLocationStored}/>
                   <ForecastHourly location={location}/>
                   <ForecastDaily location={location}/>
               </div>
           )
        } else{
            return(
                <div>
                    <div>
                        <input type="text" placeholder="Enter City Name" onKeyDown={keyPress} onChange={handleChange} value={inputValue} />
                    </div>
                    <div>
                        {searchResult.map(city =>(
                            <div key={city.id} id={city.id.toString()} onClick={setNewLocation}>
                                <span>{city.name} </span>
                                <span>{city.latitude} </span>
                                <span>{city.longitude} </span>
                                <span>{city.country} </span>
                                <span>{city.admin1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
    }


}
export default Weather