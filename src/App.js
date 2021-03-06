import React, { Component } from 'react'

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import getDistance from 'geolib/es/getDistance'
import { geolocated } from 'react-geolocated'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faGlobeAmericas, faDirections, faTimes } from '@fortawesome/free-solid-svg-icons'

import { restaurants } from './restaurants.js'
import { humanizeDistance } from './utils'
import './App.css'

function Restaurant ({ restaurant, coords }) {
  const origin = coords ? `${coords.latitude},${coords.longitude}` : ''
  const directions = `https://www.google.cl/maps/dir/${origin}/${restaurant.currentPosition.address}`

  return (
    <div className='list-element' key={`list-${restaurant.name}-${restaurant.currentPosition.lat}-${restaurant.currentPosition.lng}`}>
      <div className='list-element__title'>{restaurant.name}</div>
      {restaurant.currentPosition.address}
      {restaurant.currentPosition.distance && (<span className='restaurant__distance'> | <FontAwesomeIcon icon={faMapMarkerAlt} /> {humanizeDistance(restaurant.currentPosition.distance)}</span>)}
      <div className='list-element__icons'>
        <a href={directions} target='_blank' rel="noopener noreferrer"><FontAwesomeIcon className='restaurant-icon' icon={faDirections} /></a>
        <a href={restaurant.webpage} target='_blank' rel="noopener noreferrer"><FontAwesomeIcon className='restaurant-icon' icon={faGlobeAmericas} /></a>
      </div>
    </div>
  )
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showList: false,
      restaurant: {}
    }

    this.restaurantsWithDistance = this.restaurantsWithDistance.bind(this)
    this.markers = this.markers.bind(this)
  }

  restaurantsWithDistance () {
    const distance = (restaurantLatitude, restaurantLongitude) => {
      if (!this.props.coords || !restaurantLatitude || !restaurantLongitude) return
      const { latitude: userLatitude, longitude: userLongitude } = this.props.coords

      return getDistance(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: restaurantLatitude, longitude: restaurantLongitude }
      )
    }

    return restaurants.map(restaurant => (
      restaurant.positions.map(position => {
        return { ...restaurant, currentPosition: { ...position, distance: distance(position.lat, position.lng) } }
      }))).flat()
  }

  markers () {
    return this.restaurantsWithDistance()
      .map(restaurant => (
        <Marker position={[restaurant.currentPosition.lat, restaurant.currentPosition.lng]} key={`marker-${restaurant.name}-${restaurant.currentPosition.lat}-${restaurant.currentPosition.lng}`} onClick={() => this.setState({restaurant: restaurant})} />
      ))
  }

  list () {
    return this.restaurantsWithDistance()
      .sort((a, b) => a.currentPosition.distance - b.currentPosition.distance)
      .map(restaurant => (
        <Restaurant restaurant={restaurant} />
      ))
  }

  render () {
    const { showList, restaurant } = this.state
    const center = [-33.4372517, -70.6330319]
    const position = this.props.coords && [this.props.coords.latitude, this.props.coords.longitude]

    return (
      <div className="app">
        <div className='navbar'>
          <h1 className='navbar__title'>TheTop - BurgerMap!</h1>
          <div className='navbar__options'>
            <div className={`navbar__option ${!showList ? 'navbar__option--selected' : ''}`} onClick={() => this.setState({showList: false})}>Mostrar Mapa</div>
            <div className={`navbar__option ${showList ? 'navbar__option--selected' : ''}`} onClick={() => this.setState({showList: true})}>Mostrar Lista</div>
          </div>
        </div>
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
        {!showList && restaurant.name && (
          <div className='element-container'>
            <div className='element__close'>
              <FontAwesomeIcon icon={faTimes} onClick={() => this.setState({restaurant: {}})} />
            </div>
            <Restaurant restaurant={restaurant} />
          </div>
        )}
       {showList && (
         <div className='list-container'>
           <div className='list'>
             {this.list()}
           </div>
         </div>
        )}
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
