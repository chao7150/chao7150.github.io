const { h, app } = hyperapp

const pad = n => (n < 10 ? "0" + n : n)

const humanizeTime = t => {
  const hours = (t / 3600) >> 0
  const minutes = ((t - hours * 3600) / 60) >> 0
  const seconds = (t - hours * 3600 - minutes * 60) >> 0
  return `${hours} : ${pad(minutes)} : ${pad(seconds)}`
}

const SECONDS = 5

const state = {
  count: SECONDS,
  paused: true
}

const actions = {
  tick: () => (state, actions) => {
    if (state.count === 0) {
      actions.reset()
      actions.toggle()
    } else if (!state.paused) {
      actions.drop()
    }
  },
  drop: () => state => ({ count: state.count - 1 }),
  reset: () => ({ count: SECONDS }),
  toggle: () => state => ({ paused: !state.paused })
}

const view = (state, actions) =>
  h("main", {}, [
    h("h1", {id: "time"}, humanizeTime(state.count)),
    h("button", { onclick: actions.toggle }, state.paused ? "Start" : "paused"),
    h("button", { onclick: actions.reset }, "Reset")
  ])

const main = app(state, actions, view, document.body)

setInterval(main.tick, 1000)