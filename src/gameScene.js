import skyImg from './assets/sky.png'
import platformImg from './assets/platform.png'
import starImg from './assets/star.png'
import bombImg from './assets/bomb.png'
import dudeImg from './assets/dude.png'

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'gameScene' })
  }

  init() {
    this.userActions = []
    this.starCount = 0
    this.starText
    this.player
  }

  preload() {
    this.load.image('sky', skyImg)
    this.load.image('ground', platformImg)
    this.load.image('star', starImg)
    this.load.image('bomb', bombImg)
    this.load.spritesheet('dude', dudeImg, {
      frameWidth: 32,
      frameHeight: 48,
    })
  }

  create() {
    // Sky
    this.add.image(400, 300, 'sky')

    // Platforms
    const platforms = this.physics.add.staticGroup()

    platforms.create(400, 568, 'ground').setScale(2).refreshBody()

    platforms.create(600, 400, 'ground')
    platforms.create(50, 250, 'ground')
    platforms.create(750, 220, 'ground')

    // Player
    this.player = this.physics.add.sprite(100, 450, 'dude')

    this.player.setBounce(0.2)
    this.player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20,
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    })

    this.physics.add.collider(this.player, platforms)

    // Stars
    const stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    })

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })

    this.physics.add.collider(stars, platforms)

    function collectStar(player, star) {
      star.disableBody(true, true)
      this.starCount++
      this.starText.setText('Stars: ' + this.starCount)
    }

    this.physics.add.overlap(this.player, stars, collectStar, null, this)

    // Star Text
    this.starText = this.add.text(100, 16, 'Stars: ' + this.starCount, {
      fontSize: '32px',
      fill: '#000',
    })
  }

  update() {
    // User input
    const cursors = this.input.keyboard.createCursorKeys()
    if (cursors.left.isDown) {
      this.player.setVelocityX(-160)

      this.player.anims.play('left', true)
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160)

      this.player.anims.play('right', true)
    } else {
      this.player.setVelocityX(0)

      this.player.anims.play('turn')
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330)
    }

    // End
    if (12 == this.starCount) {
      this.scene.restart()
    }
  }

  end() {}
}

export default GameScene
