const { h, app } = hyperapp

const state = {
  now: "memorize",
  number: "",
  presentation: "",
  numberOfDigits: 4,
  inputBox: "",
  showNumber: "",
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
      if (state.presentation == state.inputBox) {
        state = { ...state, presentation: "correct", numberOfDigits: state.numberOfDigits + 1 }
      } else {
        state = { ...state, presentation: "incorrect", numberOfDigits: state.numberOfDigits - 1 }
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
    state = { ...state, now: "memorize", number: newNumber, presentation: newNumber, inputBox: "" }
    setTimeout(actions.endMemorize, 3000)
    return state
  },
  endMemorize: () => (state, actions) => {
    console.log("aa")
    state = { ...state, presentation: " " }
    setTimeout(actions.startAnswer, 5000)
    return state
  },
  startAnswer: () => state => {
    console.log("start answer")
    state = { ...state, readonly: "" }
    return state
  }
}

const view = (state, actions) => (
  h("div", {}, [
    h("h1", {}, "memory experiment"),
    h("p", { visibility: state.showNumber }, state.presentation),
    h("input", { value: state.inputBox, oninput: actions.updateInput, onkeydown: actions.submit, readonly: state.inputReadonly })
  ])
)

const main = app(state, actions, view, document.body)
main.startMemorize()