import { View } from '@tarojs/components'
import React, { useEffect, useState } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import styles from './index.module.scss'
import dayjs from 'dayjs'

const LocationPage: React.FC = () => {

  const [locations, setLocations] = useState<any[]>([])

  usePullDownRefresh(() => {
    fetchMyLocation().then(() => {
      Taro.stopPullDownRefresh()
    })
  })

  useEffect(() => {
    Taro.startLocationUpdateBackground({
      success: (res) => {
        console.log(res)
        Taro.onLocationChange((location) => {
          console.log(location)
          Taro.cloud.database().collection('Location').add({
            data: {
              ...location,
              date: dayjs().toISOString()
            }
          })
        })
      },
      fail:(err) => {
        console.error(err)
      },
    })
    fetchMyLocation()
  }, [])

  const fetchMyLocation = () => {
    return Taro.cloud.database().collection('Location').get().then((res) => {
      setLocations(res.data)
    })
  }

  return (
    <View className={styles.wrapper}>
      {locations.map(l => (
        <View key={l._id} className={styles.log}>
          <text>{dayjs(l.date).format('YYYY-MM-DD HH:mm:ss')}</text> {JSON.stringify({
            ...l,
            _id: undefined,
            _openid: undefined,
            date: undefined
          })}
        </View>
      ))}
    </View>
  )
}

export default LocationPage
