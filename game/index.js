import { Map } from 'immutable'

const streak = (board, firstCoord, ...restCoord) => {
  const value = board.getIn(firstCoord)
  if (!value) return null
  for(const coord of restCoord) {
    if (board.getIn(coord) !== value) return null
  }
  return value
}

const winner = (board) => {
  // rows && cols
  let i = 2
  while (i >= 0) {
    const row = streak(board, [0, i], [1, i], [2, i])
    if (row) return row
    const col = streak(board, [i, 0], [i, 1], [i, 2])
    if (col) return col
    i -= 1
  }

  // both diags
  const fDiag = streak(board, [0, 0], [1, 1], [2, 2])
  if (fDiag) return fDiag

  const bDiag = streak(board, [2, 0], [1, 1], [0, 2])
  if (bDiag) return bDiag

  // draws
  let row = 3
  while (row >= 0) {
    let col = 3
    row -= 1
    while (col >= 0) {
      if (!board.hasIn([row, col])) return null
      col -= 1
    }
  }

  // Otherwise, it's a draw.
  return 'draw'
}

const MOVE = 'move'

export const move = (turn, position) => ({
  type: MOVE,
  position,
  turn,
})

export const bad = (state, action) => {
  if (action.type !== MOVE) return
  if (action.turn !== state.turn) return `It's not ${action.turn}'s turn`
  if (action.position.length !== 2) return `Please enter your row, column.`
  const [row, col] = action.position
  if (!Number(row) || row < 0 || row > 2) return `Invalid row input (must be 0-2): ${row}`
  if (!Number(col) || col < 0 || col > 2) return `Invalid column input (must be 0-2): ${col}`
  if (state.board.hasIn(action.position)) return `${action.position} is already taken`
}

const turnReducer = (turn = 'X', action) => {
  if (action.type === MOVE) {
    return turn === 'X' ? 'O' : 'X'
  }
  return turn
}

const boardReducer = (board = Map(), action) => {
  if (action.type === MOVE) {
    return board.setIn(action.position, action.turn)
  }
  return board
}

export default function reducer(state = {}, action) {
  const error = bad(state, action)
  if (error) return Object.assign({}, state, { error })
  const nextBoard = boardReducer(state.board, action)
  const winState = winner(nextBoard)
  return {
    board: boardReducer(state.board, action),
    turn: turnReducer(state.turn, action),
    winner: winState,
  }
}
