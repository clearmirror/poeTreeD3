(function (requirejs) {
  'use strict';

  requirejs.config({
    'baseUrl': 'src',
    'paths': {
      jquery : "../bower_components/jquery/dist/jquery.min",
      d3 : "../bower_components/d3/d3.min"
    },
    'shim': {
      jquery : {
        exports : ['jQuery', '$']
      },
      d3 : {
        exports : ['d3']
      }
    },
    waitSeconds : 0
  });

  // Load the main app module to start the app
  requirejs(['main']);
}(requirejs));