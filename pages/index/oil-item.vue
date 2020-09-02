<template>
    <view class = "all">
        <view>
            
            <!-- title -->
            <view class="itemTitle">
                <view class="card">{{options.sub_card.replace(/\s/g, '').replace(/(.{4})/g, "$1 ")}}</view>
                <view class="mark">
                    <view @click="changeRemark">{{options.driver_remark}}</view>
                    <image src="../../static/edit.png" 
                    class="editImage" @click="changeRemark"></image>
                </view>
            </view>
            
            <!-- center -->
            
            <view class="centerContent">
                <view class="centerContentLeft" >
                    <view class="uni-inline-item">
                        <view class="money">余额：</view>
                        <view class="rightMoney">{{cardBalance}}</view>
                    </view>
                    <view class="uni-inline-item">
                        <view class="wait">待圈存：</view>
                        <view class="rightMoney">{{preBalance}}</view>
                    </view>
                </view>
                <view class="centerContentRight">
                    <image :src="imageUrl" class="eyes" mode="aspectFill" @click="queryBalance"> 
                    </image>
                </view>   
            </view>
            <view class="cut-off"></view>
            <view class="uni-flex uni-bg-yellow">
                <button class="cu-btn mini-btn edit" :class="['line-blue']" @click="queryList">加油记录</button>
                <button class="cu-btn mini-btn disable" :class="['line-gray']" @click="deleteCard">解除绑定</button>
            </view>
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
		},
        computed: {
            imageUrl:function() {
                if ( this.options.eyeStatus == false ) {
                    return "/static/closeEyes.png"
                } else {
                    return "/static/openEyes.png"
                }
            },
            cardBalance:function() {
                if ( this.options.eyeStatus == true ) {
                    if(this.options.queryResult == true) {
                        return "￥ "+ (parseFloat(this.options.cardBalance).toFixed(2)).toString()
                    } else {
                       return "******" 
                    }
                } else {
                    return "******"
                }
            },
            preBalance:function() {
                if ( this.options.eyeStatus == true ) {
                    if(this.options.queryResult == true) {
                        return "￥ "+ (parseFloat(this.options.preBalance).toFixed(2)).toString()   
                    } else {
                       return "******" 
                    }
                } else {
                    return "******"
                }
            },
            
            
        },
		methods: {
			queryList(e) {
				this.$emit('queryList');
			},
			deleteCard(e) {
				this.$emit('deleteCard');
			},
            changeRemark(e) {
                this.$emit('changeRemark');
            },
            queryBalance(e) {
                this.$emit('queryBalance');
            }
		}
	}
</script>

<style>
   .edit {
       margin: 20rpx 20rpx;
       padding: 20rpx;
       font-size: 28rpx;
    }
    .disable {
        margin: 20rpx 20rpx;
        color: #999999;
        padding: 20rpx;
        font-size: 28rpx;
    }
    .all {
        border-style:solid;
        border-radius: 8rpx;
        margin-left: 20rpx;
        width:710rpx;
        background-color: #FFFFFF;
        margin-bottom: 10px;
        border-width: 1rpx;
        border-color: #F0F0F0;
    }

    .itemTitle {
        height: 80rpx;
        background-color: #0A98D5;
        border-top-right-radius: 8rpx;
        border-top-left-radius: 8rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
	.flex-item-center {
		width: 100%;
		height: auto;
		text-align: left;
        padding-top: 10rpx;
        padding-left: 30rpx;
	}

	.flex-item-V {
		width: 100%;
		height: auto;
		text-align: left;
        padding-left: 30rpx;
        display: flex;
        flex-direction: row;
	}
    
    .centerContent {
        height: 180rpx;
        display: flex;
        flex-direction: row;
    }
    
    .centerContentLeft {
        flex: 0.8;
        font-size: 48rpx;
        align-items: flex-start;
        justify-content:center;
        display: flex;
        flex-direction: column;
        padding-left: 50rpx;
    }
    
    .centerContentRight {
        flex: 0.2;
        align-items: center;
        justify-content:center;
        display: flex;
    }
    
    .flex-item-bottom {
        width: 100%;
        height: auto;
        text-align: left;
        padding-left: 30rpx;
        display: flex;
        flex-direction: row;
    }
    
	.text {
		margin: 15rpx 10rpx;
		padding: 0 20rpx;
		background-color: #ebebeb;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #777;
		font-size: 26rpx;
	}
    /* 背景色 */
    .uni-bg-red{
    	background:#FFFFFF; color:#333333;
        font-size: 44rpx;
        font-weight: 700;
        margin-top: 20rpx;
        align-items:center;
    }
    .uni-bg-green{
    	background:#FFFFFF; color:#666666;
        font-size: 28rpx;
    }
    .uni-bg-blue {
    	background:#FFFFFF; color:#999999;
        font-size: 24rpx;
    }
    .uni-bg-yellow {
        -webkit-justify-content: flex-end;
        justify-content: flex-end;
    }
    .cut-off {
        height: 1rpx;
        background-color: #F2F2F2;
        margin-left: 30rpx;
    }
    .titleText {
        margin-left: 20rpx;
        font-size: 34rpx;
    }
    .money {
        width: 180rpx;
        font-size: 32rpx;
        color:#333333;
    }
    .wait {
        width: 180rpx;
        margin-top: 5rpx;
        font-size: 32rpx;
        color:#333333;
    }
    
    .rightMoney {
        font-size: 32rpx;
        font-weight: 400;
        color:#333333;
    }
    
    .editImage {
        width: 48rpx;
        height: 48rpx;
        margin-right: 10rpx;
        margin-left: 10rpx;
    }
    .card {
        margin-left: 20rpx;
        flex: 0.65;
        font-size: 38rpx;
        color: #FFFFFF;
    }
    .mark {
        flex: 0.35;
        color: #FFFFFF;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content:flex-end
    }
    .eyes {
        width: 48rpx;
        height: 32rpx;
    }
</style>
