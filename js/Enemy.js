
    Enemy = function (game,platforms, x, y, direction, speed) {
        Phaser.Sprite.call(this, game, x, y, "baddie");
        this.anchor.setTo(0.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.xSpeed = direction*speed;
        this.body.gravity.y = 300;
        this.body.collideWorldBounds = true;
        this.game = game;
        this.platforms = platforms;
        this.body.velocity.x = this.xSpeed;
        if(direction <0 ){
            this.enemyDirection = "left";
        }else{
            this.enemyDirection = "right";
        }
        this.animations.add("left", [0,1], 20, true);
        this.animations.add("right", [2,3], 20, true);
    };
        
    Enemy.prototype = Object.create(Phaser.Sprite.prototype);
    Enemy.prototype.constructor = Enemy;
    
    Enemy.prototype.update = function() {
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
        game.physics.arcade.collide(this, this.platforms, moveEnemy);
        
    };

    function moveEnemy(enemy,platform){
        if(enemy.xSpeed>0 && enemy.x>platform.x+platform.width/2 || enemy.xSpeed<0 && enemy.x<platform.x-platform.width/2){
            enemy.xSpeed*=-1;
        }   
    }