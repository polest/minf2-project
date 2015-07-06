var MainGame = MainGame || {};
var bg1;
var bg2;
var bg3;

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
        this.shitboyloadj= this.add.sprite(460,190,'shitboyloadj');
        this.shitboyloadj.scale.setTo(0.11,0.11);
        this.preloadBar = this.add.sprite(450, 400, 'bar');
        this.preloadBar.anchor.setTo(0.2);
        this.preloadBar.scale.setTo(0.8,0.4);
        this.load.setPreloadSprite(this.preloadBar);
        this.getBackground();
        game.load.image('bg1', 'assets/image/bg_11.png');
        game.load.image('bg2', 'assets/image/bg_22.png');
        
 
        game.load.image('star', 'assets/pixel.png');
        game.load.spritesheet('dude', 'assets/sprites/shitboymitw.png', 32, 48);
        game.load.spritesheet('special', 'assets/sprites/special.png', 32, 48);
        game.load.spritesheet('special_move', 'assets/sprites/special_move.png', 32, 30);
        game.load.image('TimerBG', 'assets/TimerBG.png');
        game.load.image('LevelBG', 'assets/TimerBG1.png');
        game.load.image('BestLevelTime', 'assets/BestLevelTime.png');
        game.load.spritesheet('kroete', 'assets/sprites/kroeten.png', 50, 48)
        game.load.spritesheet('ratte', 'assets/sprites/ratte.png', 50, 48)
        game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
        game.load.spritesheet('boss', 'assets/sprites/EndgegnerSprite.png', 244,400);

        


         // Sounds werden geladen
        game.load.audio('fart', 'assets/sounds/fart.wav'); 
        game.load.audio('jump', 'assets/sounds/jump2.wav'); 
        game.load.audio('run', 'assets/sounds/run3.wav'); 
        game.load.audio('death', 'assets/sounds/death.wav'); 
        game.load.audio('win', 'assets/sounds/win.wav');
        game.load.audio('saeure', 'assets/sounds/saeure.wav');

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
  },

        getBackground: function() {
        var level = this.level;

        $.getJSON('js/json/settings.json', function(data) {
            for (var i in data.level) {
                if(parseInt(data.level[i].nummer) == level){
                    this.bg1 =data.level[i].bg1;
                    this.bg2 =data.level[i].bg2;
                    this.bg3 =data.level[i].bg3;
                    game.load.image('ebene1', 'assets/parallax/'+this.bg1+'.png');
                    game.load.image('ebene2', 'assets/parallax/'+this.bg2+'.png');
                    game.load.image('ebene3', 'assets/parallax/'+this.bg3+'.png');
                    
                }
            }
        });

    }


};