var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'gameDiv');

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
        game.load.image('ground', 'assets/Wiese2.png');
        game.load.image('groundendR', 'assets/Wiese3.png');
        game.load.image('groundendL','assets/Wiese1.png');
        game.load.image('star', 'assets/pixel.png');
        game.load.spritesheet('dude', 'assets/shitboy.png', 32, 48);
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
        game.add.sprite(0, -400, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;

        // Here we create the ground.
        this.ground = this.platforms.create(0, game.world.height - 30, 'ground');
        this.ground1 = this.platforms.create(100, game.world.height - 30, 'ground');
        this.ground2 = this.platforms.create(200, game.world.height - 30, 'ground');
        this.ground3 = this.platforms.create(300, game.world.height - 30, 'ground');
        this.ground4 = this.platforms.create(400, game.world.height - 30, 'ground');
        this.ground5 = this.platforms.create(500, game.world.height - 30, 'ground');
        this.ground6 = this.platforms.create(600, game.world.height - 30, 'ground');
        this.ground7 = this.platforms.create(700, game.world.height - 30, 'ground');
        this.ground8 = this.platforms.create(800, game.world.height - 30, 'ground');
        this.ground9 = this.platforms.create(900, game.world.height - 30, 'ground');
        this.ground10 = this.platforms.create(1000, game.world.height - 30, 'ground');

        this.ground11 = this.platforms.create(0, game.world.height - 30, 'ground');
        this.ground12 = this.platforms.create(100, game.world.height - 30, 'ground');
        this.ground13 = this.platforms.create(200, game.world.height - 30, 'ground');
        this.ground14 = this.platforms.create(300, game.world.height - 30, 'ground');
        this.ground15 = this.platforms.create(400, game.world.height - 30, 'ground');
        this.ground16 = this.platforms.create(500, game.world.height - 30, 'ground');
        this.ground17 = this.platforms.create(600, game.world.height - 30, 'ground');
        this.ground18 = this.platforms.create(700, game.world.height - 30, 'ground');
        this.ground19 = this.platforms.create(800, game.world.height - 30, 'ground');
        this.ground20 = this.platforms.create(900, game.world.height - 30, 'ground');
        this.ground21 = this.platforms.create(1000, game.world.height - 30, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)

        //  This stops it from falling away when you jump on it
        this.ground.body.immovable = true;
        this.ground1.body.immovable = true;
        this.ground2.body.immovable = true;
        this.ground3.body.immovable = true;
        this.ground4.body.immovable = true;
        this.ground5.body.immovable = true;
        this.ground6.body.immovable = true;
        this.ground7.body.immovable = true;
        this.ground8.body.immovable = true;
        this.ground9.body.immovable = true;
        this.ground10.body.immovable = true;

         this.ground11.body.immovable = true;
        this.ground12.body.immovable = true;
        this.ground13.body.immovable = true;
        this.ground14.body.immovable = true;
        this.ground15.body.immovable = true;
        this.ground16.body.immovable = true;
        this.ground17.body.immovable = true;
        this.ground18.body.immovable = true;
        this.ground19.body.immovable = true;
        this.ground20.body.immovable = true;
        this.ground21.body.immovable = true;
           

        //  Now let's create two ledges
        this.ledge2 = this.platforms.create(450, 450, 'groundendL');
        this.ledge2.body.immovable = true;
        this.ledge1 = this.platforms.create(550, 450, 'groundendR');
        this.ledge1.body.immovable = true;

        this.ledge = this.platforms.create(300, 300, 'ground');
        this.ledge.body.immovable = true;

        // The player and its settings
        this.player = game.add.sprite(20, game.world.height - 150, 'dude');
        this.player.scale.setTo(0.8, 0.8);

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
        this.player.animations.add('death', [10, 11, 12, 13, 14, 15, 16, 17], 20, true);

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


        //  The score
        this.scoreText = game.add.text(16, 16, 'score: 0', {font:"30px VT323", fill: '#000' });
        this.score = 0;

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
        // Spieler darf sich nur bewegen wenn shitboy nicht tot ist.
        if(this.player.alive == false){
            this.player.animations.play('death', 10, false, true);
        }else{
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
        }
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
        this.player.alive  = false;
        game.time.events.add(Phaser.Timer.SECOND * 0.5, this.restartGame, this).autoDestroy = true;
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