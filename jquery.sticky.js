// Sticky Plugin v1.0.0 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 2/14/2011
// Date: 2/12/2012
// Website: http://labs.anthonygarand.com/sticky
// Description: Makes an element on the page stick on the screen as you scroll
//       It will only set the 'top' and 'position' of your element, you
//       might need to adjust the width in some cases.

(function($) {
  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper',
      center: false,
      getWidthFrom: null,
      getConstraintFrom: null
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
      var scrollTop = $window.scrollTop(),
        documentHeight = $document.height(),
        dwh = documentHeight - windowHeight,
        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

      for (var i = 0; i < sticked.length; i++) {
        var s = sticked[i],
          elementTop = s.stickyWrapper.offset().top,
          etse = elementTop - s.topSpacing - extra,
          constraintHeight = Infinity,
          stickyHeight = s.stickyElement.height();

        if (s.getConstraintFrom !== null) {
          constraintHeight = $(s.getConstraintFrom).height();
        }

        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            var cssReset = {
              'position': '',
              'top': ''
            };
            var cssWrapperReset = {
              'height': ''
            };
            if (s.getWidthFrom !== null) {
              cssReset['width'] = '';
            }
            if (s.center) {
              cssWrapperReset['width'] = '';
              cssWrapperReset['margin-left'] = '';
              cssWrapperReset['margin-right'] = '';
            }
            s.stickyElement.css(cssReset);
            s.stickyWrapper.css(cssWrapperReset).removeClass(s.className);
            s.currentTop = null;
          }
        }
        else {
          var newTop,
            stickyOuterHeight = s.stickyElement.outerHeight(),
            stickyOuterWidth = s.stickyElement.outerWidth(),
            currentTop = documentHeight - stickyOuterHeight
            - s.topSpacing - s.bottomSpacing - scrollTop - extra;
          var stickyTop = scrollTop - elementTop;
          var outOfBounds = (constraintHeight - stickyTop - s.bottomSpacing <= stickyHeight);
          if (currentTop < 0) {
            newTop = currentTop + s.topSpacing;
          } else {
            newTop = s.topSpacing;
          }
          if (stickyHeight < constraintHeight) {
            var stickyCSS = {
              'position': 'fixed',
              'top': newTop
            };
            var wrapperCSS = {
              'height': stickyOuterHeight
            };
            if (s.getWidthFrom !== null) {
              stickyCSS['width'] = $(s.getWidthFrom).width();
            }
            if (s.center) {
              wrapperCSS['width'] = stickyOuterWidth;
              wrapperCSS['margin-left'] = 'auto';
              wrapperCSS['margin-right'] = 'auto';
            }
            if (outOfBounds) {
              stickyCSS['position'] = 'relative';
              stickyCSS['top'] = constraintHeight - stickyHeight - s.bottomSpacing;
            }
            s.stickyElement.css(stickyCSS);
            s.stickyWrapper.css(wrapperCSS).addClass(s.className);
            s.currentTop = newTop;
          }
        }
      }
    },
    resizer = function() {
      windowHeight = $window.height();
    },
    methods = {
      init: function(options) {
        var o = $.extend({}, defaults, options);
        return this.each(function() {
          var stickyElement = $(this);

          var stickyId = stickyElement.attr('id');
          var wrapper = $('<div></div>')
            .attr('id', stickyId + '-sticky-wrapper')
            .addClass(o.wrapperClassName);
          stickyElement.wrapAll(wrapper);
          var stickyWrapper = stickyElement.parent();

          if (stickyElement.css('float') === 'right') {
            stickyElement.css('float', 'none');
            stickyWrapper('float', 'right');
          }

          sticked.push({
            topSpacing: o.topSpacing,
            bottomSpacing: o.bottomSpacing,
            stickyElement: stickyElement,
            currentTop: null,
            center: o.center,
            stickyWrapper: stickyWrapper,
            className: o.className,
            getWidthFrom: o.getWidthFrom,
            getConstraintFrom: o.getConstraintFrom
          });
        });
      },
      update: scroller,
      unstick: function(options) {
        return this.each(function() {
          var unstickyElement = $(this);

          removeIdx = -1;
          for (var i = 0; i < sticked.length; i++) 
          {
            if (sticked[i].stickyElement.get(0) == unstickyElement.get(0))
            {
                removeIdx = i;
            }
          }
          if(removeIdx != -1)
          {
            sticked.splice(removeIdx,1);
            unstickyElement.unwrap();
            unstickyElement.removeAttr('style');
          }
        });
      }
    };

  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
  if (window.addEventListener) {
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', scroller);
    window.attachEvent('onresize', resizer);
  }

  $.fn.sticky = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };

  $.fn.unstick = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.unstick.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }

  };
  $(function() {
    setTimeout(scroller, 0);
  });
})(jQuery);
