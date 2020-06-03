import Phaser from "phaser";
import { makeFild, testMoves, testFild, moveGems, fallGemes } from './logic'
import { mock3x3, mock5x5 } from './moks'

const emitter = new Phaser.Events.EventEmitter()
const colors = [0x6666ff, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
let scoreMax = 10
let scoreText, score, timer
export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene')
    }

    preload() {

    }

    getScore() {
        return score
    }

    gete(x, y) {
        return this.s.find(e => e.x == x && e.y == y)
    }

    printField(mock, fn = (em) => em.t) {
        const payload = []
        for (let y = 0; y < mock.length; y++) {
            let horis = []
            for (let x = 0; x < mock[0].length; x++) {
                let em = this.gete(x, y)
                horis.push(fn(em))
            }
            payload.push(horis)
        }
        console.log(payload)
        return payload
    }

    redraw() {
        timer.paused = true
        let s = this
        let hatMove = true
        const boxWidth = 50
        while (hatMove) {
            let ems = fallGemes(mock5x5)
            let tweens = []
            if (ems.hatMove) {
                for (let x = 0; x < mock5x5[0].length; x++) {
                    for (let y = mock5x5.length - 1; y > -1; y--) {
                        if (ems.hat[x].length > 0) {
                            let gem = ems.hat[x].pop()
                            moveGems(mock5x5, [gem.x, gem.y], [x, y], (mock5x5, objFrom, objTo) => {
                                let from = s.gete(objFrom[0], objFrom[1])
                                let to = s.gete(objTo[0], objTo[1])
                                tweens.push({
                                    targets: from.o,
                                    x: x * boxWidth + 25,
                                    y: y * boxWidth + 50,
                                    alpha: 1,
                                    offset: 0
                                })
                                from.x = objTo[0]
                                from.y = objTo[1]
                                from.o.setData('x', objTo[0])
                                from.o.setData('y', objTo[1])
                                from.o.setData('t', mock5x5[objTo[1]][objTo[0]])
                                to.x = objFrom[0]
                                to.y = objFrom[1]
                                to.o.setData('x', objFrom[0])
                                to.o.setData('y', objFrom[1])
                                to.o.setData('t', mock5x5[objFrom[1]][objFrom[0]])
                            })
                        } else {
                            let from = s.gete(x, y)
                            from.o.x = x * boxWidth + 25
                            from.o.y = -100
                            let t = Phaser.Math.Between(1, 4)
                            from.o.setFillStyle(colors[t], 1)
                            from.t = t
                            mock5x5[y][x] = t
                            tweens.push({
                                targets: from.o,
                                alpha: 1,
                                x: x * boxWidth + 25,
                                y: y * boxWidth + 50,
                                offset: 10
                            })
                        }
                    }
                }
                s.tweens.timeline({
                    ease: "Sine.easeInOut",
                    yoyo: false,
                    loop: 0,
                    duration: 300,
                    tweens,
                    onComplete: () => {
                        emitter.emit('checkfild');
                        timer.paused = false
                    }
                })
            }
            else {
                if (score > scoreMax) {
                    emitter.emit('endgame')
                }
                hatMove = false
            }
        }
    }

    check() {
        timer.paused = true
        const s = this
        let tweens = []
        let hat = testFild(mock5x5)
        hat.forEach((gems, idx) => {
            if (gems.t == 1) score += gems.pload.length
            gems.pload.forEach(em => {
                tweens.push({
                    targets: s.gete(em[0], em[1]).o,
                    alpha: { from: 1, to: 0 },
                    offset: 100 * idx
                })
            })
        })
        if (hat) {
            s.tweens.timeline({
                ease: "Cubic.easeOut",
                yoyo: false,
                loop: 0,
                duration: 200,
                tweens,
                onComplete: () => {
                    emitter.emit('redrawfall')
                }
            })
        }
    }

    create() {
        let s = this
        s.selected = false
        const boxWidth = 50
        score = 0
        scoreText = this.add.text(25, 12, ['0'])

        emitter.on('redrawfall', this.redraw, this)
        emitter.on('checkfild', this.check, this)
        emitter.on('endgame', em => {
            this.scene.start('WonScene', score)
        }, this)

        this.input.on('pointerover', function (pointer, obj) {
            obj[0].setStrokeStyle(4, 0xefc53f);
        });
        this.input.on('pointerout', function (event, obj) {
            obj[0].setStrokeStyle();
        });
        this.input.on('gameobjectdown', function (pointer, obj) {
            let r = obj
            let g = this.scene
            if (timer.paused) return
            const drawPosable = (sel) => {
                let moves = testMoves(mock5x5, sel[0], sel[1])
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
                return moves
            }

            if (!s.selected) {
                s.selected = [r.data.values.x, r.data.values.y]
                drawPosable(s.selected, true)
            }
            else {
                g.s.forEach(e => {
                    e.o.setAlpha(1)
                })
                if (s.selected != [r.data.values.x, r.data.values.y]) {
                    let moves = drawPosable(s.selected)
                    const swap = (from, to) => {
                        moveGems(mock5x5, from, to, (mock, objFrom, objTo) => {
                            let from = g.gete(objFrom[0], objFrom[1])
                            let to = g.gete(objTo[0], objTo[1])
                            s.tweens.timeline({
                                ease: "Sine.easeInOut",
                                yoyo: false,
                                loop: 0,
                                duration: 100,
                                tweens: [
                                    {
                                        targets: from.o,
                                        x: to.o.x,
                                        y: to.o.y
                                    },
                                    {
                                        targets: to.o,
                                        x: from.o.x,
                                        y: from.o.y
                                    }
                                ],
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
                                    emitter.emit('checkfild');
                                }
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
            // scoreText.setText([(s.selected[0]) + ',' + (s.selected[1]), (r.data.values.x) + ',' + (r.data.values.y)])
        })
        this.s = makeFild(mock5x5, (x, y, c) => {
            let rect = this.add.rectangle(Phaser.Math.Between(-500, 500), Phaser.Math.Between(-500, 500), boxWidth - 2, boxWidth - 2, colors[c]);
            rect
                .setOrigin(0)
                .setInteractive()
                .setData("x", x)
                .setData("y", y)
                .setData("t", c)
            this.tweens.add({
                targets: rect,
                alpha: { from: 0, to: 1 },
                x: x * boxWidth + 25,
                y: y * boxWidth + 50,
                duration: 300,
                ease: "Sine.easeInOut",
                yoyo: false,
                loop: 0,
                onComplete: () => {
                    // rect.text = this.add.text(rect.x + 10, rect.y + 10, x + ',' + y)
                    //     .setOrigin(0)
                    timer.paused = false
                },
            });
            return rect
        })

        timer = this.time.addEvent({ delay: 1000, repeat: 50 })
        timer.paused = true
        this.time.delayedCall(3000, () => {
            emitter.emit('gameover')
            console.log(timer)
        }, [], this);
    }

    update() {

        scoreText.setText([score + ' ' + timer.paused, timer.getProgress().toString()])
    }
}
