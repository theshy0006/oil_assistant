<template>
    <view class="all">
		<view class="topGroup">
			<view class="title">
				优惠失效提醒
			</view>
			<view class="time">
				2020-01-02 12:20:20
			</view>
		</view> 
		
		<view class="bottomGroup">
			您的副卡XXXXXXXX因主卡停止与坦程合作，将不再享受有效消费金额
		</view>
		<view class="cut-off"></view>
    </view>
</template>

<script>
	export default {
        props: {
			options: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		}
	}
</script>

<style scoped>
	
	.topGroup {
		flex: 1;
		display: flex;
		flex-direction: row;
	}
	
	.title {
		flex: 0.6;
		font-size: 32rpx;
		padding-left: 20rpx;
		padding-top: 20rpx;
	}
	
	.time {
		text-align: right;
		padding-right: 20rpx;
		padding-top: 20rpx;
		flex: 0.4;
	}
	
	.bottomGroup {
		flex: 1;
		padding: 20rpx;
	}

    .all {
        width:750rpx;
		display: flex;
		flex-direction: column;
    }

	.text {
		margin: 15rpx 10rpx;
		padding: 0 20rpx;
		background-color: #ebebeb;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		color: #777;
		font-size: 26rpx;
	}
    
    .cut-off {
        width: 100%;
        height: 1px;
        background-color: #F6F6F6;
    }
</style>
