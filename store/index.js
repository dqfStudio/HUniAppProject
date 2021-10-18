import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/utils/request.js'
import config from '@/utils/config.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: uni.getStorageSync('userInfo') || {}, // 用户信息
		liveUserInfo: uni.getStorageSync('liveUserInfo') || {}, // 直播用户信息
		HomeGetConfig: [], // 直播用户信息
	},
	mutations: {
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo;
		},
		setLiveUserInfo(state, liveUserInfo) {
			uni.setStorageSync('liveUserInfo', liveUserInfo);
			// #ifdef APP-PLUS
			uni.sendNativeEvent('saveLiveUserInfo', liveUserInfo, ret => {});
			// #endif
			
			state.liveUserInfo = liveUserInfo;
		},
		setHomeGetConfig(state, data) {
			state.HomeGetConfig = data;
		},
	},
	getters: {
		
	},
	actions: {
		getUserInfo: async function({commit, state}) {
			return await new Promise((resolve, reject) => {
				http.post({
					url: config.api.getUserInfo,
				})
				.then((res) => {
					if(res.data){
						// #ifdef APP-PLUS
						// 当用户身份发生改变 需通知app更新缓存最大数量
						if (uni.getStorageSync('userInfo') && res.data.is_vip !== uni.getStorageSync('userInfo').is_vip) {
							uni.sendNativeEvent('updateDownloadMaxNumber', {
								number: res.data.is_vip === 1 ? 3 : 1 // 会员可以同时下载3个，非会员只能1个
							}, ret => {
							})
						}
						// #endif
						
						uni.setStorageSync('userInfo', res.data);
						commit('setUserInfo', res.data);
					}
					resolve()
				})
				.catch((err) => {
					console.log(err)
					reject(err)
				})
			})
		},
		// 获取直播配置
		async getHomeGetConfig ({commit, state}) {
			function requestImageUrl(imgData = {}, key = 'image') {
				if (imgData && imgData[key] && imgData[key].indexOf('.html') >= 0) {
					// 获取图片地址
					config.util.getImage(imgData[key]).then(data => {
						imgData[key] = data;
					});
				}
			};
			let homeGetConfig = await http.live.post({
				url: config.liveApi.homeGetConfig,
				data: {
					uid: state.liveUserInfo.id,
					token: state.liveUserInfo.token,
				}
			});
			if (homeGetConfig.info && homeGetConfig.info.length > 0) {
				commit('setHomeGetConfig', homeGetConfig)
				setTimeout(() => {
					for (const item of homeGetConfig.info[0].level) {
						requestImageUrl(item, 'thumb');
					}
					for (const item of homeGetConfig.info[0].levelanchor) {
						requestImageUrl(item, 'thumb');
					}

				}, 200)
			}
		},
	}
})

export default store
