import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import { Gems, mock3x3 } from './logic'

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};

var game = new Phaser.Game(config);
var s;

function preload() {
  this.load.image("logo", logoImg);
}

function create() {
  const logo = this.add.image(400, 150, "logo");
  const boxWidth = 100

  // this.tweens.add({
  //   targets: logo,
  //   y: 450,
  //   duration: 2000,
  //   ease: "Power2",
  //   yoyo: true,
  //   loop: -1
  // });
  const colors = [0x6666ff, 0xff0000, 0x00ff00, 0x0000ff];
  s = new Gems(mock3x3, (x, y, c) => {
    let rect = this.add.rectangle(x * boxWidth, y * boxWidth, boxWidth - 2, boxWidth - 2, colors[c]);
    rect.setOrigin(0)
  })
}
