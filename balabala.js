/*
初始化参数：
theme:主题，具体颜色值，类型string, 如#fff
//dayGap:可选择的日期间隔
beginDay:开始日期
endDay:结束日期
callback: 确认按钮callback
*/
$.fn.balabala = function(obj) {
    function pickerSize() {
        //日历距左边为15%
        var w = $(window).width() * 0.15;
        //日历距顶为25%
        var h = $(window).height() * 0.25;
        //date-a高度为38px，date-c高度为40px
        var hs = parseInt($(window).height() * 0.5 - 78);
        var ws = $(window).width() * 0.7 / 3;
        //fix有些设备对px为小数不兼容的bug
        while (hs % 3) {
            hs++;
        }
        //
        $('.date-picker').css('left', w);
        $('.date-picker').css('top', h);
        $('.date-s').css('height', hs);
        $('.date-s-com').css('width', ws);
        $('.date-s-y').css('left', 0);
        $('.date-s-m').css('left', ws);
        $('.date-s-d').css('left', ws * 2);
        $('.date-s-u li').css('height', hs / 3);
        $('.date-s-u li').css('line-height', hs / 3 + 'px');
        //...
        window.balabalaTop = $('.date-s').offset().top + parseFloat($('.date-s-u li').css('height'));
        window.balabalaItemHeight = parseInt($('.date-s-u li').css('height'));
    }

    function bindEvent(o) {
        function destroyPicker() {
            $(document).off('.bala');
            $('.date-picker').remove();
            $('.date-mask').remove();
        }
        // var tFlag = false;
        var tStartY = 0;
        var callback = o.callback || '';
        // var tEndY = 0;
        $(document).on('touchmove.bala', function(e) {
            e.preventDefault();
        })
        $(document).on('touchmove.bala', '.date-s-y, .date-s-m, .date-s-d', function(evt) {
            //滑动响应操作
            function moveTime(selector, times, timeMove) {
                var t = parseFloat(selector.css('-webkit-transform').substring(11));
                if ((t < window.balabalaItemHeight * 1.3) && (t > window.balabalaItemHeight * (2 - times) - window.balabalaItemHeight * 0.3)) {
                    //界定划动边际
                    var m = timeMove + tPresentY - tStartY;
                    if (m > window.balabalaItemHeight * 1.3) {
                        m = window.balabalaItemHeight * 1.3;
                    } else if (m < window.balabalaItemHeight * (2 - times) - window.balabalaItemHeight * 0.3) {
                        m = window.balabalaItemHeight * (2 - times) - window.balabalaItemHeight * 0.3;
                    }
                    selector.css('-webkit-transform', 'translateY(' + m + 'px)');
                }
            }
            var e = evt.target,
                tPresentY = evt.touches[0].screenY;
            if ($(e).closest('div').hasClass('date-s-y')) {
                moveTime($(".date-s-y ul"), window.balabalaYears, window.moveYears);
            } else if ($(e).closest('div').hasClass('date-s-m')) {
                moveTime($(".date-s-m ul"), window.balabalaMonths, window.moveMonths);
            } else {
                moveTime($(".date-s-d ul"), window.balabalaDays, window.moveDays);
            }
        });
        $(document).on('touchstart.bala', '.date-s', function(evt) {
            tStartY = evt.touches[0].screenY;
            // alert(tStartY);
            // tFlag = true;
        });
        $(document).on('touchend.bala', '.date-s', function(evt) {
            //调整translate至最近的item值
            function nearestItem(selector) {
                var val = parseFloat(selector.css('-webkit-transform').substring(11)),
                    x = val % window.balabalaItemHeight;
                // if (x < 0) {
                // x = Math.abs(x);
                //好烂的逻辑，当心bug
                (Math.abs(x) < window.balabalaItemHeight / 2) ? selector.css('-webkit-transform', 'translateY(' + (val - x) + 'px)') : selector.css('-webkit-transform', 'translateY(' + (x < 0 ? val - (window.balabalaItemHeight - Math.abs(x)) : val + (window.balabalaItemHeight - Math.abs(x))) + 'px)');
                // } else if (x > 0) {
                //     //当选择第一个item时
                // } else {
                //     //为0
                // }
                return parseInt(selector.css('-webkit-transform').substring(11));
                // for (var i = 0; i < selector.length; i++) {
                //     if (Math.abs($(selector[i]).offset().top - window.balabalaTop) < Math.abs($(selector[i + 1]).offset().top - window.balabalaTop)) {}
                // }
            }
            //获取当前选定的日期
            function currentDate() {
                function refreshDay(y, m, d) {
                    dateCheck(y + '-' + m + '-' + d);
                    if ($('.date-s-d ul li').length > window.balabalaDays) {
                        while ($('.date-s-d ul li').length - window.balabalaDays) {
                            if (parseInt(d) > window.balabalaDays) {
                                $('.date-s-d ul').css('-webkit-transform', 'translateY(' + (window.moveDays + window.balabalaItemHeight) + 'px)');
                            }
                            $('.date-s-d ul li').last().remove();
                            //设置translate之后，更新window.moveDays的值
                            window.moveDays = parseInt($('.date-s-d ul').css('-webkit-transform').substring(11));
                        }
                    } else {
                        while (window.balabalaDays - $('.date-s-d ul li').length) {
                            $('.date-s-d ul').append('<li id="days-' + ($('.date-s-d ul li').length + 1) + '" style="' + $('.date-s-d ul li').attr('style') + '">' + ($('.date-s-d ul li').length + 1) + '</li>');
                        }
                    }
                    //刷新日期
                    var t = window.moveDays % window.balabalaItemHeight ? 0 : 2 - window.moveDays / window.balabalaItemHeight;
                    return $($('.date-s-d ul li')[t - 1]).html();
                }
                var a = window.moveYears % window.balabalaItemHeight ? 0 : 2 - window.moveYears / window.balabalaItemHeight,
                    b = window.moveMonths % window.balabalaItemHeight ? 0 : 2 - window.moveMonths / window.balabalaItemHeight,
                    c = window.moveDays % window.balabalaItemHeight ? 0 : 2 - window.moveDays / window.balabalaItemHeight,
                    y = $($('.date-s-y ul').children()[a - 1]).html(),
                    m = $($('.date-s-m ul').children()[b - 1]).html(),
                    d = $($('.date-s-d ul').children()[c - 1]).html();
                d = refreshDay(y, m, d);
                console.log("year: %s, month: %s, day: %s", y, m, d);
                return (y + '-' + m + '-' + d);
            }
            var e = evt.target;
            if ($(e).closest('div').hasClass('date-s-y')) {
                window.moveYears = nearestItem($(".date-s-y ul"));
            } else if ($(e).closest('div').hasClass('date-s-m')) {
                window.moveMonths = nearestItem($(".date-s-m ul"));
            } else {
                window.moveDays = nearestItem($(".date-s-d ul"));
            }
            $('.date-a').html(currentDate());
        });
        $('.date-c-ok').on('click.bala', function() {
            if (window.balabalaEvr == 0) {
                $('[balabala-attr="begin-date"]').html($('.date-a').html());
            } else {
                $('[balabala-attr="end-date"]').html($('.date-a').html());
                callback && callback();
            }
            destroyPicker();
        });
        $('.date-c-no').on('click.bala', function() {
            //alert('no');
            //什么不做，销毁日历
            destroyPicker();
        });
    }
    //闰年天数检测
    function dateCheck(o) {
        var y = o.split('-')[0],
            m = o.split('-')[1],
            d = o.split('-')[2];
        if (parseInt(m) == 2) {
            if (((parseInt(y) % 100 != 0) && (parseInt(y) % 4 == 0)) || (parseInt(y) % 400 == 0)) {
                window.balabalaDays = 29;
            } else {
                window.balabalaDays = 28;
            }
        } else if (parseInt(m) % 2 == 0) {
            window.balabalaDays = parseInt(m) <= 7 ? 30 : 31;
        } else {
            window.balabalaDays = parseInt(m) <= 7 ? 31 : 30;
        }
    }

    function dateContentInit(data) {
        function dateDetail(o) {
            var date = new Date(),
                selector = {
                    year: function() {
                        //年份数
                        for (var i = 1; i <= window.balabalaYears; i++) {
                            var a = date.getFullYear() - window.balabalaYears + i;
                            $('.date-s-y ul').append('<li id="years-' + i + '">' + a + '</li>');
                        }
                    },
                    month: function() {
                        //月份数
                        for (var i = 1; i <= window.balabalaMonths; i++) {
                            var b = i < 10 ? '0' + i : i;
                            $('.date-s-m ul').append('<li id="months-' + i + '">' + b + '</li>');
                        }
                    },
                    day: function() {
                        //根据年份、月份来确定日期
                        dateCheck(o);
                        //日期数
                        for (var i = 1; i <= window.balabalaDays; i++) {
                            var c = i < 10 ? '0' + i : i;
                            $('.date-s-d ul').append('<li id="days-' + i + '">' + c + '</li>');
                        }
                    }
                };
            selector.year();
            selector.month();
            selector.day();
        }
        //判断是开始日期点击还是结束日期点击
        if (window.balabalaEvr == 0) {
            $('div.date-a').html(data);
            dateDetail(data);
        } else {
            //coding...
            dateDetail(data);
            $('div.date-a').html(data);
            // $('.date-s-u li').css('height');
        }
    }

    function themeInit(obj) {
        $('.date-picker').css('color', obj.theme || '#31b6e7');
        $('.date-a, .date-s-u li').css('border-bottom', obj.theme ? '2px solid ' + obj.theme : '2px solid #31b6e7');
        // $('.date-s-u li').css('border-bottom', '2px solid ' + obj.theme || '2px solid #31b6e7');
    }

    function contentAdjust(data) {
        var h = $('.date-s-u li').css('height'),
            x = $('.date-s-y ul li'),
            y = $('.date-s-m ul li'),
            z = $('.date-s-d ul li'),
            move = {
                year: function() {
                    window.moveYears = adjust(x, data.split('-')[0]);
                },
                month: function() {
                    window.moveMonths = adjust(y, data.split('-')[1]);
                },
                day: function() {
                    window.moveDays = adjust(z, data.split('-')[2]);
                }
            };

        function adjust(select, data) {
            var t1 = select.length,
                el = select.first();
            for (var i = 1; i <= t1; i++) {
                if ($(el).html() == data) {
                    var p = (2 - i) * parseFloat(h);
                    // select.css('-webkit-transform', 'translateY(' + p + 'px)');
                    select.parent().css('-webkit-transform', 'translateY(' + p + 'px)');
                    return p;
                }
                el = $(el).next();
            }
        }
        move.year();
        move.month();
        move.day();
    }

    function htmlInit() {
        var a = [];
        a.push('<div class="date-picker">', '<div class="date-a"></div>', '<div class="date-s">', '<div class="date-s-com date-s-y">', '<ul class="date-s-u"></ul>', '</div>', '<div class="date-s-com date-s-m">', '<ul class="date-s-u"></ul>', '</div>', '<div class="date-s-com date-s-d">', '<ul class="date-s-u"></ul>', '</div>', '</div>', '<div class="date-c">', '<div class="date-c-com date-c-ok">确定</div>', '<div class="date-c-com date-c-no">取消</div>', '</div>', '</div>', '<div class="date-mask"></div>');
        $('body').append(a.join(''));
    }

    function init(obj) {
        //设置格式为"yy-mm-dd"的日期
        function setDate() {
            var t = Number(arguments[0] || 0),
                day = new Date(),
                y = day.getFullYear(),
                m = day.getMonth(),
                d = day.getDate();
            var n = new Date(y, m, d + t),
                yy = n.getFullYear(),
                mm = n.getMonth() + 1,
                dd = n.getDate();
            mm = mm < 10 ? '0' + mm : mm;
            dd = dd < 10 ? '0' + dd : dd;
            var newDay = yy + '-' + mm + '-' + dd;
            return newDay;
        }
        //设置input框value值，忽略input内value默认值
        $('[balabala-attr="begin-date"]').html(obj.beginDay ? obj.beginDay : setDate('-8'));
        $('[balabala-attr="end-date"]').html(obj.endDay ? obj.endDay : setDate('-1'));
        //日历调用事件
        $('.balabala-select').on('click', function(evt) {
            // evt.preventDefault();
            var e = evt.target,
                data = ($(e).attr('balabala-attr') == 'begin-date') ? $('[balabala-attr="begin-date"]').html() : $('[balabala-attr="end-date"]').html();
            window.balabalaEvr = ($(e).attr('balabala-attr') == 'begin-date') ? 0 : 1;
            //初始化html元素
            htmlInit();
            //初始化日历选择数据内容
            dateContentInit(data);
            //配置主题
            themeInit(obj);
            //初始化日历窗口大小
            pickerSize();
            //调整日历窗口显示数据
            contentAdjust(data);
            //绑定日历响应事件
            bindEvent(obj);
            //test
            // $('#years-1').css('background-color', 'rgb(31, 142, 238)');
            // $('#years-2').css('background-color', 'rgb(31, 238, 134)');
            // $('#years-3').css('background-color', 'rgb(31, 142, 238)');
        })
    }
    window.balabalaYears = 30; //日历可选年限范围为30年
    window.balabalaMonths = 12; //日历可选月数范围为12个月
    window.balabalaDays = 0; //日历可选天数范围，根据大小月及闰年动态调整
    window.moveYears, window.moveMonths, window.moveDays; //选中item的偏移距离
    window.balabalaTop; //选中item的top坐标值
    window.balabalaItemHeight; //日历每个item的高度
    window.balabalaEvr; //日历所处环境, 0：begin-date; 1: end-date
    //日历初始化
    init(obj);
    // $('.balabala-select').on('click', function() {
    //     if ($(this).attr('balabala-attr') == 'begin-date') {
    //         alert('begin-date');
    //     } else {
    //         alert('end-date');
    //     }
    // });
}