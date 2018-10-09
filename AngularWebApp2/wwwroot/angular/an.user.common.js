var userApp = angular.module('userApp', ['ui.router', 'infinite-scroll','ui.sortable']);
//注入$stateProvider，$urlRouterProvider
userApp.config(['$stateProvider', '$urlRouterProvider', function ( $stateProvider, $urlRouterProvider ) {
    // 通过$stateProvider的state()函数来进行路由定义 
    $stateProvider.state('index', { //首页默认是系统消息
   		url:'/index',
   		templateUrl: 'shared/meau.html?v=' + Math.random(),
   		controller: function ($state, $compile, $stateParams, $injector) {
   		    $state.go('index.index');
   		    $injector.get('$templateCache').removeAll();
        }
    }).state('index.index',{//默认显示系统消息
    	url:'/',
    	templateUrl: 'Message/system.html?v=' + Math.random(),
   		controller: 'SystemCtrl',
   		data : { pageTitle: '个人中心' }  
    })
    //消息动态
    $stateProvider.state('message', {
   		url:'/message',
   		templateUrl: 'shared/meau.html?v=' + Math.random(),
    }).state('message.system', {
    	url:'/system',
    	templateUrl: 'Message/system.html?v=' + Math.random(),
   		controller: 'SystemCtrl',
   		data : { pageTitle: '系统消息' }  
    }).state('message.comment', {
    	url:'/comment',
    	templateUrl: 'Message/comment.html?v=' + Math.random(),
   		controller: 'CommentCtrl',
   		data : { pageTitle: '我的评论' }  
    }).state('message.privateMsg', {
    	url:'/privateMsg',
    	templateUrl: 'Message/privateMsg.html?v=' + Math.random(),
   		controller: 'PrivateMsgCtrl',
   		data : { pageTitle: '我的私信' }  
    }).state('message.answers', {
    	url:'/answers',
    	templateUrl: 'Message/answers.html?v=' + Math.random(),
   		controller: 'AnswersCtrl',
   		data : { pageTitle: '我的问答' }  
    }).state('message.follow', {
    	url:'/follow',
    	templateUrl: 'Message/follow.html?v=' + Math.random(),
   		controller: 'FollowCtrl',
   		data : { pageTitle: '我的关注' }  
    })
    //交易中心
    $stateProvider.state('trade', {
   		url:'/trade',
   		templateUrl: 'shared/meau.html?v=' + Math.random(),
    }).state('trade.maintain', {
    	url:'/maintain',
    	templateUrl: 'Trade/maintain.html?v=' + Math.random(),
   		controller: 'MaintainCtrl',
   		data : { pageTitle: '保养订单' }  
    }).state('trade.maintainDetail', {
    	url:'/maintainDetail/:id',
    	templateUrl: 'Trade/maintainDetail.html?v=' + Math.random(),
   		controller: 'MaintainDetailCtrl',
   		data : { pageTitle: '保养详情' }  
    }).state('trade.repair', {
    	url:'/repair',
    	templateUrl: 'Trade/repair.html?v=' + Math.random(),
   		controller: 'RepairCtrl',
   		data : { pageTitle: '预约维修'}  
    }).state('trade.repairDetail', {
    	url:'/repairDetail/:id',
    	templateUrl: 'Trade/repairDetail.html?v=' + Math.random(),
   		controller: 'RepairDetailCtrl',
   		data : { pageTitle: '维修详情'}  
    }).state('trade.ticket', {
    	url:'/ticket',
    	templateUrl: 'Trade/ticket.html?v=' + Math.random(),
   		controller: 'TicketCtrl',
   		data : { pageTitle: '活动订单'}  
    }).state('trade.ticketDetail', {
    	url:'/ticketDetail/:id',
    	templateUrl: 'Trade/ticketDetail.html?v=' + Math.random(),
   		controller: 'TicketDetailCtrl',
   		data : { pageTitle: '订单详情'}  
    })
    
    //订阅收藏
    $stateProvider.state('collection', {
   		url:'/collection',
   		templateUrl: 'shared/meau.html?v=' + Math.random(),
    }).state('collection.mySubscribe',{
    	url:'/mySubscribe',
    	templateUrl: 'Collection/mySubscribe.html?v=' + Math.random(),
   		controller: 'SubscribeCtrl',
   		data : { pageTitle: '我的订阅' }  
    }).state('collection.myCollection',{
    	url:'/myCollection',
    	templateUrl: 'Collection/myCollection.html?v=' + Math.random(),
   		controller: 'CollectionCtrl',
   		data : { pageTitle: '我的收藏' }  
    })
    //我的钱包
    $stateProvider.state('wallet', {
   		url:'/wallet',
   		templateUrl: 'shared/meau.html?v=' + Math.random(),
    }).state('wallet.balance',{
    	url:'/balance',
    	templateUrl: 'Wallet/balance.html?v=' + Math.random(),
   		controller: 'BalanceCtrl',
   		data : { pageTitle: '账户余额' }  
    })
    //我的积分
    $stateProvider.state('integral', {
   		url:'/integral',
   		templateUrl: 'shared/meau.html?v=' + Math.random(),
    }).state('integral.exchange',{
    	url:'/exchange',
    	templateUrl: 'Integral/exchange.html?v=' + Math.random(),
   		controller: 'IntegralExchangeCtrl',
   		data : { pageTitle: '积分兑换' }  
    }).state('integral.luckDraw',{
    	url:'/luckDraw',
    	templateUrl: 'Integral/luckDraw.html?v=' + Math.random(),
   		controller: 'IntegralLuckDrawCtrl',
   		data : { pageTitle: '积分抽奖' }  
    }).state('integral.task',{
    	url:'/task',
    	templateUrl: 'Integral/task.html?v=' + Math.random(),
   		controller: 'IntegralTaskCtrl',
   		data : { pageTitle: '积分任务' }
    })
    //优惠券
    $stateProvider.state('coupon', {
   		url:'/coupon',
   		templateUrl: 'shared/meau.html?v=' + Math.random(),
    }).state('coupon.myCoupon',{
    	url:'/myCoupon',
    	templateUrl: 'Coupon/myCoupon.html?v=' + Math.random(),
   		controller: 'MyCouponCtrl',
   		data : { pageTitle: '我的优惠券' }  
    }).state('coupon.center',{
    	url:'/center',
    	templateUrl: 'Coupon/center.html?v=' + Math.random(),
   		controller: 'CouponCenterCtrl',
   		data : { pageTitle: '领券中心' }  
    })
    //内容管理
    $stateProvider.state('content', {
   		url:'/content',
   		templateUrl: 'shared/meau.html?v=' + Math.random(),
    }).state('content.article',{
    	url:'/article',
    	templateUrl: 'Content/article.html?v=' + Math.random(),
   		controller: 'ArticleMgrCtrl',
   		data : { pageTitle: '文章管理' }  
    }).state('content.activity',{
    	url:'/activity',
    	templateUrl: 'Content/activity.html?v=' + Math.random(),
   		controller: 'ActivityMgrCtrl',
   		data : { pageTitle: '活动管理' }  
    }).state('content.topic',{
    	url:'/topic',
    	templateUrl: 'Content/topic.html?v=' + Math.random(),
   		controller: 'TopicMgrCtrl',
   		data : { pageTitle: '活动管理' }  
    }).state('content.publishActivity',{
    	url:'/publishActivity/:id',
    	templateUrl: 'Content/publishActivity.html?v=' + Math.random(),
   		controller: 'PublishActivityCtrl',
   		data : { pageTitle: '发布活动' }  
    }).state('content.publishArticle',{
    	url:'/publishArticle/:id',
    	templateUrl: 'Content/publishArticle.html?v=' + Math.random(),
   		controller: 'publishArticleCtrl',
   		data : { pageTitle: '发布文章' }  
    })
     //账户设置
    $stateProvider.state('account', {
   		url:'/account',
   		templateUrl: 'shared/meau.html?v=' + Math.random(),
    }).state('account.safeSetting',{
    	url:'/safeSetting',
    	templateUrl: 'Account/safeSetting.html?v=' + Math.random(),
   		controller: 'SafeSettingCtrl',
   		data : { pageTitle: '安全设置' }  
    }).state('account.personal',{
    	url:'/personal',
    	templateUrl: 'Account/personal.html?v=' + Math.random(),
   		controller: 'PersonalCtrl',
   		data : { pageTitle: '个人资料' }  
    }).state('account.address',{
    	url:'/address',
    	templateUrl: 'Account/address.html?v=' + Math.random(),
   		controller: 'AddressCtrl',
   		data : { pageTitle: '收货地址' }  
    }).state('account.myCar',{
    	url:'/myCar',
    	templateUrl: 'Account/myCar.html?v=' + Math.random(),
   		controller: 'MyCarCtrl',
   		data : { pageTitle: '我的爱车' }  
    })
    //大咖认证
    $stateProvider.state('authentication', {
   		url:'/authentication',
   		template: '<ui-view />',
    }).state('authentication.index',{
    	url:'/index',
    	templateUrl: 'Authentication/index.html?v=' + Math.random(),
   		controller: 'AuthenticationIndexCtrl',
   		data : { pageTitle: '大咖认证' }  
    }).state('authentication.company',{
    	url:'/company',
    	templateUrl: 'Authentication/company.html?v=' + Math.random(),
   		controller: 'AuthenticationCompanyCtrl',
   		data : { pageTitle: '企业认证' }  
    }).state('authentication.biggie',{
    	url:'/biggie',
    	templateUrl: 'Authentication/biggie.html?v=' + Math.random(),
   		controller: 'AuthenticationBiggieCtrl',
   		data : { pageTitle: '大咖认证' } 
    }).state('authentication.realName',{
    	url:'/realName',
    	templateUrl: 'Authentication/realName.html?v=' + Math.random(),
   		controller: 'RealNameCtrl',
   		data : { pageTitle: '实名认证' }  
    }).state('authentication.examine',{
    	url:'/examine',
    	templateUrl: 'Authentication/examine.html?v=' + Math.random(),
    	controller: "examineCtrl",
   		data : { pageTitle: '提交审核' }  
    }).state('authentication.protocol',{
    	url:'/protocol',
    	templateUrl: 'Authentication/protocol.html?v=' + Math.random(),
   		data : { pageTitle: '大咖协议' }  
    })
    
    $urlRouterProvider.when('', '/index');
    $urlRouterProvider.otherwise('/index');
}]);
// 禁止模板缓存  
userApp.run(function ($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (typeof (current) !== 'undefined') {
            $templateCache.removeAll();
        }
    });
});
//更新网页title方法
userApp.directive('updateTitle', ['$rootScope', '$timeout',
	function($rootScope, $timeout) {
	    return {
	      link: function(scope, element) {
	
	        var listener = function(event, toState) {
	
	            var title = '个人中心'; //默认title
	            if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;
	
	            $timeout(function() {
	                element.text(title);
	            }, 0, false);
	        };
	        $rootScope.$on('$stateChangeSuccess', listener);
	      }
	    };
	}
]);
//总公共控制器
userApp.controller("wholeCtrl", function ($scope, $rootScope, $filter, $http) {
    //菜单是否展开判断
    $rootScope.isOpen = {
        message: false, //消息动态
        trade: false, //交易中心
        collection: false, //订阅收藏
        wallet: false, //我的钱包
        integral: false, //我的积分
        coupon: false, //优惠券
        content: false, //内容管理
        account: false, //账户设置
    }
    //系统新消息
    $scope.isHasNewMsg = {
        SysMessage: false,//系统消息
        allCount:0,
        MyRecommend: false,//我的评论
        MyQuestion: false,//我的问答
        MyFollow: false,//我的关注
        MyPrivateMsg: false,//我的私信
        all: false,
        collectAll:false,//我的收藏导航
        MySubscribe: false,//我的订阅消息
        MySubscribeCol: false,//我订阅的消息（栏目）
        MySubscribeTip: false,//我订阅的消息（话题）
    };
    $scope.btnUploadBgImg = false;//上传背景图按钮
    $scope.signData = {//签到数据
        isShowIntegral: false,
        currentMonthList: [],//当月所签到的天数
        dayList: [],
        month: "",
        year: "",
        dayCount: 0,
        isRightClick: true
    }
    //获取其他站点
    $rootScope.configPort = {
        web: configPort[0].Value,
        party: configPort[1].Value,
        shop: configPort[2].Value,
        maintain: configPort[3].Value,
        sso: configPort[4].Value,
        staticFile: configPort[5].Value
    };
    //获取新信息
    $http({
        url: "/Api/UserCenterV2/MymessageNotic",
        method: "POST"
    }).success(function (data) {
        if (data.Success) {
//          if (data.Data.NewDynamicMsg.length > 0) {
//              $scope.isHasNewMsg.all = true;
            //          }
            angular.forEach(data.Data.NewDynamicMsg, function (item) {
                switch (item.Type) {
                    case 1:
                        $scope.isHasNewMsg.SysMessage = true;
                        $scope.isHasNewMsg.all = true;
                        $scope.isHasNewMsg.allCount += 1;
                        break;
                    case 2:
                        $scope.isHasNewMsg.MyRecommend = true;
                        $scope.isHasNewMsg.all = true;
                        $scope.isHasNewMsg.allCount += 1;
                        break;
                    case 3:
                        $scope.isHasNewMsg.MyPrivateMsg = true;
                        $scope.isHasNewMsg.all = true;
                        break;
                    case 6:
                        $scope.isHasNewMsg.MyQuestion = true;
                        $scope.isHasNewMsg.all = true;
                        $scope.isHasNewMsg.allCount += 1;
                        break;
                    case 5:
                        $scope.isHasNewMsg.MyFollow = true;
                        $scope.isHasNewMsg.all = true;
                        $scope.isHasNewMsg.allCount += 1;
                        break;
                    case 7://订阅话题
                        $scope.isHasNewMsg.collectAll = true;
                        $scope.isHasNewMsg.MySubscribe = true;
                        $scope.isHasNewMsg.MySubscribeTip = true;
                        break;
                    case 8://订阅栏目
                        $scope.isHasNewMsg.collectAll = true;
                        $scope.isHasNewMsg.MySubscribe = true;
                        $scope.isHasNewMsg.MySubscribeCol = true;
                        break;
                    default:
                        break;
                }
            });
        }
    });
    //获取用户信息
    $scope.getUserInfo = function(){
	    $.ajax({
	        type: "get",
	        url: "/Api/Home/GetUserInfo",
	        async: false,
	        success: function (data) {
	            console.log(data)
	            if (data.IsLogon == false) { //判断登录
	                window.location.href = data.Data + '?backurl=' + document.URL;
	                $scope.nologin = true;
	            } else {
	                $scope.islogin = true;
	                $scope.UserInfo = data.Data[0];
	                $scope.UserInfo.HeadImgUrl = $filter('noHeadImage')($scope.UserInfo.HeadImgUrl, $rootScope.configPort.staticFile);
	                //背景图片
	                $scope.BackgroundImg = data.Data[0].UserBackUrl != null ? data.Data[0].UserBackUrl : $rootScope.configPort.staticFile +"/web/Content_/img/zx_back.jpg" ;
	            }
	        }
	    });
	}
    $scope.getUserInfo();
    //退出登录
    $scope.loginOff = function(){
    	window.location.href= $scope.configPort.web + "/home/LogOff?backurl=" + $scope.configPort.web;
    }
    //菜单切换方法
    $scope.toggleMeau = function (type) {
        switch (type) {
            case 'message': $rootScope.isOpen = {
                message: !$rootScope.isOpen.message, trade: false, collection: false, wallet: false, integral: false, coupon: false, content: false, account: false,
            }
                break;
            case 'trade': $rootScope.isOpen = {
                message: false, trade: !$rootScope.isOpen.trade, collection: false, wallet: false, integral: false, coupon: false, content: false, account: false,
            }
                break;
            case 'collection': $rootScope.isOpen = {
                message: false, trade: false, collection: !$rootScope.isOpen.collection, wallet: false, integral: false, coupon: false, content: false, account: false,
            }
                break;
            case 'wallet': $rootScope.isOpen = {
                message: false, trade: false, collection: false, wallet: !$rootScope.isOpen.wallet, integral: false, coupon: false, content: false, account: false,
            }
                break;
            case 'integral': $rootScope.isOpen = {
                message: false, trade: false, collection: false, wallet: false, integral: !$rootScope.isOpen.integral, coupon: false, content: false, account: false,
            }
                break;
            case 'coupon': $rootScope.isOpen = {
                message: false, trade: false, collection: false, wallet: false, integral: false, coupon: !$rootScope.isOpen.coupon, content: false, account: false,
            }
                break;
            case 'content': $rootScope.isOpen = {
                message: false, trade: false, collection: false, wallet: false, integral: false, coupon: false, content: !$rootScope.isOpen.content, account: false,
            }
                break;
            case 'account': $rootScope.isOpen = {
                message: false, trade: false, collection: false, wallet: false, integral: false, coupon: false, content: false, account: !$rootScope.isOpen.account,
            }
                break;
        }
    }
    //获取年月的天数列表
    $scope.getDateList = function (year, month) {
        var nowDate = new Date();//当前日期
        var currentDate = new Date(year, month, 0);//传入的日期
        var lastMonthCount = new Date(year, month - 1, 0).getDate();//传入日期的前一个月天的总数，用于列表不是当月日期的灰色填充（即当月1号不是星期日，那么使用上一个月的数据填充列表）
        var count = currentDate.getDate();//传入日期的总天数
        var week = new Date(year, month - 1, 1).getDay();//传入日期月份的1号是周几
        var dateList = new Array();//日期数据列表
        for (var i = 0; i < Math.ceil((count + week) / 7) * 7 ; i++) {
            var itemDate = {
                data: "",
                isMonth: false,
                isToday: false,
                isInSign: false
            };
            if (i < week) {
                itemDate.data = lastMonthCount - (week - i) + 1;
            } else if (i < count + week) {
                itemDate.data = i - week + 1;
                itemDate.isMonth = true;
                for (var j = 0; j < $scope.signData.currentMonthList.length; j++) {
                    var dayList = $scope.signData.currentMonthList[j].SignInDate.split("-");
                    if (itemDate.data == dayList[2]) {
                        itemDate.isInSign = true;
                    }
                }
                if ((i - week + 1) == nowDate.getDate() && year == nowDate.getFullYear() && month == (nowDate.getMonth() + 1)) {
                    itemDate.isToday = true;
                    itemDate.data = "今天";
                }
            } else {
                itemDate.data = i - count - week + 1;
            }
            dateList.push(itemDate);
        }
        $scope.signData.dayList = dateList;
    }
    $scope.getSignInlist = function () {
        $http({
            url: "/Api/UserCenterV2/GetSignInList",
            data: {
                year: $scope.signData.year,
                month: $scope.signData.month
            },
            method: "POST"
        }).success(function (data) {
            if (data.Success) {
                $scope.signData.currentMonthList = data.Data;
                $scope.getDateList($scope.signData.year, $scope.signData.month);
            }
        });
    }
    //点击上个月
    $scope.lastMonth = function () {
        $scope.signData.isRightClick = true;
        if ($scope.signData.month == 1) {
            $scope.signData.month = 12;
            $scope.signData.year -= 1;
        } else {
            $scope.signData.month -= 1;
        }
        $scope.getSignInlist();
    }
    //点击下个月
    $scope.nextMonth = function () {
        var myDate = new Date();//当前日期
        if (($scope.signData.year == myDate.getFullYear() && ($scope.signData.month - myDate.getMonth() - 1) < 2) || ($scope.signData.year > myDate.getFullYear() && ($scope.signData.month - myDate.getMonth() - 1) < -9)) {
            $scope.signData.isRightClick = true;
            if ($scope.signData.month == 12) {
                $scope.signData.month = 1;
                $scope.signData.year += 1;
            } else {
                $scope.signData.month += 1;
            }
            $scope.getSignInlist();
            if (($scope.signData.month - myDate.getMonth() - 1) == 2 || ($scope.signData.month - myDate.getMonth() - 1) == -12) {
                $scope.signData.isRightClick = false;
            }
        } else {
            $scope.signData.isRightClick = false;
        }
    }
    //签到弹窗
    $scope.signShow = function () {
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#sign_pop')
        });
        var myDate = new Date();//当前日期
        $scope.signData.year = myDate.getFullYear();
        $scope.signData.month = myDate.getMonth() + 1;
        $scope.getSignInlist();
    }
    //立即签到按钮方法
    $scope.nowSign = function () {
        if (!$scope.UserInfo.IsSign) {
            $http({
                url: "/Api/UserCenterV2/SignIn",
                method: "POST"
            }).success(function (data) {
                if (data.Success) {
                    $scope.UserInfo.IsSign = true;
                    $scope.UserInfo.TotalPointBalance += data.Data.RewardPointAmount;//当前积分
                    $scope.UserInfo.TodaySignPoint = data.Data.RewardPointAmount;
                    $scope.UserInfo.SignSerialTimes += 1;
                    angular.forEach($scope.signData.dayList, function (item) {
                        if (item.data == "今天") {
                            item.isInSign = true;
                        }
                    });
                } else {
                    layer.msg(data.Message);
                }
            });
        }
    }
	 //切换上传背景图
    $scope.toggleBtnUpBg = function () {
        $scope.btnUploadBgImg = !$scope.btnUploadBgImg;
    }
  	//上传背景图方法
  	$scope.uploadBgImg = function(ele){
  		var objUrl = ele.files[0]; 
  		if(objUrl.size/1024 > 2* 1024){
  			layer.msg('请上传小于2M的图片');
  			return false;
  		}
  		var formdata = new FormData();
  		formdata.append('uploadType','background');
  		formdata.append('headimg',objUrl);
  		var index = layer.load(1, {
		  shade: [0.1,'#fff'] //0.1透明度的白色背景
		});
  		$.ajax({
  			type:"post",
  			url:"/Common/Upload",
  			data : formdata,
  			processData:false,
  			contentType : false,
  			success : function(data){
  				$scope.closePopWindow();//关闭
  				if(data.Success){
  					$scope.BackgroundImg = data.Data;
  					$scope.btnUploadBgImg = false;//关闭按钮
  					$scope.$apply()
  				}else{
  					layer.msg(data.Message)
  				}
  			}
  		});
  	}
    //根据数据设置分页的方法
    $scope.setPage = function (data) {
        if (data.pageTotal > 1) {//当页总数大于1时
            $scope.morePage = true;//显示分页导航
            $scope.pageNum = data.pageNum;//当前页数
            var pageList = new Array();
            var pageSum = 10;//分页导航最多可显示20个，可设置，但目前只能是偶数（未做奇偶数判断）
            if (data.pageTotal < pageSum + 1) {//
                for (var i = 1; i < data.pageTotal + 1; i++) {
                    pageList.push(i);
                }
                $scope.showLeftSpot = false;//不显示左边...
                $scope.showRightSpot = false;//不显示右边...
            } else {
                if ($scope.PageNum < pageSum / 2 + 1) {
                    $scope.showLeftSpot = false;
                    $scope.showRightSpot = true;
                    for (var i = 1; i < pageSum + 1; i++) {
                        pageList.push(i);
                    }
                } else {
                    $scope.showLeftSpot = true;
                    $scope.showRightSpot = true;
                    if ($scope.PageNum + pageSum / 2 > data.pageTotal) {
                        for (var i = data.pageTotal - pageSum; i < data.pageTotal + 1; i++) {
                            pageList.push(i);
                        }
                    } else {
                        for (var i = $scope.PageNum - pageSum / 2; i < $scope.PageNum + pageSum / 2 + 1; i++) {
                            pageList.push(i);
                        }
                    }
                    if ($scope.PageNum == data.pageTotal) {
                        $scope.showRightSpot = false;
                    }
                }
            }
            $scope.pageList = pageList;//设置分页导航列表
        } else {//当页数总数未1时
            $scope.morePage = false;//不显示分页导航
            $scope.pageList = "";
        }
    }
    //关闭弹出层
    $scope.closePopWindow = function () {
        layer.closeAll()
    }
})
//是否显示默认头像过滤器
.filter('noHeadImage', function () {
    return function (input, staticSite) {
        if (input == null) {
            input = staticSite + "/web/Content_/img/man.jpg";
        }
        return input;
    }
})
//字符串长度，过长时...（中英文实际长度）
.filter('fontLength', function () {
    return function (input, long) {
        if (input != null && input != '' && long) {
            var str = input;
            var leng=str.replace(/[^\x00-\xff]/g, "aa").length;
            if (leng > long) {
                input = cutstr(input, long);
            }
        }
        return input;
    }
})
//将阿拉伯数字转换成中文小写
.filter('lowercaseChinese', function () {
    return function (input) {
        if (input != null) {
            switch (input) {
                case 1:
                    input = "一";
                    break;
                case 2:
                    input = "二";
                    break;
                case 3:
                    input = "三";
                    break;
                case 4:
                    input = "四";
                    break;
                case 5:
                    input = "五";
                    break;
                case 6:
                    input = "六";
                    break;
                case 7:
                    input = "七";
                    break;
                case 8:
                    input = "八";
                    break;
                case 9:
                    input = "九";
                    break;
                case 10:
                    input = "十";
                    break;
                case 11:
                    input = "十一";
                    break;
                case 12:
                    input = "十二";
                    break;
                default:
                    break;
            }
        }
        return input;
    }
})
     //时间格式
.filter('timeFilter', function () {
        return function (input) {
            if (input != null) {
                input = input.replace(/-/g, "/");
                var date = new Date(input);
                var m_y = date.getFullYear();
                var m_m = date.getMonth() + 1;
                var m_d = date.getDate();
                input = m_y + "." + m_m + "." + m_d;
            }
            return input;
        }
    })
//分页
.directive('paging', function () {
    return {
        restrict: 'ECMA',
        replace: true,    //替换的方式插入内容//绑定策略
        template: function () {
            return '<div class="pageCount mt10 mb10" ng-show="morePage" id="morePage">\
                    <button ng-click="golastPage()" id="goLast" ng-disabled="pageNum==1">&laquo;</button>\
                    <div id="pages">\
                        <ul>\
                            <li ng-show="showLeftSpot">...</li>\
                            <li ng-repeat="x in pageList" ng-click="goPage(x)" ng-class="pageNum==x?\'active\':\'\'">{{x}}</li>\
                            <li ng-show="showRightSpot">...</li>\
                        </ul>\
                    </div>\
                    <button ng-click="goNextPage(pageTotal)" id="goNext" ng-disabled="pageNum==pageTotal">&raquo;</button>\
                </div>';
        }
    }
})
 .directive('loadingAnim', function () {
    return {
        restrict: 'ECMA',
        template: function () {
            return '<div class="loaded">\
         <p>正在加载，请稍等...</p>\
        <div class="loader-inner ball-spin-fade-loader">\
          <div></div>\
          <div></div>\
          <div></div>\
          <div></div>\
          <div></div>\
          <div></div>\
          <div></div>\
          <div></div>\
        </div>\
      </div>';
        }
    }
});
function cutstr(str, len) {
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        a = str.charAt(i);
        if (escape(a).length > 4) {
            str_length += 2;
        }
        else {
            str_length += 1;
        }

        if (str_length <= len) {
            str_cut = str_cut.concat(a);
        }
        if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；  
    if (str_length < len) {
        return str;
    }
}
//获取链接地址的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}