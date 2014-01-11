(function(){
  var initCanvas = function(canvas){
    fillCanvas(canvas);
    var ctx = canvas.getContext('2d');
    Hammer(canvas ,{
      drag_min_distance: 1
    }).on('dragstart', function(ev){
      this.lastX = null
    }).on('drag', function(ev){
      ev.gesture.preventDefault();
      ev.gesture.stopPropagation();
      var x = ev.gesture.center.pageX - $(this).offset().left,
        y = ev.gesture.center.pageY-$(this).offset().top;
      if(this.lastX){
        ctx.beginPath()
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      this.lastX = x;
      this.lastY = y;
    }).on('doubletap', function(ev){
      ev.gesture.preventDefault();
      $(this).remove();
    });
  };
  var fillCanvas = function(canvas){
    var ctx = canvas.getContext('2d');
    $(canvas).attr({
      width: $(canvas).width(),
      height: $(canvas).height()
    });
    ctx.fillStyle = "rgba(0,0,0,0.01)";
    ctx.fillRect(0, 0, $(canvas).width(), $(canvas).height());
    ctx.fillStyle = '#fff';
  };
  var $ = this.jQuery;
  $.ajaxSetup({
    cache: true
  });
  $(function(){
    if(window.touchyLoaded){
      return;
    }
    window.touchyLoaded = true;
    $.getScript('//rawgithub.com/EightMedia/hammer.js/1.0.6/hammer.min.js', function(){
      $('p,h1,h2,h3,h4,h5,li,table,pre').each(function(i, e){
        Hammer(e, {
          drag_lock_to_axis: true
        }).on('dragstart', function(ev){
          if(!this.padElement){
            $(this.padElement = document.createElement('canvas')).css({
              width: '98%',
              border: 'none'
            }).insertBefore(this).addClass('touchy-pad').css({
              height: '0px'
            });
            initCanvas(this.padElement);
          }
          this.padElement.baseHeight = $(this.padElement).height();
        }).on('drag', function(ev){
          ev.gesture.preventDefault();
          $(this.padElement).height(ev.gesture.deltaY + this.padElement.baseHeight);
          fillCanvas(this.padElement);
          return false;
        }).on('doubletap', function(ev){
          ev.gesture.preventDefault();
          $(this.overlayElement = document.createElement('canvas')).css({
            position: 'absolute',
            top: $(this).offset().top + 'px',
            left: $(this).offset().left + 'px',
            width: $(this).width() + 'px',
            height: $(this).height() + 'px'
          }).appendTo('body');
          initCanvas(this.overlayElement);
        });
      });
    });
  });
}).call(window);
