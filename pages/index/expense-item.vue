<template>
    <view class="all">
        <view class="uni-flex">
            <view class="leftGroup">
                <image v-bind:src="imageUrl" class="icon">
                </image>
            </view> 
            
            <view class="rightGroup">
                <view class="flex-item-center uni-bg-green uni-flex">
                    <view class="leftContent">
                       <view style="font-size: 34rpx;">{{contentTitle}}</view>
                       <view class="flex-item-V uni-bg-blue">{{options.add_time}}</view>
                    </view>
                    <view class="money">
                        <p style="font-size: 38rpx;margin-top: 10rpx; font-weight: 500;" :class="options.detail_type == '1'?'red':'black'">{{contentPrice}}</p>
                        <p style="color: #666666; font-size: 26rpx;margin-top: 10rpx;margin-bottom: 10px;">{{contentStatus}}</p>
                    </view>
                </view>
                <view class="cut-off"></view>
            </view>
            
        </view>  
        
    </view>
</template>

<script>
	export default {
        computed: {
            imageUrl:function() {
                if ( this.options.detail_type == 1 ) {
                    return "../../static/moneyIcon.png"
                } else if ( this.options.detail_type == 2 ) {
                    return "../../static/withdrawIcon.png"
                } else {
                    return "../../static/withdrawIcon.png"
                }
            },
            contentTitle: function() {
                if ( this.options.detail_type == 1 ) {
                    return "副卡有效消费奖励"
                } else if ( this.options.detail_type == 2 ) {
                    return "奖金提现"
                } else {
                    return ""
                }
            },
            contentPrice:function() {
                if ( this.options.detail_type == 1 ) {
                    return "+" + (parseFloat(this.options.cash_change).toFixed(2)).toString()
                } else if ( this.options.detail_type == 2 ) {
                    return "-" + (parseFloat(this.options.cash_change).toFixed(2)).toString()
                } else {
                    return ""
                }
            },
            contentStatus:function() {
                if ( this.options.detail_type == 1 ) {
                    return ""
                } else if ( this.options.detail_type == 2 ) {
                    if (this.options.cash_status == "待发放") {
                        return "待发放"
                    } else {
                       return "" 
                    }
                } else {
                    return ""
                }
            }
        },
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
    .icon {
        width: 100rpx;
        height: 100rpx;
    }
    .leftGroup {
        flex: 0.2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #FFFFFF;
    }
    
    .rightGroup {
        flex: 0.8;
        display: flex;
        flex-direction: column;
    }
    
    .all {
        width:750rpx;
    }

	.flex-item-center {
		width: 100%;
		height: auto;
		text-align: left;
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
        padding-left: 0rpx;
    }
    
    .cut-off {
        width: 100%;
        height: 1px;
        background-color: #F6F6F6;
    }
    
    .leftContent {
        flex:0.55;
        background-color: #FFFFFF;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .money {
        flex:0.45;
        background-color: #FFFFFF;
        margin-right: 40rpx;
        text-align: right;
        font-size: 32rpx;
    }
    p {
        line-height: 1.3;
    }
    
    .black {
        color: #333333;
    }
    .red {
        color:#DD524D
    }
</style>
