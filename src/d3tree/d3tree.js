define([
  'd3',
  'jquery',
  'constants',
  'd3tree/imgPattern',
  'd3tree/assets',
  'd3tree/nodeType'], function (d3, $, cst, ip, asset, nodeTypes) {
  'use strict';

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
      .scaleExtent([0.1, 2])
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
          // calculate arc
          d.arc = 2 * Math.PI * d.oidx / cst.skillsPerOrbit[d.o] - 0.5 * Math.PI;
        });
        self.draw(window.innerWidth, window.innerHeight);
      })
    },

    draw: function (w, h) {
      var self = this;
      var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
      ip.init(svg);

      var zoomG = svg.append("g").call(this.zoom).on("dblclick.zoom", null);

      // zoom sensor
      zoomG.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("fill", "none")
        .style("pointer-events", "all");

      this.container = zoomG.append("g");

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
        .attr("r", 10)
        .attr("fill", "#00b8e6");

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

      var test = this.nodeArray.filter(function(d){
        return nodeTypes.getType(d) === nodeTypes.types.mastery;
      });
      this.container.selectAll(".skillNode")
        //.data(this.nodeArray, function (d) {
        //  return d.id;
        //})
        .data(test)
        .enter()
        .append("circle")
        .attr("class", "skillNode")
        .attr("cx", computeNodeX)
        .attr("cy",computeNodeY)
        .attr("r", getRadius)
        .style("fill", function (d) {
          return "url(#" + getId(d.icon) + ")";
        });
    }
  };

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

  function isBasicNode(node) {
    return !node.ks && !node.m && !node.not;
  }

  function computeNodeX(d) {
    var r = cst.orbitRadi[d.o];
    return d.group.x + r * Math.cos(d.arc);
  }

  function computeNodeY(d) {
    var r = cst.orbitRadi[d.o];
    return d.group.y + r * Math.sin(d.arc);
  }

  return D3Tree;

});