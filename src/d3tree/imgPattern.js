define(['d3', 'constants'], function (d3, cst) {
  'use strict';
  var exports = {};
  // flagging ids that have been added
  var ids = {};
  // loaded imgurl to size
  var img2size = {};

  exports.init = function(svg){
    this.def = svg.select("defs");
  };

  exports.addPattern = function(id, url, spec, size){
    if(id in ids) return;
    else{
      var p = this.def.append("pattern")
        .attr("id", id)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 1)
        .attr("height", 1)
        .attr("patternUnits", "objectBoundingBox");

      p.append("image")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", size.width)
        .attr("height", size.height)
        .attr("transform", function () {
          return "scale({0})translate({1},{2})".format(cst.scale, -1*spec.x, -1*spec.y); // + (-1) * spec.x + ',' + (-1) * spec.y + ")";
        })
        .attr("xlink:href", url);
      ids[id] = true;
    }
  };

  return exports;

});