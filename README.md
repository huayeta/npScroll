# npScroll

     npScroll - Smooth ONePage Scroll - Simple JS based on JQuery

     - Section sizes
     - Smooth scroll
     - Sections navigation
     - Parallax effect
     - One simple JS file (no more)

# options对象参数：
 * containerClass: 最外层的className，默认：np-container
 * sectionClass: 每一个section的className，默认：np-section
 * parallaxClass: 如果section的背景需要视差效果，可以加上这个className，默认：np-parallax
 * effect: 效果，默认是1，值还有2,详情见`demo`

# 实例有三个函数
 * this.scrollTo(index); 滚动到index页
 * this.nextPage(); 滚动到下一页
 * this.prevPage(); 滚动到上一页

# 事件类型
 * this.on('scrollStart',cb)；开始滚动
 * this.on('scrollEnd',cb)；结束滚动

`.np-full` 代表section满屏
默认加一个hash`#page1`，初始化滚动到第二页,默认是`#page0`

# 安装

    bower install --save npScroll

# Example

html部分：
``` HTML
<!doctype html>
<html>
    <head>
        <script src="jquery..."></script>
        <script src="npScroll.js"></script>
    </head>

    <body>
        <div class="np-container">
            <div class="np-section np-full">
                <p>Section</p>
            </div>

            <div class="np-section np-parallax">
                <p>Section parallax effect</p>
            </div>

            <div class="np-section">
                <p>Section small size (200px)</p>
            </div>
        </div>
    </body>
</html>
```
css部分：
``` css
<style media="screen">
/*必有样式*/
body,html{
    height: 100%;
    width: 100%;
    overflow: hidden;
}
.np-container{
    height: 100%;
    width: 100%;
    overflow: hidden;
}
.np-navigation-menu{
    position: fixed;
    right: 20px;
    bottom: 50%;
    transform: translateY(50%);
}
.np-navigation-menu .navigation-item{
    cursor: pointer;
    width: 15px;
    height: 15px;
    background: #f9f9f9;
    border-radius: 50%;
    margin-bottom: 5px;
}
</style>
```
js部分：
``` js
new npScroll(
    {
        containerClass:'.np-container',
        sectionClass:'.np-section',
        parallaxClass:'.np-parallax'
    }
);
```
