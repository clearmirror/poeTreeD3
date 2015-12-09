define([], function(){

  var exports = {};

  exports.fromJson = function(json){
    // taking the best resolution only
    this.nodeImg = {
      normal : json["skillSprites"]["normalActive"][3],
      keyStone : json["skillSprites"]["keystoneActive"][3],
      mastery : json["skillSprites"]["mastery"][3],
      notable :  json["skillSprites"]["notableActive"][3]
    }
  };

  return exports;
});