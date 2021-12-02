
const storageKey = {
	isLogin: "isLogin", // 是否登录
}

const storage = {
	getIsLogin() {
		return uni.getStorageSync(storageKey.isLogin)
	}
	setIsLogin(isLogin) {
		uni.setStorageSync(storageKey.isLogin, isLogin)
	}
}

export default {
	storageKey,
	storage
}
