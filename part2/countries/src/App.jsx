import { useState, useEffect } from 'react'
import countryService from './services/countries'

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    countryService
      .getAll()
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  const handleSearchChange = event => setSearch(event.target.value)
  

  if (search === '') {
    return (
      <div>find countries <input value={search} onChange={handleSearchChange} /></div>
    )
  }

  if (countriesToShow.length > 10) {
    return (
      <div>
        <div>find countries <input value={search} onChange={handleSearchChange} /></div>
        <div>Too many matches, specify another filter</div>
      </div>
    )
  }

  if (countriesToShow.length === 1) {
    const country = countriesToShow[0]
    return (
      <div>
        <div>find countries <input value={search} onChange={handleSearchChange} /></div>

        <h1>{country.name.common}</h1>
        <div>Capital {country.capital}</div>
        <div>Area {country.area}</div>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={`${country.flags.png}`}/>
      </div>
    )
  }

  return (
    <>
      <div>find countries <input type='text' name='search' value={search} onChange={handleSearchChange} /></div>

      {countriesToShow.map(country => <div key={country.name.common}>{country.name.common}</div>)}
    </>
  )
}

export default App
