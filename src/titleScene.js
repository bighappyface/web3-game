import skyImg from './assets/sky.png'
import { ethers } from 'ethers'

class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'titleScene' })
  }

  init() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum)
    this.account
    this.text
  }

  preload() {
    this.load.image('sky', skyImg)
  }

  create() {
    // Sky
    this.add.image(400, 300, 'sky')

    // Text
    this.text = this.add.text(200, 300, 'connect wallet', {
      fontSize: '32px',
      fill: '#000',
    })
    this.text.setInteractive({ useHandCursor: true })
    this.text.on('pointerdown', () => this.connectWallet())
  }

  update() {}

  end() {}

  connectWallet() {
    this.provider.send("eth_requestAccounts", []).then((a) => {
      this.account = a[0]
      this.add.text(200, 350, 'wallet: ' + this.account, {
        fontSize: '16px',
        fill: '#000',
      })
      this.text.on('pointerdown', () => this.scene.switch('gameScene'))
      this.text.setText('start game')
    });

  }
}

export default TitleScene
