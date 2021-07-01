export default {
  pages: [
    'pages/home/index',
    'pages/dial/index',
    'pages/award/index',
    'pages/location/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  requiredBackgroundModes: ['location'],
  'permission': {
    'scope.userLocation': {
      'desc': '你的位置信息将用于老大哥观察你' // 高速公路行驶持续后台定位
    }
  }

}
