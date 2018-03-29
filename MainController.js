import { Controller } from "stimulus"
const Chance = require('chance')

const MODE_CPU = 'CPU'
const MODE_PLAYER = 'PLAYER'

const chance = new Chance()

export default class extends Controller {
  static targets = [ "button" ]

  intialize() {

  }
  
  startGame() {
    this.sequence = [chance.integer({min: 0, max: 3})]
    this.currentIndex = 0
    this.currentTarget = this.sequence[this.currentIndex]
    this.previousTarget = this.currentTarget
    this.lightEmUp()
  }

  lightEmUp() {
    if (this.currentIndex < this.sequence.length) {
      this.currentTarget = this.sequence[this.currentIndex]
      setTimeout(() => {
        this.lightUp(this.currentTarget)
      }, 1000)
    } else {
      setTimeout(() => {
        const previousTarget = this.buttonTargets[this.previousTarget]
        previousTarget.classList.remove('current')
        this.currentIndex = 0
        this.data.set('mode', MODE_PLAYER)
      }, 1000)
    }
  }

  lightUp(index) {
    const previousTarget = this.buttonTargets[this.previousTarget]
    previousTarget.classList.remove('current')
    const target = this.buttonTargets[index]
    target.classList.add('current')
    this.previousTarget = this.currentTarget
    this.currentIndex++
    this.lightEmUp()
  }

  select() {

  }

  get sequence() {
    return this.data.get('sequence')
  }

  set sequence(s) {
    this.data.set('sequence', s)

    return this
  }
}