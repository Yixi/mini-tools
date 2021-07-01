import { ScrollView, View } from '@tarojs/components'
import React, { useEffect, useState } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import dayjs from 'dayjs'
import styles from './index.module.scss'
import LocationMap from './map'


const LocationPage: React.FC = () => {

  const [locations, setLocations] = useState<any[]>([])

  usePullDownRefresh(() => {
    fetchMyLocation().then(() => {
      Taro.stopPullDownRefresh()
    })
  })

  useEffect(() => {
    let lastTimer = dayjs().unix()
    Taro.startLocationUpdateBackground({
      success: (res) => {
        console.log(res)
        Taro.onLocationChange((location) => {
          console.log(location)
          const current = dayjs().unix()
          if (current - lastTimer > 10) {
            lastTimer = current
            Taro.cloud.database().collection('Location').add({
              data: {
                ...location,
                date: dayjs().toISOString()
              }
            })
          }

        })
      },
      fail: (err) => {
        console.error(err)
      },
    })
    fetchMyLocation()
  }, [])

  const fetchMyLocation = () => {
    const tasks = []
    for (let i = 0; i < 10; i++) {
      const promise = Taro.cloud.database().collection('Location')
        .orderBy('date', 'desc')
        .skip(i * 20)
        .limit(20).get()
      tasks.push(promise)
    }

    return Promise.all(tasks).then(res => {
      setLocations(res.reduce((result, r) => {
          return result.concat(r.data)
        }, [])
      )
    })
  }


  return (
    <View className={styles.wrapper}>
      <ScrollView scrollY className={styles['logs-wrapper']}>
        <View className={styles.logs}>
          {locations.map(l => (
            <View key={l._id} className={styles.log}>
              <text>{dayjs(l.date).format('YYYY-MM-DD HH:mm:ss')}</text>
              {JSON.stringify({
                ...l,
                _id: undefined,
                _openid: undefined,
                date: undefined
              })}
            </View>
          ))}
        </View>
      </ScrollView>
      {locations.length > 0 && <LocationMap locations={locations} />}
    </View>
  )
}

export default LocationPage
