define(['d3', 'jquery', 'd3tree/constants', 'd3tree/imgPattern'], function (d3, $, cst, ip) {
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

      this.id2g = {};
      var groups = this.container.selectAll(".group")
        .data(this.groupArray, function (d) {
          return d.id;
        })
        .enter()
        .append("g")
        .each(function (d) {
          self.id2g[d.id] = this;
        });

      groups.append("circle")
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        })
        .attr("r", 10)
        .attr("fill", "#00b8e6");

      // add all pattern
      this.nodeArray.forEach(function(d){
        var icon = d.icon;
        if (isBasicNode(d)) {
          var spec = self.json["skillSprites"]["normalInactive"][3]['coords'][icon];
          ip.addPattern(getId(icon), cst.images.skill_sprite.inactive, spec);
        }
      });

      this.container.selectAll(".skillNode")
        .data(this.nodeArray, function (d) {
          return d.id;
        })
        .enter()
        .append("circle")
        .attr("class", "skillNode")
        .attr("cx", computeNodeX)
        .attr("cy",computeNodeY)
        .attr("r", 27/2)
        .style("fill", function (d) {
          return "url(#" + getId(d.icon) + ")";
        });

    }
  };

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