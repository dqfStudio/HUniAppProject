<template>
	<view class="tabs">
		<scroll-view class="tab-bar" :scroll="false" :scroll-y="true" :show-scrollbar="false">
			<view style="flex-direction: column;">
				<view class="uni-tab-item" v-for="(tab,index) in tabList" :key="tab.id" :id="tab.id" :ref="'tabitem'+index"
					:data-id="index" :data-current="index" @click="ontabtap">
					<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
					<view class="scroll-view-underline" :class="'scroll-view-animation'" :style="{'background-color': tabIndex==index ?  '#007AFF' : '#555'}"></view>
				</view>
			</view>
		</scroll-view>
		
		<swiper class="tab-view" :style="{height: winHeight+'px'}" :current="tabIndex" :duration="300" @change="onChangeTabPage">
			<swiper-item v-for="(tab, index) in tabList" :key="index">
				<!-- 第一个 -->
				<template v-if="index === 0">
					<view style="background-color: #00CE47;width: 300px;" :style="{height: winHeight+'px'}"></view>
				</template>
				<!-- 第二个 -->
				<template v-else>
					<view style="background-color: yellow;width: 300px;" :style="{height: winHeight+'px'}"></view>
				</template>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data: function() {
			return {
				winHeight: 0,
				tabIndex: 0,
				tabList: [{'id': '1','name': '第一个'}, {'id': '2','name': '第二个'}],
				indicatorLineTop: 0
			};
		},
		onShow() {
			
		},
		onLoad() {
			
		},
		onReady() {
			uni.getSystemInfo({
				success:  (res) => {
					this.winHeight = res.windowHeight;
				}
			});
		},
		methods: {
			ontabtap(e) {
			    let index = e.target.dataset.current || e.currentTarget.dataset.current;
			    this.isTap = true;
				this.tabIndex = index;
				this.indicatorLineTop = 45*index;
			},
			onChangeTabPage(e) {
				let index = e.target.current || e.detail.current;
				this.tabIndex = index;
				this.indicatorLineTop = 45*index;
			}
		}
	};
</script>


<style>
    /* #ifndef APP-PLUS */
    page {
        width: 100%;
        min-height: 100%;
        display: flex;
    }

    /* #endif */

    .tabs {
        flex: 1;
		display: flex;
        flex-direction: row;
        overflow: hidden;
        background-color: #ffffff;
        /* #ifdef MP-ALIPAY || MP-BAIDU */
        /* height: 100vh; */
		height: 800px;
        /* #endif */
    }

    .tab-bar {
        /* width: 750rpx;
        height: 84rpx; */
		width: 75px;
		/* height: 800px; */
		height: winHeight+'px';
        flex-direction: row;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
    }

    /* #ifndef APP-NVUE */
    .tab-bar ::-webkit-scrollbar {
        display: none;
        width: 0 !important;
        height: 0 !important;
        -webkit-appearance: none;
        background: transparent;
    }

    /* #endif */

    .scroll-view-underline {
		height: 1px;
        width: 75px;
    }

    .scroll-view-animation {
        transition-duration: 0.2s;
        transition-property: left;
    }

    .tab-bar-line {
        height: 1rpx;
        background-color: #cccccc;
    }

    .tab-view {
        flex: 1;
		width: 75px;
		height: winHeight+'px';
    }

    .uni-tab-item-title {
        color: #555;
        font-size: 30rpx;
        height: 45px;
        line-height: 45px;
		width: 75px;
        flex-wrap: nowrap;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
		display: flex;
		justify-content: center;
    }

    .uni-tab-item-title-active {
        color: #007AFF;
    }
	
</style>
