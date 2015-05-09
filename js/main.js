var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

var mainState = {
    
    preload: function() { 
        /*
        * Parameter:
        * 1. Name unter dem das image/sprite nachher abgerufen werden kann.
        * 2. URL des Bildes
        * 3. Höhe des Bildes
        * 4. Schrittweite des Sprites.
        */
        game.load.image('sky', 'assets/back1.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude13.png', 32, 48);
        game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32)

         // Sounds werden geladen
        game.load.audio('jump', 'assets/sounds/jump2.wav'); 
        game.load.audio('run', 'assets/sounds/run3.wav'); 
        game.load.audio('death', 'assets/sounds/death.wav'); 
        game.load.audio('collect', 'assets/sounds/collect.wav');
        game.load.audio('win', 'assets/sounds/win.wav');

    },

    create: function() { 
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;

        // Here we create the ground.
        this.ground = this.platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        this.ground.body.immovable = true;

        //  Now let's create two ledges
        this.ledge = this.platforms.create(400, 400, 'ground');
        this.ledge.body.immovable = true;

        this.ledge = this.platforms.create(-150, 250, 'ground');
        this.ledge.body.immovable = true;

        // The player and its settings
        this.player = game.add.sprite(20, game.world.height - 150, 'dude');
        this.player.scale.setTo(1, 1);

        this.baddie = game.add.sprite(300, game.world.height - 150, 'baddie');
        this.baddie.scale.setTo(1,1);

        //  We need to enable physics on the player
        this.game.physics.arcade.enable(this.player);
        this.game.physics.arcade.enable(this.baddie);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        this.baddie.body.bounce.y = 0;
        this.baddie.body.gravity.y = 300;
        this.baddie.body.collideWorldBounds = true;
        this.baddie.body.velocity.x = 300;
        this.baddie.animations.play("right");
        this.baddieDirection = "right";

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [1, 2, 3], 20, true);
        this.player.animations.add('right', [5, 6, 7], 20, true);

        this.baddie.animations.add("left", [0,1], 20, true);
        this.baddie.animations.add("right", [2,3], 20, true);
        //  Finally some stars to collect
        this.stars = game.add.group();

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
        }

        this.score = 0;
        //  The score
        this.scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  Our controls.
        this.cursor = game.input.keyboard.createCursorKeys();

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

        // winSound hinzugefügt
        this.winSound=this.game.add.audio('win',0.5);
        this.winSoundPlayed=false;

        this.marker = game.add.group();
        this.marker.enableBody = true;
        //unsichtbare Marker wo Gegner die Richtung ändern
        this.marks = [];
        //linker marker

        this.createMarks(400,370);

        var enemy = new Enemy(game, this.platforms,this.marks ,800, 300, -1, 300);
        game.add.existing(enemy);


      /*  enemy = new Enemy(game, this.platforms , 100, 124,-1, 300);
        game.add.existing(enemy);
        enemy = new Enemy(game, this.platforms , 100, 204, 1, 300);
        game.add.existing(enemy)
        enemy = new Enemy(game, this.platforms , 380, 204,-1, 300);
        game.add.existing(enemy); */
    },

    update: function() {
         //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.stars, this.platforms);
        game.physics.arcade.collide(this.baddie, this.platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        game.physics.arcade.overlap(this.player, this.baddie, this.hitEnemy, null, this);

        // Bewegung vom Spieler
        this.playerMovement();

        // Bewegung von Prototyp Gegner
        this.enemyMovement();
    },

    playerMovement: function() {
        this.player.body.velocity.x = 0;
        if (this.cursor.left.isDown){
            this.runLeft();
            this.playRunSound();
        }else if (this.cursor.right.isDown){
            this.runRight();
            this.playRunSound();
        }else{
            this.standStill();
        }
        // Jump Animation, wenn notwendig
        this.jump();
    },

    playRunSound: function() {
        // Runsound wird abgespielt
        if(!this.runSoundPlayed && this.player.body.touching.down) {
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
        if (this.cursor.up.isDown && this.player.body.touching.down){
            this.player.body.velocity.y = -300;
            this.jumpSound.play();
            this.player.frame= 8;
        } else if(!this.player.body.touching.down && this.cursor.right.isDown){
            this.player.frame= 8;
        } else if(!this.player.body.touching.down && this.cursor.left.isDown){
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
    },

    runRight: function() {
        //  Move to the right
        this.player.body.velocity.x = 300;

        this.player.animations.play('right');
    },

    standStill: function() {
         //  Stand still
        this.player.animations.stop();
        this.player.frame = 4;
    },

    enemyMovement: function() {
        if(this.baddie.body.velocity.x == -0){
            if(this.baddieDirection == "right"){
                this.baddie.body.velocity.x = -300;
                this.baddie.animations.play('left');
                this.baddieDirection = "left";   
            }else{
                this.baddie.body.velocity.x = 300;
                this.baddie.animations.play('right');
                this.baddieDirection = "right";  
            }
        }
    },
 // Game Pausieren this.game.paused=true; --- Florian

    collectStar: function(player, star) {
        // Removes the star from the screen
        star.kill();
        this.collectSound.play();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;

        if(this.score == 120){
            this.winSound.play();
            game.time.events.add(Phaser.Timer.SECOND * 2, this.restartGame, this).autoDestroy = true;

        }
    },
    
    hitEnemy: function() {
        if (this.player.alive == false)
            return;
        this.deathSound.play();
        this.player.alive  = false;
        this.restartGame();
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
};

game.state.add('main', mainState);  
game.state.start('main'); 