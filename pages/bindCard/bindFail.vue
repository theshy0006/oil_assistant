<template>
	<view>
        <view class="top">
            <image src="../../static/fail.png" class="img"></image>
        </view>
        <view class="content">
            <p class='status'>绑定失败</p>
            <p class='hint'>该副卡所属主卡未与坦程合作</p>
            <p class='hint'>暂时无法享受副卡消费活动</p>
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
				money: "200.00",
			};
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
		},
	}
</script>

<style lang="scss">
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
    
</style>