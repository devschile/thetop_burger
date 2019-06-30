import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import './App.css'

function App() {
  const position = [-33.4372517, -70.6330319]

  return (
    <div className="app">
      <h1 className='app__title'>TheTop - BurgerMap!</h1>
      <div className='map-container'>
        <Map className='map-container__map' center={position} zoom={12}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={position}>
            <Popup>Yo</Popup>
          </Marker>
        </Map>
      </div>
    </div>
  )
}

export default App
