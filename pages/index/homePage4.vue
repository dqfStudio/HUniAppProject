<template>
	<view class="tabs">
		<scroll-view class="tab-bar" :scroll="false" :scroll-x="true" :show-scrollbar="false">
			<view style="flex-direction: column;">
				<view style="display: flex;flex-direction: row;">
					<view class="uni-tab-item" v-for="(tab,index) in tabList" :key="tab.id" :id="tab.id" :ref="'tabitem'+index"
						:data-id="index" :data-current="index" @click="ontabtap">
						<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
					</view>
				</view>
				<view class="scroll-view-indicator">
					<view ref="underline" class="scroll-view-underline" :class="'scroll-view-animation'"
						:style="{left: indicatorLineLeft + 'px', width: indicatorLineWidth + 'px'}"></view>
				</view>
			</view>
		</scroll-view>
		<view class="tab-bar-line"></view>
		
		<swiper class="tab-view" :style="{height: winHeight+'px'}" :current="tabIndex" :duration="300" @change="onChangeTabPage">
			<swiper-item v-for="(tab, index) in tabList" :key="index">
				<!-- 第一个 -->
				<template v-if="index === 0">
					<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;background-color: red;">
						<!-- 第一个item -->
						<view style="display: flex;flex-direction: column;width: 355px;height: 66px;margin: 0 10px;background-color: gray;">
							<!-- content -->
							<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
								<!-- 左边图片 -->
								<view style="width: 45px;height: 45px;background-color: red;"></view>
								<view style="display: flex;flex-direction: column;width: 205px;height: 45px;margin: 0 10px;">
									<text style="width: 205px;height: 22.5px;background-color: red;font-size: 12px;">wwwwwwwwwwwwwww</text>
									<text style="width: 205px;height: 22.5px;background-color: yellow;font-size: 12px;">qqqqqqqqq</text>
								</view>
								<!-- 右边图片 -->
								<view style="width: 45px;height: 45px;background-color: red;"></view>	
								<!-- 右边箭头 -->
								<view style="width: 10px;height: 45px;margin-left: 10px;background-color: yellow;"></view>
							</view>
							<!-- 间隔线 -->
							<view style="width: 335px;height: 1px;margin: 0px 10px;background-color: #e9e9e9;"></view>
						</view>
						
						<!-- 中间item -->
						<view style="display: flex;flex-direction: column;width: 355px;height: 66px;margin: 0 10px;background-color: gray;">
							<!-- content -->
							<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
								<!-- 左边图片 -->
								<view style="width: 45px;height: 45px;background-color: red;"></view>
								<view style="display: flex;flex-direction: column;width: 280px;height: 45px;margin-left: 10px;">
									<text style="width: 280px;height: 22.5px;background-color: red;font-size: 12px;"></text>
									<text style="width: 280px;height: 22.5px;background-color: yellow;font-size: 12px;"></text>
								</view>
							</view>
							<!-- 间隔线 -->
							<view style="width: 335px;height: 1px;margin: 0px 10px;background-color: #e9e9e9;"></view>
						</view>
						
						<!-- 中间item -->
						<view style="display: flex;flex-direction: column;width: 355px;height: 66px;margin: 0 10px;background-color: gray;">
							<!-- content -->
							<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
								<!-- 左边图片 -->
								<view style="width: 45px;height: 45px;background-color: red;"></view>
								<view style="display: flex;flex-direction: column;width: 225px;height: 45px;margin: 0 10px;">
									<text style="width: 225px;height: 22.5px;background-color: red;font-size: 12px;"></text>
									<text style="width: 225px;height: 22.5px;background-color: yellow;font-size: 12px;"></text>
								</view>
								<!-- 右边图片 -->
								<view style="width: 45px;height: 45px;background-color: red;"></view>	
							</view>
							<!-- 间隔线 -->
							<view style="width: 335px;height: 1px;margin: 0px 10px;background-color: #e9e9e9;"></view>
						</view>
						
						<!-- 中间item -->
						<view style="display: flex;flex-direction: column;width: 355px;height: 66px;margin: 0 10px;background-color: gray;">
							<!-- content -->
							<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
								<text style="display: flex;align-items: center;justify-content: center;width: 112px;height: 45px;background-color: yellow;font-size: 12px;">accessoryLabel</text>
								<text style="display: flex;align-items: center;justify-content: center;width: 112px;height: 45px;background-color: green;font-size: 12px;">label</text>
								<text style="display: flex;align-items: center;justify-content: center;width: 111px;height: 45px;background-color: red;font-size: 12px;">detailLabel</text>
							</view>
							<!-- 间隔线 -->
							<view style="width: 335px;height: 1px;margin: 0px 10px;background-color: #e9e9e9;"></view>
						</view>
						
						<!-- 最后一个item -->
						<view style="display: flex;flex-direction: column;width: 355px;height: 65px;margin: 0 10px;background-color: gray;">
							<!-- content -->
							<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
								<text style="display: flex;align-items: center;justify-content: center;width: 40px;height: 45px;background-color: green;font-size: 12px;">验证码</text>
								<input style="display: flex;align-items: center;justify-content: center;width: 225px;height: 45px;background-color: red;font-size: 12px;" type="text" placeholder="请输入验证码" placeholder-style="color: white"></input>
								<text style="display: flex;align-items: center;justify-content: center;width: 70px;height: 45px;background-color: green;font-size: 12px;">获取验证码</text>
							</view>
						</view>
					</view>
				</template>
				<!-- 第二个 -->
				<template v-else-if="index === 1">
					<view style="background-color: #00CE47;width: 375px;" :style="{height: winHeight+'px'}"></view>
				</template>
				<!-- 第三个 -->
				<template v-else>
					<view style="background-color: yellow;width: 375px;" :style="{height: winHeight+'px'}"></view>
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
				tabList: [{'id': '1','name': '第一个'}, {'id': '2','name': '第二个'}, {'id': '3','name': '第三个'}],
				indicatorLineLeft: 0,
				indicatorLineWidth: 125
			};
		},
		onShow() {
			
		},
		onLoad() {
			
		},
		onReady() {
			uni.getSystemInfo({
				success:  (res) => {
					this.winHeight = res.windowHeight-res.statusBarHeight-20;
				}
			});
		},
		methods: {
			ontabtap(e) {
			    let index = e.target.dataset.current || e.currentTarget.dataset.current;
			    this.isTap = true;
				this.tabIndex = index;
				this.indicatorLineLeft = this.indicatorLineWidth*index;
			},
			onChangeTabPage(e) {
				let index = e.target.current || e.detail.current;
				this.tabIndex = index;
				this.indicatorLineLeft = this.indicatorLineWidth*index;
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
        flex-direction: column;
        overflow: hidden;
        background-color: #ffffff;
        /* #ifdef MP-ALIPAY || MP-BAIDU */
        /* height: 100vh; */
		height: 800px;
        /* #endif */
    }

    .tab-bar {
        width: 750rpx;
        height: 84rpx;
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

    .scroll-view-indicator {
        position: relative;
        height: 2px;
        background-color: transparent;
    }

    .scroll-view-underline {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 0;
        background-color: #007AFF;
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
		width: 375px;
		height: winHeight+'px';
    }

    .uni-tab-item-title {
        color: #555;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
		width: 125px;
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
