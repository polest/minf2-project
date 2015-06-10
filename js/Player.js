
    Player = function (x, y, speed) {
        Phaser.Sprite.call(this, game,game.world.height - 25, game.world.height - 25, 'dude');
        this.anchor.setTo(0.5);
        this.scale.setTo(0.8, 0.8);
        //game.physics.arcade.enable(this);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.bounce.y = 0;
        this.body.gravity.y = 300;
        this.body.collideWorldBounds = true;

        this.animations.add('left', [1, 2, 3], 20, true);
        this.animations.add('right', [5, 6, 7], 20, true);
        this.animations.add('reborn', [14,13,12,11,10], 20, true);
        this.animations.add('death', [10, 11, 12, 13, 14], 20, true);
        this.animations.add('deathspueli', [16,17,18,18,14], 20, true);

    };
        
    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;
    /*
    Player.prototype.update = function() {

    };*/

