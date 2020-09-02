<template>
	<view>
		<view>
           <scroll-view scroll-x class="bg-white nav text-center">
                <view class="flex text-center">
                    <view class="cu-item flex-sub" 
                        :class="index==TabCur?'text-blue cur':''" 
                        v-for="(item,index) in tabNav" 
                        :key="index" @tap="tabSelect" 
                        :data-id="index">
                    {{tabNav[index]}}
                    </view>
                </view>
            </scroll-view>
            <view class="line-h"></view>
            
            <view class="cu-load load-customModal" v-if="loadModal">
                <image src="/static/loading.gif" mode="aspectFit" class="gif-white response">
                    
                </image>
            </view>
            
            <view>
                <view v-if="allData.length==0" class="empty">
                    <image src="/static/empty.png" class="emptyImg"></image>
                    <view class="emptyLabel">
                        空空如也<br>
                    </view>
                </view>
                
                
                <view v-for="(item1,index1) in allData" :key="index1" >
                	<media-item :options="item1">
                    </media-item>
                </view>
                <view class="uni-loadmore" 
                v-if="showLoadMoreALL">{{loadMoreTextAll}}</view>
            </view>
		</view>
	</view>
</template>

<script>
    import Vue from 'vue'
    import {
    	mapState
    } from 'vuex'
    import mediaItem from '../index/card-item.vue';
	export default {
        computed: mapState(['token', 'phone', 'userName']),
        components: {
            mediaItem
        },
		data() {
			return {
                type: 1, //0：代码全部记录，1：有效消费
                tabIndex: 1,
				TabCur: 1,
                cardNo:'',
				tabNav: ['全部', '有效消费'],
                
                CustomBar: this.CustomBar,
                loadModal:false,
                
                showLoadMoreALL: false,
                pageNoAll:1,
                allData: [],
                isLoadAll:false,
                loadMoreTextAll: "加载中...",
			};
		},
        methods: {
            LoadModal(e) {
                this.loadModal = true;
            },
            switchTab(index) {
                this.TabCur = index;
                this.initDataAll(this.cardNo);
            },
        	tabSelect(e) {
        		this.tabIndex = e.currentTarget.dataset.id;
                this.pageNoAll=1,
                this.allData=[];
                this.isLoadAll=false;
                this.loadMoreTextAll="加载中...";
                this.showLoadMoreALL=false;
                this.switchTab(this.tabIndex);
        	},
            initDataAll(cardNo){
                this.LoadModal()
                uni.request({
                    url: this.GLOBAL.GetOilList_URL,
                    dataType: 'jsonp',
                    method: 'POST',

                    data: {
                        access_token:this.token,
                        type: this.TabCur,
                        sub_card:this.cardNo,
                        page_no: this.pageNoAll, // 页码
                        page_size: 10, //条数
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
                    this.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    if( response.code == "000000" ) {
                        this.allData = [];
                        this.allData = this.allData.concat(response.data); 
                        if (this.allData.length < 10) {
                            this.loadMoreTextAll = "没有更多数据了!"
                            this.showLoadMoreALL = true
                        }                       
                        if (this.allData.length == 0) {
                            this.showLoadMoreALL = false
                        }
                        uni.stopPullDownRefresh();
                    } else {
                        if (response.code == "000009") {
                            uni.clearStorage()
                            this.$store.commit('logout')                          
                            uni.reLaunch({
                                url:'../launchPage/launchPage'
                            });
                        }  
                        
                        setTimeout(function () {
                            uni.showToast({
                            	title:response.message,
                                duration: 2000,
                            	icon:"none"
                            })
                        }, 1500);
  
                    }
                }).catch(err => {
                    this.loadModal = false;
                	console.log('request fail', err);
                	uni.showModal({
                		content: err.errMsg,
                		showCancel: false
                	});
                }); 
            },
            
            setListDataAll() {
                this.pageNoAll = this.pageNoAll + 1;
                this.LoadModal()
                uni.request({
                    url: this.GLOBAL.GetOilList_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                        access_token:this.token,
                        type: this.TabCur,
                        sub_card:this.cardNo,
                        page_no: this.pageNoAll, // 页码
                        page_size: 10, //条数
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
                    this.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    if( response.code == "000000" ) {
                        if (response.data.length != 10) {
                            this.loadMoreTextAll = "没有更多数据了!"
                            this.showLoadMoreALL = true
                        } 
                        this.allData = this.allData.concat(response.data);
                        uni.stopPullDownRefresh();
                    } else {

                        if (response.code == "000009") {
                            uni.clearStorage()
                            this.$store.commit('logout')                          
                            uni.reLaunch({
                                url:'../launchPage/launchPage'
                            });
                        } 
                        uni.showToast({
                            title:response.message,
                            icon:"none"
                        })
                    }
                }).catch(err => {
                    this.loadModal = false;
                	console.log('request fail', err);
                	uni.showModal({
                		content: err.errMsg,
                		showCancel: false
                	});
                }); 
            }
        },
        onLoad: function (option) {
            console.log(option.cardNo); //打印出上个页面传递的参数。
            this.cardNo = option.cardNo;
            
            this.initDataAll(option.cardNo);
        },
        onUnload() {
        	this.allData = [],
        	this.loadMoreTextAll = "加载更多",
        	this.showLoadMoreALL= false;
            
        },
        onReachBottom() {

                if (this.loadMoreTextAll == "没有更多数据了!") {
                	return;
                }
                this.showLoadMoreALL = true;
                setTimeout(() => {
                	this.setListDataAll();
                }, 300);
            
        	console.log("onReachBottom");

        },
        onPullDownRefresh() {
            this.pageNoAll = 1;
            this.loadMoreTextAll= "加载中..."
            this.showLoadMoreALL= false
            this.allData = [];
            this.initDataAll(this.cardNo);
        },
	}
</script>

<style scoped>
    
    swiper {
        width: 100%;
        height: 100vh;
    }
    
    .badge {
        background-color: #007AFF;
    }
    
    .line-h {
        height: 1rpx;
        background-color: #cccccc;
    }
    
    .empty {
        height: 400rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }
    .emptyImg {
        margin-top: 20px;
        width: 106px;
        height: 112px;
    }
    .emptyLabel {
        margin-top: 20px;
        text-align: center;
        color: #999999;
    }
    
</style>
