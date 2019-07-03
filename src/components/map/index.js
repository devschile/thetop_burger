import React, { Fragment, useState } from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Restaurant from '../restaurant'
import './map.scss'

function MapComponent ({ center, position, zoom, restaurants }) {
  const [restaurant, setRestaurant] = useState({});
  const markers = restaurants
        .map(restaurant => (
          <Marker
            position={[restaurant.currentPosition.lat, restaurant.currentPosition.lng]}
            key={`marker-${restaurant.name}-${restaurant.currentPosition.lat}-${restaurant.currentPosition.lng}`}
            onClick={() => setRestaurant(restaurant)} />
        ))

  return (
    <Fragment>
      <Map className='map-container__map' center={position || center} zoom={12}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {markers}
        {position && (
          <Marker position={position}>
            <Popup>Yo</Popup>
          </Marker>
        )}
      </Map>
      {restaurant.name && (
        <div className='element-container'>
          <div className='element__close'>
            <FontAwesomeIcon icon={faTimes} onClick={() => setRestaurant({})} />
          </div>
          <Restaurant restaurant={restaurant} />
        </div>
      )}
    </Fragment>
  )
}

export default MapComponent
