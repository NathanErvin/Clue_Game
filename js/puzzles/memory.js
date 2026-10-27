(() => {
  /* ============================= */
  /* Memory Configuration          */
  /* ============================= */

  const PAIR_COUNT = 6;

  /*
    Each pair now has a word and
    a small visual symbol.

    This makes the revealed cards
    easier to remember than showing
    text alone.
  */

  const cardBank = [
    {
      value: "ALIBI",
      symbol: "A",
    },

    {
      value: "CLUE",
      symbol: "◆",
    },

    {
      value: "WITNESS",
      symbol: "👁",
    },

    {
      value: "MOTIVE",
      symbol: "!",
    },

    {
      value: "SECRET",
      symbol: "?",
    },

    {
      value: "PROOF",
      symbol: "✓",
    },

    {
      value: "FILE",
      symbol: "▤",
    },

    {
      value: "REPORT",
      symbol: "R",
    },

    {
      value: "TRACE",
      symbol: "⌁",
    },

    {
      value: "SEARCH",
      symbol: "⌕",
    },

    {
      value: "THEORY",
      symbol: "T",
    },

    {
      value: "EVIDENCE",
      symbol: "E",
    },

    {
      value: "RECORD",
      symbol: "▣",
    },

    {
      value: "SUSPECT",
      symbol: "S",
    },

    {
      value: "MYSTERY",
      symbol: "M",
    },

    {
      value: "ANSWER",
      symbol: "!",
    },
  ];

  /* ============================= */
  /* DOM References                */
  /* ============================= */

  const puzzleElement = document.getElementById("memoryPuzzle");

  const gridElement = document.getElementById("memoryGrid");

  const matchCountElement = document.getElementById("memoryMatchCount");

  const attemptCountElement = document.getElementById("memoryAttemptCount");

  const messageElement = document.getElementById("memoryMessage");

  const titleElement = document.getElementById("currentPuzzleTitle");

  const descriptionElement = document.getElementById(
    "currentPuzzleDescription",
  );

  /* ============================= */
  /* Active State                  */
  /* ============================= */

  let activeContext = null;

  let firstCardId = null;
  let secondCardId = null;

  let boardLocked = false;

  let comparisonTimer = null;

  let completionTimer = null;

  /* ============================= */
  /* Generate Puzzle               */
  /* ============================= */

  function generatePuzzle() {
    const selectedValues = getRandomSelection(cardBank, PAIR_COUNT);

    const cards = [];

    selectedValues.forEach((cardDefinition, pairIndex) => {
      cards.push({
        id: `${pairIndex}-a`,

        pairId: pairIndex,

        value: cardDefinition.value,

        symbol: cardDefinition.symbol,

        matched: false,
      });

      cards.push({
        id: `${pairIndex}-b`,

        pairId: pairIndex,

        value: cardDefinition.value,

        symbol: cardDefinition.symbol,

        matched: false,
      });
    });

    return {
      type: "memory",

      cards: shuffleArray(cards),

      attempts: 0,

      matchedPairs: 0,
    };
  }

  /* ============================= */
  /* Render                        */
  /* ============================= */

  function render(context) {
    clearTimers();

    activeContext = context;

    firstCardId = null;

    secondCardId = null;

    boardLocked = false;

    const { gameState, saveGame } = context;

    puzzleElement.classList.remove("hidden");

    titleElement.textContent = "Memory Match";

    descriptionElement.textContent =
      "Flip the evidence cards and match every pair to uncover the next clue.";

    if (
      !gameState.currentPuzzleData ||
      gameState.currentPuzzleData.type !== "memory"
    ) {
      gameState.currentPuzzleData = generatePuzzle();

      saveGame(gameState);
    }

    ensureCompatibleSave(gameState);

    messageElement.textContent = "Select a card to reveal its evidence.";

    renderBoard(gameState);

    updateStatus(gameState);
  }

  /* ============================= */
  /* Save Compatibility            */
  /* ============================= */

  function ensureCompatibleSave(gameState) {
    const puzzleData = gameState.currentPuzzleData;

    /*
      Older saved Memory Match cards
      may not have symbols yet.

      Add a fallback symbol rather
      than forcing the puzzle to reset.
    */

    puzzleData.cards.forEach((card) => {
      if (!card.symbol) {
        const definition = cardBank.find((entry) => entry.value === card.value);

        card.symbol = definition ? definition.symbol : "◆";
      }
    });

    if (typeof puzzleData.attempts !== "number") {
      puzzleData.attempts = 0;
    }

    if (typeof puzzleData.matchedPairs !== "number") {
      puzzleData.matchedPairs =
        puzzleData.cards.filter((card) => card.matched).length / 2;
    }

    activeContext.saveGame(gameState);
  }

  /* ============================= */
  /* Hide                          */
  /* ============================= */

  function hide() {
    clearTimers();

    puzzleElement.classList.add("hidden");

    firstCardId = null;

    secondCardId = null;

    boardLocked = false;

    messageElement.textContent = "";

    activeContext = null;
  }

  /* ============================= */
  /* Render Board                  */
  /* ============================= */

  function renderBoard(gameState) {
    gridElement.innerHTML = "";

    const puzzleData = gameState.currentPuzzleData;

    puzzleData.cards.forEach((cardData) => {
      const card = document.createElement("button");

      card.type = "button";

      card.classList.add("memory-card");

      card.dataset.cardId = cardData.id;

      const isTemporarilyFlipped =
        cardData.id === firstCardId || cardData.id === secondCardId;

      if (cardData.matched) {
        card.classList.add("matched");

        card.disabled = true;
      }

      if (isTemporarilyFlipped) {
        card.classList.add("flipped");
      }

      if (cardData.matched || isTemporarilyFlipped) {
        card.setAttribute(
          "aria-label",
          cardData.matched
            ? `${cardData.value}, matched`
            : `${cardData.value}, revealed`,
        );
      } else {
        card.setAttribute("aria-label", "Face-down evidence card");
      }

      const inner = document.createElement("span");

      inner.classList.add("memory-card-inner");

      /* ============================= */
      /* Card Back                     */
      /* ============================= */

      const back = document.createElement("span");

      back.classList.add("memory-card-face", "memory-card-back");

      /* ============================= */
      /* Card Front                    */
      /* ============================= */

      const front = document.createElement("span");

      front.classList.add("memory-card-face", "memory-card-front");

      const symbol = document.createElement("span");

      symbol.classList.add("memory-card-symbol");

      symbol.textContent = cardData.symbol;

      const word = document.createElement("span");

      word.classList.add("memory-card-word");

      word.textContent = cardData.value;

      front.appendChild(symbol);

      front.appendChild(word);

      inner.appendChild(back);

      inner.appendChild(front);

      card.appendChild(inner);

      card.addEventListener("click", () => {
        handleCardClick(cardData.id);
      });

      gridElement.appendChild(card);
    });
  }

  /* ============================= */
  /* Card Selection                */
  /* ============================= */

  function handleCardClick(cardId) {
    if (!activeContext || boardLocked) {
      return;
    }

    const { gameState } = activeContext;

    const cardData = findCard(gameState, cardId);

    if (!cardData || cardData.matched) {
      return;
    }

    /*
      Clicking the first card again
      does not count as a second guess.
    */

    if (firstCardId === cardId) {
      return;
    }

    /* ============================= */
    /* First Card                    */
    /* ============================= */

    if (!firstCardId) {
      firstCardId = cardId;

      messageElement.textContent = `Revealed: ${cardData.value}. Find its matching card.`;

      renderBoard(gameState);

      return;
    }

    /* ============================= */
    /* Second Card                   */
    /* ============================= */

    secondCardId = cardId;

    boardLocked = true;

    gameState.currentPuzzleData.attempts++;

    activeContext.saveGame(gameState);

    renderBoard(gameState);

    updateStatus(gameState);

    /*
      Leave both revealed long enough
      for the player to actually read
      and remember them.
    */

    comparisonTimer = setTimeout(() => {
      compareSelectedCards();
    }, 900);
  }

  /* ============================= */
  /* Compare Cards                 */
  /* ============================= */

  function compareSelectedCards() {
    if (!activeContext) {
      return;
    }

    const { gameState, saveGame } = activeContext;

    const firstCard = findCard(gameState, firstCardId);

    const secondCard = findCard(gameState, secondCardId);

    if (!firstCard || !secondCard) {
      resetSelection(gameState);

      return;
    }

    /* ============================= */
    /* Match                         */
    /* ============================= */

    if (firstCard.pairId === secondCard.pairId) {
      firstCard.matched = true;

      secondCard.matched = true;

      gameState.currentPuzzleData.matchedPairs++;

      saveGame(gameState);

      messageElement.textContent = `Match found: ${firstCard.value}.`;

      firstCardId = null;

      secondCardId = null;

      boardLocked = false;

      renderBoard(gameState);

      updateStatus(gameState);

      checkForCompletion(gameState);

      return;
    }

    /* ============================= */
    /* Wrong Pair                    */
    /* ============================= */

    messageElement.textContent = `${firstCard.value} and ${secondCard.value} do not match.`;

    comparisonTimer = setTimeout(() => {
      resetSelection(gameState);

      messageElement.textContent = "Try another pair.";
    }, 650);
  }

  /* ============================= */
  /* Reset Wrong Selection         */
  /* ============================= */

  function resetSelection(gameState) {
    firstCardId = null;

    secondCardId = null;

    boardLocked = false;

    renderBoard(gameState);
  }

  /* ============================= */
  /* Status                        */
  /* ============================= */

  function updateStatus(gameState) {
    const puzzleData = gameState.currentPuzzleData;

    matchCountElement.textContent = `${puzzleData.matchedPairs} / ${PAIR_COUNT}`;

    attemptCountElement.textContent = puzzleData.attempts;
  }

  /* ============================= */
  /* Completion                    */
  /* ============================= */

  function checkForCompletion(gameState) {
    const puzzleData = gameState.currentPuzzleData;

    if (puzzleData.matchedPairs < PAIR_COUNT) {
      return;
    }

    boardLocked = true;

    messageElement.textContent =
      "All evidence pairs matched. Evidence unlocked.";

    completionTimer = setTimeout(() => {
      if (!activeContext) {
        return;
      }

      activeContext.completeCurrentClue(gameState);
    }, 850);
  }

  /* ============================= */
  /* Helpers                       */
  /* ============================= */

  function findCard(gameState, cardId) {
    return gameState.currentPuzzleData.cards.find((card) => card.id === cardId);
  }

  function clearTimers() {
    if (comparisonTimer) {
      clearTimeout(comparisonTimer);

      comparisonTimer = null;
    }

    if (completionTimer) {
      clearTimeout(completionTimer);

      completionTimer = null;
    }
  }

  function getRandomSelection(array, amount) {
    return shuffleArray(array).slice(0, amount);
  }

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
  /* Register Puzzle               */
  /* ============================= */

  PuzzleRegistry.memory = {
    render,
    hide,
  };
})();
