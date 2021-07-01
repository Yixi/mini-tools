// @ts-ignore
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { shuffle, includes, random } from 'lodash'
import { View, Button, Switch, Text } from '@tarojs/components'
import './index.scss'

type IData = { name: string, weight: number, isAfternoon: boolean, recharge: number }

type IState = {
  morning?: IData [],
  afternoon?: IData  [],
  active?: IData[],
  rolling?: boolean,
  isAfternoon?: boolean
};

export default class Index extends Component<null, IState> {

  state = {
    morning: [],
    afternoon: [],
    active: [],
    rolling: false,
    isAfternoon: false
  }

  componentDidMount() {
    Taro.cloud.database().collection('UserLists').get().then(res => {
      const data = res.data
      let parsedData = data.map(d => ({
        name: d.name,
        recharge: d.recharge || 0,
        weight: 5 + (d.recharge || 0),
        isAfternoon: d.isAfternoon
      }))
      parsedData = shuffle(parsedData)
      this.setState({
        morning: parsedData,
        afternoon: parsedData.filter(d => d.isAfternoon)
      })
    })
  }

  get data() {
    return this.state.isAfternoon ? this.state.afternoon : this.state.morning
  }

  get weightSum() {
    return this.data.reduce((result, d) => {
      return result + d.weight
    }, 0)
  }

  sampleSize(count = 1) {
    const randomLoop = () => {
      let r = random(0, this.weightSum - 1)
      for (let i = 0; i < this.data.length; i++) {
        r -= this.data[i].weight
        if (r < 0) {
          return this.data[i]
          break
        }
      }
    }
    const result = []
    while (result.length < count) {
      const pick = randomLoop()
      if (!includes(result, pick)) {
        result.push(pick)
      }
    }
    return result
  }

  onSubmit = () => {
    this.setState({
      rolling: true
    })
    this.loop(20)
  }

  loop = (times: number) => {
    let count = 0
    const randomLoop = () => {
      this.setState(({
        active: this.sampleSize(3)
      }))
      count++
      if (count < times) {
        setTimeout(randomLoop, 100)
      } else {
        this.setState({ rolling: false })
        Taro.cloud.database().collection('UserListActiveLog').add({
          data: {
            time: new Date(),
            active: this.state.active.map(d => d.name)
          }
        })
      }
    }
    randomLoop()
  }

  onTypeChange = ({ detail }) => {
    this.setState({
      isAfternoon: detail.value,
      active: []
    })
  }

  render() {
    const vip = this.state.morning.filter(d => d.recharge > 0).sort((l, r) => {
      return l.recharge > r.recharge ? -1 : 1
    })
    return (
      <View className='dial'>
        <View className='dial-items'>
          {this.data.map(d => (
            <View className={`dial-item ${includes(this.state.active, d) ? 'dial-item-active' : ''}`} key={d.name}>{d.name}</View>
          ))}
        </View>
        <View className='dial-action'>

          <View className='dial-vip'>
            <Text>赞助榜</Text>
            {vip.map(d => (
              <Text key={d.name}>{d.name}</Text>
            ))}
          </View>
          <View className='dial-switch'>
            {this.state.isAfternoon ? '晚上' : '早晨'}
            <Switch color='#03a69a' onChange={this.onTypeChange} disabled={this.state.rolling} />
          </View>
          <Button onClick={this.onSubmit} className='btn' disabled={this.state.rolling}>开始</Button>
        </View>
      </View>
    )
  }
}
