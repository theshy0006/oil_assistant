<template>
	<view>
        <view class="top">
            <image src="../../static/alert.png" class="img"></image>
        </view>
        <view class="content">
            <p class='status'>无法完成绑定</p>
            <p class='hint'>该副卡已被其他司机绑定</p>
            <p class='hint' @click="gotoAppeal">是您的副卡？<span>点我申诉</span></p>
        </view>
        <view class="flex solid-bottom padding justify-around bg-white">
        	<button class="cu-btn margin-tb-sm lg shadow" @click="gotoRoot">返回首页</button>
            <button class="cu-btn margin-tb-sm lg shadow" @click="gotoBack">继续绑定</button>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: "0.00",
                cardNo: "",
			};
		},
        onLoad: function (option) {
            console.log(option.cardNo); //打印出上个页面传递的参数。
            this.cardNo = option.cardNo
        },
		methods: {
			gotoBack() {
				uni.navigateBack({
					delta: 1
				});
			},
            gotoRoot() {
            	uni.navigateBack({
            		delta: 2
            	});
            },
            gotoAppeal() {
                uni.navigateTo({
                    url:("./appeal?cardNo="+this.cardNo)
                })
            }
		},
	}
</script>

<style scoped>
    .top {
        height: 320rpx;
        background-color: #FFFFFF;
        display: flex;
        flex-direction: row;
        justify-content : center;
        align-items : center;
    }
    
    .img {
        width: 200rpx;
        height: 200rpx;
    }
    
    .content p {
        text-align: center;
        background-color: #FFFFFF;
    }
    
    .status {
        color: #333333;
        font-size: 48rpx;
        padding-bottom: 5px;
    }
    
    .hint {
        color: #999999;
        font-size: 30rpx;
    }
    
    span {
        color: #007AFF;
    }
    
</style>