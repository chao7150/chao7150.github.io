const { h, app } = hyperapp

const state = {
  turn: -1,
  grid: [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]],
  wonby: 0,
}

const actions = {
  put: (coordinates) => (state, actions) => {
    if (state.wonby != 0) {
      return state
    }
    if (state.grid[coordinates[0]][coordinates[1]] != 0) {
      return state
    }
    const newgrid = state.grid
    newgrid[coordinates[0]][coordinates[1]] = state.turn
    return {
      turn: -state.turn,
      grid: newgrid,
      wonby: actions.wincheck([newgrid, state.turn]) ? state.turn : 0,
    }
  },
  wincheck: (params) => {
    const [grid, turn] = params
    const triplets = [
      grid[0].reduce((x, y) => x + y),
      grid[1].reduce((x, y) => x + y),
      grid[2].reduce((x, y) => x + y),
      grid[0][0] + grid[1][0] + grid[2][0],
      grid[0][1] + grid[1][1] + grid[2][1],
      grid[0][2] + grid[1][2] + grid[2][2],
      grid[0][0] + grid[1][1] + grid[2][2],
      grid[0][2] + grid[1][1] + grid[2][0],
    ]
    return triplets.some(value => value == turn * 3)
  },
  reset: () => state => ({
    turn: -1,
    grid: [[0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]],
    wonby: 0,
  })
}

const view = (state, actions) =>
  h("div", {id: "app"}, [
    h("h1", {}, "3目並べ"),
    h("p", {}, [
      h("button", { onclick: () => actions.put([0, 0]), class: "grid" }, state.grid[0][0] == 1 ? "○" : state.grid[0][0] == -1 ? "●" : "□"),
      h("button", { onclick: () => actions.put([0, 1]), class: "grid" }, state.grid[0][1] == 1 ? "○" : state.grid[0][1] == -1 ? "●" : "□"),
      h("button", { onclick: () => actions.put([0, 2]), class: "grid" }, state.grid[0][2] == 1 ? "○" : state.grid[0][2] == -1 ? "●" : "□"),
    ]),
    h("p", {}, [
      h("button", { onclick: () => actions.put([1, 0]), class: "grid" }, state.grid[1][0] == 1 ? "○" : state.grid[1][0] == -1 ? "●" : "□"),
      h("button", { onclick: () => actions.put([1, 1]), class: "grid" }, state.grid[1][1] == 1 ? "○" : state.grid[1][1] == -1 ? "●" : "□"),
      h("button", { onclick: () => actions.put([1, 2]), class: "grid" }, state.grid[1][2] == 1 ? "○" : state.grid[1][2] == -1 ? "●" : "□"),
    ]),
    h("p", {}, [
      h("button", { onclick: () => actions.put([2, 0]), class: "grid" }, state.grid[2][0] == 1 ? "○" : state.grid[2][0] == -1 ? "●" : "□"),
      h("button", { onclick: () => actions.put([2, 1]), class: "grid" }, state.grid[2][1] == 1 ? "○" : state.grid[2][1] == -1 ? "●" : "□"),
      h("button", { onclick: () => actions.put([2, 2]), class: "grid" }, state.grid[2][2] == 1 ? "○" : state.grid[2][2] == -1 ? "●" : "□"),
    ]),
    h("p", {}, state.wonby == 1 ? "白の勝ち" : state.wonby == -1 ? "黒の勝ち" : ""),
    h("button", { onclick: () => actions.reset() }, "リセット"),
  ])

app(state, actions, view, document.body)