var MainGame = MainGame || {};

MainGame.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
MainGame.Boot.prototype = {
  init: function(level){
  	this.level = level;
  },	
  preload: function() {

   
  },
  create: function() { 
  	game.state.start("Preload",true,false,this.level);
  }
};