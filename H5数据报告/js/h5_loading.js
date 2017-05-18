var h5_loading = function (images, firstPge) {
   var id = this.id;
   if (this._images === undefined) {
     this._images = ( images || [] ).length;
     this._loaded = 0;

     //把当前对象存储在全局对象window中，用来进行某个图片加载完成后得回调
     window[id] = this;
      for (s in images) {
        var item = images[s];
        var img = new Image;
        img.onload = function() {
          //当一张图片加载完成后，当前id的H5触发loader事件，进入else逻辑
          // debugger;
          window[id].loader();
        }
        img.src = item;
      }
      $('#rate').text('0%');

      return this;
   } else { 
      this._loaded++;
      //此时（又）加载成功一张图片，this._loaded加1，并与总图片数相比，得出加载进度
      $('#rate').text( ( (this._loaded / this._images * 100) >> 0 ) + '%' );
      //当this._loaded的大小不小于this._images时，说明图片全部加载完成，退出并将widow[id]=null；
      if(this._loaded < this._images) {
        return this;
      }
      window[id] = null;
   }; 


    this.el.show();
    this.el.fullpage({
        onLeave: function (index, nextIndex,  direction) {
          $(this).find('.h5_component').trigger('onLeave');
        },
        afterLoad: function (anchorLink, index) {
          $(this).find('.h5_component').trigger('onLoad');
        }
    });
    // debugger;
    this.page[0].find('.h5_component').trigger('onLoad'); 
    if(firstPge) {
      $.fn.fullpage.moveTo( firstPge );
    };
}