import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import styles from './index.module.scss'


const HomePage: React.FC = () => {

  const menu = [
    {
      label: '摇车',
      image: 'cloud://cloud1-0gfg77s3f4c83c23.636c-cloud1-0gfg77s3f4c83c23-1304861075/3.png',
      url: '/pages/dial/index'
    },
    // {
    //   label: '颁奖',
    //   image: 'cloud://tools-6gld6gv529a23663.746f-tools-6gld6gv529a23663-1304861075/2.png',
    //   url: '/pages/award/index'
    // },
    // {
    //   label: '老大哥看着你',
    //   image: 'cloud://tools-6gld6gv529a23663.746f-tools-6gld6gv529a23663-1304861075/1.png',
    //   url: '/pages/location/index'
    // }
  ]

  const goTo = (url: string) => {
    Taro.navigateTo({ url })
  }

  return (
    <View className={styles.home}>
      <View className={styles.menus}>
        {
          menu.map((m) => (
            <View className={styles['home-item']} hoverClass={styles['home-item-hover']} onClick={() => goTo(m.url)}
              key={m.url}
            >
              <Image src={m.image} mode='aspectFit' />
              <View>{m.label}</View>
            </View>
          ))
        }
      </View>
    </View>
  )
}

export default HomePage
