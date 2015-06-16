var MainGame = MainGame || {};

//loading the game assets
MainGame.Preload = function(){};

MainGame.Preload.prototype = {
  init: function(level){
        this.level = level;
        
  },  
  preload: function() {

         /*
        * Parameter:
        * 1. Name unter dem das image/sprite nachher abgerufen werden kann.
        * 2. URL des Bildes
        * 3. HÃ¶he des Bildes
        * 4. Schrittweite des Sprites.
        */
        game.load.image('sky', 'assets/bg.png');
        game.load.image('bg1', 'assets/bg_1.png');
        game.load.image('bg2', 'assets/bg_2.png');
        game.load.image('star', 'assets/pixel.png');
        game.load.spritesheet('dude', 'assets/sprites/shitboymitw.png', 32, 48);
        game.load.image('TimerBG', 'assets/TimerBG.png');
        game.load.spritesheet('kroete', 'assets/sprites/kroeten.png', 50, 48)
        game.load.spritesheet('ratte', 'assets/sprites/ratte.png', 50, 48)
        game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
        //game.load.spritesheet('boss', 'assets/Entgegner.png', 32,48);

         // Sounds werden geladen
        game.load.audio('jump', 'assets/sounds/jump2.wav'); 
        game.load.audio('run', 'assets/sounds/run3.wav'); 
        game.load.audio('death', 'assets/sounds/death.wav'); 
        game.load.audio('collect', 'assets/sounds/collect.wav');
        game.load.audio('win', 'assets/sounds/win.wav');
        game.load.audio('saeure', 'assets/sounds/saeure.wav');
        game.load.audio('bgmusic', 'assets/sounds/drumandshit.wav');

        game.load.tilemap('map', 'assets/tilemaps/Level'+this.level+'.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Spitze', 'assets/tiles/Spitze.png');
        game.load.image('toilet', 'assets/tiles/toilet.png');
        game.load.image('blut', 'assets/image/blut.png');
        game.load.image('LevelSprites', 'assets/tiles/LevelSprites.png');
        game.load.spritesheet('welle', 'assets/sprites/spueli1.png', 32, 32);
        game.load.spritesheet('saege', 'assets/sprites/saege.png', 32, 32);
  
  },
  create: function() {
    game.state.start("Game",true,false,this.level);
  }
};