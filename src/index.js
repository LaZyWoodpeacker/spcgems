import Phaser from "phaser";
import MainScene from './scenes'

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 750,
  height: 775,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [new MainScene()]
};

var game = new Phaser.Game(config);
