
    Player = function (game,platforms, x, y, speed) {
        Phaser.Sprite.call(this, game, x, y, type);
        this.anchor.setTo(0.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.gravity.y = 300;
        this.body.collideWorldBounds = true;
        this.platforms = platforms;
        this.body.velocity.x = this.speed;
        this.anchor.setTo(0.5);

        this.animations.add("left", [0,1,2], 20, true);
        this.animations.add("right", [3,4,5], 20, true);
    };
        
    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Enemy;
    
    Player.prototype.update = function() {

         if(this.body.velocity.x == -0){
            if(this.enemyDirection == "right"){
                this.body.velocity.x = -300;
                this.animations.play('left');
                this.enemyDirection = "left";   
            }else{
                this.body.velocity.x = 300;
                this.animations.play('right');
                this.enemyDirection = "right";  
            }
        }


        game.physics.arcade.collide(this, this.platforms);
        game.physics.arcade.overlap(this, this.marks, this.changeDirection);
    };

    Enemy.prototype.changeDirection = function(enemy,marks) {
        enemy.body.velocity.x *= -1;
        if(enemy.body.velocity.x == -300){
            enemy.animations.play('left');
        }else if (enemy.body.velocity.x == 300){
            enemy.animations.play('right');
        }
    };
