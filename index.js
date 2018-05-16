import inquirer from 'inquirer'
import { createStore } from 'redux'

import gameReducer, { move } from './game'
import AI from './game/ai'

// Create the store
const game = createStore(gameReducer)

const printBoard = () => {
  const { board } = game.getState()
  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      process.stdout.write(board.getIn([r, c], '_'))
    }
    process.stdout.write('\n')
  }
}

const getInput = player => async () => {
  const { turn } = game.getState()
  if (turn !== player) return
  const ans = await inquirer.prompt([{
    type: 'input',
    name: 'coord',
    message: `${turn}'s move (row,col):`,
  }])
  const [row = 0, col = 0] = ans.coord.split(/[,\s+]/).map(x => +x)
  game.dispatch(move(turn, [row, col]))
}

const gameWon = () => {
  const { winner } = game.getState()
  if (winner) {
    process.stdout.write(`The winner is ${winner}\n`)
    process.exit(0)
  }
}

const err = () => {
  const { error } = game.getState()
  if (error) {
    process.stdout.write(`${error}\n`)
  }
}

const ai = turn => () => {
  const state = game.getState()
  if (state.turn !== turn) return
  if (state.winner) return
  const move = AI(game.getState())
  process.stdout.write(`\n\n${turn} moves to $\n\n`)
  game.dispatch(move)
}

// Debug: Print the state
// game.subscribe(() => console.log(game.getState()))

game.subscribe(err)
game.subscribe(printBoard)
game.subscribe(getInput('X'))
game.subscribe(ai('O'))
game.subscribe(gameWon)

// We dispatch a dummy START action to call all our
// subscribers the first time.
game.dispatch({ type: 'START' })
