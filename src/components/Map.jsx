import React from 'react'
import {showDataOnMap} from './util'
import {Map as LeafletMap,TileLayer} from 'react-leaflet';
const Map = ({center,zoom,countries,casesType}) => {

    return (
        <div className="map">
 <LeafletMap center={center} zoom={zoom}>
     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors' />
     {/* loop through countires and circles */}
     {showDataOnMap(countries,casesType)}
 </LeafletMap>
        </div>
    )
}

export default Map
