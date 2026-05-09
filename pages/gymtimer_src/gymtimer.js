const DEFAULT_EXERCISES = [
  { name: 'チェストプレス', intensity: '', steps: ['training', 120, 'training', 120, 'training'] },
  { name: 'レッグプレス', intensity: '', steps: ['training', 120, 'training', 120, 'training'] },
  { name: 'バックエクステンション', intensity: '', steps: ['training', 120, 'training', 120, 'training'] },
  { name: 'アブドミナル', intensity: '', steps: ['training', 120, 'training', 120, 'training'] },
  { name: 'プルダウン', intensity: '', steps: ['training', 120, 'training', 120, 'training'] }
];

let state = {
  exercises: [],
  currentExerciseIndex: 0,
  currentStepIndex: 0,
  isRunning: false,
  isPaused: false,
  intervalTimeLeft: 0,
  results: []
};

let timerInterval = null;
let wakeLock = null;

let isSetup = true;

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch (e) {
    console.log('Wake Lock not available');
  }
}

function init() {
  const saved = localStorage.getItem('gymtimer_exercises');
  if (saved) {
    state.exercises = JSON.parse(saved);
  } else {
    state.exercises = JSON.parse(JSON.stringify(DEFAULT_EXERCISES));
  }
  state.currentExerciseIndex = 0;
  state.currentStepIndex = 0;
  state.isRunning = false;
  state.results = [];
  state.exercises.forEach(() => state.results.push({ reps: [] }));
  isSetup = true;
  render();
}

function getCurrentExercise() {
  return state.exercises[state.currentExerciseIndex];
}

function getCurrentStep() {
  return getCurrentExercise().steps[state.currentStepIndex];
}

function getTrainingCount() {
  const exercise = getCurrentExercise();
  return exercise.steps.filter(s => s === 'training').length;
}

function getCurrentTrainingIndex() {
  const steps = getCurrentExercise().steps.slice(0, state.currentStepIndex + 1);
  return steps.filter(s => s === 'training').length;
}

function isInterval(step) {
  return typeof step === 'number';
}

function render() {
  if (isSetup) {
    renderSetup();
    return;
  }

  const exercise = getCurrentExercise();
  const step = getCurrentStep();
  const trainingCount = getTrainingCount();

  document.getElementById('exercise-name').textContent = exercise.name;
  
  if (isInterval(step)) {
    const nextTrainingIndex = getCurrentTrainingIndex() + 1;
    document.getElementById('step-info').textContent = `セット ${nextTrainingIndex}/${trainingCount} - インターバル`;
    document.getElementById('step-type').textContent = 'INTERVAL';
    document.getElementById('step-type').className = 'interval';
    document.getElementById('timer').textContent = formatTime(state.intervalTimeLeft || step);
  } else {
    document.getElementById('step-info').textContent = `セット ${getCurrentTrainingIndex()}/${trainingCount}`;
    document.getElementById('step-type').textContent = 'TRAINING';
    document.getElementById('step-type').className = 'training';
    document.getElementById('timer').textContent = '';
  }

  renderControls();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function renderSetup() {
  document.getElementById('header').style.display = 'none';
  document.getElementById('main').style.display = 'none';
  document.getElementById('controls').style.display = 'none';
  document.getElementById('rep-selector').style.display = 'none';
  
  const setup = document.getElementById('setup');
  setup.style.display = 'flex';
  
  let html = '<h2>種目設定</h2>';
  state.exercises.forEach((exercise, i) => {
    html += `
      <div class="setup-row">
        <input type="text" class="setup-name" value="${exercise.name}" data-index="${i}" placeholder="種目名">
        <input type="text" class="setup-intensity" value="${exercise.intensity}" data-index="${i}" placeholder="強度">
      </div>
    `;
  });
  html += `
    <div class="setup-buttons">
      <button class="btn btn-start" onclick="startAll()">トレーニング開始</button>
      <button class="btn btn-skip" onclick="toggleFullscreen()">全画面</button>
    </div>
  `;
  setup.innerHTML = html;
}

function renderControls() {
  const step = getCurrentStep();
  const controls = document.getElementById('controls');
  const repSelector = document.getElementById('rep-selector');

  if (document.getElementById('summary').classList.contains('show')) {
    controls.innerHTML = '';
    return;
  }

  if (!state.isRunning) {
    let skipBtn = '';
    if (state.currentStepIndex === 0 && state.currentExerciseIndex < state.exercises.length - 1) {
      skipBtn = '<button class="btn btn-skip" onclick="skipExercise()">スキップ</button>';
    }
    controls.innerHTML = `
      <button class="btn btn-start" onclick="startTraining()">開始</button>
      ${skipBtn}
    `;
    repSelector.classList.remove('show');
  } else if (state.isPaused) {
    controls.innerHTML = '';
    repSelector.classList.add('show');
    repSelector.innerHTML = generateRepButtons();
  } else if (isInterval(step)) {
    controls.innerHTML = '<button class="btn btn-skip" onclick="skipInterval()">スキップ</button>';
    repSelector.classList.remove('show');
  } else {
    controls.innerHTML = '<button class="btn btn-end" onclick="endTraining()">終了</button>';
    repSelector.classList.remove('show');
  }
}

function generateRepButtons() {
  let html = '<div style="width:100%;text-align:center;margin-bottom:20px;font-size:42px;">回数を選択</div>';
  for (let i = 0; i <= 12; i++) {
    html += `<button class="rep-btn" onclick="selectReps(${i})">${i}</button>`;
  }
  return html;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function startAll() {
  const nameInputs = document.querySelectorAll('.setup-name');
  const intensityInputs = document.querySelectorAll('.setup-intensity');
  
  nameInputs.forEach((input, i) => {
    state.exercises[i].name = input.value;
  });
  intensityInputs.forEach((input, i) => {
    state.exercises[i].intensity = input.value;
  });
  
  localStorage.setItem('gymtimer_exercises', JSON.stringify(state.exercises));
  
  await requestWakeLock();
  
  isSetup = false;
  document.getElementById('setup').style.display = 'none';
  document.getElementById('rep-selector').style.display = '';
  document.getElementById('header').style.display = 'flex';
  document.getElementById('main').style.display = 'flex';
  document.getElementById('controls').style.display = 'flex';
  render();
}

function startTraining() {
  state.isRunning = true;
  state.isPaused = false;
  render();
}

function skipExercise() {
  state.results[state.currentExerciseIndex].reps = [];
  nextExercise();
}

function endTraining() {
  state.isPaused = true;
  render();
}

function selectReps(reps) {
  state.results[state.currentExerciseIndex].reps.push(reps);
  
  const exercise = getCurrentExercise();
  if (state.currentStepIndex >= exercise.steps.length - 1) {
    nextExercise();
  } else {
    state.currentStepIndex++;
    startInterval();
  }
}

function startInterval() {
  const step = getCurrentStep();
  state.intervalTimeLeft = step;
  state.isPaused = false;
  render();

  timerInterval = setInterval(() => {
    state.intervalTimeLeft--;
    render();
    
    if (state.intervalTimeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      nextStep();
    }
  }, 1000);
}

function skipInterval() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  nextStep();
}

function nextStep() {
  const exercise = getCurrentExercise();
  if (state.currentStepIndex >= exercise.steps.length - 1) {
    nextExercise();
  } else {
    state.currentStepIndex++;
    render();
  }
}

function nextExercise() {
  state.currentExerciseIndex++;
  state.currentStepIndex = 0;

  if (state.currentExerciseIndex >= state.exercises.length) {
    showSummary();
  } else {
    state.isRunning = false;
    render();
  }
}

function showSummary() {
  document.getElementById('main').style.display = 'none';
  document.getElementById('controls').style.display = 'none';
  
  const summary = document.getElementById('summary');
  summary.classList.add('show');
  
  let text = '';
  state.exercises.forEach((exercise, i) => {
    const result = state.results[i];
    if (result.reps.length > 0) {
      text += `${exercise.name} ${exercise.intensity} ${result.reps.join(' ')}\n`;
    }
  });
  
  summary.innerHTML = `
    <pre class="summary-text" id="summary-text">${text.trim()}</pre>
    <button class="btn btn-skip" onclick="copySummary()">コピー</button>
    <button class="btn btn-start" id="restart-btn" onclick="restart()">もう一度</button>
  `;
}

function copySummary() {
  const text = document.getElementById('summary-text').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    btn.textContent = 'コピー完了';
    setTimeout(() => btn.textContent = 'コピー', 1500);
  });
}

function restart() {
  document.getElementById('header').style.display = 'flex';
  document.getElementById('main').style.display = 'flex';
  document.getElementById('controls').style.display = 'flex';
  document.getElementById('summary').classList.remove('show');
  init();
}

document.addEventListener('DOMContentLoaded', init);
