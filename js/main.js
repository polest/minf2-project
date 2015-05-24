var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });
var platforms;    
var ground;
var ledge;
var player;
var baddie;
var baddieDirection;
var stars;
var score = 0;
var scoreText;
var cursor;

var collectSound;
var jumpSound;
var runSound;
var deathSound;
var winSound;

var jumpSoundPlayed = false;
var collectSoundPlayed = false;
var winSoundPlayed = false;
var runSoundPlayed = false;

//unsichtbare Marker wo Gegner die Richtung ändern
var marker;
var marks = [];

var enemy;

function preload(){ 
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
    game.load.spritesheet('dude', 'assets/shitboy.png', 32, 48);
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32)

    // Sounds werden geladen
    game.load.audio('jump', 'assets/sounds/jump2.wav'); 
    game.load.audio('run', 'assets/sounds/run3.wav'); 
    game.load.audio('death', 'assets/sounds/death.wav'); 
    game.load.audio('collect', 'assets/sounds/collect.wav');
    game.load.audio('win', 'assets/sounds/win.wav');

}

function create() { 
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(20, game.world.height - 150, 'dude');
    player.scale.setTo(1, 1);

    baddie = game.add.sprite(300, game.world.height - 150, 'baddie');
    baddie.scale.setTo(1,1);

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(baddie);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    baddie.body.bounce.y = 0;
    baddie.body.gravity.y = 300;
    baddie.body.collideWorldBounds = true;
    baddie.body.velocity.x = 300;
    baddie.animations.play("right");
    baddieDirection = "right";

    //  Our two animations, walking left and right.
    player.animations.add('left', [1, 2, 3], 20, true);
    player.animations.add('right', [5, 6, 7], 20, true);
    player.animations.add('death', [10, 11, 12, 13, 14, 15, 16, 17], 20, true);

    baddie.animations.add("left", [0,1], 20, true);
    baddie.animations.add("right", [2,3], 20, true);
    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++){
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursor = game.input.keyboard.createCursorKeys();

    // Jumpsound hinzugefügt
    jumpSound = game.add.audio('jump',0.2);

    // RunSound hinzugefügt
    runSound = game.add.audio('run',0.2);

    // DeathSound hinzugefügt
    deathSound = game.add.audio('death',0.3);

    // collectSound hinzugefügt
    collectSound= game.add.audio('collect',0.1);

    // winSound hinzugefügt
    winSound= game.add.audio('win',0.5);

    marker = game.add.group();
    marker.enableBody = true;

    //linker marker
    createMarks(400,370);

   enemy = new Enemy(game, platforms, marks ,800, 300, -1, 300);
   game.add.existing(enemy);
}

function update(){
     //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(baddie, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, baddie, hitEnemy, null, this);

    // Bewegung vom Spieler
    playerMovement();

    // Bewegung von Prototyp Gegner
    enemyMovement();
}

function playerMovement() {
    player.body.velocity.x = 0;
    // Spieler darf sich nur bewegen wenn shitboy nicht tot ist.
    if(player.alive == false){
        player.animations.play('death', 10, false, true);
    }else{
        if (cursor.left.isDown){
            runLeft();
            playRunSound();
        }else if (cursor.right.isDown){
            runRight();
            playRunSound();
        }else{
            standStill();
        }
        // Jump Animation, wenn notwendig
        jump();
    }
}

function playRunSound() {
    // Runsound wird abgespielt
    if(!runSoundPlayed && player.body.touching.down) {
        runSoundPlayed = true;
        runSound.play();
        // Jumpsound wird erst nach einem Timeout wieder abgespielt um Überlagerungen der Sounds zu vermeiden
        game.time.events.add(Phaser.Timer.SECOND * 0.15, playRunSoundReset, this).autoDestroy = true;
    }
}
    
function playRunSoundReset(){
    runSoundPlayed = false;    
}

function jump() {
    //  Allow the player to jump if they are touching the ground.
    if (cursor.up.isDown && player.body.touching.down){
        player.body.velocity.y = -300;
        jumpSound.play();
        player.frame= 8;
    } else if(!player.body.touching.down && cursor.right.isDown){
        player.frame= 8;
    } else if(!player.body.touching.down && cursor.left.isDown){
        player.frame= 0;
    } 
    if(!cursor.up.isDown){
        player.body.velocity.y = player.body.velocity.y+10;
    }
}

function runLeft() {
    //  Move to the left
    player.body.velocity.x = -300;

    player.animations.play('left');
}

function runRight() {
    //  Move to the right
    player.body.velocity.x = 300;

    player.animations.play('right');
}

function standStill() {
     //  Stand still
    player.animations.stop();
    player.frame = 4;
}

function enemyMovement() {
    if(baddie.body.velocity.x == -0){
        if(baddieDirection == "right"){
            baddie.body.velocity.x = -300;
            baddie.animations.play('left');
            baddieDirection = "left";   
        }else{
            baddie.body.velocity.x = 300;
            baddie.animations.play('right');
            baddieDirection = "right";  
        }
    }
}
// Game Pausieren this.game.paused=true; --- Florian

function collectStar(player,star){
    // Removes the star from the screen
    star.kill();
    collectSound.play();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

    if(score == 120){
        winSound.play();
        game.time.events.add(Phaser.Timer.SECOND * 2, restartGame, this).autoDestroy = true;

    }
}

function hitEnemy(){
    if (player.alive == false)
        return;
    deathSound.play();
    player.alive  = false;
    game.time.events.add(Phaser.Timer.SECOND * 0.5, restartGame, this).autoDestroy = true;
}        

function  restartGame(){
  //  game.state.start('main');
}

// Funktion die markierungen erstellt an denen die Gegner umkehren sollen (Patroullieren)
function createMarks(x,y){
    var mark = marker.create(x,y);
    mark.body.immovable = true;
    mark.body.width = 10;
    mark.body.height = 200;
    marks.push(mark);
}

//game.state.add('main', create);  
//game.state.start('main');
