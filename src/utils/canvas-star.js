/**
 * @author zhangxinxu(.com)
 * @description 让Tween.js缓动算法更容易理解和使用
                需要先引入Tween.js - https://github.com/zhangxinxu/Tween/blob/master/tween.js
 * @link https://github.com/zhangxinxu/Tween/blob/master/animation.js
 */
var Tween = {
  Quad: {
    easeInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b;
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
  }
};

// 对运动方法进行封装
Math.animation = function(from, to, duration, easing, callback) {
  var isUndefined = function(obj) {
    return typeof obj == 'undefined';
  };
  var isFunction = function(obj) {
    return typeof obj == 'function';
  };
  var isNumber = function(obj) {
    return typeof obj == 'number';
  };
  var isString = function(obj) {
    return typeof obj == 'string';
  };

  // 转换成毫秒
  var toMillisecond = function(obj) {
    if (isNumber(obj)) {
      return obj;
    } else if (isString(obj)) {
      if (/\d+m?s$/.test(obj)) {
        if (/ms/.test(obj)) {
          return 1 * obj.replace('ms', '');
        }
        return 1000 * obj.replace('s', '');
      } else if (/^\d+$/.test(obj)) {
        return +obj;
      }
    }
    return -1;
  };

  if (!isNumber(from) || !isNumber(to)) {
    if (window.console) {
      console.error('from和to两个参数必须且为数值');
    }
    return 0;
  }

  // 缓动算法
  var tween = Math.tween || window.Tween;

  if (!tween) {
    if (window.console) {
      console.error('缓动算法函数缺失');
    }
    return 0;
  }

  // duration, easing, callback均为可选参数
  // 而且顺序可以任意
  var options = {
    duration: 300,
    easing: 'Linear',
    callback: function() {}
  };

  var setOptions = function(obj) {
    if (isFunction(obj)) {
      options.callback = obj;
    } else if (toMillisecond(obj) != -1) {
      options.duration = toMillisecond(obj);
    } else if (isString(obj)) {
      options.easing = obj;
    }
  };
  setOptions(duration);
  setOptions(easing);
  setOptions(callback);

  // requestAnimationFrame的兼容处理
  if (!window.requestAnimationFrame) {
    requestAnimationFrame = function(fn) {
      setTimeout(fn, 17);
    };
  }

  // 算法需要的几个变量
  var start = 0;
  // during根据设置的总时间计算
  var during = Math.ceil(options.duration / 17);

  // 当前动画算法
  // 确保首字母大写
  options.easing = options.easing.slice(0, 1).toUpperCase() + options.easing.slice(1);
  var arrKeyTween = options.easing.split('.');
  var fnGetValue;

  if (arrKeyTween.length == 1) {
    fnGetValue = tween[arrKeyTween[0]];
  } else if (arrKeyTween.length == 2) {
    fnGetValue = tween[arrKeyTween[0]] && tween[arrKeyTween[0]][arrKeyTween[1]];
  }
  if (isFunction(fnGetValue) == false) {
    console.error('没有找到名为"' + options.easing + '"的动画算法');
    return;
  }

  // 运动
  var step = function() {
    // 当前的运动位置
    var value = fnGetValue(start, from, to - from, during);

    // 时间递增
    start++;
    // 如果还没有运动到位，继续
    if (start <= during) {
      options.callback(value);
      requestAnimationFrame(step);
    } else {
      // 动画结束，这里可以插入回调...
      options.callback(to, true);
    }
  };
  // 开始执行动画
  step();
};

export function startDraw() {
  var canvas = document.querySelector("#starCanvas");
  var context = canvas.getContext("2d");

  var stars = {},
    particleIndex = 0,
    settings = {
      r: 1400, // 根据是设计稿确定的轨迹半径
      height: 260, // 露出的圆弧的高度
      density: 300,
      maxLife: 100,
      groundLevel: canvas.height,
      leftWall: 0,
      rightWall: canvas.width,
      alpha: 0.0,
      maxAlpha: 1
    };

  var getMinRandom = function() {
    var rand = Math.random();
    // step的大小决定了星星靠近地球的聚拢程度，
    // step = Math.ceil(2 / (1 - rand))就聚拢很明显
    var step = Math.ceil(1 / (1 - rand));
    var arr = [];
    for (var i = 0; i < step; i++) {
      arr.push(Math.random());
    }

    return Math.min.apply(null, arr);
  };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    settings.rightWall = canvas.width;
    settings.groundLevel = canvas.height;
    // y重新分布
    for (var i in stars) {
      stars[i].y = getMinRandom() * canvas.height;
    }
    redraw();
    // 借用
    if (canvas.width <= 480) {
      document.body.className = 'mobile';
    } else {
      document.body.className = 'pc';
    }
  }

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);

  function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function Star() {
    // 圆的轨迹方程式为：(x-a)²+(y-b)²=r²
    // 因此，已知x, 则y = Math.sqrt(r² - (x-a)²) + b;
    // 其中，圆心是(a, b)
    // 在本例子中
    // 圆心坐标是(canvas.width/2, canvas.height - 600 + r);
    var a = canvas.width / 2,
      b = canvas.height;
    // 因此，已知横坐标随机
    this.x = Math.floor(Math.random() * canvas.width);
    // 纵坐标需要在圆弧以上
    // 越往上，越稀疏
    this.y = getMinRandom() * canvas.height;

    this.vx = Math.random() * 0.1 + 0.05; // 水平偏移，也是移动速度

    // 星星的尺寸
    this.particleSize = 0.5 + (Math.random() + 0.1 / 4);
    particleIndex++;
    stars[particleIndex] = this;
    this.alpha = 0.0;
    this.maxAlpha = 0.2 + (this.y / canvas.height) * Math.random() * 0.8;
    this.alphaAction = 1;
  }

  Star.prototype.draw = function() {
    // 横坐标移动
    this.x += this.vx;
    // 根据切线方向进行偏移

    // 透明度慢慢起来
    if (this.alphaAction == 1) {
      if (this.alpha < this.maxAlpha) {
        this.alpha += 0.005;
      } else {
        this.alphaAction = -1;
      }
    } else {
      if (this.alpha > 0.2) {
        this.alpha -= 0.002;
      } else {
        this.alphaAction = 1;
      }
    }

    if (this.x + (this.particleSize * 2) >= settings.rightWall) {
      // x到左侧
      this.x = this.x - settings.rightWall;
    }

    // 绘制星星
    context.beginPath();
    context.fillStyle = "rgba(255,255,255," + this.alpha.toString() + ")";
    context.arc(this.x, this.y, this.particleSize, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  }

  function render() {

    redraw();

    // 星星的数目
    // IE下CUP性能有限，数目小
    var length = 400;
    if (!history.pushState) {
      // IE9
      length = 200;
    } else if (document.msHidden != undefined) {
      // IE10+
      length = 300;
    }

    if (screen.width < 1024) {
      length = 200;
    }
    if (screen.width < 640) {
      length = 100;
    }

    if (Object.keys(stars).length > length) {
      settings.density = 0;
    }

    for (var i = 0; i < settings.density; i++) {
      if (Math.random() > 0.97) {
        new Star();
      }
    }

    // 星星实时移动
    for (var i in stars) {
      stars[i].draw();
    }

    requestAnimationFrame(render);
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(fn) {
      setTimeout(fn, 17);
    };
  }
  render()
}
