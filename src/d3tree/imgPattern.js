define(['d3'], function (d3) {
  'use strict';
  var exports = {};
  // flagging ids that have been added
  var ids = {};
  // loaded imgurl to size
  var img2size = {};

  exports.init = function(svg){
    this.def = svg.append("svg:defs");
  };

  exports.addPattern = function(id, url, spec, size){
    if(id in ids) return;
    else{
      var p = this.def.append("pattern")
        .attr("id", id)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", spec.w)
        .attr("height", spec.h)
        .attr("patternUnits", "objectBoundingBox");

      p.append("image")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", size.width)
        .attr("height", size.height)
        .attr("transform", function () {
          return "translate(" + (-1) * spec.x + ',' + (-1) * spec.y + ")";
        })
        .attr("xlink:href", url);
      ids[id] = true;
    }
  };

  return exports;

});