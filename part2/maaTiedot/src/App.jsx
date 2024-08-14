import { useState, useEffect } from "react";
import axios from "axios";

const apiKey = import.meta.env.VITE_SOME_KEY

const Country = ({ country, onShow }) => {
  return (
    <div>
      <p>{country.name.common} <button onClick={() => onShow(country)}>show</button></p> 
    </div>
  );
};

const Countries = ({ filteredCountries, onShow }) => {
  return (
    <div>
      {filteredCountries.map((country) => (
        <Country key={country.cca3} country={country} onShow={onShow} />
      ))}
    </div>
  );
};

const CountryDetail = ({ country, weather }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km²</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>Temperature: {weather.temp} °C</p>
          <p>Weather: {weather.description}</p>
          <img src={weather.icon} alt="weather icon" />
        </div>
      )}
    </div>
  );
};



const App = () => {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  useEffect(() => {
    console.log('Weather API Key:', apiKey);
    if (selectedCountry) {
      axios
        .get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${selectedCountry.capital}`)
        .then((response) => {
          setWeather({
            temp: response.data.current.temp_c,
            description: response.data.current.condition.text,
            icon: response.data.current.condition.icon
          });
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    }
  }, [selectedCountry]);

  const handleChange = (event) => {
    setValue(event.target.value);
    setSelectedCountry(null); // Reset selected country when the input changes
  };

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
    setWeather(null); // Reset weather data when a new country is selected
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div>
      <form>
        countries: <input value={value} onChange={handleChange} />
      </form>
      <pre>
        {filteredCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : filteredCountries.length === 1 ? (
          <CountryDetail country={filteredCountries[0]} weather={weather} />
        ) : selectedCountry ? (
          <CountryDetail country={selectedCountry} weather={weather} />
        ) : (
          <Countries filteredCountries={filteredCountries} onShow={handleShowCountry} />
        )}
      </pre>
    </div>
  );
};

export default App;