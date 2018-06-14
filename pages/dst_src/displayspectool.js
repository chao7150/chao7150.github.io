const { h, app } = hyperapp

const state = {
  distance: 570,
  displayHorizontalSize: 527.04,
  displayHorizontalResolution: 1920,
  displayPixelSize: 527.04 / 1920,
  objectSizeOnRetina: 1,
  objectSizeOnDisplay: 570 * Math.tan(1 / 180 * Math.PI),
  pixels: 570 * Math.tan(1 / 180 * Math.PI) / (527.04 / 1920)
}

const actions = {
  update: (e) => state => {
    state = {...state, [e.srcElement.id]: Number(e.srcElement.value)}
    return {
      ...state,
      displayPixelSize: state.displayHorizontalSize / state.displayHorizontalResolution,
      objectSizeOnDisplay: state.distance * Math.tan(state.objectSizeOnRetina / 180 * Math.PI),
      pixels: state.distance * Math.tan(state.objectSizeOnRetina / 180 * Math.PI) / state.displayPixelSize
    }
  }
}

const view = (state, actions) => (
  h("div", {}, [
    h("h1", {id: "spoiler"}, "このページではJavaScript（じゃばすくりぷと）と呼ばれるプログラミング言語を利用し、あなたのコンピュータに計算を行わせてページの描画・更新を行います。あなたはこれに同意しない場合直ちに以下のリンクをクリックしてこのページを立ち去ってください。なお下記リンク先のサイトがあなたのコンピュータにいかなる動作を要求するかについて私は関知しません。"),
    h("a", {href: "http://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawId=140AC0000000045&openerCode=1#740", id: "spoiler"}, "出口"),
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
    "object size on retina(deg)",
    h("input", {id: "objectSizeOnRetina", type: "number", value: state.objectSizeOnRetina, oninput: actions.update}),
    h("p"),
    "object size on display(mm)",
    h("input", {id: "objectSizeOnDisplay", class: "readonly", type: "number", readonly: "readonly", value: state.objectSizeOnDisplay}),
    h("p"),
    "pixels(pix)",
    h("input", {id: "pixels", class: "readonly", type: "number", readonly: "readonly", value: state.pixels})
  ])
)

app(state, actions, view, document.body)