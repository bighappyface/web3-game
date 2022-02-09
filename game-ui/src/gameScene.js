import skyImg from './assets/sky.png'
import platformImg from './assets/platform.png'
import starImg from './assets/star.png'
import bombImg from './assets/bomb.png'
import dudeImg from './assets/dude.png'
import axios from 'axios'

const eventsCenter = new Phaser.Events.EventEmitter()
const backendURI = 'http://127.0.0.1:6868/api/players/'

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'gameScene' })
  }

  init(data) {
    this.userActions = []
    this.platforms
    this.starCount = 0
    this.starCountLevel = 0
    this.starText
    this.player
    this.account = data.account
    this.playerUrl = backendURI + this.account
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
    this.platforms = this.physics.add.staticGroup()

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody()

    this.platforms.create(600, 400, 'ground')
    this.platforms.create(50, 250, 'ground')
    this.platforms.create(750, 220, 'ground')

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

    this.physics.add.collider(this.player, this.platforms)

    this.generateStars()

    // Star Text
    this.starText = this.add.text(100, 16, 'stars: ' + this.starCount, {
      fontSize: '32px',
      fill: '#000',
    })

    // Account Text
    this.add.text(100, 550, 'account: ' + this.account, {
      fontSize: '16px',
      fill: '#fff',
    })

    // Load Player Stars
    eventsCenter.on('loadStars', this.updateStarCount, this)

    axios.get(this.playerUrl).then((response) => {
      eventsCenter.emit('loadStars', response.data.stars)
    })

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventsCenter.off('loadStars', this.updateStarCount, this)
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
    if (this.starCountLevel == 12) {
      this.starCountLevel = 0
      this.generateStars()
    }
  }

  end() {}

  updateStarCount(total) {
    this.starCount = total
    this.starText.setText('stars: ' + this.starCount)
  }

  generateStars() {
    // Stars
    const stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    })

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })

    this.physics.add.collider(stars, this.platforms)

    function collectStar(player, star) {
      star.disableBody(true, true)
      this.starCount++
      this.starCountLevel++
      this.starText.setText('stars: ' + this.starCount)
      axios.put(this.playerUrl, { address: this.account })
    }

    this.physics.add.overlap(this.player, stars, collectStar, null, this)
  }
}

export default GameScene
