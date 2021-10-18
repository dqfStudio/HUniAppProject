<template>
	<page-base :navFixed="true">
		<!-- 顶部 -->
		<view slot="nav" class="search-header">
			<view class="left-back" @click="onClickBack">
				<uni-icons color="color" type="back" size="24" />
			</view>
			
			<view class="input-view">
				<input class="search-input-text" :value="searchInputValueForClient" confirm-type="search" :focus="true" @input="handleInputValue" @confirm="handleConfirm" type="text" :placeholder="searchInputValueForServer" placeholder-style="color:#9CAAC3" />
				<image class="search-input-icon" v-if="searchInputValueForClient" src="@/static/del.png" mode="widthFix" @click.stop="emptyValue"></image>
			</view>
			
			<text class="right-view" @click="search(searchInputValueForClient)">搜索</text>
		</view>

		<view class="search">
			<loading-view v-if="!isLoadinged"></loading-view>
			
			<!-- 搜索结果 -->
			<view v-if="isSearchResult===1" class="search-result">
				<view class="result-item" v-for="(item,index) in searchResultList" @click="toPlay(item.vo_id)" :key="'r'+item.vo_id">
					<view class="result-item-left" :style="{backgroundImage: 'url('+getImageUrl(item.image)+')'}">
						<!-- 角标 -->
						<video-item-sub :is_charge="item.is_charge" :charge="item.charge"></video-item-sub>
						<!-- 数据信息 -->
						<view class="result-item-info">
							<view class="result-item-info-row">
								<template v-if="item.is_charge===2">
									<text class="result-item-info-text">{{numberCount(item.buy_num)}}人已购</text>
								</template>
								<template v-else>
									<image style="width: 26rpx;" src="../../static/icon-play.png" mode="widthFix"></image>
									<text class="result-item-info-text">{{numberCount(item.play_num)}}</text>
								</template>
							</view>
							<text class="result-item-info-text">{{item.time_length}}</text>
						</view>
						<image style="width: 48rpx;" src="../../static/icon-play-2.png" mode="widthFix"></image>
					</view>
					<view class="result-item-right">
						<text class="result-item-name">{{item.name}}</text>
						<text class="result-item-date">{{item.created_at}}</text>
					</view>
				</view>
				<uni-load-more :status="loadMoreStatus" :icon-size="16" :content-text="loadMoreText" />
			</view>
			<view v-if="isSearchResult===2" style="text-align:center;padding:50rpx 30rpx;color:#7c7c7c;">未搜索到你想要的影片</view>

			<!-- 搜索记录 -->
			<view class="box-view" v-if="searchRecordList.length>0&&isSearchResult===0">
				<view class="box-header">
					<view class="box-header-row" style="flex: 1;">
						<image style="width: 6rpx;" src="../../static/topic-icon.png" mode="widthFix"></image>
						<text class="box-header-title">搜索记录</text>
					</view>
					<view class="box-header-row" style="flex-shrink: 0;" @click="delSearchRecord()">
						<image style="width: 38rpx;" src="../../static/icon-del.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="search-record">
					<text v-for="(item, index) in searchRecordList" :key="index" class="search-record-item" @click="search(item.name)">{{item.name}}</text>
				</view>
			</view>

			<!-- 最近更新 -->
			<view class="box-view" v-if="recentUpdateList.length>0&&searchResultList.length===0">
				<view class="box-header">
					<view class="box-header-row" style="flex: 1;">
						<image style="width: 6rpx;" src="../../static/topic-icon.png" mode="widthFix"></image>
						<text class="box-header-title">最近更新</text>
					</view>
					<view class="box-header-row" style="flex-shrink: 0;" @click="toHome">
						<text class="box-header-more">更多</text>
						<image style="width: 13rpx;" src="../../static/icon-more.png" mode="widthFix"></image>
					</view>
				</view>
				<scroll-view class="recent-update" :scroll-x="true">
					<view v-for="(item,index) in recentUpdateList" class="remd-item" :style="{marginLeft: index===0?'30rpx':'0'}" @click="toPlay(item.vo_id)" :key="'u'+item.vo_id">
						<view class="remd-item-box">
							<image class="remd-item-img" :src="getImageUrl(item.image)" :lazy-load="true" mode="aspectFill"></image>
							<!-- 角标 -->
							<video-item-sub :is_charge="item.is_charge" :charge="item.charge"></video-item-sub>
							<!-- 数据信息 -->
							<view class="remd-item-info">
								<view class="remd-item-info-row">
									<template v-if="item.is_charge===2">
										<text class="remd-item-info-text">{{numberCount(item.buy_num)}}人已购</text>
									</template>
									<template v-else>
										<image style="width: 26rpx;" src="../../static/icon-play.png" mode="widthFix"></image>
										<text class="remd-item-info-text">{{numberCount(item.play_num)}}</text>
									</template>
								</view>
								<text class="remd-item-info-text">{{item.time_length}}</text>
							</view>
						</view>
						<text class="remd-item-title">{{item.name}}</text>
					</view>
				</scroll-view>
			</view>

			<!-- 热点推荐 -->
			<view v-if="hide_hots && searchHotList.length > 0" class="hots">
				<image class="search_bg" src="@/static/search_bg.png" mode="widthFix"></image>
				<view class="hotsList" :style="{paddingBottom: safeAreaHeight + 'px'}">
					<view class="hotsList_li" v-for="(item, index) in searchHotList" :key="index" v-if="index< 10" @click="toHotsInfo(item.url, item.hot_id)">
						<image v-if="index === 0" src="@/static/top_1.png" mode="widthFix"></image>
						<image v-else-if="index === 1" src="@/static/top_2.png" mode="widthFix"></image>
						<image v-else-if="index === 2" src="@/static/top_3.png" mode="widthFix"></image>
						<text style="width:75rpx; text-align: center; color: rgba(255, 155, 38, 1); display: flex; justify-content: center; text-indent: -28rpx;" v-else>{{index + 1}}</text>
						<text class="sl" style="margin-right: 30rpx;height: 88rpx;">{{item.name}}</text>
					</view>
				</view>
			</view>

			<!-- 对话框 -->
			<uni-popup ref="popupDialog" type="dialog" @change="handlePopupChange">
				<uni-popup-dialog title="清空" content="亲，确定要清空搜索记录吗" okText="清空" closeText="保留" @confirm="handleSialogConfirm" @close="handleDialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
	</page-base>
</template>

<script>
	import config from '@/utils/config.js';
	import http from '@/utils/request.js';
	import pageBase from '@/components/page-base/page-base.vue';
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import uniPopup from '@/components/modal/uni-popup.vue';
	import uniPopupDialog from '@/components/modal/uni-popup-dialog.vue';
	import loadingView from '@/components/loading-view.vue';
	import videoItemSub from '@/pages/common/video-item-sub.vue';
	export default {
		components: {
			pageBase,
			uniIcons,
			uniPopup,
			uniPopupDialog,
			loadingView,
			videoItemSub
		},
		data: function() {
			return {
				isSearchResult: 0, // 是否搜索 0-未搜索 1-有搜索结果 2-没有搜索结果
				pageHeight: 0,
				recentUpdateList: [],
				searchRecordList: [],
				searchHotList: [],
				searchResultList: [],
				searchInputValueForClient: '',
				searchInputValueForServer: '',
				page: 1,
				loadMoreStatus: 'more',
				loadMoreText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				Vacancy: false,
				defaultFill: "",
				hide_hots: true,
				dataOBJ: {},
				safeAreaHeight: 0,
				isLoadinged: false,
			}
		},
		onLoad(data) {
			const deviceInfo = uni.getSystemInfoSync();
			this.pageHeight = deviceInfo.windowHeight - deviceInfo.statusBarHeight - 44;
			this.safeAreaHeight = deviceInfo.windowHeight - deviceInfo.safeArea.bottom;
			
			if(data && data.toBackfill){
				this.dataOBJ = JSON.parse(data.toBackfill);
				this.searchInputValueForServer = this.dataOBJ.name;
				if(this.searchInputValueForServer && !this.dataOBJ.url){
					this.search(this.searchInputValueForServer)
				}
			}
    	
			this.getHotRecord();
			this.recentUpdate();
		},
		onReachBottom() {
			if (this.loadMoreStatus === 'more' && !this.isloading && this.searchResultList.length > 0) {
				this.search();
			}
		},
		methods: {
			// 当没有图片返回默认图片 url 资源路径
			getImageUrl(url = '') {
				if (url.indexOf('.html') >= 0) return config.util.ImgDefault;
				return url || config.util.ImgDefault;
			},
			/**
			 * 获取图片资源-解决异步问题
			 * @param {Object} imgData 图片数据源对象
			 * @param {String} key 图片数据源对应key
			 */
			requestImageUrl(imgData = {}, key = 'image') {
				if (imgData && imgData[key] && imgData[key].indexOf('.html') >= 0) {
					// 获取图片地址
					config.util.getImage(imgData[key]).then(data => {
						imgData[key] = data;
					});
				}
			},
			numberCount(value) {
				return config.util.unitToW(value);
			},
			onClickBack() {
				uni.navigateBack();
			},
			toHome() {
				// uni.$emit('showMode', 1);
				// uni.switchTab({
				// 	url: "/pages/home/index"
				// })
				uni.navigateTo({
					url: `/pages/home/list?type=today&id=0&title=今日更新`
				})
			},
			toPlay(id) {
				uni.navigateTo({
					url: "/pages/play/play?id=" + id
				})
			},
			
			toHotsInfo(url, hot_id) {
				http.post({
					url: config.api.hotInc,
					data: {hot_id}
				})
				
				config.util.openURL(url)
			},
			
			handleInputValue(e) {
				if (!e.detail.value) {
					this.isSearchResult = 0;
					this.searchResultList = [];
				}
				this.searchInputValueForClient = e.detail.value;
				this.page = 1;
			},
			handleConfirm(e) {
				this.searchInputValueForClient = e.detail.value;
				this.page = 1;
				this.search();
			},
			getHotRecord() {
				http.post({
					url: config.api.getRecordHot
				}).then((res) => {
					this.isLoadinged = true;
					if (res.data) {
						this.searchRecordList = res.data.record_list;
						this.searchHotList = res.data.hot_list;
					}
				}).catch((err) => {
					this.isLoadinged = true;
					console.log(err)
				})
			},
			
			clickToForUrl(){
				// http.post({
				// 	url: config.api.getSearchText
				// })
				// .then((res) =>{
				// 	if(res.data.length > 0){
				// 		this.toForUrl = this.dataOBJ.url
				// 		this.searchInputValueForServer = this.dataOBJ.name
				// 		config.util.openURL(this.toForUrl)
				// 	}
				// })
				// .catch((err) =>{
				// 	console.log(err)
				// })
				this.searchInputValueForServer = this.dataOBJ.name;
				if (this.dataOBJ.hot_id) {
					http.post({
						url: config.api.hotInc,
						data: {hot_id: this.dataOBJ.hot_id}
					})
				}
				if (this.dataOBJ.url) {
					config.util.openURL(this.dataOBJ.url)
				}
			},
			
			search(value = '') {
				if ((!value) && (!this.searchInputValueForClient) && (this.dataOBJ.url)) {
					this.clickToForUrl();
					return
				}
				uni.hideKeyboard();
				if (this.isloading) return;
				if (!value) {
					uni.showToast({
						icon: 'none',
						title: '请输入搜索内容'
					});
					if(this.searchInputValueForClient){
						value = this.searchInputValueForClient
					} else if(!this.searchInputValueForClient && this.dataOBJ.name){
						 value = this.dataOBJ.name
					}
				}
				this.isloading = true;
				this.loadMoreStatus = 'loading';
				http.post({
					url: config.api.getSearchList,
					data: {
						keyword: value,
						current_page: this.page
					},
					isLoading: true
				})
				.then((res) => {
					this.isloading = false;
					if (res.data) {	
						const data = res.data;
				
						this.searchResultList = this.page === 1 ? data.list : this.searchResultList.concat(data.list || []);
						this.page = this.page + 1;
						this.loadMoreStatus = data.per_page > data.list.length ? "noMore" : "more"; // 是否有更多
				
						this.isSearchResult = this.searchResultList.length > 0 ? 1 : 2;
						
						this.searchInputValueForClient = value
						
						// 获取真实图片
						if (data.list && data.list.length > 0) {
							setTimeout(() => {
								data.list.forEach(item => {
									this.requestImageUrl(item);
								})
							}, 200)
						}
					}
				})
				.catch((err) => {
					this.isloading = false;
				})
				this.hide_hots = false
				
			},
			
			emptyValue() {
				this.searchInputValueForClient = ''
				this.isSearchResult = 0;
				this.searchResultList = [];
				this.page = 1;
				this.hide_hots = true
			},
			recentUpdate() {
				http.post({
					url: config.api.getRecentUpdate
				}).then((res) => {
					this.isLoadinged = true;
					if (res.data) {
						this.recentUpdateList = res.data;
						
						// 获取真实图片
						setTimeout(() => {
							this.recentUpdateList.forEach(item => {
								this.requestImageUrl(item);
							})
						}, 200)
					}
				}).catch((err) => {
					this.isLoadinged = true;
				})
			},
			handlePopupChange(e) {
				//
			},
			handleSialogConfirm(done) {
				done()
				http.post({
					url: config.api.delSearchRecord
				}).then((res) => {
					this.searchRecordList = [];
				}).catch((err) => {})
			},
			handleDialogClose(done) {
				done()
			},
			delSearchRecord() {
				this.$refs.popupDialog.open()
			}
		}
	}
</script>

<style lang="scss" scoped>
	/*多行省略？*/
	.sl {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.search {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		flex: 1;
		// overflow-y: auto;
	}

	.search-header {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		height: 44px;
		width: 750rpx;
	}

	.left-back {
		padding-left: 20rpx;
		padding-right: 30rpx;
	}

	.input-view {
		flex: 1;
		height: 66rpx;
		border-radius: 66rpx;
		background-color: #F8F8FB;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		flex-wrap: nowrap;
		display: flex;
		padding: 0 30rpx;
	}

	.search-input-icon {
		width: 32rpx;
		margin-left: 10rpx;
	}

	.search-input-text {
		flex: 1;
		color: #222222;
		font-size: 28rpx;
	}

	.right-view {
		padding: 0 30rpx;
		font-weight: 500;
		color: #222222;
		font-size: 32rpx;
	}

	.box-view {
		margin-top: 20rpx;

		.box-header {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: space-between;
			align-items: center;
			margin: 10rpx 30rpx;

			.box-header-title {
				font-weight: 500;
				color: #222222;
				font-size: 32rpx;
				margin-left: 8rpx;
				margin-right: 100rpx;
				lines: 1;
				text-overflow: ellipsis;
				flex: 1;
			}

			.box-header-more {
				color: #9CAAC3;
				font-size: 28rpx;
			}
		}

		.box-header-row {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
		}

		.box-content {}
	}

	.search-record {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0 22rpx;
		max-height: 132rpx;
		overflow: hidden;

		.search-record-item {
			flex-shrink: 0;
			padding: 0 20rpx;
			height: 50rpx;
			line-height: 50rpx;
			margin: 8rpx;
			border-radius: 8rpx;
			background-color: #f8f8fb;
			color: #222222;
			font-size: 28rpx;
		}
	}

	.recent-update {
		width: 100%;
		white-space: nowrap;

		.remd-item {
			margin: 20rpx 30rpx 10rpx 0rpx;
			width: 330rpx;
			display: inline-block;
		}

		.remd-item-box {
			position: relative;
			width: 330rpx;
			height: 185rpx;
		}

		.remd-item-img {
			position: absolute;
			width: 330rpx;
			height: 185rpx;
			// border-radius: 10rpx;
		}

		.remd-item-title {
			color: #222222;
			font-size: 28rpx;
			font-weight: 500;
			width: 100%;
			display: inline-block;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			margin-top: 10rpx;
			height: 40rpx;
		}

		.remd-item-info {
			position: absolute;
			bottom: 0;
			background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: space-between;
			align-items: center;
			padding: 100rpx 20rpx 10rpx 20rpx;
			width: 290rpx;
			height: 40rpx;
			// border-bottom-left-radius: 10rpx;
			// border-bottom-right-radius: 10rpx;
		}

		.remd-item-info-row {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
		}

		.remd-item-info-text {
			color: #FFFFFF;
			font-size: 24rpx;
			padding-left: 4rpx;
		}

		/* #ifndef APP-NVUE */
		::-webkit-scrollbar {
			display: none;
			width: 0 !important;
			height: 0 !important;
			-webkit-appearance: none;
			background: transparent;
		}

		/* #endif */
	}

	.search-result {
		overflow-x: hidden;

		.result-item {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			padding: 15rpx 30rpx;

			.result-item-left {
				width: 330rpx;
				height: 185rpx;
				// border-radius: 10rpx;
				background-size: cover;
				position: relative;
				flex-shrink: 0;
				margin-right: 15rpx;
				align-items: center;
				justify-content: center;
				display: flex;

				.result-item-info {
					position: absolute;
					bottom: 0;
					background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
					padding: 100rpx 20rpx 10rpx 20rpx;
					width: 290rpx;
					height: 40rpx;
					// border-bottom-left-radius: 10rpx;
					// border-bottom-right-radius: 10rpx;
				}

				.result-item-info-row {
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					align-items: center;
				}

				.result-item-info-text {
					color: #FFFFFF;
					font-size: 24rpx;
					padding-left: 4rpx;
				}
			}

			.result-item-right {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				overflow: hidden;

				.result-item-name {
					font-weight: 500;
					color: #222222;
					font-size: 28rpx;
					height: 80rpx;
					line-height: 40rpx;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				.result-item-date {
					color: #7c7c7c;
					font-size: 24rpx;
				}
			}
		}
	}

	.hots {
		width: 694rpx;
		margin: 60rpx 28rpx 0 28rpx;

		.search_bg {
			width: 694rpx;
		}

		.hotsList {
			margin-top: -10rpx;
			margin-bottom: 40rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
			box-shadow: 0px 3px 6px #dee0e5;
			border-radius: 0 0 10rpx 10rpx;

			.hotsList_li {
				display: flex;
				align-items: center;
				height: 88rpx;
				line-height: 88rpx;
				
				image {
					width: 46rpx;
					margin-right: 30rpx;
					flex-shrink: 0;
				}
				
			}
		}
	}
</style>
