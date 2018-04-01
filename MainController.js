import { Controller } from "stimulus"
const Chance = require('chance')

const MODE_CPU = 'CPU'
const MODE_PLAYER = 'PLAYER'
const CHAR_LIST = ['mafuyu', 'miu', 'kaho', 'maika']

const chance = new Chance()

const generateNext = sequence => {
  const randomIndex = chance.integer({min: 0, max: 3})

  if (parseInt(sequence.charAt(sequence.length - 1)) === randomIndex) {
    return generateNext(sequence)
  } else {
    return randomIndex
  }
}

const hoverer = shouldHover => {
  const buttons = [...document.querySelectorAll('.simon-button')]
  const method = shouldHover ? 'add' : 'remove'
  buttons.forEach(button => button.classList[method]('hoverable'))
}

const playSound = index =>
  [...document.querySelectorAll('audio')][index].play()

export default class extends Controller {
  static targets = [ "button", "trigger" ]
  
  startGame() {
    this.triggerTarget.innerHTML = "Restart"
    this.sequence = [chance.integer({min: 0, max: 3})]
    this.streak = 0
    this.reset()
  }

  reset() {
    this.currentIndex = 0
    this.currentTarget = this.sequence[this.currentIndex]
    this.previousTarget = this.currentTarget
    hoverer(false)
    this.lightEmUp()
  }

  lightEmUp() {
    const notDonePressing = this.currentIndex < this.sequence.length

    if (notDonePressing) {
      this.continuePlaying()
    } else {
      this.playerTurn()
    }
  }

  continuePlaying() {
    this.currentTarget = this.sequence[this.currentIndex]

    setTimeout(() => {
      playSound(this.currentTarget)
      this.lightUp(this.currentTarget)
    }, 1000)
  }

  playerTurn() {
    setTimeout(() => {
      // Fade out previous target
      const previousTarget = this.buttonTargets[this.previousTarget]
      previousTarget.classList.remove('current')

      this.currentIndex = 0
      this.mode = MODE_PLAYER
      this.answers = []
      hoverer(true)
    }, 1000)
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
    const PLAYERS_TURN = this.mode === MODE_PLAYER
    
    if (PLAYERS_TURN) {
      const buttonIndex = CHAR_LIST.findIndex(c => evt.target.id === c)
      this.answers = this.answers + buttonIndex
      playSound(buttonIndex)

      const PERFECT_BUTTON_PRESSES = this.answers === this.sequence

      if (PERFECT_BUTTON_PRESSES) {
        this.correctButtonPresses()
      } else {
        const LATEST_PRESS_STILL_CORRECT = this.answers.charAt(this.answers.length - 1) === this.sequence.charAt(this.answers.length - 1)
        const INCORRECT_PRESS_COMBINATION = !LATEST_PRESS_STILL_CORRECT

        if (INCORRECT_PRESS_COMBINATION) {
          this.incorrectButtonPresses()
        }
      }
    }
  }

  correctButtonPresses() {
    const HAS_REACHED_WIN_COUNT = this.sequence.length === this.wincount

    if (HAS_REACHED_WIN_COUNT) {
      alert('yey you won!')
    } else {
      this.sequence = this.sequence + generateNext(this.sequence)

      this.streak = this.streak + 1
      document.querySelector('#streak-count').innerHTML = this.streak

      this.reset()
    }
  }

  incorrectButtonPresses() {
    if (this.strictmode) {
      alert('hahaha you suck')
      this.startGame()
    } else {
      alert('please try again')
      this.reset()
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

  get streak() {
    return parseInt(this.data.get('streak'))
  }

  set streak(s) {
    return this.data.set('streak', s)
  }
}