'use strict';

(function(win){
  if(typeof win.ZhaoXueTong === 'undefined'){
    win.ZhaoXueTong = {}
  }
  win.ZhaoXueTong.prefix = (function (div) {
    var aPrefix = ['webkit', 'Moz', 'o', 'ms'],
      props = '';
    for (var i in aPrefix) {
      props = aPrefix[i] + 'Transition';
      if (div.style[props] !== undefined) {
        return '-' + aPrefix[i].toLowerCase() + '-';
      }
    }
    return false;
  })(document.createElement('div'));
})(window);
