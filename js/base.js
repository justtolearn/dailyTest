;(
    function() {
        var $form_add = $('.add-task'),
            task_list = [],
            $task_detail = $(".task-detail"),
            current_index,
            $update_form,
            $task_detail_content,
            $hide_btn = $(".hide-btn"),
            $info = $('.info'),
            $msg_content = $info.find('.msg_content'),
            $msg_close = $info.find('.msg_close'),
            $alerter = $('.alerter'),
            $body = $('body'),
            $window = $(window);

        init();
        //添加item
        $form_add.on("submit",function(e) {
            e.preventDefault();
            var $cont =  $(this).find('input[name=content]'),
                new_task = {};
          new_task.form_content =  $cont.val().trim();
           if(!new_task.form_content) return ;
            /*存入合法值*/
            if(add_task(new_task)){
                $cont.val("");
            }
        });

        function add_task(new_task) {
            //将新task推入task-list,并更新列表
            task_list.push(new_task);    
            refresh_task_list()
            return true;
        }

        function listen_remind_msg () {
            $msg_close.on('click', function () {
                hide_msg()
            })
        }
        function listen_task_list() {
            $("span.delete").on('click',function(){
                var $item =   $(this).parent();
                var index = $item.data('index');
                pop("确定删除吗？").then(function(r) {
                     r ? delete_task(index):null;
                }) 
            })
        }

        function listen_task_detail() {
            var index;
            $('.task-item').on('dblclick',false, function() {
                index = $(this).data('index');
                show_task_detail(index);
            });
            $(".action.detail").on('click',function() {
                var $this = $(this);
                var $items = $this.parent();
                var index = $items.data('index');
                //console.log(index);
                show_task_detail(index);
            })
        }

        //监听事件是否完成
        function listen_task_complete () {
            var $complete = $('.complete');
            $complete.on('dblclick click', function (e) {
                e.stopPropagation();
                var index = $(this).parent().parent().data('index'),$this = $(this),
                iscompleted = $this.is(':checked');
                update_task(index, {complete: iscompleted});
            })              
        }

        function show_task_detail(index) {
            //生成详情模板
            render_task_detail(index);
            current_index = index;
            $task_detail.show();
            $(".hide-btn").show();
            return false;
        }  

        function hide_task_detail(index) {
            $task_detail.hide();
            $hide_btn.hide();
        }

        $hide_btn.on('click',hide_task_detail);

        function update_task (index, data) {

            if(index===undefined || !task_list[index]) return; 
            task_list[index] = $.extend({}, task_list[index], data);   
            refresh_task_list();
            hide_task_detail();
        }
        /*刷新localStorage，更新模板*/
        function refresh_task_list() {
            store.set('task_list',task_list);//'task_list'后多了个空格，导致每次刷新都会重置数据；
            render_task_list();
        }

        function delete_task(index) {
            if(index===undefined || !task_list[index]) return;

           // delete task_list[index];//使用delete删除，数组长度不变，只是将对应得值变为null
            task_list.splice(index,1)
            refresh_task_list()
   
        }
        function init() {
          //  store.clear();
            task_list = store.get('task_list') || [];
            listen_remind_msg(); 
            task_remind_check();
            if(task_list.length){
                render_task_list();    
            }
        }

        //监听定时事件完成后，执行相应函数
        function task_remind_check() {
            var curren_timetamp;
            var itl = setInterval( function () {
              for (var i = 0; i<task_list.length; i++) {
                var item = task_list[i], task_timetamp;

                if(!item || !item.remind_data || item.informed) {
                    continue;
                }
                curren_timetamp = (new Date().getTime());
                
                task_timetamp = (new Date(item.remind_data)).getTime();
                console.log(curren_timetamp+":"+task_timetamp)
                if(curren_timetamp - task_timetamp >= 1) {
                    //到目标时间，将complete置为true
                    item.complete = true;
                    //更新task,该item添加{informed: true}，表明该事情已完成
                    update_task(i,{informed: true});

                    show_msg(item.content);
                }
              }  
            },300)
            
        }

        function show_msg (con) {
            $info.show();
            $alerter.get(0).play();
            console.log($alerter.get(0));
            $msg_content.html(con);
        }
        function hide_msg () {
            $alerter.get(0).pause();
            $info.hide();
        }

        //渲染列表
        function render_task_list() {
     
            var $task_list = $(".task-list"),completed_task = [],n=0;//出现上下横杠问题，导致无法获取对象
            $task_list.html("");
            for(var i=0 ;i<task_list.length;i++){
                if(task_list[i].complete) {
                    task_list[i].informed = true;
                    (function completed() {
                        completed_task[n++] = task_list[i]
                    })(i);
                    // console.log(completed_task);
                    continue;
                } 
                var $task = render_task_item(task_list[i],i);
                $task_list.append($task);
              

            }  
            console.log(task_list);
            // for(var j=0, k = completed_task.length; j < k; j++){
            //    if(completed_task[j].complete) {
            //        var $task1 = render_task_item(completed_task[j],j);
            //        console.log($task1);
            //       // $task1.addClass('completed');  
            //      } 

            //      $task_list.append($task1);
            //  }
            for(var j=0, k = task_list.length; j < k; j++){
               if(task_list[j].complete) {
                   var $task1 = render_task_item(task_list[j],j);
                   $task1.addClass('completed');  
                 } 

                 $task_list.append($task1);
            }
            listen_task_list ();
            listen_task_detail ();
            listen_task_complete ();
        }

        
        

        function render_task_detail(index) {
            if(index===undefined || !task_list[index]) return;
            var item = task_list[index];
            var tpl = '<form>'+
                '<div class="content">'+item.form_content+
                '</div>'+
                '<div style="display: none" class="content_input"><input name="content" type="text" value="'+(item.form_content || '')+'"/></div>'+
                '<div>'+
                    '<div class="desc">'+
                        '<textarea name="desc">'+(item.desc || '')+'</textarea>'+
                   '</div>'+
                '</div>'+
                '<div class="remind">'+
                    '<input type="text" placeholder="选择截止时间" class="datetime" name="remind" value="'+(item.remind_data || '')+'"/>'+
                    '<button type="submit">更新</button>'+
                '</div>'+'</form>';

            //$task_detail.html('');
            $task_detail.html(tpl);
            $('.datetime').datetimepicker();

            $update_form = $task_detail.find('form');
            $task_detail_content = $update_form.find('.content');
            $task_detail_input = $update_form.find('.content_input');
            //双击内容元素，出现input输入框，更改内容
            $task_detail_content.on('dblclick', function () {
                $task_detail_input.show();
                $task_detail_content.hide();
            })

            $update_form.on('submit', function(e) {
                e.preventDefault();
                var data = {};
                data.form_content = $(this).find('[name="content"]').val();
                data.desc = $(this).find('[name="desc"]').val();
                data.remind_data = $(this).find('[name="remind"]').val();
                update_task(index, data);
            })

        }

        function render_task_item(data,index) {

            if(!data && !index) return;//使用！data||！index时，当index为0时，无法添加进去
            var list_item_tpl =  '<div class="task-item" data-index="'+index+'">'+
                '<span><input class="complete" '+(data.complete ? 'checked' : '')+' type="checkbox"/></span>'+
                '<span class="task-content">'+data.form_content+'</span>'
           + '<span class="action delete">删除</span>'
            +'<span class="action detail">详情</span>'
           + '</div>';
            return $(list_item_tpl);
        }

        //自定义alert函数,使用 $.Deferred()
        /**
         * [pop description]
         * @param  {[string]} arg [弹框标题]
         * @return {[dfd.promise();]}     [description]
         */
        function pop(arg) {
            if(!arg) {
                console.error('arg is musted');

            }
            var conf = {}, $box, $mask, $title, $content,
                        $confirm, 
                        $cancel,
                        confirmed,
                        timer,
                        dfd = $.Deferred();
                        
            if(typeof arg === 'string') {
                conf.title = arg;
            } else {
                conf = $.extend(conf, arg);
            }
            $box = $('<div>'+
                    '<div class="pop-title">'+conf.title+'</div>'+
                    '<div class="pop-content">'+
                    '<div><button class="confirm">确认</buttton>'+
                    '<button class="cancel">取消</buttton></div>'+
                    '</div>'+
                '</div>').css({
                width: 300,
                height: 200,
                color: '#000',
                background: '#fff',
                position: 'fixed',
                'border-radius': '3px',
                'box-shadow': '0 1px 2px rgba(0, 0, 0, 0.5)'
            }); 
          
            $mask = $('<div>').css({
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                position: 'fixed'
            });  
            $mask.appendTo($body);
            $box.appendTo($body);

            $title = $box.find('.pop-title').css({
                padding: '5px 10px',
                'font-weight': 900,
                margin: '30px',
                'text-align': 'center'
            });
            $content = $box.find('.pop-content').css({
                padding: '5px 10px',
                'text-align': 'center'
            })
           $confirm = $content.find('.confirm');
           $cancel = $content.find('.cancel');

           timer = setInterval(function () {
               if(confirmed !== undefined) {
                dfd.resolve(confirmed);
                clearInterval(timer);
               }
           },50)

           $confirm.on('click', confirm_btn);
           $cancel.on('click', cancle_btn);
           $mask.on('click', cancle_btn);

           function confirm_btn(){
             confirmed = true;
             dismiss_pop();
           }
           function cancle_btn(){
             confirmed = false;
             dismiss_pop();
           }
            adjust_box();
            $window.on('resize', function () {
                adjust_box();
            });
            function adjust_box() {
                var window_w = $window.width(),
                    window_h = $window.height(),
                    $box_w = $box.width(),
                    $box_h = $box.height(),
                    move_x, move_y;
                move_x = (window_w - $box_w)/2;
                move_y = (window_h - $box_h)/2-60;
                //console.log($body.width());
                $box.css({
                    top: move_y,
                    left: move_x
                });
            }
            function dismiss_pop() {
                $mask.remove();
                $box.remove();
            }
            
            return dfd.promise();
        }

    }

)();
