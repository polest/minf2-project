var game = new Phaser.Game(1024, 640, Phaser.AUTO, 'gameDiv');
var enemyContainer = [];

var mainState = {
    
    preload: function() { 
        /*
        * Parameter:
        * 1. Name unter dem das image/sprite nachher abgerufen werden kann.
        * 2. URL des Bildes
        * 3. Höhe des Bildes
        * 4. Schrittweite des Sprites.
        */
        game.load.image('sky', 'assets/bg.png');
        game.load.image('star', 'assets/pixel.png');
        game.load.spritesheet('dude', 'assets/sprites/shitboy.png', 32, 48);
        game.load.spritesheet('Ratte', 'assets/sprites/kroeten.png', 50, 48)

         // Sounds werden geladen
        game.load.audio('jump', 'assets/sounds/jump2.wav'); 
        game.load.audio('run', 'assets/sounds/run3.wav'); 
        game.load.audio('death', 'assets/sounds/death.wav'); 
        game.load.audio('collect', 'assets/sounds/collect.wav');
        game.load.audio('win', 'assets/sounds/win.wav');
        game.load.audio('saeure', 'assets/sounds/saeure.wav');

        game.load.tilemap('map', 'assets/tilemaps/level1_enemy.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('erde1', 'assets/tiles/erde1.png');
        game.load.image('Spitze', 'assets/tiles/Spitze.png');
        game.load.image('WieseEckL', 'assets/tiles/WieseEckL.png');
        game.load.image('WieseEckR', 'assets/tiles/WieseEckR.png');
        game.load.image('toilet', 'assets/tiles/toilet.png');
        game.load.image('blut', 'assets/image/blut.png');
        game.load.image('wiese123', 'assets/tiles/wiese123.png');
        game.load.spritesheet('welle', 'assets/sprites/spueli1.png', 32, 32);

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
        this.player = game.add.sprite(100, game.world.height - 250, 'dude');
        this.player.scale.setTo(0.8, 0.8);


        //  We need to enable physics on the player
        this.game.physics.arcade.enable(this.player);
        this.game.physics.arcade.enable(this.layer);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [1, 2, 3], 20, true);
        this.player.animations.add('right', [5, 6, 7], 20, true);
        this.player.animations.add('death', [10, 11, 12, 13, 14], 20, true);
        this.player.animations.add('deathspueli', [16,17,18,19,14], 20, true);

        //  Finally some stars to collect
       /* this.stars = game.add.group();

        //  We will enable physics for any star that is created in this group
        this.stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++){
            //  Create a star inside of the 'stars' group
            var star = this.stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }*/

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

        // Timer wird definiert
        // Countdown Zeit in zehntel Sekunden (150 = 15 Sekunden)
        timeEnd = 150;
        
        // Erstellt einen roten Timer Text und fixiert ihn
        var timerTextRedSprite = game.add.sprite(0,0);
        timerTextRedSprite.fixedToCamera = true;
        
        timerTextRed = game.add.text(0, 0, 'Timer: '+timeEnd, { font: '32px VT323', fill: '#FF0000', backgroundColor: 'rgba(0,255,0)' });
        timerTextRedSprite.addChild(timerTextRed);
        
        // X und Y Position wo der Text gefixed werden soll
        timerTextRedSprite.cameraOffset.x = 50;
        timerTextRedSprite.cameraOffset.y = 0;
        
        // Erstellt einen schwarzen Timer Text und fixiert ihn
        var timerTextSprite = game.add.sprite(0,0);
        timerTextSprite.fixedToCamera = true;
        
        timerText = game.add.text(0, 0, 'Timer: '+timeEnd, { font: '32px VT323', fill: '#000', backgroundColor: 'rgba(0,255,0)' });
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

        resetKey = game.input.keyboard.addKey(Phaser.Keyboard.R)
        
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

        this.marker = game.add.group();
        this.marker.enableBody = true;
        //unsichtbare Marker wo Gegner die Richtung ändern
        this.marks = [];
        //linker marker

        this.createMarks(260,500);
        this.createMarks(90,500);

        this.enemiesGroup = game.add.group();
        this.enemiesGroup.enableBody = true;
        this.createEnemy(600,880,-1,300,"baddie")
        this.createEnemy(200, 500, -1,300,"baddie");
        
        game.camera.follow(this.player);
        
        this.map = map;
        this.createEnemies("baddie");

       

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


        // Timer wird gestartet
        this.currentTimer.start();
        // Wenn R gedr�ckt wird, wird das Spiel neu gestartet
        if(resetKey.justPressed(/*optional duration*/)){
            this.restartGame();
        }
        
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
            
            //this.player.body.blocked.up || this.player.body.blocked.right || this.player.body.blocked.down || this.player.body.blocked.left
            if(this.player.body.blocked.down){
                isInAir = false;
            }
            
            if(!(this.cursor.left.isDown)){
                blockLeftKey = false;
            }
            
            if(!(this.cursor.right.isDown)){
                blockRightKey = false;
            }
            
            if(!(this.cursor.up.isDown) && this.cursor.left.isDown){
                blockUpKeyForLeft = false;
            }
            
            if(!(this.cursor.up.isDown) && this.cursor.right.isDown){
                blockUpKeyForRight = false;
            }
            
            if(this.player.body.blocked.down){
                this.player.body.acceleration.x = 0;
                inWallJump = false;
                jumpOnWall = false;
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
        if (this.cursor.up.isDown && this.player.body.blocked.down){
            this.player.body.velocity.y = -300;
            this.jumpSound.play();
            this.player.frame= 8;
        } else if(!this.player.body.blocked.down && this.cursor.right.isDown){
            this.player.frame= 8;
        } else if(!this.player.body.blocked.down && this.cursor.left.isDown){
            this.player.frame= 0;
        } 
        if(!this.cursor.up.isDown){
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
        
        if(this.player.body.blocked.left){
            
            this.player.body.velocity.y = this.player.body.velocity.y*0.8;
        }
        
        if(this.player.body.blocked.left && this.cursor.up.isDown && !(blockUpKeyForLeft) && !(this.player.body.blocked.down)){
            //if(!(inWallJump)){
                isInAir = true;
                blockLeftKey = true;
                inWallJump = true;
                isOnLeftWall = false;
                this.player.body.velocity.y = -300;
                this.player.body.velocity.x = 150;
            //} 
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
        
        if(this.player.body.blocked.right){
           
            this.player.body.velocity.y = this.player.body.velocity.y*0.8;
        }
        
        if(this.player.body.blocked.right && this.cursor.up.isDown && !(blockUpKeyForRight) && !(this.player.body.blocked.down)){
            //if(!(inWallJump)){
                isInAir = true;
                blockRightKey = true;
                inWallJump = true;
                isOnRightWall = false;
                this.player.body.velocity.y = -300;
                this.player.body.velocity.x = -150;
            //} 
        }
        
    },

    standStill: function() {
         //  Stand still
        this.player.animations.stop();
        this.player.frame = 4;
    },

 // Game Pausieren this.game.paused=true; --- Florian

    collectStar: function(player, star) {
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

    restartGame: function() {
        game.state.start('main');
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
        game.state.start('main');
    },     

    restartGame: function() {
        game.state.start('main');
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
    
    updateTimer: function() {
        // Setzt den Countdown um minus eins
        timeEnd--;
        
        // Wenn weniger als 5 sekunden -> Text rot
        if(timeEnd <= 50){
            timerText.visible = false;
            timerTextRed.visible = true;
            timerTextRed.setText('Timer: '+ (timeEnd/10));
        } else {
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
    
};

game.state.add('main', mainState);  
game.state.start('main'); 