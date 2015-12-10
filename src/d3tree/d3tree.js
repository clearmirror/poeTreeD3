define([
  'd3',
  'jquery',
  'constants',
  'd3tree/imgPattern',
  'd3tree/assets',
  'd3tree/nodeType',
  'd3tree/util',
  'tooltip'
], function (d3, $, cst, ip, asset, nodeTypes, util, tooltip) {
  'use strict';

  if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
          ;
      });
    };
  }

  function beingZoomed() {
    this.container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  var D3Tree = function () {
    this.json = null;
    // object
    this.nodes = null;
    this.groups = null;
    // array
    this.groupArray = null;
    this.nodeArray = null;
    this.container = null;
    // group id to d3 group
    this.id2g = null;

    // d3 behavior
    this.zoom = d3.behavior.zoom()
      .scaleExtent([0.2, 5])
      .on("zoom", beingZoomed.bind(this));
  };

  D3Tree.prototype = {
    loadTreeJson: function () {
      var self = this;
      d3.json('resource/2100tree.json', function (err, json) {
        if (err) {
          console.log("Fail to load json");
          return;
        }
        self.json = json;
        asset.fromJson(json);

        self.groups = json.groups;
        self.groupArray = [];
        $.each(self.groups, function (id, value) {
          value.id = id;
          self.groupArray.push(value);
        });

        // process node arrays
        self.nodeArray = json.nodes;
        self.nodes = {};
        json.nodes.forEach(function (d) {
          self.nodes[d.id] = d;
          // link to group
          d.group = self.groups[d.g];
          // group radius
          if(!d.group.radius || d.group.radius < cst.orbitRadi[d.o])
            d.group.radius = cst.orbitRadi[d.o];
          // calculate arc
          d.arc = util.getArc(d);
          d.x = computeNodeX(d);
          d.y = computeNodeY(d);
        });
        self.draw(window.innerWidth, window.innerHeight);
      })
    },

    draw: function (w, h) {
      var self = this;
      var svg = d3.select("body").select("svg").attr("width", w).attr("height", h);
      // init stuff
      ip.init(svg);
      tooltip.init("body");

      var zoomG = svg.append("g").call(this.zoom).on("dblclick.zoom", null);

      // zoom sensor
      zoomG.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("fill", "none")
        .style("pointer-events", "all");

      this.container = zoomG.append("g");

      drawMasteries.call(this);
      // add all pattern
      var id2size = {};
      this.nodeArray.forEach(function(d){
        var icon = d.icon;
        var imgData, fileName, spec, size;

        switch(nodeTypes.getType(d)){
          case nodeTypes.types.normal:
            imgData = asset.nodeImg.normal;
            break;
          case nodeTypes.types.notable:
            imgData = asset.nodeImg.notable;
            break;
          case nodeTypes.types.keystone:
            imgData = asset.nodeImg.keyStone;
            break;
          case nodeTypes.types.mastery:
            imgData = asset.nodeImg.mastery;
            break;
        }

        fileName = imgData.filename;
        spec = imgData.coords[icon];
        size = cst.imageSize[fileName];
        var id = getId(icon);
        id2size[id] = spec;
        if(spec)
          ip.addPattern(id, cst.assetsPath + fileName, spec, size);
      });

      drawPaths.call(this);
      drawNodes.call(this);

    }
  };

  function drawPaths(){
    var roots = this.json["root"];
    var q = roots.out.map(function(d){return d});
    var pathGroup = this.container.append("g").attr("class", "pathGroup");
    var self = this;
    var visited = {};
    for(var i=0; i<this.nodeArray.length; i++){
      var currentNode = this.nodeArray[i];
      if(visited[currentNode.id])
        continue;
      visited[currentNode.id] = true;
      var nexts = currentNode.out;

      nexts.forEach(function(nextId){
        var nextNode = self.nodes[nextId];
        pathGroup.append("path").attr("d", drawPath(currentNode, nextNode))
          .attr("stroke", "black").attr("stroke-width", 5)
          .attr("fill", "none");
        q.push(nextId);
      })
    }
  }

  function drawPath(node1, node2){
    if(node1.g === node2.g && node1.o === node2.o){
    //<path d="M 0 0
    //  A 50 50, 0, 0, 0, 50 50
    //  " stroke="red" fill="none"/>
      if(node1.arc > node2.arc && node1.arc - node2.arc <= Math.PI ||
        node1.arc - node2.arc < -Math.PI)
        return "M {0} {1} A {2} {2}, 0, 0, 0, {3} {4}".format(node1.x, node1.y, cst.orbitRadi[node1.o], node2.x, node2.y);
      else
        return "M {0} {1} A {2} {2}, 0, 0, 0, {3} {4}".format(node2.x, node2.y, cst.orbitRadi[node1.o], node1.x, node1.y);
    }
    else{
      return "M {0} {1} L {2} {3}".format(node1.x, node1.y, node2.x, node2.y);
    }
  }

  function drawMasteries(){
    // add groups
    this.container.append("g").selectAll(".group")
      .data(this.groupArray, function (d) {
        return d.id;
      })
      .enter()
      .append("circle")
      .attr("class", "group")
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      })
      .attr("r", function(d){
        return d.radius;
      })
      .attr("fill", "#00b8e6")
      .attr("opacity", 0.5);
  }

  function drawNodes(){
    this.container.selectAll(".skillNode")
      .data(this.nodeArray, function (d) {
        return d.id;
      })
      .enter()
      .append("circle")
      .attr("class", "skillNode")
      .attr("cx", computeNodeX)
      .attr("cy",computeNodeY)
      .attr("r", getRadius)
      .attr("stroke", "black")
      .attr("stroke-width", "3px")
      .attr("fill", function (d) {
        return "url(#" + getId(d.icon) + ")";
      })
      .on("mouseover", function(d){
        tooltip.setHtml(util.node2html(d)).setPosition([d3.event.clientX, d3.event.clientY]).show();
      })
      .on("mouseout", function () {
        tooltip.hide();
      });

  }

  function getRadius(node){
    switch(nodeTypes.getType(node)){
      case nodeTypes.types.normal:
        return cst.nodeSize.normal/2;
      case nodeTypes.types.notable:
        return cst.nodeSize.notable/2;
      case nodeTypes.types.keystone:
        return cst.nodeSize.keystone/2;
      case nodeTypes.types.mastery:
        return cst.nodeSize.mastery/2;
    }
  }

  function getId(str){
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "");
  }

  function computeNodeX(d) {
    var r = cst.orbitRadi[d.o];
    return d.group.x - r * Math.sin(-d.arc);
  }

  function computeNodeY(d) {
    var r = cst.orbitRadi[d.o];
    return d.group.y - r * Math.cos(-d.arc);
  }

  return D3Tree;

});