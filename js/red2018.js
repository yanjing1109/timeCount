    //创建vue对象
    var vm = new Vue({
        el: "#vueMount",
        data: {
            _ordertimer: null,
            ct_dateDiff: 0,     //客户端与服务端时间差
            timeTxt: '',        //倒计时文案
            isTimeEnd: true     //倒计时是否结束，true未结束， false已结束
        },
        created: function () {
            this.timeCount();
        },
        mounted: function() {
            
        },
        methods: {
            timeCount: function() {
                var _this = this;
                var request = 'https://www.easy-mock.com/mock/5afa9dbb2c5ab01b0cbf436e/http:/fe-api.99buy.com/api/getTime';
                $.get(request, function (data) {
                    // var data = JSON.parse(data);
                    data = data.data;
                    console.log(data);
                    console.log(_this.isTimeEnd);
                    if(data.time > 0){
                        nowTime = _this.timestampToTime(data.time);  
                        endTime = _this.timestampToTime(data.end_time); //开始时间
                        _this.countDown(nowTime, endTime);
                    }
                });
            },
            //目前时间状态，是否可以倒计时
            countDown: function(nowTime, endTime) {
                var _this = this;
                if(new Date(nowTime) > new Date(endTime)){
                    _this.isTimeEnd = false;    //倒计时已结束
                    return;
                } else{
                    _this.ct_dateDiff = new Date(nowTime) - Date.parse(new Date()); //请求时间戳与本地时间戳
                    _this.leftTimer(endTime);
                    _ordertimer = setInterval(function(){ _this.leftTimer(endTime) }, 1000);
                }
            },
            //当前客户端时间
            getnow:function() {
                var data =new Date();
                var year = data.getFullYear();
                var month = parseInt(data.getMonth()+1) >= 10 ? parseInt(data.getMonth()+1) : '0' + parseInt(data.getMonth()+1);
                var day = data.getDate();
                var hours =  data.getHours();  
                var minutes =  data.getMinutes();
                var seconds =  data.getSeconds();  
                var now = year +'/'+ month +'/'+ day +' '+ hours +':'+ minutes +':'+ seconds;
                return now;
            },
            //输出倒计时文案
            leftTimer: function(endTime) {
                var _this = this;
                var leftTime = (new Date(endTime)) - (Date.parse(new Date()) + _this.ct_dateDiff);
                var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);
                var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);
                var seconds = parseInt(leftTime / 1000 % 60, 10);
                days = _this.checkTime(days);
                hours = _this.checkTime(hours);
                minutes = _this.checkTime(minutes);
                seconds = _this.checkTime(seconds);
            
                if(days <= 0){
                    days = 0;
                } 
                if(hours <= 0){
                    hours = 0;
                }
                if(minutes <= 0){
                    minutes = 0;
                }
                if (days >= 0 || hours >= 0 || minutes >= 0 || seconds >= 0) {
                    if(days <= 0){
                        _this.timeTxt = hours + "\u5c0f\u65f6" + minutes + "\u5206" + seconds + "\u79d2";
                    } else{
                        _this.timeTxt = days + "\u5929" + hours + "\u5c0f\u65f6" + minutes + "\u5206" + seconds + "\u79d2";
                    }
                }
                //倒计时已结束
                if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
                    setTimeout(function(){
                        _this.isTimeEnd = false;
                        return false;
                    }, 1000)
                }
            },
            //时间戳转换为时间 2018/03/18 10:33:24
            timestampToTime: function(timestamp) {
                var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                Y = date.getFullYear() + '/';
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
                D = date.getDate() + ' ';
                h = date.getHours() + ':';
                m = date.getMinutes() + ':';
                s = date.getSeconds();
                return Y+M+D+h+m+s;
            },
            //两个日期相差天数
            dateDiff: function(date1, date2) {
                var _this = this;
                var leftTime = (new Date(date2)) - (Date.parse(date1));
                var allSec = leftTime/1000;
                console.log(allSec);
                if(allSec <= 172800){
                    return 1;
                } else{
                    date1 = date1.substr(0, 10);
                    date2 = date2.substr(0, 10);
                    var type1 = typeof date1, type2 = typeof date2;       
                    if(type1 == 'string')       
                        date1 = _this.stringToTime(date1);       
                    else if(date1.getTime)       
                        date1 = date1.getTime();       
                    if(type2 == 'string')       
                        date2 = _this.stringToTime(date2);       
                    else if(date2.getTime)       
                        date2 = date2.getTime();   
                    return (date2 - date1) / 1000 / 60 / 60 / 24;//除1000是毫秒，不加是秒   
                }
            },
            stringToTime: function(string) {
                var f = string.split(' ', 2);       
                var d = (f[0] ? f[0] : '').split('/', 3);       
                var t = (f[1] ? f[1] : '').split(':', 3);       
                return (new Date(       
                parseInt(d[0], 10) || null,       
                (parseInt(d[1], 10) || 1)-1,       
                parseInt(d[2], 10) || null,       
                parseInt(t[0], 10) || null,      
                parseInt(t[1], 10) || null,       
                parseInt(t[2], 10) || null)).getTime();   
            },
            //将0-9的数字前面加上0，例1变为01
            checkTime:function(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }

        }
    });