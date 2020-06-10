import Phaser from "phaser";
// import MainScene from './scenes'
import WonScene from './wonscene'
import SpcGemsScene from './spcgems'

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 700,
  height: 750,
  backgroundColor: '#2d2d2d',
  scale: {
    // mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [SpcGemsScene, WonScene]
};

var game = new Phaser.Game(config);
