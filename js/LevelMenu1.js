var MainGame = MainGame || {};

MainGame.LevelMenu1 = function(){};

MainGame.LevelMenu1.prototype = {


    

    preload: function() {
            game.load.image('menu_title', 'assets/Menu.png');
            game.load.image('menu_arrow', 'assets/Menu/Arrow.png');
            game.load.image('menu_button1', 'assets/LevelMenu/Level1.png');
            game.load.image('menu_button2', 'assets/LevelMenu/Level2.png');
            game.load.image('menu_button3', 'assets/LevelMenu/Level3.png');
            game.load.image('menu_button4', 'assets/LevelMenu/Level4.png');
            game.load.image('menu_button5', 'assets/LevelMenu/Level5.png');
            game.load.image('menu_button6', 'assets/LevelMenu/Next.png');
            game.load.image('menu_button1_inactive', 'assets/LevelMenu/inactive/Level1.png');
            game.load.image('menu_button2_inactive', 'assets/LevelMenu/inactive/Level2.png');
            game.load.image('menu_button3_inactive', 'assets/LevelMenu/inactive/Level3.png');
            game.load.image('menu_button4_inactive', 'assets/LevelMenu/inactive/Level4.png');
            game.load.image('menu_button5_inactive', 'assets/LevelMenu/inactive/Level5.png');
            game.load.image('menu_button6_inactive', 'assets/LevelMenu/inactive/Next.png');
            game.load.image('menu_button7', 'assets/LevelMenu/Hauptmenu.png');
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
            this.button1 = this.addButton(1, this.playState);
            this.button1.anchor.setTo(0.5, 0.5);

            this.button2 = this.addButton(2, this.playState);
            this.button2.anchor.setTo(0.5, 0.5);

            this.button3 = this.addButton(3, this.playState);
            this.button3.anchor.setTo(0.5, 0.5);

            this.button4 = this.addButton(4, this.playState);
            this.button4.anchor.setTo(0.5, 0.5);

            this.button5 = this.addButton(5, this.playState);
            this.button5.anchor.setTo(0.5, 0.5);

            this.button6 = this.addButton(6, this.playState);
            this.button6.anchor.setTo(0.5, 0.5);

            this.button7 = this.addButton(7, this.playState);
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
         if(this.arrow.currentButton === 1){
            game.state.start("Boot",true,false,1);
        }else if(this.arrow.currentButton === 2 && localStorage.getItem("levelPlayed") >= 1){
            game.state.start("Boot",true,false,2);        
        }else if(this.arrow.currentButton === 3 && localStorage.getItem("levelPlayed") >= 2){
            game.state.start("Boot",true,false,3);
        }else if(this.arrow.currentButton === 4 && localStorage.getItem("levelPlayed") >= 3){
            game.state.start("Boot",true,false,4);
        }else if(this.arrow.currentButton === 5 && localStorage.getItem("levelPlayed") >= 4){
            game.state.start("Boot",true,false,5);
        }else if(this.arrow.currentButton === 6 && localStorage.getItem("levelPlayed") >= 5){
            game.state.add('LevelMenu2', MainGame.LevelMenu2);
            game.state.start('LevelMenu2');
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
        if(parseInt(localStorage.getItem("levelPlayed"))+1 > button || button == 1 || button == 7){
            return game.add.button(game.world.centerX,game.world.centerY + this.pos[button - 1],'menu_button' + button, func);
        }else{
           return game.add.button(game.world.centerX,game.world.centerY + this.pos[button - 1],'menu_button' + button +'_inactive', func); 
        }
    },

}

