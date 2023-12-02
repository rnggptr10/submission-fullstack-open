import React, { useEffect, useState } from "react";
import countriesService from "./services/countries";

const Filter = (props) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Update dataFilter when input value is empty
    if (inputValue === "") {
      props.setDataFilter(props.countries);
    } else {
      const filteredCountries = props.countries.filter((person) =>
        person.name.common.toLowerCase().includes(inputValue.toLowerCase())
      );
      if (filteredCountries.length > 10) {
        props.setDataFilter([]);
      } else {
        props.setDataFilter(filteredCountries);
      }
      console.log("length countries by filter:", filteredCountries.length);
    }
  }, [inputValue, props.countries, props.setDataFilter]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <div>
        filter countries
        <input type="text" value={inputValue} onChange={handleChange} />
      </div>
    </>
  );
};

const Countries = (props) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleClick = async (e, name) => {
    e.preventDefault();
    try {
      const country = await countriesService.getCountryByName(name);
      props.setSelectedCountry(country.data);
    } catch (error) {
      console.error("Error fetching country details:", error);
    }
  };

  if (!props.loadingCountries) {
    return (
      <>
        {props.dataFilter.length > 0 ? (
          props.dataFilter.map((country) => (
            <div key={country.name.common}>
              {props.dataFilter.length === 1 ? (
                <CountriesDetail country={country} />
              ) : (
                <>
                  {country.name.common}{" "}
                  <button onClick={(e) => handleClick(e, country.name.common)}>
                    show
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>Please specify your query</p>
        )}
      </>
    );
  } else {
    return <p>still running</p>;
  }
};

const CountriesDetail = (props) => {
  return (
    <>
      <h1>{props.country.name.common}</h1>
      <p>capital {props.country.capital}</p>
      <p>area {props.country.area}</p>
      <b>languages : </b>
      <ul>
        {Object.values(props.country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={props.country.flags.png} alt="" />
    </>
  );
};

const App = () => {
  const [countries, setDataCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [dataFilter, setDataFilter] = useState(countries);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const fetchAllCountries = async () => {
    try {
      const countries = await countriesService.getAll();
      setDataCountries(countries.data);
      setLoadingCountries(false);
    } catch (error) {
      console.log("still running");
    }
  };

  useEffect(() => {
    fetchAllCountries();
    console.log(countries);
  }, []);

  useEffect(() => {
    setDataFilter(countries);
  }, [countries]);

  return (
    <>
      <Filter countries={countries} setDataFilter={setDataFilter} />
      {selectedCountry ? (
        <CountriesDetail country={selectedCountry} />
      ) : (
        <Countries
          loadingCountries={loadingCountries}
          dataFilter={dataFilter}
          setSelectedCountry={setSelectedCountry}
        />
      )}
    </>
  );
};

export default App;
