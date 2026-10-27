(() => {
  /* ============================= */
  /* Code Breaker Configuration    */
  /* ============================= */

  const CODE_LENGTH = 4;

  /* ============================= */
  /* DOM References                */
  /* ============================= */

  const puzzleElement = document.getElementById("codebreakerPuzzle");

  const inputsContainer = document.getElementById("codebreakerInputs");

  const digitInputs = [...document.querySelectorAll(".codebreaker-digit")];

  const submitButton = document.getElementById("submitCodebreakerBtn");

  const clearButton = document.getElementById("clearCodebreakerBtn");

  const historyList = document.getElementById("codebreakerHistoryList");

  const messageElement = document.getElementById("codebreakerMessage");

  const titleElement = document.getElementById("currentPuzzleTitle");

  const descriptionElement = document.getElementById(
    "currentPuzzleDescription",
  );

  /* ============================= */
  /* Active State                  */
  /* ============================= */

  let activeContext = null;

  let completionPending = false;

  let completionTimer = null;

  /* ============================= */
  /* Generate Puzzle               */
  /* ============================= */

  function generatePuzzle() {
    const digits = shuffleArray([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);

    const code = digits.slice(0, CODE_LENGTH).join("");

    return {
      type: "codebreaker",

      code,

      guesses: [],

      solved: false,
    };
  }

  /* ============================= */
  /* Render                        */
  /* ============================= */

  function render(context) {
    clearCompletionTimer();

    activeContext = context;

    completionPending = false;

    const { gameState, saveGame } = context;

    puzzleElement.classList.remove("hidden");

    titleElement.textContent = "Code Breaker";

    descriptionElement.textContent =
      "Use each attempt's feedback to crack the hidden four-digit evidence code.";

    if (
      !gameState.currentPuzzleData ||
      gameState.currentPuzzleData.type !== "codebreaker"
    ) {
      gameState.currentPuzzleData = generatePuzzle();

      saveGame(gameState);
    }

    ensureCompatibleSave(gameState);

    clearInputs();

    messageElement.textContent = "";

    submitButton.disabled = false;

    clearButton.disabled = false;

    renderHistory(gameState);
  }

  /* ============================= */
  /* Save Compatibility            */
  /* ============================= */

  function ensureCompatibleSave(gameState) {
    const puzzleData = gameState.currentPuzzleData;

    if (!Array.isArray(puzzleData.guesses)) {
      puzzleData.guesses = [];
    }

    if (typeof puzzleData.solved !== "boolean") {
      puzzleData.solved = false;
    }

    activeContext.saveGame(gameState);
  }

  /* ============================= */
  /* Hide                          */
  /* ============================= */

  function hide() {
    clearCompletionTimer();

    puzzleElement.classList.add("hidden");

    completionPending = false;

    messageElement.textContent = "";

    clearInputs();

    activeContext = null;
  }

  /* ============================= */
  /* Input Handling                */
  /* ============================= */

  function handleDigitInput(event, index) {
    const input = event.currentTarget;

    /*
      Remove anything except digits.
    */

    input.value = input.value.replace(/\D/g, "");

    if (input.value.length > 1) {
      input.value = input.value.slice(-1);
    }

    /*
      Automatically advance after
      entering a digit.
    */

    if (input.value && index < digitInputs.length - 1) {
      digitInputs[index + 1].focus();
    }

    messageElement.textContent = "";
  }

  function handleDigitKeydown(event, index) {
    /*
      Backspace on an empty input
      moves back one position.
    */

    if (event.key === "Backspace" && !event.currentTarget.value && index > 0) {
      digitInputs[index - 1].focus();

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      submitGuess();
    }
  }

  /* ============================= */
  /* Submit Guess                  */
  /* ============================= */

  function submitGuess() {
    if (!activeContext || completionPending) {
      return;
    }

    const { gameState, saveGame, completeCurrentClue } = activeContext;

    const puzzleData = gameState.currentPuzzleData;

    const guess = digitInputs.map((input) => input.value).join("");

    /* Must contain four digits. */

    if (guess.length !== CODE_LENGTH) {
      messageElement.textContent =
        "Enter all four digits before testing the code.";

      return;
    }

    /*
      The secret code never repeats
      digits, so neither should guesses.
    */

    if (new Set(guess).size !== CODE_LENGTH) {
      messageElement.textContent = "Each digit can only be used once.";

      return;
    }

    const feedback = evaluateGuess(puzzleData.code, guess);

    puzzleData.guesses.push({
      guess,

      exact: feedback.exact,

      misplaced: feedback.misplaced,
    });

    saveGame(gameState);

    renderHistory(gameState);

    if (feedback.exact === CODE_LENGTH) {
      puzzleData.solved = true;

      saveGame(gameState);

      completionPending = true;

      submitButton.disabled = true;

      clearButton.disabled = true;

      digitInputs.forEach((input) => {
        input.disabled = true;
      });

      messageElement.textContent = "Code cracked. Evidence unlocked.";

      completionTimer = setTimeout(() => {
        if (!activeContext || !completionPending) {
          return;
        }

        completionPending = false;

        completeCurrentClue(gameState);
      }, 800);

      return;
    }

    messageElement.textContent = createFeedbackMessage(feedback);

    clearInputs();

    digitInputs[0].focus();
  }

  /* ============================= */
  /* Evaluate Guess                */
  /* ============================= */

  function evaluateGuess(code, guess) {
    let exact = 0;
    let misplaced = 0;

    for (let index = 0; index < CODE_LENGTH; index++) {
      if (guess[index] === code[index]) {
        exact++;

        continue;
      }

      if (code.includes(guess[index])) {
        misplaced++;
      }
    }

    return {
      exact,
      misplaced,
    };
  }

  /* ============================= */
  /* Feedback Text                 */
  /* ============================= */

  function createFeedbackMessage(feedback) {
    const exactText =
      feedback.exact === 1 ? "1 exact digit" : `${feedback.exact} exact digits`;

    const misplacedText =
      feedback.misplaced === 1
        ? "1 misplaced digit"
        : `${feedback.misplaced} misplaced digits`;

    return `${exactText}, ${misplacedText}.`;
  }

  /* ============================= */
  /* Guess History                 */
  /* ============================= */

  function renderHistory(gameState) {
    historyList.innerHTML = "";

    const guesses = gameState.currentPuzzleData.guesses;

    if (guesses.length === 0) {
      const empty = document.createElement("p");

      empty.textContent = "No attempts recorded yet.";

      empty.style.opacity = "0.55";

      historyList.appendChild(empty);

      return;
    }

    /*
      Show newest guesses first.
    */

    [...guesses].reverse().forEach((attempt) => {
      const entry = document.createElement("div");

      entry.classList.add("codebreaker-history-entry");

      if (attempt.exact === CODE_LENGTH) {
        entry.classList.add("solved");
      }

      const code = document.createElement("div");

      code.classList.add("codebreaker-history-code");

      code.textContent = attempt.guess;

      const feedback = document.createElement("div");

      feedback.classList.add("codebreaker-history-feedback");

      feedback.textContent = createFeedbackMessage(attempt);

      entry.appendChild(code);

      entry.appendChild(feedback);

      historyList.appendChild(entry);
    });
  }

  /* ============================= */
  /* Clear Inputs                  */
  /* ============================= */

  function clearInputs() {
    digitInputs.forEach((input) => {
      input.value = "";

      input.disabled = false;
    });
  }

  /* ============================= */
  /* Timer Cleanup                 */
  /* ============================= */

  function clearCompletionTimer() {
    if (completionTimer) {
      clearTimeout(completionTimer);

      completionTimer = null;
    }
  }

  /* ============================= */
  /* Random Helper                 */
  /* ============================= */

  function shuffleArray(array) {
    const shuffled = [...array];

    for (let index = shuffled.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));

      [shuffled[index], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[index],
      ];
    }

    return shuffled;
  }

  /* ============================= */
  /* Events                        */
  /* ============================= */

  digitInputs.forEach((input, index) => {
    input.addEventListener("input", (event) => {
      handleDigitInput(event, index);
    });

    input.addEventListener("keydown", (event) => {
      handleDigitKeydown(event, index);
    });
  });

  submitButton.addEventListener("click", submitGuess);

  clearButton.addEventListener("click", () => {
    if (completionPending) {
      return;
    }

    clearInputs();

    messageElement.textContent = "";

    digitInputs[0].focus();
  });

  /* ============================= */
  /* Register Puzzle               */
  /* ============================= */

  PuzzleRegistry.codebreaker = {
    render,
    hide,
  };
})();
