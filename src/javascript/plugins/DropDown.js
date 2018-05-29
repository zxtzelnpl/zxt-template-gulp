(function ($) {

  'use strict';
  var _prefix = (function (div) {
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


  var DropDown = (function(){
    function DropDown($dom,options){
      this.options = $.extend(true, $.fn.DropDown.defaults, options || {})
      this.wrapper = $dom.find('.drop-down-wrapper');
      this.selected = $dom.find('.drop-down-select');
      this.box = $dom.find('.drop-down-box');
      this.init()
    }

    DropDown.prototype = {
      init:function(){
        this.selected.on('click',this._selectedHandleClick.bind(this))
        this.box.on('click',this._boxHandleClick.bind(this))
      },

      _selectedHandleClick:function(){
        this.wrapper.toggleClass('active');
      },

      _boxHandleClick:function(e){
        var p = e.target;
        if($(p).hasClass('drop-down-option')){
          var value = $(p).data('value');
          var html = $(p).html();
          this.selected.data('value',value)
          this.selected.html(html);
          this.options.select.call(undefined,p,value,html);
          this.wrapper.removeClass('active');
        }
        else{
          console.log('未点中标签')
        }
      },



      refresh:function(e){

      }

    }

    return DropDown;
  }())

  $.fn.DropDown = function(options){
    return this.each(function(){
      var me = $(this),
        instance = me.data('DropDown');
      if(!instance){
        me.data('DropDown', (instance = new DropDown(me, options)))
      }
    })
  }

  $.fn.DropDown.defaults = {
    select:function(p,value,html){
      console.log(p)
      console.log(value)
      console.log(html)
    }
  }
}(jQuery))