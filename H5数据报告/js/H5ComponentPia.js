/**柱图组件对象*/
var H5ComponentPia= function( name, cfg ) {
  var component = new H5ComponentBase(name, cfg);
  //绘制网格线
   var w = cfg.width;
   var h = cfg.height;
   //加入画布
   var cns = document.createElement('canvas');
   var ctx = cns.getContext('2d');
   cns.width = ctx.width = w;
   cns.height = ctx.height = h;
   $(cns).css('zIndex',1);
   component.append(cns);

   var r = w/2;
   //加入底图层
   ctx.beginPath();
   ctx.fillStyle = '#eee';
   ctx.strokeStyle = '#eee';
   ctx.lineWidth = 1;
   ctx.arc(r,r,r,0,2*Math.PI);
   ctx.fill();
   ctx.stroke();

   //绘制数据层
   var cns = document.createElement('canvas');
   var ctx = cns.getContext('2d');
   cns.width = ctx.width = w;
   cns.height = ctx.height = h;
   $(cns).css('zIndex',2);
   component.append(cns);

   var colors = ['red','green','blue','#a00','orange','#000','pink'];
   var sAngel = 1.5*Math.PI;
   var eAngel = 0;
   var aAngel = Math.PI*2;

   var step = cfg.data.length;
   for (var i=0; i<step; i++) {
    var item = cfg.data[i];
    var color = item[2] || (item[2]=colors.pop());

     eAngel = sAngel + aAngel * item[1];
     ctx.beginPath();
     ctx.fillStyle = color;
     ctx.strokeStyle = color;
     ctx.lineWidth = .1;
     ctx.moveTo(r,r);
     ctx.arc(r,r,r,sAngel,eAngel);
     ctx.fill();
     ctx.stroke();
     sAngel = eAngel;

     //加入项目文本及百分比
     var text = $('<div class="text">');
     text.text(cfg.data[i][0]);
     var per = $('<div class="per">');
     per.text(cfg.data[i][1]*100+'%');
     

     var x = r + r * Math.sin(.6*Math.PI - sAngel);
     var y = r + r * Math.cos(.6*Math.PI - sAngel);
     if(x > w/2) {
      text.css('left', x/2);
     } else {
      text.css('right', (w-x)/2);
     }
     if(y > h/2) {
      text.css('top', y/2);
     } else {
      text.css('bottom', (h-y)/2);
     }
     text.css('opacity',0);
     if(cfg.data[i][2]){
      text.css('color',cfg.data[i][2]);
     }
     text.append(per);
     component.append(text);
   }

    //加入蒙板层
   var cns = document.createElement('canvas');
   var ctx = cns.getContext('2d');
   cns.width = ctx.width = w;
   cns.height = ctx.height = h;
   $(cns).css('zIndex',3);
   component.append(cns);

   ctx.fillStyle = '#eee';
   ctx.strokeStyle = '#eee';
   ctx.lineWidth = 1;
   


   var draw = function( per ) {

    ctx.clearRect(0,0,w,h);

    ctx.beginPath();
    ctx.moveTo(r,r);
    if(per<=0) {
      ctx.arc(r,r,r,0,2*Math.PI);
      component.find('.text').css('opacity',0);
    } else {
      ctx.arc(r,r,r,sAngel,sAngel+2*Math.PI*per,true);
      component.find('.text').css('opacity',1);
    }
    ctx.fill();
    ctx.stroke();
    if( per >= 1){
      component.find('.text').css('transition', 'all 0s');
      H5ComponentPia.reSort( component.find('.text') );
      component.find('.text').css('transition', 'all 1s');
      component.find('.text').css('opacity',1);
      ctx.clearRect(0,0,w,h);
    }
   }  
   draw(0);
   
 
  component.on('onLoad', function(  ) {
    //饼图生长动画
    var s = 0;
    for (var i = 0; i<100; i++) {
      setTimeout(function() {
        s+=.01;
        draw(s);
      }, i*10 + 500);
    }
  });
  component.on('onLeave', function(  ) {
    //饼图消失
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


//重排项目文本
H5ComponentPia.reSort = function ( list ) {

  //检测相交
  var compare = function ( domA, domB ) {
        if (!domB || !domA) {
      return;
    }
    //元素位置
    var offsetA = $(domA).offset();
    var offsetB = $(domB).offset();
    //domA的投影
    var shadowA_x = [ offsetA.left, $(domA).width() + offsetA.left ];
    var shadowA_y = [ offsetA.top, $(domA).height() + offsetA.top ];
    //domB的投影
    var shadowB_x = [ offsetB.left, $(domB).width() + offsetB.left ];
    var shadowB_y = [ offsetB.top, $(domB).height() + offsetB.top ];

    //检测相交
    var intersect_x = (shadowA_x[0]>shadowB_x[0] && shadowA_x[0]<shadowB_x[1]) || 
                      (shadowA_x[1]>shadowB_x[0] && shadowA_x[1]<shadowB_x[1])
    var intersect_y = (shadowA_y[0]>shadowB_y[0] && shadowA_y[0]<shadowB_y[1]) || 
                      (shadowA_y[1]>shadowB_y[0] && shadowA_y[1]<shadowB_y[1]) 
      //考虑A包裹B的情况，
    var intersect_x1 = (shadowB_x[0]>shadowA_x[0] && shadowB_x[0]<shadowA_x[1]) || 
                      (shadowB_x[1]>shadowA_x[0] && shadowB_x[1]<shadowA_x[1])
    var intersect_y1 = (shadowB_y[0]>shadowA_y[0] && shadowB_y[0]<shadowA_y[1]) || 
                      (shadowB_y[1]>shadowA_y[0] && shadowB_y[1]<shadowA_y[1])
    return (intersect_x && intersect_y) || intersect_x1 && intersect_y1;
  }

  //错开重排
  var reset = function ( domA, domB ) {

    if($(domA).css('top') !== 'auto') {
      $(domA).css('top', parseInt($(domA).css('top'))+$(domB).height())
    } else {
      $(domA).css('bottom', parseInt($(domA).css('bottom'))+$(domB).height())
    }
    
    $.each(list, function(i, domTarget) {
      console.log(compare(domTarget, list[i+1]));
      if(list[i+1] && compare(domTarget, list[i+1])) {
         reset( domTarget, list[i+1] );
      }
    })

  }

  $.each(list, function(i, domTarget) {
    if(list[i+1] && compare(domTarget, list[i+1])) {
       reset( domTarget, list[i+1] )
    }
  })
}