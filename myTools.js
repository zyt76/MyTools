// 这是一个获取兼容性样式的函数
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj)[attr];
    }
}
function first(obj) {
    var ele = obj.firstElementChild || obj.firstChild;
    if (ele && ele.nodeType == 1) {
        return ele;
    } else {
        return null;
    }
}
function last(obj) {
    var ele = obj.lastElementChild || obj.lastChild;
    if (ele && ele.nodeType == 1) {
        return ele;
    } else {
        return null;
    }
}
function prev(obj) {
    var ele = obj.previousElementSibling || obj.previousSibling;
    if (ele && ele.nodeType == 1) {
        return ele;
    } else {
        return null;
    }
}
function next(obj) {
    var ele = obj.nextElementSibling || obj.nextSibling;
    if (ele && ele.nodeType == 1) {
        return ele;
    } else {
        return null;
    }
}
function $(selector, parent) {
    // 如果想从某个元素里面去获取标签名，那么你需要传入特定的父级
    // 大部分情况下是从整个文档下获取，所以最好在内部处理一下
    // 如果没有传入父级，那么从文档下获取标签
    // 如果传入了父级，那么从传入的父级下获取标签
    parent = parent || document;
    if (selector[0] == "#") {
        return document.getElementById(selector.substring(1));
    } else {
        return parent.getElementsByTagName(selector);
    }
}
// 这是封装了一个解绑的函数
function unbind(obj, evType, evFn) {
    if (obj.removeEventListener) {
        obj.removeEventListener(evType, obj[String(evFn)], false);
    } else if (obj.detachEvent) {
        obj.detachEvent("on" + evType, obj[String(evFn)]);
    } else {
        obj["on" + evType] = null;
    }

}

// 这是一个绑定方式的兼容性函数
function bind(obj, evType, evFn) {
    // 根据浏览器能力进行检测  如果识别支持addEventListener 就直接使用这个绑定方式
    // 如果不支持这个方法 则按照后面的方式进行绑定

    obj[String(evFn)] = function () {
        evFn.call(obj);
    }

    if (obj.addEventListener) {
        // 标准浏览器走这个绑定
        obj.addEventListener(evType, evFn, false);
        obj[String(evFn)] = evFn;
    } else if (obj.attachEvent) {
        //IE6 7 8 走这个绑定方式
        obj.attachEvent("on" + evType, obj[String(evFn)]);
    } else {
        // 以上方法都不支持的很老的浏览器 走这个方法
        obj["on" + evType] = evFn;

    }
}
function move(obj, attr, speed, target, callback) {
    // obj.timer = null;
    clearInterval(obj.timer);
    // 获取的是起始位置
    var dis = parseFloat(getStyle(obj, attr));
    // 通过判断起始点和目标点谁大
    speed = dis > target ? -speed : speed;
    obj.timer = setInterval(function () {
        dis += speed;
        if (dis >= target && speed > 0 || dis <= target && speed < 0) {
            dis = target;
        }
        obj.style[attr] = dis + "px";
        if (dis == target) {
            // 如果到达目标点了,则清除定时器
            clearInterval(obj.timer);
            obj.timer = null;
            // 说明这次当前的运动已经运动完毕了
            callback && callback();
        }
    }, 30)
}
function startMove(obj, json, callback) {
    var cur = 0;
    var speed;
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        // 传入多个属性名和属性值，然后在定时器里面循环变脸这个对象，每一次定时器执行的时候
        // 都会遍历一次所有属性，让所有的属性都动一次
        var onOff = true;
        for (var attr in json) {
            var target = json[attr];
            // 判断attr，如果传入的属性是透明度
            if (attr == "opacity") {
                cur = Math.round(getStyle(obj, attr) * 100);
                // 解决办法，获取透明度opacity，是个小数，乘以100转换成整数
                // 参与运算，除以100再赋值回去
            } else {
                cur = parseFloat(getStyle(obj, attr));
            }
            console.log(cur + ":" + speed);
            speed = (target - cur) * 0.1;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

            if (cur != target) {
                onOff = false;
                if (attr == "opacity") {
                    obj.style.opacity = (cur + speed) / 100;
                    obj.style.filter = "alpha(opacity=" + (cur + speed) + ")";
                } else {
                    obj.style[attr] = cur + speed + "px";
                }
            }
        }
        if (onOff) {
            clearInterval(obj.timer);
            obj.timer = null;
            typeof callback == "function" && callback();
        }
    }, 30)
}