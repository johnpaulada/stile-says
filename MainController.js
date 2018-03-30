// TODO: FAKING REFACTOR THIS SHIT

import { Controller } from "stimulus"
const Chance = require('chance')

const MODE_CPU = 'CPU'
const MODE_PLAYER = 'PLAYER'
const CHAR_LIST = ['mafuyu', 'miu', 'kaho', 'maika']

const chance = new Chance()

const deepArrayEquals = (array1, array2) => {
  return array1.length === array2.length
    && array1.every((item1, index) => item1 === array2[index])
}

export default class extends Controller {
  static targets = [ "button", "trigger" ]
  
  startGame() {
    this.triggerTarget.innerHTML = "Restart"
    this.sequence = this.sequence || [chance.integer({min: 0, max: 3})]
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

        // Fade out previous target
        const previousTarget = this.buttonTargets[this.previousTarget]
        previousTarget.classList.remove('current')

        this.currentIndex = 0
        this.mode = MODE_PLAYER
        this.answers = []
      }, 1000)
    }
  }

  lightUp(index) {

    // Fade out previous target
    const previousTarget = this.buttonTargets[this.previousTarget]
    previousTarget.classList.remove('current')

    const target = this.buttonTargets[index]
    target.classList.add('current')

    this.previousTarget = this.currentTarget
    this.currentIndex++

    this.lightEmUp()
  }

  select(evt) {
    if (this.mode === MODE_PLAYER) {
      this.answers = this.answers + CHAR_LIST.findIndex(c => evt.target.id === c)
      if (this.answers === this.sequence) {
        if (this.sequence.length === this.wincount) {
          alert('yey you won!')
        } else {
          this.sequence = this.sequence + chance.integer({min: 0, max: 3})
          this.currentIndex = 0
          this.currentTarget = this.sequence[this.currentIndex]
          this.previousTarget = this.currentTarget
          this.lightEmUp()
        }
      } else if (this.sequence.length === this.answers.length) {
        if (this.strictmode) {
          alert('hahaha you suck')
        } else {
          alert('please try again')
          this.startGame(this.sequence)
        }
      }
    }
  }

  get sequence() {
    return this.data.get('sequence')
  }

  set sequence(s) {
    this.data.set('sequence', s)

    return this
  }

  get mode() {
    return this.data.get('mode')
  }

  set mode(m) {
    this.data.set('mode', m)

    return this
  }

  get answers() {
    return this.data.get('answers')
  }

  set answers(a) {
    this.data.set('answers', a)

    return this
  }

  get wincount() {
    return parseInt(this.data.get('wincount'))
  }

  get strictmode() {
    return this.data.get('strictmode') === "true"
  }

  set strictmode(b) {
    this.data.set('strictmode', b ? "true" : "false")
  }
}