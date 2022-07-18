import React, { useEffect, useState} from 'react';
import CurrentWeather from "./CurrentWeather";
import ForecastDaily from "./ForecastDaily";
import {LocationAPI} from "../api/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Weather.module.scss"


const Weather = () =>{

    const notifyError = (msg: string) => {
        toast.error(msg)
    }

    const [loading, setLoading] = useState(true)
    const [location, setLocation] = useState({locationParameters: {latitude: 50.4375, longitude: 30.5625, timeZone: 'Europe/Moscow'}, locationCity: 'Kiev', country_code: 'UA'})
    const [isLocationStored, setIsLocationStored] = useState(true)
    const [searchResult, setSearchResult] = useState ([
        {"id": 0,
        "name": 'No name',
        "latitude": 0,
        "longitude": 0,
        "country_code": '',
        "admin1_id": 0,
        "timezone": '',
        "population": 0,
        "country_id": 0,
        "country": 'No Data',
        "admin1": 'No Data'}
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
        LocationAPI.searchLocation(city).then(response => {
            console.log(response)
            if(response !== undefined){
                setSearchResult(response)
            } else {
                notifyError("City does not exist or typo")
            }
        })
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
                   <ForecastDaily location={location}/>
               </div>
           )
        } else{
            return(
                <div className={styles.search_container}>
                    <div>
                        <input type="text" placeholder="Enter City Name" onKeyDown={keyPress} onChange={handleChange} value={inputValue} />
                    </div>
                    <div style={{
                        marginBottom: "50px"
                    }}>
                        {searchResult.map(city =>(
                            <div className={styles.search_card} key={city.id} id={city.id.toString()} onClick={setNewLocation}>
                                <span className={styles.search_card_name}>{city.name} </span>
                                <span className={styles.search_card_latitude}>{city.latitude} </span>
                                <span className={styles.search_card_longitude}>{city.longitude} </span>
                                <span className={styles.search_card_country}>{city.country} </span>
                                <span className={styles.search_card_area}>{city.admin1}</span>
                            </div>
                        ))}
                    </div>
                    <ToastContainer/>
                </div>
            )
        }
    }


}
export default Weather