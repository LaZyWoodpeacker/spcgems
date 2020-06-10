import Phaser from "phaser";

let banner
let scene
let text, score, bg, button, buttonText
export default class WonScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WonScene', active: false })
    }

    preload() {

    }
    create() {
        scene = this
        score = this.scene.get('SpcGemsScene').getScore;

        bg = this.add.rectangle(0, 0, 200, 200, 0x6666ff)
            .setStrokeStyle(2, 0x1a65ac)
            .setOrigin(.5)
        button = this.add.rectangle(0, 0, 100, 50, 0x66aaff)
            .setStrokeStyle(2, 0x1a65ac)
            .setOrigin(.5)
        text = this.add.text(0, 0, '', { fontFamily: 'Arial', color: '#ffffff', align: 'center', lineSpacing: 10 });
        buttonText = this.add.text(0, 0, 'Еще раз', { fontFamily: 'Arial', color: '#ffffff', align: 'center', lineSpacing: 10 });
        text.fontSize = 10;
        text.strokeThickness = 2;
        text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

        banner = this.add.container(0, 0, [bg, text, button, buttonText])
        banner.x = this.game.config.width / 2
        banner.y = this.game.config.height / 2

        Phaser.Display.Align.In.BottomCenter(button, bg, 0, -10)
        Phaser.Display.Align.In.Center(buttonText, button)
        this.input.once('pointerup', function () {
            scene.scene.start('SpcGemsScene')
        })
        this.add.tween({
            targets: banner,
            duration: 1000,
            ease: 'Power4',
            alpha: { from: .4, to: 1 },
            scale: { from: 0, to: 1 }
        })
    }

    update(time, delta) {
        text.setText(['Вы победили', score()])
        Phaser.Display.Align.In.Center(text, bg)
    }
}