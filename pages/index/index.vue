<template>
	<view>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-blue lg shadow" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信登录</button>
			<button class="cu-btn margin-tb-sm lg shadow" @click="gotoPhone" style="color: #007AFF;">手机号登录</button>
		</view>
	</view>
</template>

<script>
	import Vue from 'vue'
	import {
		mapState
	} from 'vuex'
	export default {
		computed: {
		    ...mapState(['token'])
		},
		data() {
			return {
				data: [],
				loadMoreText: "加载中...",
				showLoadMore: false,
			    modalName: null,
			    balanceBonus:"0.00",
			    totalBonus:"0.00",
			    phone:"",
			    loadModal:false,
			    isLoad:false,
			    pageNo:1,
			    remarkModalName: null,
			    driver_remark: "",
			    modalTatil: "添加备注",
			    remarkCard:"",
			    deleteTag:"",
			    currentCard:""
			}
		},
		onShow() {
		   if (this.token == "" || typeof(this.token) == "undefined") {
		        this.pageNo = 1;
		        this.loadMoreText= "加载中..."
		        this.showLoadMore= false
		        this.balanceBonus="0.00"
		        this.totalBonus="0.00"
		        this.data = []
		        this.phone = ""
		        this.remarkModalName = null
		        
		    } else {
		        this.pageNo = 1;
		        this.loadMoreText= "加载中..."
		        this.showLoadMore= false
		        this.getUserInfo();
		    }
		},
		onUnload() {
			this.max = 0,
			this.data = [],
			this.loadMoreText = "加载更多",
			this.showLoadMore = false;
		},
		methods: {

		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>
