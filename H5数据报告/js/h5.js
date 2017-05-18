/**内容管理对象*/
var H5 = function() {
   this.id = ('h5_'+Math.random()).replace('.','_');
   this.el = $('<div class="h5" id="'+this.id+'">').hide();
   this.page = [];
   $('body').append( this.el );

   /**
    * [addPage 新增一个页]
    * @param {[string]} name [组件名称，会加入到ClassName中]
    * @param {[string]} text [页面默认文本]
    * @return {H5} [H5对象，可以重复使用H5对象支持的方法]
    */
   this.addPage = function(name, text) {
    var page = $('<div class="h5_page section">');
    if( name != undefined ) {
      page.addClass('h5_page_'+name);
    };
    if( text != undefined ) {
      page.text(text);
    };
    this.el.append(page);
    this.page.push(page);
    if ( typeof this.whenAddPage === 'function' ) {
      this.whenAddPage();
    };
    return this;
   }
   /*新增一个组件*/
   this.addComponent = function (name, cfg) {
     var cfg = cfg || {};
     cfg = $.extend({
      type: 'base'
     }, cfg);
     var component;
     var page = this.page.slice(-1)[0];
     switch(cfg.type) {
        case 'base':
          component = new H5ComponentBase(name, cfg);
        break;
        case 'polyline':
          component = new H5ComponentPolyline(name, cfg);
        break; 
        case 'pia':
          component = new H5ComponentPia(name, cfg);
        break;
        case 'bar':
          component = new H5ComponentBar(name, cfg);
        break;
        case 'bar-v1':
          component = new H5ComponentBar(name, cfg);
        break;
        case 'radar':
          component = new H5ComponentRadar(name, cfg);
        break; 
        case 'ring':
          component = new H5ComponentRing(name, cfg);
        break;
        case 'point':
          component = new H5ComponentPoint(name, cfg);
        break;
        default:
     }
    page.append(component);
    return this;
   }

   /*H5对象初始化呈现*/
   this.loader = function( firstPge ) {
    this.el.show();
    this.el.fullpage({
        onLeave: function (index, nextIndex,  direction) {
          $(this).find('.h5_component').trigger('onLeave');
        },
        afterLoad: function (anchorLink, index) {
          $(this).find('.h5_component').trigger('onLoad');
        }
    });
    this.page[0].find('.h5_component').trigger('onLoad'); 
    if(typeof firstPge === 'number') {
      $.fn.fullpage.moveTo( firstPge );
    }
   }
   // debugger;
   this.loader = typeof h5_loading === 'function' ? h5_loading : this.loader;
   return this;
}