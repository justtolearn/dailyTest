/**散点图图文组件对象*/
var H5ComponentPoint= function( name, cfg ) {
  var component = new H5ComponentBase(name, cfg);
  var base = cfg.data[0][1];//以第一个数据比例大小的100%
  
  $.each( cfg.data, function( idx, item ) {
    var point = $('<div class="point point_'+idx+'">');
    var per = (item[1]/base*100) + '%';
    var name = $('<div class="name">'+item[0]+'</div>');
    var rate = $('<div class="per">'+item[1]*100+'%</div>');
    
    name.append(rate);
    point.append(name);
    
    point.width(per).height(per);
    
    if(item[2]) {
      point.css('backgroundColor', item[2]);
    }
    if(item[3] !== undefined && item[4]!== undefined) {
      $.data(point[0],{'left':item[3],'top':item[4]})
      $(point).addClass('before');
      //point.css('left',item[3]).css('top',item[4]);
    }

  component.on('onLoad', function () {

    var point = $(this).find('.point');
    $(point.get(1)).addClass('come1').removeClass('before');
    $(point.get(2)).addClass('come2').removeClass('before');
    return false;
  })
  component.on('onLeave', function () {
    var point = $(this).find('.point');
    $(point.get(1)).addClass('before').removeClass('come1');
    $(point.get(2)).addClass('before').removeClass('come2');
    return false;
  })
    component.append(point)
  } )

  return component;
}