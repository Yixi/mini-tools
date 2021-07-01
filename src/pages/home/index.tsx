import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'


const HomePage: React.FC = () => {

  const menu = [
    {
      label: '摇车',
      image: 'cloud://tools-6gld6gv529a23663.746f-tools-6gld6gv529a23663-1304861075/3.png',
      url: '/pages/dial/index'
    },
    // {
    //   label: '颁奖',
    //   image: 'cloud://tools-6gld6gv529a23663.746f-tools-6gld6gv529a23663-1304861075/2.png',
    //   url: '/pages/award/index'
    // },
    {
      label: '老大哥看着你',
      image: 'cloud://tools-6gld6gv529a23663.746f-tools-6gld6gv529a23663-1304861075/1.png',
      url: '/pages/location/index'
    }
  ]

  const goTo = (url: string) => {
    Taro.navigateTo({ url })
  }

  return (
    <View className='home'>
      {
        menu.map((m) => (
          <View className='home-item' hoverClass='home-item-hover' onClick={() => goTo(m.url)} key={m.url}>
            <Image src={m.image} mode='aspectFit' />
            <View>{m.label}</View>
          </View>
        ))
      }
    </View>
  )
}

export default HomePage
