import Phaser from "phaser";
import { mock3x3, mock5x5, test, makeFild, testMoves } from './logic'

export default class MainScene extends Phaser.Scene {
    constructor() {
        super()
    }

    preload() {

    }

    create() {
        const boxWidth = 50
        const colors = [0x6666ff, 0xff0000, 0x00ff00, 0x0000ff];
        this.scoreText = this.add.text(25, 12, ['0'])

        this.s = makeFild(mock5x5, (x, y, c) => {
            let rect = this.add.rectangle(Phaser.Math.Between(-500, 500), Phaser.Math.Between(-500, 500), boxWidth - 2, boxWidth - 2, colors[c]);
            rect
                .setOrigin(0)
                .setInteractive()
                .setData("x", x)
                .setData("y", y)
                .setData("t", c)
            if (c == 0) rect.setAlpha(0)
            this.tweens.add({
                targets: rect,
                x: x * boxWidth + 25,
                y: y * boxWidth + 50,
                duration: 300,
                ease: "Sine.easeInOut",
                yoyo: false,
                loop: 0,
                onComplete: () => {
                    this.input.on('pointerover', function (pointer, obj) {
                        obj[0].setStrokeStyle(4, 0xefc53f);
                    });
                    this.input.on('pointerout', function (event, obj) {
                        obj[0].setStrokeStyle();
                    });
                    this.input.on('pointerup', function (pointer, obj) {
                        let r = obj[0]
                        console.log(testMoves(mock5x5, r.data.values.x, r.data.values.y))
                        this.scene.scoreText.setText([r.data.values.x + ' ' + r.data.values.y])

                    })
                },
            });
            return rect
        })
        // console.log(test(mock5x5))
    }
}
