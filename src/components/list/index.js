import React from 'react'
import Restaurant from '../restaurant'

import './list.scss'

function List ({ restaurants }) {
  const orderedRestaurants =
    restaurants.sort((a, b) => a.currentPosition && b.currentPosition && a.currentPosition.distance - b.currentPosition.distance)
        .map((restaurant, index) => (
        <Restaurant restaurant={restaurant} key={`list-${index}`}/>
      ))

  return (
    <div className='list-container'>
      <div className='list'>
        {orderedRestaurants}
      </div>
    </div>
  )
}

export default List
