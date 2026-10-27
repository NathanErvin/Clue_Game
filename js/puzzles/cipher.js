(() => {
  /* ============================= */
  /* Cipher Puzzle Configuration   */
  /* ============================= */

  const wordBank = [
    "CLUE",
    "ALIBI",
    "EVIDENCE",
    "MOTIVE",
    "SECRET",
    "WITNESS",
    "SUSPECT",
    "DETECTIVE",
    "PROOF",
    "CASE",
    "MYSTERY",
    "TRUTH",
    "THEORY",
    "SEARCH",
    "HIDDEN",
    "ANSWER",
    "REPORT",
    "RECORD",
    "FILE",
    "SOLVE",
  ];

  /* ============================= */
  /* DOM References                */
  /* ============================= */

  const puzzleElement = document.getElementById("cipherPuzzle");

  const shiftElement = document.getElementById("cipherShift");

  const cipherTextElement = document.getElementById("cipherText");

  const answerInput = document.getElementById("cipherAnswer");

  const submitButton = document.getElementById("submitCipherBtn");

  const messageElement = document.getElementById("cipherMessage");

  const titleElement = document.getElementById("currentPuzzleTitle");

  const descriptionElement = document.getElementById(
    "currentPuzzleDescription",
  );

  /* ============================= */
  /* Active Puzzle Context         */
  /* ============================= */

  /*
    game.js passes these functions into
    render().

    Keeping them here means this puzzle
    module does not need direct access to
    the main game's internal variables.
  */

  let activeContext = null;

  /* ============================= */
  /* Generate Puzzle               */
  /* ============================= */

  function generatePuzzle() {
    const answer = getRandomItem(wordBank);

    const shift = Math.floor(Math.random() * 5) + 1;

    const encrypted = shiftWordForward(answer, shift);

    return {
      type: "cipher",

      answer,

      shift,

      encrypted,
    };
  }

  function shiftWordForward(word, shift) {
    return word
      .split("")
      .map((letter) => {
        const alphabetIndex = letter.charCodeAt(0) - 65;

        const shiftedIndex = (alphabetIndex + shift) % 26;

        return String.fromCharCode(shiftedIndex + 65);
      })
      .join("");
  }

  /* ============================= */
  /* Render Puzzle                 */
  /* ============================= */

  function render(context) {
    activeContext = context;

    const { gameState, saveGame } = context;

    puzzleElement.classList.remove("hidden");

    titleElement.textContent = "Cipher Decoder";

    descriptionElement.textContent =
      "Decode the encrypted word to uncover the next piece of evidence.";

    /*
      Generate this cipher only once.

      If the page refreshes, the cipher
      saved inside currentPuzzleData
      will be reused.
    */

    if (
      !gameState.currentPuzzleData ||
      gameState.currentPuzzleData.type !== "cipher"
    ) {
      gameState.currentPuzzleData = generatePuzzle();

      saveGame(gameState);
    }

    const puzzleData = gameState.currentPuzzleData;

    shiftElement.textContent = puzzleData.shift;

    cipherTextElement.textContent = puzzleData.encrypted;

    answerInput.value = "";

    answerInput.classList.remove("cipher-wrong");

    messageElement.textContent = "";

    submitButton.disabled = false;
  }

  /* ============================= */
  /* Hide Puzzle                   */
  /* ============================= */

  function hide() {
    puzzleElement.classList.add("hidden");

    answerInput.classList.remove("cipher-wrong");

    messageElement.textContent = "";

    activeContext = null;
  }

  /* ============================= */
  /* Check Answer                  */
  /* ============================= */

  function checkAnswer() {
    if (!activeContext) {
      return;
    }

    const { gameState, completeCurrentClue } = activeContext;

    if (
      !gameState ||
      !gameState.currentPuzzleData ||
      gameState.currentPuzzleData.type !== "cipher" ||
      gameState.readyForAccusation
    ) {
      return;
    }

    const submittedAnswer = answerInput.value.trim().toUpperCase();

    const correctAnswer = gameState.currentPuzzleData.answer;

    if (submittedAnswer !== correctAnswer) {
      messageElement.textContent =
        "That doesn't decode the message. Try again.";

      answerInput.classList.add("cipher-wrong");

      return;
    }

    answerInput.classList.remove("cipher-wrong");

    messageElement.textContent = "Cipher decoded. Evidence unlocked.";

    submitButton.disabled = true;

    /*
      Give the player a short moment
      to see the success message.
    */

    setTimeout(() => {
      /*
          The puzzle might have been
          hidden/reset before this timer
          finishes.

          If so, do nothing.
        */

      if (!activeContext) {
        return;
      }

      completeCurrentClue(gameState);
    }, 650);
  }

  /* ============================= */
  /* Helpers                       */
  /* ============================= */

  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /* ============================= */
  /* Events                        */
  /* ============================= */

  submitButton.addEventListener("click", checkAnswer);

  answerInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    checkAnswer();
  });

  answerInput.addEventListener("input", () => {
    answerInput.classList.remove("cipher-wrong");

    if (messageElement.textContent) {
      messageElement.textContent = "";
    }
  });

  /* ============================= */
  /* Register Puzzle               */
  /* ============================= */

  PuzzleRegistry.cipher = {
    render,

    hide,
  };
})();
