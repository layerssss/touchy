(function(){
  var $ = this.jQuery;
  $.ajaxSetup({
    cache: true
  });
  $(function(){
    if(window.touchyLoaded){
      return;
    }
    window.touchyLoaded = true;
    $.getScript('http://eightmedia.github.io/hammer.js/dist/hammer.js', function(){
      var selector = 'p,h1,h2,h3,h4,h5,li,table,pre';
      $(selector).each(function(i, e){
        Hammer(e, {
          drag_lock_to_axis: true
        }).on('dragstart', function(ev){
          if(!this.padElement){
            $(this.padElement = document.createElement('div')).insertBefore(this).addClass('touchy-pad').css({
              overflow: 'hidden',
              height: '0px'
            });
            var canvas;
            $(canvas = document.createElement('canvas')).css({
              width: '98%',
              height: '98%',
              border: 'none'
            }).appendTo(this.padElement);
            Hammer(canvas,{
              drag_min_distance: 1
            }).on('dragstart', function(ev){
              this.lastX = null
            }).on('drag', function(ev){
              ev.gesture.preventDefault();
              ev.gesture.stopPropagation();
              var x = ev.gesture.center.pageX - $(this).offset().left,
                y = ev.gesture.center.pageY-$(this).offset().top,
                ctx = canvas.getContext('2d');
              if(this.lastX){
                ctx.beginPath()
                ctx.moveTo(this.lastX, this.lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
              }
              this.lastX = x;
              this.lastY = y;
            });
          }
          this.padElement.baseHeight = $(this.padElement).height();
        }).on('drag', function(ev){
          ev.gesture.preventDefault()
          $(this.padElement).height(ev.gesture.deltaY + this.padElement.baseHeight);
          $(this.padElement).find('canvas').each(function(i, e){
            $(e).attr({
              height: $(e).height(),
              width: $(e).width()
            });
          });
          return false;
        });
      });
    });
  });
}).call(window);
