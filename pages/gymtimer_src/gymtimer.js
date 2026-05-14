const TOTAL_ROUNDS = 3;
const INTERVAL_SECONDS = 120;

let state = {
  phase: 'idle',
  roundIndex: 0,
  intervalTimeLeft: INTERVAL_SECONDS
};

let timerInterval = null;
let wakeLock = null;

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch (e) {
    console.log('Wake Lock not available');
  }
}

async function releaseWakeLock() {
  try {
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch (e) {
    console.log('Wake Lock release failed');
  }
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function init() {
  clearTimer();
  state.phase = 'idle';
  state.roundIndex = 0;
  state.intervalTimeLeft = INTERVAL_SECONDS;
  render();
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function hideSessionPanels() {
  document.getElementById('header').style.display = 'none';
  document.getElementById('main').style.display = 'none';
  document.getElementById('controls').style.display = 'none';
  document.getElementById('controls').innerHTML = '';
  document.getElementById('rep-selector').style.display = 'none';

  const summary = document.getElementById('summary');
  summary.style.display = 'none';
  summary.classList.remove('show');
}

function renderStartScreen() {
  hideSessionPanels();

  const setup = document.getElementById('setup');
  setup.style.display = 'flex';
  setup.innerHTML = `
    <h2>3セットタイマー</h2>
    <div class="setup-summary">トレーニング → 2分インターバル → トレーニング → 2分インターバル → トレーニング</div>
    <div class="setup-buttons">
      <button class="btn btn-start" onclick="startSession()">トレーニング開始</button>
    </div>
  `;
}

function renderSession() {
  document.getElementById('setup').style.display = 'none';
  document.getElementById('header').style.display = 'flex';
  document.getElementById('main').style.display = 'flex';
  document.getElementById('controls').style.display = state.phase === 'training' ? 'flex' : 'none';
  document.getElementById('rep-selector').style.display = 'none';

  const summary = document.getElementById('summary');
  summary.style.display = 'none';
  summary.classList.remove('show');

  document.getElementById('exercise-name').textContent = `セット ${state.roundIndex + 1}/${TOTAL_ROUNDS}`;

  const stepInfo = document.getElementById('step-info');
  const stepType = document.getElementById('step-type');
  const timer = document.getElementById('timer');
  const controls = document.getElementById('controls');

  if (state.phase === 'training') {
    stepInfo.textContent = 'トレーニング';
    stepType.textContent = 'TRAINING';
    stepType.className = 'training';
    timer.textContent = '';
    controls.innerHTML = `
      <button class="btn btn-end" onclick="completeTraining()">${state.roundIndex === TOTAL_ROUNDS - 1 ? '終了' : 'インターバル開始'}</button>
    `;
    return;
  }

  if (state.phase === 'interval') {
    stepInfo.textContent = 'インターバル';
    stepType.textContent = 'INTERVAL';
    stepType.className = 'interval';
    timer.textContent = formatTime(state.intervalTimeLeft);
  }
}

function render() {
  if (state.phase === 'idle') {
    renderStartScreen();
    return;
  }

  renderSession();
}

async function startSession() {
  clearTimer();
  await requestWakeLock();

  state.phase = 'training';
  state.roundIndex = 0;
  state.intervalTimeLeft = INTERVAL_SECONDS;
  render();
}

function completeTraining() {
  if (state.phase !== 'training') {
    return;
  }

  if (state.roundIndex >= TOTAL_ROUNDS - 1) {
    finishSession();
    return;
  }

  state.phase = 'interval';
  state.intervalTimeLeft = INTERVAL_SECONDS;
  render();
  startInterval();
}

function startInterval() {
  clearTimer();

  timerInterval = setInterval(() => {
    state.intervalTimeLeft--;

    if (state.intervalTimeLeft <= 0) {
      clearTimer();
      state.roundIndex++;
      state.phase = 'training';
      state.intervalTimeLeft = INTERVAL_SECONDS;
      render();
      return;
    }

    render();
  }, 1000);
}

function finishSession() {
  clearTimer();
  void releaseWakeLock();
  state.phase = 'idle';
  state.roundIndex = 0;
  state.intervalTimeLeft = INTERVAL_SECONDS;
  render();
}

document.addEventListener('DOMContentLoaded', init);
