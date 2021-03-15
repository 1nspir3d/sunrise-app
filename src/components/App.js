import {useEffect} from 'react'
import {connect, useSelector, useDispatch} from 'react-redux'
import axios from 'axios'
import {setPosition, setSun, setCity, setUndef} from '../actions'

function App() {

    const position = useSelector(state => state.positionReducer)
    const sun = useSelector(state => state.sunReducer)
    const city = useSelector(state => state.cityReducer)
    const dispatch = useDispatch();

    function fail(error) {
        alert(`Currently we can't get your location because: "${error.message}"`)
    }

    function success(response) {
        dispatch(setPosition(response.coords));
    }

    function findCity(e) {
        e.preventDefault()
        const city = document.querySelector('.search-field').value;
        document.querySelector('.search-field').value = '';
        dispatch(setCity(city))

        axios.get('https://api.openweathermap.org/geo/1.0/direct', {
            params: {
                q: city, 
                limit: 1,
                appid: 'a913b85241698a00b1014abe62a5ca0e'
            }
        })
        .then(response => {
            if(response.data[0]) {
                dispatch(setPosition(response.data[0]))
            } else {
                dispatch(setUndef())
            }
        }) 
    }

    useEffect(() => {
        const geo = navigator.geolocation;
        
        if(!geo) {
            fail()
        } else {
            geo.getCurrentPosition(success, fail)
        }
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        if(position.lat && position.lat !== 'Not Found') {
            axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    lat: position.lat,
                    lon: position.lon,
                    appid: 'a913b85241698a00b1014abe62a5ca0e'
                }
            })
            .then((response) => {
                const sunriseTime = new Date(response.data.sys.sunrise * 1000)
                const sunsetTime = new Date(response.data.sys.sunset * 1000)
                const sun = {
                    sunrise: `${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`,
                    sunset: `${sunsetTime.getHours()}:${sunsetTime.getMinutes()}`
                }
                dispatch(setSun(sun))
            })


            axios.get('https://api.openweathermap.org/geo/1.0/reverse', {
                params: {
                    lat: position.lat,
                    lon: position.lon,
                    limit: 1,
                    appid: 'a913b85241698a00b1014abe62a5ca0e'
                }
            })
            .then((response) => {
                dispatch(setCity(response.data[0].name))
            })
        }
    // eslint-disable-next-line
    },[position])



    return(
        <div>
            <form>
                <input type="text" className="search-field"/>
                <button type="submit" onClick={findCity}>GO</button>
            </form>
            <div>City: {city}</div>
            <div>Longitude :{position.lon}</div>
            <div>Latitude: {position.lat}</div>
            <div>Sunrise time: {sun.sunrise}</div>
            <div>Sunset time: {sun.sunset}</div>
        </div>
    )
}

export default connect()(App)