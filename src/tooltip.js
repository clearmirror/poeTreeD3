define([
  'd3'
], function (d3) {
  'use strict';

  var tooltip;

  var appearingDuration = 200;
  var fadeoutDuration = 500;

  var exports = {};

  exports.init = function(parent){
    if(tooltip !== undefined) tooltip.remove();
    tooltip = d3.select(parent).append("div").attr("class", "tooltip").style("display", "none");
  };

  exports.show = function(){
    tooltip.transition().duration(appearingDuration).style("display", "block");
  };

  exports.hide = function(){
    tooltip.transition().duration(fadeoutDuration).style("display", "none");
  };

  exports.setHtml = function(str){
    tooltip.html(str);
    return this;
  };

  exports.setPosition = function(cord){
    tooltip.style("left", cord[0] +"px");
    tooltip.style("top", cord[1] +"px");
    return this;
  };

  return exports;
});