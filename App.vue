<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//监听tabbar中间按钮minButton点击事件
			uni.onTabBarMidButtonTap(() => {
				uni.navigateTo({
					url: '/pages/index/homePage4'
				})
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
