import Phaser from "phaser";
import { mock3x3, mock5x5, test, makeFild, testMoves, testFild, moveGems, scoreFild, fallGemes } from './logic'

export default class MainScene extends Phaser.Scene {
    constructor() {
        super()
    }

    preload() {

    }


    gete(x, y) {
        return this.s.find(e => e.x == x && e.y == y)
    }

    create() {
        let s = this
        s.selected = false
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
            const drawPosable = (sel, redraw = false) => {
                let moves = testMoves(mock5x5, sel[0], sel[1])
                if (redraw) {
                    if (!Object.values(moves.moves).every(e => e == false)) {
                        if (moves.moves.right) {
                            g.gete(sel[0] + 1, sel[1]).o.setAlpha(0.5)
                        }
                        if (moves.moves.left) {
                            g.gete(sel[0] - 1, sel[1]).o.setAlpha(0.5)
                        }
                        if (moves.moves.up) {
                            g.gete(sel[0], sel[1] - 1).o.setAlpha(0.5)
                        }
                        if (moves.moves.down) {
                            g.gete(sel[0], sel[1] + 1).o.setAlpha(0.5)
                        }
                    }
                }
                return moves
            }

            if (!s.selected) {
                s.selected = [r.data.values.x, r.data.values.y]
                drawPosable(s.selected, true)
            }
            else {
                g.s.forEach(e => {
                    if (e.t != 0) {
                        e.o.setAlpha(1)
                    }
                    else {
                        e.o.setAlpha(0)
                    }
                })
                if (s.selected != [r.data.values.x, r.data.values.y]) {
                    let moves = drawPosable(s.selected)
                    const swap = (from, to) => {
                        moveGems(mock5x5, from, to, (mock, objFrom, objTo) => {
                            let from = g.gete(objFrom[0], objFrom[1])
                            let to = g.gete(objTo[0], objTo[1])
                            const destroyRect = (rect) => {
                                rect.o.setAlpha(0.1)
                            }
                            s.tweens.timeline({
                                ease: "Sine.easeInOut",
                                yoyo: false,
                                loop: 0,
                                duration: 100,
                                onComplete: () => {
                                    from.x = objTo[0]
                                    from.y = objTo[1]
                                    from.o.setData('x', objTo[0])
                                    from.o.setData('y', objTo[1])
                                    from.o.setData('t', mock[objTo[1]][objTo[0]])
                                    to.x = objFrom[0]
                                    to.y = objFrom[1]
                                    to.o.setData('x', objFrom[0])
                                    to.o.setData('y', objFrom[1])
                                    to.o.setData('t', mock[objFrom[1]][objFrom[0]])

                                    testFild(mock5x5, em => {
                                        if (em.t != 0) {
                                            if (em.n) {
                                                for (let y = em.y - em.count; y < em.y; y++) {
                                                    let rect = s.gete(em.x, y)
                                                    mock5x5[y][em.x] = 0
                                                    destroyRect(rect)
                                                }
                                            }
                                            else {
                                                for (let x = em.x - em.count; x < em.x; x++) {
                                                    let rect = s.gete(x, em.y)
                                                    mock5x5[em.y][x] = 0
                                                    destroyRect(rect)
                                                }
                                            }
                                        }
                                    })
                                    let ems = fallGemes(mock5x5)
                                    for (let x = 0; x < mock5x5[0].length; x++) {
                                        for (let y = mock5x5.length - 1; y > ems.hat[x].length; y--) {
                                            if (ems.hat[x].length > 0) {
                                                let gem = ems.hat[x].pop()
                                                moveGems(mock5x5, [gem.x, gem.y], [x, y], (mock, objFrom, objTo) => {
                                                    let from = g.gete(objFrom[0], objFrom[1])
                                                    let to = g.gete(objTo[0], objTo[1])
                                                    s.tweens.timeline({
                                                        ease: "Sine.easeInOut",
                                                        yoyo: false,
                                                        loop: 0,
                                                        duration: 200,
                                                        tweens: [
                                                            {
                                                                targets: from.o,
                                                                x: to.o.x,
                                                                y: to.o.y
                                                            }, {
                                                                targets: to.o,
                                                                x: from.o.x,
                                                                y: from.o.y
                                                            }],
                                                        onComplete: () => {
                                                            from.x = objTo[0]
                                                            from.y = objTo[1]
                                                            from.o.setData('x', objTo[0])
                                                            from.o.setData('y', objTo[1])
                                                            from.o.setData('t', mock[objTo[1]][objTo[0]])
                                                            to.x = objFrom[0]
                                                            to.y = objFrom[1]
                                                            to.o.setData('x', objFrom[0])
                                                            to.o.setData('y', objFrom[1])
                                                            to.o.setData('t', mock[objFrom[1]][objFrom[0]])
                                                        }
                                                    })
                                                })
                                            }
                                        }
                                    }
                                    console.log(mock5x5)
                                },
                                tweens: [
                                    {
                                        targets: from.o,
                                        x: to.o.x,
                                        y: to.o.y
                                    }, {
                                        targets: to.o,
                                        x: from.o.x,
                                        y: from.o.y
                                    }]
                            });
                        })
                    }
                    if (moves.moves.right) {
                        if (s.selected[0] + 1 == r.data.values.x && s.selected[1] == r.data.values.y) swap(s.selected, [r.data.values.x, r.data.values.y])
                    }
                    if (moves.moves.left) {
                        if (s.selected[0] - 1 == r.data.values.x && s.selected[1] == r.data.values.y) swap(s.selected, [r.data.values.x, r.data.values.y])
                    }
                    if (moves.moves.up) {
                        if (s.selected[0] == r.data.values.x && s.selected[1] - 1 == r.data.values.y) swap(s.selected, [r.data.values.x, r.data.values.y])
                    }
                    if (moves.moves.down) {
                        if (s.selected[0] == r.data.values.x && s.selected[1] + 1 == r.data.values.y) swap(s.selected, [r.data.values.x, r.data.values.y])
                    }
                    s.selected = false
                }
            }
            g.scoreText.setText([(s.selected[0]) + ',' + (s.selected[1]), (r.data.values.x) + ',' + (r.data.values.y)])
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
                    rect.text = this.add.text(rect.x + 10, rect.y + 10, x + ',' + y)
                        .setOrigin(0)
                },
            });
            return rect
        })
    }
}
