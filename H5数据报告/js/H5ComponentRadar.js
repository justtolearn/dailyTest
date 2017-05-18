/**柱图组件对象*/
var H5ComponentRadar= function( name, cfg ) {
  var component = new H5ComponentBase(name, cfg);
  //绘制网格线
   var w = cfg.width;
   var h = cfg.height;
   //加入画布
   var cns = document.createElement('canvas');
   var ctx = cns.getContext('2d');
   cns.width = ctx.width = w;
   cns.height = ctx.height = h;
   component.append(cns);

   var r = w/2;
   var step = cfg.data.length;
   ctx.beginPath();
   ctx.arc(r,r,5,0,2*Math.PI);
   ctx.stroke();

   ctx.beginPath();
   ctx.arc(r,r,r-5,0,2*Math.PI);
   ctx.stroke();

   /*
   计算一个圆周上的坐标
   1.已知 圆心坐标（a,b）,半径r，角度deg
   2.rad = (2*Math.PI/360) * (360/step) *i
   3.x = a + Math.sin(rad)*r
   4.y = b + Math.cos(rad)*r
    */
   //绘制网格背景（分面绘制，分为10份）
   var isBlue = false;
   for (var s=10; s>0;s--) {
      ctx.beginPath();
     for (var i = 0 ; i < step; i++) {
      var rad = (2*Math.PI/360) * (360/step) *i;
      var x = r + Math.sin(rad) * r * (s/10);
      var y = r + Math.cos(rad) * r * (s/10);
      // ctx.arc(x,y,5,0,2*Math.PI);
      ctx.lineTo(x,y);
     
     };
     ctx.closePath();
     ctx.fillStyle = (isBlue = !isBlue)?'#99c0ff':'#f1f9ff';
     ctx.fill();
   }
   //绘制伞骨
   for (var i=0;i<step;i++) {
    var rad = (2*Math.PI/360) * (360/step) *i;
    var x = r + Math.sin(rad) * r;
    var y = r + Math.cos(rad) * r;
    ctx.moveTo(r,r);
    ctx.lineTo(x,y);
    //输出项目文字
    var text = $('<div class="text">');
    text.text(cfg.data[i][0]+'~'+cfg.data[i][1]*100+'%');
    // text.css({
    //   'left':
    // })
    if(x > w/2) {
      text.css('left',x/2 + 5);
    } else {
      text.css('right',(w-x)/2 + 5);
    } 
    if(y > h/2) {
      text.css('top',y/2 + 5);
    } else {
      text.css('bottom',(h-y)/2 + 5);
    }
    if(cfg.data[2]) {
      text.css('color',cfg.data[i][2]);
    }
    text.css('opacity',0);
    text.css('transition', 'all '+(0.5+i*.1) +'s');
    component.append(text);
    ctx.strokeStyle = '#e0e0e0';
    // ctx.stroke();  
   }
  
  

   //数据层开发
   var cns = document.createElement('canvas');
   var ctx = cns.getContext('2d');
   cns.width = ctx.width = w;
   cns.height = ctx.height = h;
   component.append(cns);

   ctx.strokeStyle = '#f00';
   
   var draw = function( per ) {
    if(per >= 1) {
      component.find('.text').css('opacity',1);
    }
    if(per <= 1) {
      component.find('.text').css('opacity',0);
    }
    ctx.clearRect(0,0,w,h);
    //输出数据的折线
    for (var i = 0; i < step; i++) {
      var rad = (2*Math.PI/360) * (360/step) *i;
      var rate = cfg.data[i][1] * per;
      var x = r + Math.sin(rad) * r * rate;
      var y = r + Math.cos(rad) * r * rate;
      ctx.lineTo(x,y);
      ctx.arc(x,y,5,0,2*Math.PI);
   }  
   ctx.closePath();
   ctx.stroke();

   //输出数据的点
   ctx.fillStyle = '#ff7676';
    for (var i=0; i < step; i++) {
      var rad = (2*Math.PI/360) * (360/step) *i;
      var rate = cfg.data[i][1] * per;
      var x = r + Math.sin(rad) * r * rate;
      var y = r + Math.cos(rad) * r * rate;
      ctx.beginPath();
      ctx.arc(x,y,5,0,2*Math.PI);
      ctx.fill();
    } 
    ctx.closePath();
    ctx.stroke();
  } 
  component.on('onLoad', function() {
    //雷达图生长动画
    for (var i = 0; i<100; i++) {
      setTimeout(function() {
        s+=.02;
        draw(s);
      }, i*10 + 500);
    }
  });
  component.on('onLeave', function() {
    //雷达图消失
    for (var i = 0; i<100; i++) {
      setTimeout(function() {
        s-=.02;
        draw(s);
      }, i*10 + 500);
    }    
  });
  return component;
}