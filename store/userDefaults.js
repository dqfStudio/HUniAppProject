import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaults = new Vuex.Store({
	state: {//对数据的全局存储
		isLogin: false,
	}
})

export default {
	defaults
}