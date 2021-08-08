import React from 'react'
import Card from './Card'

function CovidSummary(props) {

    let { totalConfirmed, totalRecovered, totalDeath, country } = props

    return (
        <div>
            <div>
                <div >
                    <h1>{country === '' ? 'World Wide Corona Tracker' : country}</h1>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card >
                            <span>total Confirmed</span><br />
                            <span>{totalConfirmed}</span>
                        </Card>
                        <Card >
                            <span>total Recovered</span><br />
                            <span>{totalRecovered}</span>
                        </Card>
                        <Card >
                            <span>total Death</span><br />
                            <span>{totalDeath}</span>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CovidSummary
