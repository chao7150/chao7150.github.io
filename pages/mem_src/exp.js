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
  inputDisabled: "disabled",
  trialNum: 1,
  seriesType: 1, // 上昇系列:1, 下降系列:-1
  numberOfDigits: settings.initialDifficulty,
  log: [["trialNum", "series", "number", "response", "numberOfDigits", "correct"]],
  seriesNum: 1
}

const actions = {
  startMemorize: () => (state, actions) => {
    let newNumber = ""
    for (let i = 0; i < state.numberOfDigits; i++) {
      const digit = String(Math.floor(Math.random() * 10))
      newNumber += digit
    }
    setTimeout(actions.endMemorize, 1000)
    return { ...state, presentation: newNumber, inputBox: "" }
  },
  endMemorize: () => (state, actions) => {
    setTimeout(actions.startAnswer, 1000)
    return { ...state, visibility: "hidden" }
  },
  startAnswer: () => state => {
    console.log(document.getElementById("js-input-form"))
    document.getElementById("js-input-form").focus()
    return { ...state, inputDisabled: "" }
  },
  submit: e => (state, actions) => {
    if (e.keyCode !== 13) {
      return state
    }
    // 正解判定
    const correct = state.presentation == state.inputBox
    latestTrialLog = [
      state.trialNum,
      state.seriesNum,
      state.presentation,
      state.inputBox,
      state.numberOfDigits,
      correct ? 1 : 0
    ]
    const nextSeriesType = actions.switchSeriesType(correct)
    console.log(nextSeriesType)
    state = {
      ...state,
      trialNum: state.trialNum + 1,
      log: state.log.concat([latestTrialLog]),
      presentation: correct ? "correct" : "incorrect",
      visibility: "visible",
      numberOfDigits: state.numberOfDigits + nextSeriesType,
      seriesType: nextSeriesType,
      inputDisabled: "disabled",
      seriesNum: state.seriesNum + (nextSeriesType != state.seriesType ? 1 : 0),
    }
    if (state.seriesNum == 2) {
      actions.endExp(latestTrialLog)
    } else {
      setTimeout(actions.startMemorize, 1000)
      return state
    }
  },
  endExp: finalState => actions => {
    const memCap = actions.calcMemCap(finalState.log)
    return { ...state, result: actions.createCSV(finalState.log.concat(["Your memory capacity is", memCap])) }
  },
  createCSV: array2d => array2d.map(row => row.join(",")).join("\r\n"),
  switchSeriesType: correct => state => {
    if (state.trialNum == 1) {
      return state.seriesType
    }
    if (state.seriesType == 1 && state.log[state.log.length - 1][5] == 0 && !correct) {
      return -1
    } else if (state.seriesType == -1 && state.log[state.log.length - 1][5] == 1 && correct) {
      return 1
    } else {
      return state.seriesType
    }
  },
  calcMemCap: logs => actions => {
    var sum = 0
    for (let i = 1; i <= 20; i++) {
      const thisSeries = logs.filter(log => log[1] == i)
      sum += actions.calcReprOfSeries(thisSeries)
    }
    return sum / 20
  },
  calcReprOfSeries: thisSeries => {
    const correctTrials = thisSeries.filter(trial => trial[5] == 1)
    if (correctTrials.length == 0) {
      return thisSeries[0][numberOfDigits] - 1
    } else {
      return Math.max(correctTrials.map(trial => trial[4]))
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
        id: "js-input-form",
        value: state.inputBox,
        oninput: actions.updateInput,
        onkeydown: actions.submit,
        [state.inputDisabled]: "disabled"
      })
    ]),
    h("br"),
    h("pre", {}, state.result)
  ])
)

const main = app(state, actions, view, document.body)
main.startMemorize()
