var enemyContainer = [];
var MainGame = MainGame || {};

//title screen
MainGame.Game = function(){};

MainGame.Game.prototype = {

  init: function(level){
        this.level = level;
  },    
  create: function() { 

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        var bg = game.add.tileSprite(-200, -200, 1920, 1200, 'sky');
            bg.fixedToCamera=true;


        game.stage.backgroundColor='#787878';

        var map= game.add.tilemap('map');
        map.addTilesetImage('wiese123');
        map.addTilesetImage('WieseEckL');
        map.addTilesetImage('WieseEckR');
        map.addTilesetImage('erde1');
        map.addTilesetImage('toilet');

        map.setCollisionBetween(1, 12);

        this.layer= map.createLayer('Tile Layer 1');
        this.layer.enableBody = true;
        this.layer.resizeWorld();
                
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.wellen = game.add.group();
        this.wellen.enableBody = true;

        this.spitzen = game.add.group();
        this.spitzen.enableBody=true;


        map.createFromObjects('Object Layer 2', 3, 'welle', 0, true, false, this.wellen);
        this.wellen.callAll('animations.add', 'animations', 'spin', [0, 1, 1, 0, 2, 2], 10, true);
        this.wellen.callAll('animations.play', 'animations', 'spin');

        map.createFromObjects('Object Layer 1', 1, 'Spitze', 0, true, false, this.spitzen);

        this.spitzen.forEach(function(element){
            element.body.moves=false;
        }, this);

        this.wellen.forEach(function(element){
            element.body.moves=false;
        }, this);


        // The player and its settings     
        this.map = map;
        this.player = this.createPlayerFromJson();

        //  We need to enable physics on the player
        this.game.physics.arcade.enable(this.layer);



        // Setzt inWallJump beim Spielanfang immer auf false
        inWallJump = false;
        
        blockLeftKey = false;
        blockRightKey = false;
        isInAir = false;
        isOnRightWall = false;
        isOnLeftWall = false;
        blockUpKeyForLeft = false;
        blockUpKeyForRight = false;
        jumpOnWall = false;
        isInJump = false;
        slidesOnWall = false;
        upDownDirection = this.player.body.y;
        playerMoves = "stand";

        // Timer wird definiert
        // Countdown Zeit in zehntel Sekunden (150 = 15 Sekunden)
        timeEnd = 600;
        
        // Erstellt einen roten Timer Text und fixiert ihn
        timerTextRedSprite = game.add.sprite(0,0, 'TimerBG');
        timerTextRedSprite.fixedToCamera = true;
        
        timerTextRed = game.add.text(5, 0, 'Timer: '+timeEnd, { font: '32px VT323', fill: '#FF0000' });
        timerTextRedSprite.addChild(timerTextRed);
        
        // X und Y Position wo der Text gefixed werden soll
        timerTextRedSprite.cameraOffset.x = 50;
        timerTextRedSprite.cameraOffset.y = 0;
        
        // Erstellt einen schwarzen Timer Text und fixiert ihn
        timerTextSprite = game.add.sprite(0,0, 'TimerBG');
        timerTextSprite.fixedToCamera = true;
        
        timerText = game.add.text(5, 0, 'Timer: '+timeEnd, { font: '32px VT323', fill: '#ffffff' });
        timerTextSprite.addChild(timerText);
        
        // X und Y Position wo der Text gefixed werden soll
        timerTextSprite.cameraOffset.x = 50;
        timerTextSprite.cameraOffset.y = 0;
        
        // Versteckt die Texte
        timerTextRed.visible = false;
        timerText.visible = false;
        
        this.currentTimer = game.time.create(false);
        this.currentTimer.loop(100, this.updateTimer, this);

        //  The score
        this.scoreText = game.add.text(900, 16, 'score: 0', {font:"30px VT323", fill: '#000' });
        this.scoreText.visible=false;
        this.score = 0;

        this.winText= game.add.text(800,50, 'WIN!!!!',{font:"30px VT323", fill: '#000' });
        this.winText.visible=false;

        //  Our controls.
        this.cursor = game.input.keyboard.createCursorKeys();

        resetKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
        //this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        
        // Jumpsound hinzugefügt
        this.jumpSound = this.game.add.audio('jump',0.2);
        this.jumpSoundPlayed = false;

        // RunSound hinzugefügt
        this.runSound=this.game.add.audio('run',0.2);
        this.runSoundPlayed=false;

        // DeathSound hinzugefügt
        this.deathSound=this.game.add.audio('death',0.3);
        this.deathSoundPlayed=false;

        // collectSound hinzugefügt
        this.collectSound=this.game.add.audio('collect',0.1);
        this.collectSoundPlayed=false;

        this.saeureSound=this.game.add.audio('saeure', 0.4);
        this.saeureSoundPlayed=false;

        // winSound hinzugefügt
        this.winSound=this.game.add.audio('win',0.5);
        this.winSoundPlayed=false;

        this.bgSound = this.game.add.audio('bgmusic',0.3);
        this.bgSoundPlayed = false;

        this.marker = game.add.group();
        this.marker.enableBody = true;
        //unsichtbare Marker wo Gegner die Richtung ändern
        this.marks = [];
        //linker marker

        this.createMarks(260,500);
        this.createMarks(90,500);

        this.enemiesGroup = game.add.group();
        this.enemiesGroup.enableBody = true;

        this.exits = game.add.group();
        this.exits.enableBody = true;
        
        game.camera.follow(this.player);
        
        this.createEnemies("Kroete");
        this.createExits();

       this.bgSound.play();

    },

    update: function() {
         //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(this.player, this.layer);
        game.physics.arcade.collide(this.player, this.spitzen);
        game.physics.arcade.collide(this.wellen, this.layer);
        game.physics.arcade.collide(this.stars, this.layer);
        game.physics.arcade.collide(this.stars, this.wellen);
        game.physics.arcade.collide(this.stars, this.spitzen);
        game.physics.arcade.collide(this.enemiesGroup, this.layer);
        /*
            game.physics.arcade.collide(this.spitzen, this.emitter);
            game.physics.arcade.collide(this.layer, this.emitter);
            */

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        game.physics.arcade.overlap(this.player, this.enemiesGroup, this.hitEnemy, null, this);
        game.physics.arcade.overlap(this.player, this.spitzen, this.hitSpitzen, null, this);
        game.physics.arcade.overlap(this.player, this.wellen, this.hitSpueli, null, this);
        game.physics.arcade.overlap(this.player, this.exits, this.startNextLevel, null, this);     

        
        // Timer wird gestartet
        this.currentTimer.start();
        // Wenn R gedr�ckt wird, wird das Spiel neu gestartet
      
        
        // Bewegung vom Spieler
        this.playerMovement();

    },



    playerMovement: function() {
        if(!(isInAir)){
            this.player.body.velocity.x = 0;
        }
        
        // Spieler darf sich nur bewegen wenn shitboy nicht tot ist.
        if(this.player.alive == false){
        }else{
            if (this.cursor.left.isDown && !(blockLeftKey)){
                this.runLeft();
                this.playRunSound();
            }else if (this.cursor.right.isDown && !(blockRightKey)){
                this.runRight();
                this.playRunSound();
            }else{
                this.standStill();
            }
            // Jump Animation, wenn notwendig
            this.jump();
            
            // Guckt ob der Spieler sich gerade nach oben oder unten bewegt
            if(upDownDirection < this.player.body.y){
                playerMoves = "down";
            } else if(upDownDirection > this.player.body.y){
                playerMoves = "up";
            } else if(upDownDirection == this.player.body.y){
                playerMoves = "stand";
            }
            upDownDirection = this.player.body.y; 
            
            
            if(!(this.cursor.left.isDown)){
                blockLeftKey = false;
            }
            
            if(!(this.cursor.right.isDown)){
                blockRightKey = false;
            }
            
            if(!(this.spaceKey.isDown) && this.cursor.left.isDown){
                blockUpKeyForLeft = false;
            }
            
            if(!(this.spaceKey.isDown) && this.cursor.right.isDown){
                blockUpKeyForRight = false;
            }
            
            if(!(this.spaceKey.isDown)){
                isInJump = false;
            }
            
            if(this.player.body.blocked.down){
                this.player.body.acceleration.x = 0;
                inWallJump = false;
                jumpOnWall = false;
                isInAir = false;
            }
        }
    },

    playRunSound: function() {
        // Runsound wird abgespielt
        if(!this.runSoundPlayed && this.player.body.blocked.down) {
            this.runSoundPlayed = true;
            this.runSound.play();
            // Jumpsound wird erst nach einem Timeout wieder abgespielt um Überlagerungen der Sounds zu vermeiden
            game.time.events.add(Phaser.Timer.SECOND * 0.15, this.playRunSoundReset, this).autoDestroy = true;

        }
    },
    
    playRunSoundReset: function() {
       this.runSoundPlayed = false;    
    },

    jump: function() {
        //  Allow the player to jump if they are touching the ground.
        if (this.spaceKey.isDown && this.player.body.blocked.down && !(isInJump)){
            this.player.body.velocity.y = -300;
            
            isInJump = true;
            
            this.jumpSound.play();
            this.player.frame= 8;
        }  else if(!this.player.body.blocked.down && this.cursor.left.isDown && this.player.body.blocked.left){
            this.player.frame= 20;
        }  else if(!this.player.body.blocked.down && this.cursor.right.isDown && this.player.body.blocked.right){
            this.player.frame= 21;
        } else if(!this.player.body.blocked.down && this.cursor.right.isDown){
            this.player.frame= 8;
        } else if(!this.player.body.blocked.down && this.cursor.left.isDown){
            this.player.frame= 0;
        } 
        if(!this.spaceKey.isDown){
            this.player.body.velocity.y = this.player.body.velocity.y+10;
        }
    },

    runLeft: function() {
         //  Move to the left
        this.player.body.velocity.x = -300;
        this.player.animations.play('left');
        
        if(this.player.body.blocked.left && !(isOnLeftWall)){
            isOnLeftWall = true;
            blockUpKeyForLeft = true;
        }
        
        if(!(this.player.body.blocked.left)){
            isOnLeftWall = false;
            blockUpKeyForLeft = false;
        }
        
        if(this.player.body.blocked.left){
            
            if(!(this.player.body.blocked.down) && playerMoves == "down"){
                slidesOnWall = true;
                this.player.body.velocity.y = this.player.body.velocity.y*0.8;
            } else {
                slidesOnWall = false;
            } 
            
        }
        
        if(slidesOnWall && !(isInJump)){
            if(this.player.body.blocked.left && this.spaceKey.isDown && !(blockUpKeyForLeft) && !(this.player.body.blocked.down)){
                //if(!(inWallJump)){
                    isInAir = true;
                    blockLeftKey = true;
                    this.jumpSound.play();
                    game.time.events.add(Phaser.Timer.SECOND * 0.4, this.resetwalljumpKeys, this).autoDestroy = true;
                    inWallJump = true;
                    isOnLeftWall = false;
                    this.player.body.velocity.y = -300;
                    this.player.body.velocity.x = 150;
                //} 
            }
        }
        
    },

    runRight: function() {
        //  Move to the right
        this.player.body.velocity.x = 300;
        this.player.animations.play('right');
        
        if(this.player.body.blocked.right && !(isOnRightWall)){
            isOnRightWall = true;
            blockUpKeyForRight = true;
        }
        
        if(!(this.player.body.blocked.right)){
            isOnRightWall = false;
            blockUpKeyForRight = false;
        }
        
        if(this.player.body.blocked.right){
            
            if(!(this.player.body.blocked.down) && playerMoves == "down"){
                slidesOnWall = true;
                this.player.body.velocity.y = this.player.body.velocity.y*0.8;
            } else {
                slidesOnWall = false;
            } 
            
        }
        
        if(slidesOnWall && !(isInJump)){
            if(this.player.body.blocked.right && this.spaceKey.isDown && !(blockUpKeyForRight) && !(this.player.body.blocked.down)){
                //if(!(inWallJump)){
                    isInAir = true;
                    blockRightKey = true;
                    this.jumpSound.play();
                    game.time.events.add(Phaser.Timer.SECOND * 0.4, this.resetwalljumpKeys, this).autoDestroy = true;
                    inWallJump = true;
                    isOnRightWall = false;
                    this.player.body.velocity.y = -300;
                    this.player.body.velocity.x = -150;
                //} 
            }
        }
        
    },

    standStill: function() {
         //  Stand still
        this.player.animations.stop();
        this.player.frame = 4;
    },

 // Game Pausieren this.game.paused=true; --- Florian

   /* collectStar: function(player, star) {
        // Removes the star from the screen
        star.kill();
        this.collectSound.play();

        //  Add and update the score
        this.scoreText.visible=true;
        this.score += 10;
        this.scoreText.text = 'score: ' + this.score;

        if(this.score == 120){
            this.winSound.play();
            game.time.events.add(Phaser.Timer.SECOND * 2, this.restartGame, this).autoDestroy = true;

        }
    },*/

    resetwalljumpKeys: function(){

        blockLeftKey=false;
        blockRightKey= false;
    },
    
    hitEnemy: function() {
        if (this.player.alive == false)
            return;
        this.deathSound.play();
        this.player.animations.play('death', 10, false, true);
        this.blutig();
        this.player.alive  = false;
        game.time.events.add(Phaser.Timer.SECOND * 2, this.restartGame, this).autoDestroy = true;
    },   

     hitSpitzen: function() {
        if (this.player.alive == false)
            return;
        this.deathSound.play();
        this.player.animations.play('death', 10, false, true);
        this.blutig();
        this.player.alive  = false;
        game.time.events.add(Phaser.Timer.SECOND * 2, this.restartGame, this).autoDestroy = true;

    },        



    hitSpueli: function() {
        if (this.player.alive == false)

            return;
        this.saeureSound.play();
        this.player.animations.play('deathspueli', 10, false, true);
        this.player.alive  = false;
        game.time.events.add(Phaser.Timer.SECOND * 2, this.restartGame, this).autoDestroy = true;
    },    


    blutig: function(){
        this.emitter = game.add.emitter(this.player.x+15, this.player.y+20, 100);
        this.emitter.makeParticles('blut');
        this.emitter.minParticleScale = 2; 
        this.emitter.gravity = 300;
        this.emitter.angularDrag = 30;
        this.emitter.start(true, 10000,null, 100);
    },
    
    blutigSpitze: function(){
        this.emitter = game.add.emitter(this.player.x+15, this.player.y+50, 100);

        this.emitter.makeParticles('blut');

        this.emitter.minParticleScale = 2;
        this.emitter.gravity = 300;


        this.emitter.angularDrag = 30;
        this.emitter.start(true, 10000,null, 100);
    },


    restartGame: function() {
        this.bgSound.stop();
        //this.startLevel("Level2.json")
        game.state.start("Boot",true,false,this.level);
    },     

     // Funktion die markierungen erstellt an denen die Gegner umkehren sollen (Patroullieren)
    createMarks: function(x,y) {
        var mark = this.marker.create(x,y);
        mark.body.immovable = true;
        mark.body.width = 10;
        mark.body.height = 200;
        this.marks.push(mark);
    },  
    /*
    *   Funktion die Gegener erstellt.
    *       x - X Position des Gegners
    *       y - Y Position des Gegners
    *       richtung - Richtung in die der Gegner läuft. (-1 für linksrum, 1 für rechtsrum)
    *       geschwindigkeit - Geschwindigkeit in die der Gegner laufen soll
    */
    createEnemy: function(x,y, richtung, geschwindigkeit,type) {
        var enemy = new Enemy(game, this.platforms,this.marks ,x, y, richtung, geschwindigkeit,type);
        this.enemiesGroup.add(enemy);
    }, 

    createEnemies: function(type) {
        var result = this.findObjectsByType(type, this.map, 'Gegner');
        result.forEach(function(element){
            this.createEnemy(element.x,element.y,1,300,type);
        }, this);
    },   

    /*
    createPlayer: function(){
        var result = this.findObjectsByType('player',this.map,'Spieler');
        result.forEach(function(element){
            this.player = new Player(element.x, element.y,300)
        }, this);
        console.log(this.player);
    },*/

    createPlayerFromJson: function(){
        var result = this.findObjectsByType('player',this.map,'Spieler');
        var player;
        result.forEach(function(element){
            player = this.createPlayer(element.x,element.y)
           // this.player = new Player(element.x, element.y,300)
        }, this);
        return player;
    },

    createPlayer: function(x,y){
        var player;
        // The player and its settings
        player = game.add.sprite(x, y, 'dude');
        game.physics.arcade.enable(player);
        player.scale.setTo(0.8, 0.8);
          
        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [1, 2, 3], 20, true);
        player.animations.add('right', [5, 6, 7], 20, true);
        player.animations.add('reborn', [14,13,12,11,10], 20, true);
        player.animations.add('death', [10, 11, 12, 13, 14], 20, true);
        player.animations.add('deathspueli', [16,17,18,18,14], 20, true);
        return player;
    },

    createExits: function(){
        var result = this.findObjectsByType('toilet',this.map,'Ende');
        var exit;
        result.forEach(function(element){
            exit = game.add.sprite(element.x, element.y, 'toilet');
            this.exits.add(exit);    
        }, this);
    },        
    
    updateTimer: function() {
        // Setzt den Countdown um minus eins
        timeEnd--;
        
        // Wenn weniger als 5 sekunden -> Text rot
        if(timeEnd <= 50){
            // Text und Hintergrund ausblenden
            timerTextSprite.visible = false;
            timerText.visible = false;
            
            // Roten Text und Hintergrund einblenden + Text Updaten
            timerTextRed.visible = true;
            timerTextRedSprite.visible = true;
            timerTextRed.setText('Timer: '+ (timeEnd/10));
        } else {
            // Text und Hintergrund einblenden + Text Update
            timerTextSprite.visible = true;
            timerText.visible=true;
            timerText.setText('Timer: '+ (timeEnd/10));
        }
        
        // Wenn Zeit abl�uft dann restartGame
        if(timeEnd == 0){
            this.restartGame();
        } 
    },
    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element){
        if(element.properties.type === type) {
            element.y -= map.tileHeight;
            result.push(element);
        }      
        });
        return result;
    },
     //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    startLevel: function(Level) {
        game.state.start("Boot",true,false,Level);
    },
     //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    startNextLevel: function(Level) {
        this.bgSound.stop();
        level = this.level+1;
        game.state.start("Boot",true,false,level);
    },
};