/**柱图组件对象*/
var H5ComponentPolyline= function( name, cfg ) {
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
   //水平网格线 100分 =》 10份
   var step = 10;
   ctx.beginPath();
   ctx.lineWidth = 1;
   ctx.strokeStyle = "#AAAAAA";

   window.ctx = ctx;
   for (var i = 0; i <= step+1; i++) {
     var y = (h/step) * i;
     ctx.moveTo(0,y);
     ctx.lineTo(w, y);
   }; 
   //垂直网格线-背景层
   step = cfg.data.length+1;
   var text_w = w/step >> 0;
   for (var j = 0; j <= step+1; j++) {
     var z = (w/step) * j;
     ctx.moveTo(z,0);
     ctx.lineTo(z, h);
     if(cfg.data[j]) {
      
      var text = $('<div class="text">');
      text.text(cfg.data[j][0]);
      text.css('width',text_w/2).css('left',(z/2+text_w/4));
      component.append(text);
     }
     
   };
   ctx.stroke();
  
  //加入画布-数据层
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height = h;
  component.append(cns);

  //绘制折线数据
  /**
   * 绘制折线及对应数据和阴影
   * @param  {[float]} per [0-1，根据这个值绘制最终数据对应的中间状态]
   * @return {[dom]}     [component元素]
   */
  var draw = function(per) {
    //清空画布
    ctx.clearRect(0,0,w,h);
    //绘制折线数据
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ff8878';
    var x=0, y=0,
      row_w = w / (cfg.data.length+1);
    // 画点
     for(i in cfg.data) {
      var item = cfg.data[i];
      // console.log(item);
      x = row_w * i + row_w;
      y = h - h*item[1]*per;
      ctx.moveTo(x, y);
      ctx.arc(x,y,5,0,2*Math.PI);
     }
   
     //连线
      //移动画笔到第一个点位置
      ctx.moveTo(row_w, (h-cfg.data[0][1]*per*h));
      // ctx.arc(10,10,5,0,2*Math.PI);
      for (i in cfg.data) {
        var item = cfg.data[i];
        x = row_w * i + row_w;
        y = h - h*item[1]*per;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 115, 120, 0)';
      //绘制阴影
      ctx.lineTo(x, y);
      ctx.lineTo(x, h);
      ctx.fillStyle = 'rgba(255, 115, 120, 0.2)';
      ctx.lineTo(row_w, h);

      ctx.fill();
      //写数据
      for(i in cfg.data) {
        var item = cfg.data[i];
        x = row_w * i + row_w;
        y = h - h*item[1]*per;
        ctx.fillStyle = item[2] ? item[2] : '#595959';
        ctx.fillText((item[1]*100)+'%', x-10, y-10);
      }
     ctx.stroke();

  }
  draw(0);

  component.on('onLoad', function() {
    //雷达图生长动画
    var s = 0;
    for (var i = 0; i<100; i++) {
      setTimeout(function() {
        s+=.01;
        draw(s);
      }, i*10 + 500);
    }
  });
  component.on('onLeave', function() {
    //雷达图消失
    var s = 1;
    for (var i = 0; i<100; i++) {
      setTimeout(function() {
        s-=.01;
        draw(s);
      }, i*10 + 500);
    }    
  });
  return component;
}