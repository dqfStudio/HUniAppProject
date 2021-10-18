<template>
  <view class="footer" :style="{'padding-bottom': safeAreaHeight ? safeAreaHeight - 15 + 'px' : 5 + 'px'}">
    <view class="list" @click="goto(item)" v-for="(item, index) in list" :key="index" :class="{active: item.flag}">
      <image :src="item.icon" class="list-img" mode="widthFix" v-if="!item.flag"></image>
      <image :src="item.active" class="list-img" mode="widthFix" v-else></image>
	 <text class="list-name" :style="{'color': item.flag ? '#ff7f00' : '#999999'}">{{item.name}}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safeAreaHeight: 0,
      list: []
    }
  },
  // watch: {
  //   '$store.state.userInfo.yh_status' (n,o) {
  //     this.isShowTab();
  //   }
  // },
  created() {
    const deviceInfo = uni.getSystemInfoSync();
    this.safeAreaHeight = deviceInfo.windowHeight - deviceInfo.safeArea.bottom;
    this.isShowTab();
  },
  methods: {
    isShowTab () {
      let pages = getCurrentPages();          // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面
      let page = pages[pages.length - 1];
      let currentPage = page.route;
	  
	  this.list = [
	    {'name': '首页', go: 'pages/home/index', icon: '/static/icon-tabbar-home1.png', active: '/static/icon-tabbar-home2.png', flag: false},
	    {'name': '直播', go: 'pages/live/index', icon: '/static/icon-tabbar-live1.png', active: '/static/icon-tabbar-live2.png', flag: false},
	    {'name': '游戏', go: 'pages/game/index', icon: '/static/icon-tabbar-game1.png', active: '/static/icon-tabbar-game2.png', flag: false},
	    {'name': '社区', go: 'pages/community/index', icon: '/static/icon-tabbar-square1.png', active: '/static/icon-tabbar-square2.png', flag: false},
	    {'name': '我的', go: 'pages/user/index', icon: '/static/icon-tabbar-user1.png', active: '/static/icon-tabbar-user2.png', flag: false},
	  ]
	  //value==2，表示不开启，则从数组中删除数据
	  if (this.$store.state.userInfo.zb_status == 2) {
		  this.list.splice(1,1);
	  }
	  if (this.$store.state.userInfo.game_status == 2) {  
		if (this.list.length == 5) {
			this.list.splice(2,1);
		}else if (this.list.length == 4) {
			this.list.splice(1,1);
		}	
	  }
	  if (this.$store.state.userInfo.community_status == 2) {
	  	if (this.list.length == 5) {
	  		this.list.splice(3,1);
	  	}else if (this.list.length == 4) {
	  		this.list.splice(2,1);
	  	}else if (this.list.length == 3) {
	  		this.list.splice(1,1);
	  	}
	  }

      for (const item of this.list) {
        if (currentPage === item.go) {
          item.flag = true;
        }
      }
    },
    goto (item) {
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const currentRoute = `/${(page && page.route) || ''}`;
      if (currentRoute !== '/' + item.go) {
        uni.navigateTo({
          url: '/' + item.go,
          // animationType: 'none'
        });
      }
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		// width: 100%;
		width: 750rpx;
		z-index: 999;
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		text-align: center;
		background: #fff;
		color: #CECDDF;
	}
	.list{
		flex: 1;
		font-size: 24rpx;

		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		flex-direction: column;
	}
	// .list.active{
	//   color: #70CCFF;
	// }
	
	.list-img{
		// display: block;
		// margin:0 auto 2rpx;
		width: 40rpx;
	}
	.list-name {
		width: 80rpx;
		font-size: 28rpx;
		text-align: center;
	}
	// .active{
		// color: #70CCFF;
	// 	color: #ff7f00;
	// }
</style>
