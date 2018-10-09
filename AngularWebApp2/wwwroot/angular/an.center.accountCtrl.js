
//获取某个月的天数
function getDaysInOneMonth(year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
}
//生成GUID
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
//获取图片路径
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file)
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file)
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file)
    }
    return url;
};
function adjust(el, selection) {
    var scaleX = $(el).width() / (selection.width || 1);
    var scaleY = $(el).height() / (selection.width || 1);
    $(el + ' img').css({
        width: Math.round(scaleX * $('#avatar').width()) + 'px',
        height: Math.round(scaleY * $('#avatar').height()) + 'px',
        marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
        marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
    });
}
function adjust2(el, selection) {
    var scaleX = $(el).width() / (selection.width || 1);
    var scaleY = $(el).height() / (selection.height || 1);
    $(el + ' img').css({
        width: Math.round(scaleX * $('#avatar').width()) + 'px',
        height: Math.round(scaleY * $('#avatar').height()) + 'px',
        marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
        marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
    });
}
function preview(img, selection) {
    //		adjust('#img_small_preview', selection);
    adjust('#img_big_preview', selection);
}
function preview2(img, selection) {
    //		adjust('#img_small_preview', selection);
    adjust2('#img_big_preview', selection);
}
var lottery, drawRoll,image_select;//定义转盘对象，以及转盘的方法,头像图片选择
//个人资料
userApp.controller("PersonalCtrl", function ($scope, $http, $rootScope, $filter,$location) {
    // console.log('PersonalCtrl')
    $rootScope.isOpen.account = true;//是否展开判断
    $rootScope.subNavFlag = 20; //导航是否选择判断  
    $scope.dateData = {//出生日期数据
        year: [],
        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        day: []
    }
    $scope.cityAllData = cityData.Data;//城市数据
    $scope.liveCityData = "";//居住城市数据
    $scope.liveAreaData = [];//居住的地区数据
    $scope.personalInfo = {};//个人资料
    $scope.isFristGet = true;
    var message = $location.search().message;//获取绑到返回的信息
  	if(message){
  		layer.msg(message)
  	}
    //设置出生日期年份
    $scope.setYearData = function () {
        var date = new Date;
        var current_year = date.getFullYear();
        for (var i = 0; i < 100; i++) {
            var item_y = current_year - i;
            $scope.dateData.year.push(item_y);
        }
    }
    $scope.setYearData();
    //获取个人资料
    $http({
        url: "/Api/UserCenter/UserInformation",
    }).success(function (data) {
        $scope.personalInfo = data;
        $scope.setDay();
        $scope.personalInfo.LiveArea = data.LiveArea;
        if (data.questionFee == 0) {
            data.questionFee = "";
        }
        $scope.personalInfo.QuestionFee = data.questionFee;
        delete $scope.personalInfo.questionFee;
    });
	//获取绑到信息
	$http({
        url: "/Api/UserCenter/PersonalInfo",
    }).success(function (data) {
        if(data.Success){
        	$scope.userBindInfo = data.Data;
        }
        console.log(data)
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
                    $scope.userBindInfo.WeChatName = "";
                    $scope.$apply();
                }
            }
        });
    }
    //绑定微信
    $scope.goBind = function () {
    	//为防止绑到错误参数在url上，再次绑到跳转会找不到返回url，所以url固定
        var myUrl = encodeURIComponent($scope.configPort.web+"/UserCenter/index.html#/account/personal");
        window.location.href = $scope.configPort.sso + "/thirdlogin/WxBind?backUrl=" + myUrl;
    }
    //解除QQ绑定
    $scope.unBindQQ = function () {
        $.ajax({
            url: $scope.configPort.sso + "/thirdlogin/QQUnBind",
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function (data) {
                if (data.Success) {
                    layer.msg("解绑成功");
                    $scope.userBindInfo.QQnickName = "";
                    $scope.$apply();
                }
            }
        });
    }
    //绑定QQ
    $scope.goBindQQ = function () {
        var myUrl = encodeURIComponent(window.location.href);
        window.location.href = $scope.configPort.sso + "/thirdlogin/QQBind?backUrl=" + myUrl;
    }
    //根据省id获取城市
    $scope.setCity = function (provinceId) {
        angular.forEach($scope.cityAllData, function (item) {
            if (item.RegionId == provinceId) {
                $scope.liveCityData = item.SubCity;
                return false;
            }
        })
    }
    $scope.setArea = function (cityId) {
        angular.forEach($scope.liveCityData, function (item) {
            if (item.RegionId == cityId) {
                $scope.liveAreaData = item.SubCity;
                return false;
            }
        })
    }
    //获取选择年月的天数数据
    $scope.setDay = function () {
    	$scope.dateData.day = [];
        var dayCount = getDaysInOneMonth($scope.personalInfo.Year, $scope.personalInfo.Month);
        for (var i = 1; i < dayCount + 1; i++) {
            $scope.dateData.day.push(i);
        }
    }
    //检测选择出生日期函数
    $scope.$watch("personalInfo.Year + personalInfo.Month", function () {
        $scope.setDay();
    });
    //检测所在省的数据变化
    $scope.$watch("personalInfo.LiveProvince", function (newVal, oldVal) {
        $scope.setCity(newVal);
        $scope.liveAreaData = [];
        if (!$scope.isFristGet) {
            $scope.isFristGet = false;
            $scope.personalInfo.LiveArea = "";
        }
        
    });
    //检测所在市的数据变化
    $scope.$watch("personalInfo.LiveCity", function (newVal, oldVal) {
        $scope.setArea(newVal);
    });
    //检测输入价格
    $scope.$watch("personalInfo.QuestionFee", function (newVal, oldVal) {
        var _new;
        var re = /^[0-9]+.?[0-9]*$/;
        if (newVal && !re.test(newVal)) {
            _new = newVal.replace(/[^0-9]/ig, "");            
        } else {
            _new = newVal;
        }
        if (_new) {
            _new = Number(_new);
        }       
        if ((_new || _new===0)&& _new < 1) {
                $scope.personalInfo.QuestionFee = 1;
        } else if (_new > 999) {
            $scope.personalInfo.QuestionFee = 999;
        } else {
            $scope.personalInfo.QuestionFee = _new;
        }
    });
    $scope.save = function () {
        if (!$scope.personalInfo.PhoneNumber) {
            alert("手机号不能为空！");
            return false;
        }
        if (!$scope.personalInfo.NickName) {
            alert("昵称不能为空！");
            return false;
        }
        if (!(/^1[34578]\d{9}$/.test($scope.personalInfo.PhoneNumber))) {
            alert("手机号格式不正确！");
            return false;
        }
        if ($scope.personalInfo.Email && (!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test($scope.personalInfo.Email)))) {
            alert("邮箱格式不正确！");
            return false;
        }
        $http({
            method: 'POST',
            url: "/Api/UserCenter/SavePersonalInfo",
            data: $scope.personalInfo
        }).success(function (data) {
            if (data.Success) {
                layer.msg("修改成功");
                //重新获取头部个人资料
			    $scope.getUserInfo();
            } else {
                layer.msg(data.Message);
            }
        });
    }
    //上传修改头像
    $scope.shearHeadImage = function () {
        $("#shearImage").ajaxSubmit({
            type: 'post',
            url: "/Common/CropImage",
            success: function (data) {
                if (data.Success) {
                    layer.msg("修改成功");
                    $scope.closePopWindow();
                    if ($scope.UserInfo.HeadImgUrl.indexOf("/web/Content_/img/man.jpg")>-1) {
                        $scope.getUserInfo();
                    }
                    $scope.UserInfo.HeadImgUrl = data.Data;
                    $scope.$apply();
                } else {
                    $("#shearImg").val('');
                    layer.msg(data.Message);
                }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                console.log('error')
            }
        })
    }
    $scope.closePopWindow = function () {
        if (image_select) {
            image_select.cancelSelection();
        }       
        layer.closeAll();
    }
})
//收货地址
.controller("AddressCtrl", function ($scope, $http, $rootScope, $filter) {
    //console.log('AddressCtrl')
    $rootScope.isOpen.account = true;//是否展开判断
    $rootScope.subNavFlag = 21; //导航是否选择判断
    var web = $rootScope.configPort.web;//主站点
    $scope.addressList = "";//地址列表
    $scope.addressInfo = {//新增地址信息
        ConsigneeName: "",
        Province: "",
        City: "",
        Area: "",
        Adress: "",
        Mobile: "",
        Postcode:""
    }
    $scope.addressEditInfo = {//编辑地址信息
        ConsigneeId: "",
        ConsigneeName: "",
        Province: "",
        City: "",
        Area: "",
        Adress: "",
        Mobile: "",
        Postcode:""
    }
    //城市数据初始化(编辑与新增列表分开，防止修改之后，新增选择的地址也跟着变了)
    $scope.cityList = [], $scope.areaList = [];
    $scope.cityEditList = [], $scope.areaEditList = [];
    //默认选择信息
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
    $scope.cityList.push($scope.cityDef);//初始化市列表数据
    $scope.areaList.push($scope.areaDef);//初始化地区列表数据
    $scope.provinceList = cityData.Data;//初始化省列表数据
    $scope.provinceList.splice(0, 0, $scope.provinceDef);

    //根据省ID获取市
    $scope.setCity = function (ProvinceId, type, isInit) {
        if (type == 1) {//新增
            $scope.addressInfo.City = "";
            $scope.addressInfo.Area = "";
            angular.forEach($scope.provinceList, function (item) {
                if (item.RegionId == ProvinceId) {
                    $scope.cityList = item.SubCity;
                    if ($scope.cityList.length < 1 || $scope.cityList[0].RegionId != "") {
                        $scope.cityList.splice(0, 0, $scope.cityDef);
                    }

                }
            })
        } else {//编辑
            if (!isInit) {//判断是否需要初始化所选择的城市，县区
                $scope.addressEditInfo.City = "";
                $scope.addressEditInfo.Area = "";
            }
            angular.forEach($scope.provinceList, function (item) {
                if (item.RegionId == ProvinceId) {
                    $scope.cityEditList = item.SubCity;
                    if ($scope.cityEditList.length < 1 || $scope.cityEditList[0].RegionId != "") {
                        $scope.cityEditList.splice(0, 0, $scope.cityDef);
                    }
                }
            })
        }
    }
    //根据省ID获取区域
    $scope.setArea = function (cityId, type, isInit) {
        if (type == 1) {//新增
            $scope.addressInfo.Area = "";
            angular.forEach($scope.cityList, function (item) {
                if (item.RegionId == cityId) {
                    $scope.areaList = item.SubCity;
                    if ($scope.areaList.length < 1 || $scope.areaList[0].RegionId != "") {
                        $scope.areaList.splice(0, 0, $scope.areaDef);
                    }
                }
            })
        } else {//编辑
            if (!isInit) {//判断是否需要初始化所选择的县区
                $scope.addressEditInfo.Area = "";
            }
            angular.forEach($scope.cityEditList, function (item) {
                if (item.RegionId == cityId) {
                    $scope.areaEditList = item.SubCity;
                    if ($scope.areaEditList.length < 1 || $scope.areaEditList[0].RegionId != "") {
                        $scope.areaEditList.splice(0, 0, $scope.areaDef);
                    }
                }
            })
        }
    }
    //获取地址列表
    $scope.getAddressList = function () {
        $http({
            url: "/Api/UserCenter/PersonalAddress"
        }).success(function (data) {
            $scope.addressList = data;
        });
    }
    $scope.getAddressList();
    //检测地址发生变化
    $scope.$watch("addressInfo.Province", function (newVal, oldVal) {
        $scope.setCity(newVal, 1);
    });
    $scope.$watch("addressInfo.City", function (newVal, oldVal) {
        $scope.setArea(newVal, 1);
    });
    $scope.$watch("addressEditInfo.Province", function (newVal, oldVal) {
        if (oldVal == "") {
            $scope.setCity(newVal, 2, true);
        } else {
            $scope.setCity(newVal, 2);
        }
    });
    $scope.$watch("addressEditInfo.City", function (newVal, oldVal) {
        if (oldVal == "") {
            $scope.setArea(newVal, 2, true);
        } else {
            $scope.setArea(newVal, 2);
        }
    });
    $scope.$watch("addressEditInfo.ConsigneeName", function (newVal, oldVal) {
        if (newVal.length > 5) {
            $scope.addressEditInfo.ConsigneeName = newVal.slice(0, 5);
        }
    });
    $scope.$watch("addressInfo.ConsigneeName", function (newVal, oldVal) {
        if (newVal.length > 5) {
            $scope.addressInfo.ConsigneeName = newVal.slice(0, 5);
        }
    });
    //新增地址
    $scope.addSave = function (type) {
        if (type == 1) {
            if (!$scope.addressInfo.ConsigneeName) {
                layer.msg("联系人不能为空");
                return false;
            }
            if (!$scope.addressInfo.Mobile) {
                layer.msg(" 手机号码不能为空");
                return false;
            }
            if (!$scope.addressInfo.Province) {
                layer.msg("请选择省份");
                return false;
            }
            if (!$scope.addressInfo.City) {
                layer.msg("请选择城市");
                return false;
            }
            if (!$scope.addressInfo.Area) {
                layer.msg("请选择县区");
                return false;
            }
            if (!$scope.addressInfo.Adress) {
                layer.msg("详细地址不能为空");
                return false;
            }
            if (!(/^1[34578]\d{9}$/.test($scope.addressInfo.Mobile))) {
                layer.msg("手机号格式不正确！");
                return false;
            }
            $http({
                method: "POST",
                url: "/Api/UserCenter/PersonalAddressSave",
                data: $scope.addressInfo
            }).success(function (data) {
                if (data.Success) {
                    $scope.getAddressList();
                    for (var key in $scope.addressInfo) {
                        $scope.addressInfo[key] = "";
                        layer.msg("添加成功");
                    }

                } else {
                    layer.msg(data.Message);
                }
            });
        } else {
            if (!$scope.addressEditInfo.ConsigneeName) {
                layer.msg("联系人不能为空");
                return false;
            }
            if (!$scope.addressEditInfo.Mobile) {
                layer.msg(" 手机号码不能为空");
                return false;
            }
            if (!$scope.addressEditInfo.Province) {
                layer.msg("请选择省份");
                return false;
            }
            if (!$scope.addressEditInfo.City) {
                layer.msg("请选择城市");
                return false;
            }
            if (!$scope.addressEditInfo.Area) {
                layer.msg("请选择县区");
                return false;
            }
            if (!$scope.addressEditInfo.Adress) {
                layer.msg("详细地址不能为空");
                return false;
            }
            if (!(/^1[34578]\d{9}$/.test($scope.addressEditInfo.Mobile))) {
                layer.msg("手机号格式不正确！");
                return false;
            }
            $http({
                method: "POST",
                url: "/Api/UserCenter/PersonalAddressSave",
                data: $scope.addressEditInfo
            }).success(function (data) {
                layer.closeAll()
                if (data.Success) {
                    $scope.getAddressList();
                    layer.msg("修改成功");
                } else {
                    layer.msg(data.Message);
                }
            });
        }

    }
    //删除地址
    $scope.delAddress = function (index) {
        $http({
            method: "POST",
            url: "/Api/UserCenter/PersonalAddressDelete",
            data: { consigneeId: $scope.addressList[index].ConsigneeId }
        }).success(function (data) {
            if (data.Success) {
                $scope.getAddressList();
                layer.msg("删除成功");
            } else {
                layer.msg(data.Message);
            }
        });
    }
    //设为默认
    $scope.setDefault = function (index) {
        $http({
            method: "POST",        
            url: "/Api/UserCenter/PersonalAddressSetDefault",
            data: { consigneeId: $scope.addressList[index].ConsigneeId }
        }).success(function (data) {
            if (data.Success) {
                $scope.getAddressList();
            } else {
                layer.msg(data.Message);
            }
        });
    }
    //显示修改地址弹框
    $scope.showEdit = function (index) {
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#editAddressPop')
        });
        //初始化编辑菜单数据
        var editData = $scope.addressList[index];
        for (var key in $scope.addressEditInfo) {
            if (editData[key]) {
                $scope.addressEditInfo[key] = editData[key];
            }
        }
    }
})
//安全设置
.controller("SafeSettingCtrl", function ($scope, $http, $rootScope, $filter,$location) {
    $rootScope.isOpen.account = true;//是否展开判断
    $rootScope.subNavFlag = 19; //导航是否选择判断
    $scope.infoData = {
        weixiPay: "",//微信名称
        WithdrawAlipayAccount: "",//支付宝账户
        isShowEdit: true,//是否显示支付宝修改
        alipay: "",//支付宝支付信息
        currentPwd: "",//当前密码
        newPwd: "",//新密码
        confirmPwd: "",//确认密码
        pwdGrade:0,//密码等级
    }
    $scope.pwdData = {
        isCountDown: false,
        countDown:60,
        isHasPay:"",
        status:0,//状态0获取验证码之前，1获取验证码之后
        current: 0,//当前修改脚标，1是账户，2是支付
        newPwd: "",//新密码
        confirmPwd: "",//确认密码
        pwdCode: "",//验证码
        imgCode: "",
        imgSrc:""
    }
    var message = $location.search().message;//获取绑到返回的信息
  	if(message){
  		layer.msg(message)
  	}
  	$http({
  	    url: "/Api/UserCenterV2/WithdrawAccount",
  	    method: "POST"
  	}).success(function (data) {
  	    if (data.Success) {
  	        $scope.infoData.weixiPay = data.Data.WeChatNickName;
  	        $scope.infoData.WithdrawAlipayAccount = data.Data.WithdrawAlipayAccount;
  	        if ($scope.infoData.WithdrawAlipayAccount) {
  	            $scope.infoData.isShowEdit = false;
  	        }
  	    }
  	});
    //获取绑到信息
    $http({
        url: "/Api/UserCenter/PersonalInfo",
    }).success(function (data) {
        if (data.Success) {
            $scope.userBindInfo = data.Data;
        }
    })
    //是否设置过支付密码
    $http({
        url: "/Api/Client/HadSetedPaymentPassword",
    }).success(function (data) {
        if (data.Success) {
            $scope.pwdData.isHasPay = data.Data;
        }
    })
    $scope.showEdit = function () {
        $scope.infoData.isShowEdit = true;
    }
    $scope.closePopWindow = function () {
        $scope.pwdData.status = 0;
        layer.closeAll();
    }
    //弹框
    $scope.editPwdPop = function (type) {
        if (type != $scope.pwdData.current) {
            $scope.pwdData.isCountDown = false;
            clearInterval(timer);
            $scope.pwdData.countDown = 59;
            $scope.pwdData.imgCode = "";
            $scope.pwdData.pwdCode = "";
            $scope.pwdData.imgSrc= "/Api/UserCenterV2/CreatImg?v=" + Math.random();
        } else if (!$scope.pwdData.isCountDown) {
            $scope.pwdData.imgSrc = "/Api/UserCenterV2/CreatImg?v=" + Math.random();
            $scope.pwdData.imgCode = "";
            $scope.pwdData.pwdCode = "";
        }
        if (type == 1) {//修改账户密码
            $scope.pwdData.current = 1;
        } else {//修改支付密码
            $scope.pwdData.current = 2;
        }                
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#editPwd')
        });
    }
    var timer = "";
    //发送
    $scope.sendCrod = function () {       
        if ($scope.pwdData.current == 1) {//账户         
            if (!$scope.pwdData.imgCode) {
                layer.msg("请先输入图片验证码");
                return false;
            }
            $.ajax({
                url: "/Api/UserCenterV2/SendPhoneAuthCode",
                type: 'POST', //GET
                async: true,    //或false,是否异步
                data: { imgCheckCode: $scope.pwdData.imgCode, phoneNum: $scope.userBindInfo.PhoneNumber },
                success: function (data) {
                    if (data.Success) {
                        $scope.pwdData.isCountDown = true;
                        $scope.$apply();
                        timer = setInterval(function () {
                            $scope.pwdData.countDown -= 1;
                            if ($scope.pwdData.countDown == 0) {
                                $scope.pwdData.isCountDown = false;
                                $scope.pwdData.countDown = 60;
                                $scope.pwdData.pwdCode = "";
                                clearInterval(timer);
                            }
                            $scope.$apply();
                        }, 1000);
                    } else {
                        layer.msg(data.Message);
                    }
                }
            })
        } else if ($scope.pwdData.current == 2) {//支付
            $http({
                url: "/Api/Client/SendPhoneValidateCode",
                method: "POST",
                data: {
                    phoneNumber: $scope.userBindInfo.PhoneNumber
                }
            }).success(function (data) {
                if (data.IsSuccess) {
                    $scope.pwdData.isCountDown = true;
                    timer = setInterval(function () {
                        $scope.pwdData.countDown -= 1;
                        if ($scope.pwdData.countDown == 0) {
                            $scope.pwdData.isCountDown = false;
                            $scope.pwdData.countDown = 59;
                            clearInterval(timer);
                        }
                        $scope.$apply();
                    }, 1000)
                }
            })
        }  
    }
    //下一步
    $scope.nextStep = function () {
        if (!$scope.pwdData.pwdCode) {
            layer.msg("请输入手机验证码");
            return false;
        }
        if ($scope.pwdData.current == 1) {//账户    
            $.ajax({
                url: "/api/UserCenterV2/ActionValidatePhoneValidateCode",
                type: 'POST', //GET
                async: true,    //或false,是否异步
                data: { checkCode: $scope.pwdData.pwdCode },
                success: function (data) {
                    if (data.Success) {
                        $scope.pwdData.status = 1;
                        $scope.pwdData.isCountDown = false;
                        $scope.pwdData.countDown = 59;
                    } else {
                        layer.msg(data.Message);
                    }
                }
            })
        } else if ($scope.pwdData.current == 2) {//支付
            $http({
                url: "/Api/Client/ResetPayPassWord",
                method: "POST",
                data: {
                    phoneNumber: $scope.userBindInfo.PhoneNumber,
                    validateCode: $scope.pwdData.pwdCode
                }
            }).success(function (data) {
                if (data.IsSuccess) {
                    $scope.pwdData.status = 1;
                    $scope.pwdData.isCountDown = false;
                    $scope.pwdData.countDown = 59;
                } else {
                    layer.msg(data.Message);
                }
            })
        }
    }
    //确定
    $scope.comfrim = function () {
        if (!$scope.pwdData.newPwd) {
            layer.msg("请输入新密码");
            return false;
        }
        if (!$scope.pwdData.confirmPwd) {
            layer.msg("请输入确认密码");
            return false;
        }
        if ($scope.pwdData.newPwd!=$scope.pwdData.confirmPwd) {
            layer.msg("两次密码输入不一致");
            return false;
        }
        if ($scope.pwdData.current == 1) {           
            $.ajax({
                url:  "/Api/Client/FindPwd",
                type: 'POST', //GET
                async: true,    //或false,是否异步
                data: { newPwd: $scope.pwdData.newPwd, phoneNum: $scope.userBindInfo.PhoneNumber, confirmPwd: $scope.pwdData.confirmPwd },
                success: function (data) {
                    if (data.Success) {
                        $scope.pwdData.status = 0;
                        layer.msg("修改成功");
                        setTimeout(function () {
                            layer.closeAll();
                        }, 50);
                    } else {
                        layer.msg(data.Message);
                    }
                }
            })

        } else if ($scope.pwdData.current == 2) {
            $http({
                url: "/Api/Client/SavePaymentPassword",
                method: "POST",
                data: {
                    phoneNumber: $scope.userBindInfo.PhoneNumber,
                    NewPaymentPassword: $scope.pwdData.newPwd,
                    confirmCode: $scope.pwdData.confirmPwd
                }
            }).success(function (data) {
                if (data.IsSuccess) {
                    $scope.pwdData.status = 0;
                    $scope.pwdData.isHasPay = true;
                    layer.msg("修改成功");
                    setTimeout(function () {
                        layer.closeAll();
                    }, 50)
                } else {
                    layer.msg(data.Message);
                }
            })
        }
    }
    //保存支付宝信息
    $scope.savePayInfo = function () {
        if ($scope.infoData.alipay == "") {
            layer.msg("支付宝信息不能为空")
            return false
        } 
        $http({
            url: "/Api/UserCenterV2/SaveWithdrawAccount",
            data: { withdrawAlipayAccount: $scope.infoData.alipay },
            method:"POST",
        }).success(function (data) {
            if (data.Success) {
                layer.msg("绑定成功");
                $scope.infoData.isShowEdit = false;
                $scope.infoData.WithdrawAlipayAccount = $scope.infoData.alipay;
                $scope.infoData.alipay = "";
            } else {
                layer.msg(data.Message)
            }
        })
    }
    //修改密码
    $scope.editPwd = function () {
        if ($scope.infoData.currentPwd == "") {
            layer.msg("请输入当前密码");
            return false;
        }
        if ($scope.infoData.newPwd == "") {
            layer.msg("请输入新密码");
            return false;
        }
        if ($scope.infoData.confirmPwd == "") {
            layer.msg("请输入确认密码");
            return false;
        }
        if ($scope.infoData.confirmPwd != $scope.infoData.newPwd) {
            layer.msg("两次密码输入不一致");
            return false;
        }
        $http({
            url: "/Api/UserCenter/PersonalPwdModify",
            data: {
                oldPwd: $scope.infoData.currentPwd,
                newPwd: $scope.infoData.newPwd
            },
            method: "POST"
        }).success(function (data) {
            if (data.Success) {
                layer.msg("修改成功");
                $scope.infoData.currentPwd = "";
                $scope.infoData.newPwd = "";
                $scope.infoData.confirmPwd = "";
            } else {
                layer.msg(data.Message);
            }
        });       
    }
    //解除QQ绑定
    $scope.unBindQQ = function () {
        $.ajax({
            url: $scope.configPort.sso + "/thirdlogin/QQUnBind",
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function (data) {
                if (data.Success) {
                    layer.msg("解绑成功");
                    $scope.userBindInfo.QQnickName = "";
                    $scope.$apply();
                }
            }
        });
    }
    //绑定QQ
    $scope.goBindQQ = function () {
        var myUrl = encodeURIComponent(window.location.href);
        window.location.href = $scope.configPort.sso + "/thirdlogin/QQBind?backUrl=" + myUrl;
    }
    //解除微信绑定
    $scope.unBind = function () {
        $.ajax({
            url: $scope.configPort.sso + "/thirdlogin/WxUnBind",
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function (data) {
                if (data.Success) {
                    layer.msg("解绑成功");
                    $scope.infoData.weixiPay = "";
                    $scope.$apply();
                }
            }
        });
    }
    //绑定微信
    $scope.goBind = function () {
    	//为防止绑到错误参数在url上，再次绑到跳转会找不到返回url，所以url固定
        var myUrl = encodeURIComponent($scope.configPort.web+"/UserCenter/index.html#/account/safeSetting");
        window.location.href = $scope.configPort.sso + "/thirdlogin/WxBind?backUrl=" + myUrl;
    }
    var strongRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}'); //密码位8位以上并且字母数字特殊符号三项都包括，强度最强
    var mediumRegex = new RegExp('(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{7,30}|(?=.*[0-9])(?=.*[a-zA-Z]).{7,30}|(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{7,30}'); //密码位6位以上并且字母数字
    //检测新密码，获取密码强度
    $scope.$watch("infoData.newPwd", function (newVal,oldVal) {
        if (newVal != oldVal) {
            if (strongRegex.test(newVal)) {
                $scope.infoData.pwdGrade = 3;
            } else if (mediumRegex.test(newVal)) {
                $scope.infoData.pwdGrade = 2
            } else if (newVal.length > 0) {
                $scope.infoData.pwdGrade = 1;
            } else {
                $scope.infoData.pwdGrade = 0;
            }
        }
    })
})
 //积分兑换
.controller("IntegralExchangeCtrl", function ($scope, $http, $rootScope)         {
    $rootScope.isOpen.integral = true;//是否展开判断
    $rootScope.subNavFlag = 11; //导航是否选择判断
    //获取优惠券列表
    $scope.getCoupon = function () {
        $http({
            url: "/Api/usercenter/CouponPatchList",
            data: {
                CouponReceiveType: 3,
                PageSize: 8,
                PageNum: 1
            },
            method: "POST"
        }).success(function (data) {
            if (data.success) {
                angular.forEach(data.rows, function (item, index) {
                    if ((item.DiscountFeeText == '老司机问答' || item.AvalibleAreaText == '老司机问答可用')&& item.DiscountFeeUnit == null) {
                        //item.leftText = "老司机问答抵用券";
                        item.DiscountFeeText = "老司机";
                        item.goUrl = $rootScope.configPort.party + "/Biggie/Index";
                    }  else if (item.DiscountFeeText == "运费") {
                        item.goUrl = $rootScope.configPort.shop;
                    } else if (item.DiscountFeeText == "代驾") {
                        item.goUrl = $rootScope.configPort.maintain;
                    } else if (item.AvalibleAreaText == "全场通用") {
                        item.goUrl = $rootScope.configPort.web;
                    } else {
                        item.goUrl = $rootScope.configPort.maintain;
                    }
                    var timeList = item.ValidDate.split("-");
                    item.endTime = timeList[1] ? timeList[1] : '';
                })
                $scope.couponList = data.rows;
            } else {
                layer.msg(data.msg);
            }
        });
    }
    $scope.getCoupon();
    //立即兑换
    $scope.redeemNow = function (index, type,id) {
        if (type == 1) {//兑换优惠券
            if ($scope.couponList[index].NeedPoint > $scope.UserInfo.TotalPointBalance) {
                layer.open({
                    type: 1,
                    closeBtn: 0, //不显示关闭按钮
                    shadeClose: true,//开启遮罩关闭
                    move: false, //禁止拖拽
                    content: $('#intgral')
                });
            } else {
                $http({
                    url: "/Api/usercenter/ReceiveCoupon",
                    data: { couponPatchId: id },
                    method:"POST"
                }).success(function (data) {
                    if (data.Success) {
                        layer.msg("兑换成功");
                        $scope.couponList[index].IsReceived = true;
                        $scope.getUserInfo();//更新积分数据
//                      $scope.$apply();//防止页面不更新
                    } else {
                        layer.msg(data.Message);
                    }
                })
            }
        }
    }
})
//积分抽奖
.controller("IntegralLuckDrawCtrl", function ($scope, $http, $rootScope) {
    $rootScope.isOpen.account = true;//是否展开判断
    $rootScope.subNavFlag = 12; //导航是否选择判断  
    $scope.prizeIndex = -1;
    $scope.drawIndex = 3;//
    $scope.prizeList = [];//奖品列表
    $scope.prizeRecordList = [];//奖品记录列表
    $scope.totalPointBalance = 0;
    $scope.pageNum = 1;
    $scope.pageTotal=1;
    //获取奖品列表
    $scope.getPrize = function () {
        $http({
            url: "/Api/UserCenterV2/AwardList",
            method: "POST"
        }).success(function (data) {
            if (data.Success) {
                $scope.prizeList = data.Data;
                angular.forEach($scope.prizeList, function (item) {
                    if (item.AwardName == "谢谢参与") {
                        item.isThinks = true;
                    } else {
                        item.isThinks = false;
                    }
                })               
            } else {
                layer.msg(data.Message)
            }
        });
    }
    $scope.getPrize();
    //抽奖方法
    $scope.drawPrize = function () {
    	var isDraw = false
        $.ajax({
            url: "/Api/UserCenterV2/DrawAward",
            async: false,
            success: function (data) {
                if (data.Success) {
                	isDraw = true;
                    $scope.totalPointBalance = data.Data.TotalPointBalance;
                    angular.forEach($scope.prizeList, function (item, index) {
                        if (item.AwardId == data.Data.AwardId) {
                            $scope.drawIndex = index + 1;
                            $scope.$apply();
                        }
                    })
                }else if(data.Message == '积分余额不足，不能抽奖'){
                	isDraw = false;
                	layer.msg("积分不足，不能进行抽奖")
                	return false;
                }
                else{
                	isDraw = false;
                	layer.msg(data.Message);
                	return false;
                }
            }
        });
        return isDraw;
    }
    
    //中奖之后的方法
    $scope.luckPrize = function () {
        $scope.UserInfo.TotalPointBalance = $scope.totalPointBalance;
        $scope.$apply();
    }
    //显示中奖纪录弹框
    $scope.showPrize = function () {
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#prizeList')
        });
        $scope.getRecord(1);
    }
    //获取记录
    $scope.getRecord = function () {
        $http({
            url: "/Api/UserCenterV2/MyDrawAward",
            data: {
                PageNum: $scope.pageNum,
                PageSize: 10
            },
            method: "POST"
        }).success(function (data) {
            $scope.pageTotal = data.pageTotal;
            if (data.success && data.rows && data.rows.length > 0) {
                $scope.prizeRecordList = data.rows;
                $scope.setPage(data);
            } else {
                layer.msg(data.msg)
            }
        });
    }
    //根据数据设置分页的方法
    $scope.setPage = function (data) {
        if (data.pageTotal > 1) {//当页总数大于1时
            $scope.morePage = true;//显示分页导航
            var pageList = new Array();
            var pageSum = 10;//分页导航最多可显示20个，可设置，但目前只能是偶数（未做奇偶数判断）
            if (data.pageTotal < pageSum + 1) {//
                for (var i = 1; i < data.pageTotal + 1; i++) {
                    pageList.push(i);
                }
                $scope.showLeftSpot = false;//不显示左边...
                $scope.showRightSpot = false;//不显示右边...
            } else {
                if ($scope.pageNum < pageSum / 2 + 1) {
                    $scope.showLeftSpot = false;
                    $scope.showRightSpot = true;
                    for (var i = 1; i < pageSum + 1; i++) {
                        pageList.push(i);
                    }
                } else {
                    $scope.showLeftSpot = true;
                    $scope.showRightSpot = true;
                    if ($scope.selectScreen.PageNum + pageSum / 2 > data.pageTotal) {
                        for (var i = data.pageTotal - pageSum; i < data.pageTotal + 1; i++) {
                            pageList.push(i);
                        }
                    } else {
                        for (var i = $scope.pageNum - pageSum / 2; i < $scope.pageNum + pageSum / 2 + 1; i++) {
                            pageList.push(i);
                        }
                    }
                    if ($scope.pageNum == data.pageTotal) {
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
    //点击分页导航触发事件
    $scope.goPage = function (flag) {
        $scope.pageNum = flag;
    }
    //点击上一页按钮触发事件
    $scope.golastPage = function () {
        if ($scope.pageNum > 1) {
            $scope.pageNum -= 1;
        } else {
            $scope.pageNum = 1;
        }
    }
    //点击下一页按钮触发事件
    $scope.goNextPage = function () {
        if ($scope.pageNum < $scope.pageTotal) {
            $scope.pageNum += 1;
        } else {
            $scope.pageNum = $scope.pageTotal;
        }
    }
    $scope.$watch("pageNum", function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.getRecord();
        }
    })
})
//积分任务
.controller("IntegralTaskCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.integral = true;//是否展开判断
    $rootScope.subNavFlag = 13; //导航是否选择判断
    $scope.tabIndex = 10;//10为首次登录，20为新手任务，30为日常任务
    $scope.showTab = {
        Login: false,
        Fresh:false
    }
    //切换tab
    $scope.changeTab = function (index) {
        $scope.tabIndex = index;
    }
    $scope.taskList = {
        Initiallogin: "",//首次登录
        Novice: "",//新手
        Daily: ""//日常
    }
    //领取积分
    $scope.getIntegral = function (index) { }
    $scope.getCurrentTask = function () {
        $http({
            url: "/Api/UserCenterV2/MyPointFinish",
            method: "POST"
        }).success(function (data) {
            if (data.Success) {
                if (!data.Data.Login) {
                    $scope.showTab.Login = true;
                    $scope.getTaskList(10);//默认进入时获取任务
                }
                if (!data.Data.Fresh) {
                    $scope.showTab.Fresh = true;                    
                }
                if (data.Data.Login && !data.Data.Fresh) {
                     $scope.getTaskList(20);//默认进入时获取任务
                }
                if (data.Data.Login && data.Data.Fresh) {
                    $scope.getTaskList(30);//默认进入时获取任务
                }
            }
        });
    }
    //获取任务
    $scope.getTaskList = function (flag) {
        $http({
            url: "/Api/UserCenterV2/MyPointList",
            data: {
                PointRewardCategory: flag
            },
            method: "POST"
        }).success(function (data) {
            if (data.success) {
                switch ($scope.tabIndex) {
                    case 10:
                        $scope.taskList.Initiallogin = data.rows;
                        break;
                    case 20:
                        $scope.taskList.Novice = data.rows;
                        break;
                    case 30:
                        $scope.taskList.Daily = data.rows;
                        break;
                    default:
                        break;
                }
            } else {
                layer.msg(data.msg);
            }
        });
    }
    $scope.getCurrentTask();    
    //监测tabIndex切换
    $scope.$watch("tabIndex", function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.getTaskList(newVal);
        }
    })
})
//我的评论
.controller("CommentCtrl", function ($scope, $http, $rootScope, $filter) {
    //  console.log('CommentCtrl')
    $rootScope.isOpen.message = true;//是否展开判断
    $rootScope.subNavFlag = 2; //导航是否选择判断
    $scope.commentList = [];  //我的评论列表
    $scope.commentToMeList = [];//评论我的列表
    $scope.isHasNewMsg.MyRecommend = false;
    if ($scope.isHasNewMsg.allCount > 0) {
        $scope.isHasNewMsg.allCount -= 1;
    }
   
    $scope.screenList = {
        IsCommentToMe: "",
        PageNum: 1,
        PageSize:5
    }
    $scope.isShowScreen = false;//是否显示筛选条件
    $scope.screenStr = "全部";
    $scope.path = $rootScope.configPort.staticFile + "/web/Content_/img/emoji/";
    $scope.pageData = {
        total: 0,
        pageTotal: 0,
        pageNum: 1,
        isloading: false,
        hasMore:true
    }
    //获取总条数
    $scope.getTotal = function () {
        $http({
            url: "/Api/UserCenterV2/MyConmmentCount",
            data: { IsCommentToMe: $scope.screenList.IsCommentToMe },
            method: "POST"
        }).success(function (data) {
            if (data.Success) {
                $scope.pageData.total = data.Data;
                $scope.pageData.pageTotal = Math.ceil($scope.pageData.total / $scope.screenList.PageSize);
            } else {
                $scope.pageData.total = 0;
                $scope.pageData.pageTotal = 0;
            }
            $scope.getCommentList();
        });
    }
    $scope.init = function () {
        $scope.commentList = [];
        $scope.screenList.PageNum = 1;
        $scope.pageData.hasMore = true;
        $scope.getCommentList();
    }
    //获取评论列表（$scope.IsCommentToMe：true评论我的，false我评论的）
    $scope.getCommentList = function () {
        //判断现在是否是加载的状态，和是否还有更多
        if (!$scope.pageData.isloading && $scope.pageData.hasMore) {
            $scope.pageData.isloading = true;
        $http({
            url: "/Api/UserCenterV2/MyConmment",
            data: $scope.screenList,
            method: "POST"
        }).success(function (data) {
            $scope.pageData.isloading = false;
            if (data.Success && data.Data && data.Data.length > 0) {
                $scope.pageData.hasMore = true;
                //当前页数小于总数时加一
                $scope.screenList.PageNum += 1;
                angular.forEach(data.Data, function (item) {
                    item.isShow = false;
                    item.contentMore = "";
                    item.isSetEmoji = false;
                    item.committing = false;
                    item.HeadImgUrl = $filter('noHeadImage')(item.HeadImgUrl, $rootScope.configPort.staticFile);
                    item.Content = $filter('emojiFormat')(item.Content, $scope.path);
                    item.BusinessTitle = $filter('linkTopic')(item.BusinessTitle, $rootScope.configPort.party);
                    if (item.Reply.length > 1) {
                        item.showReply = false;
                    } else {
                        item.showReply = true;
                    }
                    if (item.CommentType == "文章") {
                        item.BusinessTitle = "《" + item.BusinessTitle + "》";
                        item.linkUrl = $rootScope.configPort.party + "/Wonderful/ArticleDetail?articleId=" + item.BusinessId;
                    } else if (item.CommentType == "话题") {
                        item.CommentType = "帖子";
                        item.linkUrl = $rootScope.configPort.party + "/HotOpinion/TopicCard?topicId=" + item.BusinessId;
                    } else if (item.CommentType == "活动") {
                        item.linkUrl = $rootScope.configPort.party + "/Activity/Detail?activityId=" + item.BusinessId;
                    }
                    angular.forEach(item.Reply, function (item) {
                        item.isShow = false;
                        item.contentMore = "";
                        item.isSetEmoji = false;
                        item.committing = false;
                        item.ReplyContent = $filter('emojiFormat')(item.ReplyContent, $scope.path);
                    })
                });
                if ($scope.commentList.length < 1) {
                    $scope.commentList = data.Data;
                } else {
                    $scope.commentList = $scope.commentList.concat(data.Data);
                }
            } else {
                //没有更多了
                $scope.pageData.hasMore = false;
            }
        });
        }
    }
    //获取我对被人的评论列表（我的评论）
    //$scope.getTotal();
    //点击展开全部回复
    $scope.showReply = function (index) {
        $scope.commentList[index].showReply = !$scope.commentList[index].showReply;
    }
    //回复收起输入框显示，index当前显示的是那一个，parentIndex如果传了表示是第二层回复的回复，没传就是第一层评论的回复
    $scope.sendComment = function (index, parentIndex) {
        var sendScreen = {//回复的参数
            CommentTypeEnum: "",
            CommentId: "",
            ReplyContent: "",
            PlatformFrom: "Pc",
            ParentReplyId:""
        }
            if (parentIndex != undefined) {
                switch ($scope.commentList[parentIndex].CommentType) {
                    case "帖子": sendScreen.CommentTypeEnum = "Topic"
                        break;
                    case "活动": sendScreen.CommentTypeEnum = "Activity"
                        break;
                    case "文章": sendScreen.CommentTypeEnum = "Article"
                        break;
                    default:
                        break;
                }
                sendScreen.CommentId = $scope.commentList[parentIndex].CommentId;
                sendScreen.ReplyContent = $scope.commentList[parentIndex].Reply[index].contentMore;
                sendScreen.ParentReplyId = $scope.commentList[parentIndex].Reply[index].ReplyId;
                if($scope.commentList[parentIndex].Reply[index].committing){
                    return false;
                }
                if (sendScreen.ReplyContent == "") {
                    layer.msg("请输入内容");
                    return false;
                }
                $scope.commentList[parentIndex].Reply[index].committing = true;
            } else {
                switch ($scope.commentList[index].CommentType) {
                    case "帖子": sendScreen.CommentTypeEnum = "Topic"
                        break;
                    case "活动": sendScreen.CommentTypeEnum = "Activity"
                        break;
                    case "文章": sendScreen.CommentTypeEnum = "Article"
                        break;
                    default:
                        break;
                }
                sendScreen.CommentId = $scope.commentList[index].CommentId;
                sendScreen.ReplyContent = $scope.commentList[index].contentMore;
                if($scope.commentList[index].committing){
                    return false;
                }
                if (sendScreen.ReplyContent == "") {
                    layer.msg("请输入内容");
                    return false;
                }
                $scope.commentList[index].committing = true;
            }
        $http({
            url: "/api/home/AddCommentReply",
            data: sendScreen,
            method:"POST"
        }).success(function (data) {
            if (data.Success) {
                data.Data.ReplyContent = $filter('emojiFormat')(data.Data.ReplyContent, $scope.path);
                var replyData = [{
                    CreateDate: "刚刚",
                    FromNickName: "我",
                    ReplyContent: data.Data.ReplyContent,
                    ReplyId: data.Data.ReplyId,
                    ThumbsUps: 0,
                    ToNickName:""
                }]
                if (parentIndex != undefined) {
                    $scope.commentList[parentIndex].Reply[index].contentMore = "";
                    $scope.commentList[parentIndex].Reply[index].isShow = false;
                    replyData.ToNickName = $scope.commentList[parentIndex].Reply[index].FromNickName;
                    $scope.commentList[parentIndex].Reply = replyData.concat($scope.commentList[parentIndex].Reply);
                } else {
                    $scope.commentList[index].contentMore = "";
                    $scope.commentList[index].isShow = false;
                    replyData.ToNickName = $scope.commentList[index].NickName;
                    $scope.commentList[index].Reply = replyData.concat($scope.commentList[index].Reply);
                }
               // console.log($scope.commentList);
            } else {
                layer.msg(data.Message)
            }
            if (parentIndex != undefined) {
                $scope.commentList[parentIndex].Reply[index].committing = false;
            } else {
                $scope.commentList[index].committing = false;
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
    //点赞 和 取消点赞
    $scope.thumbsUp = function (index, parentIndex,IsThumbsUp) {
    	debugger
        var guestUserCookieValue = $.cookie(guestUserCookieName);
        var ThumbupType = "";//0:话题 1:话题评论 2:活动评论 3:精选问题答案 4.直播评论 5.文章点赞 6.文章评论点赞
        switch ($scope.commentList[parentIndex].CommentType) {
            case "话题": ThumbupType = 1;//
                break;
            case "活动": ThumbupType = 2;//
                break;
            case "文章": ThumbupType = 6;//
                break;
            default:
                break;
        }
        if(!IsThumbsUp){
	        $.ajax({ //点赞
	            url: $rootScope.configPort.party + '/Api/Activity/AddCommentThumbUp',
	            type: 'POST', //GET
	            async: true,    //或false,是否异步
	            data: { ThumbupType: ThumbupType, RelationId: $scope.commentList[parentIndex].Reply[index].ReplyId, IsRecommentReply: true, GuestUser: guestUserCookieValue },
	            dataType: 'jsonp',    //返回的数据格式：json/xml/html/script/jsonp/text
	            jsonp: 'jsonpCallback',
	            success: function (data) {
	                if (data.Success) {
	                    layer.msg("点赞成功");
	                    $scope.commentList[parentIndex].Reply[index].ThumbsUps += 1;
	                    $scope.commentList[parentIndex].Reply[index].IsThumbsUp = true;
	                    $scope.$apply();
	                } else {                   
	                    layer.msg(data.Message);
	                }
	            }
	        })
	    }else{
	    	$.ajax({ //取消点赞
	            url: $rootScope.configPort.party + '/Api/Activity/CancelCommentThumbUp',
	            type: 'POST', //GET
	            async: true,    //或false,是否异步
	            data: { ThumbupType: ThumbupType, RelationId: $scope.commentList[parentIndex].Reply[index].ReplyId, IsRecommentReply: true, GuestUser: guestUserCookieValue },
	            dataType: 'jsonp',    //返回的数据格式：json/xml/html/script/jsonp/text
	            jsonp: 'jsonpCallback',
	            success: function (data) {
	                if (data.Success) {
	                    layer.msg("取消点赞成功");
	                    $scope.commentList[parentIndex].Reply[index].ThumbsUps -= 1;
	                    $scope.commentList[parentIndex].Reply[index].IsThumbsUp = false;
	                    $scope.$apply();
	                } else {                   
	                    layer.msg(data.Message);
	                }
	            }
	        })
	    }
    }
    ////检测值得变化
    //$scope.$watch("screenList.IsCommentToMe", function (newVal, oldVal) {
    //    if (newVal !== oldVal) {
    //        $scope.commentList = [];
    //        if ($scope.screenList.PageNum == 1) {
    //            $scope.getCommentList();
    //        } else {
    //            $scope.screenList.PageNum = 1;
    //        }        
    //    }
    //});
    ////分页值检测
    //$scope.$watch("screenList.PageNum", function (newVal, oldVal) {
    //    if (newVal != oldVal) {
    //        $scope.getCommentList();
    //    }
    //});
})
//我的私信
.controller("PrivateMsgCtrl", function ($scope, $http, $rootScope, $filter,$timeout) {
    //console.log('PrivateMsgCtrl')
    $rootScope.isOpen.message = true;//是否展开判断
    $rootScope.subNavFlag = 3; //导航是否选择判断      
    $scope.MessageList = [];//私信列表
    $scope.dialogList = [];//私信详细对话列表
    $scope.dialogIndex = "";//打开对话的index
    $scope.dialogNickName = "";//打开对话的人的名称
    $scope.reply_message = "";//回复的内容
    $scope.path = $rootScope.configPort.staticFile + "/web/Content_/img/emoji/";
    $scope.pageData = {
        isloading: false,
        pageNum: 1,
        hasMore: true,
        detailPageNum: 1,
        detailMore: true,
        isloadDetail:false
    }
    //获取私信列表
    $scope.getMessageList = function () {
        if (!$scope.pageData.isloading && $scope.pageData.hasMore) {
            $scope.pageData.isloading = true;      
        $http({
            url: "/Api/usercenter/MyLetterList",
            method: "POST",
            data: { PageNum: $scope.pageData.pageNum, PageSize: 6 }
        }).success(function (data) {
            $scope.pageData.isloading = false;
            if (data.success && data.rows.length > 0) {
                if ($scope.pageData.pageNum < data.pageTotal) {
                    $scope.pageData.pageNum += 1;
                } else {
                    $scope.pageData.hasMore = false;
                }
                    angular.forEach(data.rows, function (item) {
                        item.Content = $filter('emojiFormat')(item.Content, $scope.path);
                    });
                    $scope.MessageList = data.rows;
                
            } else {
                $scope.pageData.hasMore = false;
            }
        });
        }
    }
    //删除私信
    $scope.delMessage = function (index) {
        $http({
            url: "/Api/usercenter/DelLetter",
            method: "POST",
            data: { LetterId: $scope.MessageList[index].LetterId }
        }).success(function (data) {
            if (data.Success) {
                layer.msg("删除成功");
                $scope.MessageList.splice(index, 1);
            } else {
                layer.msg(data.Message)
            }
        });
    }
    //获取私信详情回复内容
    $scope.getDialogList = function () {
        if (!$scope.pageData.isloadDetail && $scope.pageData.detailMore && $scope.dialogIndex!=="") {
            $scope.pageData.isloadDetail = true;     
        $http({
            url: "/Api/usercenter/MyLetterDetailList",
            data: { LetterId: $scope.MessageList[$scope.dialogIndex].LetterId, PageNum: $scope.pageData.detailPageNum, PageSize: 5 },
            method: "POST"
        }).success(function (data) {
            $scope.pageData.isloadDetail = false;
            if (data.success && data.rows.length > 0) {
                if ($scope.pageData.detailPageNum < data.pageTotal) {
                    $scope.pageData.detailPageNum += 1;
                } else {
                    $scope.pageData.detailMore = false;       
                }
                angular.forEach(data.rows, function (item) {
                    item.Content = $filter('emojiFormat')(item.Content, $scope.path);
                });
                if ($scope.dialogList.length > 0) {
                    $scope.dialogList = data.rows.concat($scope.dialogList);
                } else {
                    $scope.dialogList = data.rows;
                    $timeout(function(){
                        $(".message-cont").mCustomScrollbar("scrollTo", "bottom");
                    },100)
                    
                }
            } else {
                $scope.pageData.detailMore = false;
            }
        });
        }
    }

    //打开回复弹框，设置查看回复内容的indeed
    $scope.replyMessage = function (index) {
        $scope.pageData.detailMore = true;
        $scope.pageData.detailPageNum = 1;
        $scope.dialogIndex = index;//设置打开对话的index
        if ($scope.MessageList[index].SenderClientId != $scope.UserInfo.ClientId) {
            $scope.dialogNickName = $scope.MessageList[index].SenderNickName;//设置打开对话的名字
        } else {
            $scope.dialogNickName = $scope.MessageList[index].ReceiverNickName;//设置打开对话的名字
        }      
        $scope.dialogList = [];//重置详情对话列表
        $scope.getDialogList(1);
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#messageDialog')
        });
    }
    $scope.sendMessage = function () {
        if ($scope.reply_message == "" || $scope.reply_message == null) {
            layer.msg("请输入回复内容");
            return false;
        }
        var ReceiverClientId = $scope.MessageList[$scope.dialogIndex].SenderClientId != $scope.UserInfo.ClientId ? $scope.MessageList[$scope.dialogIndex].SenderClientId : $scope.MessageList[$scope.dialogIndex].ReceiverClientId;
        $http({
            url: "/Api/usercenter/AddLetter",
            data: {
                ReceiverClientId: ReceiverClientId,
                Content: $scope.reply_message
            },
            method: "POST"
        }).success(function (data) {
            if (data.Success) {
                layer.msg("回复成功");
                var addMessage = [{
                    SenderHeadImgUrl: $scope.UserInfo.HeadImgUrl,
                    NickName: $scope.UserInfo.NickName,
                    Content: $scope.reply_message,
                    SenderClientId: $scope.UserInfo.ClientId,
                    CreateDate: data.Data.replace("/","-")
                }]               
                $scope.dialogList = $scope.dialogList.concat(addMessage);
                $scope.reply_message = "";
                $timeout(function () {
                    $(".message-cont").mCustomScrollbar("scrollTo", "bottom");
                }, 100)
            } else {
                layer.msg(data.Message)
            }
        });
    }
})
//系统消息
.controller("SystemCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.message = true;//是否展开判断 
    $rootScope.subNavFlag = 1; //导航是否选择判断
    $scope.isHasNewMsg.SysMessage = false;
    if ($scope.isHasNewMsg.allCount > 0) {
        $scope.isHasNewMsg.allCount -= 1;
    }
    $scope.systemList = [];
    $scope.pageData = {
        total: 0,
        pageTotal: 0,
        pageNum: 1,
        isloading: false,
        hasMore: true,
    }
    //获取系统列表
    $scope.getSystemList = function () {
        //判断现在是否是加载的状态，和是否还有更多
        if (!$scope.pageData.isloading && $scope.pageData.hasMore) {
            $scope.pageData.isloading = true;
            $http({
                url: "/Api/UserCenterV2/SysMessage",
                data: {
                    PageNum: $scope.pageData.pageNum,
                    PageSize:5
                },
                method: "POST"
            }).success(function (data) {
                //      	console.log(data);
                //      	$scope.systemList = data.rows;
                $scope.pageData.isloading = false;
                if (data.success && data.rows.length > 0) {
                    if ($scope.pageData.pageNum < data.pageTotal) {
                        $scope.pageData.pageNum += 1;
                    } else {
                        $scope.pageData.hasMore = false;
                    }
                    if ($scope.systemList.length > 0 && $scope.pageData.pageNum > 1) {
                        $scope.systemList = $scope.systemList.concat(data.rows);
                    } else {
                        $scope.systemList = data.rows;
                    }
                } else {
                    $scope.pageData.hasMore = false;
                    //显示没有更多了，或者是到底部了
                }
            });
        }
    }
    $scope.getSystemList();
})
//我的问答
.controller("AnswersCtrl", function ($scope, $http, $rootScope, $filter, $timeout) {
    $rootScope.isOpen.message = true;//是否展开判断
    $rootScope.subNavFlag = 4; //导航是否选择判断
    $scope.myQuestionList = [];//我的提问列表
    $scope.myAnswerList = [];//我的回答列表
    $scope.myListenList = [];//我的偷听列表
    $scope.tabShowIndex = 1;//tab切换脚标
    $scope.isShowScreen = false;//是否显示筛选条件
    $scope.screenStr = "全部";
    $scope.complaintContent = "";//投诉内容
    $scope.isHasNewMsg.MyQuestion = false;
    if ($scope.isHasNewMsg.allCount > 0) {
        $scope.isHasNewMsg.allCount -= 1;
    }
    $scope.dialogShowData = {
        recordStart: false,//录音弹框
        complaintSuccess: false,//投诉成功
        selectId: "",//投诉ID
        ComplaintType: "",//投诉类型
        show_id: "",//现在显示的弹框id
        audioLength: 0,//录音长度,
        index:-1
    }
    $scope.AnswerPayStatus = "";//筛选条件状态 1：未支付，2：已支付，3：已回答，4：已拒绝,5:已撤销
    $scope.pageData = {
        pageNum: 1,
        isloading: false,
        questionMore: true,
        listenMore: true,
        answerMore:true
    }
    $scope.setTabShow = function (flag) {//设置tab切换
        $scope.tabShowIndex = flag;                    
        $scope.AnswerPayStatus = "";
        $scope.screenStr = "全部";
        $scope.pageData.pageNum = 1;
            switch ($scope.tabShowIndex) {
                case 1:
                    $scope.myQuestionList = [];//我的提问列表
                    $scope.pageData.questionMore = true;
                    $scope.getMyQuestion();
                    break;
                case 2:
                    $scope.myAnswerList = [];//我的回答列表
                    $scope.pageData.answerMore = true;
                    $scope.getAnswer();
                    break;
                case 3:
                    $scope.myListenList = [];//我的偷听列表  
                    $scope.pageData.listenMore = true;
                    $scope.getListen();
                    break;
                default:
                    break;
            }           
    }
    //获取我的提问列表
    $scope.getMyQuestion = function () {
        if (!$scope.pageData.isloading && $scope.pageData.questionMore) {
            $scope.pageData.isloading = true;
        $http({
            url: "/Api/UserCenterV2/MyQuestionList",
            data: {
                PageNum: $scope.pageData.pageNum,
                PageSize: 5,
                AnswerPayStatus: $scope.AnswerPayStatus
            },
            method: "POST"
        }).success(function (data) {
            $scope.pageData.isloading = false;
            if (data.success && data.rows.length > 0) {                
                if ($scope.pageData.pageNum < data.pageTotal) {
                    $scope.pageData.pageNum += 1;
                } else {
                    $scope.pageData.questionMore = false;
                }
                angular.forEach(data.rows, function (item) {
                    item.HeadImgUrl = $filter('noHeadImage')(item.HeadImgUrl, $rootScope.configPort.staticFile);
                });
                if ($scope.myQuestionList.length > 0) {                    
                    $scope.myQuestionList = $scope.myQuestionList.concat(data.rows);
                } else {
                    $scope.myQuestionList = data.rows;
                }
            } else {
                //显示没有跟多了
                $scope.pageData.questionMore = false;
            }
        });
        }
    }
    //获取我的回答列表
    $scope.getAnswer = function () {
        if (!$scope.pageData.isloading && $scope.pageData.answerMore) {
            $scope.pageData.isloading = true;
        $http({
            url: "/Api/UserCenterV2/MyAnswerList",
            data: {
                PageNum: $scope.pageData.pageNum,
                PageSize: 5,
                AnswerPayStatus: $scope.AnswerPayStatus
            },
            method: "POST"
        }).success(function (data) {
            $scope.pageData.isloading = false;
            if (data.success && data.rows.length > 0) {
                if ($scope.pageData.pageNum < data.pageTotal) {
                    $scope.pageData.pageNum += 1;
                } else {
                    $scope.pageData.answerMore = false;
                }
                angular.forEach(data.rows, function (item) {
                    item.QuestionImaUrl = $filter('noHeadImage')(item.QuestionImaUrl, $rootScope.configPort.staticFile);
                });
                if ($scope.myAnswerList.length > 0) {
                    $scope.myAnswerList = $scope.myAnswerList.concat(data.rows);
                } else {
                    $scope.myAnswerList = data.rows;
                }
            } else {
                //显示没有跟多了
                $scope.pageData.answerMore = false;
            }
        });
        }
    }
    //获取我的偷听列表
    $scope.getListen = function () {
        if (!$scope.pageData.isloading && $scope.pageData.listenMore) {
            $scope.pageData.isloading = true;
            $http({
                url: "/Api/UserCenterV2/MyListenList",
                data: {
                    PageNum: $scope.pageData.pageNum,
                    PageSize: 5,
                    AnswerPayStatus: $scope.AnswerPayStatus
                },
                method: "POST"
            }).success(function (data) {
                $scope.pageData.isloading = false;
                if (data.success && data.rows.length > 0) {
                    if ($scope.pageData.pageNum < data.pageTotal) {
                        $scope.pageData.pageNum += 1;
                    } else {
                        $scope.pageData.listenMore = false;
                    }
                    angular.forEach(data.rows, function (item) {
                        item.HeadImgUrl = $filter('noHeadImage')(item.HeadImgUrl, $rootScope.configPort.staticFile);
                    });
                    if ($scope.myListenList.length > 0) {
                        $scope.myListenList = $scope.myListenList.concat(data.rows);
                    } else {
                        $scope.myListenList = data.rows;
                    }
                } else {
                    //显示没有跟多了
                    $scope.pageData.listenMore = false;
                }
            });
        }
    }
    //滚动条到底部事件
    $scope.getMore = function () {
        switch ($scope.tabShowIndex) {
            case 1:
                $scope.getMyQuestion();
                break;
            case 2:
                $scope.getAnswer();
                break;
            case 3:
                $scope.getListen();
                break;
            default:
                break;
        }
    }
    //显示弹框
    $scope.dialogShow = function (flag, complaintType, id,index) {
        $scope.dialogShowData.ComplaintType = complaintType;       
        $scope.dialogShowData.complaintSuccess = false;
        if (flag == 1) {//投诉
            $scope.dialogShowData.show_id = "complaint_dialog";
            $scope.dialogShowData.selectId = id;
        } else if (flag == 2) {//录音
            if (_msg) {
                layer.msg(_msg);
                return false;
            }
            if (index) {
                $scope.dialogShowData.index = index;
            }
            $scope.dialogShowData.show_id = "record_dialog";
            $scope.dialogShowData.selectId = id;

        } else {//录音预览
            $scope.dialogShowData.show_id = "answer_dialog";
        }
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $("#" + $scope.dialogShowData.show_id)
        });
    }
    //复写关闭弹框
    $scope.closePopWindow = function () {
        if ($scope.dialogShowData.show_id == "record_dialog") {
            stopRecord(true);
        }
        layer.closeAll();
    }
    //投诉提交
    $scope.complaint = function () {
        if ($scope.complaintContent == "") {
            layer.msg("请输入内容！");
            return false;
        }
        $http({
            url: "/Api/UserCenterV2/Complaint",
            data: {
                ComplaintType: $scope.dialogShowData.ComplaintType,
                BusinessId: $scope.dialogShowData.selectId,
                ComplaintContent: $scope.complaintContent
            },
            method: "POST"
        }).success(function (data) {
            if (data.Success) {
                $scope.complaintContent = "";
                $scope.dialogShowData.selectId = "";
                $scope.dialogShowData.complaintSuccess = true;
            } else {
                layer.msg(data.Message);
            }
        });
    }
    $scope.isubmit = false;
    //提交回答
    $scope.myAnswer = function (answerUrl) {       
        $.ajax({
            url: $rootScope.configPort.party + "/Api/Biggie/AnsWerBiggie",
            data: {
                questionId: $scope.dialogShowData.selectId,
                AnswerUrl: answerUrl,
                answerLength: audioLength,
            },
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function (data) {               
                if (data.Success) {
                    layer.msg('发送成功');
                    if ($scope.dialogShowData.index > -1) {
                        $scope.myAnswerList[$scope.dialogShowData.index].AnswerPayStatus = 3;
                        $scope.myAnswerList[$scope.dialogShowData.index].AnswerUrl = answerUrl;
                        $scope.myAnswerList[$scope.dialogShowData.index].AnswerLength = audioLength;
                        $scope.$apply();
                    }
                } else {
                    layer.msg(data.Message);
                }
                layer.closeAll();
                $scope.isubmit = false;
            }
        });
    }
    //发送回答
    $scope.sendRecord = function () {
        if ($scope.isubmit != true) {
            $scope.isubmit = true;
            var formData = new FormData();
            formData.append('directoryName', 'club/driveranswer');
            //var audio = document.getElementById('audio');
            //var src = audio.src + '.mp3';
            var blob = new Blob([_blob], { type: "audio/mp3" });
            formData.append('uploud', blob, "file_" + Date.parse(new Date()) + ".mp3")
            $.ajax({
                url: '/Common/UploadStaticFile',
                type: 'post',
                headers: {
                    accept: '*/*'
                },
                processData: false,
                contentType: false,
                data: formData,
                dataType: 'json',
                success: function (data) {
                    if (data.Success) {
                        $scope.myAnswer(data.Data[0]);
                    }
                }
            })
        }        
    }
    //重录
    $scope.resetRecord = function () {
        layer.closeAll();
        $scope.dialogShowData.recordStart = false;
        $scope.dialogShowData.show_id = "record_dialog";
        //关闭弹框的时间
        $timeout(function () {
            layer.open({
                type: 1,
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true,//开启遮罩关闭
                move: false, //禁止拖拽
                content: $("#" + $scope.dialogShowData.show_id)
            });
        },200)
        
    }
    //撤销提问
    $scope.revoke = function (id, index) {
        $.ajax({
            url: '/Api/UserCenterV2/CancelQuestion',
            type: 'post',
            data: {
                questionId: id,
                clientPlatformFrom: "Pc"
            },
            success: function (data) {
                if (data.Success) {
                    $scope.myQuestionList[index].AnswerPayStatus = 5;
                    $scope.$apply();
                }
            }
        })
    }
    //拒绝回答
    $scope.refuse = function (id, index) {
        $.ajax({
            url: '/Api/UserCenterV2/RefuseAnswer',
            type: 'post',
            data: {
                questionId: id,
                clientPlatformFrom: "Pc"
            },
            success: function (data) {
                if (data.Success) {
                    $scope.myAnswerList[index].AnswerPayStatus = 4;
                    $scope.$apply();
                }
            }
        })
    }
    //检测值得变化
    $scope.$watch('AnswerPayStatus', function (newVal,oldVal) {
        if (newVal !== oldVal) {
            $scope.myQuestionList = [];//我的提问列表
            $scope.myAnswerList = [];//我的回答列表
            $scope.myListenList = [];//我的偷听列表
            $scope.pageData.pageNum = 1;
            switch ($scope.tabShowIndex) {
                case 1:
                    $scope.myQuestionList = [];//我的提问列表
                    $scope.pageData.questionMore = true;
                    $scope.getMyQuestion();
                    break;
                case 2:
                    $scope.myAnswerList = [];//我的回答列表
                    $scope.pageData.answerMore = true;
                    $scope.getAnswer();
                    break;
                case 3:
                    $scope.myListenList = [];//我的偷听列表  
                    $scope.pageData.listenMore = true;
                    $scope.getListen();
                    break;
                default:
                    break;
            }
        }
    });
})
//我的关注
.controller("FollowCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.message = true;//是否展开判断
    $rootScope.subNavFlag = 5; //导航是否选择判断
    $scope.tabShowIndex = 1;//显示导航脚标
    $scope.followList = [];//我的关注列表
    $scope.fansList = [];//我的粉丝列表
    $scope.followedClientId = "";//发送私信的用户ID
    $scope.writeMessage = "";//私信的内容
    $scope.isHasNewMsg.MyFollow = false;
    if ($scope.isHasNewMsg.allCount > 0) {
        $scope.isHasNewMsg.allCount -= 1;
    }
    //取消关注的参数
    $scope.cancel = {
        followedClientId: "",
        index: "",
        type: ""
    }
    //设置tab切换显示1是我的关注，2是我的粉丝
    $scope.setTabShow = function (flag) {
        $scope.tabShowIndex = flag;
        //当页数是1时，加载粉丝数据
        if($scope.tabShowIndex==1){//应该关注，粉丝两个列表操作会相互影响数据，所有每次点击更新列表
        	$scope.pageData.followPageNum = 1;
        	$scope.pageData.followMore = true;
        	$scope.getFollowList()
        }
        if($scope.tabShowIndex==2) {
        	$scope.pageData.fansPageNum = 1;
        	$scope.pageData.fansMore = true;
            $scope.getFansList();
        }
    }
    $scope.pageData = {
        isloading: false,
        followMore: true,
        fansMore: true,
        followPageNum: 1,
        fansPageNum:1
    }
    //获取关注大咖列表
    $scope.getFollowList = function () {
        if (!$scope.pageData.isloading && $scope.pageData.followMore) {
            $scope.pageData.isloading = true;
            $http({
                url: "/Api/UserCenterV2/MyFollower",
                method: "POST",
                data: { PageNum: $scope.pageData.followPageNum, PageSize: 6}
            }).success(function (data) {
                $scope.pageData.isloading = false;
                if (data.success && data.rows.length > 0) { 
                	angular.forEach(data.rows,function(item){
                		item.HeadImgUrl = $filter('noHeadImage')(item.HeadImgUrl,$rootScope.configPort.staticFile)
                	})	
                    if ($scope.pageData.followPageNum < data.pageTotal) {
                        $scope.pageData.followPageNum += 1;
                    } else {
                        $scope.pageData.followMore = false;
                    }
                    if ($scope.followList.length > 0 && $scope.pageData.followPageNum >1) {
                        $scope.followList = $scope.followList.concat(data.rows);
                    } else {
                        $scope.followList = data.rows;
                    }
                } else {
                    $scope.pageData.followMore = false;
                    //显示没有更多了，或者是到底部了
                }
            })
        }
    }
    //获取粉丝列表
    $scope.getFansList = function () {
        if (!$scope.pageData.isloading && $scope.pageData.fansMore) {
            $scope.pageData.isloading = true;
        $http({
            url: "/Api/UserCenterV2/MyFans",
            method: "POST",
                data: { PageNum: $scope.pageData.fansPageNum, PageSize: 6 }
        }).success(function (data) {
            $scope.pageData.isloading = false;
            if (data.success && data.rows.length > 0) {
            	angular.forEach(data.rows,function(item){
            		item.HeadImgUrl = $filter('noHeadImage')(item.HeadImgUrl,$rootScope.configPort.staticFile)
            	})	
                if ($scope.pageData.fansPageNum < data.pageTotal) {
                    $scope.pageData.fansPageNum += 1;
                } else {
                    $scope.pageData.fansMore = false;
                }
                if ($scope.fansList.length > 0 && $scope.pageData.fansPageNum >1) {
                    $scope.fansList = $scope.fansList.concat(data.rows);
                } else {
                    $scope.fansList = data.rows;
                }
            } else {
                $scope.pageData.fansMore = false;
                //显示没有更多了，或者是到底部了
            }
        })
        }
    }
    $scope.getFollowList();
  //获取更多
    $scope.getMore = function () {
        if ($scope.tabShowIndex == 1) {
            $scope.getFollowList();
        } else {
            $scope.getFansList();
        }
    }
    //打开写私信弹框
    $scope.openMessage = function (followedClientId) {
        $scope.followedClientId = followedClientId;
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#private_Letter')
        });
    }
    //关注她（他）
    $scope.followTa = function (followedClientId, index) {
        $.ajax({
            url: $rootScope.configPort.party + '/Api/Activity/Collection',
            type: 'POST', //GET
            data: { 'CollectType': 5, RelationId: followedClientId },
            dataType: 'jsonp',    //返回的数据格式：json/xml/html/script/jsonp/text
            jsonp: 'jsonpCallback',
            success: function (data) {
                if (data.IsSuccess) {
                    layer.msg("关注成功");
                    //关注成功后设置列表中的是否关注字段为true
                    $scope.fansList[index].IsFollowed = true;
                    $scope.fansList[index].FansCount += 1;
                    $scope.getUserInfo(); //更新头部关注数字
                    $scope.$apply();
                } else {
                    layer.msg(data.Message);
                }
            }
        });
    }
    //取消关注二次确认
    $scope.cancelConfrim = function (followedClientId, index, type) {
        $scope.cancel.followedClientId = followedClientId;
        $scope.cancel.index = index;
        $scope.cancel.type = type;
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#confrim_dialog')
        });
    }
    //取消关注，参数：取消关注ID，所在列表脚标，类型1为我的关注中的取消，2为我的粉丝中的取消，两个成功之后执行的方法不同，因此用作区分
    $scope.unFollowTa = function () {
        $.ajax({
            url: $rootScope.configPort.party + '/Api/Activity/UnCollection',
            type: 'POST', //GET
            data: { 'CollectType': 5, RelationId: $scope.cancel.followedClientId },
            dataType: 'jsonp',    //返回的数据格式：json/xml/html/script/jsonp/text
            jsonp: 'jsonpCallback',
            success: function (data) {
                if (data.Success) {
                    layer.msg("取消关注");
                    //取消关注成功后在列表中删除该条记录
                    if ($scope.cancel.type == 1) {
                        $scope.followList.splice($scope.cancel.index, 1);//删除列表中的该条记录
                        for (var i = 0; i < $scope.fansList.length; i++) {
                            if ($scope.fansList[i].ClientId == $scope.cancel.followedClientId && $scope.fansList[i].IsFollowed == true) {
                                $scope.fansList[i].IsFollowed = false;
                                $scope.fansList[$scope.cancel.index].FansCount -= 1;
                                break;//跳出循环
                            }
                        }
                    } else {
                        $scope.fansList[$scope.cancel.index].IsFollowed = false;
                        $scope.fansList[$scope.cancel.index].FansCount -= 1;
                       // $rootScope.UserInfo.FollowerCount -= 1;
                    }                 
                    $scope.getUserInfo(); //更新头部关注数字
                    $scope.closePopWindow();
                    $scope.$apply();
                } else {
                    layer.msg(data.Message);
                }
            }
        });
    }
})
//我的订阅
.controller("SubscribeCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.collection = true;//是否展开判断
    $rootScope.subNavFlag = 8; //导航是否选择判断    
    $scope.subscribeList = [];//订阅列表
    $scope.columnList = [];//栏目列表
    $scope.cateColumnList = [];//栏目分类列表
    $scope.isHasNewMsg.collectAll = false;//新消息取消
    $scope.isHasNewMsg.MySubscribe = false;//新消息取消
    $scope.cateData = {//分类筛选数据
        cateType: 0,//0是栏目，1是话题
        subCateId: "",//栏目下的（所订阅的）子分类
        isShowSub:false //是否显示栏目下的下拉框选项
    }
    //取消订阅话题的参数
    $scope.cancel = {
        index: "",
        id:""
    }
    $scope.pageData = {
        isloading: false,
        pageNum: 1,
        hasMore: true,
        columnPageNum:1,
        columnhasMore: true,
        isFristGet:true
    }
    //获取我订阅的栏目列表
    //$.ajax({
    //    url: "/Api/UserCenterV2/MySubscribeArticle",
    //    type: "post",
    //    async: true,
    //}).success(function (data) {
    //    if (data.success) {
    //        $scope.cateColumnList = data.rows;
    //        $scope.cateData.subCateId = data.rows[0].RelationId;
    //      //  $scope.getColumnList();
    //    }
    //});
    //获取我订阅的话题列表
    $scope.getSubscribeList = function () {
        if (!$scope.pageData.isloading && $scope.pageData.hasMore) {
            $scope.pageData.isloading = true;
        $http({
            url: "/Api/UserCenterV2/MyQueryCollectFollow",
            data: {
                CollectType: 3,
                PageNum: $scope.pageData.pageNum,
                PageSize:5
            },
            method:"POST"
        }).success(function (data) {
            $scope.pageData.isloading = false;
            if (data.success && data.rows && data.rows.length > 0) {
            	
                if ($scope.pageData.pageNum < data.pageTotal) {
                    $scope.pageData.pageNum += 1;
                } else {
                $scope.pageData.hasMore = false;
                }
                angular.forEach(data.rows, function (item) {
                    item.HeadImgUrl = $filter('noHeadImage')(item.HeadImgUrl, $rootScope.configPort.staticFile);
                    item.TopicContent = item.TopicContent.replace(/\<a tipId='/g, "<em class='font-orange' tipId='");
                    item.TopicContent = item.TopicContent.replace(/\<\/a>/g, "</em>");
                    item.TopicContent = $filter('fontLength')(item.TopicContent, 230);
                    angular.forEach(item.ImgList, function (_itm) {
                        if (_itm.WidthHeightRatio > 1) {
                            _itm.imgStyle = {
                                "background": "url(" + _itm.FileUrl + ") no-repeat center",
                                "background-size":"auto 100%"
                            }
                        } else {
                            _itm.imgStyle = {
                                "background": "url(" + _itm.FileUrl + ") no-repeat center",
                                "background-size": "100% auto"
                            }
                        }
                    })
                })
                if ($scope.subscribeList.length > 0) {
                    $scope.subscribeList = $scope.subscribeList.concat(data.rows);
                } else {
                    $scope.subscribeList = data.rows;
                }
            } else {
                $scope.pageData.hasMore = false;
            }
        })
        }
    }
   // $scope.getSubscribeList();
   //获取我订阅的栏目的文章列表
    $scope.getColumnList = function () {
        if (!$scope.pageData.isloading && $scope.pageData.columnhasMore) {
            //if (!$scope.pageData.isFristGet) {//判断是否是第一次加载
            //    $scope.pageData.isloading = true;                
            //} else {
            //    $scope.pageData.isFristGet = false;
            //}
            $scope.pageData.isloading = true;
            $.ajax({
                url: "/Api/UserCenterV2/MyQueryCollectFollow",
                data: {
                    CollectType: 7,
                    SubscribeArticle: $scope.cateData.subCateId,
                    pageNum: $scope.pageData.columnPageNum,
                    PageSize: 12
                },
                success: function (data) {
                    $scope.pageData.isloading = false;                    
                    if (data.success && data.rows && data.rows.length > 0) {

                        if ($scope.pageData.columnPageNum < data.pageTotal) {
                            $scope.pageData.columnPageNum += 1;
                        } else {
                            $scope.pageData.columnhasMore = false;
                        }
                        if ($scope.columnList.length > 0) {
                            $scope.columnList = $scope.columnList.concat(data.rows);
                        } else {
                            $scope.columnList = data.rows;
                        }
                    } else {
                        $scope.pageData.columnhasMore = false;
                    }
                    $scope.$apply();
                   
                }
            });
        }
    }
    $scope.getColumnList();

    $scope.cancelConfrim = function (index, id) {
        $scope.cancel.index = index;
        $scope.cancel.id = id;
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#confrim_dialog')
        });
    }
    //取消订阅
    $scope.cancelCollection = function () {       
        $.ajax({
            url: $rootScope.configPort.party + '/Api/Activity/UnCollection',
            async: true,
            data: { CollectType: 3, RelationId: $scope.cancel.id },
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function (data) {
                if (data.Success) {
                    layer.msg("取消订阅");
//                  $scope.subscribeList.splice(index, 1);
                    $scope.subscribeList[$scope.cancel.index].IsFollow = false;
                    $scope.closePopWindow();
                    $scope.$apply();
                } else {
                    layer.msg(data.Message);
                }
            }
        })
    }
    //订阅
    $scope.goCollection = function (index, id) {
        $.ajax({
            url: $rootScope.configPort.party + '/Api/Activity/Collection',
            async: true,
            data: { CollectType: 3, RelationId: id },
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function (data) {
                if (data.IsSuccess) {
                    layer.msg("订阅成功");
					$scope.subscribeList[index].IsFollow = true;
                    $scope.$apply();
                } else {
                    layer.msg(data.Message);
                }
            }
        })
    }
    //切换分类显示
    $scope.toggleTabMeau = function (type) {
        $scope.cateData.cateType = type;
        $scope.isHasNewMsg.MySubscribeTip = false;//新消息取消
        //$scope.cateData.isShowSub = false;
        //if (index!=undefined) {
        //    $scope.cateData.subCateId = $scope.cateColumnList[index].RelationId;
        //    $scope.pageData.columnhasMore = true;
        //    $scope.columnList = [];
        //    $scope.getColumnList();
        //}
        $scope.getSubscribeList();
    }
    //页面滚动获取更多的方法
    $scope.getMore = function () {
        if ($scope.cateData.cateType == 0) {
            $scope.getColumnList();
        } else {
            $scope.getSubscribeList();
        }
    }
})
//我的收藏
.controller("CollectionCtrl", function ($scope, $http, $rootScope, $filter) {
    $rootScope.isOpen.collection = true;//是否展开判断
    $rootScope.subNavFlag = 9; //导航是否选择判断
    $scope.collectionArticleList = [];//收藏文章列表
    $scope.collectionActivityList = [];//收藏互动列表
    $scope.collectionTopicList = [];//收藏话题列表
    $scope.tabData = {//切换数据
        currentName: "文章",
        isShow:false
    }
    //获取收藏数据的参数
    $scope.screen = {
        CollectType: 1,//0 收藏活动 1 收藏文章 2 对活动感兴趣 3 关注话题 4 收藏话题 5 关注大咖 6 收藏帖子
        PageNum: 1,
        PageSize:5
    }
    //确认取消收藏数据
    $scope.cancelCollectData = {
        type: "",
        index: "",
        id:""
    }
    //加载更多需要的数据
    $scope.pageData = {
        isloading: false,//是否显示加动画
        articleMore: true,//是否有更多文章，默认是true
        activityMore: true,//是否有更多活动，默认是true
        topicMore: true,//是否有更多话题，默认是true，
        articlePageNum: 1,//文章当前页数
        activityPageNum: 1,//活动当前页数
        topicPageNum:1//话题跟多页数
    }
    //切换菜单
    $scope.toggleTabMeau = function () {
        $scope.tabData.isShow = !$scope.tabData.isShow
    }
    //设置是否显示分享
    $scope.showShard = function (index) {
        $scope.collectionTopicList[index].isShard = !$scope.collectionTopicList[index].isShard;
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
    $scope.thumbsUp = function (thumbsUp,id, index) {
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
                        $scope.collectionTopicList[index].IsThumput = true
                        $scope.collectionTopicList[index].ThumbsUpCount += 1;
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
                        $scope.collectionTopicList[index].IsThumput = false
                        $scope.collectionTopicList[index].ThumbsUpCount -= 1;
                        $scope.$apply();
                    } else {
                        layer.msg(data.Message);
                    }
                }
            });
        }
        
    }
    //设置收藏类型
    $scope.setCollectType = function (flag) {
        $scope.screen.CollectType = flag;
        $scope.tabData.isShow = false;
        if (($scope.screen.CollectType == 0 && $scope.collectionActivityList.length < 1) || ($scope.screen.CollectType == 6 && $scope.collectionTopicList.length < 1)) {
            $scope.getCollectionList();
        }
    }
    //获取收藏数据方法
    $scope.getCollectionList = function () {
        if (!$scope.pageData.isloading) {
            $scope.pageData.isloading = true;
        $http({
            url: "/Api/UserCenterV2/MyQueryCollectFollow",
            data: $scope.screen,
            method: "POST"
        }).success(function (data) {
            $scope.pageData.isloading = false;
            if (data.success && data.rows && data.rows.length > 0) {               
                $scope.concatData(data.rows, data.pageTotal);
            } else {
                //layer.msg("获取数据失败");
                switch ($scope.screen.CollectType) {
                    case 0://活动
                        $scope.pageData.activityMore = false;
                        break;
                    case 1://文章
                        $scope.pageData.articleMore = false;
                        break;
                    case 6:
                        $scope.pageData.topicMore = false;
                        break;//话题
                    default:
                        break;
                }
            }
        });
        }
    }
    //滚动加载更多方法
    $scope.getMore = function () {
        switch ($scope.screen.CollectType) {
            case 0://活动
                $scope.screen.PageNum = $scope.pageData.activityPageNum;
                if ($scope.pageData.activityMore) { $scope.getCollectionList(); }
                break;
            case 1://文章
                $scope.screen.PageNum = $scope.pageData.articlePageNum;
                if ($scope.pageData.articleMore) { $scope.getCollectionList(); }
                break;
            case 6:
                $scope.screen.PageNum = $scope.pageData.topicPageNum;
                if ($scope.pageData.topicMore) { $scope.getCollectionList(); }
                break;//话题
            default:
                break;
        }
       
    }
    //拼接数据
    $scope.concatData = function (data, total) {
        switch ($scope.screen.CollectType) {
            case 1:
                if ($scope.pageData.articlePageNum < total) {
                    $scope.pageData.articlePageNum += 1;
                } else {
                    $scope.pageData.articleMore = false;
                }
                if ($scope.collectionArticleList.length > 0) {
                    $scope.collectionArticleList = $scope.collectionArticleList.concat(data);
                } else {
                    $scope.collectionArticleList = data;
                }
                break;
            case 0:
                if ($scope.pageData.activityPageNum < total) {
                    $scope.pageData.activityPageNum += 1;
                } else {
                    $scope.pageData.activityMore = false;
                }
                if ($scope.collectionActivityList.length > 0) {
                    $scope.collectionActivityList = $scope.collectionActivityList.concat(data);
                } else {
                    $scope.collectionActivityList = data;
                }
                break;
            case 6:
                if ($scope.pageData.topicPageNum < total) {
                    $scope.pageData.topicPageNum += 1;
                } else {
                    $scope.pageData.topicMore = false;
                }
                angular.forEach(data, function (item) {
                    item.isShard = false;
                    if (item.Content) {
                        item.Content = item.Content.replace(/\<a tipId='/g, "<em class='font-orange' tipId='");
                        item.Content = item.Content.replace(/\<\/a>/g, "</em>");
                        item.Content = $filter('fontLength')(item.Content, 280);
                    }
                    item.HeadImgUrl = $filter('noHeadImage')(item.HeadImgUrl, $rootScope.configPort.staticFile);
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
                });
                if ($scope.collectionTopicList.length > 0) {
                    $scope.collectionTopicList = $scope.collectionTopicList.concat(data);
                } else {
                    $scope.collectionTopicList = data;
                }
                break;
            default:
                break
        }
    }
    $scope.cancelConfrim = function (type, id, index) {
        $scope.cancelCollectData.type = type;
        $scope.cancelCollectData.id = id;
        $scope.cancelCollectData.index = index;
        layer.open({
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,//开启遮罩关闭
            move: false, //禁止拖拽
            content: $('#confrim_dialog')
        });
    }
    //取消收藏
    $scope.cancelCollect = function () {
        var screenData = {
            CollectType:$scope.cancelCollectData.type
        }
        screenData.RelationId = $scope.cancelCollectData.id;
        $.ajax({
            url: $rootScope.configPort.party + '/Api/Activity/UnCollection',
            async: true, 
            data: screenData,
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function (data) {
                if (data.Success) {
                    layer.msg("取消收藏");
                    switch ($scope.screen.CollectType) {
                        case 0://活动
                            $scope.collectionActivityList.splice($scope.cancelCollectData.index, 1);
                            break;
                        case 1://文章
                            $scope.collectionArticleList.splice($scope.cancelCollectData.index, 1);
                            break;
                        case 6:
                            $scope.collectionTopicList.splice($scope.cancelCollectData.index, 1);
                            break;//话题
                        default:
                            break;
                    }
                    $scope.closePopWindow();
                    $scope.$apply();
                } else {
                    layer.msg(data.Message);
                }
            }
        })
    }

});
//分享
userApp.directive('listShare', function () {
    var linkFunction = function (scope, element, attributes, http) {
        var _index, _title, _url, _imgUrl, _summary, _isDetail;
        _isDetail = $(this).attr("data-type");
        //qq分享
        $(element).find(".share-qq").click(function () {
            initShare();
            var p = {
                url: _url,/*获取URL，可加上来自分享到QQ标识，方便统计*/
                desc: '', /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
                title: _title,/*分享标题(可选)*/
                summary: _summary,/*分享描述(可选)*/
                pics: _imgUrl,/*分享图片(可选)*/
                flash: '', /*视频地址(可选)*/
                site: ''/*分享来源 (可选) ，如：QQ分享*/
            };
            var s = [];
            for (var i in p) {
                s.push(i + '=' + encodeURIComponent(p[i] || ''));
                //s.push(i + '=' + (p[i] || ''));
            }
            //使用http://connect.qq.com/widget/shareqq/iframe_index.html链接，iframe_index.html是弹出层效果，index.html是新打开页面效果
            var _src = "http://connect.qq.com/widget/shareqq/index.html?" + s.join('&');
            window.open(_src);
        });
        //微信分享
        $(element).find(".share-weixin").click(function () {
            initShare();
            if ($(this).find("div").length < 1) {
                var qcode = "<div><div id='w_code_p" + _index + "'></div><p>请使用微信扫描上面二维码，分享给朋友</p><a>关闭</a></div>";
                $(this).append(qcode);
                $("#w_code_p" + _index).qrcode({
                    render: "canvas", //table方式 
                    width: 200, //宽度 
                    height: 200, //高度 
                    text: _url, //任意内容 
                });
                $(this).find("a").click(function (e) {
                    e.stopPropagation();
                    $(this).parent("div").hide();
                });
            } else {
                $(this).children("div").show();
            }
        });
        //QQ空间分享
        $(element).find(".share-space").click(function () {
            initShare();
            var p = {
                url: _url,/*获取URL，可加上来自分享到QQ标识，方便统计*/
                desc: '', /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
                title: _title,/*分享标题(可选)*/
                summary: _summary,/*分享描述(可选)*/
                pics: _imgUrl,/*分享图片(可选)*/
                flash: '', /*视频地址(可选)*/
                //commonClient : true, /*客户端嵌入标志*/
                site: ''/*分享来源 (可选) ，如：QQ分享*/
            };
            var s = [];
            for (var i in p) {
                 s.push(i + '=' + encodeURIComponent(p[i] || ''));
               // s.push(i + '=' + (p[i] || ''));
            }
            //使用http://connect.qq.com/widget/shareqq/iframe_index.html链接，iframe_index.html是弹出层效果，index.html是新打开页面效果
            var _src = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + s.join('&');
            window.open(_src);
        });
        //微信朋友圈分享
        $(element).find(".share-friends").click(function () {
            initShare();
            if ($(this).find("div").length < 1) {
                var qcode = "<div><div id='w_code_" + _index + "'></div><p>请使用微信扫描上面二维码，分享到朋友圈</p><a>关闭</a></div>";
                $(this).append(qcode);
                $("#w_code_" + _index).qrcode({
                    render: "canvas", //table方式 
                    width: 200, //宽度 
                    height: 200, //高度 
                    text: _url, //任意内容 
                });
                $(this).find("a").click(function (e) {
                    e.stopPropagation();
                    $(this).parent("div").hide();
                });
            } else {
                $(this).children("div").show();
            }
        });
        //新浪微博分享
        $(element).find(".share-weibo").click(function () {
            initShare();
            _url = encodeURIComponent(_url);
            var sharesinastring = 'http://v.t.sina.com.cn/share/share.php?title=' + _summary + '&url=' + _url + '&content=utf-8&sourceUrl=' + _url + '&pic=' + _imgUrl;
            window.open(sharesinastring);
        });
        function initShare() {
            _index = $(element).attr("data-index");
            _title = '易行网';       
            var _isDetail=$(element).attr("data-type");
            if (_isDetail=="detail") {//我收藏的帖子
                _summary = scope.collectionTopicList[_index].Content.split("</a>");
            } else {//我发布的帖子
                _summary = scope.myJoinTopicList[_index].Content.split("</em>");
            }           
            _summary = _summary[1];
            if (_summary.length > 10) {
                _summary = _summary.slice(0,10)+"..."
            }
            var web_party = window.location.host;
            _imgUrl = scope.configPort.web + "/party/Content/img/icon-logo.png";
            if (_isDetail == "detail") {//我收藏的帖子
                _url = "http://" + web_party + "/HotOpinion/TopicCard?topicId=" + scope.collectionTopicList[_index].TopicId;
                if (scope.collectionTopicList[_index].HeadImgUrl) {
                    _imgUrl = scope.collectionTopicList[_index].HeadImgUrl;
                }
            } else {//我发布的帖子
                _url = "http://" + web_party + "/HotOpinion/TopicCard?topicId=" + scope.myJoinTopicList[_index].TopicId;
                if (scope.myJoinTopicList[_index].HeadImgUrl) {
                    _imgUrl = scope.myJoinTopicList[_index].HeadImgUrl;
                }
            }                                  
        }
    }
    
    return {
        restrict: "ACE",
        link: linkFunction
    };
});
var currentAnswer, currentPlayer, currentAnswerIndex;//播放回答时使用
//更改(个人资料)
userApp.directive('editShow', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            $(elem).click(function () {
                $(this).hide();
                $(this).siblings("span").hide();
                $(this).siblings("input").show();
                $(this).siblings("input").focus();
            });
        }
    }
})
    //解除绑定（个人资料）
    .directive('unBound', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {

                $(elem).click(function () {
                    var etype = $(this).attr("etype");
                    var str = $(this).text();
                    if (str == "解除绑定") {
                        var r = confirm("确定解除绑定？");
                        if (r) {
                            if (etype == 1) {//QQ
                                $.ajax({
                                    url: scope.configPort.sso + "/thirdlogin/QQUnBind",
                                    dataType: 'jsonp',
                                    jsonp: 'jsonpCallback',
                                    success: function (data) {
                                        if (data.Success) {
                                            scope.personalInfo.QQ = "";
                                            scope.$apply();
                                        }
                                    }
                                });
                            } else {
                                $.ajax({
                                    url: scope.configPort.sso + "/thirdlogin/WxUnBind",
                                    dataType: 'jsonp',
                                    jsonp: 'jsonpCallback',
                                    success: function (data) {
                                        if (data.Success) {
                                            scope.personalInfo.Weixi = "";
                                            scope.$apply();
                                        }
                                    }
                                });
                            }
                            
                        }
                    } else {
                        $(this).hide();
                        $(this).siblings("span").hide();
                        var myUrl = encodeURIComponent(window.location.href);
                        if (etype == 1) {//QQ
                            window.location.href =scope.configPort.sso + "/thirdlogin/QQBind?backUrl="+myUrl;
                        
                        } else {//微信
                            window.location.href = scope.configPort.sso + "/thirdlogin/WxBind?backUrl=" + myUrl;
                        }
                    }

                })

            }
        }
    })
    //积分抽奖（开始抽奖按钮）
    .directive('startDraw', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                lottery = {
                    index: 1,    //当前转动到哪个位置，起点位置
                    count: 0,    //总共有多少个位置
                    timer: 0,    //setTimeout的ID，用clearTimeout清除
                    speed: 20,    //初始转动速度
                    times: 0,    //转动次数
                    cycle: 50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
                    prize: -1,    //中奖位置
                    setPrize: scope.drawIndex,//设置固定中奖位置
                    init: function (id) {
                        if ($("#" + id).find("li[data-index]").length > 0) {
                            $lottery = $("#" + id);
                            $units = $lottery.find("li[data-index]");
                            this.obj = $lottery;
                            this.count = $units.length;
                            $lottery.find("li[data-index=" + this.index + "]").addClass("active");
                        };
                    },
                    roll: function () {
                        var index = this.index;
                        var count = this.count;
                        var lottery = this.obj;
                        $(lottery).find("li[data-index=" + index + "]").removeClass("active");
                        index += 1;
                        if (index > count) {
                            index = 1;
                        };
                        $(lottery).find("li[data-index=" + index + "]").addClass("active");
                        this.index = index;
                        return false;
                    },
                    stop: function (index) {
                        this.prize = index;
                        return false;
                    }
                };
                drawRoll = function () {
                    lottery.times += 1;
                    lottery.roll();
                    if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
                        clearTimeout(lottery.timer);
                        //  lottery.prize =0;
                        lottery.times = 0;
                        scope.prizeIndex = lottery.prize;          
                        scope.$apply();
                        scope.luckPrize();
                        $("#lunk_draw .center").removeClass("start");
                    } else {
                        if (lottery.times < lottery.cycle) {
                            lottery.speed -= 10;
                        } else if (lottery.times == lottery.cycle) {
                            var index = lottery.setPrize;//设置中奖位置
                            //var index = Math.random() * (lottery.count) | 0;
                            lottery.prize = index;
                        } else {
                            if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                                lottery.speed += 110;
                            } else {
                                lottery.speed += 20;
                            }
                        }
                        if (lottery.speed < 40) {
                            lottery.speed = 40;
                        };
                        lottery.timer = setTimeout(drawRoll, lottery.speed);
                    }
                    return false;
                }
                lottery.init('lunk_draw');
                $(elem).click(function () {
                    //积分不足50时弹出积分不足弹窗
//                  if (scope.UserInfo.TotalPointBalance < 50) {
//                      layer.open({
//                          type: 1,
//                          closeBtn: 0, //不显示关闭按钮
//                          shadeClose: true,//开启遮罩关闭
//                          move: false, //禁止拖拽
//                          content: $('#intgral')
//                      });
//                      return false;
//                  }
                    if ($(this).hasClass("start")) {
                        return false;
                    } else {
                    	var isDraw =  scope.drawPrize();
//                      scope.drawPrize();
						if(isDraw){
							lottery.setPrize = scope.drawIndex;
	                        lottery.speed = 100;
	                        drawRoll();
	                        $(this).addClass("start");
	                        return false;
						}
                        
                    }
                });
            }
        }
    })
    //我的私信里面的表情按钮
    .directive('btnEmoji', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {

                $(elem).click(function () {
                    var emojiPath = scope.configPort.staticFile + "/web/Content_/img/emoji/";
                    $(elem).qqFace({
                        assign: "input_content",
                        path: emojiPath	//表情存放的路径
                    });
                })

            }
        }
    })
    //回复,收起(我的评论)
    .directive('showReplay', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {

                $(elem).click(function () {
                    var index = parseInt($(this).attr("data-index"));
                    var parentIndex = parseInt($(this).attr("data-parent"));
                    var btn_e = "", emoji_cont = "";
                    if (parentIndex || parentIndex == 0) {
                        scope.commentList[parentIndex].Reply[index].isShow = !scope.commentList[parentIndex].Reply[index].isShow;
                        if (!scope.commentList[parentIndex].Reply[index].isSetEmoji) {
                            scope.commentList[parentIndex].Reply[index].isSetEmoji = true;
                            btn_e = "#comment_replay" + (parentIndex + 1) + "_" + (index + 1);
                            emoji_cont = "replay" + (parentIndex + 1) + "_" + (index + 1);
                        }
                    } else {
                        scope.commentList[index].isShow = !scope.commentList[index].isShow;
                        if (!scope.commentList[index].isSetEmoji) {
                            scope.commentList[index].isSetEmoji = true;
                            btn_e = "#comment_emoji" + (index + 1);
                            emoji_cont = "comment" + (index + 1);
                        }
                    }
                    scope.$apply();
                    if (btn_e != "" && emoji_cont != "") {
                        $(btn_e).qqFace({
                            assign: emoji_cont,
                            path: scope.path	//表情存放的路径
                        });
                    }

                })

            }
        }
    })
    //显示筛选列表(我的评论)
    .directive('showScreen', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                $(elem).click(function (e) {
                    e.stopPropagation();
                    scope.isShowScreen = !scope.isShowScreen;
                    scope.$apply();
                });
            }
        }
    })
    //筛选列表(我的评论)
    .directive('screenList', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                $(elem).find("li").click(function (e) {
                    e.stopPropagation();
                    var str = $(this).text();
                    scope.screenStr = str;
                    scope.isShowScreen = false;
                    if (str == "全部") {
                        scope.screenList.IsCommentToMe = "";
                    } else if (str == "我的评论") {
                        scope.screenList.IsCommentToMe = false;
                    } else {//评论我的
                        scope.screenList.IsCommentToMe = true;
                    }                    
                    scope.$apply();
                    scope.init();

                });
            }
        }
    })
    //发送私信（我的关注）
    .directive('sendMessage', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                $(elem).click(function () {
                    if (scope.writeMessage.length < 1) {
                        layer.msg("请填写私信内容!");
                        return false;
                    } else {
                        $.ajax({
                            url: "/Api/usercenter/AddLetter",
                            type: "POST",
                            data: {
                                ReceiverClientId: scope.followedClientId,
                                SenderClientId: scope.UserInfo.ClientId,
                                Content: scope.writeMessage
                            },
                            success: function (data) {
                                if (data.Success) {
                                    layer.msg("发送成功！");
                                    scope.followedClientId = "";
                                    scope.writeMessage = ""
                                    scope.$apply();
                                    scope.closePopWindow();
                                } else {
                                    layer.msg(data.Message);
                                }
                            }
                        })
                    }
                });
            }
        }
    })
    //筛选列表(我的问答)
    .directive('answerScreen', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                $(elem).find("a").click(function (e) {
                    e.stopPropagation();
                    var str = $(this).text();
                    scope.screenStr = str;
                    scope.isShowScreen = false;
                    if (str == "全部") {
                        scope.AnswerPayStatus = "";
                    } else if (str == "已回复") {
                        scope.AnswerPayStatus = 3;
                    } else if (str == "未回复") {
                        scope.AnswerPayStatus = 2;
                    } else if (str == "已撤销") {
                        scope.AnswerPayStatus = 5;
                    } else if (str == "已拒绝") {
                        scope.AnswerPayStatus = 4;
                    }
                    scope.$apply();
                });
            }
        }
    })
    //播放回答
.directive("audioPlay", function () {
    var linkFunction = function (scope, element, attributes, http) {
        var audioPlay = element;
        var index = parseInt(attributes.data);
        $(audioPlay).on("click", function () {
            var srcUrl = "";
            if (scope.tabShowIndex == 1) {//我的提问列表
                srcUrl = scope.myQuestionList[index].AnswerUrl;
            } else if (scope.tabShowIndex == 2) {//我的回答列表
                srcUrl = scope.myAnswerList[index].AnswerUrl;
            } else {//我的偷听列表
                srcUrl = scope.myListenList[index].AnswerUrl;
            }
            if (srcUrl) {//判断列表是否存在数据
                    if (currentAnswerIndex == index) {//判断当前播放的答案是否是现在点击的这个，是的话为暂停
                        if ($(this).find("i").hasClass("gif")) {//播放状态
                            currentPlayer.pause();//暂停播放
                            currentAnswer.find("em").text("暂停播放");
                            $(this).find("i").removeClass("gif");
                        } else {
                            currentPlayer.play();//开始播放
                            currentAnswer.find("em").text("正在播放");
                            $(this).find("i").addClass("gif");
                        }
                    } else {
                        $('#player').remove();//移除之前的audio，重新建一个
                        $(this).find("em").text("正在播放");
                        $(this).find("i").addClass("gif");
                        $(this).parents("li").siblings().find("span[audio-play]").find("i").removeClass("gif");
                        $('body').append('<audio autoplay="autoplay" src="' + srcUrl + '" id="player"></audio>');
                        //因没有可用的audio地址，测试使用
                        //$('body').append('<audio id="player" autoplay="autoplay" src="' + scope.configPort.staticFile + '/party/Content/audio/cs1.mp3" ></audio>');
                        currentPlayer = document.getElementById("player");
                        currentAnswerIndex = index;
                        currentAnswer = $(this);
                        currentPlayer.onended = function () {//音频播放完成事件
                            //播放完重置
                            currentAnswer.find("i").removeClass("gif");
                            currentAnswer.find("em").text("点击播放");
                            $(currentPlayer).remove();
                            currentAnswerIndex = -1;
                            currentAnswer = ""
                        }
                    }
            } else {
                layer.msg("获取回答失败！");
            }

        });
    };
    return {
        restrict: "AEC",
        link: linkFunction
    };

})
    //滚动条(我的私信)
    .directive('messageCont', function () {
        return {
            restrict: 'ACEM',
            link: function (scope, elem, attr) {
                $(elem).mCustomScrollbar({
                    callbacks: {
                        onTotalScrollBack: function () {
                           // console.log("Scrolled to top of content.");
                            scope.getDialogList();
                        }
                    }
                });
            }
        }
    })
    //剪切头像
 .directive("shearHeadImg", function () {
    return { 
        restrict: "C",
        link: function ($scope, $element, $attrs, $ctrl, ngModel) {
            $element.change(function () {
                $(".upLoadHeadImage").show();
                var mySrc = getObjectURL(this.files[0]);
                // console.log(this.files[0]);
                $("#clickUpload").text("重新上传");
                $("#avatar1").attr("src", mySrc);
                $("#avatar").attr("src", mySrc);
                debugger
                $("#avatar").load(function () {
                    var a_w = $(this).width();
                    var a_h = $(this).height();
                    var shard_h = 100;
                    if (a_w > a_h) {
                        shard_h = a_h;
                        $("#avatar1").css({
                            "margin-top": "0",
                            "margin-left": "0",
                            "height": "100%",
                            "width": parseInt(a_w / a_h * 100) + "px"
                        });
                    } else {
                        shard_h = a_w;
                        $("#avatar1").css({
                            "margin-top": "0",
                            "margin-left": "0",
                            "height": parseInt(a_h / a_w * 100) + "px",
                            "width":"100%"
                        });
                    }
                    $("#picture,#img_big_preview").addClass("clear");
                    var scale = document.getElementById('avatar').naturalWidth / 300;
                    $("#id_top").val(0);
                    $("#id_left").val(0);
                    $("#id_width").val(parseInt(shard_h * scale));
                    $("#id_height").val(parseInt(shard_h * scale));
                    setTimeout(function () {
                        if (image_select) {
                            $(".imgareaselect-selection").parent().css("z-index", "1989100018");
                            image_select.setSelection(0, 0, shard_h, shard_h, true);
                            image_select.setOptions({ show: true });
                            image_select.update();
                        } else {
                            image_select = $('img#avatar').imgAreaSelect({
                                aspectRatio: "4:4",
                                x1: 0,
                                y1: 0,
                                x2: shard_h,
                                y2: shard_h,
                                instance: true,
                                onSelectEnd: function (img, selection) {
                                    var scale = document.getElementById('avatar').naturalWidth / 300;
                                    //  console.log(scale);
                                    $('#id_top').val(parseInt(selection.y1 * scale));
                                    $('#id_left').val(parseInt(selection.x1 * scale));
                                    $('#id_width').val(parseInt(selection.width * scale));
                                    $('#id_height').val(parseInt(selection.height * scale));
                                },
                                onSelectChange: preview
                            });
                        }
                    }, 100);
                        
                    });
            })
        }
    }
 })
    //弹出上传头像弹框
   .directive("showImgDialog", function () {
     return {
         restrict: "ACE",
         link: function ($scope, $element, $attrs, $ctrl, ngModel) {
             $element.click(function () {
                 layer.open({
                     type: 1,
                     closeBtn: 0, //不显示关闭按钮
                     shadeClose: true,//开启遮罩关闭
                     move: false, //禁止拖拽
                     content: $('#editHeadImg')
                 });
                 if (image_select) {
                     debugger
                     //var a_w = $("#avatar").width();
                     //var a_h = $("#avatar").height();
                     //var shard_h = 100;
                     //if (a_w > a_h) {
                     //    shard_h = a_h;
                     //    $("#avatar1").css("height", "100%");
                     //} else {
                     //    shard_h = a_w;
                     //    $("#avatar1").css("width", "100%");
                     //}
                     //var scale = document.getElementById('avatar').naturalWidth / 300;
                     //$("#id_width").val(parseInt(shard_h * scale));
                     //$("#id_height").val(parseInt(shard_h * scale));
                     $("#picture,#img_big_preview").addClass("clear");
                     setTimeout(function () {
                         var a_w = $("#id_width").val();
                         var a_h = $("#id_width").val();
                         var _top = $("#id_top").val();
                         var _left = $("#id_left").val();
                         $(".imgareaselect-selection").parent().css("z-index", "1989100018");
                         image_select.setSelection(_left, _top, a_w, a_h, true);
                         image_select.setOptions({ show: true });
                         image_select.update();
                     }, 250);
                 }
             });
         }
     }
   })
    //安全设置中的图片验证码
    .directive('imgCode', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                $(elem).click(function () {
                    scope.pwdData.imgSrc = "/Api/UserCenterV2/CreatImg?v=" + Math.random();
                    scope.$apply();
                });
            }
        }
    });

//电话号码格式筛选
userApp.filter('phoneNumber', function () {
    return function (input,len) {
        if (input) {
            var reg = /^(\d{2})\d{7}(\d{2})$/;
            var str = "$1*******$2";
            if (len) {
                var _hLen = Math.ceil((11 - len) / 2);
                var _qLen = parseInt((11 - len) / 2);
                reg = new RegExp("^\(\\d{" + _qLen + "})\\d{" + len + "}(\\d{" + _hLen + "})$", "gim");
                str = "$1";             
                for (var i = 0; i < len; i++) {
                    str += "*";
                }
                str=str+ "$2";
            }
            input = input.replace(reg, str);
        } else {
            input = "";
        }
        return input;
    }
})//邮箱格式筛选
    .filter('emailFilter', function () {
        return function (input) {
            if (input) {
                var reg = /^(\w{1})\w{1,30}(\w{1}\@)/;
                var countList = input.split("@");
                var str = "$1";
                for (var i = 0; i < countList[0].length - 2; i++) {
                    str += "*";
                }
                str += "$2";

                input = input.replace(reg, str);
            } else {
                input = "";
            }
            return input;
        }
    })
//以html输出
.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}])
//表情格式化
.filter('emojiFormat', function () {
    return function (input, path) {
        if (input != null && input != '') {
            if (input.indexOf("</a>") < 0) {
                input = input.replace(/\</g, '&lt;');
                input = input.replace(/\>/g, '&gt;');
                input = input.replace(/\n/g, '<br/>');
            } else {
                input = input.replace(/\<a tipId='/g, "<a target='_blank' href='/HotOpinion/Topic?tipId=");
            }
            if (path) {
                input = input.replace(/\[em_([0-9]*)\]/g, '<img src="' + path + '$1.png" border="0" />');
            }
        }
        return input;
    }
})
    //我的评论话题的链接
.filter('linkTopic', function () {
    return function (input, path) {
        if (input != null && input != '') {
            if (input.indexOf("</a>") < 0) {
                input = input.replace(/\</g, '&lt;');
                input = input.replace(/\>/g, '&gt;');
                input = input.replace(/\n/g, '<br/>');
            } else {
                input = input.replace(/\<a tipId=/g, "<em tipId=");
                input = input.replace(/\<\/a>/g, "</em>");
            }
        }
        return input;
    }
})
    //秒变分我的问答时使用
    .filter('secToMin', function () {
        return function (input) {
            input = parseInt(input);
            if (input != null && input != 0) {
                var hour = parseInt(input / 3600);
                var mintue = parseInt((input % 3600) / 60);
                var sec = (input % 3600) % 60;
                input = "";
                if (hour > 0) {
                    input = hour + ":";
                }
                if (mintue > 0) {
                    input += mintue + "′";
                }
                if (sec > 0) {
                    input += sec + "″";
                }
            }
            return input;
        }
    });