<template>
	<view>
		<view>
			<view class="flex solid-bottom padding justify-around">
				<view class="bg-grey padding-sm margin-xs radius">消费领奖金</view>
				<view class="bg-grey padding-sm margin-xs radius">加油领好礼</view>
			</view>
			
			<view v-if="current == 0">
				<p>奖励政策：有效消费可返1％的现金奖励，产生有效消费后系统直接发放到账户</p>
				<p>绑卡条件：副卡所属的主卡与坦程签订合作协议</p>
				<p>什么是有效消费：江苏省内非高速柴油消费</p>
			</view>
			
			<view v-else>
				<p>奖励政策：指定油站加柴油，可以获得价值油费3%的礼品</p>
				<p>绑卡条件：副卡所属的主卡与坦程签订合作协议</p>
				<p>领取方式：</p>
				<p>加完油向工作人员出示“我的副卡”页面
				工作人员核实无误后可立即兑换易捷店礼品
				礼品不能累加，需当场领走</p>
			</view>

			
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
		    ...mapState(['token']),
		    topHeight: function() {
		        console.log("进来啦");
		        let value = Vue.prototype.CustomBar + 120 + 'px';
		        return value;
		    }
		},
		data() {
			return {
				current: 0,
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
