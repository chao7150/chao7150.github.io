const { h, app } = hyperapp

const settings = {
  initialNumberOfDigits: 4
}

const log = []

const state = {
  number: "",
  presentation: "",
  numberOfDigits: settings.initialNumberOfDigits,
  inputBox: "",
  inputReadonly: "readonly"
}

const actions = {
  updateInput: (e) => state => {
    state = { ...state, inputBox: e.target.value }
    return state
  },
  submit: (e) => (state, actions) => {
    if (e.keyCode == 13) {
      state = { ...state, now: "feedback" }
      if (state.number == state.inputBox) {
        state = { ...state, presentation: "correct", inputReadonly: "readonly", numberOfDigits: state.numberOfDigits + 1 }
      } else {
        state = { ...state, presentation: "incorrect", inputReadonly: "readonly", numberOfDigits: state.numberOfDigits - 1 }
      }
      setTimeout(actions.startMemorize, 3000)
    }
    return state
  },
  startMemorize: () => (state, actions) => {
    newNumber = ""
    for (let i = 0; i < state.numberOfDigits; i++) {
      const digit = String(Math.round(Math.random() * 10))
      newNumber += digit
    }
    state = { ...state, number: newNumber, presentation: newNumber, inputBox: "" }
    setTimeout(actions.endMemorize, 3000)
    return state
  },
  endMemorize: () => (state, actions) => {
    state = { ...state, presentation: "XXXXXXXXXXXX" }
    setTimeout(actions.startAnswer, 5000)
    return state
  },
  startAnswer: () => state => {
    state = { ...state, inputReadonly: "" }
    return state
  }
}

const view = (state, actions) => (
  h("div", {}, [
    h("h1", {  }, "memory experiment"),
    h("p", { oncopy: () => false }, state.presentation),
    h("input", { value: state.inputBox, oninput: actions.updateInput, onkeydown: actions.submit, [state.inputReadonly]: ""})
  ])
)

const main = app(state, actions, view, document.body)
main.startMemorize()