//清空input值
function clearInputFile(f){
    if(f.value){
        try{
            f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
        }catch(err){
        }
        if(f.value){ //for IE5 ~ IE10
            var form = document.createElement('form'), ref = f.nextSibling;
            form.appendChild(f);
            form.reset();
            ref.parentNode.insertBefore(f,ref);
        }
    }
}
//获取链接地址的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}
//个人中心首页
userApp.controller("IndexCtrl", function ($scope, $http, $rootScope, $filter) {
    console.log('IndexCtrl')
    $rootScope.subNavFlag = 0; //导航是否选择判断
})
//门票订单
.controller("TicketCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.trade = true;//是否展开判断
    $rootScope.subNavFlag = 23; //导航是否选择判断
    $scope.isShowTab = false;//tab
    $scope.noData = false;
    $scope.commentUpladImg = [];//评论订单上传的图片
    $scope.isloading = false;
    $scope.ticketOrderList = new Array();
    $scope.activityTypeText = {
        0: '官方活动',
        1: '大咖活动',
        2: '购票活动',
    }
    $scope.ticketData = {
        OrderStatus: '',//订单状态
        PageNum: 1,
        PageSize: 6,
    }
    var partySite = $rootScope.configPort.party;
    //获取我的订单列表
    $scope.getTicketList = function () {
        $scope.isloading = true;
        $http({
            method: 'post',
            async: false,
            url: '/Api/UserCenter/MyJoinTicketActivity',
            data: $scope.ticketData,
        }).then(function (response) {
            $scope.isloading = false;//关闭loading
            if (response.data.success) {
                $scope.noData = false;
                //判断数据是否加载完
                $scope.isNoMore = $scope.ticketData.PageNum >= response.data.pageTotal ? true : false;
                if ($scope.ticketData.PageNum == 1) {
                    $scope.ticketOrderList = response.data.rows;
                } else {
                    $scope.ticketOrderList = $scope.ticketOrderList.concat(response.data.rows)
                }

            } else {
                $scope.noData = true;
            }
        })
    }
    $scope.getTicketList();
    //切换tab菜单
    $scope.toggleTabMeau = function () {
        $scope.isShowTab = !$scope.isShowTab
    }
    //获取不同状态的订单列表
    $scope.getScreenList = function (OrderStatus) {
        if ($scope.ticketData.OrderStatus !== OrderStatus) {
            $scope.ticketOrderList = new Array();
            $scope.ticketData.PageNum = 1;
        }
        $scope.ticketData.OrderStatus = OrderStatus;
        $scope.getTicketList();
        $scope.isShowTab = false;//关闭tab
    }
    //查看更多
    $scope.getMore = function () {
        if (!$scope.isNoMore) {
            $scope.ticketData.PageNum += 1;
            $scope.getTicketList();
        }
    }
    //取消订单
    $scope.cancelOrder = function (orderCode) {
        debugger
        $http.jsonp(partySite + '/Api/Activity/CancelActivityment?jsonpCallback=JSON_CALLBACK&orderCode=' + orderCode).then(
	 	function (response) {
	 	    if (response.data.Success) {
	 	        layer.msg('取消成功')
	 	        $scope.ticketData.PageNum = 1;//重新加载列表
	 	        $scope.getTicketList();
	 	    } else {
	 	        layer.msg(response.data.Message)
	 	    }
	 	})
    }
    //取消报名
    $scope.signOutJoinActivity = function (id) {
        $http({
            method: 'post',
            url: '/api/UserCenter/SignOutActivity',
            data: { OrderCode: id },
        }).then(function (response) {
            if (response.data.Success) {
                layer.msg('取消报名成功')
                $scope.ticketData.PageNum = 1;//重新加载列表
                $scope.getTicketList();
            } else {
                layer.msg(response.data.Message)
            }
        })
    }
    //订单确认收货
    $scope.ActivityConfirm = function (orderCode) {
        $http.jsonp(partySite + '/Api/Activity/ActivityConfirm?jsonpCallback=JSON_CALLBACK&orderCode=' + orderCode).then(
	 	function (response) {
	 	    if (response.data.Success) {
	 	        layer.msg('操作成功')
	 	        $scope.ticketData.PageNum = 1;//重新加载列表
	 	        $scope.getTicketList();
	 	    } else {
	 	        layer.msg(response.data.Message)
	 	    }
	 	})
    }
    //打开评价弹框
    $scope.openCommentPop = function (OrderCode) {
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#commentPop'),
        });
        $scope.OrderCode = OrderCode;
    }
    //上传评论图片
    $scope.uploadCommentImg = function (ele) {
        if ($scope.commentUpladImg.length >= 4) {
            layer.msg('上传图片数量不超过4张');
            return false
        }
        var obj = ele.files[0];
        var formData = new FormData();
        formData.append('directoryName', 'club/actcomment')
        formData.append('uploud', obj)
        $.ajax({
            type: 'post',
            url: "/Common/UploadStaticFile",
            async: false,
            dataType: 'JSON',
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                if (data.Success) {
                    clearInputFile(ele);//清空input值
                    $scope.commentUpladImg.push(data.Data[0]);
                    $scope.$apply()
                } else {
                    layer.msg(data.Message)
                }
            }
        });
    }
    //删除评论图片
    $scope.removeImg = function (index) {
        $scope.commentUpladImg.splice(index, 1)
    }
    //添加评论
    $scope.addComment = function (OrderCode) {
        if (!$scope.evaluate) {
            layer.msg('请输入评论内容');
            return false;
        }
        if ($scope.commentUpladImg.length > 0) {
            $scope.evaluateImgUrl = $scope.commentUpladImg.join()
        } else {
            $scope.evaluateImgUrl = '';
        }
        var parameter = '&orderCode=' + $scope.OrderCode + "&evaluate=" + encodeURIComponent($scope.evaluate) + '&evaluateImgUrl=' + $scope.evaluateImgUrl;
        $http.jsonp(partySite + '/Api/Activity/ActivityEvaluate?jsonpCallback=JSON_CALLBACK' + parameter).then(
	 	function (response) {
	 	    if (response.data.success) {
	 	        layer.msg('评论成功')
	 	        $scope.closePopWindow();//关闭弹框
	 	        $scope.commentUpladImg = [];//清空数据
	 	        $scope.evaluate = "";//清空评论
	 	        $scope.ticketData.PageNum = 1;//重新加载列表
	 	        $scope.getTicketList();
	 	    } else {
	 	        layer.msg(response.data.Message)
	 	    }
	 	})
    }
})
//门票详情
.controller("TicketDetailCtrl", function ($scope, $http, $rootScope, $filter, $stateParams) {
    $rootScope.isOpen.trade = true;//是否展开判断
    $rootScope.subNavFlag = 23; //导航是否选择判断
    $scope.OrderCode = $stateParams.id;//订单号
    if ($scope.OrderCode) {
        //获取订单详情
        $http({
            method: 'post',
            url: '/Api/UserCenter/ActivityOrderDetail',
            data: { OrderCode: $scope.OrderCode }
        }).then(function (response) {
            if (response.data.Success) {
                $scope.orderDetail = response.data.Data;
            } else {
                layer.msg(response.data.Message)
                window.location.href = '/UserCenter/index.html#/trade/ticket'
            }
        }, function (response) {
            layer.msg('error')
            window.location.href = '/UserCenter/index.html#/trade/ticket'
        })
    } else {
        layer.msg('订单号有误')
        window.location.href = '/UserCenter/index.html#/trade/ticket'
    }
})
//保养订单
.controller("MaintainCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.trade = true;//是否展开判断
    $rootScope.subNavFlag = 6; //导航是否选择判断
    $scope.screenMaintain = {//保养参数
        AppointmentType: '0',//类型 0是维修 1 是保养
        strOrderStatus: '',//订单状态
        PageNum: 1,
        PageSize: 4,
    }
    $scope.isloading = false;//loading
    $scope.MaintainList = new Array();//保养订单列表
    $scope.isShowTab = false;//tab
    $scope.CommentData = {//添加订单评论数据
        AppointmentCode: '',
        AppointmentType: '1',
    }
    $scope.commentUpladImg = [];//评论订单上传的图片
    //获取保养订单
    $scope.getMaintainList = function () {
        $scope.isloading = true;
        $http({
            method: 'post',
            url: '/Api/UserCenter/OrderMaintainAppointment',
            data: $scope.screenMaintain,
        }).then(function (response) {
            $scope.isloading = false;
            $scope.isNoMore = $scope.screenMaintain.PageNum >= response.data.pageTotal ? true : false
            if (response.data.success) {
                $scope.noData = false;
                if ($scope.screenMaintain.PageNum == 1) {
                    $scope.MaintainList = response.data.rows
                } else {
                    $scope.MaintainList = $scope.MaintainList.concat(response.data.rows)
                }

            } else {
                $scope.noData = true;
                $scope.isNoMore = true;
            }
        })
    }
    $scope.getMaintainList()
    //切换tab
    $scope.toggleTab = function () {
        $scope.isShowTab = !$scope.isShowTab
    }
    //切换订单状态
    $scope.changeStatus = function (flag) {
        $scope.screenMaintain.strOrderStatus = flag;
        $scope.isShowTab = false;//关闭tab
        $scope.MaintainList = new Array();
        $scope.screenMaintain.PageNum = 1;
        $scope.getMaintainList()
    }
    //获取更多
    $scope.getMore = function () {
        if (!$scope.isNoMore) {
            $scope.screenMaintain.PageNum += 1;
            $scope.getMaintainList()
        }
    }
    //取消订单
    $scope.cancelOrder = function (id) {
        $http({
            method: 'post',
            url: '/Api/UserCenter/CancelAppointment',
            data: { appointmentCode: id }
        }).then(function (response) {
            if (response.data.Success) {
                layer.msg(response.data.Message);
                window.location.reload()
            } else {
                layer.msg(response.data.Message);
            }
        })
    }
    //打开评价弹框
    $scope.openCommentPop = function (OrderCode) {
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#commentPop'),
        });
        $scope.CommentData.AppointmentCode = OrderCode;
    }
    //上传评论图片
    $scope.uploadCommentImg = function (ele) {
        if ($scope.commentUpladImg.length >= 6) {
            layer.msg('上传图片数量不超过6张');
            return false
        }
        var obj = ele.files[0];
        var formData = new FormData();
        formData.append('directoryName', 'maintain/commment')
        formData.append('uploud', obj)
        $.ajax({
            type: 'post',
            url: "/Common/UploadStaticFile",
            async: false,
            dataType: 'JSON',
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                if (data.Success) {
                    $scope.commentUpladImg.push(data.Data[0]);
                    $scope.$apply()
                } else {
                    layer.msg(data.Message)
                }
            }
        });
    }
    //添加评论
    $scope.addComment = function () {
        if (!$scope.CommentData.CommentContent) {
            layer.msg('请输入评论内容');
            return false;
        }
        if ($scope.commentUpladImg.length > 0) {
            $scope.CommentData.Imags = $scope.commentUpladImg.join()
        } else {
            $scope.CommentData.Imags = '';
        }
        $http({
            method: 'POST',
            url: '/Api/UserCenter/AddAppointmentComment',
            data: $scope.CommentData,
        }).then(function (response) {
            if (response.data.Success) {
                alert(response.data.Message);
                $scope.closePopWindow();//关闭弹框
                window.location.reload();
            } else {
                alert(response.data.Message);
                $scope.closePopWindow();//关闭弹框
            }
        })
    }
})
//保养详情
.controller("MaintainDetailCtrl", function ($scope, $http, $rootScope, $filter, $stateParams) {
    $rootScope.isOpen.trade = true;//是否展开判断
    $rootScope.subNavFlag = 6; //导航是否选择判断
    $scope.orderCode = $stateParams.id;//订单号
    if ($scope.orderCode) {
        //获取订单详情
        $http({
            method: 'post',
            url: '/Api/UserCenter/OrderMaintainAppointmentDetail',
            data: { orderCode: $scope.orderCode }
        }).then(function (response) {
            console.log(response)
            if (response.data.Success) {
                $scope.orderDetail = response.data.Data
            } else {
                layer.msg(response.data.Message)
            }
        })

    } else {
        layer.msg('订单号有误')
        window.location.href = "/UserCenter/index.html#/trade/maintain"
    }
})
//预约维修
.controller("RepairCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.trade = true;//是否展开判断
    $rootScope.subNavFlag = 7; //导航是否选择判断
    $scope.screenRepair = {//保养参数
        AppointmentType: '1',//类型 0是维修 1 是保养
        strOrderStatus: '',//订单状态
        PageNum: 1,
        PageSize: 4,
    }
    $scope.isloading = false;
    $scope.RepairList = new Array();
    $scope.isShowTab = false;//tab
    $scope.CommentData = {//添加订单评论数据
        AppointmentCode: '',
        AppointmentType: '0',
    }
    $scope.commentUpladImg = [];//评论订单上传的图片
    //获取保养订单
    $scope.getRepairList = function () {
        $scope.isloading = true;
        $http({
            method: 'post',
            url: '/Api/UserCenter/OrderMaintainAppointment',
            data: $scope.screenRepair,
        }).then(function (response) {
            $scope.isloading = false;
            $scope.isNoMore = $scope.screenRepair.PageNum >= response.data.pageTotal ? true : false
            if (response.data.success) {
                $scope.noData = false;
                if ($scope.screenRepair.PageNum == 1) {
                    $scope.RepairList = response.data.rows
                } else {
                    $scope.RepairList = $scope.RepairList.concat(response.data.rows)
                }

            } else {
                $scope.noData = true;
                $scope.isNoMore = true;
            }
        })
    }
    $scope.getRepairList()
    //切换tab
    $scope.toggleTab = function () {
        $scope.isShowTab = !$scope.isShowTab
    }
    //切换订单状态
    $scope.changeStatus = function (flag) {
        $scope.screenRepair.strOrderStatus = flag;
        $scope.isShowTab = false;//关闭tab
        $scope.RepairList = new Array();
        $scope.screenRepair.PageNum = 1;
        $scope.getRepairList()
    }
    //获取更多
    $scope.getMore = function () {
        if (!$scope.isNoMore) {
            $scope.screenRepair.PageNum += 1;
            $scope.getRepairList()
        }
    }
    //取消订单
    $scope.cancelOrder = function (id) {
        $http({
            method: 'post',
            url: '/Api/UserCenter/CancelAppointment',
            data: { appointmentCode: id }
        }).then(function (response) {
            if (response.data.Success) {
                layer.msg(response.data.Message);
                window.location.reload()
            } else {
                layer.msg(response.data.Message);
            }
        })
    }
    //打开评价弹框
    $scope.openCommentPop = function (OrderCode) {
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#commentPop'),
        });
        $scope.CommentData.AppointmentCode = OrderCode;
    }
    //上传评论图片
    $scope.uploadCommentImg = function (ele) {
        if ($scope.commentUpladImg.length >= 6) {
            layer.msg('上传图片数量不超过6张');
            return false
        }
        var obj = ele.files[0];
        var formData = new FormData();
        formData.append('directoryName', 'maintain/commment')
        formData.append('uploud', obj)
        $.ajax({
            type: 'post',
            url: "/Common/UploadStaticFile",
            async: false,
            dataType: 'JSON',
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                if (data.Success) {
                    $scope.commentUpladImg.push(data.Data[0]);
                    $scope.$apply()
                } else {
                    layer.msg(data.Message)
                }
            }
        });
    }
    //添加评论
    $scope.addComment = function () {
        if (!$scope.CommentData.CommentContent) {
            layer.msg('请输入评论内容');
            return false;
        }
        if ($scope.commentUpladImg.length > 0) {
            $scope.CommentData.Imags = $scope.commentUpladImg.join()
        } else {
            $scope.CommentData.Imags = '';
        }
        $http({
            method: 'POST',
            url: '/Api/UserCenter/AddAppointmentComment',
            data: $scope.CommentData,
        }).then(function (response) {
            if (response.data.Success) {
                alert(response.data.Message);
                $scope.closePopWindow();//关闭弹框
                window.location.reload();
            } else {
                alert(response.data.Message);
                $scope.closePopWindow();//关闭弹框
            }
        })
    }
})
//维修详情
.controller("RepairDetailCtrl", function ($scope, $http, $rootScope, $filter, $stateParams) {
    $rootScope.isOpen.trade = true;//是否展开判断
    $rootScope.subNavFlag = 7; //导航是否选择判断
    $scope.orderCode = $stateParams.id;//订单号
    if ($scope.orderCode) {
        //获取订单详情
        $http({
            method: 'post',
            url: '/Api/UserCenter/OrderRepairAppointmentDetail',
            data: { orderCode: $scope.orderCode }
        }).then(function (response) {
            console.log(response)
            if (response.data.Success) {
                $scope.orderDetail = response.data.Data
            } else {
                layer.msg(response.data.Message)
            }
        })

    } else {
        layer.msg('订单号有误')
        window.location.href = "/UserCenter/index.html#/trade/repair"
    }
})
//账户余额
.controller("BalanceCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.wallet = true;//是否展开判断
    $rootScope.subNavFlag = 10; //导航是否选择判断
    $scope.screenRecord = {//交易记录参数
        pageNum: 0,
        pageSize: 7,
        TransactionIncomeType: '',//1收入，-1支出
        Timespan: '',//ThisYear：一年内 ,LaseYear: 上一年 ,ThreeMouth：近三个月
    };
    $scope.isShowTimeTab = false;//筛选时间tab
    $scope.isShowTypeTab = false;//筛选收入、支出tab
    $scope.noRecord = false;//交易记录
    $scope.isFrist = true;
    $scope.transactionRecordList =new Array();//交易记录列表
    $scope.isloading = false;//loading
    $scope.rechargeData = {//充值参数
        clientPlatformFrom: 'Pc',//Pc：pc端，Wap：wap端，IOSApp：ios客户端
    }
    $scope.WithdrawalData = {//提现参数
        clientPlatformFrom: 'Pc',//Pc：pc端，Wap：wap端，IOSApp：ios客户端
    }
    var is_success = GetQueryString("is_success") ? GetQueryString("is_success") : "";    
    if (is_success == 'T') {
        $('#rechagreBox').addClass('hide');//打开充值
        $('#payCodeBox').addClass('hide');//关闭二维码
        $("#paySuccessBox").removeClass('hide');//关闭成功支付
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#rechargePop'),
        });
        setTimeout(function () {
            var currentUrl = window.location.href;
            var index = currentUrl.indexOf("?");
            if (index > 0) {
                var targetUrl = currentUrl.slice(0, index) + "#/wallet/balance";
                window.location.href = targetUrl;
            }
        }, 3000);
    }
    //关闭打赏成功弹框
    $scope.closePop = function () {
        var currentUrl = window.location.href;
        var index = currentUrl.indexOf("?");
        if (index > 0) {
            var targetUrl = currentUrl.slice(0, index) + "#/wallet/balance";
            window.location.href = targetUrl;
        }
        return false;
    }
    //tab切换
    $scope.toggleTypeTab = function () {
        $scope.isShowTypeTab = !$scope.isShowTypeTab
    }
    $scope.toggleTimeTab = function () {
        $scope.isShowTimeTab = !$scope.isShowTimeTab
    }
    //获取我的账户信息
    $scope.getMyAccount = function () {
        $http({
            method: 'post',
            url: '/Api/UserCenterV2/MyAccount'
        }).then(function (response) {
            if (response.data.Success) {
                $scope.myAccount = response.data.Data;
            }
        })
    }
    $scope.getMyAccount()
    //获取我的交易记录列表
    $scope.getTransactionRecord = function () {      
        $scope.isloading = true;
        $http({
            method: 'post',
            url: '/Api/UserCenterV2/MyIncomeOrexpand',
            data: $scope.screenRecord,
        }).then(function (response) {
            $scope.isloading = false;//关闭loading
            if ($scope.screenRecord.pageNum == 1) {
                $scope.isFrist = false;
            }
            if (response.data.success) {              
                //判断数据是否加载完
                $scope.isNoMore = $scope.screenRecord.pageNum >= response.data.pageTotal ? true : false;
                if (response.data.rows.length > 0) {
                    $scope.noRecord = false;
                    //判断页码
                    if ($scope.screenRecord.pageNum == 1) {
                        $scope.isFrist = false;
                        $scope.transactionRecordList = response.data.rows;                        
                    } else {
                        $scope.transactionRecordList = $scope.transactionRecordList.concat(response.data.rows)
                    }
                } else {
                    $scope.isNoMore = true;
                    $scope.noRecord = true;
                }
            } else {
                layer.msg(response.data.msg)
                $scope.isNoMore = true;
                $scope.noRecord = true;
            }
        })
    }
   // $scope.getTransactionRecord()
    //查看更多交易记录
    $scope.getMore = function (flag) {
        if (!$scope.isNoMore) {
            $scope.screenRecord.pageNum += 1;
            $scope.getTransactionRecord();
        }
    }
    //筛选screenTransactionIncomeType
    $scope.screenTransactionIncomeType = function (flag) {
        $scope.screenRecord.pageNum = 1;
        $scope.transactionRecordList = new Array()
        $scope.screenRecord.TransactionIncomeType = flag;
        $scope.isShowTypeTab = false;//关闭tab
        $scope.getTransactionRecord()
    }
    //时间搜索
    $scope.srccenTimespan = function (Timespan) {
        $scope.screenRecord.pageNum = 1;
        $scope.transactionRecordList = new Array()
        $scope.screenRecord.Timespan = Timespan;
        $scope.isShowTimeTab = false;//关闭tab
        $scope.getTransactionRecord()
    }
    //打开充值弹框
    $scope.openRecharge = function () {
        //每次打开都是充值页面
        $('#rechagreBox').removeClass('hide');//打开充值
        $('#payCodeBox').addClass('hide');//关闭二维码
        $("#paySuccessBox").addClass('hide');//关闭成功支付
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#rechargePop'),
        })
    }
    //确认充值
    $scope.goRecharge = function () {
        if (!$scope.rechargeData.amount) {
            layer.msg('请输入充值金额');
            return false;
        }
        if (!$scope.rechargeData.payWay) {
            layer.msg('请选择支付方式');
            return false;
        }
        $http({
            method: 'post',
            url: '/Api/UserCenterV2/Recharge',
            data: $scope.rechargeData
        }).then(function (response) {
            console.log(response)
            if (response.data.Success) {
                if ($scope.rechargeData.payWay == 'WeixinPay') {//微信
                    $('#rechagreBox').addClass('hide');//关闭充值
                    $('#payCodeBox').removeClass('hide');//打开二维码
                    $scope.payCodeImg = $rootScope.configPort.web + response.data.Data.Url;
                    checkOrderStatus(response.data.Data.OrderCode);//判断支付状态
                } else {//支付宝跳转url
                    location.href = $rootScope.configPort.web + "/Pay/AliPay?id=" + response.data.Data.OrderCode + "&createOrderType=Recharge" + "&isWap=false";
                }
            } else {
                layer.msg(response.data.Message)
            }
        }, function (response) {
            layer.msg('error')
        })
    }
    //请求订单状态
    function checkOrderStatus(payCode) {
        var orderstatus = false;
        window.intervalOrderStatus = setInterval(function () {
            if (!orderstatus) {
                $.post("/Pay/GetRechargeOrderStatus", { payCode: payCode }, function (data) {
                    if (data) {
                        orderstatus = true;
                        $("#paySuccessBox").removeClass('hide');//打开成功支付
                        $('#payCodeBox').addClass('hide');//关闭二维码
                        $scope.screenRecord.pageNum = 1;//更新交易记录列表(重新载入)
                        $scope.transactionRecordList = new Array();
                        $scope.myAccount.AccountMoney += $scope.rechargeData.amount;
                        $scope.myAccount.AccountMoney = parseFloat($scope.myAccount.AccountMoney).toFixed(2);
                       // $scope.UserInfo.TotalMoneyBalance = $scope.myAccount.AccountMoney;
                        $scope.rechargeData.amount = '';//更新充值金额
                        $scope.screenRecord.pageNum = 1;
                        $scope.getTransactionRecord();
                        $scope.getMyAccount();//更新用户信息
                        $scope.getUserInfo();
                        setTimeout(function () {
                            layer.closeAll();
                        }, 3000);
                    }
                });
            }
            else {
                clearInterval(intervalOrderStatus);
            }
        }, 2000);
    }
    //打开提现弹框
    $scope.openWithdrawals = function () {
        //判断是否绑定支付宝、微信账户
        $http({
            method: 'post',
            async: false,
            url: '/Api/UserCenterV2/WithdrawAccount',
        }).then(function (response) {
            if (response.data.Success) {
                $scope.Weixin = response.data.Data.WeChatNickName;
                $scope.Alipay = response.data.Data.WithdrawAlipayAccount;

                if (!$scope.Weixin && !$scope.Alipay) {
                    $("#tipBindAccountBox").show()
                } else {
                    $("#cash-list").show()
                }
                layer.open({
                    type: 1,
                    closeBtn: 0, //不显示关闭按钮
                    shadeClose: true,//开启遮罩关闭
                    move: false, //禁止拖拽
                    content: $('#WithdrawalsPop'),
                })
            } else {
                layer.msg(response.data.Message)
            }
        }, function (response) {
            layer.msg('error')
        })
    }
    //绑定支付宝
    $scope.goBindAlipay = function () {
        if (!$("#BindAlipay").val()) {
            layer.msg('请输入支付宝账户');
            return false;
        }
        $http({
            method: 'post',
            url: '/Api/UserCenterV2/SaveWithdrawAccount',
            data: { withdrawAlipayAccount: $("#BindAlipay").val() }
        }).then(function (response) {
            if (response.data.Success) {
                $scope.Alipay = $("#BindAlipay").val();
            }
        })
    }
    //提现提交
    $scope.submitWithdrawals = function () {
        if (!$scope.WithdrawalData.payWay) {
            layer.msg("请选择提现方式")
            return false;
        } else if (!$scope.WithdrawalData.amount) {
            layer.msg("请输入提现金额")
            return false;
        } else if ($scope.WithdrawalData.amount > $scope.UserInfo.TotalMoneyBalance) {
            layer.msg("您的账号余额不足")
            return false;
        }
        $http({
            method: 'post',
            url: '/Api/UserCenterV2/WithdrawCash',
            data: $scope.WithdrawalData,
        }).then(function (response) {
            if (response.data.Success) {
                $scope.myAccount.AccountMoney -= $scope.WithdrawalData.amount;
                $scope.myAccount.AccountMoney = parseFloat($scope.myAccount.AccountMoney).toFixed(2);
                //  $scope.UserInfo.TotalMoneyBalance = $scope.myAccount.AccountMoney;
                $scope.getUserInfo();
                $scope.getMyAccount();//更新用户信息
                $scope.closePopWindow();//关闭弹框
                $scope.WithdrawalData.amount = ''
                $scope.screenRecord.pageNum = 1;
                $scope.getTransactionRecord();
            } else {
                layer.msg(response.data.Message)
            }
        })

    }
    //绑定微信跳转
    $scope.goBindWeixin = function () {
        window.location.href = $rootScope.configPort.sso + "/thirdlogin/WxBind?backUrl=" + encodeURIComponent(window.location.href)
    }
})
//我的优惠券
.controller("MyCouponCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.coupon = true;//是否展开判断
    $rootScope.subNavFlag = 14; //导航是否选择判断
    $scope.couponFlag = 0;
    $scope.curFlagName = '全部';
    $scope.showTabCoupon = false;//是否现在筛选按钮
    $scope.isloading = false;//loading
    $scope.couponList = new Array();//优惠券列表
    $scope.screenCoupon = {
        CouponStatus: '',//为空查询全部,notused未使用,used已使用,expired过期
        PageNum: 1,//当前页码
        pageSize: 8,//每页数量
    };
    //获取优惠券
    $scope.myCouponList = function () {
        $scope.isloading = true;
        $http({
            method: 'post',
            url: '/Api/usercenter/MyCouponList',
            data: $scope.screenCoupon,
        }).then(function (response) {
            $scope.isloading = false;//关闭loading
            //判断数据是否加载完
            $scope.isNoMore = response.data.pageNum >= response.data.pageTotal ? true : false;
            if (response.data.success) {
                $scope.noCoupon = false;
                //已领取优惠券进度条宽度
                angular.forEach(response.data.rows, function (item, index) {
                    item.rangeWidth = 80 - (80 / item.PublishAmount) * item.ReceiveAmount + 'px';
                    if ((item.DiscountFeeText == '老司机问答' || item.AvalibleAreaText == '老司机问答可用') && item.DiscountFeeUnit == null) {
                        //item.leftText = "老司机问答抵用券";
                        item.DiscountFeeText = "老司机";
                        item.goUrl = $rootScope.configPort.party + "/Biggie/Index";
                    } else if (item.DiscountFeeText == "运费") {
                        item.goUrl = $rootScope.configPort.shop;
                    } else if (item.DiscountFeeText == "代驾") {
                        item.goUrl = $rootScope.configPort.maintain;
                    } else if (item.AvalibleAreaText == "全场通用") {
                        item.goUrl = $rootScope.configPort.web;
                    } else {
                        item.goUrl = $rootScope.configPort.maintain;
                    }
                })
                if ($scope.screenCoupon.PageNum == 1) {
                    $scope.couponList = response.data.rows;
                } else {
                    $scope.couponList = $scope.couponList.concat(response.data.rows)
                }
            } else {
                $scope.isNoMore = true;
                $scope.noCoupon = true;
            }
        })
    }
    $scope.myCouponList();
    //筛选条件
    $scope.tabCoupon = function (flag) {
        $scope.couponFlag = flag;
        $scope.screenCoupon.PageNum = 1;
        $scope.showTabCoupon = false;
        $scope.couponList = new Array()
        switch (flag) {
            case 0: $scope.screenCoupon.CouponStatus = '';
                $scope.curFlagName = '全部';
                break
            case 1:
                $scope.screenCoupon.CouponStatus = 'notused';
                $scope.curFlagName = '未使用';
                break
            case 2:
                $scope.screenCoupon.CouponStatus = 'used';
                $scope.curFlagName = '已使用';
                break
            case 3:
                $scope.screenCoupon.CouponStatus = 'expired';
                $scope.curFlagName = '已过期';
                break
        }
        $scope.myCouponList();
    }
    $scope.toggleBtnTab = function () {
        $scope.showTabCoupon = !$scope.showTabCoupon;
    }
    //获取更多优惠券
    $scope.getMore = function (flag) {
        if (!$scope.isNoMore) {
            $scope.screenCoupon.PageNum += 1
            $scope.myCouponList();
        }
    }
})
//领券中心
.controller("CouponCenterCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.coupon = true;//是否展开判断
    $rootScope.subNavFlag = 15; //导航是否选择判断
    $scope.isloading = false;
    $scope.couponList = new Array();
    $scope.screenCoupon = {
        CouponReceiveType: 2,//积分兑换类型2:领券中心3:积分兑换
        PageNum: 1,//当前页码
        PageSize: 8,//每页数量
    }
    //获取优惠券
    $scope.getCouponList = function () {
        $scope.isloading = true;
        $http({
            method: 'POST',
            url: '/Api/usercenter/CouponPatchList',
            async: false,
            data: $scope.screenCoupon,
        }).then(function (response) {
            $scope.isloading = false;
            //判断数据是否加载完
            $scope.isNoMore = $scope.screenCoupon.PageNum >= response.data.pageTotal ? true : false;
            if (response.data.success) {
                $scope.noCoupon = false;
                //已领取优惠券进度条宽度
                angular.forEach(response.data.rows, function (item, index) {
                    item.rangeWidth = 80 - (80 / item.PublishAmount) * item.ReceiveAmount + 'px';
                })
                if ($scope.screenCoupon.PageNum == 1) {
                    $scope.couponList = response.data.rows;
                } else {
                    $scope.couponList = $scope.couponList.concat(response.data.rows)
                }
            } else {
                $scope.noCoupon = true
                $scope.isNoMore = true;
            }
        }, function (response) { //error
            $scope.noCoupon = true;
        })
    }
    $scope.getCouponList();
    //领取优惠券
    $scope.getCoupon = function (CouponPatchId, index) {
        $http({
            method: 'POST',
            url: '/Api/usercenter/ReceiveCoupon',
            data: { 'couponPatchId': CouponPatchId }
        }).then(function (response) {
            if (response.data.Success) {
                $scope.couponList[index].IsReceived = true;
            } else {
                $scope.couponList[index].IsReceived = false;
                layer.msg(response.data.Message)
            }
        })
    }
    //查看更多
    $scope.getMore = function () {
        if (!$scope.isNoMore) {
            $scope.screenCoupon.PageNum += 1;
            $scope.getCouponList();
        }
    }
})
//文章管理
.controller("ArticleMgrCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.content = true;//是否展开判断
    $rootScope.subNavFlag = 16; //导航是否选择判断
    $scope.noData = false;//无数据
    $scope.isShowTab = false;//tab菜单
    $scope.isloading = false;
    $scope.atricleList = new Array();
    $scope.screenArticle = {
        DealerArticleAudit: '',
        pageNum: 1,
        pageSize: 8,
    }
    $scope.articleStatus = {
        '-1': '已驳回',
        '0': '审核中',
        '1': '已发布'
    }
    //获取我的文章
    $scope.getMyArticle = function () {
        $scope.isloading = true;
        $http({
            method: 'post',
            url: '/api/UserCenter/GetMyArticle',
            data: $scope.screenArticle,
        }).then(function (response) {
            $scope.isloading = false;//关闭loading
            //判断数据是否加载完
            $scope.isNoMore = $scope.screenArticle.pageNum >= response.data.pageTotal ? true : false;
            if (response.data.success) {
                if (response.data.rows.length > 0) {
                    $scope.noData = false;
                    if ($scope.screenArticle.pageNum == 1) {
                        $scope.atricleList = response.data.rows
                    } else {
                        $scope.atricleList = $scope.atricleList.concat(response.data.rows)
                    }

                } else {
                    $scope.noData = true;
                    $scope.isNoMore = true;
                }
            } else {
                $scope.noData = true;
                $scope.isNoMore = true;
            }
        })
    }
    $scope.getMyArticle();
    //切换tab菜单
    $scope.toggleTabMeau = function () {
        $scope.isShowTab = !$scope.isShowTab
    }
    //获取不同状态的文章列表
    $scope.getScreenList = function (DealerArticleAudit) {
        if ($scope.screenArticle.DealerArticleAudit !== DealerArticleAudit) {
            $scope.atricleList = new Array();
            $scope.screenArticle.pageNum = $scope.PageNum = 1;
        }
        $scope.screenArticle.DealerArticleAudit = DealerArticleAudit;
        $scope.getMyArticle();
        $scope.isShowTab = false;//关闭tab
    }
    //查看更多
    $scope.getMore = function () {
        if (!$scope.isNoMore) {
            $scope.screenArticle.pageNum += 1;
            $scope.getMyArticle();
        }
    }
    //删除文章
    $scope.delArticle = function (id, index) {
        $http({
            method: 'post',
            url: '/api/UserCenter/DeleteArticle',
            data: { articleId: id }
        }).then(function (response) {
            if (response.data.Success) {
                layer.msg('删除成功')
                $scope.atricleList.splice(index, 1)
            } else {
                layer.msg(response.data.Message)
            }
        })
    }
})
//活动管理
.controller("ActivityMgrCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.content = true;//是否展开判断
    $rootScope.subNavFlag = 17; //导航是否选择判断
    $scope.meauFlag = 1;//标题标识
    $scope.noMyJoin = false;//我参加的活动
    $scope.noMyPub = false;//我发布的活动
    $scope.isShowPubTab = false;//发布活动tab
    $scope.isShowJoinTab = false;//参加活动tab
    $scope.isloading = false;
    $scope.myPubActivityList = new Array();
    $scope.myJoinActivityList = new Array();
    $scope.myPubActivity = {//我发布的活动参数
        Status: '',//Status:-20:已取消 -10:已驳回 0:审核中 10:筹备中 30:进行中 40:已结束
        pageNum: 1,
        pageSize: 8,
    }
    $scope.myJoinActivity = {//我参与的活动参
        Status: '',//Status:30:进行中 40:已结束
        pageNum: 1,
        pageSize: 8,
    }
    $scope.screenParticipant = {//活动参与人的参数
        ActivityId: '',
        SearchContent: '',
        PageNum: 1,
        PageSize: 10,
    }
    //切换菜单
    $scope.tabMeau = function (flag) {
        $scope.meauFlag = flag;
        if ($scope.meauFlag == 1) {
            $scope.myPubActivity.pageNum = $scope.PageNum = 1;
            $scope.getMyPubActivity();
        } else {
            $scope.myJoinActivity.pageNum = $scope.PageNum = 1;
            $scope.getMyJoinAct();
        }
    }
    //切换tab
    $scope.togglePubTab = function () {
        $scope.isShowPubTab = !$scope.isShowPubTab
    }
    $scope.toggleJoinTab = function () {
        $scope.isShowJoinTab = !$scope.isShowJoinTab
    }
    //我发布的活动
    $scope.getMyPubActivity = function () {
        $scope.isloading = true;
        $http({
            method: 'post',
            url: '/api/UserCenter/MyActivity',
            data: $scope.myPubActivity,
        }).then(function (response) {
            $scope.isloading = false;//关闭loading
            //判断数据是否加载完
            $scope.isNoMorePub = $scope.myPubActivity.pageNum >= response.data.pageTotal ? true : false;
            if (response.data.success) {
                $scope.noMyPub = false;
                if ($scope.myPubActivity.pageNum == 1) {
                    $scope.myPubActivityList = response.data.rows;
                } else {
                    $scope.myPubActivityList = $scope.myPubActivityList.concat(response.data.rows)
                }
            } else {
                $scope.noMyPub = true;
                $scope.isNoMorePub = true;
            }
        })
    }
    //查看更多发布活动
    $scope.getMorePub = function () {
        if (!$scope.isNoMorePub) {
            $scope.myPubActivity.pageNum += 1;
            $scope.getMyPubActivity()
        }
    }
    //切换我发布的活动状态
    $scope.changeMyPubList = function (Status) {
        if ($scope.myPubActivity.Status != Status) {
            $scope.myPubActivity.pageNum = $scope.PageNum = 1;
            $scope.myPubActivityList = new Array()
        }
        $scope.myPubActivity.Status = Status;
        $scope.getMyPubActivity();
        $scope.isShowPubTab = false;//关闭tab	
    }

    //我参加的活动
    $scope.getMyJoinAct = function () {
        $scope.isloading = true;
        $http({
            method: 'post',
            url: '/Api/UserCenter/MyJoinActivity',
            data: $scope.myJoinActivity,
        }).then(function (response) {
            $scope.isloading = false;//关闭loading
            //判断数据是否加载完
            $scope.isNoMoreJoin = $scope.myPubActivity.pageNum >= response.data.pageTotal ? true : false;
            if (response.data.success) {
                $scope.noMyJoin = false;

                if ($scope.myJoinActivity.pageNum == 1) {
                    $scope.myJoinActivityList = response.data.rows;
                } else {
                    $scope.myJoinActivityList = $scope.myJoinActivityList.concat(response.data.rows)
                }

            } else {
                $scope.noMyJoin = true;
                $scope.isNoMoreJoin = true;
            }
        })
    }
    //若不是大咖，则默认显示‘我参加的活动’
    if ($scope.UserInfo.AuditStatus != 1) {
        $scope.getMyJoinAct();
        $scope.meauFlag = 2;//标题标识
    } else {
        $scope.meauFlag = 1;//标题标识
        $scope.getMyPubActivity()
    }
    //查看更多我参加的活动
    $scope.getMoreJoin = function () {
        if (!$scope.isNoMoreJoin) {
            $scope.myJoinActivity.pageNum += 1;
            $scope.getMyJoinAct();
        }
    }
    //切换我参加的活动状态
    $scope.changeMyJoinList = function (Status) {
        if ($scope.myJoinActivity.Status != Status) {
            $scope.myJoinActivity.pageNum = $scope.PageNum = 1;
            $scope.myJoinActivityList = new Array()
        }
        $scope.myJoinActivity.Status = Status;
        $scope.getMyJoinAct();
        $scope.isShowJoinTab = false;//关闭tab	
    }

    //删除我发布的活动
    $scope.delPubActivity = function (id, index) {
        $http({
            method: 'post',
            url: '/api/UserCenter/DeleteActivity',
            data: { activityId: id },
        }).then(function (response) {
            if (response.data.Success) {
                layer.msg('删除成功')
                $scope.myPubActivityList.splice(index, 1)
            } else {
                layer.msg(response.data.Message)
            }
        })
    }
    //退出我参加的活动
    $scope.signOutJoinActivity = function (id) {
        $http({
            method: 'post',
            url: '/api/UserCenter/SignOutActivity',
            data: { OrderCode: id },
        }).then(function (response) {
            if (response.data.Success) {
                layer.msg('取消报名成功')
                $scope.myJoinActivity.pageNum = 1;//重新加载我参加的列表
                $scope.getMyJoinAct();
            } else {
                layer.msg(response.data.Message)
            }
        })
    }
    //删除我参加的活动
    $scope.delJoinActivity = function (id, index) {
        $http({
            method: 'post',
            url: '/api/UserCenter/DeleteActivityJoin',
            data: { OrderCode: id },
        }).then(function (response) {
            if (response.data.Success) {
                layer.msg('删除成功')
                $scope.myJoinActivityList.splice(index, 1)
            } else {
                layer.msg(response.data.Message)
            }
        })
    }
    //查看活动参与人
    $scope.openJoinPerson = function (CurrentClientCount, ActivityId) {
        if (CurrentClientCount == 0) {
            layer.msg('暂无活动参与人')
            return false;
        } else {
            layer.open({
                type: 1,
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true,//开启遮罩关闭
                move: false, //禁止拖拽
                content: $('#joinPerson'),
            });
            //获取活动参与人
            $scope.screenParticipant.ActivityId = ActivityId;
            $scope.getParticipant();
        }
    }
    //获取活动参与人
    $scope.getParticipant = function () {
        $http({
            method: 'post',
            url: '/Api/UserCenter/GetParticipant',
            data: $scope.screenParticipant,
        }).then(function (response) {
            if (response.data.success) {
                angular.forEach(response.data.rows, function (item) {
                    item.CreateDate = item.CreateDate.replace(/-/g, '.')
                })
                $scope.joinPersonList = response.data.rows
                $scope.setPage(response.data)
                $scope.pageTotal = response.data.pageTotal;
            } else {
                layer.msg(response.data.msg)
            }
        })
    }
    //所属我的参与人
    $scope.searchParticipant = function () {
        if (!$scope.screenParticipant.SearchContent) {
            layer.msg('请输入搜索关键字')
            return false
        }
        $scope.screenParticipant.PageNum = 1;//重新加载我参加的列表
        $scope.getParticipant()
    }
    //点击分页导航触发事件
    $scope.goPage = function (flag) {
        $scope.screenParticipant.PageNum = $scope.PageNum = flag;
        $scope.getParticipant()
    }
    //点击上一页按钮触发事件
    $scope.golastPage = function () {
        if ($scope.screenParticipant.PageNum > 1) {
            $scope.screenParticipant.PageNum -= 1;
        } else {
            $scope.screenParticipant.PageNum = $scope.PageNum = 1;
        }
        $scope.getParticipant()
    }
    //点击下一页按钮触发事件
    $scope.goNextPage = function () {
        if ($scope.screenParticipant.PageNum < $scope.pageTotal) {
            $scope.screenParticipant.PageNum += 1;
        } else {
            $scope.screenParticipant.PageNum = $scope.PageNum = $scope.pageTotal;
        }
        $scope.getParticipant()
    }
})
//发布活动
.controller("PublishActivityCtrl", function ($scope, $http, $rootScope, $filter, $stateParams, $timeout) {
    $rootScope.isOpen.content = true;//是否展开判断
    $rootScope.subNavFlag = 17; //导航是否选择判断
    $scope.sortPage = false; //拖拽页面
    $scope.viewPage = false; //预览页面
    $scope.isEdit = false;//是否编辑
    $scope.activityId = $stateParams.id; //活动id
    $scope.activityData = {
        ActityType: 1, //活动类型，个人中心发布均为大咖活动
        CollectDate: '',//集合时间
        startDate: '',//活动开始时间
        endDate: '',//活动介绍时间
    };//发布活动的数据
    $scope.isUploadMain = false; //预览焦点图
    //添加活动详情数据
    $scope.activity = [{
        type: 'text', //类型 text,img,video
        content: '', //正文内容
        imgUrl: '', //图片url
        videoUrl: '', //视频url
    }]
    //城市数据初始化
    $scope.cityList = [], $scope.areaList = []; //集合地
    $scope.citydList = [], $scope.areadList = [];//目的地
    //城市默认选择信息
    $scope.provinceDef = {
        RegionName: "请选择省份",
        RegionId: "",
        SubCity: []
    };
    $scope.cityDef = {
        RegionName: "请选择城市",
        RegionId: "",
        SubCity: []
    };
    $scope.areaDef = {
        RegionName: "请选择县区",
        RegionId: "",
        SubCity: []
    };
    //初始化集合地数据
    $scope.cityList.push($scope.cityDef);//初始化市列表数据
    $scope.areaList.push($scope.areaDef);//初始化地区列表数据
    $scope.provinceList = cityData.Data;//初始化省列表数据
    $scope.provinceList.splice(0, 0, $scope.provinceDef);
    //  $scope.cityList.splice(0, 0, $scope.cityDef);
    //  $scope.areaList.splice(0, 0, $scope.areaDef);
    if (!$scope.isEdit) {
        $scope.activityData.CollectProvinceId = $scope.provinceList[0].RegionId;
        $scope.activityData.CollectCityId = $scope.cityList[0].RegionId;
        $scope.activityData.CollectDistrictId = $scope.areaList[0].RegionId;
    }

    //初始化目的地数据
    $scope.citydList.push($scope.cityDef);//初始化市列表数据
    $scope.areadList.push($scope.areaDef);//初始化地区列表数据
    //  $scope.citydList.splice(0, 0, $scope.cityDef);
    //  $scope.areadList.splice(0, 0, $scope.areaDef);
    if (!$scope.isEdit) {
        $scope.activityData.destinationProvinceId = $scope.provinceList[0].RegionId;
        $scope.activityData.destinationCityId = $scope.citydList[0].RegionId;
        $scope.activityData.destinationDistrictId = $scope.areadList[0].RegionId;
    }

    //根据id获取城市列表
    $scope.setCity = function (ProvinceId, type) { //type =1 为集合地 ，type=2为目的地
        if (type == 1) {
            $scope.cityList.splice(0, 0, $scope.cityDef);
            $scope.areaList.splice(0, 0, $scope.areaDef);
            $scope.activityData.CollectCityId = $scope.cityList[0].RegionId;
            $scope.activityData.CollectDistrictId = $scope.areaList[0].RegionId;
            angular.forEach($scope.provinceList, function (item) {
                if (item.RegionId == ProvinceId) {
                    $scope.cityList = item.SubCity;
                    $scope.activityData.CProvinceName = item.RegionName;//选中的集合地省名
                    if ($scope.cityList.length < 1 || $scope.cityList[0].RegionId != "") {
                        $scope.cityList.splice(0, 0, $scope.cityDef);
                    }
                }
            })
        } else {
            $scope.citydList.splice(0, 0, $scope.cityDef);
            $scope.areadList.splice(0, 0, $scope.areaDef);
            $scope.activityData.destinationCityId = $scope.citydList[0].RegionId;
            $scope.activityData.destinationDistrictId = $scope.areadList[0].RegionId;
            angular.forEach($scope.provinceList, function (item) {
                if (item.RegionId == ProvinceId) {
                    $scope.citydList = item.SubCity;
                    $scope.activityData.DProvinceName = item.RegionName;//选中的目的地省名
                    if ($scope.citydList.length < 1 || $scope.citydList[0].RegionId != "") {
                        $scope.citydList.splice(0, 0, $scope.cityDef);
                    }
                }
            })
        }
    }
    //根据id获取区县列表
    $scope.setArea = function (cityId, type) {
        if (type == 1) {
            $scope.areaList.splice(0, 0, $scope.areaDef);
            $scope.activityData.CollectDistrictId = $scope.areaList[0].RegionId;
            angular.forEach($scope.cityList, function (item) {
                if (item.RegionId == cityId) {
                    $scope.areaList = item.SubCity;
                    $scope.activityData.CCityName = item.RegionName;//选中的集合地城市名
                    if ($scope.areaList.length < 1 || $scope.areaList[0].RegionId != "") {
                        $scope.areaList.splice(0, 0, $scope.areaDef);
                    }
                }
            })
        } else {
            $scope.areadList.splice(0, 0, $scope.areaDef);
            $scope.activityData.destinationDistrictId = $scope.areadList[0].RegionId;
            angular.forEach($scope.citydList, function (item) {
                if (item.RegionId == cityId) {
                    $scope.areadList = item.SubCity;
                    $scope.activityData.DCityName = item.RegionName;//选中的目的地城市名
                    if ($scope.areadList.length < 1 || $scope.areadList[0].RegionId != "") {
                        $scope.areadList.splice(0, 0, $scope.areaDef);
                    }
                }
            })
        }
    }
    //根据城市id获取选中的区县
    $scope.getDistrict = function (DistrictId, type) {
        if (type == 1) {
            angular.forEach($scope.areaList, function (item) {
                if (item.RegionId == DistrictId) {
                    $scope.activityData.CDistrictName = item.RegionName;//选中的集合地区县名
                }
            })
        } else {
            angular.forEach($scope.areadList, function (item) {
                if (item.RegionId == DistrictId) {
                    $scope.activityData.DDistrictName = item.RegionName;//选中的目的地区县名
                }
            })
        }
    }
    //获取活动分类列表
    $http.jsonp($rootScope.configPort.party + '/Api/Activity/GetActivityCategory?jsonpCallback=JSON_CALLBACK').success(
	 	function (data) {
	 	    if (data.Success) {
	 	        console.log(data)
	 	        $scope.categoryList = data.Data;

	 	    } else {
	 	        $scope.noBiggie = true;
	 	    }
	 	});
    var image_select, isEdit;
    //上传焦点图
    $scope.changeMainImg = function (ele, is_edit) {
        var mainImg = ele.files[0]
        if (!mainImg) {
            return false;
        }
        if (mainImg.type != "image/png" && mainImg.type != "image/jpeg" && mainImg.type != "image/jpg") {
            layer.msg("请上传png,jpeg,png格式图片");
            return false;
        }
        var index = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        if (mainImg.size / 1024 > 10 * 1024) { //判断文件大小
            $(".typeimg").removeClass('hide')
            layer.open({
                type: 1,
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true,//开启遮罩关闭
                move: false, //禁止拖拽
                content: $('#tipsImgSize'),
            });
            return false;
        }
        isEdit = is_edit;
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#editHeadImg')
        });
        var mySrc = getObjectURL(mainImg);
        // $("#clickUpload").text("重新上传");
        $("#picture,#img_big_preview").addClass("clear");
        $("#avatar1").attr("src", mySrc);
        $("#avatar").attr("src", mySrc);
        $("#avatar").load(function () {
            var a_w = $(this).width();
            var a_h = $(this).height();
            var shard_w = 320;
            var shard_h = 240;
            if (a_h < 240) {
                shard_h = a_h;
                shard_w = parseInt(shard_h / 3 * 4);
                $("#avatar1").css("height", "100%");
            } else {
                $("#avatar1").css("width", "100%");
            }
            var scale = document.getElementById('avatar').naturalWidth / 320;
            $("#id_width").val(parseInt(shard_w * scale));
            $("#id_height").val(parseInt(shard_h * scale));
            //直接执行的话，框会偏移
            setTimeout(function () {
                if (image_select) {
                    $(".imgareaselect-selection").parent().css("z-index", "1989100018");
                    image_select.setSelection(0, 0, shard_w, shard_h, true);
                    image_select.setOptions({ show: true });
                    image_select.update();
                } else {
                    image_select = $('img#avatar').imgAreaSelect({
                        aspectRatio: "4:3",
                        x1: 0,
                        y1: 0,
                        x2: shard_w,
                        y2: shard_h,
                        instance: true,
                        handles: true,
                        onSelectEnd: function (img, selection) {
                            var scale = document.getElementById('avatar').naturalWidth / 320;
                            $('#id_top').val(parseInt(selection.y1 * scale));
                            $('#id_left').val(parseInt(selection.x1 * scale));
                            $('#id_width').val(parseInt(selection.width * scale));
                            $('#id_height').val(parseInt(selection.height * scale));
                        },
                        onSelectChange: preview2
                    });
                }
            }, 300);

        });
    }
    //上传修改图片
    $scope.shearHeadImage = function () {
        var mainImg = "";
        if (!isEdit) {
            mainImg = $("#up_cut")[0].files[0];
        } else {
            mainImg = $("#edit_cut")[0].files[0];
        }
        if (!mainImg) {
            layer.msg("上传失败，请重新选择文件");
            $scope.closePopWindow();
            return false;
        }
        var _form = document.getElementById("shearImage");
        var formdata = new FormData(_form);
        formdata.append('img', mainImg);
        $.ajax({
            type: 'post',
            url: "/Common/CropImage",
            data: formdata,
            dataType: 'JSON',
            cache: false,
            processData: false,//必选
            contentType: false,//必选
            success: function (data) {
                if (data.Success) {
                    $scope.activityData.mainImg = data.Data;//焦点图
                    $scope.isUploadMain = true; //预览焦点图
                    $scope.$apply();
                    if (isEdit) {
                        clearInputFile(document.getElementById("edit_cut"));
                    }
                }
                $scope.closePopWindow();
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                console.log('error')
            }
        })
    }
    $scope.closePopWindow = function () {
        if (image_select) {
            image_select.cancelSelection();
            // image_select = "";
        }
        layer.closeAll();
    }
    //删除焦点图
    $scope.deleteMainImg = function () {
        layer.confirm('您真的确定要删除吗？删除后无法恢复，请三思！', {
            btn: ['取消', '确定']
        }, function (index) {
            layer.close(index);
        }, function (index) {
            $scope.activityData.mainImg = '';
            $scope.isUploadMain = false;
            $scope.$apply();
        });

    }
    //判断为空提示框是否显示
    $scope.isDataEmpty = function (data, ele) {
        $(ele).parents('.input-box').find('span').hide();
        if (!data) {
            $(ele).parents('.input-box').find('em').show();
        } else {
            $(ele).parents('.input-box').find('em').hide();
        }
    }
    //判断时间插件数据
    $scope.getTimeData = function (ele, type) {
        laydate({
            istime: false,
            format: 'YYYY-MM-DD',
            min: laydate.now(),
            choose: function (datas) {
                $(ele).parents('.input-box').find('font').hide();
                $(ele).parent('.i-time').addClass('has-date')
                $(ele).text('')
                switch (type) {
                    case 'startDate': $scope.activityData.startDate = datas;
                        break;
                    case 'endDate': $scope.activityData.endDate = datas;
                        break;
                }
                $scope.$apply()
            }
        });
    }
    //获取集合时间  格式YYYY-MM-DD hh:mm
    $scope.getTimeCollectDate = function (ele) {
        laydate({
            elem: "#jh_time",
            istime: true,
            format: 'YYYY-MM-DD hh:mm',
            min: laydate.now(),
            choose: function (datas) {
                $(ele).parents('.input-box').find('font').hide();
                $(ele).parent('.i-time').addClass('has-date')
                $(ele).text('');
                $scope.activityData.CollectDate = datas;
                $scope.$apply()
            }
        });
    }
    //添加文本的方法
    $scope.addText = function (insertFlag, index) {
        var obj = {
            type: 'text',
            content: '',
        }
        if (insertFlag) { //插入数据
            $scope.activity.splice(index + 1, 0, obj)
        } else {
            $scope.activity.push(obj)
        }
    }
    //添加图片的方法
    $scope.uploadImg = function (ele, insertFlag, index, type) {
        var index = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        $(".typeimg").addClass('hide'); //默认隐藏
        $(".typevideo").addClass('hide');
        var objImg = ele.files[0];
        if (type == 'img') {
            if (objImg.size / 1024 > 10 * 1024) { //判断文件大小
                $(".typeimg").removeClass('hide')
                layer.open({
                    type: 1,
                    closeBtn: 0, //不显示关闭按钮
                    shadeClose: true,//开启遮罩关闭
                    move: false, //禁止拖拽
                    content: $('#tipsImgSize'),
                });
                return false;
            }
        } else {
            if (objImg.size / 1024 > 10 * 1024) { //判断文件大小
                $(".typevideo").removeClass('hide')
                layer.open({
                    type: 1,
                    closeBtn: 0, //不显示关闭按钮
                    shadeClose: true,//开启遮罩关闭
                    move: false, //禁止拖拽
                    content: $('#tipsImgSize'),
                });
                return false;
            }
        }
        //上传文件
        var formdata = new FormData();
        formdata.append('uploadType', 'activity')
        formdata.append('headimg', objImg)
        $.ajax({
            url: '/Common/Upload',
            type: 'POST',
            data: formdata,
            dataType: 'JSON',
            cache: false,
            processData: false,//必选
            contentType: false,//必选
            success: function (data) {
                $scope.closePopWindow();//关闭
                if (data.Success) {
                    if (type == 'img') {
                        obj = {
                            type: 'img',
                            content: '',
                            imgUrl: data.Data,
                        }
                    } else {
                        obj = {
                            type: 'video',
                            content: '',
                            videoUrl: data.Data,
                        }
                    }
                    if (insertFlag) { //插入数据
                        $scope.activity.splice(index + 1, 0, obj)
                    } else {
                        $scope.activity.push(obj)
                    }
                    $scope.$apply();
                } else {
                    layer.msg(data.Message)
                }
            }
        })
    }
    //删除模块
    $scope.deleteData = function (flag) {
        layer.confirm('您真的确定要删除吗？删除后无法恢复，请三思！', {
            btn: ['取消', '确定']
        }, function (index) {
            layer.close(index);
        }, function (index) {
            $scope.activity.splice(flag, 1)
            $scope.$apply()
        });
    }
    //点击缩略图跳转相应位置
    $scope.goScroll = function (index) {
        var id = '#model' + (index + 1)
        var topH = $(id).offset().top;
        $("body,html").animate({ scrollTop: topH }, 500)
    }
    //获取详情HTML
    $scope.getDetailHtml = function (data) {
        debugger
        var html = '';
        angular.forEach(data, function (item, index) {
            if (item.type == 'text') {
                html += '<div><p>' + item.content + '</p></div>'
            } else if (item.type == 'img') {
                html += '<div><img src="' + item.imgUrl + '" /><p>' + item.content + '</p></div>'
            } else if (item.type == 'video') {
                html += "<div><video width='530' height='300' controls='controls'>"
						+ "<source src='" + item.videoUrl + "'></source></video>"
						+ "<p>" + item.content + "<p></div>"
            }
        })
        return html;
        //		$scope.activityData.OtherRemark = html;
    }
    //添加表单
    $scope.sumbitData = function () {
        //获取详情内容
        $scope.activityData.OtherRemark = $scope.getDetailHtml($scope.activity);
        if (!$scope.activityData.subject) {
            layer.msg('请输入活动主题')
            return false;
        } else if (!$scope.activityData.mainImg) {
            layer.msg('请上传活动焦点图')
            return false;
        } else if (!$scope.activityData.collectPlace) {
            layer.msg('请输入活动出发地')
            return false;
        } else if (!$scope.activityData.destinationPlace) {
            layer.msg('请输入活动目的地')
            return false;
        }
            //		else if(!$scope.activityData.CollectProvinceId || !$scope.activityData.CollectCityId || !$scope.activityData.CollectDistrictId || !$scope.activityData.collectPlace){
            //			layer.msg('请输入完整的活动集合地')
            //			return false;
            //		}
            //		else if(!$scope.activityData.CollectDate){
            //			layer.msg('请选择集合时间')
            //			return false;
            //		}
        else if (!$scope.activityData.destinationProvinceId || !$scope.activityData.destinationCityId || !$scope.activityData.destinationDistrictId || !$scope.activityData.DAddress) {
            layer.msg('请输入完整的活动地点')
            return false;
        } else if (!$scope.activityData.startDate || !$scope.activityData.endDate) {
            layer.msg('请选择活动时间')
            return false;
        }
            //else if (!$scope.activityData.categoryId) {
            //	layer.msg('请选择活动分类')
            //	return false;
            //}
        else if (!$scope.activityData.maxClientCount) {
            layer.msg('请输入活动人数')
            return false;
        }
        else if (!$scope.activityData.fee && $scope.activityData.fee !== 0) {
            layer.msg('请输入活动资费')
            return false;
        }
            //判断活动详情是否为空
        else if ($scope.activityData.OtherRemark == "" || $scope.activityData.OtherRemark == "<div><p></p></div>") {
            layer.msg('请输入活动内容')
            return false;
        }
        var index = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        $http({
            method: 'POST',
            url: '/Api/UserCenter/AddUpdateActivity',
            data: $scope.activityData,
        }).then(function (response) {
            layer.closeAll('loading');//关闭loading
            if (response.data.IsSuccess) {
                layer.msg('提交成功')
                window.location.href = "/UserCenter/index.html#/content/activity"
            } else {
                layer.msg(response.data.Message)
            }
        })
    }
    //拖拽排序页面
    $scope.toggleSortPage = function () {
        $scope.sortPage = !$scope.sortPage;
    }
    $scope.setExchange = function (start, end) {
        var a = $scope.activity[end];
        $scope.activity.splice(end, 1, $scope.activity[start]);
        $scope.activity.splice(start, 1, a);
    }
    //拖拽的方法
    $scope.sortableOptions = {
        placeholder: "ui-state-highlight",
        opacity: 0.7,
        helper: 'clone',
        sort: function (event, ui) {
            $(".ui-sortable-helper").css({
                'height': '87px',
                'width': '126px',
                'border': '1px solid #eb6100'
            });
        },
        update: function (e, ui) {

        },
        // 完成拖拽动作
        stop: function (e, ui) {

        }
    }
    //预览页面
    $scope.toggleViewPage = function () {
        $scope.viewPage = !$scope.viewPage;
    }
    //过滤文章内容HTML
    $scope.formatHtml = function (data) {
        if (data) {
            $scope.activity = new Array()
        } else {
            return false;
        }
        var obj = {}
        dataContent = data.replace(/(<\/div>)/g, '');//将</div>替换为空
        htmlList = dataContent.split('<div>');
        htmlList.splice(0, 1);//删除第一个空的数据

        angular.forEach(htmlList, function (item, i) {
            if (item.indexOf('<img') > -1) {
                item = item.replace(/(<\/p>)/g, '');//去掉闭合标签
                item = item.replace(/(\/>)/g, '');//去掉闭合标签
                item = item.replace(/(<img src=)/g, '');//去掉img标签
                itemObj = item.split('<p>')
                obj = {
                    type: 'img',//类型 text,img,video
                    content: itemObj[1],//正文内容
                    imgUrl: itemObj[0].slice(1, itemObj[0].length - 2),//图片url
                }
                $scope.activity.push(obj)
            } else if (item.indexOf('<video') > -1) {
                item = item.replace(/(<\/p>)/g, '');//去掉闭合标签
                item = item.replace(/(<\/source><\/video>)/g, '');//去掉闭合标签
                item = item.replace(/(<video width='530' height='300' controls='controls'><source src=')/g, '');//去掉video标签
                itemObj = item.split('<p>')
                obj = {
                    type: 'video', //类型 text,img,video
                    content: itemObj[1], //正文内容
                    videoUrl: itemObj[0].slice(0, itemObj[0].length - 2), //视频url
                }
                $scope.activity.push(obj)
            } else {
                item = item.replace(/(<\/p>)/g, '');//去掉闭合标签
                itemObj = item.split('<p>')
                obj = {
                    type: 'text',//类型 text,img,video
                    content: itemObj[1],//正文内容
                }
                $scope.activity.push(obj)
            }
        })

    }
    //编辑活动
    if ($scope.activityId != 0) {
        $scope.isEdit = true;
        //获取该活动的详情
        $http({
            method: 'post',
            async: false,
            url: '/Api/UserCenter/MyActivityDetail',
            data: { ActivityId: $scope.activityId }
        }).then(function (response) {
            if (response.data.Success) {
                //返回字段名和传参字段名不同，故做赋值
                var resultData = response.data.Data.result
                //获取城市，区县
                $scope.setCity(resultData.CollectProvinceId, 1);//获取集合地城市
                $scope.setCity(resultData.DestinationProvinceId, 2);//获取目的地城市
                $scope.setArea(resultData.CollectCityId, 1); //获取集合地区县
                $scope.setArea(resultData.DestinationCityId, 2); //获取目的地区县
                //赋值
                $scope.activityData = {
                    activityId: $scope.activityId,
                    subject: resultData.Subject,
                    mainImg: resultData.MainImg,
                    destinationPlace: resultData.DestinationPlace,
                    CollectProvinceId: resultData.CollectProvinceId,
                    CProvinceName: resultData.CProvinceName,
                    CollectCityId: resultData.CollectCityId,
                    CCityName: resultData.CCityName,
                    CollectDistrictId: resultData.CollectDistrictId,
                    CDistrictName: resultData.CDistrictName,
                    collectPlace: resultData.CollectPlace,
                    CollectDate: resultData.CollectDate,
                    DAddress: resultData.DAddress,
                    CAddress: resultData.CAddress,
                    categoryId: resultData.CategoryId,
                    destinationProvinceId: resultData.DestinationProvinceId,
                    DProvinceName: resultData.DProvinceName,
                    destinationCityId: resultData.DestinationCityId,
                    DCityName: resultData.DCityName,
                    destinationDistrictId: resultData.DestinationDistrictId,
                    DDistrictName: resultData.DDistrictName,
                    startDate: resultData.StartDate,
                    endDate: resultData.EndDate,
                    maxClientCount: resultData.MaxClientCount,
                    fee: resultData.Fee
                }
                //获取活动内容
                $scope.formatHtml(resultData.OtherRemark);//过滤数据
            } else {
                layer.msg(response.data.Message)
                window.location.href = "/UserCenter/index.html#/content/activity"
            }
        })
    } else {
        $scope.isEdit = false;
    }
})
//插入活动数据按钮-显示隐藏方法
.directive("addInsertBtn", function () {
    return {
        restrict: "A",
        link: function (scope, element, attributes) {
            var addInsertBtn = element;
            $(element).on('click', function () {
                var $btn = $(this).parent('.add-box').find('.btn-groups');
                if ($btn.hasClass('hide')) {
                    $(this).addClass('icon-add-mius');
                    $btn.removeClass('hide')
                } else {
                    $(this).removeClass('icon-add-mius');
                    $btn.addClass('hide')
                }
            })
        }
    }
})
//发布文章
.controller("publishArticleCtrl", function ($scope, $http, $rootScope, $filter, $stateParams, $timeout) {
    $rootScope.isOpen.content = true;//是否展开判断
    $rootScope.subNavFlag = 16; //导航是否选择判断
    $scope.sortPage = false; //拖拽页面
    $scope.viewPage = false; //预览页面
    $scope.isUploadMain = false; //预览焦点图
    $scope.articleData = {};//发布文章的数据
    $scope.articleId = $stateParams.id; //文章id
    $scope.isEdit = false;//是否是编辑文章
    $scope.tip = {
        myTipsList: [],//我的标签列表
        tipsList: [],//我选择的标签列表
        customTips: '',//自定义标签
    }
    //添加文章详情数据
    $scope.article = [{
        type: 'text', //类型 text,img,video
        content: '', //正文内容
        imgUrl: '', //图片url
        videoUrl: '', //视频url
    }]
    //获取我的标签列表
    $http({
        method: 'POST',
        async: false,
        url: '/api/UserCenter/GetTagList',
    }).then(function (response) {
        if (response.data.success) {
            $scope.tip.myTipsList = response.data.rows;
            angular.forEach($scope.tip.myTipsList, function (item, i) {
                item.isChecked = false;
            })
        }
    })
    //选择我的标签
    $scope.selectTips = function (index, name) {
        if ($scope.tip.tipsList.length >= 3) {
            layer.msg('每篇文章最多使用三个标签')
            return false;
        }
        $scope.tip.myTipsList[index].isChecked = true; //选中标签
        $scope.tip.tipsList.push(name);
    }
    //添加自定义标签
    $scope.addMyTips = function () {
        if (!$scope.tip.customTips) {
            layer.msg('请输入您的标签')
            return false;
        }
        if ($scope.tip.tipsList.indexOf($scope.tip.customTips) > -1) {
            layer.msg('已存在此标签，请输入其他标签')
            return false;
        }
        if ($scope.tip.tipsList.length >= 3) {
            layer.msg('每篇文章最多使用三个标签')
            return false;
        }
        $scope.tip.tipsList.push($scope.tip.customTips);
    }
    //删除标签
    $scope.delectTips = function (name, index) {
        $scope.tip.tipsList.splice(index, 1); //删除
        angular.forEach($scope.tip.myTipsList, function (item, i) {
            if (item.TagName == name) {
                $scope.tip.myTipsList[i].isChecked = false;
            }
        })
    }
    //判断为空提示框是否显示
    $scope.isDataEmpty = function (data, ele) {
        if (!data) {
            $(ele).parents('.input-box').find('em').show();
        } else {
            $(ele).parents('.input-box').find('em').hide();
        }
    }
    var image_select, isEdit;
    //上传焦点图
    $scope.changeMainImg = function (ele, is_edit) {
        var mainImg = ele.files[0]
        debugger
        if (!mainImg) {
            return false;
        }
        if (mainImg.type != "image/png" && mainImg.type != "image/jpeg" && mainImg.type != "image/jpg") {
            layer.msg("请上传png,jpeg,png格式图片");
            return false;
        }
        var index = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });

        if (mainImg.size / 1024 > 10 * 1024) { //判断文件大小
            $(".typeimg").removeClass('hide')
            layer.open({
                type: 1,
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true,//开启遮罩关闭
                move: false, //禁止拖拽
                content: $('#tipsImgSize'),
            });
            return false;
        }
        isEdit = is_edit;
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#editHeadImg')
        });
        var mySrc = getObjectURL(mainImg);
        // $("#clickUpload").text("重新上传");
        $("#picture,#img_big_preview").addClass("clear");
        $("#avatar1").attr("src", mySrc);
        $("#avatar").attr("src", mySrc);
        $("#avatar").load(function () {
            var a_w = $(this).width();
            var a_h = $(this).height();
            var shard_w = 320;
            var shard_h = 240;
            if (a_h < 240) {
                shard_h = a_h;
                shard_w = parseInt(shard_h / 3 * 4);
                $("#avatar1").css("height", "100%");
            } else {
                $("#avatar1").css("width", "100%");
            }
            var scale = document.getElementById('avatar').naturalWidth / 320;
            $("#id_width").val(shard_w * scale);
            $("#id_height").val(shard_h * scale);
            //直接执行的话，框会偏移
            setTimeout(function () {
                if (image_select) {
                    $(".imgareaselect-selection").parent().css("z-index", "1989100018");
                    image_select.setSelection(0, 0, shard_w, shard_h, true);
                    image_select.setOptions({ show: true });
                    image_select.update();
                } else {
                    image_select = $('img#avatar').imgAreaSelect({
                        aspectRatio: "4:3",
                        x1: 0,
                        y1: 0,
                        x2: shard_w,
                        y2: shard_h,
                        instance: true,
                        handles: true,
                        onSelectEnd: function (img, selection) {
                            var scale = document.getElementById('avatar').naturalWidth / 320;
                            $('#id_top').val(parseInt(selection.y1 * scale));
                            $('#id_left').val(parseInt(selection.x1 * scale));
                            $('#id_width').val(parseInt(selection.width * scale));
                            $('#id_height').val(parseInt(selection.height * scale));
                        },
                        onSelectChange: preview2
                    });
                }
            }, 300);

        });
        //var mainImg = ele.files[0]
        //if(!mainImg){
        //	return false;
        //}
        //var index = layer.load(1, {
        //  shade: [0.1,'#fff'] //0.1透明度的白色背景
        //});
        //if(mainImg.size/1024 > 10 * 1024){ //判断文件大小
        //	$(".typeimg").removeClass('hide')
        //	layer.open({
        //        type: 1,
        //        closeBtn: 0, //不显示关闭按钮
        //        shadeClose: true,//开启遮罩关闭
        //        move: false, //禁止拖拽
        //        content: $('#tipsImgSize'),
        //    });
        //    return false;
        //}
        //var formdata = new FormData();
        //	formdata.append('uploadType','activity')
        //	formdata.append('headimg',mainImg)
        //	$.ajax({
        //		url: '/Common/Upload',
        //		type: 'POST',
        //		data: formdata,
        //		dataType: 'JSON',
        //		cache: false,
        //		processData: false,//必选
        //		contentType: false,//必选
        //		success : function(data){
        //			$scope.closePopWindow();//关闭
        //			if(data.Success){
        //				$scope.articleData.FocusImageUrl = data.Data;//焦点图
        //				$scope.isUploadMain = true ; //预览焦点图
        //				$scope.$apply();
        //			}else{
        //				layer.msg(data.Message)
        //			}
        //		}
        //	})
    }
    //上传修改图片
    $scope.shearHeadImage = function () {
        var mainImg = "";
        if (!isEdit) {
            mainImg = $("#up_cut")[0].files[0];
        } else {
            mainImg = $("#edit_cut")[0].files[0];
        }
        if (!mainImg) {
            layer.msg("上传失败，请重新选择文件");
            $scope.closePopWindow();
            return false;
        }
        var _form = document.getElementById("shearImage");
        var formdata = new FormData(_form);
        formdata.append('img', mainImg);
        $.ajax({
            type: 'post',
            url: "/Common/CropImage",
            data: formdata,
            dataType: 'JSON',
            cache: false,
            processData: false,//必选
            contentType: false,//必选
            success: function (data) {
                if (data.Success) {
                    $scope.articleData.FocusImageUrl = data.Data;//焦点图
                    $scope.isUploadMain = true; //预览焦点图
                    $scope.$apply();
                    if (isEdit) {
                        clearInputFile(document.getElementById("edit_cut"));
                    }
                }
                $scope.closePopWindow();
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                console.log('error')
            }
        })
    }
    $scope.closePopWindow = function () {
        if (image_select) {
            image_select.cancelSelection();
            // image_select = "";
        }
        layer.closeAll();
    }
    //删除焦点图
    $scope.deleteMainImg = function () {
        layer.confirm('您真的确定要删除吗？删除后无法恢复，请三思！', {
            btn: ['取消', '确定']
        }, function (index) {
            layer.close(index);
        }, function (index) {
            $scope.articleData.mainImg = '';
            $scope.isUploadMain = false;
            $scope.$apply();
        });
    }
    //添加文本的方法
    $scope.addText = function (insertFlag, index) {
        var obj = {
            type: 'text',
            content: '',
        }
        if (insertFlag) { //插入数据
            $scope.article.splice(index + 1, 0, obj)
        } else {
            $scope.article.push(obj)
        }
    }
    //添加图片的方法
    $scope.uploadImg = function (ele, insertFlag, index, type) {
        var index = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        $(".typeimg").addClass('hide'); //默认隐藏
        $(".typevideo").addClass('hide');
        var objImg = ele.files[0];
        if (type == 'img') {
            if (objImg.size / 1024 > 10 * 1024) { //判断文件大小
                $(".typeimg").removeClass('hide')
                layer.open({
                    type: 1,
                    closeBtn: 0, //不显示关闭按钮
                    shadeClose: true,//开启遮罩关闭
                    move: false, //禁止拖拽
                    content: $('#tipsImgSize'),
                });
                return false;
            }
        } else {
            if (objImg.size / 1024 > 10 * 1024) { //判断文件大小
                $(".typevideo").removeClass('hide')
                layer.open({
                    type: 1,
                    closeBtn: 0, //不显示关闭按钮
                    shadeClose: true,//开启遮罩关闭
                    move: false, //禁止拖拽
                    content: $('#tipsImgSize'),
                });
                return false;
            }
        }
        //上传文件
        var formdata = new FormData();
        formdata.append('uploadType', 'activity')
        formdata.append('headimg', objImg)
        $.ajax({
            url: '/Common/Upload',
            type: 'POST',
            data: formdata,
            dataType: 'JSON',
            cache: false,
            processData: false,//必选
            contentType: false,//必选
            success: function (data) {
                $scope.closePopWindow();//关闭
                if (data.Success) {
                    if (type == 'img') {
                        obj = {
                            type: 'img',
                            content: '',
                            imgUrl: data.Data,
                        }
                    } else {
                        obj = {
                            type: 'video',
                            content: '',
                            videoUrl: data.Data,
                        }
                    }
                    if (insertFlag) { //插入数据
                        $scope.article.splice(index + 1, 0, obj)
                    } else {
                        $scope.article.push(obj)
                    }
                    $scope.$apply();
                } else {
                    layer.msg(data.Message)
                }
            }
        })
    }
    //删除模块
    $scope.deleteData = function (flag) {
        layer.confirm('您真的确定要删除吗？删除后无法恢复，请三思！', {
            btn: ['取消', '确定']
        }, function (index) {
            layer.close(index);
        }, function (index) {
            $scope.article.splice(flag, 1)
            $scope.$apply()
        });
    }
    //点击缩略图跳转相应位置
    $scope.goScroll = function (index) {
        var id = '#model' + (index + 1)
        var topH = $(id).offset().top;
        $("body,html").animate({ scrollTop: topH }, 500)
    }
    //拖拽排序页面
    $scope.toggleSortPage = function () {
        $scope.sortPage = !$scope.sortPage;
    }
    $scope.setExchange = function (start, end) {
        var a = $scope.article[end];
        $scope.article.splice(end, 1, $scope.article[start]);
        $scope.article.splice(start, 1, a);
    }
    //拖拽的方法
    $scope.sortableOptions = {
        placeholder: "ui-state-highlight",
        opacity: 0.7,
        helper: 'clone',
        sort: function (event, ui) {
            $(".ui-sortable-helper").css({
                'height': '87px',
                'width': '126px',
                'border': '1px solid #eb6100'
            });
        },
        update: function (e, ui) {

        },
        // 完成拖拽动作
        stop: function (e, ui) {

        }
    }
    //预览页面
    $scope.toggleViewPage = function () {
        $scope.viewPage = !$scope.viewPage;
    }
    //获取详情HTML
    $scope.getDetailHtml = function () {
        var html = '';
        angular.forEach($scope.article, function (item, index) {
            if (item.type == 'text') {
                html += '<div><p>' + item.content + '</p></div>'
            } else if (item.type == 'img') {
                html += '<div class="img"><div><img src="' + item.imgUrl + '" /><p>' + item.content + '</p></div></div>'
            } else if (item.type == 'video') {
                html += "<div><video width='530' height='300' controls='controls'>"
						+ "<source src='" + item.videoUrl + "'></source></video>"
						+ "<p>" + item.content + "<p></div>"
            }
        })
        return html;
        //		$scope.articleData.Content = html;
    }
    //提交表单
    $scope.sumbitData = function () {
        //获取详情内容
        $scope.articleData.Content = $scope.getDetailHtml($scope.article);
        $scope.articleData.TagName = $scope.tip.tipsList.join();
        if (!$scope.articleData.Title) {
            layer.msg('请输入文章主标题')
            return false;
        } if (!$scope.articleData.MainTitle) {
            layer.msg('请输入文章副标题')
            return false;
        } else if (!$scope.articleData.TagName) {
            layer.msg('请输入您的文章标签')
            return false;
        } else if (!$scope.articleData.FocusImageUrl) {
            layer.msg('请上传活动焦点图')
            return false;
        }
            //判断文章详情是否为空
        else if ($scope.articleData.Content == "" || $scope.articleData.Content == "<div><p></p></div>") {
            layer.msg('请输入文章内容')
            return false;
        }
        var index = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        $http({
            method: 'POST',
            url: '/api/UserCenter/CreateArticle',
            data: $scope.articleData,
        }).then(function (response) {
            layer.closeAll('loading');//关闭loading
            if (response.data.Success) {
                layer.msg('提交成功')
                window.location.href = "/UserCenter/index.html#/content/article"
            } else {
                layer.msg(response.data.Message)
            }
        })
    }
    //过滤文章内容HTML
    $scope.formatHtml = function (data) {
        if (data) {
            $scope.article = new Array()
        } else {
            return false;
        }
        var obj = {}
        dataContent = data.replace(/(<\/div>)/g, '');//将</div>替换为空
        htmlList = dataContent.split('<div>');
        htmlList.splice(0, 1);//删除第一个空的数据
        debugger
        angular.forEach(htmlList, function (item, i) {
            if (item.indexOf('<img') > -1) {
                item = item.replace(/(<\/p>)/g, '');//去掉闭合标签
                item = item.replace(/(\/>)/g, '');//去掉闭合标签
                item = item.replace(/(<img src=)/g, '');//去掉img标签
                itemObj = item.split('<p>')
                obj = {
                    type: 'img',//类型 text,img,video
                    content: itemObj[1],//正文内容
                    imgUrl: itemObj[0].slice(1, itemObj[0].length - 2),//图片url
                }
                $scope.article.push(obj)
            } else if (item.indexOf('<video') > -1) {
                item = item.replace(/(<\/p>)/g, '');//去掉闭合标签
                item = item.replace(/(<\/source><\/video>)/g, '');//去掉闭合标签
                item = item.replace(/(<video width='530' height='300' controls='controls'><source src=')/g, '');//去掉video标签
                itemObj = item.split('<p>')
                obj = {
                    type: 'video', //类型 text,img,video
                    content: itemObj[1], //正文内容
                    videoUrl: itemObj[0].slice(0, itemObj[0].length - 2), //视频url
                }
                $scope.article.push(obj)
            } else {
                item = item.replace(/(<\/p>)/g, '');//去掉闭合标签
                itemObj = item.split('<p>')
                obj = {
                    type: 'text',//类型 text,img,video
                    content: itemObj[1],//正文内容
                }
                $scope.article.push(obj)
            }
            console.log($scope.article)
        })

    }
    //编辑文章
    if ($scope.articleId != 0) {
        $scope.isEdit = true;
        //获取该文章的详情
        $http({
            method: 'post',
            async: false,
            url: '/api/UserCenter/GetMyArticleDetail',
            data: { articleId: $scope.articleId }
        }).then(function (response) {
            if (response.data.Success) {
                $scope.articleData = response.data.Data;
                $scope.articleData.ArticleId = $scope.articleId;//传入articleId
                $scope.tip.tipsList = $scope.articleData.TagName.split(',');//标签列表
                //为已有的选中的标签添加active
                angular.forEach($scope.tip.myTipsList, function (item, i) {
                    angular.forEach($scope.tip.tipsList, function (_item, _i) {
                        if (item.TagName == _item) {
                            $scope.tip.myTipsList[i].isChecked = true
                        }
                    })
                })
                //获取文章内容
                $scope.formatHtml(response.data.Data.Content);//过滤数据
            } else {
                layer.msg(response.data.Message)
                window.location.href = "/UserCenter/index.html#/content/article"
            }
        })
    } else {
        $scope.isEdit = false;
    }
})
//话题管理
.controller("TopicMgrCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.content = true;//是否展开判断
    $rootScope.subNavFlag = 18; //导航是否选择判断	
    $scope.meauFlag = 1;//菜单flag
    $scope.isloading = false;
    $scope.myPubTopicList = new Array();
    $scope.myJoinTopicList = new Array();
    $scope.isFrist = true;
    $scope.pubTopicData = {//发布话题数据
        pageNum: 1,
        pageSize: 4
    }
    $scope.joinTopicData = {//参与话题数据
        pageNum: 1,
        pageSize: 4
    }
    //切换菜单
    $scope.tabMeau = function (flag) {
        $scope.meauFlag = flag;
        if ($scope.meauFlag == 1) {
            $scope.pubTopicData.pageNum = 1;
            $scope.getMyPubTopic()
        } else {
            $scope.joinTopicData.pageNum = 1;
            $scope.getMyJoinTopic()
        }
    }
    //获取我发布的话题
    $scope.getMyPubTopic = function () {
        $scope.isloading = true;
        $http({
            method: 'post',
            url: '/Api/UserCenterV2/MyTip',
            data: $scope.pubTopicData,
        }).then(function (response) {
            $scope.isloading = false;//关闭loading
            $scope.isNoMorePub = $scope.pubTopicData.pageNum >= response.data.pageTotal ? true : false;
            if (response.data.success) {
                $scope.noPubData = false;
                angular.forEach(response.data.rows, function (item) {
                   // item.ImgList = item.ImgList.split(',')
                    item.HeadImgUrl = $filter('noHeadImage')(item.HeadImgUrl, $rootScope.configPort.staticFile);
                    if (item.TopicContent) {
                        item.TopicContent = item.TopicContent.replace(/\<a tipId='/g, "<em class='font-orange' tipId='");
                        item.TopicContent = item.TopicContent.replace(/\<\/a>/g, "</em>");
                        item.TopicContent = $filter('fontLength')(item.TopicContent, 230);
                    }
                    //item.TopicContent = $filter('topicFormat')(item.TopicContent, $rootScope.configPort.staticFile, $rootScope.configPort.party);
                    angular.forEach(item.ImgList, function (_itm) {
                        if (_itm.WidthHeightRatio > 1.33) {
                            _itm.imgStyle = {
                                "background": "url(" + _itm.FileUrl + ") no-repeat center",
                                "background-size": "auto 100%"
                            }
                        } else {
                            _itm.imgStyle = {
                                "background": "url(" + _itm.FileUrl + ") no-repeat center",
                                "background-size": "100% auto"
                            }
                        }
                    })
                })
                if ($scope.pubTopicData.pageNum == 1) {
                    $scope.myPubTopicList = response.data.rows
                } else {
                    $scope.myPubTopicList = $scope.myPubTopicList.concat(response.data.rows)
                }
                
            } else {
                $scope.noPubData = true;
                $scope.isNoMorePub = true;
            }
        })
    }
    $scope.getMyPubTopic()
    //更多我发布的话题
    $scope.getMorePub = function () {
        if (!$scope.isNoMorePub) {
            $scope.pubTopicData.pageNum += 1;
            $scope.getMyPubTopic()
        }
    }
    //获取我参加的话题
    $scope.getMyJoinTopic = function () {
        $scope.isloading = true;
        $http({
            method: 'post',
            url: '/Api/UserCenterV2/MyTopic',
            data: $scope.joinTopicData,
        }).then(function (response) {
            if ($scope.isFrist) {
                $scope.isFrist = false;
            }
            $scope.isloading = false;//关闭loading
            $scope.isNoMoreJoin = $scope.joinTopicData.pageNum >= response.data.pageTotal ? true : false;
            if (response.data.success) {
                $scope.noJoinData = false;
                angular.forEach(response.data.rows, function (item) {//过滤a标签
                    item.Content = item.Content.replace(/\<a tipId='/g, "<em class='font-orange' tipId='");
                    item.Content = item.Content.replace(/\<\/a>/g, "</em>");
                    item.Content = $filter('fontLength')(item.Content, 290);
                    item.HeadImgUrl = $filter('noHeadImage')(item.HeadImgUrl, $rootScope.configPort.staticFile);
                    item.isShard = false;
                    angular.forEach(item.ImgList, function (_itm) {
                        if (_itm.WidthHeightRatio > 1.33) {
                            _itm.imgStyle = {
                                "background": "url(" + _itm.FileUrl + ") no-repeat center",
                                "background-size": "auto 100%"
                            }
                        } else {
                            _itm.imgStyle = {
                                "background": "url(" + _itm.FileUrl + ") no-repeat center",
                                "background-size": "100% auto"
                            }
                        }
                    })
                })

                if ($scope.joinTopicData.pageNum == 1) {
                    $scope.myJoinTopicList = response.data.rows
                } else {
                    $scope.myJoinTopicList = $scope.myJoinTopicList.concat(response.data.rows)
                }

            } else {
                $scope.noJoinData = true;
                $scope.isNoMoreJoin = true;
            }
        })
    }
    //	$scope.getMyJoinTopic()
    //设置是否显示分享
    $scope.showShard = function (index) {
        $scope.myJoinTopicList[index].isShard = !$scope.myJoinTopicList[index].isShard;
    }
    //更多我参与的话题
    $scope.getMoreJoin = function () {
        if (!$scope.isNoMoreJoin) {
            $scope.joinTopicData.pageNum += 1;
            $scope.getMyJoinTopic()
        } else {
            return false;
        }
    }
    //删除我发布的话题
    $scope.delMyTopic = function (id) {
        $http({
            method: 'post',
            url: '/Api/UserCenterV2/DeleteTip',
            data: { tipId: id }
        }).then(function (response) {
            if (response.data.success) {
                layer.msg('删除成功')
                $scope.pubTopicData.pageNum = 1
                $scope.getMyPubTopic();
            }

        })
    }
    //订阅话题
    $scope.goFollowed = function (id, index) {
        $.ajax({
            type: "get",
            url: $rootScope.configPort.party + "/Api/Activity/Collection",
            data: { CollectType: 3, RelationId: id },
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function (data) {
                if (data.IsSuccess) {
                    $scope.myJoinTopicList[index].IsFollowed = true;
                    $scope.myJoinTopicList[index].FollowCount += 1;
                    layer.msg("订阅成功")
                    $scope.$apply()
                } else {
                    layer.msg(data.Message)
                }
            }
        })
    }
    //取消订阅话题
    $scope.cancelFollowed = function (id, index) {
        $.ajax({
            type: "get",
            url: $rootScope.configPort.party + "/Api/Activity/UnCollection",
            data: { CollectType: 3, RelationId: id },
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function (data) {
                if (data.Success) {
                    $scope.myJoinTopicList[index].IsFollowed = false;
                    $scope.myJoinTopicList[index].FollowCount -= 1;
                    $scope.$apply();
                    layer.msg("取消订阅")
                } else {
                    layer.msg(data.Message)
                }
            }
        })
    }
    //游客cookie
    var guestUserCookieName = "guestUser";
    var guestUserCookieValue = $.cookie(guestUserCookieName);
    //设置游客cookie
    if (!guestUserCookieValue) {
        var _value = generateUUID();
        $.cookie(guestUserCookieName, _value, { path: '/', expires: 120 });
    }
    //点赞
    $scope.thumbsUp = function (thumbsUp, id, index) {
        var guestUserCookieValue = $.cookie(guestUserCookieName);
        if (!thumbsUp) {
            $.ajax({
                url: $rootScope.configPort.party + '/Api/Activity/AddCommentThumbUp',
                async: true,
                data: { RelationId: id, ThumbupType: 0, GuestUser: guestUserCookieValue },
                dataType: 'jsonp',
                jsonp: 'jsonpCallback',
                success: function (data) {
                    if (data.Success) {
                        layer.msg("点赞成功");
                        $scope.myJoinTopicList[index].IsThump = true
                        $scope.myJoinTopicList[index].ThumbsUpCount += 1;
                        $scope.$apply();
                    } else {
                        layer.msg(data.Message);
                    }
                }
            });
        } else {
            $.ajax({
                url: $rootScope.configPort.party + '/Api/Activity/CancelCommentThumbUp',
                async: true,
                data: { RelationId: id, ThumbupType: 0, GuestUser: guestUserCookieValue },
                dataType: 'jsonp',
                jsonp: 'jsonpCallback',
                success: function (data) {
                    if (data.Success) {
                        layer.msg("取消点赞");
                        $scope.myJoinTopicList[index].IsThump = false
                        $scope.myJoinTopicList[index].ThumbsUpCount -= 1;
                        $scope.$apply();
                    } else {
                        layer.msg(data.Message);
                    }
                }
            });
        }

    }
})
//过滤话题内容
.filter('topicFormat', function () {
    return function (input, path, party) {
        if (input != null && input != '') {
            if (input.indexOf("</a>") < 0) {
                input = input.replace(/\</g, '&lt;');
                input = input.replace(/\>/g, '&gt;');
                input = input.replace(/\n/g, '<br/>');
            } else if (input.indexOf('em') > -1) {
                input = input.replace(/\[em_([0-9]*)\]/g, '<img src="' + path + '$1.png" border="0" />');
            }
            else {
                input = input.replace(/\<a tipId='/g, "<a class='tip-link' href='" + party + "/HotOpinion/Topic?tipId=");
            }
        }
        return input;
    }
})
//HTML输出
.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsHtml(url);
    }
}])
//Resource video地址过滤
.filter('res_trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    }
}])
//我的爱车
.controller("MyCarCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.account = true;//是否展开判断
    $rootScope.subNavFlag = 22; //导航是否选择判断
    $scope.BrandList = new Array(); //车品牌列表
    $scope.LineList = new Array(); //车系列表
    $scope.CarList = new Array(); //车型列表
    $scope.AddMyCar = {};//添加新车提交数据
    $scope.isloading = false;//loading
    $scope.dateData = {//年月日数据
        year: [],
        month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        day: []
    }
    var backUrl = GetQueryString('backUrl') ? GetQueryString('backUrl') : '';//易修首页设置车辆返回参数
    //初始化选择车数据
    $scope.selectBrand = {
        BrandName: '请选择', BrandId: ''
    }
    $scope.selectLine = {
        LineIName: '请选择', LineId: ''
    }
    $scope.selectCar = {
        CarName: '请选择', CarId: ''
    }
    //获取我的爱车
    $scope.getMyCar = function () {
        $scope.isloading = true;
        $http({
            method: 'POST',
            url: '/Api/UserCenter/PersonalMyCar'
        }).then(function (response) {
            $scope.isloading = false;//关闭loading
            if (response.data.success) {
                $scope.MyCar = response.data.rows;
            }
        })
    }
    $scope.getMyCar()
    //删除爱车
    $scope.deleteCar = function (id) {
        $http({
            method: 'POST',
            url: '/Api/UserCenter/PersonalMyCarDelete',
            data: { 'myCarId': id }
        }).then(function (response) {
            if (response.data.Success) {
                layer.msg('删除成功')
                $scope.getMyCar()
            } else {
                layer.msg(response.data.Message)
            }
        })
    }
    //设为默认
    $scope.setDefault = function (myCarId) {
        $http({
            method: 'POST',
            url: '/Api/UserCenter/PersonalMyCarSetDefault',
            data: { 'myCarId': myCarId }
        }).then(function (response) {
            if (response.data.Success) {
                layer.msg('设置成功')
                if (backUrl == 'maintain') {
                    window.location.href = $rootScope.configPort.maintain;
                } else {
                    $scope.getMyCar()
                }

            } else {
                layer.msg(response.data.Message)
            }
        })
    }
    //打开添加爱车弹框
    $scope.openAddCar = function () {
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#addMyCar'),
        });
    }
    //获取车品牌
    $http({
        method: 'POST',
        url: '/api/cartype/GetCarBrandByGroup',
    }).then(function (response) {
        angular.forEach(response.data, function (item, index) {
            angular.forEach(item.Brands, function (itema, index) {
                $scope.BrandList.push(itema)
            })
        })
        //初始化数据
        $scope.BrandList.splice(0, 0, $scope.selectBrand);
        $scope.BrandId = $scope.BrandList[0].BrandId;
        $scope.LineList.splice(0, 0, $scope.selectLine);
        $scope.LineId = $scope.LineList[0].LineId;
        $scope.CarList.splice(0, 0, $scope.selectCar);
        $scope.AddMyCar.CarId = $scope.CarList[0].CarId;
    })
    //选择车系
    $scope.selectBrandLine = function () {
        $scope.LineList = new Array();
        $http({
            method: 'POST',
            url: '/api/cartype/GetSubBrandGroupByBrandId',
            data: { 'brandId': $scope.BrandId }
        }).then(function (response) {
            angular.forEach(response.data, function (item, index) {
                angular.forEach(item.Lines, function (itema, index) {
                    $scope.LineList.push(itema)
                })
            })
            //初始化数据
            $scope.LineList.splice(0, 0, $scope.selectLine);
            $scope.LineId = $scope.LineList[0].LineId;
            $scope.CarList.splice(0, 0, $scope.selectCar);
            $scope.AddMyCar.CarId = $scope.CarList[0].CarId;
        })
    }
    //选择车型
    $scope.selectCarName = function () {
        $scope.CarList = new Array();
        $http({
            method: 'POST',
            url: '/api/cartype/GetLineCarInfoByQueryCond',
            data: { 'LineId': $scope.LineId }
        }).then(function (response) {
            angular.forEach(response.data, function (item, index) {
                angular.forEach(item.Cars, function (itema, index) {
                    $scope.CarList.push(itema)
                })
            })
            //初始化数据
            $scope.CarList.splice(0, 0, $scope.selectCar);
            $scope.AddMyCar.CarId = $scope.CarList[0].CarId;
        })
    }
    //设置日期年份
    $scope.setYearData = function () {
        var date = new Date;
        var current_year = date.getFullYear();
        for (var i = 0; i < 100; i++) {
            var item_y = current_year - i;
            $scope.dateData.year.push(item_y + '年');
        }
    }
    $scope.setYearData();
    //设置日期
    $scope.setDayData = function () {
        $scope.dateData.day = []
        var year = $scope.year.slice(0, $scope.year.length - 1)
        var month = $scope.month.slice(0, $scope.month.length - 1)
        var day = getDaysInOneMonth(year, month)
        for (var i = 1; i <= day ; i++) {
            $scope.dateData.day.push(i + '日');
        }
    }
    //提交数据
    $scope.submitAdd = function () {
        $scope.AddMyCar.CarNumber = angular.uppercase($scope.AddMyCar.CarNumber);
        if (!$scope.AddMyCar.CarId) {
            layer.msg('请选择车型')
            return false;
        } else if (!$scope.year || !$scope.month || !$scope.day) {
            layer.msg('请选择购车时间')
            return false;
        }
        //		else if(!$scope.AddMyCar.CurrentMails){
        //			layer.msg('请填写公里数')
        //			return false;
        //		}else if(!$scope.AddMyCar.CarNumber){
        //			layer.msg('请填写车牌号')
        //			return false;
        //		}
        //		else if(!/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test($scope.AddMyCar.CarNumber)){
        //			layer.msg('请填写正确的车牌号')
        //			return false;
        //		}
        $scope.AddMyCar.BuyDate = $scope.year.slice(0, $scope.year.length - 1) + '-' + $scope.month.slice(0, $scope.month.length - 1) + '-' + $scope.day.slice(0, $scope.day.length - 1)

        $http({
            method: 'POST',
            url: '/Api/UserCenter/PersonalMyCarSave',
            data: $scope.AddMyCar,
        }).then(function (response) {
            if (response.data.Success) {
                $scope.getMyCar();
                $scope.closePopWindow();//关闭弹框
                $scope.AddMyCar = { //清空数据
                    CarNumber: '',
                    CurrentMails: '',
                    BuyDate: '',
                }
                $scope.year = '', $scope.month = '', $scope.day = '';
                $scope.BrandList.splice(0, 0, $scope.selectBrand);
                $scope.BrandId = $scope.BrandList[0].BrandId;
                $scope.LineList.splice(0, 0, $scope.selectLine);
                $scope.LineId = $scope.LineList[0].LineId;
                $scope.CarList.splice(0, 0, $scope.selectCar);
                $scope.AddMyCar.CarId = $scope.CarList[0].CarId;
            } else {
                layer.msg(response.data.Message);
            }
        })
    }
})
//大咖认证首页
.controller('AuthenticationIndexCtrl', function ($scope, $http, $rootScope, $filter) {
    //获取推荐大咖列表
    $http.jsonp($rootScope.configPort.party + '/Api/Biggie/BiggieQuery?jsonpCallback=JSON_CALLBACK').success(
	 	function (data) {
	 	    if (data.success) {
	 	        $scope.biggieList = data.rows;

	 	    } else {
	 	        $scope.noBiggie = true;
	 	    }
	 	})
})
//个人大咖认证
.controller('AuthenticationBiggieCtrl', function ($scope, $http, $rootScope, $filter, $timeout, $interval, $location) {
    $scope.submitData = {};//提交表单数据
    $scope.btnCodeClick = false; //获取验证码按钮
    $scope.btnCodeText = "获取验证码";//获取验证码按钮文本
    $scope.constellation = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];//星座
    $scope.AuthDataList = []; //认证材料图片list
    $scope.dateData = {//年月日数据
        year: [],
        month: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        day: []
    }
    var second = 59, timer;
    var message = $location.search().message;//获取绑到返回的信息
    if (message) {
        layer.msg(message)
    }
    //获取图形验证码
    $scope.getCodeImg = function () {
        $scope.codeImg = $rootScope.configPort.web + '/Api/UserCenterV2/CreatImg?v=' + Math.random()
    }
    $scope.getCodeImg();
    //获取手机验证码
    $scope.getCodeNum = function () {
        if (!$scope.myCodeImg) {
            layer.msg('请输入图形验证码')
            return false;
        }
        if (!$scope.submitData.PhoneNumber) {
            layer.msg('请输入手机号码')
            return false;
        }

        $http({
            method: 'post',
            url: '/Api/UserCenterV2/SendPhoneAuthCode',
            data: { imgCheckCode: $scope.myCodeImg, phoneNum: $scope.submitData.PhoneNumber }
        }).then(function (response) {
            if (response.data.Success) {
                timer = $interval(function () {
                    if (second <= 0) {
                        $interval.cancel(timer);
                        second = 59;
                        $scope.btnCodeText = "获取验证码";
                        $scope.btnCodeClick = false;
                    } else {
                        $scope.btnCodeText = second + 's后重发';
                        second--;
                        $scope.btnCodeClick = true;
                    }
                }, 1000)
            } else {
                layer.msg(response.data.Message);
            }
        })
    }
    //设置日期年份
    $scope.setYearData = function () {
        var date = new Date;
        var current_year = date.getFullYear();
        for (var i = 0; i < 100; i++) {
            var item_y = current_year - i;
            $scope.dateData.year.push(item_y);
        }
    }
    $scope.setYearData();
    //设置日期
    $scope.setDayData = function () {
        $scope.dateData.day = []
        var year = $scope.year;
        var month = $scope.month;
        var day = getDaysInOneMonth(year, month)
        for (var i = 1; i <= day ; i++) {
            $scope.dateData.day.push(i);
        }
    }
    //上传证明材料图片
    $scope.uploadProveImg = function (ele, isChange, flag) {
        var obj = ele.files[0];
        var formdata = new FormData();
        if (obj.size / 1024 > 2 * 1024) { //判断文件大小
            layer.msg('图片大小不超过2M')
            return false;
        }
        var index = layer.load(1, {
            shade: [0.1, '#fff'] //loading
        });
        formdata.append('uploadType', 'audio');
        formdata.append('audio', obj);
        $.ajax({
            url: '/Common/Upload',
            type: 'post',
            data: formdata,
            dataType: 'JSON',
            cache: false,
            processData: false,//必选
            contentType: false,//必选
            success: function (data) {
                $scope.closePopWindow();//关闭loading
                if (data.Success) {
                    clearInputFile(ele);//清空input值
                    if (isChange) {//判断是否是修改图片
                        $scope.AuthDataList[flag] = data.Data;//替换
                    } else {
                        $scope.AuthDataList.push(data.Data);//添加
                    }
                    $scope.$apply();
                } else {
                    layer.msg(data.Message)
                }
            }
        })
    }
    //上传身份证图片
    $scope.changeIdentImg = function (type, ele) {
        var obj = ele.files[0];
        var objUrl = getObjectURL(obj)
        if (obj.size / 1024 > 2 * 1024) { //判断文件大小
            layer.msg('图片大小不超过2M')
            return false;
        }
        $(ele).parents('.card-img').find('.upload-box').addClass('hide')
        $(ele).parents('.card-img').find('.image-box').removeClass('hide')
        $(ele).parents('.card-img').find('.image-box > img').attr('src', objUrl);

        if (type == 'front') { //正面
            $scope.submitData.PictureFront = obj
        }
        if (type == 'back') { //反面
            $scope.submitData.PictureBack = obj
        }
    }
    //获取用户支付信息
    $http({
        method: 'post',
        url: '/Api/UserCenterV2/WithdrawAccount',
        async: true
    }).then(function (response) {
        if (response.data.Success) {
            $scope.Weixin = $scope.submitData.WeChatAccount = response.data.Data.WeChatNickName;
            $scope.Alipay = $scope.submitData.AliAccount = response.data.Data.WithdrawAlipayAccount;
        }
    })
    //解除微信绑定
    $scope.unBind = function () {
        $.ajax({
            url: $scope.configPort.sso + "/thirdlogin/WxUnBind",
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function (data) {
                if (data.Success) {
                    layer.msg("解绑成功");
                    $scope.Weixin = $scope.submitData.WeChatAccount = "";
                    $scope.$apply();
                }
            }
        });
    }
    //绑定微信
    $scope.bindWechat = function () {
        //为防止绑到错误参数在url上，再次绑到跳转会找不到返回url，所以url固定
        var myUrl = encodeURIComponent($scope.configPort.web + "/UserCenter/index.html#/authentication/biggie");
        window.location.href = $scope.configPort.sso + "/thirdlogin/WxBind?backUrl=" + myUrl;
    }
    //提交表单
    $scope.submitData = function () {
        if (!$scope.submitData.Title) {
            layer.msg('请填写头衔')
            return false;
        }
        else if (!$scope.submitData.RealName) {
            layer.msg('请填写真实姓名')
            return false;
        }

        else if (!$scope.submitData.PhoneNumber) {
            layer.msg('请填写手机号码')
            return false;
        }
        else if (!$scope.submitData.checkphoneNum) {
            layer.msg('请填写短信验证码')
            return false;
        }
        else if (!$scope.year || !$scope.month || !$scope.day) {
            layer.msg('请填写出生年月日')
            return false;
        }
        else if (!$scope.submitData.IdCardNumber) {
            layer.msg('请填写身份证号')
            return false;
        }
        else if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test($scope.submitData.IdCardNumber))) {//验证身份证正则（简单方法）
            layer.msg('请填写正确的身份证号')
            return false;
        }
        else if (!$scope.submitData.PictureFront) {
            layer.msg('请上传身份证正面照')
            return false;
        }
        else if (!$scope.submitData.PictureBack) {
            layer.msg('请上传身份证反面照')
            return false;
        }
        else if ($scope.AuthDataList.length < 1) {
            layer.msg('请至少上传一张认证材料')
            return false;
        }

        $scope.submitData.Birthday = $scope.year + '-' + $scope.month + '-' + $scope.day;
        var formData = new FormData();
        formData.append('RealName', $scope.submitData.RealName)
        formData.append('Title', $scope.submitData.Title)
        formData.append('PhoneNumber', $scope.submitData.PhoneNumber)
        formData.append('Birthday', $scope.submitData.Birthday)
        formData.append('Star', $scope.submitData.Star ? $scope.submitData.Star : '')
        formData.append('QQ', $scope.submitData.QQ ? $scope.submitData.QQ : '')
        formData.append('checkphoneNum', $scope.submitData.checkphoneNum)
        formData.append('AuthDataList', $scope.AuthDataList)
        formData.append('IdCardNumber', $scope.IdCardNumber)
        formData.append('PictureFront', $scope.submitData.PictureFront)
        formData.append('PictureBack', $scope.submitData.PictureBack)
        formData.append('AliAccount', $scope.submitData.AliAccount)
        formData.append('WeChatAccount', $scope.submitData.WeChatAccount)

        $.ajax({
            type: "post",
            url: "/Api/UserCenterV2/AuthPersonAl",
            data: formData,
            dataType: 'JSON',
            cache: false,
            processData: false,//必选
            contentType: false,//必选
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = '/UserCenter/index.html?type=1#/authentication/examine'
                } else {
                    layer.msg(data.Message)
                }
            }
        })
    }
})
//企业认证
.controller('AuthenticationCompanyCtrl', function ($scope, $http, $rootScope, $filter, $timeout, $interval) {
    $scope.submitData = {};//提交表单数据
    $scope.btnCodeClick = false; //获取验证码按钮
    $scope.btnCodeText = "获取验证码";//获取验证码按钮文本
    $scope.provinceList = cityData.Data;//初始化省列表数据
    var second = 59, timer;
    //根据省份获取城市
    $scope.setCity = function (ProvinceId) {
        angular.forEach($scope.provinceList, function (item) {
            if (item.RegionId == ProvinceId) {
                $scope.cityList = item.SubCity;
                $scope.ProvinceName = item.RegionName;
            }
        })
    }
    //根据id获取区县列表
    $scope.setArea = function (cityId) {
        angular.forEach($scope.cityList, function (item) {
            if (item.RegionId == cityId) {
                $scope.areaList = item.SubCity;
                $scope.CityName = item.RegionName;
            }
        })
    }
    //获取选择的区县
    $scope.getAreaName = function (areaId) {
        angular.forEach($scope.areaList, function (item) {
            if (item.RegionId == areaId) {
                $scope.AreaName = item.RegionName;
            }
        })
    }
    //获取图形验证码
    $scope.getCodeImg = function () {
        $scope.codeImg = $rootScope.configPort.web + '/Api/UserCenterV2/CreatImg?v=' + Math.random()
    }
    $scope.getCodeImg();
    //获取手机验证码
    $scope.getCodeNum = function () {
        if (!$scope.myCodeImg) {
            layer.msg('请输入图形验证码')
            return false;
        }
        if (!$scope.submitData.OperatorPhoneNum) {
            layer.msg('请输入手机号码')
            return false;
        }

        $http({
            method: 'post',
            url: '/Api/UserCenterV2/SendPhoneAuthCode',
            data: { imgCheckCode: $scope.myCodeImg, phoneNum: $scope.submitData.OperatorPhoneNum }
        }).then(function (response) {
            if (response.data.Success) {
                timer = $interval(function () {
                    if (second <= 0) {
                        $interval.cancel(timer);
                        second = 59;
                        $scope.btnCodeText = "获取验证码";
                        $scope.btnCodeClick = false;
                    } else {
                        $scope.btnCodeText = second + 's后重发';
                        second--;
                        $scope.btnCodeClick = true;
                    }
                }, 1000)
            } else {
                layer.msg(response.data.Message);
            }
        })
    }
    //上传图片
    $scope.changeImg = function (type, ele) {
        var obj = ele.files[0];
        var objUrl = getObjectURL(obj)
        if (obj.size / 1024 > 2 * 1024) { //判断文件大小
            layer.msg('图片大小不超过2M')
            return false;
        }
        $(ele).parent('.upload-box').addClass('hide')
        $(ele).parents('.item-box').find('.image-box').removeClass('hide')
        $(ele).parents('.item-box').find('.image-box > img').attr('src', objUrl);

        if (type == 'business') { //工商营业执照图片
            $scope.submitData.EnterpriseLicenseImg = obj
        }
        if (type == 'real') { //认证公函
            $scope.submitData.EnterpriseAuthImg = obj
        }
    }
    //提交表单
    $scope.submitData = function () {
        if (!$scope.submitData.OfficialName) {
            layer.msg('请填写客户名称')
            return false;
        }
        else if (!$scope.submitData.Title) {
            layer.msg('请填写官方头衔')
            return false;
        }
        else if (!$scope.ProvinceName || !$scope.CityName || !$scope.AreaName) {
            layer.msg('请填写所在地')
            return false;
        }
        else if (!$scope.submitData.EnterpriseName) {
            layer.msg('请填写企业名称')
            return false;
        }
        else if (!$scope.submitData.EnterpriseLicense) {
            layer.msg('请填写营业执照注册号')
            return false;
        }
        else if (!($scope.submitData.EnterpriseLicense && $scope.submitData.EnterpriseLicense.length == 15) && !($scope.submitData.EnterpriseLicense && $scope.submitData.EnterpriseLicense.length == 18)) {
            layer.msg('请输入15位营业执照注册号或18位统一社会信用代码')
            return false;
        }
        else if (!$scope.submitData.OperatorName) {
            layer.msg('请填写运营者信息')
            return false;
        }
        else if (!$scope.submitData.OperatorPhoneNum) {
            layer.msg('请填写手机号码')
            return false;
        }
        else if (!$scope.submitData.checkphoneNum) {
            layer.msg('请填写短信验证码')
            return false;
        }
        else if (!$scope.submitData.checkphoneNum) {
            layer.msg('请填写短信验证码')
            return false;
        }
        else if (!$scope.submitData.EnterpriseLicenseImg) {
            layer.msg('请上传企业工商营业执照')
            return false;
        }
        else if (!$scope.submitData.EnterpriseAuthImg) {
            layer.msg('请上传企业认证公函')
            return false;
        }
        $scope.submitData.Location = $scope.ProvinceName + $scope.CityName + $scope.AreaName;
        var formData = new FormData();
        formData.append('OfficialName', $scope.submitData.OfficialName)
        formData.append('Title', $scope.submitData.Title)
        formData.append('Location', $scope.submitData.Location)
        formData.append('EnterpriseName', $scope.submitData.EnterpriseName)
        formData.append('EnterpriseLicense', $scope.submitData.EnterpriseLicense)
        formData.append('OperatorName', $scope.submitData.OperatorName)
        formData.append('OperatorPhoneNum', $scope.submitData.OperatorPhoneNum)
        formData.append('OperatorTelephone', $scope.submitData.OperatorTelephone ? $scope.submitData.OperatorTelephone : '')
        formData.append('OperatorEmail', $scope.submitData.OperatorEmail ? $scope.submitData.OperatorEmail : '')
        formData.append('checkphoneNum', $scope.submitData.checkphoneNum)
        formData.append('EnterpriseLicenseImg', $scope.submitData.EnterpriseLicenseImg)
        formData.append('EnterpriseAuthImg', $scope.submitData.EnterpriseAuthImg)

        $.ajax({
            type: "post",
            url: "/Api/UserCenterV2/AuthEnterprise",
            data: formData,
            dataType: 'JSON',
            cache: false,
            processData: false,//必选
            contentType: false,//必选
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = '/UserCenter/index.html?type=2#/authentication/examine'
                } else {
                    layer.msg(data.Message)
                }
            }
        })
    }

})
//实名认证
.controller('RealNameCtrl', function ($scope, $http, $rootScope, $filter, $interval) {
    $scope.submitData = {};//提交表单数据
    $scope.btnCodeClick = false; //获取验证码按钮
    $scope.btnCodeText = "获取验证码";//获取验证码按钮文本
    var second = 59, timer;
    //获取图形验证码
    $scope.getCodeImg = function () {
        $scope.codeImg = $rootScope.configPort.web + '/Api/UserCenterV2/CreatImg?v=' + Math.random()
    }
    $scope.getCodeImg();
    //获取手机验证码
    $scope.getCodeNum = function () {
        if (!$scope.myCodeImg) {
            layer.msg('请输入图形验证码')
            return false;
        }
        if (!$scope.submitData.PhoneNumber) {
            layer.msg('请输入手机号码')
            return false;
        }
        $http({
            method: 'post',
            url: '/Api/UserCenterV2/SendPhoneAuthCode',
            data: { imgCheckCode: $scope.myCodeImg, phoneNum: $scope.submitData.PhoneNumber }
        }).then(function (response) {
            if (response.data.Success) {
                timer = $interval(function () {
                    if (second <= 0) {
                        $interval.cancel(timer);
                        second = 59;
                        $scope.btnCodeText = "获取验证码";
                        $scope.btnCodeClick = false;
                    } else {
                        $scope.btnCodeText = second + 's后重发';
                        second--;
                        $scope.btnCodeClick = true;
                    }
                }, 1000)
            } else {
                layer.msg(response.data.Message);
            }
        })
    }
    //上传身份证图片
    $scope.changeIdentImg = function (type, ele) {
        var obj = ele.files[0];
        var objUrl = getObjectURL(obj)
        if (obj.size / 1024 > 2 * 1024) { //判断文件大小
            layer.msg('图片大小不超过2M')
            return false;
        }
        $(ele).parents('.card-img').find('.upload-box').addClass('hide')
        $(ele).parents('.card-img').find('.image-box').removeClass('hide')
        $(ele).parents('.card-img').find('.image-box > img').attr('src', objUrl);

        if (type == 'front') { //正面
            $scope.submitData.PictureFront = obj
        }
        if (type == 'back') { //反面
            $scope.submitData.PictureBack = obj
        }
    }
    $scope.submitData = function () {
        if (!$scope.submitData.IDCardName) {
            layer.msg('请填写真实姓名')
            return false;
        }
        else if (!$scope.submitData.PhoneNumber) {
            layer.msg('请填写手机号码')
            return false;
        }
        else if (!$scope.submitData.checkphoneNum) {
            layer.msg('请填写手机验证码')
            return false;
        }
        else if (!$scope.submitData.IDCardNo) {
            layer.msg('请填写身份证号码')
            return false;
        }
        else if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test($scope.submitData.IDCardNo))) {//验证身份证正则（简单方法）
            layer.msg('请填写正确的身份证号')
            return false;
        }
        else if (!$scope.submitData.PictureFront) {
            layer.msg('请上传身份证正面照')
            return false;
        }
        else if (!$scope.submitData.PictureBack) {
            layer.msg('请上传身份证反面照')
            return false;
        }

        var formData = new FormData();
        formData.append('IDCardName', $scope.submitData.IDCardName)
        formData.append('PhoneNumber', $scope.submitData.PhoneNumber)
        formData.append('checkphoneNum', $scope.submitData.checkphoneNum)
        formData.append('IDCardNo', $scope.submitData.IDCardNo)
        formData.append('PictureFront', $scope.submitData.PictureFront)
        formData.append('PictureBack', $scope.submitData.PictureBack)

        $.ajax({
            type: "post",
            url: "/Api/UserCenterV2/IDCardupLoad",
            data: formData,
            dataType: 'JSON',
            cache: false,
            processData: false,//必选
            contentType: false,//必选
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = '/UserCenter/index.html?type=3#/authentication/examine'
                } else {
                    layer.msg(data.Message)
                }
            }
        })
    }
})
.controller('examineCtrl', function ($scope) {
    //1个人2企业3实名
    $scope.type = GetQueryString("type") ? GetQueryString("type") : 1;
});
//获取某个月的天数
function getDaysInOneMonth(year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
}
//获取图片地址
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
