import Phaser from "phaser";
import { Gems, mock3x3, mock5x5 } from './logic'

export default class MainScene extends Phaser.Scene {
    constructor() {
        super()
    }

    preload() {
    }

    create() {
        const boxWidth = 100
        const colors = [0x6666ff, 0xff0000, 0x00ff00, 0x0000ff];

        this.scoreText = this.add.text(5, 5, ['0'])
        this.s = new Gems(mock3x3, (x, y, c) => {
            let rect = this.add.rectangle(Phaser.Math.Between(-300, 300), Phaser.Math.Between(-300, 300), boxWidth - 2, boxWidth - 2, colors[c]);
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
                        this.scene.s.list.forEach(e => {
                            if (e !== r) {
                                e.o.setData('clicked', false)
                                e.o.setAlpha(1)
                            }
                        })
                        this.scene.s.CheckCur(r).forEach(e => {
                            e.o.setAlpha(.3)
                        })
                        if (r.getData('clicked')) {
                            r
                                .setData('clicked', false)
                                .setAlpha(1)
                        }
                        else {
                            r
                                .setData('clicked', true)
                                .setAlpha(.5)
                        }
                    })
                },
            });
            return rect
        })
    }
}
