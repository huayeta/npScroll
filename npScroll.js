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
             parallaxClass:'.np-parallax',
             effect:1
         };
         $.extend(opts,defaults);
         var _this=this;
         this.opts=opts;
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
         this._events={};
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
         //如果是效果2
         if(this.opts.effect==2){
             this.dh=this.$window.height();
             this.$sections.each(function(index){
                var $this=$(this);
                if(index==0)return true;
                $this.css('webkitTransform','translateY(-'+_this.dh+'px)');
                $this.css('transform','translateY(-'+_this.dh+'px)');
             })
         }
         //监控鼠标滚动或者向上向下按键
         this.$window.on('keydown DOMMouseScroll mousewheel',function(event){
             return _this.judge(event);
         })
         //监听hash的变化
         this.$window.on('hashchange',function(){
             _this.hashchange();
         })
         //初始化滚动
         this.hashchange();
         return this;
     }
     npScroll.prototype.judge=function(event){
         //  event.preventDefault();
          // 现在时间
          var now = new Date().getTime();

          if(event.keyCode == 116){
              window.location.reload();
          }

          if(now-this.time>100){
              this.time=now;
              // Down event
              if (event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0 || event.keyCode == 40) {
                  // Next section element
                  this.nextPage();
              } else if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0 || event.keyCode == 38) {
                  // Previous section element
                  this.prevPage();
              }

              event.stopPropagation();
          }else{
              this.time = now;
              return 0;
          }
     }
     npScroll.prototype.hashchange=function(){
         if(location.hash && location.hash.indexOf('#page')!=-1){
             var index=parseInt(location.hash.slice(5));
             if(index!==undefined && index!==this.pageIndex && index<=this.pagesMax){
                 this.scrollTo(index);
             }
         }
     }
     npScroll.prototype.itemClick=function(obj){
         var $obj=$(obj);
         var index=$obj.data('section');
         this.scrollTo(index);
         return this;
     }
     npScroll.prototype.nextPage=function(){
         if(this.pageIndex < this.pagesMax-1){
             this.pageIndex++;
             this.scrollTo(this.pageIndex);
         }
         return this;
     }
     npScroll.prototype.prevPage=function(){
         if(this.pageIndex > 0){
             this.pageIndex--;
             this.scrollTo(this.pageIndex);
         }
         return this;
     }
     npScroll.prototype.scrollTo=function(index){
         var _this=this;
         //滚动钩子
         setTimeout(function(){
             _this.trigger('scrollStart',index);
         },0)
         //老的pageIndex
         var old_pageIndex=this.pageIndex;
         this.pageIndex=index;
         //更新导航
         this.$navigationItems.filter(':not('+this.pageIndex+')').removeClass('navigation-item-active');
         this.$navigationItems.filter(':eq('+this.pageIndex+')').addClass('navigation-item-active');
         //更新section
          var $section=this.$sections.filter(':eq('+this.pageIndex+')');
         this.$sections.filter(':not('+this.pageIndex+')').removeClass('np-section-active');
         $section.addClass('np-section-active');
         var top=this.section_top_arr[index];
         if(this.opts.effect==1){
             this.$box.stop().animate({scrollTop: top},1000);
         }else if(this.opts.effect==2){
             //如果效果2
             var $old_section=this.$sections.filter(':eq('+old_pageIndex+')');
             console.log(old_pageIndex);
             if(old_pageIndex<this.pageIndex){
                 //出现的
                //  $section.css('webkitTransform','translateY(0)');
                 $section.css({
                     'transform':'translateY(0)',
                     'z-index':2
                 });
                 //消失的
                 console.log(_this.dh);
                //  $old_section.css('webkitTransform','translateY(-'+_this.dh+'px)');
                 $old_section.css({
                     'transform':'translateY(-'+_this.dh+'px)',
                     'z-index':1
                 });
             }
         }
         //滚动结束钩子
         setTimeout(function(){
             _this.trigger('scrollEnd',index);
         },1000)
         return this;
     }
     npScroll.prototype.on=function(type,cb){
        if(!this._events[type]){
            this._events[type]=[];
        }
        this._events[type].push($.proxy(cb,this));
        return this;
    }
    npScroll.prototype.trigger=function(){
        var args=[].slice.apply(arguments);
        var type=args[0];
        var params=args.slice(1);
        var events=this._events[type];
        if(events && events.length>0){
            for(var i=0,n=events.length;i<n;i++){
                events[i](params);
            }
        }
        return this;
    }
    npScroll.prototype.off=function(type,cb){
        if(!type){
            return this._events={};
        }
        var events=this._events[type];
        if(events && events.length>0){
            for(var i=0,n=events.length;i<n;i++){
                if(events[i]===cb){
                    events.splice(i,-1);
                    break;
                }
            }
        }
        this._events[type]=events;
        return this;
    }
     window.npScroll=npScroll;
     return npScroll;
 }));
