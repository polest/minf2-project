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
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude13.png', 32, 48);
        game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32)
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
    },

    update: function() {
         //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.stars, this.platforms);
        game.physics.arcade.collide(this.baddie, this.platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        game.physics.arcade.overlap(this.player, this.baddie, this.hitEnemy, null, this);

        this.cursor.left.onDown.add(this.runLeft, this);
        this.cursor.right.onDown.add(this.runRight, this);
        this.cursor.up.onDown.add(this.jump, this);
        if (this.cursor.left.isUp && this.cursor.right.isUp && this.cursor.up.isUp) {
            this.standStill();
        }

        // Bewegung von Prototyp Gegner
        this.enemyMovement();
    },

    jump: function() {
        //  Allow the player to jump if they are touching the ground.
        if (this.cursor.up.isDown && this.player.body.touching.down){
            this.player.body.velocity.y = -350;
            this.player.frame= 8;
        } else if(!this.player.body.touching.down && this.cursor.right.isDown){
            this.player.frame= 8;
        } else if(!this.player.body.touching.down && this.cursor.left.isDown){
            this.player.frame= 0;
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
        this.player.body.velocity.x = 0;

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

    collectStar: function(player, star) {
        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;
    },

    hitEnemy: function() {
        if (this.player.alive == false)
            return;

        this.player.alive  = false;
        this.restartGame();
    },        

    restartGame: function() {
        game.state.start('main');
    }

};

game.state.add('main', mainState);  
game.state.start('main'); 