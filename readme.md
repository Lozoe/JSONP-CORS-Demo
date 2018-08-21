# JSONP 策略跨域请求

## 运行方式

1. `node server.js`

2. 更改本地hosts文件，映射本地访问为
```
  127.0.0.1  qq.com
  127.0.0.1  lz.com
  127.0.0.1  www.qq.com
```

3. 访问"http://lz.com:81/lz" ，html会根据script请求"http://qq.com:81/xxx.js" 的数据；

4. 通过script的脚本设置，实现"http://lz.com:81/lz" 对"http://qq.com" 的跨域请求。

## 实现方式
1. 声明一个封装函数jsonp，使传入的url可以自动生成一个随机请求名称的查询字符串地址；
```javascript
  function jsonp(url, fn) {
    var functionName = 'lz' + parseInt(Math.random()*100000);
    window[functionName] = fn;

    var script = document.createElement('script');
    script.src = url + '?callback=' + functionName;
    document.head.appendChild(script)
  }
```
2. 数据文件xxx.js的内容为以下格式：
```javascript
  {{callback}}({"name":"lz", "qb":500});
```

3. 在后台端加入获取查询字符串的语句，并将发送来的查询字符串名声明为callback，在响应时，让callback替换掉xxx.js的函数名。
```javascript
  if(path === '/xxx.js'){
  var string = fs.readFileSync('./xxx.js', 'utf8')
  var callback = query.callback;
  response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
  response.end(string.replace('{{callback}}', callback))
  }
```

4. 执行jsonp，传入url和一个回调函数打印出结果；
```javascript
jsonp('http://qq.com:81/xxx.js', function (data) {
  console.log('第一次的数据');
  console.log(data)
});
jsonp('http://qq.com:81/xxx.js', function (data) {
  console.log('第二次的数据');
  console.log(data)
});
```
5. 得到响应的数据为lz+一个5位随机数的执行函数；
  `lz91058({"name":"lz", "qb":500});`
    得到的控制台信息为
```javascript
第一次的数据
{name: "lz", qb: 500}
第二次的数据
{name: "lz", qb: 500}
```
## 其他方法
jQuery也为JSONP设置了对应方法，可以直接调用。
```javascript
$.ajax({
  url: 'http://qq.com:81/xxx.js',
  type: 'GET',
  dataType: 'jsonp',
  success: function(data){
    console.log('jquery得到的数据');
    console.log(data)
  }
});
```
得到的响应数据为：
```javascript
jQuery21402045766844241943_1502793793916({"name":"lz", "qb":500});
```
控制台结果为
```javascript
jqueryAPI得到的数据
{name: "lz", qb: 500}
```
## 特别说明
在OS X和Linux上可使用sudo直接监听80端口，更加简洁方便。
