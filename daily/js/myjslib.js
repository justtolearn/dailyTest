/**
 * Created by te on 2016/10/25.
 */
function doMove(obj,attr,dir,target,endFun) {
    dir = parseInt(getStyle(obj, attr)) > target ? -dir : dir;
    clearInterval(obj.timer);
    obj.timer = setInterval(
        function () {
            var speed = parseInt(getStyle(obj, attr)) + dir;
            if (speed > target && dir > 0 || speed < target && dir < 0) {
                speed = target;
            }
            obj.style[attr] = speed + "px";
            if (speed == target) {
                clearInterval(obj.timer);
                endFun && endFun();
            }

        }, 10)

}
function getStyle(obj,strr){
    return obj.currentStyle?obj.currentStyle[strr]:getComputedStyle(obj)[strr];
}