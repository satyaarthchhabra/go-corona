import React, { useState } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import axios from "axios";
import './App.css';
import Infobox from './components/Infobox'
import Map from './components/Map'
import Table from './components/Table'
import LineGraphs from './components/LineGraphs'
import { sortData,prettyPrintStat } from './components/util'
import 'leaflet/dist/leaflet.css';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountires, setMapCountires] = useState([]);
  const [casesType, setCasesType] = useState('cases');


  React.useEffect(async () => {
    const response = await axios.get("https://disease.sh/v3/covid-19/all")
    setCountryInfo(response.data)
  }, [])
  // get countries data is here 
  const getCountriesData = async () => {
    const response = await axios.get(" https://disease.sh/v3/covid-19/countries")

    const countries = response.data.map(country => (
      {
        name: country.country,
        value: country.countryInfo.iso2
      }
    ))
    const sortedData = sortData(response.data);
    setTableData(sortedData)
    setCountries(countries);

    setMapCountires(await response.data);
  }
  // get countries data is khatam
  React.useEffect(() => {

    getCountriesData();
  }, [])
  const onCountryChange = async (e) => {
    const CountryCode = e.target.value;
    setCountry(CountryCode);

    const url = CountryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${CountryCode}`

    const response = await axios.get(url);

    setCountry(CountryCode);
    setCountryInfo(await response.data);
    
    setMapCenter([ response.data.countryInfo.lat, response.data.countryInfo.long ])
    setMapZoom(4);

  }
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          {/* header  */}
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            {/* title+  select input dropdown field  */}
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide" >worldwide</MenuItem>
              {countries.map(country => {
                return <MenuItem value={country.value} key={country.name}>{country.name}</MenuItem>
              })}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/* infoboxes   */}
          <Infobox active={casesType === 'cases'}
          onClick={e=>setCasesType('cases')}
          title="covid cases " total={prettyPrintStat(countryInfo.cases)} cases={prettyPrintStat(countryInfo.todayCases)} isRed />
          <Infobox active={casesType === 'recovered'}  onClick={e=>setCasesType('recovered')}
          title="recovered cases " total={prettyPrintStat(countryInfo.recovered)} cases={prettyPrintStat(countryInfo.todayRecovered)} />
          <Infobox active={casesType === 'deaths'}  onClick={e=>setCasesType('deaths')}
          title="death cases " total={prettyPrintStat(countryInfo.deaths)} cases={prettyPrintStat(countryInfo.todayDeaths)} isRed />



        </div>

        {/* {Map} */}
        <Map casesType={casesType} center={mapCenter} countries={mapCountires} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>live cases by country</h3>
          {/* table */}
          <Table countries={tableData} />
          <h3>world wide new {casesType} </h3>

          {/* graphs  */}
          <LineGraphs className="app__graph" casesType={casesType} />
        </CardContent>

      </Card>
    </div>
  );
}

export default App;
