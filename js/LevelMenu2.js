var MainGame = MainGame || {};

MainGame.LevelMenu2 = function(){};

MainGame.LevelMenu2.prototype = {


    

    preload: function() {
            game.load.image('menu_title', 'assets/Menu.png');
            game.load.image('menu_arrow', 'assets/Menu/Arrow.png');
            game.load.image('menu_button6', 'assets/LevelMenu/Level6.png');
            game.load.image('menu_button7', 'assets/LevelMenu/Level7.png');
            game.load.image('menu_button8', 'assets/LevelMenu/Level8.png');
            game.load.image('menu_button9', 'assets/LevelMenu/Level9.png');
            game.load.image('menu_button10', 'assets/LevelMenu/Level10.png');
            game.load.image('menu_button6_inactive', 'assets/LevelMenu/inactive/Level6.png');
            game.load.image('menu_button7_inactive', 'assets/LevelMenu/inactive/Level7.png');
            game.load.image('menu_button8_inactive', 'assets/LevelMenu/inactive/Level8.png');
            game.load.image('menu_button9_inactive', 'assets/LevelMenu/inactive/Level9.png');
            game.load.image('menu_button10_inactive', 'assets/LevelMenu/inactive/Level10.png');
            game.load.image('menu_button11', 'assets/LevelMenu/Back.png');
            game.load.image('menu_button12', 'assets/LevelMenu/Hauptmenu.png');
            game.load.image('HowTo', 'assets/HowToPic.png');
    },


    create: function() {

        //Add the game title so we know the state is properly working

            this.cursors = game.input.keyboard.createCursorKeys();
            this.pos = [-100, -40, 20, 80, 140, 200, 260];
            this.arrow();

            this.buttons = this.draw1();

            this.gameTitle = game.add.image(
            game.world.centerX, game.world.centerY, 'menu_title');
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
            this.button1 = this.addButton(6, this.playState);
            this.button1.anchor.setTo(0.5, 0.5);

            this.button2 = this.addButton(7, this.playState);
            this.button2.anchor.setTo(0.5, 0.5);

            this.button3 = this.addButton(8, this.playState);
            this.button3.anchor.setTo(0.5, 0.5);

            this.button4 = this.addButton(9, this.playState);
            this.button4.anchor.setTo(0.5, 0.5);

            this.button5 = this.addButton(10, this.playState);
            this.button5.anchor.setTo(0.5, 0.5);

            this.button6 = this.addButton(11, this.playState);
            this.button6.anchor.setTo(0.5, 0.5);

            this.button7 = this.addButton(12, this.playState);
            this.button7.anchor.setTo(0.5,0.5);

            return [this.button1, this.button2, this.button3, this.button4, this.button5, this.button6, this.button7];
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
                } else if (this.arrow.currentButton === 4){
                    this.tween(this.buttons, 5);
                }else if (this.arrow.currentButton === 5){
                    this.tween(this.buttons, 6);
                }else if(this.arrow.currentButton === 6){
                    this.tween(this.buttons, 7);
                } else{
                    this.tween(this.buttons, 1);
                }
            }

            if (this.cursors.up.isDown && this.arrow.canMove) {
                this.arrow.canMove = false;
                this.allowMovement();
                if (this.arrow.currentButton === 1) {
                    this.tween(this.buttons, 7);
                } else if (this.arrow.currentButton === 7) {
                    this.tween(this.buttons, 6);
                } else if (this.arrow.currentButton === 6) {
                    this.tween(this.buttons, 5);
                } else if(this.arrow.currentButton === 5){
                    this.tween(this.buttons, 4);
                } else if(this.arrow.currentButton === 4){
                    this.tween(this.buttons, 3);
                } else if(this.arrow.currentButton === 3){
                    this.tween(this.buttons, 2);
                } else{
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
         if(this.arrow.currentButton === 1 && localStorage.getItem("levelPlayed") >= 6){
            game.state.start("Boot",true,false,6); 
        }else if(this.arrow.currentButton === 2 && localStorage.getItem("levelPlayed") >= 7){
            game.state.start("Boot",true,false,7); 
        }else if(this.arrow.currentButton === 3 && localStorage.getItem("levelPlayed") >= 8){
            game.state.start("Boot",true,false,8); 
        }else if(this.arrow.currentButton === 4){
            console.log('Level 4');
        }else if(this.arrow.currentButton === 5){
            console.log('Level 5');
        }else if(this.arrow.currentButton === 6){
            game.state.add('LevelMenu1', MainGame.LevelMenu1);
            game.state.start('LevelMenu1');
        }else if(this.arrow.currentButton === 7){
            game.state.add('Menu', MainGame.Menu);
            game.state.start('Menu');
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
         if(parseInt(localStorage.getItem("levelPlayed"))+1 > button || button == 11 || button == 12){
            return game.add.button(game.world.centerX,game.world.centerY + this.pos[button - 6],'menu_button' + button, func);
        }else{
           return game.add.button(game.world.centerX,game.world.centerY + this.pos[button - 6],'menu_button' + button +'_inactive', func); 
        }
    }

}

