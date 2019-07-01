import React, { Component } from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import getDistance from 'geolib/es/getDistance'
import { geolocated } from 'react-geolocated'

import { burgers } from './burgers.js'
import { humanizeDistance } from './utils'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.burgersWithDistance = this.burgersWithDistance.bind(this)
    this.markers = this.markers.bind(this)
  }

  burgersWithDistance () {
    const distance = (burgerLatitude, burgerLongitude) => {
      if (!this.props.coords || !burgerLatitude || !burgerLongitude) return
      const { latitude: userLatitude, longitude: userLongitude } = this.props.coords

      return getDistance(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: burgerLatitude, longitude: burgerLongitude }
      )
    }

    return burgers.map(burger => (
      burger.positions.map(position => {
        return { ...burger, currentPosition: { ...position, distance: distance(position.lat, position.lng) } }
      }))).flat()
  }

  markers () {
    return this.burgersWithDistance()
      .map(burger => (
        <Marker position={[burger.currentPosition.lat, burger.currentPosition.lng]} key={`${burger.name}-${burger.currentPosition.lat}-${burger.currentPosition.lng}`}>
          <Popup>
            <b>{burger.name}</b> | {burger.currentPosition.address}<br />
            {burger.currentPosition.distance && (<span>Estás a {humanizeDistance(burger.currentPosition.distance)}  de acá.</span>)}<br />
            <a href={burger.webpage} target='_blank' rel="noopener noreferrer">Ver Página</a>
          </Popup>
        </Marker>
      ))
  }

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
            {this.markers()}
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
