import './App.css';
import LineGraph from './components/LineGraph';
import CovidSummary from './components/CovidSummary';
import React, { useEffect, useState } from 'react';
import axios from './axios';






function App() {
  let [totalConfirmed, setTotalConfirmed] = useState(0)
  let [totalRecovered, setTotalRecovered] = useState(0)
  let [totalDeath, setTotalDeath] = useState(0)
  let [loading, setloading] = useState(true)
  let [covidSummary, setCovidSummary] = useState({})
  let [country, setCountry] = useState('')
  let [days, setDays] = useState(7)
  let [coronaCountAr, setCoronaCountAr] = useState([])
  let [label, setLable] = useState([])

  useEffect(() => {

    axios.get(`/summary`)
      .then((res) => {
        setloading(false)

        if (res.status === 200) {
          setTotalConfirmed(res.data.Global.TotalConfirmed)
          setTotalRecovered(res.data.Global.NewRecovered)
          setTotalDeath(res.data.Global.TotalDeaths)
          setCovidSummary(res.data)
        }

      })
      .catch((error) => {
        console.log(error);
      })




  }, [])

  const formatDate = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = `0${d.getMonth() + 1}`.slice(-2)
    const _date = d.getDate()
    return `${year}-${month}-${_date}`
  }

  const countryHandler = (e) => {
    setCountry(e.target.value)
    const d = new Date()
    const to = formatDate(d)
    const from = formatDate(d.setDate(d.getDate() - days))

    getCoronaReportByDateRange(e.target.value, from, to)
  }

  // const dateHandler = (e) => {

  //   const d = new Date()
  //   const to = formatDate(d)
  //   const from = formatDate(d.setDate(d.getDate() - e.target.value))
  //   console.log(from, to)
  //   getCoronaReportByDateRange(country, from, to)
  //   setDays(e.target.value)
  // }


  const getCoronaReportByDateRange = (country, from, to) => {


    axios.get(`/live/country/${country}/status/confirmed?from=${from}T00:00:00Z&to=${to}1T00:00:00Z`)
      .then((res) => {
        const yAxisCoronaCount = res.data.map((d) => d.Active)
        const xAxisLabel = res.data.map((d) => d.Date)



        let covidDetails = covidSummary.Countries.filter((d) => { return d.Slug === country })
        setTotalConfirmed(covidDetails[0].TotalConfirmed)
        setCoronaCountAr(yAxisCoronaCount)
        setTotalRecovered(covidDetails[0].TotalRecovered)
        setTotalDeath(covidDetails[0].TotalDeaths)
        setLable(xAxisLabel)

      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (loading) {
    return <p style={{ textAlign: 'center' }}>fetching data from server</p>
  }

  return (
    <div className="App">
      <CovidSummary totalConfirmed={totalConfirmed} totalRecovered={totalRecovered} totalDeath={totalDeath} country={country}></CovidSummary>
      <div>
        <select value={country} onChange={countryHandler}>
          <option value="">Select country</option>
          {covidSummary.Countries && covidSummary.Countries.map(function (country) { return <option key={country.Country} value={country.Slug}> {country.Country}</option> })}
        </select>
        {/* <select value={days} onChange={dateHandler}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select> */}
      </div>
      <LineGraph yAxis={coronaCountAr} label={label} />
    </div>
  );
}

export default App;
