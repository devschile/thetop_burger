import React, { Component } from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { geolocated } from 'react-geolocated'

import './App.css'

class App extends Component {
  render () {
    const center = [-33.4372517, -70.6330319]
    const position = this.props.coords && [this.props.coords.latitude, this.props.coords.longitude]

    return (
      <div className="app">
        <h1 className='app__title'>TheTop - BurgerMap!</h1>
        <div className='map-container'>
          <Map className='map-container__map' center={position || center} zoom={12}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            {position && (
              <Marker position={position}>
                <Popup>Yo</Popup>
              </Marker>
            )}
          </Map>
        </div>
      </div>
    )
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(App)
