const { h, app } = hyperapp

const state = {
  distance: 570,
  displayHorizontalSize: 527.04,
  displayHorizontalResolution: 1920,
  displayPixelSize: 527.04 / 1920,
  objectSize: 1,
  pixels: null
}

const actions = {
  update: (e) => state => {
    console.log(state)
    state = {...state, [e.srcElement.id]: Number(e.srcElement.value)}
    return {
      ...state,
      displayPixelSize: state.displayHorizontalSize / state.displayHorizontalResolution,
      pixels: state.distance * Math.tan(state.objectSize / 180 * Math.PI) / state.displayPixelSize
    }
  }
}

const view = (state, actions) => (
  h("div", {}, [
    h("h1", {}, "displayspectool"),
    "display distance(mm)",
    h("input", {id: "distance", type: "number", value: state.distance, oninput: actions.update}),
    h("p"),
    "display horizontal size(mm)",
    h("input", {id: "displayHorizontalSize", type: "number", value: state.displayHorizontalSize, oninput: actions.update}),
    h("p"),
    "display horizontal resolution(dots)", 
    h("input", {id: "displayHorizontalResolution", type: "number", value: state.displayHorizontalResolution, oninput: actions.update}),
    h("p"),
    "display pixel size(mm/pix)",
    h("input", {id: "displayPixelSize", class: "readonly", type: "number", readonly: "readonly", value: state.displayPixelSize}),
    h("p"),
    "object size(deg)",
    h("input", {id: "objectSize", type: "number", value: state.objectSize, oninput: actions.update}),
    h("p"),
    "pixels(pix)",
    h("input", {id: "pixels", class: "readonly", type: "number", readonly: "readonly", value: state.pixels})
  ])
)

app(state, actions, view, document.body)