import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import {View, Image} from '@tarojs/components';

export default class Home extends Component<{}, {}> {

  menu = [
    {
      label: '摇车',
      image: 'cloud://tools-6gld6gv529a23663.746f-tools-6gld6gv529a23663-1304861075/1.png',
      url: '/pages/dial/index'
    },
    {
      label: '颁奖',
      image: 'cloud://tools-6gld6gv529a23663.746f-tools-6gld6gv529a23663-1304861075/2.png',
      url: '/pages/award/index'
    }
  ]

  goTo = (url:string) => {
    Taro.navigateTo({url})
  }

  render() {
    return (
      <view className='home'>
        {
          this.menu.map((m) => (
            <View className='home-item' hoverClass='home-item-hover' onTap={() => this.goTo(m.url)}>
              <Image src={m.image} mode='aspectFit' />
              <view>{m.label}</view>
            </View>
          ))
        }
      </view>
    )
  }
}
