import React, { Component } from 'react'

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import getDistance from 'geolib/es/getDistance'
import { geolocated } from 'react-geolocated'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Header from './components/header'
import Restaurant from './components/restaurant'
import RestaurantList from './components/list'

import { restaurants } from './restaurants'
import { STATES } from './constants'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showState: STATES.map.key,
      restaurant: {}
    }

    this.restaurantsWithDistance = this.restaurantsWithDistance.bind(this)
    this.markers = this.markers.bind(this)
    this.onSelect = this.onSelect.bind(this)
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

  onSelect (state) {
    this.setState({ showState: state })
  }

  render () {
    const { showState, restaurant } = this.state
    const center = [-33.4372517, -70.6330319]
    const position = this.props.coords && [this.props.coords.latitude, this.props.coords.longitude]
    const restaurantsWithDistance = this.restaurantsWithDistance()

    return (
      <div className="app">
        <Header
          showState={showState}
          onSelect={this.onSelect}
          navbarOptions={STATES}
        />
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
        {showState === STATES.map.key && restaurant.name && (
          <div className='element-container'>
            <div className='element__close'>
              <FontAwesomeIcon icon={faTimes} onClick={() => this.setState({restaurant: {}})} />
            </div>
            <Restaurant restaurant={restaurant} />
          </div>
        )}
        {showState === STATES.list.key && <RestaurantList restaurants={restaurantsWithDistance}/>}
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
