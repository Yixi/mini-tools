import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {sampleSize, includes} from 'lodash'
import {View, Button, Switch} from '@tarojs/components'
import './index.scss'

type IState = {
  morning?: string[],
  afternoon?: string[],
  active?: string[],
  rolling?: boolean,
  isAfternoon?: boolean
};

export default class Index extends Component<{}, IState> {

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
      console.log(data)
      this.setState({
        morning: data.map(d => d.name),
        afternoon: data.filter(d => d.isAfternoon).map(d => d.name)
      })
    })
  }

  get data() {
    return this.state.isAfternoon ? this.state.afternoon : this.state.morning
  }

  onSubmit = () => {
    console.log('submit')
    this.setState({
      rolling: true
    })
    this.loop(20)
  }

  loop = (times: number) => {
    let count = 0
    const random = () => {
      this.setState(({
        active: sampleSize(this.data, 3)
      }))
      count++
      if (count < times) {
        setTimeout(random, 100)
      } else {
        this.setState({rolling: false})
        Taro.cloud.database().collection('UserListActiveLog').add({
          data: {
            time: new Date(),
            active: this.state.active
          }
        })
      }
    }
    random()
  }

  onTypeChange = ({detail}) => {
    this.setState({
      isAfternoon: detail.value,
      active: []
    })
  }

  render() {
    return (
      <View className='dial'>
        <View className='dial-items'>
          {this.data.map(d => (
            <View className={`dial-item ${includes(this.state.active, d) ? 'dial-item-active':''}`}>{d}</View>
          ))}
        </View>
        <View className='dial-action'>
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
