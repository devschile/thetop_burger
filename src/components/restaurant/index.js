import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faGlobeAmericas, faDirections } from '@fortawesome/free-solid-svg-icons'

import { humanizeDistance } from '../../utils'

import './restaurant.scss'

function Restaurant ({ restaurant, coords }) {
  const origin = coords ? `${coords.latitude},${coords.longitude}` : ''
  const directions = `https://www.google.cl/maps/dir/${origin}/${restaurant.currentPosition.address}`

  return (
    <div className='restaurant' key={`list-${restaurant.name}-${restaurant.currentPosition.lat}-${restaurant.currentPosition.lng}`}>
      <div className='restaurant__title'>{restaurant.name}</div>
      {restaurant.currentPosition.address}
      {restaurant.currentPosition.distance && (<span className='restaurant__distance'> | <FontAwesomeIcon icon={faMapMarkerAlt} /> {humanizeDistance(restaurant.currentPosition.distance)}</span>)}
      <div className='restaurant__icons'>
        <a href={directions} target='_blank' rel="noopener noreferrer"><FontAwesomeIcon className='restaurant-icon' icon={faDirections} /></a>
        <a href={restaurant.webpage} target='_blank' rel="noopener noreferrer"><FontAwesomeIcon className='restaurant-icon' icon={faGlobeAmericas} /></a>
      </div>
    </div>
  )
}

export default Restaurant
