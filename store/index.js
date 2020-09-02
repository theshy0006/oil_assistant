import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
        token: "",
		phone: "",
        name: "",
        balanceBonus: "",
        totalBonus: ""
	},
	mutations: {
		login(state, token) {
			state.token = token;
		},
		logout(state) {
			state.phone = "";
			state.token = "";
            state.name = "";
            state.balanceBonus = "";
            state.totalBonus = "";
		},
        userInfo(state, phone, username, balanceBonus, totalBonus) {
            state.phone = phone;
            state.username = username;
            state.balanceBonus = balanceBonus;
            state.totalBonus = totalBonus;
        },
        
        setPhone(state, phone) {
            state.phone = phone
        },
        setName(state, name) {
            state.name = name
        },
        setBalanceBonus(state, balanceBonus) {
            state.balanceBonus = balanceBonus
        },
        setTotalBonus(state, totalBonus) {
            state.totalBonus = totalBonus
        },
        
        
        
	}
})

export default store
