/**
 * jQuery Plugin - v1.0.0 - 2016-11-18
 * @author huayeta
 */
 ;(function (factory) {
     if (typeof define === 'function' && define.amd) {
         // AMD. Register as an anonymous module.
         define(['jquery'], factory);
     } else if (typeof exports === 'object') {
         // CommonJS / nodejs module
         module.exports = factory(require('jquery'));
     } else {
         // Browser globals
         factory(jQuery);
     }
 }(function ($) {
     var npScroll=function(defaults){
         var opts={
             containerClass:'.np-container',
             sectionClass:'.np-section',
             parallaxClass:'.np-parallax'
         };
         $.extend(opts,defaults);
         var _this=this;
         this.$box=$(opts.containerClass);
         this.$sections=this.$box.find(opts.sectionClass);
         this.section_top_arr=[];
         this.$sections.each(function(){
             var top=$(this).offset().top;
             _this.section_top_arr.push(top);
         })
         this.$parallaxs=this.$box.find(opts.parallaxClass);
         this.pagesMax=this.$sections.size();
         this.pageIndex=0;
         this.$navigation=$('<div class="np-navigation-menu"></div>');
         this.$body=$('body');
         this.$window=$(window);
         this.time=new Date().getTime();
         //初始化
         this.init();
         return this;
     }
     npScroll.prototype.init=function(){
         //初始化section
         var _this=this;
         this.$sections.each(function(index){
             var $this=$(this);
             $this.data('section',index);
             $this.addClass('np-section-'+index);
             //初始化导航
             _this.$navigation.append('<div class="navigation-item" data-section="'+index+'"></div>')
         })
         this.$navigationItems=this.$navigation.find('.navigation-item');
         //导航点击
         this.$navigation.on('click','.navigation-item',function(){
             _this.itemClick(this);
         })
         // 插入导航
         this.$body.append(this.$navigation);
         // 初始化视差
         if(this.$parallaxs.size()>0){
             this.$box.on('scroll',function(){
                 var scrollPosition = -(_this.$box.scrollTop() / 5);
                 _this.$parallaxs.each(function(){
                     var $this=$(this);
                     var imagePosition = 'center '+ scrollPosition + 'px';
                     $this.css({'background-position':imagePosition});
                 })
             })
         }
         //监控鼠标滚动或者向上向下按键
         this.$window.on('keydown DOMMouseScroll mousewheel',function(event){
             // event.preventDefault();
             // 现在时间
             var now = new Date().getTime();

             if(event.keyCode == 116){
                 window.location.reload();
             }

             if(now-_this.time>100){
                 _this.time=now;
                 // Down event
                 if (event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0 || event.keyCode == 40) {
                     // Next section element
                     _this.nextPage();
                 } else if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0 || event.keyCode == 38) {
                     // Previous section element
                     _this.prevPage();
                 }

                 event.stopPropagation();
             }else{
                 _this.time = now;
                 return 0;
             }
         })
     }
     npScroll.prototype.itemClick=function(obj){
         var $obj=$(obj);
         this.$navigationItems.removeClass('navigation-item-active');
         $obj.addClass('navigation-item-active');
         var index=$obj.data('section');
         this.scrollTo(index);
     }
     npScroll.prototype.nextPage=function(){
         if(this.pageIndex < this.pagesMax-1){
             this.pageIndex++;
             this.scrollTo(this.pageIndex);
         }
     }
     npScroll.prototype.prevPage=function(){
         if(this.pageIndex > 0){
             this.pageIndex--;
             this.scrollTo(this.pageIndex);
         }
     }
     npScroll.prototype.scrollTo=function(index){
         this.pageIndex=index;
         var top=this.section_top_arr[index];
         this.$box.stop().animate({scrollTop: top},1000);
     }
     window.npScroll=npScroll;
     return npScroll;
 }));
