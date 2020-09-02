
const BASE_URL = 'http://yapi.todder.cn/mock/56/'
//const BASE_URL = 'http://192.168.1.8:8077/kzxm/wechat/'
//const BASE_URL = 'https://kazhuxiaomi.4008812356.cn/test/kzxm/wechat/'
//const BASE_URL = 'https://kazhuxiaomi.4008812356.cn/v1/kzxm/wechat/'

// 手机号验证码登录
const LoginWithPhone_URL = BASE_URL + 'loginWithPhone'
//微信验证登录	
const LoginWeChat_URL = BASE_URL + 'wechatAuth'
//修改备注
const ChangeRemark_URL = BASE_URL + 'changeSubCardRemark'
//副卡解除绑定
const UnBindMinorCard_URL = BASE_URL + 'unBindSubCard'
//加油记录	
const GetOilList_URL = BASE_URL + 'getCardConsumeList'
//发送短信验证码	
const SendCode_URL = BASE_URL + 'sendCode'
//奖金收支明细	
const GetBonusList_URL = BASE_URL + 'getPrizeList'
//提交申诉	
const CommitAppeal_URL = BASE_URL + 'addComplain'
//查询绑定过的副卡列表
const GetMinorCardList_URL = BASE_URL + 'getSubCardList'
//查询副卡详情	
const QueryMinorCardDetail_URL = BASE_URL + 'querySubCardDetail'
//查询用户信息	
const GetUserInfo_URL = BASE_URL + 'getDriverInfo'
//申请提现	
const RequestWithdraw_URL = BASE_URL + 'requestGetCash'
//绑定副卡	
const BindMinorCard_URL = BASE_URL + 'bindSubCard'
//退出登录	
const LoginOut_URL = BASE_URL + 'loginOut'
//获取最近一次提现数据
const GetSuccessGetCashBank_URL = BASE_URL + 'getSuccessGetCashBank'
//获取授权
const Auth_URL = BASE_URL + 'auth'
//上传图片
const UploadImage_URL = BASE_URL + 'uploadFile'

export default {
  // 手机号验证码登录
  LoginWithPhone_URL,
  //微信验证登录	
  LoginWeChat_URL,
  //修改备注
  ChangeRemark_URL,
  //副卡解除绑定
  UnBindMinorCard_URL,
  //加油记录	
  GetOilList_URL,
  //发送短信验证码	
  SendCode_URL,
  //奖金收支明细	
  GetBonusList_URL,
  //提交申诉	
  CommitAppeal_URL,
  //查询绑定过的副卡列表
  GetMinorCardList_URL,
  //查询副卡详情	
  QueryMinorCardDetail_URL,
  //查询用户信息	
  GetUserInfo_URL,
  //申请提现	
  RequestWithdraw_URL,
  //绑定副卡	
  BindMinorCard_URL,
  //退出登录	
  LoginOut_URL,
  //获取最近一次提现数据
  GetSuccessGetCashBank_URL,
  //获取登录凭证
  Auth_URL,
  
  //上传图片
  UploadImage_URL
}