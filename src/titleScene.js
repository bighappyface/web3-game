import skyImg from './assets/sky.png'

class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'titleScene' })
  }

  init() {}

  preload() {
    this.load.image('sky', skyImg)
  }

  create() {
    // Sky
    this.add.image(400, 300, 'sky')

    // Text
    const text = this.add.text(200, 300, 'web3 game - click to start', {
      fontSize: '32px',
      fill: '#000',
    })
    text.setInteractive({ useHandCursor: true })
    text.on('pointerdown', () => this.clickButton())
  }

  update() {}

  end() {}

  clickButton() {
    this.scene.switch('gameScene')
  }
}

export default TitleScene
