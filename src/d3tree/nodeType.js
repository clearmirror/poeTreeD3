define([], function(){
  var exports = {};

  var types = {
    normal : 0,
    notable : 1,
    keystone : 2,
    mastery : 3
  };

  exports.types = types;
  exports.getType = function(node){
    if(node.ks)
      return types.keystone;
    if(node.m)
      return types.mastery;
    if(node.not)
      return types.notable;
    return types.normal;
  };

  return exports;

});