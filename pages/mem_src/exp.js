const { h, app } = hyperapp

const settings = {
  initialDifficulty: 4,
  trials: 5
}

const state = {
  presentation: "",
  visibility: "visible",
  inputBox: "",
  result: "",
  inputReadonly: "readonly",
  trialNum: 1,
  series: 1, // 上昇系列:1, 下降系列:-1
  numberOfDigits: settings.initialDifficulty,
  log: [["trialNum", "number", "correct", "numberOfDigits"]]
}

const actions = {
  startMemorize: () => (state, actions) => {
    let newNumber = ""
    for (let i = 0; i < state.numberOfDigits; i++) {
      const digit = String(Math.floor(Math.random() * 10))
      newNumber += digit
    }
    setTimeout(actions.endMemorize, 3000)
    return { ...state, presentation: newNumber, inputBox: "" }
  },
  endMemorize: () => (state, actions) => {
    setTimeout(actions.startAnswer, 5000)
    return { ...state, visibility: "hidden" }
  },
  startAnswer: () => state => ({ ...state, inputReadonly: "" }),
  submit: e => (state, actions) => {
    if (e.keyCode !== 13) {
      return state
    }
    // 正解判定
    const correct = state.presentation == state.inputBox ? true : false
    latestTrialLog = [
      state.trialNum,
      state.presentation,
      correct ? 1 : 0,
      state.numberOfDigits
    ]
    const nextSeries = actions.switchSeries(correct)
    state = {
      ...state,
      trialNum: state.trialNum + 1,
      log: state.log.concat([latestTrialLog]),
      presentation: correct ? "correct" : "incorrect",
      visibility: "visible",
      numberOfDigits: state.numberOfDigits + nextSeries,
      series: nextSeries,
      inputReadonly: "readonly"
    }
    if (state.trialNum - 1 == settings.trials) {
      actions.endExp(latestTrialLog)
    } else {
      setTimeout(actions.startMemorize, 3000)
      return state
    }
  },
  endExp: log => (state, actions) => ({ ...state, result: actions.createCSV(state.log.concat([log])) }),
  createCSV: array2d => array2d.map(row => row.join(",")).join("\r\n"),
  switchSeries: correct => state => {
    if (state.trialNum == 1) {
      return state.series
    }
    if (state.series == 1 && state.log[state.log.length - 1][2] == 0 && !correct) {
      return -1
    } else if (state.series == -1 && state.log[state.log.length - 1][2] == 1 && correct) {
      return 1
    } else {
      return state.series
    }
  },
  updateInput: e => state => {
    return { ...state, inputBox: e.target.value }
  }
}

const view = (state, actions) => (
  h("div", {}, [
    h("main", { class: "center" }, [
      h("h1", {}, "memory experiment"),
      h("h2", {
        class: "disable-copy",
        style: { visibility: state.visibility }
      }, state.presentation),
      h("input", {
        value: state.inputBox,
        oninput: actions.updateInput,
        onkeydown: actions.submit,
        [state.inputReadonly]: ""
      })
    ]),
    h("br"),
    h("pre", {}, state.result)
  ])
)

const main = app(state, actions, view, document.body)
main.startMemorize()