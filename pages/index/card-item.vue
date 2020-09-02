<template>
    <view class="all">
        <view class="uni-column">
            <view class="flex-item-V uni-bg-red">
                <view class="gasCSS">{{options.gas_station}}</view>
                <view class="moneyCSS">
                    <p style="font-size: 36rpx;">-{{(parseFloat(options.consume_fee).toFixed(2)).toString()}}</p>
                </view>
            </view>
            <view class="flex-item-center uni-bg-green uni-flex">
                <view class="leftContent">
                    {{options.oil_type}}
                </view>

                <view class="money">
                   <p v-if="options.reward >= 0.01" style="font-size: 28rpx; margin-top: 6px;">获得奖金:￥{{(parseFloat(options.reward).toFixed(2)).toString()}}</p>
                   <p v-if="options.reward < 0.01" style="font-size: 28rpx; margin-top: 6px;">非有效消费无奖金</p>
                </view>
            </view>
            <view class="flex-item-V uni-bg-blue">{{options.consume_time}}</view>
            <view class="cut-off"></view>
        </view>         
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

    .all {
        width:750rpx;
    }

	.flex-item-center {
		width: 100%;
		height: auto;
		text-align: left;
        padding-left: 30rpx;
        align-items: center;
	}

	.flex-item-V {
		width: 100%;
		height: auto;
		text-align: left;
        padding-top: 10rpx;
        padding-left: 30rpx;
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
    
    /* 背景色 */
    .uni-bg-red{
    	background:#FFFFFF; color:#333333;
        font-size: 32rpx;
        flex:1;
        display:flex;
        flex-direction: row;
                align-items: flex-end;
        
    }
    .uni-bg-green{
    	background:#FFFFFF; color:#666666;
        font-size: 28rpx;
        display: flex;
        flex-direction: row;

        
    }
    .uni-bg-blue {
    	background:#FFFFFF; color:#999999;
        font-size: 26rpx;
    }
    
    .cut-off {
        height: 1rpx;
        background-color: #F2F2F2;
        margin-left: 30rpx;
    }
    
    .leftContent {
        font-size: 30rpx;
        flex:0.4;
        background-color: #FFFFFF;
        color: #666666;
    }
    .money {
        flex:0.6;
        background-color: #FFFFFF;
        margin-right: 40rpx;
        text-align: right;
        font-size: 32rpx;
        color:#DD524D
    }
    p {
        line-height: 1.3;
    }
    
    .moneyCSS {
        flex:0.2;
        background-color: #FFFFFF;
        text-align: right;
        padding-right: 40rpx;
        color: #333333;
        font-weight: 500;
    }
    
    .gasCSS {
        flex:0.8;
        background-color: #FFFFFF;
        justify-content :flex-end;
        color: #333333;
        
    }
</style>
