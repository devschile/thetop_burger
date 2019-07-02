import React, { Component } from 'react'

import getDistance from 'geolib/es/getDistance'
import { geolocated } from 'react-geolocated'

import Header from './components/header'
import Map from './components/map'
import RestaurantList from './components/list'

import { restaurants } from './restaurants'
import { STATES } from './constants'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showState: STATES.map.key
    }

    this.restaurantsWithDistance = this.restaurantsWithDistance.bind(this)
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

  onSelect (state) {
    this.setState({ showState: state })
  }

  render () {
    const { showState } = this.state
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
        {showState === STATES.map.key && (
          <Map
            center={center}
            position={position}
            zoom={12}
            restaurants={restaurantsWithDistance}
          />
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
