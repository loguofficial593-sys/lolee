/**
 * LEETHIYAL BIRTHDAY SURPRISE - SCRIPT
 * Style: Royal Queen Edition - Unique, Mesmerizing & Deeply Romantic
 * Strict Heart Emoji Rule: ONLY 💝 is allowed anywhere in this code.
 */

// State Management
let currentScreenIndex = 0;
const totalScreens = 8;
let isLetterOpened = false;
let isCandleBlown = false;
let isSparkGameCompleted = false;
let sparksCollected = 0;
let isRingBoxOpened = false;
let isRingBoxUnlocked = false;
let keysCollected = 0;

// Audio or external media: NONE (per requirements)

const dodgeButtonsRegistry = [];

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initInteractiveSparkleTrail();
  initConfettiCanvas();
  initPrologueDate();
  initScreenNavigation();
  initScreen1();
  initHeartRingBox();
  initJimikkiInteractions();
  initRingUnlockGame();
  startFloatingHeartsLoop();
  updateRoyalProgress(0);
});

/* ===================================================
   ROYAL JOURNEY BAR PROGRESSION
   =================================================== */
function updateRoyalProgress(index) {
  const steps = document.querySelectorAll('.journey-step');
  const connectors = document.querySelectorAll('.step-connector');

  steps.forEach((step, idx) => {
    const stepNum = idx + 1;
    step.classList.remove('active', 'completed');
    if (stepNum < index) {
      step.classList.add('completed');
    } else if (stepNum === index) {
      step.classList.add('active');
    }
  });

  connectors.forEach((conn, idx) => {
    if (idx + 1 < index) {
      conn.classList.add('completed');
    } else {
      conn.classList.remove('completed');
    }
  });
}

/* ===================================================
   SCREEN NAVIGATION & PLAYFUL 4-CLICK CORNER DODGING
   Every single button playfully jumps to multiple corners
   and unlocks on the 4th click.
   =================================================== */
function showScreen(index) {
  // Hide current active screen
  const currentScreen = document.querySelector('.screen.active');
  if (currentScreen) {
    currentScreen.classList.remove('active');
  }

  // Activate target screen
  const nextScreen = document.getElementById(`screen-${index}`);
  if (nextScreen) {
    nextScreen.classList.add('active');
    currentScreenIndex = index;
    updateRoyalProgress(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger screen-specific initializers
    if (index === 2) {
      startTypewriterSequence();
    } else if (index === 3) {
      initScreen3SparkQuest();
    } else if (index === 5) {
      startCinematicMessage();
    } else if (index === 7) {
      startRosePetalStorm();
    } else if (index === 8) {
      startFinalCelebration();
    }
  }
}

/**
 * Universal Playful Corner Dodger with configurable requiredClicks
 */
function setupDodgeButton({
  buttonId,
  hintId,
  initialText,
  steps,
  onUnlock,
  requiredClicks = 4,
  onStep,
}) {
  const btn = document.getElementById(buttonId);
  const hint = document.getElementById(hintId);
  if (!btn) return;

  let clicks = 0;

  function reset() {
    clicks = 0;
    btn.style.transform = 'translate(0px, 0px) scale(1)';
    btn.innerHTML = `<span>${initialText}</span>`;
    if (hint) {
      hint.textContent = '';
      hint.style.opacity = '0';
    }
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    clicks++;

    if (onStep) {
      onStep(clicks);
    }

    if (clicks < requiredClicks) {
      const step = steps[clicks - 1] || steps[0];
      // Responsive corner offset calculation to ensure it reaches corners safely without horizontal scrolling
      const maxOffsetX = Math.min(window.innerWidth * 0.28, 95);
      const clampedX = Math.max(-maxOffsetX, Math.min(maxOffsetX, step.x));
      const clampedY = step.y;

      btn.style.transform = `translate(${clampedX}px, ${clampedY}px) scale(0.95)`;
      btn.innerHTML = `<span>${step.btnText}</span>`;
      if (hint) {
        hint.textContent = step.hintText;
        hint.style.opacity = '1';
      }
      spawnHeartBurst(5);
    } else {
      // Final unlock click!
      const finalStep = steps[requiredClicks - 1] || steps[steps.length - 1] || {
        btnText: 'Unlocked for You 💝',
        hintText: '',
      };
      btn.style.transform = 'translate(0px, 0px) scale(1.05)';
      btn.innerHTML = `<span>${finalStep.btnText}</span>`;
      if (hint && finalStep.hintText) {
        hint.textContent = finalStep.hintText;
      }
      spawnHeartBurst(12);

      setTimeout(() => {
        onUnlock();
      }, 350);
    }
  });

  dodgeButtonsRegistry.push(reset);
}

/* ===================================================
   SCREEN 0: PROLOGUE - THE SACRED BIRTHDAY DATE 10.10.2026
   =================================================== */
function initPrologueDate() {
  const dateEl = document.getElementById('dynamic-current-date');
  if (dateEl) {
    const now = new Date();
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    const dateFormatted = now.toLocaleDateString('en-US', options);
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    dateEl.textContent = `${dateFormatted} (${dd}.${mm}.${yyyy})`;
  }

  const calCard = document.getElementById('prologue-calendar-card');
  if (calCard) {
    calCard.onclick = () => {
      spawnHeartBurst(6);
      launchConfetti(25);
      const answerCard = document.getElementById('prologue-answer-card');
      if (answerCard && answerCard.style.display === 'none') {
        const whyBtn = document.getElementById('btn-why-special');
        if (whyBtn) whyBtn.click();
      }
    };
  }
}

function revealPrologueAnswer() {
  const whyBtnWrapper = document.getElementById('why-btn-wrapper');
  const answerCard = document.getElementById('prologue-answer-card');
  const calCard = document.getElementById('prologue-calendar-card');
  const calTag = document.getElementById('cal-tag-queen');

  // Reveal "The Queen's Birthday 👑" below the date on 2nd tap!
  if (calTag) {
    calTag.textContent = "The Queen's Birthday 👑";
    calTag.classList.remove('cal-tag-locked');
    calTag.classList.add('revealed');
  }

  if (whyBtnWrapper) {
    whyBtnWrapper.style.display = 'none';
  }
  if (answerCard) {
    answerCard.style.display = 'flex';
  }
  if (calCard) {
    calCard.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 50px rgba(246, 200, 110, 0.8)';
  }

  launchConfetti(80);
  spawnHeartBurst(16);
  spawnRosePetals(12);
}

function initScreenNavigation() {
  // Screen 0: Why is Today So Special? (Shows 'The Queen's Birthday 👑' on 2nd tap)
  setupDodgeButton({
    buttonId: 'btn-why-special',
    hintId: 'dodge-hint-why',
    initialText: 'Why is Today So Special? 💝',
    requiredClicks: 2,
    steps: [
      {
        x: 75,
        y: -28,
        btnText: 'Tap Once More! 💝 (1/2)',
        hintText: 'Tap 1 more time to reveal whose special birthday it is! ✨',
      },
      {
        x: 0,
        y: 0,
        btnText: "REVEALING THE QUEEN'S BIRTHDAY! 👑",
        hintText: 'Here is the greatest miracle of 10.10.2026! ✨',
      },
    ],
    onStep: (clicks) => {
      const calTag = document.getElementById('cal-tag-queen');
      if (calTag && clicks === 1) {
        calTag.textContent = '🔒 Tap 1 more time to reveal...';
        calTag.classList.add('cal-tag-locked');
        calTag.classList.remove('revealed');
      }
    },
    onUnlock: () => {
      revealPrologueAnswer();
    },
  });

  // Screen 0: Continue to Screen 1
  setupDodgeButton({
    buttonId: 'btn-prologue-continue',
    hintId: 'dodge-hint-prologue',
    initialText: 'Enter Your Royal Surprise ✨',
    steps: [
      {
        x: -80,
        y: 32,
        btnText: 'For Leethiyal! 💝 (1/4)',
        hintText: 'Prepared with all my heart and soul! ✨',
      },
      {
        x: 84,
        y: -34,
        btnText: 'Step Inside! 👑 (2/4)',
        hintText: 'Your royal birthday surprise is ready! 💝',
      },
      {
        x: 75,
        y: 30,
        btnText: '1 Final Tap! 💝 (3/4)',
        hintText: 'Almost stepping into your royal celebration! ✨',
      },
      {
        x: 0,
        y: 0,
        btnText: 'Entering Celebration... 💝',
        hintText: 'Welcome, Queen Leethiyal! ✨',
      },
    ],
    onUnlock: () => {
      launchConfetti(55);
      spawnHeartBurst(12);
      showScreen(1);
    },
  });

  // Screen 1: Start Button
  setupDodgeButton({
    buttonId: 'btn-start',
    hintId: 'dodge-hint',
    initialText: 'Tap to Begin ✨',
    steps: [
      {
        x: 82,
        y: -36,
        btnText: 'Catch Me! 💝 (1/4)',
        hintText: 'Aww, not so fast, my Queen! 💝',
      },
      {
        x: -90,
        y: 35,
        btnText: 'Try Again! ✨ (2/4)',
        hintText: 'My heart jumps every time you tap! 💝',
      },
      {
        x: -78,
        y: -32,
        btnText: 'One More! 💝 (3/4)',
        hintText: 'Almost there, my love! Just 1 more tap! ✨',
      },
      {
        x: 0,
        y: 0,
        btnText: 'Opening For My Queen... 💝',
        hintText: 'Surprise unlocked for Leethiyal! ✨',
      },
    ],
    onUnlock: () => {
      launchConfetti(40);
      showScreen(2);
    },
  });

  // Screen 2: Continue
  setupDodgeButton({
    buttonId: 'btn-screen2-next',
    hintId: 'dodge-hint-screen2',
    initialText: 'Continue ✨',
    steps: [
      {
        x: 88,
        y: 32,
        btnText: 'Over Here! 💝 (1/4)',
        hintText: 'Every line was written from my heart! ✨',
      },
      {
        x: -82,
        y: -36,
        btnText: 'Catch My Heart! 💝 (2/4)',
        hintText: 'You make my heart skip a beat, Leethiyal! 💝',
      },
      {
        x: -85,
        y: 34,
        btnText: 'Almost Unlocked! ✨ (3/4)',
        hintText: 'One last tap to see your birthday cake! 🎂',
      },
      {
        x: 0,
        y: 0,
        btnText: 'Going to Your Cake... 💝',
        hintText: 'A royal celebration for my Queen! 🎂',
      },
    ],
    onUnlock: () => {
      showScreen(3);
    },
  });

  // Screen 3: Cut Cake & Blow Candle
  setupDodgeButton({
    buttonId: 'btn-blow-candle',
    hintId: 'dodge-hint-screen3',
    initialText: 'Cut Cake & Make a Wish 🎂🕯️',
    steps: [
      {
        x: 84,
        y: -34,
        btnText: 'Cut Cake Softly... 🎂 (1/4)',
        hintText: 'The candles dance for your birthday, my love! 💝',
      },
      {
        x: -88,
        y: 34,
        btnText: 'Make A Sweet Wish! ✨ (2/4)',
        hintText: 'Wish for everything your beautiful heart desires! 💝',
      },
      {
        x: -78,
        y: -32,
        btnText: 'Unwrap Surprise! 🎁 (3/4)',
        hintText: 'A special birthday present is waiting for you! 💫',
      },
      {
        x: 0,
        y: 0,
        btnText: 'Cake Cut & Gift Unveiled! 🎁',
        hintText: 'A royal present for Queen Leethiyal! ✨',
      },
    ],
    onUnlock: () => {
      handleBlowCandle();
    },
  });

  // Screen 3: Continue After Wish
  setupDodgeButton({
    buttonId: 'btn-screen3-next',
    hintId: 'dodge-hint-screen3',
    initialText: 'Continue 💝',
    steps: [
      {
        x: 88,
        y: 30,
        btnText: 'Next Surprise! 💝 (1/4)',
        hintText: 'More beautiful love memories await you! ✨',
      },
      {
        x: 75,
        y: -35,
        btnText: 'Follow My Heart! 💝 (2/4)',
        hintText: 'I have so much more to show you, my love! 💝',
      },
      {
        x: -80,
        y: 32,
        btnText: 'Almost There! ✨ (3/4)',
        hintText: 'One last tap to open our cherished thoughts! 💝',
      },
      {
        x: 0,
        y: 0,
        btnText: 'Opening Memories... 💝',
        hintText: 'Cherished memories unlocked! ✨',
      },
    ],
    onUnlock: () => {
      showScreen(4);
    },
  });

  // Screen 4: Continue from Memory Cards
  setupDodgeButton({
    buttonId: 'btn-screen4-next',
    hintId: 'dodge-hint-screen4',
    initialText: 'Continue ✨',
    steps: [
      {
        x: -85,
        y: -35,
        btnText: 'Still Here! 💝 (1/4)',
        hintText: 'Every memory with you is my treasure! ✨',
      },
      {
        x: 85,
        y: 35,
        btnText: 'Catch It! 🌸 (2/4)',
        hintText: 'You are the Queen ruling my thoughts! 💝',
      },
      {
        x: 76,
        y: -32,
        btnText: 'Just 1 More! 💝 (3/4)',
        hintText: 'Next is something from the bottom of my heart... ✨',
      },
      {
        x: 0,
        y: 0,
        btnText: 'Revealing My Message... 💝',
        hintText: 'Opening cinematic message... ✨',
      },
    ],
    onUnlock: () => {
      showScreen(5);
    },
  });

  // Screen 5: Continue from Cinematic Message
  setupDodgeButton({
    buttonId: 'btn-screen5-next',
    hintId: 'dodge-hint-screen5',
    initialText: 'Continue ✨',
    steps: [
      {
        x: -86,
        y: 34,
        btnText: 'Love You! 💝 (1/4)',
        hintText: 'Words can never express how much you mean to me! ✨',
      },
      {
        x: 82,
        y: -35,
        btnText: "Can't Catch Me! ✨ (2/4)",
        hintText: 'A secret love letter is waiting for you next! 💌',
      },
      {
        x: 76,
        y: 32,
        btnText: 'One Last Tap! 💝 (3/4)',
        hintText: 'Tap once more to receive your letter, Queen! 💝',
      },
      {
        x: 0,
        y: 0,
        btnText: 'Opening Letter Stage... 💌',
        hintText: 'Love letter stage unlocked! ✨',
      },
    ],
    onUnlock: () => {
      showScreen(6);
    },
  });

  // Screen 6: Open Letter
  setupDodgeButton({
    buttonId: 'btn-open-letter',
    hintId: 'dodge-hint-open-letter',
    initialText: 'Open Letter 💌',
    steps: [
      {
        x: 85,
        y: -38,
        btnText: 'Unseal Envelope! 💌 (1/4)',
        hintText: 'Written with all my heart and soul! 💝',
      },
      {
        x: -90,
        y: 34,
        btnText: 'Read My Words! 💝 (2/4)',
        hintText: 'Hold your breath, Leethiyal... ✨',
      },
      {
        x: -75,
        y: -32,
        btnText: 'One More Touch! 💌 (3/4)',
        hintText: 'Almost opened... 1 tap left! 💝',
      },
      {
        x: 0,
        y: 0,
        btnText: 'Letter Unveiled! 💝',
        hintText: 'The letter is yours, my Queen! ✨',
      },
    ],
    onUnlock: () => {
      handleOpenLetter();
    },
  });

  // Screen 6: Continue after Letter
  setupDodgeButton({
    buttonId: 'btn-screen6-next',
    hintId: 'dodge-hint-screen6',
    initialText: 'Continue ✨',
    steps: [
      {
        x: 85,
        y: 32,
        btnText: 'Sweet Surprise! 💝 (1/4)',
        hintText: 'Rose petals are waiting to fall for you! 🌸',
      },
      {
        x: -80,
        y: -35,
        btnText: 'Over Here, Love! ✨ (2/4)',
        hintText: 'You are forever my favorite person! 💝',
      },
      {
        x: -75,
        y: 32,
        btnText: '1 More Tap! 💝 (3/4)',
        hintText: 'Ready for petals of starlight? ✨',
      },
      {
        x: 0,
        y: 0,
        btnText: 'Petals Falling... 🌸',
        hintText: 'Entering the starlight petal shower! ✨',
      },
    ],
    onUnlock: () => {
      showScreen(7);
    },
  });

  // Screen 7: Celebrate Button
  setupDodgeButton({
    buttonId: 'btn-screen7-next',
    hintId: 'dodge-hint-screen7',
    initialText: 'Celebrate 🎂',
    steps: [
      {
        x: 85,
        y: -36,
        btnText: 'Grand Finale! 🎂 (1/4)',
        hintText: 'The biggest celebration is loading for you! 💝',
      },
      {
        x: -85,
        y: 34,
        btnText: 'Are You Ready? ✨ (2/4)',
        hintText: 'Happy Birthday to the girl of my dreams! 💝',
      },
      {
        x: -75,
        y: -32,
        btnText: 'Final Countdown! 💝 (3/4)',
        hintText: 'One tap for the grand confetti explosion! 🎂',
      },
      {
        x: 0,
        y: 0,
        btnText: 'CELEBRATING MY QUEEN! 💝',
        hintText: 'Here comes the grand celebration! ✨',
      },
    ],
    onUnlock: () => {
      showScreen(8);
    },
  });

  // Screen 8: Replay Experience
  setupDodgeButton({
    buttonId: 'btn-replay',
    hintId: 'dodge-hint-replay',
    initialText: 'Experience Again ↺',
    steps: [
      {
        x: -78,
        y: -30,
        btnText: 'Once More? 💝 (1/4)',
        hintText: 'Want to experience our love story again? ✨',
      },
      {
        x: 82,
        y: 30,
        btnText: 'Relive The Magic! ✨ (2/4)',
        hintText: 'Every second with you is a blessing! 💝',
      },
      {
        x: 72,
        y: -28,
        btnText: 'One Last Tap! 💝 (3/4)',
        hintText: 'Starting from the beginning for you! 💝',
      },
      {
        x: 0,
        y: 0,
        btnText: 'Restarting Magic... 💝',
        hintText: 'Going back to the beginning! ✨',
      },
    ],
    onUnlock: () => {
      resetCelebration();
      showScreen(1);
    },
  });
}

/* ===================================================
   SCREEN 1: CINEMATIC INTRO
   =================================================== */
function initScreen1() {
  spawnHeartBurst(6);
}

/* ===================================================
   SCREEN 2: TYPEWRITER LOVE MESSAGE
   =================================================== */
function startTypewriterSequence() {
  const lines = [
    'In a world full of billions of souls...',
    'My heart chose only you, Leethiyal.',
    'Every smile of yours is my favorite poetry,',
    'And today, I celebrate the love of my life. 💝',
  ];

  const lineElements = [
    document.getElementById('typewriter-line-1'),
    document.getElementById('typewriter-line-2'),
    document.getElementById('typewriter-line-3'),
    document.getElementById('typewriter-line-4'),
  ];

  const continueBtn = document.getElementById('btn-screen2-next');
  if (continueBtn) {
    continueBtn.style.display = 'none';
  }

  // Reset lines text
  lineElements.forEach((el) => {
    if (el) el.textContent = '';
  });

  let currentLineIndex = 0;
  let currentCharIndex = 0;
  const speed = 40; // ms per character

  function typeChar() {
    if (currentLineIndex < lines.length) {
      const currentTarget = lineElements[currentLineIndex];
      const targetText = lines[currentLineIndex];

      if (currentCharIndex < targetText.length) {
        if (currentTarget) {
          currentTarget.textContent += targetText.charAt(currentCharIndex);
        }
        currentCharIndex++;
        setTimeout(typeChar, speed);
      } else {
        // Line finished, pause briefly before next line
        currentLineIndex++;
        currentCharIndex = 0;
        setTimeout(typeChar, 420);
      }
    } else {
      // All typing completed
      if (continueBtn) {
        continueBtn.style.display = 'inline-flex';
        continueBtn.style.opacity = '0';
        continueBtn.style.transform = 'translateY(10px)';
        continueBtn.style.transition = 'all 0.8s ease';
        setTimeout(() => {
          continueBtn.style.opacity = '1';
          continueBtn.style.transform = 'translateY(0)';
        }, 100);
      }
      spawnHeartBurst(6);
    }
  }

  setTimeout(typeChar, 400);
}

/* ===================================================
   SCREEN 3: LOVE SPARK TRACKING GAME & CAKE UNLOCK
   =================================================== */
function initScreen3SparkQuest() {
  const cakeGameStage = document.getElementById('cake-game-stage');
  const cakeCelebrationStage = document.getElementById('cake-celebration-stage');
  const skipBtn = document.getElementById('btn-skip-spark-game');

  if (isSparkGameCompleted) {
    if (cakeGameStage) cakeGameStage.style.display = 'none';
    if (cakeCelebrationStage) cakeCelebrationStage.style.display = 'block';
    return;
  }

  if (cakeGameStage) {
    cakeGameStage.style.display = 'flex';
    cakeGameStage.style.opacity = '1';
    cakeGameStage.style.transform = 'translateY(0)';
  }
  if (cakeCelebrationStage) {
    cakeCelebrationStage.style.display = 'none';
  }

  const sparksContainer = document.getElementById('sparks-container');
  const numCollectedEl = document.getElementById('sparks-collected-num');
  const progressBar = document.getElementById('spark-progress-bar');
  const whisperMsg = document.getElementById('spark-whisper-msg');
  const statusIcon = document.getElementById('spark-status-icon');

  sparksCollected = 0;
  if (numCollectedEl) numCollectedEl.textContent = '0';
  if (progressBar) progressBar.style.width = '0%';
  if (statusIcon) {
    statusIcon.textContent = '🕯️ Locked';
    statusIcon.classList.remove('unlocked');
  }
  if (whisperMsg) {
    whisperMsg.textContent = 'Tap the drifting sparks to ignite the royal candles... ✨';
  }

  if (skipBtn) {
    skipBtn.onclick = () => {
      unlockCakeCelebration(true);
    };
  }

  if (!sparksContainer) return;
  sparksContainer.innerHTML = '';

  const sparksData = [
    { emoji: '✨', top: 24, left: 26, floatDur: 4.2, whisper: 'Spark 1: Your laughter lights up the sky! ✨' },
    { emoji: '💝', top: 28, left: 74, floatDur: 3.8, whisper: 'Spark 2: Your sweetest smile caught! 💝' },
    { emoji: '🌸', top: 52, left: 48, floatDur: 4.6, whisper: 'Spark 3: Your pure kindness warms my soul! 🌸' },
    { emoji: '👑', top: 74, left: 26, floatDur: 3.5, whisper: 'Spark 4: Queen of my heart crown activated! 👑' },
    { emoji: '🌟', top: 72, left: 74, floatDur: 4.0, whisper: 'All 5 Sparks Tracked! Unlocking Your Birthday Cake... 🎂✨' },
  ];

  sparksData.forEach((data, index) => {
    const sparkEl = document.createElement('div');
    sparkEl.className = 'target-spark';
    sparkEl.style.top = `${data.top}%`;
    sparkEl.style.left = `${data.left}%`;
    sparkEl.style.animation = `sparkDrift ${data.floatDur}s infinite ease-in-out alternate`;
    sparkEl.setAttribute('role', 'button');
    sparkEl.setAttribute('aria-label', `Love spark ${index + 1}`);

    sparkEl.innerHTML = `
      <div class="target-spark-halo" aria-hidden="true"></div>
      <div class="target-spark-inner">${data.emoji}</div>
    `;

    const handleSparkInteraction = (e) => {
      e.stopPropagation();
      collectSpark(sparkEl, data);
    };

    sparkEl.addEventListener('click', handleSparkInteraction);
    sparkEl.addEventListener('touchstart', handleSparkInteraction, { passive: true });

    sparksContainer.appendChild(sparkEl);
  });
}

function collectSpark(sparkEl, data) {
  if (sparkEl.classList.contains('popping')) return;
  sparkEl.classList.add('popping');

  sparksCollected++;
  const numCollectedEl = document.getElementById('sparks-collected-num');
  const progressBar = document.getElementById('spark-progress-bar');
  const whisperMsg = document.getElementById('spark-whisper-msg');
  const statusIcon = document.getElementById('spark-status-icon');

  if (numCollectedEl) numCollectedEl.textContent = sparksCollected;
  if (progressBar) progressBar.style.width = `${(sparksCollected / 5) * 100}%`;
  if (whisperMsg) whisperMsg.textContent = data.whisper;

  spawnHeartBurst(5);

  setTimeout(() => {
    sparkEl.remove();
  }, 280);

  if (sparksCollected >= 5) {
    if (statusIcon) {
      statusIcon.textContent = '✨ Unlocked!';
      statusIcon.classList.add('unlocked');
    }
    launchConfetti(45);
    spawnHeartBurst(12);

    setTimeout(() => {
      unlockCakeCelebration(false);
    }, 750);
  }
}

function unlockCakeCelebration(immediate = false) {
  isSparkGameCompleted = true;
  const cakeGameStage = document.getElementById('cake-game-stage');
  const cakeCelebrationStage = document.getElementById('cake-celebration-stage');

  if (!cakeGameStage || !cakeCelebrationStage) return;

  if (immediate) {
    cakeGameStage.style.display = 'none';
    cakeCelebrationStage.style.display = 'block';
  } else {
    cakeGameStage.style.transition = 'all 0.6s ease';
    cakeGameStage.style.opacity = '0';
    cakeGameStage.style.transform = 'scale(0.92)';

    setTimeout(() => {
      cakeGameStage.style.display = 'none';
      cakeCelebrationStage.style.display = 'block';
      launchConfetti(65);
      spawnHeartBurst(10);
    }, 550);
  }
}

/* ===================================================
   SCREEN 3: BIRTHDAY CAKE & CANDLE BLOWING
   =================================================== */
function handleBlowCandle() {
  if (isCandleBlown) return;
  isCandleBlown = true;

  const flames = document.querySelectorAll('.candle-flame');
  const puffs = document.querySelectorAll('.smoke-puff');
  const wishStatus = document.getElementById('wish-status');
  const btnBlow = document.getElementById('btn-blow-candle');
  const btnNext = document.getElementById('btn-screen3-next');
  const hint3 = document.getElementById('dodge-hint-screen3');
  const candleHalo = document.getElementById('candle-halo');
  const jimikkiPresentation = document.getElementById('jimikki-presentation');

  // Extinguish candle halo glow
  if (candleHalo) {
    candleHalo.classList.add('extinguished');
  }

  // Flicker & extinguish flames
  flames.forEach((flame) => {
    flame.classList.add('extinguished');
  });

  // Animate smoke rise
  puffs.forEach((puff) => {
    puff.classList.add('rise');
  });

  // Confetti & Golden particle burst
  launchConfetti(95);
  spawnHeartBurst(16);
  spawnRosePetals(10);

  // Update status text
  if (wishStatus) {
    wishStatus.textContent = 'Happy Birthday, My Queen Leethiyal! 🎂✨';
    wishStatus.style.opacity = '0';
    wishStatus.style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
      wishStatus.style.opacity = '1';
    }, 150);
  }

  // Reveal Royal Jimikki Kammal Gift Presentation
  if (jimikkiPresentation) {
    jimikkiPresentation.style.display = 'flex';
    jimikkiPresentation.style.opacity = '0';
    jimikkiPresentation.style.transform = 'translateY(24px) scale(0.92)';
    jimikkiPresentation.style.transition = 'all 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => {
      jimikkiPresentation.style.opacity = '1';
      jimikkiPresentation.style.transform = 'translateY(0) scale(1)';
      launchConfetti(45);
      spawnHeartBurst(8);
    }, 250);
  }

  // Swap action buttons
  if (btnBlow) {
    btnBlow.style.display = 'none';
  }
  if (hint3) {
    hint3.textContent = '';
  }
  if (btnNext) {
    btnNext.style.display = 'inline-flex';
    btnNext.style.opacity = '0';
    btnNext.style.transform = 'scale(0.95)';
    btnNext.style.transition = 'all 0.6s ease';
    setTimeout(() => {
      btnNext.style.opacity = '1';
      btnNext.style.transform = 'scale(1)';
    }, 450);
  }
}

/* ===================================================
   SCREEN 3: INTERACTIVE ROYAL JIMIKKI KAMPAL JINGLE
   =================================================== */
function initJimikkiInteractions() {
  const jimikkiCase = document.getElementById('jimikki-case');
  if (!jimikkiCase) return;

  function jingleEarrings(e) {
    if (e) e.stopPropagation();
    jimikkiCase.classList.add('ringing');
    spawnHeartBurst(6);
    launchConfetti(30);

    setTimeout(() => {
      jimikkiCase.classList.remove('ringing');
    }, 1200);
  }

  jimikkiCase.addEventListener('click', jingleEarrings);
  jimikkiCase.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      jingleEarrings(e);
    }
  });
}

/* ===================================================
   SCREEN 5: CINEMATIC MESSAGE
   =================================================== */
function startCinematicMessage() {
  const line1 = document.getElementById('cinema-line-1');
  const line2 = document.getElementById('cinema-line-2');
  const line3 = document.getElementById('cinema-line-3');
  const btn = document.getElementById('btn-screen5-next');

  if (btn) btn.style.display = 'none';

  setTimeout(() => {
    if (line1) line1.classList.add('visible');
  }, 400);

  setTimeout(() => {
    if (line2) line2.classList.add('visible');
    spawnHeartBurst(5);
  }, 1600);

  setTimeout(() => {
    if (line3) line3.classList.add('visible');
    if (btn) {
      btn.style.display = 'inline-flex';
      btn.style.opacity = '0';
      btn.style.transition = 'opacity 0.8s ease';
      setTimeout(() => {
        btn.style.opacity = '1';
      }, 100);
    }
  }, 3200);
}

/* ===================================================
   SCREEN 6: SECRET LETTER
   =================================================== */
function handleOpenLetter() {
  if (isLetterOpened) return;
  isLetterOpened = true;

  const wrapper = document.querySelector('.envelope-wrapper');
  const modal = document.querySelector('.full-letter-modal');
  const btnOpen = document.getElementById('btn-open-letter');
  const btnNext = document.getElementById('btn-screen6-next');
  const hintOpen = document.getElementById('dodge-hint-open-letter');

  if (wrapper) {
    wrapper.classList.add('open');
  }

  // Rose petals & floating hearts appear
  spawnRosePetals(18);
  spawnHeartBurst(14);
  launchConfetti(45);

  // Smoothly reveal full modal letter
  setTimeout(() => {
    if (modal) {
      modal.classList.add('active');
    }
  }, 700);

  if (btnOpen) {
    btnOpen.style.display = 'none';
  }
  if (hintOpen) {
    hintOpen.textContent = '';
  }
  if (btnNext) {
    btnNext.style.display = 'inline-flex';
  }
}

/* ===================================================
   SCREEN 7: ROSE PETAL STORM
   =================================================== */
function startRosePetalStorm() {
  spawnRosePetals(25);
  spawnHeartBurst(10);
}

/* ===================================================
   SCREEN 8: LOVE KEYS MINI-GAME & RING UNLOCK
   =================================================== */
function initRingUnlockGame() {
  const gameStage = document.getElementById('ring-unlock-game');
  const keyButtons = document.querySelectorAll('.love-key-item');
  const lockBar = document.getElementById('ring-lock-bar');
  const lockStatus = document.getElementById('ring-lock-status');
  const quickUnlockBtn = document.getElementById('btn-quick-unlock-ring');

  const keyMessages = [
    'Key 1 of 3: You have my deepest trust & devotion, Leethiyal! 💝',
    'Key 2 of 3: You bring endless joy and sunshine into my world! 🌸',
    'Key 3 of 3: All 3 keys inserted! Royal box unlocked! 💖✨',
  ];

  keysCollected = 0;
  isRingBoxUnlocked = false;

  keyButtons.forEach((btn, index) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      if (btn.classList.contains('used')) return;
      btn.classList.add('used');
      keysCollected++;

      const pct = (keysCollected / 3) * 100;
      if (lockBar) lockBar.style.width = `${pct}%`;
      if (lockStatus) lockStatus.textContent = keyMessages[keysCollected - 1];

      spawnHeartBurst(5);

      if (keysCollected >= 3) {
        unlockRoyalRingBox();
      }
    };
  });

  if (quickUnlockBtn) {
    quickUnlockBtn.onclick = (e) => {
      e.stopPropagation();
      keyButtons.forEach((b) => b.classList.add('used'));
      if (lockBar) lockBar.style.width = '100%';
      unlockRoyalRingBox();
    };
  }
}

function unlockRoyalRingBox() {
  isRingBoxUnlocked = true;
  const gameStage = document.getElementById('ring-unlock-game');
  const ringBox = document.getElementById('heart-ring-box');
  const ringInstruction = document.getElementById('ring-box-instruction');
  const lidLockCrest = document.getElementById('lid-lock-crest');

  if (lidLockCrest) lidLockCrest.textContent = '🔓';
  launchConfetti(70);
  spawnHeartBurst(14);
  spawnRosePetals(10);

  setTimeout(() => {
    if (gameStage) {
      gameStage.style.transition = 'all 0.5s ease';
      gameStage.style.opacity = '0';
      gameStage.style.transform = 'scale(0.92)';
      setTimeout(() => {
        gameStage.style.display = 'none';
      }, 500);
    }

    if (ringInstruction) {
      ringInstruction.style.display = 'block';
      ringInstruction.textContent = '✦ Royal Box Unlocked! Tap the heart to reveal the ring 💍 ✦';
    }

    if (ringBox) {
      ringBox.classList.remove('locked');
      // Gracefully open the box to unveil the ring
      setTimeout(() => {
        openHeartRingBox();
      }, 350);
    }
  }, 600);
}

/* ===================================================
   SCREEN 8: INTERACTIVE ROYAL HEART RING BOX
   =================================================== */
function initHeartRingBox() {
  const ringBox = document.getElementById('heart-ring-box');
  const instruction = document.getElementById('ring-box-instruction');

  if (!ringBox) return;

  function handleRingBoxClick(e) {
    if (e) e.stopPropagation();

    // If still locked by the 3 love keys game
    if (!isRingBoxUnlocked) {
      const lockStatus = document.getElementById('ring-lock-status');
      if (lockStatus) {
        lockStatus.textContent = 'Tap all 3 golden keys above to unlock the box first! 🔒✨';
      }
      ringBox.style.animation = 'none';
      requestAnimationFrame(() => {
        ringBox.style.animation = 'lockPulse 0.4s ease-in-out';
      });
      return;
    }

    // Toggle open / closed
    if (isRingBoxOpened) {
      closeHeartRingBox();
    } else {
      openHeartRingBox();
    }
  }

  ringBox.addEventListener('click', handleRingBoxClick);
  ringBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRingBoxClick(e);
    }
  });

  if (instruction) {
    instruction.addEventListener('click', handleRingBoxClick);
    instruction.style.cursor = 'pointer';
  }
}

function openHeartRingBox() {
  const ringBox = document.getElementById('heart-ring-box');
  const instruction = document.getElementById('ring-box-instruction');
  const caption = document.getElementById('ring-reveal-caption');
  const wrapper = document.querySelector('.royal-ring-box-wrapper');
  const diamondPresentation = document.getElementById('diamond-ring-presentation');

  if (!ringBox) return;

  isRingBoxOpened = true;
  ringBox.classList.add('opened');
  if (diamondPresentation) {
    diamondPresentation.style.display = 'flex';
  }
  if (wrapper) wrapper.classList.add('show-caption');
  if (instruction) instruction.textContent = '✦ Tap again to close the box 💍 ✦';
  if (caption) caption.textContent = 'A promise of forever for my Queen... Leethiyal, will you stay by my side forever? 💍💖';

  launchConfetti(90);
  spawnHeartBurst(16);
  spawnRosePetals(14);
}

function closeHeartRingBox() {
  const ringBox = document.getElementById('heart-ring-box');
  const instruction = document.getElementById('ring-box-instruction');
  const wrapper = document.querySelector('.royal-ring-box-wrapper');
  const diamondPresentation = document.getElementById('diamond-ring-presentation');

  if (!ringBox) return;

  isRingBoxOpened = false;
  ringBox.classList.remove('opened');
  if (wrapper) wrapper.classList.remove('show-caption');
  if (instruction) instruction.textContent = '✦ Box Unlocked! Tap the heart to reveal the ring 💍 ✦';

  setTimeout(() => {
    if (!isRingBoxOpened && diamondPresentation) {
      diamondPresentation.style.display = 'none';
    }
  }, 400);
}

/* ===================================================
   SCREEN 8: FINAL CELEBRATION
   =================================================== */
function startFinalCelebration() {
  launchConfetti(140);
  spawnHeartBurst(20);
  spawnRosePetals(20);

  // NO auto-reveal! Ring box stays securely locked until the user plays the key game.

  // Recurring celebratory bursts
  const celebrationInterval = setInterval(() => {
    if (currentScreenIndex === 8) {
      launchConfetti(45);
      spawnHeartBurst(4);
    } else {
      clearInterval(celebrationInterval);
    }
  }, 3200);
}

function resetCelebration() {
  isLetterOpened = false;
  isCandleBlown = false;
  isSparkGameCompleted = false;
  sparksCollected = 0;
  isRingBoxOpened = false;
  isRingBoxUnlocked = false;
  keysCollected = 0;

  // Reset Ring Mini-Game
  const gameStage = document.getElementById('ring-unlock-game');
  const keyButtons = document.querySelectorAll('.love-key-item');
  const lockBar = document.getElementById('ring-lock-bar');
  const lockStatus = document.getElementById('ring-lock-status');
  const lidLockCrest = document.getElementById('lid-lock-crest');

  if (gameStage) {
    gameStage.style.display = 'flex';
    gameStage.style.opacity = '1';
    gameStage.style.transform = 'scale(1)';
  }
  if (keyButtons) {
    keyButtons.forEach((b) => b.classList.remove('used'));
  }
  if (lockBar) lockBar.style.width = '0%';
  if (lockStatus) lockStatus.textContent = 'Tap the 3 keys above to unlock the box... 🔒';
  if (lidLockCrest) lidLockCrest.textContent = '🔒';

  // Reset Heart Ring Box
  const ringBox = document.getElementById('heart-ring-box');
  const ringInstruction = document.getElementById('ring-box-instruction');
  const ringWrapper = document.querySelector('.royal-ring-box-wrapper');
  const diamondPresentation = document.getElementById('diamond-ring-presentation');

  if (ringBox) {
    ringBox.classList.remove('opened');
    ringBox.classList.add('locked');
  }
  if (diamondPresentation) diamondPresentation.style.display = 'none';
  if (ringWrapper) ringWrapper.classList.remove('show-caption');
  if (ringInstruction) ringInstruction.style.display = 'none';

  // Reset candle & Jimikki Gift
  const flames = document.querySelectorAll('.candle-flame');
  const puffs = document.querySelectorAll('.smoke-puff');
  const wishStatus = document.getElementById('wish-status');
  const btnBlow = document.getElementById('btn-blow-candle');
  const btnNext = document.getElementById('btn-screen3-next');
  const candleHalo = document.getElementById('candle-halo');
  const jimikkiPresentation = document.getElementById('jimikki-presentation');

  if (jimikkiPresentation) jimikkiPresentation.style.display = 'none';
  if (candleHalo) candleHalo.classList.remove('extinguished');
  flames.forEach((flame) => flame.classList.remove('extinguished'));
  puffs.forEach((puff) => puff.classList.remove('rise'));
  if (wishStatus) wishStatus.textContent = 'Make a wish, my love... ✨';
  if (btnBlow) btnBlow.style.display = 'inline-flex';
  if (btnNext) btnNext.style.display = 'none';

  // Reset letter
  const wrapper = document.querySelector('.envelope-wrapper');
  const modal = document.querySelector('.full-letter-modal');
  const btnOpen = document.getElementById('btn-open-letter');
  const btnNextLetter = document.getElementById('btn-screen6-next');

  if (wrapper) wrapper.classList.remove('open');
  if (modal) modal.classList.remove('active');
  if (btnOpen) btnOpen.style.display = 'inline-flex';
  if (btnNextLetter) btnNextLetter.style.display = 'none';

  // Reset Prologue Screen 0
  const whyBtnWrapper = document.getElementById('why-btn-wrapper');
  const answerCard = document.getElementById('prologue-answer-card');
  const calCard = document.getElementById('prologue-calendar-card');
  const calTag = document.getElementById('cal-tag-queen');

  if (whyBtnWrapper) whyBtnWrapper.style.display = 'block';
  if (answerCard) answerCard.style.display = 'none';
  if (calCard) calCard.style.boxShadow = '';
  if (calTag) {
    calTag.textContent = '🔒 Tap button 2 times to reveal...';
    calTag.classList.add('cal-tag-locked');
    calTag.classList.remove('revealed');
  }

  // Reset all registered dodge buttons
  dodgeButtonsRegistry.forEach((resetFn) => resetFn());

  // Reset journey progress & return to Screen 0
  showScreen(0);
  updateRoyalProgress(0);
}

/* ===================================================
   INTERACTIVE FAIRY DUST SPARKLE TRAIL
   Generates glittering golden fairy stars on touch/cursor
   =================================================== */
function initInteractiveSparkleTrail() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const sparkles = [];
  let lastSpawn = 0;

  function spawnSparkle(x, y) {
    const count = 3;
    for (let i = 0; i < count; i++) {
      sparkles.push({
        x: x + (Math.random() - 0.5) * 15,
        y: y + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 2.2,
        vy: -Math.random() * 2.5 - 0.5,
        size: Math.random() * 3.5 + 1.8,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.015,
        color: Math.random() > 0.35 ? '#f6c86e' : '#f48fb1',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
      });
    }
  }

  function handlePointer(e) {
    const now = Date.now();
    if (now - lastSpawn < 30) return; // throttle for 60fps smoothness
    lastSpawn = now;

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    if (clientX !== undefined && clientY !== undefined) {
      spawnSparkle(clientX, clientY);
    }
  }

  window.addEventListener('pointermove', handlePointer, { passive: true });
  window.addEventListener('touchmove', handlePointer, { passive: true });
  window.addEventListener('pointerdown', (e) => {
    spawnSparkle(e.clientX, e.clientY);
  }, { passive: true });

  function renderSparkles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.03; // subtle gravity
      s.alpha -= s.decay;
      s.rotation += s.rotSpeed;

      if (s.alpha <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.globalAlpha = Math.max(0, s.alpha);

      // Draw 4-point golden fairy star
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      const r = s.size;
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.fill();

      ctx.restore();
    }

    requestAnimationFrame(renderSparkles);
  }

  renderSparkles();
}

/* ===================================================
   FLOATING 💝 HEARTS SYSTEM
   Strict Rule: ONLY 💝 emoji is used!
   =================================================== */
function startFloatingHeartsLoop() {
  setInterval(() => {
    // Only spawn ambient hearts occasionally if on screen
    if (document.visibilityState === 'visible') {
      createSingleFloatingHeart();
    }
  }, 2200);
}

function createSingleFloatingHeart(customLeft) {
  const container = document.getElementById('floating-hearts-container');
  if (!container) return;

  // Cap number of hearts on DOM for performance
  if (container.children.length > 25) {
    container.removeChild(container.firstChild);
  }

  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = '💝'; // STRICT RULE: Only 💝

  const leftPos = customLeft !== undefined ? customLeft : Math.random() * 92 + 4;
  const size = Math.random() * 1.2 + 0.9; // 0.9rem to 2.1rem
  const duration = Math.random() * 3 + 5; // 5s to 8s
  const delay = Math.random() * 0.4;

  heart.style.left = `${leftPos}vw`;
  heart.style.fontSize = `${size}rem`;
  heart.style.animationDuration = `${duration}s`;
  heart.style.animationDelay = `${delay}s`;

  container.appendChild(heart);

  heart.addEventListener('animationend', () => {
    if (heart.parentNode === container) {
      container.removeChild(heart);
    }
  });
}

function spawnHeartBurst(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const randomLeft = Math.random() * 88 + 6;
      createSingleFloatingHeart(randomLeft);
    }, i * 80);
  }
}

/* ===================================================
   ROSE PETALS SYSTEM (Pure CSS / HTML Shapes)
   =================================================== */
function spawnRosePetals(count) {
  const container = document.getElementById('rose-petals-container');
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'rose-petal';

    const left = Math.random() * 95;
    const duration = Math.random() * 4 + 6; // 6s to 10s
    const size = Math.random() * 8 + 16; // 16px to 24px
    const initialRot = Math.random() * 360;

    petal.style.left = `${left}vw`;
    petal.style.bottom = `-30px`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.3}px`;
    petal.style.transform = `rotate(${initialRot}deg)`;
    petal.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    petal.style.opacity = `${Math.random() * 0.4 + 0.5}`;

    container.appendChild(petal);

    // Trigger movement
    requestAnimationFrame(() => {
      setTimeout(() => {
        petal.style.transform = `translateY(-110vh) translateX(${(Math.random() - 0.5) * 120}px) rotate(${initialRot + 360}deg)`;
        petal.style.opacity = '0';
      }, i * 70);
    });

    setTimeout(() => {
      if (petal.parentNode === container) {
        container.removeChild(petal);
      }
    }, (duration + 1) * 1000);
  }
}

/* ===================================================
   BACKGROUND STARS & GOLDEN DUST CANVAS
   =================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width < 768 ? 45 : 85, 90);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      isGold: Math.random() > 0.4,
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      p.alpha += p.twinkleSpeed * p.twinkleDir;
      if (p.alpha > 0.85) p.twinkleDir = -1;
      if (p.alpha < 0.15) p.twinkleDir = 1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      if (p.isGold) {
        ctx.fillStyle = `rgba(246, 200, 110, ${p.alpha})`;
        ctx.shadowColor = 'rgba(246, 200, 110, 0.4)';
        ctx.shadowBlur = 4;
      } else {
        ctx.fillStyle = `rgba(255, 230, 240, ${p.alpha})`;
        ctx.shadowColor = 'rgba(255, 182, 193, 0.4)';
        ctx.shadowBlur = 2;
      }

      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ===================================================
   LIGHTWEIGHT HIGH-PERFORMANCE CONFETTI
   =================================================== */
let confettiPieces = [];
let confettiCtx = null;
let confettiAnimating = false;

function initConfettiCanvas() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  confettiCtx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function launchConfetti(count) {
  if (!confettiCtx) return;

  const canvas = document.getElementById('confetti-canvas');
  const width = canvas.width;
  const height = canvas.height;

  const colors = [
    '#f6c86e', // Gold
    '#f48fb1', // Soft pink
    '#ffb6c1', // Light pink
    '#ffe29a', // Champagne
    '#e0aaff', // Violet highlight
    '#ffffff', // Silver white
  ];

  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: width * 0.5 + (Math.random() - 0.5) * 80,
      y: height * 0.55 + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 12 - 5,
      size: Math.random() * 7 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.28,
      drag: 0.98,
      alpha: 1,
    });
  }

  if (!confettiAnimating) {
    confettiAnimating = true;
    animateConfetti();
  }
}

function animateConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas || !confettiCtx) return;

  confettiCtx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = confettiPieces.length - 1; i >= 0; i--) {
    const c = confettiPieces[i];

    c.vx *= c.drag;
    c.vy *= c.drag;
    c.vy += c.gravity;
    c.x += c.vx;
    c.y += c.vy;
    c.rotation += c.rotationSpeed;

    if (c.y > canvas.height + 20) {
      c.alpha -= 0.05;
    }

    if (c.alpha <= 0) {
      confettiPieces.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.translate(c.x, c.y);
    confettiCtx.rotate((c.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = Math.max(0, c.alpha);
    confettiCtx.fillStyle = c.color;
    confettiCtx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
    confettiCtx.restore();
  }

  if (confettiPieces.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiAnimating = false;
    confettiCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
