var MainGame = MainGame || {};

MainGame.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
MainGame.Boot.prototype = {
  preload: function() {

   
  },
  create: function() { 
    game.state.start('Preload');
  }
};