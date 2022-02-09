import Phaser from 'phaser'
import GameScene from './gameScene'
import TitleScene from './titleScene'

const gameScene = new GameScene()
const titleScene = new TitleScene()

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
}

const game = new Phaser.Game(config)

game.scene.add('titleScene', titleScene)
game.scene.add('gameScene', gameScene)

game.scene.start('titleScene')
