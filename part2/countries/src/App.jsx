import { useState, useEffect } from 'react'
import countryService from './services/countries'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState({})
  const [search, setSearch] = useState('')
  const [weather, setWeather] = useState({})

  useEffect(() => {
    countryService
      .getAll()
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = 
    search === '' ?
    [] : countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  const handleSearchChange = event => {
    setSearch(event.target.value)

    if (countriesToShow.length === 1 && Object.hasOwn(countriesToShow[0], 'name')) {
      countryService
        .getOne(countriesToShow[0].name.common)
        .then(response => {
          setCountry(response.data)
        })
    }
  }

  if (countriesToShow.length > 10) {
    return (
      <div>
        <div>find countries <input value={search} onChange={handleSearchChange} /></div>
        <div>Too many matches, specify another filter</div>
      </div>
    )
  }

  if (Object.hasOwn(country, 'name') && (countriesToShow.length === 1)) {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })

    return (
      <div>
        <div>find countries <input value={search} onChange={handleSearchChange}/></div>

        <h1>{country.name.common}</h1>
        <div>Capital {country.capital}</div>
        <div>Area {country.area}</div>
        
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>

        <img src={`${country.flags.png}`}/>

        <h2>Weather in {country.capital}</h2>
        <div>Temperature {weather.main?.temp} Kelvin</div>
        <img src={`https://openweathermap.org/img/wn/${weather.weather?.[0].icon}@2x.png`}/>
        <div>Wind {weather.wind?.speed} m/s</div>
      </div>
    )
  }

  return (
    <div>
      <div>find countries <input value={search} onChange={handleSearchChange}/></div>
      
      {countriesToShow.map(country => 
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={() => {
            setCountry(country)
            setSearch(country.name.common)
          }}>
            Show
          </button>
        </div>
      )}
    </div>
  )



}

export default App
