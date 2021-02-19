import {Button, View} from "@tarojs/components";
import React, {Component} from 'react'
import cls from 'classnames'
import Taro from '@tarojs/taro'
import {sample, find} from 'lodash'
import './index.scss'

type Item = {
  name: string,
  award: string,
  showed: boolean,
}

type IState = {
  data: Item[],
  staring: boolean,
  active: Item,
  looping: boolean,
  showBoard: boolean
}

export default class Award extends Component<{}, IState> {

  state = {
    data: [],
    staring: false,
    active: {},
    looping: false,
    showBoard: false,
  }

  componentDidMount() {
    Taro.cloud.database().collection('UserAwards').get().then(res => {
      const data = res.data
      console.log(data)
      this.setState({
        data: data.map(d => ({
          name: d.name,
          award: d.award,
          showed: false
        }))
      })
    })
  }

  onStart = () => {
    this.setState({
      staring: true
    }, () => {
      this.onNext()
    })
  }

  onNext = () => {
    this.setState({
      looping: true,
      showBoard: false,
    })
    this.loop(15)
  }

  get nowShowedData() {
    return this.state.data.filter(d => !d.showed)
  }

  loop = (times: number) => {
    let count = 0
    const random = () => {
      this.setState(({
        active: sample(this.nowShowedData)
      }))
      count++
      if (count < times) {
        setTimeout(random, 100)
      } else {
        this.setState(prevState => {
          const item = find(this.state.data, {name: this.state.active.name})
          console.log(item)
          item.showed = true
          return {
            looping: false,
            data: prevState.data,
            showBoard: true
          }
        })
      }
    }
    random()
  }


  onReset = () => {
    this.setState(prevState => {
      return {
        data: prevState.data.map(d => ({...d, showed: false})),
        staring: false,
        pointer: 0
      }
    })
  }

  onClose = () => {
    this.setState({
      showBoard: false
    })
  }

  render() {
    return (
      <View className='award'>
        <View className='award-items'>
          {this.state.data.map(d => (
            <View
              className={cls(
                'award-item',
                {'award-item-active': this.state.active.name === d.name},
                {'award-item-showed': d.showed}
              )}
            >
              {d.name}
            </View>
          ))}
        </View>
        <View className='award-action'>
          {this.state.staring ?
            <Button className='btn' onClick={this.onNext} disabled={this.state.looping}>下一个</Button> :
            <Button className='btn' onClick={this.onStart}>开始</Button>
          }
          <Button className='btn' onClick={this.onReset} disabled={this.state.looping}>重置</Button>
        </View>

        {this.state.showBoard && (
          <View>
            <View className='award-board-overlay' onClick={this.onClose}/>
            <View className='award-board'>
              <View>
                <View>{this.state.active.name}</View>
                <View>{this.state.active.award}</View>
              </View>
            </View>
            <View className='award-board-action'>
              {this.nowShowedData.length > 0 ?
                <Button className='btn' onClick={this.onNext}>下一个</Button> :
                <Button className='btn' onClick={this.onClose}>颁完拉</Button>
              }
            </View>
          </View>
        )
        }
      </View>
    )
  }
}
