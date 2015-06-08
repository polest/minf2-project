var MainGame = MainGame || {};

game = new Phaser.Game(1024, 640, Phaser.AUTO, 'gameDiv');

game.state.add('Boot', MainGame.Boot);
game.state.add('Preload', MainGame.Preload);
game.state.add('Game', MainGame.Game);

game.state.start("Boot",true,false,"Level1_enemy.json");
//game.state.start('Boot');