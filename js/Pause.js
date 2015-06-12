var MainGame = MainGame || {};

MainGame.Pause = function(){};

MainGame.Pause.prototype = {


    

    preload: function() {
            game.load.image('menu_title', 'assets/Menu.png');
            game.load.image('menu_arrow', 'assets/Menu/Arrow.png');
            game.load.image('pause', 'assets/Pause/Pause.png');
            game.load.image('menu_button1', 'assets/Pause/Hauptmenu.png');
            game.load.image('menu_button2', 'assets/Pause/Level.png');
            game.load.image('menu_button3', 'assets/Pause/How_To.png');
            game.load.image('menu_button4', 'assets/Pause/Weiter.png');
    },


    create: function() {

        //Add the game title so we know the state is properly working

            this.cursors = game.input.keyboard.createCursorKeys();
            this.pos = [50, 120, 190, 260];
            this.arrow();

            this.buttons = this.draw1();

            this.gameTitle = game.add.image(
            game.world.centerX, game.world.centerY, 'menu_title');
            this.pauseBanner = game.add.image(game.world.centerX, game.world.centerY - 50, 'pause');
            this.pauseBanner.anchor.setTo(0.5, 0.5);
            this.gameTitle.anchor.setTo(0.5, 0.5);
            this.draw2();
            this.draw1();
            

            

    },

    update: function() {
            this.move(this.cursors, this.buttons);
    },

    draw1: function(){
            //We track which callback each button has
            callbacks = ['playState', 'playState', 'playState', 'playState'],
            //We now create our buttons using a constructor function, YAY!
            this.button1 = this.addButton(1, this.playState);
            this.button1.anchor.setTo(0.5, 0.5);

            this.button2 = this.addButton(2, this.playState);
            this.button2.anchor.setTo(0.5, 0.5);

            this.button3 = this.addButton(3, this.playState);
            this.button3.anchor.setTo(0.5, 0.5);

            this.button4 = this.addButton(4, this.playState);
            this.button4.anchor.setTo(0.5, 0.5);

            return [this.button1, this.button2, this.button3, this.button4];
    },

    draw2: function(){
            this.arrow = game.add.image(game.world.centerX - 100, game.world.centerY + this.pos[0], 'menu_arrow');
            this.arrow.anchor.setTo(0.5, 0.5);
            
            //Arrow will take 200ms to go up/down the menu
            this.arrow.moveDelay = 200;
            
            //Control if the arrow should keep moving or not
            this.arrow.canMove = true;
            
            //Keep track of the current button the pointer is at
            this.arrow.currentButton = 1;
            
            //We add an horizontal tween so that the arrow feels nicer
            game.add.tween(this.arrow)
                .to({
                    x: this.arrow.x - 10
                }, 700, Phaser.Easing.Quadratic.Out).to({
                    x: this.arrow.x
                }, 400, Phaser.Easing.Quadratic.In).loop()
                .start();
    },


    move: function() {
            if (this.cursors.down.isDown && this.arrow.canMove) {
                //This stops the arrow from traveling way too fast
                this.arrow.canMove = false;
                
                //Which is reset to true after a 255ms delay
                this.allowMovement();
                
                if (this.arrow.currentButton === 1) {
                    this.tween(this.buttons, 2);
                } else if (this.arrow.currentButton === 2) {
                    this.tween(this.buttons, 3);
                }else if (this.arrow.currentButton === 3){
                    this.tween(this.buttons, 4);
                }else{
                    this.tween(this.buttons, 1);
                }
            }

            if (this.cursors.up.isDown && this.arrow.canMove) {
                this.arrow.canMove = false;
                this.allowMovement();
                if (this.arrow.currentButton === 1) {
                    this.tween(this.buttons, 4);
                } else if (this.arrow.currentButton === 4) {
                    this.tween(this.buttons, 3);
                } else if (this.arrow.currentButton === 3) {
                    this.tween(this.buttons, 2);
                }else{
                    this.tween(this.buttons, 1);
                }
            }

            if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
                //This will activate the button that the pointer is at
                this.activateButton(this.buttons, this.arrow.currentButton);
            }
    },

    tween: function(buttons, buttonNum) {
            game.add.tween(this.arrow).to({
                y: game.world.centerY + this.pos[buttonNum - 1]
            }, 
                this.arrow.moveDelay, Phaser.Easing.Quadratic.In)
                .start();
                this.arrow.currentButton = buttonNum;
    },

    allowMovement: function() {
            game.time.events.add(255, (function () {
                this.arrow.canMove = true;
            }), this);
    },

    activateButton: function(buttons, currentButton) {
        if(this.arrow.currentButton === 1){
            game.state.add('Menu', MainGame.Menu);
            game.state.start('Menu');
        }else if(this.arrow.currentButton === 2){
            game.state.add('LevelMenu1', MainGame.LevelMenu1);
            game.state.start('LevelMenu1');
        }else if(this.arrow.currentButton === 3){
            console.log('3');
        }else if(this.arrow.currentButton === 4){
            this.game.paused = false;
        }
    },


    arrow: function(){
        this.draw2();
        this.move();
        this.tween(this.buttons);
        this.allowMovement();
        this.activateButton();
    },

    addButton: function(button, func) {
        console.log(this.pos[button-1]);
        return game.add.button(game.world.centerX,game.world.centerY + this.pos[button - 1],'menu_button' + button, func);
    }

}

