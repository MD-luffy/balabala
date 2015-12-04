balabala V1.1使用介绍
==
#一、介绍
balabala是一款基于`zepto`的移动端滑动日历插件，秉着简单够用的原则，比较小巧，压缩后只有7K。
#二、使用
1、	引用文件：
```html
<script type="text/javascript" src="zepto.min.js"></script>
<script type="text/javascript" src="balabala.js"></script>
<link rel="stylesheet" type="text/css" href="balabala.css" />
```
2、	Html写法：
```html
<div>
        <span class="balabala-select " balabala-attr="begin-date"></span>
        <span>至</span>
        <span class="balabala-select " balabala-attr="end-date"></span>
</div>
```
注：其中balabala-select和balabala-attr为必填属性<br>

3、接收参数：<br>
* theme:主题，具体颜色值，类型string, 如#fff（若为空，则默认为#31b6e7）<br>
* beginDay:开始日期（若为空，则默认起始日期为八天之前）<br>
* endDay:结束日期（若为空，则默认结束日期为昨天）<br>
* callback: 确认按钮callback（若为空，则只设置日期，无函数响应）<br>

4、初始化函数：
```javascript
$('.balabala-select').balabala(datePicker);
```

5、销毁日历函数：
```javascript
$('.balabala-select').destroyCalendar();
```

注：同一个页面要想使用多个日历，必须在初始化一个新的日历之前调用destroyCalendar()来销毁当前的日历<br>
