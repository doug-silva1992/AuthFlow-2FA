let currentStep = 1;
let selectedAuth = 'google';

function selectAuth(app) {
  selectedAuth = app;
  document.getElementById('opt-google').classList.toggle('selected', app === 'google');
  document.getElementById('opt-microsoft').classList.toggle('selected', app === 'microsoft');
  const label = app === 'google' ? 'Google Authenticator' : 'Microsoft Authenticator';
  const el = document.getElementById('chosen-app-name');
  if (el) el.textContent = label;
}

function goTo(step) {
  document.getElementById('screen-' + currentStep).classList.remove('active');
  document.getElementById('nav-' + currentStep).classList.remove('active');

  // mark previous as done
  for (let i = 1; i < step; i++) {
    document.getElementById('nav-' + i).classList.add('done');
    document.getElementById('nav-' + i).classList.remove('active');
  }
  // remove done from future steps
  for (let i = step; i <= 3; i++) {
    document.getElementById('nav-' + i).classList.remove('done');
  }

  currentStep = step;
  const screen = document.getElementById('screen-' + step);
  screen.classList.remove('active');
  void screen.offsetWidth; // reflow for animation
  screen.classList.add('active');

  document.getElementById('nav-' + step).classList.add('active');
  document.getElementById('nav-' + step).classList.remove('done');

  // keep app name in sync
  const el = document.getElementById('chosen-app-name');
  if (el) el.textContent = selectedAuth === 'google' ? 'Google Authenticator' : 'Microsoft Authenticator';
}

function next(step) { goTo(step); }

// ── Code digit auto-advance ──
const digits = document.querySelectorAll('.code-digit');
digits.forEach((el, i) => {
  el.addEventListener('input', () => {
    el.value = el.value.replace(/[^0-9]/g, '').slice(-1);
    if (el.value && i < digits.length - 1) digits[i + 1].focus();
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !el.value && i > 0) digits[i - 1].focus();
  });
});

function resetCode() {
  digits.forEach(d => { d.value = ''; });
  digits[0].focus();
}

function verify() {
  const code = Array.from(digits).map(d => d.value).join('');
  if (code.length < 6) {
    digits.forEach(d => {
      d.style.borderColor = 'var(--danger)';
      d.style.boxShadow = '0 0 0 3px rgba(255,79,110,.15)';
    });
    setTimeout(() => {
      digits.forEach(d => { d.style.borderColor = ''; d.style.boxShadow = ''; });
    }, 1200);
    return;
  }
  // simulate success — replace card content
  const card = document.querySelector('#screen-3 .auth-card');
  card.innerHTML = `
    <div class="success-center">
      <div class="success-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <p class="card-eyebrow" style="text-align:center">Sucesso</p>
      <h2 class="card-title" style="text-align:center">Tudo certo!</h2>
      <p class="card-sub" style="text-align:center;margin-bottom:0">Sua conta foi verificada com sucesso.<br/>Você já pode acessar a plataforma.</p>
    </div>
  `;
  // mark all done
  ['nav-1', 'nav-2', 'nav-3'].forEach(id => {
    document.getElementById(id).classList.remove('active');
    document.getElementById(id).classList.add('done');
  });
}