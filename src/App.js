import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import getDistance from 'geolib/es/getDistance'
import { geolocated } from 'react-geolocated'

import Header from './components/header'
import Map from './components/map'
import RestaurantList from './components/list'
import Footer from './components/footer'

import { restaurants } from './restaurants'
import { STATES } from './constants'

import './general.scss'
import './app.scss'

class App extends Component {
  constructor(props) {
    super(props)

    this.restaurantsWithDistance = this.restaurantsWithDistance.bind(this)
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

  render () {
    const center = [-33.4372517, -70.6330319]
    const position = this.props.coords && [this.props.coords.latitude, this.props.coords.longitude]
    const restaurantsWithDistance = this.restaurantsWithDistance()

    return (
      <Router>
        <div className='app'>
          <Header navbarOptions={STATES} />
          <div className='app__container'>
            <Route exact path='' render={() => <Redirect to={`/${STATES.map.key}`} />} />
            <Route path={`/${STATES.map.key}`} component={() =>
              <Map
                center={center}
                position={position}
                zoom={12}
                restaurants={restaurantsWithDistance}
              />
            }
            />
            <Route path={`/${STATES.stores.key}`} component={() => <RestaurantList restaurants={restaurantsWithDistance}/>} />
          </div>
          <Footer navbarOptions={STATES} />
        </div>
      </Router>
    )
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(App)
