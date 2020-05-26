import Phaser from "phaser";
import { mock3x3, mock5x5, test, makeFild, testMoves } from './logic'

export default class MainScene extends Phaser.Scene {
    constructor() {
        super()
    }

    preload() {

    }

    getem(x, y) {
        return this.s.find(e => e.x == x && e.y == y).o
    }

    create() {
        let s = this
        const boxWidth = 50
        const colors = [0x6666ff, 0xff0000, 0x00ff00, 0x0000ff];
        this.scoreText = this.add.text(25, 12, ['0'])

        this.input.on('pointerover', function (pointer, obj) {
            obj[0].setStrokeStyle(4, 0xefc53f);
        });
        this.input.on('pointerout', function (event, obj) {
            obj[0].setStrokeStyle();
        });
        this.input.on('gameobjectdown', function (pointer, obj) {
            let r = obj
            let g = this.scene
            let moves = testMoves(mock5x5, r.data.values.x, r.data.values.y)
            g.s.forEach(e => {
                e.o.setAlpha(1)
            })
            for (let move = 0; move < moves.gems.length; move++) {
                g.getem(moves.gems[move][0], moves.gems[move][1]).setAlpha(0.3)
            }
            if (moves.moves.right) {
                g.getem(r.data.values.x + 1, r.data.values.y).setAlpha(0.8)
            }
            if (moves.moves.left) {
                g.getem(r.data.values.x - 1, r.data.values.y).setAlpha(0.8)
            }
            if (moves.moves.up) {
                g.getem(r.data.values.x, (r.data.values.y - 1)).setAlpha(0.8)
            }
            if (moves.moves.down) {
                g.getem(r.data.values.x, (r.data.values.y + 1)).setAlpha(0.8)
            }
            g.scoreText.setText([r.data.values.x + ' ' + r.data.values.y])
        })
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
                },
            });
            return rect
        })
        // console.log(test(mock5x5))
    }
}
