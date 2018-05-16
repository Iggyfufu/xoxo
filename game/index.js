import { Map } from 'immutable'

const MOVE = 'move'

const move = (turn, position) => ({
  type: MOVE,
  position,
  turn,
})

export { move }

export default function reducer(state = { board: Map(), turn: 'X' }, action) {
  // TODO
  if (action.type === MOVE) {
    return {
      board: state.board.setIn(action.position, action.turn),
      turn: state.turn === 'X' ? 'O' : 'X',
    }
  }
  return state
}
