require(['FFF', 'zepto', 'fastclick'], function(FFF, $, fc) {
    fc.attach(document.body);
    var F = FFF.FFF;
    var widget = F.Widget;

    function Box(){
        widget.apply(this, arguments);
    }
    function Header(){
        widget.apply(this, arguments);
    }
    Header.ATTRS = {
        boundingBox: {
            value: $(
        '<div class="header_num">总数：<span id="header_num">0</span></div><div class="header_btn"> ' +
        '<button class="btn btn_green btn_large_font" id="btn_add">+</button> ' +
        '<button class="btn btn_red btn_large_font" id="btn_del">-</button> ' +
        '</div> <div class="header_change"> <div class="onoffswitch"> ' +
        '<input type="checkbox" name="btn_change" class="onoffswitch-checkbox" id="btn_change" checked> ' +
        '<label class="onoffswitch-label" for="btn_change"> ' +
        '<span class="onoffswitch-inner"></span> ' +
        '<span class="onoffswitch-switch"></span> ' +
        '</label> ' +
        '</div> ' +
        '</div>')
        },
        //盒子总数
        total:{
            value:'0',
            changeFn: function(obj){
                var headerBox = this.getBoundingBox();
                headerBox.find("#header_num").html(obj.value)
            }
        },
        //盒子列表
        boxList:{
            value:[]
        }
    };
    Box.ATTRS = {
        boundingBox: {
            value: $(
                '<div class="box">' +
                '<div class="box_main"><input type="checkbox" class="checkbox check_item" name="check" ><button type="button" class="btn_delete">X</button></div>' +
                '<div class="box_footer">' +
                '<div class="box_footer_btn"><button class="btn btn_red btn_large">红色</button></div>' +
                '<div class="box_footer_btn"><button class="btn btn_yellow btn_large">黄色</button></div>' +
                '</div>' +
                '</div>'
            )
        },
        backImg: {
            value: '',
            changeFn: function (obj) {
                this.getBoundingBox().find(".box_main").css('background-image', 'url(../img/'+obj.value+")");
            }
        },
        status:{
            value:'0',
            changeFn: function(obj){
                var box_main  = this.getBoundingBox();
                if(obj.value == 1){
                    box_main.find("input[name=check]").prop("checked", true)
                }else{
                    box_main.find("input[name=check]").prop("checked", false)
                }
            }
        },
        btn_del:{
          value:'0',
            changeFn: function(obj){
                var box_main  = this.getBoundingBox();
                if(obj.value == 1){
                    box_main.find(".btn_delete").css("display",'block')
                }else{
                    box_main.find(".btn_delete").css("display",'none')
                }
            }
        }
    };

    F.extend(Header, widget, {
        bindUI: function (){
            var that = this;
            var temp, box_index =[];
             var headerBox = that.getBoundingBox();
            headerBox.find("#btn_add").on("click", function () {
                that.setTotal(+that.getTotal()+1);
                temp = new Box();
                that.getBoxList().push(temp);
                temp.render({
                    container: $("#contain"),
                    type: 'append'
                });
                console.log(that.getBoxList())
            });
            headerBox.find("#btn_del").on("click", function () {

                that.getBoxList().forEach(function (value, i) {
                    if (value.getStatus() == '1') {
                        value.destroy();
                        box_index.push(i);
                    }
                });
                for(var i = 0;i < box_index.length; i++){
                    that.setTotal(+that.getBoxList().length - 1);
                    that.getBoxList().splice(box_index[i] - i, 1);
                }
                box_index = [];
            });
            headerBox.find("#btn_change").on("click", function () {
                var input_check = $("input[name='check']");
                input_check.forEach(function (value, i, arr) {
                    if($(arr[i]).prop("checked")){
                        //$(arr[i]).removeAttr("checked");
                        $(arr[i]).prop("checked",false);
                        that.getBoxList()[i].setStatus(0);
                    }else{
                        $(arr[i]).prop("checked",'true');
                        that.getBoxList()[i].setStatus(1);
                    }
                });
            });
        }
    });
    F.extend(Box, Header,{
        initialize: function () {
            this.setBackImg('file_yellow.png');
        },
        bindUI: function(){
            var that = this;
            var box_main =  that.getBoundingBox();
           box_main.on('mouseover', function () {
               that.setBtn_del(1);
            });
            box_main.on('mouseout', function () {
                that.setBtn_del(0);
            });

            box_main.find(".btn_red").on('click', function () {
                that.setBackImg("file_red.png");
            });
            box_main.find(".btn_yellow").on('click', function () {
                that.setBackImg("file_yellow.png");
            });
            box_main.find(".btn_delete").on('click', function () {
                header_box.setTotal(header_box.getTotal()-1);
                header_box.getBoxList().splice(box_main.index(), 1);

               box_main.remove();

            });

            box_main.find("input[name='check']").on('click', function () {
                if($(this).prop("checked")){
                    that.setStatus("1");
                }else{

                    that.setStatus("0");

                }
            })
        },
        destructor: function () {
            var $header_num = $("#header_num");
            $header_num.html(+$header_num.html() - 1)
        }
    });

    var header_box = new Header();
    header_box.render({
        container: $("#header"),
        type:'append'
    });


});
