define([], function () {
  'use strict';
  var assetsPath = 'resource/assets/';

  return {
    scale : 2,
    assetsPath : assetsPath,
    skillsPerOrbit: [1, 6, 12, 12, 40],
    orbitRadi: [0, 81.5, 163, 326, 489],
    genImgUrl : "https://p7p4m6s5.ssl.hwcdn.net",
    images: {
      skill_sprite : {
        inactive : assetsPath + "skill_sprite-3-fb52c49f4590920aac13bc2663d7a3d7.jpg",
        active :assetsPath + 'skill_sprite-active-3-a0d5aa031afdb3cb816df6f6ccb7390b.jpg'
      },
      mastery : assetsPath + 'skill_sprite-active-3-9938ab61c22ff80e42358ba3b40e0f4f.png'
    },
    imageSize : {
      'skill_sprite-active-3-a0d5aa031afdb3cb816df6f6ccb7390b.jpg' :{
        width : 693,
        height : 829
      },
      'skill_sprite-active-3-9938ab61c22ff80e42358ba3b40e0f4f.png' :{
        width : 693,
        height : 594
      }
    },
    nodeSize : {
      normal : 27,
      notable : 38,
      keystone : 54,
      mastery : 99
    }
  }
});