/*About页面轮播插件*/
(function($,win) {
    /*说明:获取浏览器前缀*/
    /*实现：判断某个元素的css样式中是否存在transition属性*/
    /*参数：dom元素*/
    /*返回值：boolean，有则返回浏览器样式前缀，否则返回false*/
    'use strict';
    var _prefix = win.ZhaoXueTong.prefix;

    var Carousel = (function () {
        function Carousel(element, options) {
            this.settings = $.extend(true, $.fn.Carousel.defaults, options || {})
            this.element = element;
            this.canscroll = true;
            this.init();
        }

        Carousel.prototype = {
            init: function () {
                var me = this;
                me.selectors = me.settings.selectors;
                me.sections = me.element.find(me.selectors.sections);
                me.section = me.sections.find(me.selectors.section);

                me.direction = me.settings.direction == 'vertical' ? true : false;
                me.pagesCount = me._pagesCount();
                me.index = (me.settings.index >=0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;

                me.canMove = true;

                if(!me.direction || me.index){
                    me._initLayout();
                }

                if(me.settings.pagination){
                    me._initPaging();
                }

                if(me.settings.controller){
                    me._initControling();
                }

                me._initEvent();
            },

            /*说明：获取滑动模块数量*/
            _pagesCount : function(){
                return this.section.length;
            },
            /*说明：获取滑动的宽度（横屏滑动）或高度（竖屏滑动）*/
            switchLength : function(){
                return this.direction == 1 ? this.element.height() : this.element.width();
            },
            /*说明：向前滑动即上一页*/
            prev : function(){
                var me = this;
                if(me.index > 0){
                    me.index--;
                }else if(me.settings.loop){
                    me.index = me.pagesCount - 1;
                }
                me._scrollPage();
            },
            /*说明：向后滑动即下一页*/
            next : function(){
                var me = this;
                if(me.index < me.pagesCount-1){
                    me.index++;
                }else if(me.settings.loop){
                    me.index = 0;
                }
                me._scrollPage();
            },
            /*说明：主要针对横屏情况进行页面布局*/
            _initLayout : function(){
                var me = this;
                if(!me.direction){
                    var width = (me.pagesCount * 100) + '%',
                        cellWidth = Math.floor(10000 / me.pagesCount)/100 + '%';
                    me.sections.width(width);
                    me.section.width(cellWidth).css('float','left');
                }
                if(me.index){
                    me._scrollPage(true);
                }
            },
            /*说明：主要针对横屏情况进行页面布局*/
            _initPaging : function(){
                var me = this,
                    pagesClass = me.selectors.page.substring(1),//分页样式
                    pages;//分页所ul元素
                me.activeClass = me.selectors.active.substring(1);//选择样式

                var pageHtml = '<ul class='+pagesClass+'>';
                for(var i = 0 ; i < me.pagesCount; i++){
                    pageHtml += '<li></li>';
                }
                pageHtml += '</ul>';
                if(me.settings.paginationPosition == 'inner'){
                    me.element.append(pageHtml);
                    pages = me.element.find(me.selectors.page);
                }else{
                    me.element.parent().append(pageHtml);
                    pages = me.element.nextAll(me.selectors.page);
                }
                me.pageItem = pages.find('li');
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if(me.direction){
                    pages.addClass('vertical');
                }else{
                    pages.addClass('horizontal');
                }
            },
            _initControling : function(){
                var me = this,
                    prev = me.selectors.prev.substring(1),
                    next = me.selectors.next.substring(1),
                    controllers;

                var controlHtml = '<div class='+prev+'><\/div><div class='+next+'>';
                if(me.settings.controllerPosition === 'inner'){
                    me.element.append(controlHtml);
                    controllers = me.element.find(me.selectors.prev+","+me.selectors.next);
                }else{
                    me.element.parent().append(controlHtml);
                    controllers = me.element.nextAll(me.selectors.next+","+me.selectors.next);
                }

                if(me.direction){
                    controllers.addClass('vertical');
                }else{
                    controllers.addClass('horizontal')
                }
            },
            /*说明：初始化插件事件*/
            _initEvent : function(){
                var me = this;
                me.timer=null;

                if(me.settings.autoMove){
                    me.timer = setInterval(function(){
                        var me = this;
                        if(me.canscroll){
                            me.next();
                        }
                    }.bind(me),me.settings.interval)
                }
                if(me.settings.controller){
                    me.element.parent().on('click', me.selectors.prev,function(){
                        if(me.canscroll){
                            me.prev()
                        }
                    })
                    me.element.parent().on('click', me.selectors.next,function(){
                        if(me.canscroll){
                            me.next()
                        }
                    })
                }
                if(me.settings.pagination){
                    me.element.parent().on('click',me.selectors.page + ' li',function(){
                        me.index = $(this).index();
                        me._scrollPage();
                    })
                }
                /*支持CSS3动画的浏览器，绑定transitionend事件(即在动画结束后调用起回调函数)*/
                if(_prefix){
                    me.sections.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend',function(){
                        me.canscroll = true;
                        if(me.settings.callback && $.type(me.settings.callback) === 'function'){
                            me.settings.callback();
                        }
                    })
                }
            },
            /*滑动动画*/
            _scrollPage : function(init){
                var me = this;
                var dest = me.section.eq(me.index).position();
                if(!dest) return;

                me.canscroll = false;
                if(_prefix){
                    var translate = me.direction ? 'translateY(-'+dest.top+'px' : 'translateX(-' + dest.left + 'px)';
                    me.sections.css(_prefix+'transition','all '+me.settings.duration + 'ms '+me.settings.easing);
                    me.sections.css(_prefix+'transform' , translate);
                }else{
                    var animateCss = me.direction ? {top : -dest.top} : {left : -dest.left};
                    me.sections.animate(animateCss,me.settings.duration, function(){
                        me.canscroll = true;
                        if(me.settings.callback){
                            me.settings.callback();
                        }
                    });
                }
                if(me.settings.pagination && !init){
                    me.pageItem.eq(me.index).addClass(me.activeClass).siblings('li').removeClass(me.activeClass);
                }
            }
        };
        return Carousel;
    })();

    $.fn.Carousel = function (options) {
        return this.each(function () {
            var me = $(this),
                instance = me.data('Carousel');
            if (!instance) {
                me.data('Carousel', (instance = new Carousel(me, options)))
            }
        })
    }
    $.fn.Carousel.defaults = {
        selectors: {
            sections: '.sections',
            section: '.section',
            page: '.pages',
            active:'.on',
            prev:'.prev',
            next:'.next',
        },
        index : 0,
        easing : 'ease',
        duration : 500,
        loop : true,
        pagination : false,
        paginationPosition:'outer',
        controller:true,
        controllerPosition:'outer',
        direction : 'horizontal',
        autoMove: true,
        interval:5000,
        callback : ''
    };

    $(function(){
        $('[data-Carousel]').Carousel();
    });
    $(".carouselBox").Carousel({
        selectors:{
            sections:'.moveBox',
            section:'.moveBoxInner'
        },
        duration: 500
    });
})(jQuery,window);