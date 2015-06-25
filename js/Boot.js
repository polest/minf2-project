var MainGame = MainGame || {};

MainGame.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
MainGame.Boot.prototype = {
  init: function(level){
  this.scale.pageAlignHorizontally=true;
  this.scale.pageAlignVertically=true;
  	this.level = level;
  	if (localStorage.getItem("levelPlayed") == null){
  		localStorage.setItem("levelPlayed", 0);
  	}else if(localStorage.getItem("levelPlayed") < level){
  		localStorage.setItem("levelPlayed", level);
  	}
  },	
  preload: function() {

   this.load.image('bar','assets/bar.png');
  },
  create: function() { 
    this.game.stage.backgroundColor='#000000';
  	game.state.start("Preload",true,false,this.level);
  }
};