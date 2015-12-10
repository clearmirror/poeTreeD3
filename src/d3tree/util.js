define(['constants', 'jquery'], function(cst, $){

  'use strict';
  var exports = {};
  // get arc
  exports.getArc = function(node){
    var oidx = node.oidx;
    var maxNodes = cst.skillsPerOrbit[node.o];
    if(maxNodes === 40){
      switch(oidx)
      {
        case  0: return getOrbitAngle(  0, 12 );
        case  1: return getOrbitAngle(  0, 12 ) + 1 * 10.0;
        case  2: return getOrbitAngle(  0, 12 ) + 2 * 10.0;
        case  3: return getOrbitAngle(  1, 12 );
        case  4: return getOrbitAngle(  1, 12 ) + 1 * 10.0;
        case  5: return getOrbitAngle(  1, 12 ) + 1 * 15.0;
        case  6: return getOrbitAngle(  1, 12 ) + 2 * 10.0;
        case  7: return getOrbitAngle(  2, 12 );
        case  8: return getOrbitAngle(  2, 12 ) + 1 * 10.0;
        case  9: return getOrbitAngle(  2, 12 ) + 2 * 10.0;
        case 10: return getOrbitAngle(  3, 12 );
        case 11: return getOrbitAngle(  3, 12 ) + 1 * 10.0;
        case 12: return getOrbitAngle(  3, 12 ) + 2 * 10.0;
        case 13: return getOrbitAngle(  4, 12 );
        case 14: return getOrbitAngle(  4, 12 ) + 1 * 10.0;
        case 15: return getOrbitAngle(  4, 12 ) + 1 * 15.0;
        case 16: return getOrbitAngle(  4, 12 ) + 2 * 10.0;
        case 17: return getOrbitAngle(  5, 12 );
        case 18: return getOrbitAngle(  5, 12 ) + 1 * 10.0;
        case 19: return getOrbitAngle(  5, 12 ) + 2 * 10.0;
        case 20: return getOrbitAngle(  6, 12 );
        case 21: return getOrbitAngle(  6, 12 ) + 1 * 10.0;
        case 22: return getOrbitAngle(  6, 12 ) + 2 * 10.0;
        case 23: return getOrbitAngle(  7, 12 );
        case 24: return getOrbitAngle(  7, 12 ) + 1 * 10.0;
        case 25: return getOrbitAngle(  7, 12 ) + 1 * 15.0;
        case 26: return getOrbitAngle(  7, 12 ) + 2 * 10.0;
        case 27: return getOrbitAngle(  8, 12 );
        case 28: return getOrbitAngle(  8, 12 ) + 1 * 10.0;
        case 29: return getOrbitAngle(  8, 12 ) + 2 * 10.0;
        case 30: return getOrbitAngle(  9, 12 );
        case 31: return getOrbitAngle(  9, 12 ) + 1 * 10.0;
        case 32: return getOrbitAngle(  9, 12 ) + 2 * 10.0;
        case 33: return getOrbitAngle( 10, 12 );
        case 34: return getOrbitAngle( 10, 12 ) + 1 * 10.0;
        case 35: return getOrbitAngle( 10, 12 ) + 1 * 15.0;
        case 36: return getOrbitAngle( 10, 12 ) + 2 * 10.0;
        case 37: return getOrbitAngle( 11, 12 );
        case 38: return getOrbitAngle( 11, 12 ) + 1 * 10.0;
        case 39: return getOrbitAngle( 11, 12 ) + 2 * 10.0;
      }
    }
    return getOrbitAngle(oidx, 12);
  };

  exports.node2html = function(node){
    var div = $('<div>');
    var title = $('<h2>', {
      text : node.dn
    });
    var ul = $("<ul>");
    node.sd.forEach(function(d){
      var li = $("<li>", {
        text : d
      });
      ul.append(li);
    });
    div.append(title, ul);
    return div.html();

  };

  function getOrbitAngle(oidx, maxNodes){
    return 2*Math.PI*oidx / maxNodes;
  }

  return exports;
});