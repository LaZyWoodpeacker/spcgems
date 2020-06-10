import Phaser from "phaser";
import { mock3x3, mock5x5 } from './moks'
import { makeFild, testMoves, testFild, moveGems, fallGemes } from './logic'

export const conf = {
    emitter: new Phaser.Events.EventEmitter(),
    colors: [0x6666ff, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00],
    scoreMax: 90,
    gameTime: 60 * 2,
    timerText: '',
    scoreText: 0,
    score: 0,
    timer: null,
    mock: null,
    scene: null,
    max: 5,
    counted: [1, 2]
}

export class Gem extends Phaser.GameObjects.Container {
    constructor(scene, x = 0, y = 0) {
        super(scene, x, y)
        this.rect = scene.add.rectangle(0, 0, 100, 100)
            .setOrigin(0)
            .setStrokeStyle(0, 0x1a65ac)
        this.sprite = scene.add.sprite(0, 0, 'gems')
            .setOrigin(0)
        this.add([this.rect, this.sprite])
            .setInteractive(this.rect, Phaser.Geom.Rectangle.Contains)
        this.on('pointerover', function () {
            this.setTint(0x44ff44);
        });
        this.on('pointerout', function () {
            this.clearTint();
        });
        scene.add.existing(this)
    }

    setTint(number) {
        this.sprite.setTint(number)
        this.rect.setStrokeStyle(4, number)
        return this
    }

    clearTint() {
        this.sprite.clearTint()
        this.rect.setStrokeStyle(0, 0x1a65ac)
        return this
    }

    setSpr(num) {
        this.sprite.setFrame(num)
        return this
    }
}

export default class SpcGemsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SpcGemsScene', active: true })
    }

    preload() {
        this.load.spritesheet('gems', 'assets/sprites.png', { frameWidth: 100, frameHeight: 100 });
    }

    getMinutes() {
        let secondsall = conf.timer.repeatCount
        var minutes = Math.floor(secondsall / 60);
        var seconds = secondsall - minutes * 60;
        return (secondsall > 59) ? `${minutes}:${seconds}` : seconds
    }

    getScore() {
        return conf.score
    }

    gete(x, y) {
        return this.s.find(e => e.x == x && e.y == y)
    }

    redraw() {
        conf.timer.paused = true
        let s = this
        let hatMove = true
        const boxWidth = 50
        while (hatMove) {
            let ems = fallGemes(conf.mock)
            let tweens = []
            if (ems.hatMove) {
                for (let x = 0; x < conf.mock[0].length; x++) {
                    for (let y = conf.mock.length - 1; y > -1; y--) {
                        if (ems.hat[x].length > 0) {
                            let gem = ems.hat[x].pop()
                            moveGems(conf.mock, [gem.x, gem.y], [x, y], (mock, objFrom, objTo) => {
                                let from = s.gete(objFrom[0], objFrom[1])
                                let to = s.gete(objTo[0], objTo[1])
                                tweens.push({
                                    targets: from.o,
                                    x: x * 100,
                                    y: y * 100 + 50,
                                    alpha: 1,
                                    offset: 0
                                })
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
                            })
                        } else {
                            let from = s.gete(x, y)
                            from.o.x = x * 100
                            from.o.y = -100
                            let t = Phaser.Math.Between(1, conf.max)
                            // from.o.setFillStyle(colors[t], 1)
                            from.o.setSpr(t)
                            from.t = t
                            conf.mock[y][x] = t
                            tweens.push({
                                targets: from.o,
                                alpha: 1,
                                x: x * 100,
                                y: y * 100 + 50,
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
                        conf.emitter.emit('checkfild');
                        conf.timer.paused = false
                    }
                })
            }
            else {
                if (conf.score >= conf.scoreMax) {
                    conf.emitter.emit('endgame')
                }
                hatMove = false
            }
        }
    }

    check() {
        conf.timer.paused = true
        const s = this
        let tweens = []
        let hat = testFild(conf.mock)
        hat.forEach((gems, idx) => {
            if (conf.counted.includes(gems.t)) conf.score += gems.pload.length
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
                    conf.emitter.emit('redrawfall')
                }
            })
        }
    }

    wonScene() {
        this.cameras.main.fadeOut(2000, 0, 0, 0);
        this.scene.launch('WonScene', conf.score)
    }

    create() {
        let s = this
        s.selected = false

        conf.scene = this
        conf.scoreText = this.add.text(25, 12, ['0'])
        conf.mock = mock5x5
        conf.emitter.on('redrawfall', this.redraw, this)
        conf.emitter.on('checkfild', this.check, this)
        conf.emitter.once('endgame', this.wonScene, this)
        conf.score = 0

        this.input.on('gameobjectdown', function (pointer, obj) {
            let r = obj
            let g = this.scene
            if (conf.timer.paused) return
            const drawPosable = (sel) => {
                let moves = testMoves(conf.mock, sel[0], sel[1])
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
                        moveGems(conf.mock, from, to, (mock, objFrom, objTo) => {
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
                                    conf.emitter.emit('checkfild');
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
        })

        this.s = makeFild(conf.mock, (x, y, c) => {
            let conte = new Gem(this, Phaser.Math.Between(-500, 500), Phaser.Math.Between(-500, 500))
                .setSpr(c)
                .setData("x", x)
                .setData("y", y)
                .setData("t", c)
            this.tweens.add({
                targets: conte,
                alpha: { from: 0, to: 1 },
                x: x * 100,
                y: y * 100 + 50,
                duration: 300,
                ease: "Sine.easeInOut",
                yoyo: false,
                loop: 0,
                onComplete: () => {
                    // conte.text = this.add.text(conte.x + 10, conte.y + 10, x + ',' + y)
                    //     .setOrigin(0)
                    conf.timer.paused = false
                }
            })
            return conte
        })

        conf.timer = this.time.addEvent({
            delay: 1000, repeat: conf.gameTime, callback: () => {
                conf.timerText = this.getMinutes()
                if (conf.timer.repeatCount == 0) {
                    conf.emitter.emit('endgame')
                }
            }
        })
        conf.timerText = this.getMinutes()
        conf.timer.paused = true
    }

    update() {
        conf.scoreText.setText([conf.score, conf.timerText])
    }
}