     /*****haha123 456
     * 初始化参数：
     * theme:主题，具体颜色值，类型string, 如#fff
     * beginDay:开始日期
     * endDay:结束日期
     * callback: 确认按钮callback
     */
    $.fn.balabala = function(obj) {
        var varis = {
            itemHeight: 0, //日历每个item的高度
            years: 30, //日历可选年限范围为30年
            months: 12, //日历可选月数范围为12个月
            days: 0, //日历可选天数范围，根据大小月及闰年动态调整
            moveYears: 0, //选中item年份偏移距离
            moveMonths: 0, //选中item月份偏移距离
            moveDays: 0, //选中item日期偏移距离
            env: 0 //日历所处环境, 0：begin-date; 1: end-date
        };

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
            varis.itemHeight = parseInt($('.date-s-u li').css('height'));
        }

        function bindEvent(o) {
            function destroyPicker() {
                $(document).off('.bala');
                $('.date-picker').remove();
                $('.date-mask').remove();
            }
            // 检测横屏事件，重新设置日历窗口展示
            window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', function() {
                var data = $('.date-a').html();
                //初始化日历窗口大小
                pickerSize();
                //调整日历窗口显示数据
                contentAdjust(data);
            }, false);
            var tStartY = 0;
            var callback = o.callback || '';
            $(document).on('touchmove.bala', function(e) {
                e.preventDefault();
            })
            $(document).on('touchmove.bala', '.date-s-y, .date-s-m, .date-s-d', function(evt) {
                //滑动响应操作
                function moveTime(selector, times, timeMove) {
                    var t = parseFloat(selector.css('-webkit-transform').substring(11));
                    if ((t < varis.itemHeight * 1.3) && (t > varis.itemHeight * (2 - times) - varis.itemHeight * 0.3)) {
                        //界定划动边际
                        var m = timeMove + tPresentY - tStartY;
                        if (m > varis.itemHeight * 1.3) {
                            m = varis.itemHeight * 1.3;
                        } else if (m < varis.itemHeight * (2 - times) - varis.itemHeight * 0.3) {
                            m = varis.itemHeight * (2 - times) - varis.itemHeight * 0.3;
                        }
                        selector.css('-webkit-transform', 'translateY(' + m + 'px)');
                    }
                }
                var e = evt.target,
                    tPresentY = evt.touches[0].screenY;
                if ($(e).closest('div').hasClass('date-s-y')) {
                    moveTime($(".date-s-y ul"), varis.years, varis.moveYears);
                } else if ($(e).closest('div').hasClass('date-s-m')) {
                    moveTime($(".date-s-m ul"), varis.months, varis.moveMonths);
                } else {
                    moveTime($(".date-s-d ul"), varis.days, varis.moveDays);
                }
            });
            $(document).on('touchstart.bala', '.date-s', function(evt) {
                tStartY = evt.touches[0].screenY;
            });
            $(document).on('touchend.bala', '.date-s', function(evt) {
                //调整translate至最近的item值
                function nearestItem(selector) {
                    var val = parseFloat(selector.css('-webkit-transform').substring(11)),
                        x = val % varis.itemHeight;
                    (Math.abs(x) < varis.itemHeight / 2) ? selector.css('-webkit-transform', 'translateY(' + (val - x) + 'px)') : selector.css('-webkit-transform', 'translateY(' + (x < 0 ? val - (varis.itemHeight - Math.abs(x)) : val + (varis.itemHeight - Math.abs(x))) + 'px)');
                    return parseInt(selector.css('-webkit-transform').substring(11));
                }
                //获取当前选定的日期
                function currentDate() {
                    function refreshDay(y, m, d) {
                        dateCheck(y + '-' + m + '-' + d);
                        if ($('.date-s-d ul li').length > varis.days) {
                            while ($('.date-s-d ul li').length - varis.days) {
                                if (parseInt(d) > varis.days) {
                                    $('.date-s-d ul').css('-webkit-transform', 'translateY(' + (varis.moveDays + varis.itemHeight) + 'px)');
                                }
                                $('.date-s-d ul li').last().remove();
                                //设置translate之后，更新varis.moveDays的值
                                varis.moveDays = parseInt($('.date-s-d ul').css('-webkit-transform').substring(11));
                            }
                        } else {
                            while (varis.days - $('.date-s-d ul li').length) {
                                $('.date-s-d ul').append('<li id="days-' + ($('.date-s-d ul li').length + 1) + '" style="' + $('.date-s-d ul li').attr('style') + '">' + ($('.date-s-d ul li').length + 1) + '</li>');
                            }
                        }
                        //刷新日期
                        var t = varis.moveDays % varis.itemHeight ? 0 : 2 - varis.moveDays / varis.itemHeight;
                        return $($('.date-s-d ul li')[t - 1]).html();
                    }
                    var a = varis.moveYears % varis.itemHeight ? 0 : 2 - varis.moveYears / varis.itemHeight,
                        b = varis.moveMonths % varis.itemHeight ? 0 : 2 - varis.moveMonths / varis.itemHeight,
                        c = varis.moveDays % varis.itemHeight ? 0 : 2 - varis.moveDays / varis.itemHeight,
                        y = $($('.date-s-y ul').children()[a - 1]).html(),
                        m = $($('.date-s-m ul').children()[b - 1]).html(),
                        d = $($('.date-s-d ul').children()[c - 1]).html();
                    d = refreshDay(y, m, d);
                    console.log("year: %s, month: %s, day: %s", y, m, d);
                    return (y + '-' + m + '-' + d);
                }
                var e = evt.target;
                if ($(e).closest('div').hasClass('date-s-y')) {
                    varis.moveYears = nearestItem($(".date-s-y ul"));
                } else if ($(e).closest('div').hasClass('date-s-m')) {
                    varis.moveMonths = nearestItem($(".date-s-m ul"));
                } else {
                    varis.moveDays = nearestItem($(".date-s-d ul"));
                }
                $('.date-a').html(currentDate());
            });
            $('.date-c-ok').on('click.bala', function() {
                if (varis.env == 0) {
                    $('[balabala-attr="begin-date"]').html($('.date-a').html());
                } else {
                    $('[balabala-attr="end-date"]').html($('.date-a').html());
                    // 设置终止日期确定按钮callback
                    callback && callback();
                }
                destroyPicker();
            });
            $('.date-c-no').on('click.bala', function() {
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
                    varis.days = 29;
                } else {
                    varis.days = 28;
                }
            } else if (parseInt(m) % 2 == 0) {
                varis.days = parseInt(m) <= 7 ? 30 : 31;
            } else {
                varis.days = parseInt(m) <= 7 ? 31 : 30;
            }
        }

        function dateContentInit(data) {
            function dateDetail(o) {
                var date = new Date(),
                    selector = {
                        year: function() {
                            //年份数
                            for (var i = 1; i <= varis.years; i++) {
                                var a = date.getFullYear() - varis.years + i;
                                $('.date-s-y ul').append('<li id="years-' + i + '">' + a + '</li>');
                            }
                        },
                        month: function() {
                            //月份数
                            for (var i = 1; i <= varis.months; i++) {
                                var b = i < 10 ? '0' + i : i;
                                $('.date-s-m ul').append('<li id="months-' + i + '">' + b + '</li>');
                            }
                        },
                        day: function() {
                            //根据年份、月份来确定日期
                            dateCheck(o);
                            //日期数
                            for (var i = 1; i <= varis.days; i++) {
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
            if (varis.env == 0) {
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
                        varis.moveYears = adjust(x, data.split('-')[0]);
                    },
                    month: function() {
                        varis.moveMonths = adjust(y, data.split('-')[1]);
                    },
                    day: function() {
                        varis.moveDays = adjust(z, data.split('-')[2]);
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
            //获取格式为"yy-mm-dd"的日期，days不传值则默认当天时间
            function setDate(days) {
                var m, d,
                    t = ~~ (days || 0),
                    day = new Date(),
                    n = new Date(day.getFullYear(), day.getMonth(), day.getDate() + t);
                m = n.getMonth() + 1 < 10 ? '0' + (n.getMonth() + 1) : (n.getMonth() + 1);
                d = n.getDate() < 10 ? '0' + n.getDate() : n.getDate();
                var newDay = n.getFullYear() + '-' + m + '-' + d;
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
                varis.env = ($(e).attr('balabala-attr') == 'begin-date') ? 0 : 1;
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
            })
        }
        //日历初始化
        init(obj);
    };
