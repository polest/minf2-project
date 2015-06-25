var MainGame = MainGame || {};

game = new Phaser.Game(1024, 640, Phaser.AUTO, 'gameDiv');
game.state.add('Boot', MainGame.Boot);

game.state.add('Preload', MainGame.Preload);
game.state.add('Game', MainGame.Game);
game.state.add('Menu', MainGame.Menu);
game.state.add('LevelMenu1', MainGame.LevelMenu1);
game.state.add('Pause', MainGame.Pause);
game.state.add('Levelwechsel', MainGame.Levelwechsel);

//game.state.start("Boot",true,false, 1);
//game.state.start('Boot');

game.state.start('Menu');