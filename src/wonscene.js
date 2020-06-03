import Phaser from "phaser";

let banner
export default class WonScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WonScene', active: false })
    }

    preload() {

    }
    create() {
        let score = this.scene.get('MainScene').getScore();

        let bg = this.add.rectangle(0, 0, 200, 200, 0x6666ff)
            .setStrokeStyle(2, 0x1a65ac)
            .setOrigin(0)
        let text = this.add.text(10, 50, ['Вы победили', score], { font: '21px Courier', fill: '#000000' });

        banner = this.add.container(0, 0, [bg, text])
            .setSize(200, 200);
        this.input.on('pointerup', function () {
            Phaser.Display.Align.In.Center(text, bg)
        })
    }

    update(time, delta) {

    }
}