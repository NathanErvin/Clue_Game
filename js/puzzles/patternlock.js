(() => {
  /* ============================= */
  /* Pattern Lock Configuration    */
  /* ============================= */

  const TOTAL_ROUNDS = 4;

  const STARTING_LENGTH = 3;

  const symbols = [
    {
      id: "print",
      symbol: "◎",
      name: "Print",
    },

    {
      id: "file",
      symbol: "▤",
      name: "File",
    },

    {
      id: "eye",
      symbol: "◉",
      name: "Witness",
    },

    {
      id: "key",
      symbol: "⌘",
      name: "Key",
    },

    {
      id: "trace",
      symbol: "⌁",
      name: "Trace",
    },

    {
      id: "marker",
      symbol: "◆",
      name: "Marker",
    },

    {
      id: "search",
      symbol: "⌕",
      name: "Search",
    },

    {
      id: "record",
      symbol: "▣",
      name: "Record",
    },

    {
      id: "warning",
      symbol: "!",
      name: "Alert",
    },
  ];

  /* ============================= */
  /* DOM References                */
  /* ============================= */

  const puzzleElement = document.getElementById("patternlockPuzzle");

  const gridElement = document.getElementById("patternlockGrid");

  const roundElement = document.getElementById("patternRound");

  const lengthElement = document.getElementById("patternLength");

  const displayTextElement = document.getElementById("patternDisplayText");

  const startButton = document.getElementById("startPatternBtn");

  const messageElement = document.getElementById("patternlockMessage");

  const titleElement = document.getElementById("currentPuzzleTitle");

  const descriptionElement = document.getElementById(
    "currentPuzzleDescription",
  );

  /* ============================= */
  /* Active State                  */
  /* ============================= */

  let activeContext = null;

  let playerInput = [];

  let acceptingInput = false;

  let showingSequence = false;

  let sequenceTimer = null;

  let completionTimer = null;

  /* ============================= */
  /* Generate Puzzle               */
  /* ============================= */

  function generatePuzzle() {
    return {
      type: "patternlock",

      round: 1,

      sequence: generateSequence(STARTING_LENGTH),

      completed: false,
    };
  }

  function generateSequence(length) {
    const sequence = [];

    for (let index = 0; index < length; index++) {
      sequence.push(getRandomItem(symbols).id);
    }

    return sequence;
  }

  /* ============================= */
  /* Render                        */
  /* ============================= */

  function render(context) {
    clearTimers();

    activeContext = context;

    playerInput = [];

    acceptingInput = false;

    showingSequence = false;

    const { gameState, saveGame } = context;

    puzzleElement.classList.remove("hidden");

    titleElement.textContent = "Pattern Lock";

    descriptionElement.textContent =
      "Memorize the evidence sequence and reproduce it to bypass the security lock.";

    if (
      !gameState.currentPuzzleData ||
      gameState.currentPuzzleData.type !== "patternlock"
    ) {
      gameState.currentPuzzleData = generatePuzzle();

      saveGame(gameState);
    }

    ensureCompatibleSave(gameState);

    renderButtons(gameState);

    updateStatus(gameState);

    displayTextElement.textContent = "Press Start Sequence when ready.";

    messageElement.textContent = "";

    startButton.disabled = false;

    setButtonsEnabled(false);
  }

  /* ============================= */
  /* Compatibility                 */
  /* ============================= */

  function ensureCompatibleSave(gameState) {
    const puzzleData = gameState.currentPuzzleData;

    if (typeof puzzleData.round !== "number") {
      puzzleData.round = 1;
    }

    if (!Array.isArray(puzzleData.sequence)) {
      puzzleData.sequence = generateSequence(STARTING_LENGTH);
    }

    if (typeof puzzleData.completed !== "boolean") {
      puzzleData.completed = false;
    }

    activeContext.saveGame(gameState);
  }

  /* ============================= */
  /* Hide                          */
  /* ============================= */

  function hide() {
    clearTimers();

    puzzleElement.classList.add("hidden");

    playerInput = [];

    acceptingInput = false;

    showingSequence = false;

    messageElement.textContent = "";

    activeContext = null;
  }

  /* ============================= */
  /* Render Buttons                */
  /* ============================= */

  function renderButtons(gameState) {
    gridElement.innerHTML = "";

    symbols.forEach((symbolData) => {
      const button = document.createElement("button");

      button.type = "button";

      button.classList.add("patternlock-button");

      button.dataset.symbolId = symbolData.id;

      button.setAttribute("aria-label", symbolData.name);

      const symbol = document.createElement("span");

      symbol.classList.add("patternlock-symbol");

      symbol.textContent = symbolData.symbol;

      const name = document.createElement("span");

      name.classList.add("patternlock-name");

      name.textContent = symbolData.name;

      button.appendChild(symbol);

      button.appendChild(name);

      button.addEventListener("click", () => {
        handlePatternButton(symbolData.id);
      });

      gridElement.appendChild(button);
    });
  }

  /* ============================= */
  /* Start Sequence                */
  /* ============================= */

  function startSequence() {
    if (!activeContext || showingSequence) {
      return;
    }

    const { gameState } = activeContext;

    playerInput = [];

    acceptingInput = false;

    showingSequence = true;

    startButton.disabled = true;

    setButtonsEnabled(false);

    messageElement.textContent = "";

    displayTextElement.textContent = "Watch carefully...";

    playSequence(gameState.currentPuzzleData.sequence);
  }

  /* ============================= */
  /* Play Sequence                 */
  /* ============================= */

  function playSequence(sequence) {
    let index = 0;

    function showNext() {
      if (!activeContext) {
        return;
      }

      if (index >= sequence.length) {
        showingSequence = false;

        acceptingInput = true;

        startButton.disabled = true;

        setButtonsEnabled(true);

        displayTextElement.textContent = "Your turn. Reproduce the sequence.";

        return;
      }

      const symbolId = sequence[index];

      const button = getButtonById(symbolId);

      if (!button) {
        return;
      }

      button.classList.add("active");

      sequenceTimer = setTimeout(() => {
        button.classList.remove("active");

        index++;

        sequenceTimer = setTimeout(showNext, 260);
      }, 520);
    }

    sequenceTimer = setTimeout(showNext, 400);
  }

  /* ============================= */
  /* Player Input                  */
  /* ============================= */

  function handlePatternButton(symbolId) {
    if (!activeContext || !acceptingInput) {
      return;
    }

    const { gameState } = activeContext;

    const puzzleData = gameState.currentPuzzleData;

    const button = getButtonById(symbolId);

    if (button) {
      flashPlayerButton(button);
    }

    playerInput.push(symbolId);

    const inputIndex = playerInput.length - 1;

    const expected = puzzleData.sequence[inputIndex];

    /* ============================= */
    /* Wrong Input                   */
    /* ============================= */

    if (symbolId !== expected) {
      handleWrongInput(button, gameState);

      return;
    }

    /* ============================= */
    /* Still Entering Sequence       */
    /* ============================= */

    if (playerInput.length < puzzleData.sequence.length) {
      displayTextElement.textContent = `${playerInput.length} of ${puzzleData.sequence.length} entered.`;

      return;
    }

    /* ============================= */
    /* Round Complete                */
    /* ============================= */

    handleRoundComplete(gameState);
  }

  /* ============================= */
  /* Player Flash                  */
  /* ============================= */

  function flashPlayerButton(button) {
    button.classList.add("active");

    setTimeout(() => {
      button.classList.remove("active");
    }, 180);
  }

  /* ============================= */
  /* Wrong Input                   */
  /* ============================= */

  function handleWrongInput(button, gameState) {
    acceptingInput = false;

    setButtonsEnabled(false);

    if (button) {
      button.classList.add("wrong");

      setTimeout(() => {
        button.classList.remove("wrong");
      }, 350);
    }

    playerInput = [];

    displayTextElement.textContent = "Sequence rejected.";

    messageElement.textContent =
      "Incorrect pattern. Watch the sequence again and retry this round.";

    /*
      Wrong answers do not reset
      completed rounds.

      The player only has to replay
      the current sequence.
    */

    sequenceTimer = setTimeout(() => {
      if (!activeContext) {
        return;
      }

      startButton.disabled = false;

      displayTextElement.textContent = "Press Start Sequence to retry.";
    }, 650);
  }

  /* ============================= */
  /* Round Complete                */
  /* ============================= */

  function handleRoundComplete(gameState) {
    const puzzleData = gameState.currentPuzzleData;

    acceptingInput = false;

    setButtonsEnabled(false);

    playerInput = [];

    /* ============================= */
    /* Entire Puzzle Complete        */
    /* ============================= */

    if (puzzleData.round >= TOTAL_ROUNDS) {
      completePatternLock(gameState);

      return;
    }

    messageElement.textContent = "Pattern accepted.";

    displayTextElement.textContent = "Security level cleared.";

    /*
      Advance the round.

      Instead of creating a completely
      unrelated sequence, preserve the
      existing pattern and append one
      new symbol.

      That makes it feel like a true
      progressive memory challenge.
    */

    puzzleData.round++;

    puzzleData.sequence.push(getRandomItem(symbols).id);

    activeContext.saveGame(gameState);

    updateStatus(gameState);

    sequenceTimer = setTimeout(() => {
      if (!activeContext) {
        return;
      }

      messageElement.textContent = "";

      displayTextElement.textContent = "Next security level ready.";

      startButton.disabled = false;
    }, 700);
  }

  /* ============================= */
  /* Complete Puzzle               */
  /* ============================= */

  function completePatternLock(gameState) {
    const puzzleData = gameState.currentPuzzleData;

    puzzleData.completed = true;

    activeContext.saveGame(gameState);

    acceptingInput = false;

    showingSequence = false;

    setButtonsEnabled(false);

    startButton.disabled = true;

    displayTextElement.textContent = "ACCESS GRANTED";

    messageElement.textContent = "Pattern lock bypassed. Evidence unlocked.";

    completionTimer = setTimeout(() => {
      if (!activeContext) {
        return;
      }

      activeContext.completeCurrentClue(gameState);
    }, 900);
  }

  /* ============================= */
  /* Status                        */
  /* ============================= */

  function updateStatus(gameState) {
    const puzzleData = gameState.currentPuzzleData;

    roundElement.textContent = `${puzzleData.round} / ${TOTAL_ROUNDS}`;

    lengthElement.textContent = puzzleData.sequence.length;
  }

  /* ============================= */
  /* Button Helpers                */
  /* ============================= */

  function getButtonById(symbolId) {
    return gridElement.querySelector(`[data-symbol-id="${symbolId}"]`);
  }

  function setButtonsEnabled(enabled) {
    gridElement.querySelectorAll(".patternlock-button").forEach((button) => {
      button.disabled = !enabled;
    });
  }

  /* ============================= */
  /* Timer Cleanup                 */
  /* ============================= */

  function clearTimers() {
    if (sequenceTimer) {
      clearTimeout(sequenceTimer);

      sequenceTimer = null;
    }

    if (completionTimer) {
      clearTimeout(completionTimer);

      completionTimer = null;
    }
  }

  /* ============================= */
  /* Random Helper                 */
  /* ============================= */

  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /* ============================= */
  /* Events                        */
  /* ============================= */

  startButton.addEventListener("click", startSequence);

  /* ============================= */
  /* Register Puzzle               */
  /* ============================= */

  PuzzleRegistry.patternlock = {
    render,
    hide,
  };
})();
