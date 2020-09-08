<template>
	<view>
		<view class="top">
		</view>
		<view class="center">
            <view class="centerTop">免费查询服务</view>
            <view class="centerBottom">
                <view class="centerLeft" @click="gotoBonus">
                    <view class="centerToptext">
                        <image src="../../static/success.png"
                         mode="" class="indexImageIcon"></image>
                    </view>
                    <view>
                        <view class="centerBottomtext">副卡快捷查询</view>
                    </view>
                </view>
                 
                <view class="centercenter" @click="gotoBonus">
                    <view class="centerToptext">
                       <image src="../../static/success.png"
                        mode="" class="indexImageIcon"></image>
                    </view>
                    <view>
                        <view class="centerBottomtext">货运在线查询</view>
                    </view>
                </view>
				
				<view class="centerright" @click="gotoBonus">
				    <view class="centerToptext">
				        <image src="../../static/success.png"
				         mode="" class="indexImageIcon"></image>
				    </view>
				    <view>
				        <view class="centerBottomtext">江苏高速路况</view>
				    </view>
				</view>
            </view>
        </view>
	
		<view class="flex solid-bottom padding justify-around">
			<view class="bg-grey padding-sm margin-xs radius">我的副卡</view>
			<view class="bg-grey padding-sm margin-xs radius">我的奖金</view>
		</view>
	
		<view class="bottom">
		    <view class="bottomtop">
		        <text class="topText">江苏石化加油站</text>
		        <button class="cu-btn mini-btn" 
		        :class="['bg-blue', 'shadow']" 
		        @click="bindCard">只看定点加油站</button>
		    </view>
		    
		    <view v-if="data.length==0" class="empty">
		        <image src="/static/empty.png" class="emptyImg"></image>
		        <view class="emptyLabel">
		            未获取到位置信息<br>
		            请检查您的定位服务是否开启
		        </view>
		    </view>
		</view>
	</view>
</template>

<script>
    import Vue from 'vue'
    import {
    	mapState
    } from 'vuex'
    import mediaItem from './oil-item.vue';
	export default {
        computed: {
            ...mapState(['token']),
            topHeight: function() {
                console.log("进来啦");
                let value = Vue.prototype.CustomBar + 120 + 'px';
                return value;
            }
        },
        components: {
            mediaItem
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
        onReachBottom() {
        	console.log("onReachBottom");
        	if (this.loadMoreText == "没有更多数据了!") {
        		return;
        	}
        	this.showLoadMore = true;
        	setTimeout(() => {
        		this.setListData();
        	}, 300);
        },
        onPullDownRefresh() {
            if (this.token == "" || typeof(this.token) == "undefined") {
                
            } else {
                console.log('onPullDownRefresh');
                this.pageNo = 1;
                this.loadMoreText= "加载中..."
                this.showLoadMore= false
                this.LoadModal()
                this.getUserInfo()
            }
            

        },
        methods: {
            LoadModal(e) {
                this.loadModal = true;
            },
            LoadRemarkModal(e) {
                this.remarkModalName = 'Modal';
            },
            getUserInfo() {
                var that = this;
                uni.request({
                    url: this.GLOBAL.GetUserInfo_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                    	access_token:this.token,
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
               
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);

                    if( response.code == "000000" ) {
                        if (response.data.phone != '') {
                            that.balanceBonus = (parseFloat(response.data.prize_remain).toFixed(2)).toString();
                            that.totalBonus = (parseFloat(response.data.total_prize).toFixed(2)).toString();
                            that.phone = response.data.phone
                            
                            that.$store.commit('setPhone',response.data.phone)
                            that.$store.commit('setName',response.data.username)
                            that.$store.commit('setBalanceBonus',response.data.prize_remain)
                            that.$store.commit('setTotalBonus',response.data.total_prize)
                            
                        }
                        that.initData();
                    } else {
                        if (response.code == "000009") {
                            uni.clearStorage()
                            this.$store.commit('logout')
                            uni.reLaunch({
                                url:'../launchPage/launchPage'
                            });
                            setTimeout(function () {
                                uni.showToast({
                                	title:response.message,
                                    duration: 2000,
                                	icon:"none"
                                })
                            }, 1500);
                        } else {
                            that.initData();
                        } 

                    }
                    
                    
                }).catch(err => {
                	console.log('request fail', err);
                	uni.showModal({
                		content: err.errMsg,
                		showCancel: false
                	});
                    that.initData();
                });
            },
            
            showModal(e) {
                if (this.token == "" || typeof(this.token) == "undefined") {
                    uni.showModal({
                        title: '提示',
                        content: '您当前未登录，登录后可享受更好的服务',
                        confirmText: '去登录',
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                                uni.reLaunch({
                                    url:"../launchPage/launchPage?unlogin="+"unlogin"
                                });
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });
                } else {
                    this.modalName = 'bottomModal'
                }
            },
            hideModal(e) {
            	this.modalName = null
                this.remarkModalName = null
                this.deleteTag = null
            },
			initData(){
                this.max = 0;
                uni.request({
                    url: this.GLOBAL.GetMinorCardList_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                        access_token:this.token,
                        page_no: this.pageNo, // 页码
                        page_size: 50, //条数
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
                    this.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    if( response.code == "000000" ) {
                        this.data = [];
                        var tempArray = [];
                        for (var i=0; i<response.data.length; i++) {
                            var driver_remark = (response.data[i].driver_remark == "" ?
                             "添加备注":response.data[i].driver_remark)
                            var item = {
                                sub_card: response.data[i].sub_card, // 页码
                                driver_remark: driver_remark,
                                cardBalance:"0.00",
                                preBalance:"0.00",
                                queryResult:false,
                                eyeStatus:false,
                            };
                            tempArray.push(item)
                        }
                        this.data = this.data.concat(tempArray);
                        
                        if (this.data.length < 50) {
                            this.loadMoreText = "没有更多数据了!"
                            this.showLoadMore = true
                        } 
                        if (this.data.length == 0) {
                            this.showLoadMore = false
                        }
                        
                        uni.stopPullDownRefresh();
                    }  else {

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
                	uni.showModal({
                		content: err.errMsg,
                		showCancel: false
                	});
                }); 
			},
			setListData() {
            
                this.pageNo = this.pageNo + 1;
                this.LoadModal()
                uni.request({
                    url: this.GLOBAL.GetMinorCardList_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                        access_token:this.token,
                        page_no: this.pageNo, // 页码
                        page_size: 50, //条数
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
                    this.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    if( response.code == "000000" ) {
                        if (response.data.length != 50) {
                            this.loadMoreText = "没有更多数据了!"
                            this.showLoadMore = true
                        } 
                        
                        var tempArray = [];
                        for (var i=0; i<response.data.length; i++) {
                            var driver_remark = (response.data[i].driver_remark == "" ?
                             "添加备注":response.data[i].driver_remark)
                            var item = {
                                sub_card: response.data[i].sub_card, //
                                driver_remark: driver_remark,
                                cardBalance:"0.00",
                                preBalance:"0.00",
                                queryResult:false,
                                eyeStatus:false,
                            };
                            tempArray.push(item)
                        }
                        this.data = this.data.concat(tempArray);
                        uni.stopPullDownRefresh();
                    }  else {
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
            bindCard() {
                
				uni.navigateTo({
				    url:'./newIndex'
				})
				
				
				
                // if (this.token == "" || typeof(this.token) == "undefined") {
                //     uni.showModal({
                //         title: '提示',
                //         content: '您当前未登录，登录后可享受更好的服务',
                //         confirmText: '去登录',
                //         success: function (res) {
                //             if (res.confirm) {
                //                 console.log('用户点击确定');
                //                 uni.reLaunch({
                //                     url:"../launchPage/launchPage?unlogin="+"unlogin"
                //                 });
                //             } else if (res.cancel) {
                //                 console.log('用户点击取消');
                //             }
                //         }
                //     });
                // } else {
                //     uni.navigateTo({
                //         url:'../subCard/subCard'
                //     })
                // }
            },
            gotoBonus() {
                if (this.token == "" || typeof(this.token) == "undefined") {
                    uni.showModal({
                        title: '提示',
                        content: '您当前未登录，登录后可享受更好的服务',
                        confirmText: '去登录',
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                                uni.reLaunch({
                                    url:"../launchPage/launchPage?unlogin="+"unlogin"
                                });
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });
                } else {
                    uni.requestSubscribeMessage({
                      tmplIds: ['-J8R4OBk7idcJ5EzMay0G-maBq8jVMITDkCs7hbEDA4'],
                      success (res) {
                            console.log(res)
                                if( res.TEMPLATE_ID == 'accept' ) {
                                } else {
                                  
                                }
                            }
                    })
                    
                    uni.navigateTo({
                        url:("../bonus/bonus?balance="+this.balanceBonus)
                    })
                }
            },
            logout() {
                this.hideModal()
                this.LoadModal()
                uni.request({
                    url: this.GLOBAL.LoginOut_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                    	access_token:this.token,
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
                    this.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    uni.showToast({
                    	title:response.message,
                    	icon:"none"
                    })

                }).catch(err => {
                	console.log('request fail', err);
                	uni.showModal({
                		content: err.errMsg,
                		showCancel: false
                	});
                });
                
                uni.clearStorage()
                this.data = []
                this.balanceBonus = "0.00"
                this.totalBonus = "0.00"
                this.$store.commit('logout')
                uni.navigateTo({
                    url:'../launchPage/launchPage'
                });
            },
            deleteCard(item) {
                // this.deleteTag = "alert"
                // this.currentCard = item.sub_card
                var that = this;
                uni.showModal({
                    title: '解除绑定',
                    content: '解除绑定后，您将不再享受有效消费奖励，确定继续吗？',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            that.sureDelete(item)
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            },
            sureDelete(item) {
                this.hideModal()
                var that = this;
                uni.request({
                    url: this.GLOBAL.UnBindMinorCard_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                        access_token:this.token,
                        sub_card:item.sub_card,
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
                    this.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    if( response.code == "000000" ) {
                        uni.showToast({
                        	title:response.message,
                        	icon:"none"
                        })
                        that.initData();
                    }  else {
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

            queryList(item) {
                uni.navigateTo({
                    url:("../oilList/oilList?cardNo="+item.sub_card)
                })
            },
            changeRemark(item) {
                console.log(item.sub_card);
                this.LoadRemarkModal();
                
                if(item.driver_remark == "添加备注" || item.driver_remark.length == 0) {
                    this.modalTatil = "添加备注"
                    this.driver_remark = ""
                } else {
                    this.modalTatil = "修改备注"
                    this.driver_remark = item.driver_remark
                }
                
                this.remarkCard = item.sub_card
            },
            
            queryBalance(item) {
                if (item.eyeStatus == true) {
                    // 如果已经查过,只需要展示
                    item.eyeStatus = false
                } else {
                    this.LoadModal()
                    uni.request({
                        url: this.GLOBAL.QueryMinorCardDetail_URL,
                        dataType: 'jsonp',
                        method: 'POST',
                        data: {
                            access_token:this.token,
                            sub_card:item.sub_card,
                        }
                    }).then(data => {
                        //data为一个数组，数组第一项为错误信息，第二项为返回数据
                        this.loadModal = false;
                        var [error, res]  = data;
                        console.log(res.data);
                        let response = JSON.parse(res.data);
                        if( response.code == "000000" ) {
                            item.cardBalance = response.data.cardBalance
                            item.preBalance = response.data.preBalance
                            item.queryResult = true
                            item.eyeStatus = true
                        }  else {

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
                }
            },
            
            change() {
                this.hideModal()
                if (this.driver_remark.length == 0) {
                    return;
                }
                var that = this;
                uni.request({
                    url: this.GLOBAL.ChangeRemark_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                        access_token:this.token,
                        sub_card:this.remarkCard,
                        remark: this.driver_remark
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
                    this.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    if( response.code == "000000" ) {
                        uni.showToast({
                        	title:response.message,
                        	icon:"none"
                        })
                        that.initData();
                    }  else {

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
            }
		}
	}
</script>

<style scoped>
    
    .top {
        width: 100%;
        background-color: #0A98D5;
		height: 180rpx;
    }
    
    .center {
        width: 700rpx;
        height: 240rpx;
        background-color: #FFFFFF;
        position: relative;
        margin-top: -120rpx;
        margin-left: calc((100% - 700rpx)/2);
        border-radius:5px;
    }
    
    .bottom {
        width: 100%;
/*        height: calc(100% - topHeight); */
    }
    
    .bottomtop {
        width: 100%;
        height: 100rpx;
        background-color: unset;
        display: flex;
        flex-direction: row;
        align-items : center;
        justify-content : space-between;
    }
    
    .bottombottom {
    }
    
    .navtitle {
        color: #FFFFFF;
        font-size: 36upx;
        margin-bottom: 100px;
      
    }
    
    
    .headImage {
        width: 48rpx;
        height: 48rpx;
        margin-left: 12px;
        margin-bottom: 100px;
    }
    
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
        color: #333333;
        font-weight: 500;
        font-size: 36rpx;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
    
    
    .topText {
        color: #333333;
        font-size: 38rpx;
        font-weight: 700;
        line-height: 100rpx;
        margin-left: 20rpx;
    }
    
    .mini-btn {
        height: 60rpx;
        padding-left: 30rpx;
        padding-right: 30rpx;
        font-size: 28rpx;
        margin-right: 20px;
    }
    
    .text {
    	margin: 16rpx 0;
    	width:100%;
    	background-color: #fff;
    	height: 120rpx;
    	line-height: 120rpx;
    	text-align: center;
    	color: #555;
    	border-radius: 8rpx;
    }
    
    .centerTop {
        padding-top: 10rpx;
        font-size: 38rpx;
        font-weight: 700;
        margin-left: 30rpx;
    }
    .centerBottom {
        margin: 20rpx;
        background-color: #FFFFFF;
        height: 140rpx;
        border-radius: 4px;
        display: flex;
        flex-direction: row;
    }

    .centerToptext {
        height: 70rpx;
    	color: #e54d42;
    	font-size: 24px;
    
    }
    .centerBottomtext {
        margin-top: 10rpx;
        height: 70rpx;
    	color: #333333;
    	font-size: 16px;
    }
    .centerLeft {
        flex: 0.33;
        flex-direction: column;
        justify-content: center;
        display: flex;
        text-align: center;
    }
    
	.centercenter {
	   flex: 0.33;
	   flex-direction: column;
	   justify-content: center;
	   display: flex; 
	   text-align: center;
	}
	
    .centerright {
       flex: 0.33;
       flex-direction: column;
       justify-content: center;
       display: flex; 
       text-align: center;
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
    
    .itemBar {
        display: flex;
        position: relative;
        align-items: center;
        min-height: 100upx;
        justify-content: center;
        border-radius: 10px;
    }
    
    .itemBartitle {
        display: flex;
        position: relative;
        align-items: center;
        min-height: 100upx;
        justify-content: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    
    .itemBarContent {
        display: flex;
        position: relative;
        align-items: center;
        min-height: 100upx;
        justify-content: center;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    
    .itemcontent {
        width: 100%;
        padding: 5px;
        font-size: 32rpx;
    }
    
    .logout {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin-left: auto;
        margin-right: auto;
        width: 680upx;
        max-width: 100%;
        background-color: unset;
        border-radius: 10upx;
        overflow: hidden;
    }
    .line-h {
        height: 1px;
        width: 100%;
        background-color: #f0f0f0;
    }
    .inputFont {
        font-size: 30rpx;
    }
	.indexImageIcon {
		width: 80rpx;
		height: 80rpx;
	}
	
</style>
