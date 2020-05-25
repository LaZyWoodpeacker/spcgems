import Phaser from "phaser";
import MainScene from './scenes'

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 400,
  height: 425,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [new MainScene()]
};

var game = new Phaser.Game(config);
