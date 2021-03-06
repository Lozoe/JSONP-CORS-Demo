 /**
 * 功能类库
 */
 /**
  * [util 工具类]
  * @type {Object}
  */
 var util = {};

 /**
  * [function 对象浅复制]
  * @param  {[type]} target [description]
  * @param  {[type]} extObj [description]
  * @return {[type]}     [description]
  */
 util.extend = function (target, extObj) {
    for (var i in extObj) {
        if (extObj.hasOwnProperty(i)) {
            target[i] = extObj[i];
        }
    }
};

/**
 * [function 在页面中注入js脚本]
 * @param  {[type]} url     [description]
 * @param  {[type]} charset [description]
 * @return {[type]}         [description]
 */
util.createScript = function (url, charset) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    charset && script.setAttribute('charset', charset);
    script.setAttribute('src', url);
    script.async = true;
    return script;
};


/**
 * [function 获取一个随机的5位字符串]
 * @param  {[type]} prefix [description]
 * @return {[type]}        [description]
 */
util.getName = function (prefix) {
    // return prefix + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    return prefix + parseInt(Math.random() * 100000);
};

/**
 * [function 判断是否为函数]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
util.isFunction = function (source) {
return '[object Function]' === Object.prototype.toString.call(source);
};

/**
 * [function 获取url参数拼接符]
 * @param {[type]} url [description]
 */
util.getConnectUrl = function (url) {
    return url + (url.indexOf('?') > -1 ? '&' : '?');
};


/**
 * [function jsonp]
 * @param  {[type]} url      [description]
 * @param  {[type]} onsucess [description]
 * @param  {[type]} onerror  [description]
 * @param  {[type]} charset  [description]
 * @return {[type]}          [description]
 */
util.jsonp = function (url, onsuccess, onerror, charset) {
    var callbackName = util.getName('lz');
    window[callbackName] = function () {
        if (onsuccess && util.isFunction(onsuccess)) {
            onsuccess(arguments[0]);
        }
    };
    var script = util.createScript(util.getConnectUrl(url) + 'callback=' + callbackName, charset);
    script.onload = script.onreadystatechange = function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            // 移除该script的 DOM 对象
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            // 删除函数或变量
            window[callbackName] = null;
        }
    };
    script.onerror = function () {
        if (onerror && util.isFunction(onerror)) {
            onerror();
        }
    };
    document.getElementsByTagName('head')[0].appendChild(script);
};

/**
 * [json 实现ajax的ajax]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
util.ajax = function (options) {
    var opt = {
        url: '',
        type: 'get',
        data: {},
        success: function () {},
        error: function () {},
    };
    util.extend(opt, options);
    if (opt.url) {
        var xhr = XMLHttpRequest
           ? new XMLHttpRequest()
           : new ActiveXObject('Microsoft.XMLHTTP');
        var data = opt.data,
            url = opt.url,
            type = opt.type.toUpperCase(),
            dataArr = [];
        for (var k in data) {
            dataArr.push(k + '=' + data[k]);
        }
        if (type === 'GET') {
            url = url + '?' + dataArr.join('&');
            xhr.open(type, url.replace(/\?$/g, ''), true);
            xhr.send();
        }
        if (type === 'POST') {
            xhr.open(type, url, true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(dataArr.join('&'));
        }
        xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 304) {
                var res;
                if (opt.success && opt.success instanceof Function) {
                    res = xhr.responseText;
                    if (typeof res === 'string') {
                        res = JSON.parse(res);
                        opt.success.call(xhr, res);
                    }
                }
            } else {
                if (opt.error && opt.error instanceof Function) {
                    opt.error.call(xhr, res);
                }
            }
        };
    }
};

window.util = util;
