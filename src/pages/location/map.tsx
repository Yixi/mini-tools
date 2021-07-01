import { Map, View } from '@tarojs/components'
import React from 'react'
import { MapProps } from '@tarojs/components/types/Map'

import styles from './index.module.scss'


interface LocationMapProps {
  locations: any[]
}

const LocationMap: React.FC<LocationMapProps> = ({ locations }) => {


  const lastLocation = locations[0]

  const polyline: MapProps.polyline = {
    points: locations.map(l => ({
      latitude: l.latitude,
      longitude: l.longitude
    })),
    color: '#4734BE',
    arrowLine: true,
    width: 3
  }

  const markers: MapProps.marker[] = locations.map(l => ({
    latitude: l.latitude,
    longitude: l.longitude,
    iconPath: 'cloud://tools-6gld6gv529a23663.746f-tools-6gld6gv529a23663-1304861075/marker.png',
    joinCluster: true
  }))

  return (
    <View className={styles.map}>
      <Map longitude={lastLocation?.longitude} latitude={lastLocation?.latitude} polyline={[polyline]} markers={markers} />
    </View>
  )
}

export default LocationMap
