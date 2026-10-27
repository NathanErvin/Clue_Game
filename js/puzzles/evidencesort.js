(() => {
  /* ============================= */
  /* Evidence Sort Configuration   */
  /* ============================= */

  const CARDS_PER_CATEGORY = 3;

  const TOTAL_CARDS = 9;

  /*
    Each scenario creates a different
    classification challenge.

    Nothing here uses the real mystery
    suspects/items/locations, so the
    puzzle cannot accidentally reveal
    anything about the actual case.
  */

  const scenarios = [
    {
      id: "evidence-type",

      title: "Evidence Type",

      description:
        "Sort each piece of evidence by how investigators obtained it.",

      categories: [
        {
          id: "testimony",

          name: "Testimony",

          cards: [
            {
              name: "Witness Interview",

              symbol: "◉",
            },

            {
              name: "Neighbor Statement",

              symbol: "“ ”",
            },

            {
              name: "Security Guard Account",

              symbol: "S",
            },

            {
              name: "Anonymous Tip",

              symbol: "?",
            },

            {
              name: "Driver's Recollection",

              symbol: "D",
            },
          ],
        },

        {
          id: "physical",

          name: "Physical",

          cards: [
            {
              name: "Fingerprint",

              symbol: "◎",
            },

            {
              name: "Broken Key",

              symbol: "⌘",
            },

            {
              name: "Shoe Print",

              symbol: "▱",
            },

            {
              name: "Fabric Fiber",

              symbol: "⌁",
            },

            {
              name: "Dropped Button",

              symbol: "●",
            },
          ],
        },

        {
          id: "documentary",

          name: "Documentary",

          cards: [
            {
              name: "Store Receipt",

              symbol: "▤",
            },

            {
              name: "Security Log",

              symbol: "▣",
            },

            {
              name: "Parking Record",

              symbol: "P",
            },

            {
              name: "Email Printout",

              symbol: "@",
            },

            {
              name: "Phone Record",

              symbol: "#",
            },
          ],
        },
      ],
    },

    /* ============================= */
    /* Lead Status Scenario          */
    /* ============================= */

    {
      id: "lead-status",

      title: "Lead Status",

      description:
        "Review the detective notes and file each investigative lead by its current status.",

      categories: [
        {
          id: "verified",

          name: "Verified",

          cards: [
            {
              name: "Timestamp Confirmed",

              symbol: "✓",
            },

            {
              name: "Camera Match",

              symbol: "▣",
            },

            {
              name: "Receipt Validated",

              symbol: "R",
            },

            {
              name: "Fingerprint Match",

              symbol: "◎",
            },

            {
              name: "Location Confirmed",

              symbol: "◆",
            },
          ],
        },

        {
          id: "unconfirmed",

          name: "Unconfirmed",

          cards: [
            {
              name: "Anonymous Rumor",

              symbol: "?",
            },

            {
              name: "Unidentified Vehicle",

              symbol: "V",
            },

            {
              name: "Partial Footprint",

              symbol: "▱",
            },

            {
              name: "Unknown Caller",

              symbol: "#",
            },

            {
              name: "Possible Sighting",

              symbol: "◉",
            },
          ],
        },

        {
          id: "discredited",

          name: "Discredited",

          cards: [
            {
              name: "Incorrect Timestamp",

              symbol: "×",
            },

            {
              name: "False Witness Report",

              symbol: "!",
            },

            {
              name: "Mismatched Print",

              symbol: "◎",
            },

            {
              name: "Wrong Vehicle",

              symbol: "V",
            },

            {
              name: "Invalid Receipt",

              symbol: "R",
            },
          ],
        },
      ],
    },

    /* ============================= */
    /* Source Scenario               */
    /* ============================= */

    {
      id: "source",

      title: "Investigation Source",

      description:
        "Sort each clue according to where investigators discovered the information.",

      categories: [
        {
          id: "witness",

          name: "Witness",

          cards: [
            {
              name: "Heard an Argument",

              symbol: "“ ”",
            },

            {
              name: "Saw a Blue Car",

              symbol: "◉",
            },

            {
              name: "Reported a Noise",

              symbol: "!",
            },

            {
              name: "Recognized a Voice",

              symbol: "V",
            },

            {
              name: "Saw Someone Leave",

              symbol: "→",
            },
          ],
        },

        {
          id: "scene",

          name: "Scene",

          cards: [
            {
              name: "Muddy Footprint",

              symbol: "▱",
            },

            {
              name: "Broken Glass",

              symbol: "◇",
            },

            {
              name: "Loose Thread",

              symbol: "⌁",
            },

            {
              name: "Dropped Key",

              symbol: "⌘",
            },

            {
              name: "Fingerprint",

              symbol: "◎",
            },
          ],
        },

        {
          id: "records",

          name: "Records",

          cards: [
            {
              name: "Call History",

              symbol: "#",
            },

            {
              name: "Purchase Receipt",

              symbol: "▤",
            },

            {
              name: "Entry Log",

              symbol: "▣",
            },

            {
              name: "Camera Timestamp",

              symbol: "◷",
            },

            {
              name: "Parking Ticket",

              symbol: "P",
            },
          ],
        },
      ],
    },
  ];

  /* ============================= */
  /* DOM References                */
  /* ============================= */

  const puzzleElement = document.getElementById("evidenceSortPuzzle");

  const scenarioTitleElement = document.getElementById(
    "evidenceSortScenarioTitle",
  );

  const scenarioDescriptionElement = document.getElementById(
    "evidenceSortScenarioDescription",
  );

  const filedCountElement = document.getElementById("evidenceSortFiledCount");

  const remainingCountElement = document.getElementById(
    "evidenceSortRemainingCount",
  );

  const trayElement = document.getElementById("evidenceSortTray");

  const categoriesElement = document.getElementById("evidenceSortCategories");

  const checkButton = document.getElementById("checkEvidenceSortBtn");

  const resetButton = document.getElementById("resetEvidenceSortBtn");

  const messageElement = document.getElementById("evidenceSortMessage");

  const titleElement = document.getElementById("currentPuzzleTitle");

  const descriptionElement = document.getElementById(
    "currentPuzzleDescription",
  );

  /* ============================= */
  /* Active State                  */
  /* ============================= */

  let activeContext = null;

  let selectedCardId = null;

  let draggedCardId = null;

  let completionPending = false;

  let completionTimer = null;

  /* ============================= */
  /* Generate Puzzle               */
  /* ============================= */

  function generatePuzzle() {
    const scenario = getRandomItem(scenarios);

    const cards = [];

    scenario.categories.forEach((category) => {
      const selectedCards = getRandomSelection(
        category.cards,
        CARDS_PER_CATEGORY,
      );

      selectedCards.forEach((card, index) => {
        cards.push({
          id: `${category.id}-${index}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,

          name: card.name,

          symbol: card.symbol,

          correctCategory: category.id,

          assignedCategory: null,
        });
      });
    });

    return {
      type: "evidencesort",

      scenarioId: scenario.id,

      cards: shuffleArray(cards),

      categoryOrder: shuffleArray(
        scenario.categories.map((category) => category.id),
      ),

      completed: false,
    };
  }

  /* ============================= */
  /* Render                        */
  /* ============================= */

  function render(context) {
    clearCompletionTimer();

    activeContext = context;

    selectedCardId = null;

    draggedCardId = null;

    completionPending = false;

    const { gameState, saveGame } = context;

    puzzleElement.classList.remove("hidden");

    titleElement.textContent = "Evidence Sort";

    descriptionElement.textContent =
      "Organize the mixed investigation files into their correct categories.";

    if (
      !gameState.currentPuzzleData ||
      gameState.currentPuzzleData.type !== "evidencesort"
    ) {
      gameState.currentPuzzleData = generatePuzzle();

      saveGame(gameState);
    }

    ensureCompatibleSave(gameState);

    renderScenario(gameState);

    renderPuzzle(gameState);

    updateStatus(gameState);

    messageElement.textContent =
      "Select or drag an evidence card into the category where it belongs.";

    checkButton.disabled = false;

    resetButton.disabled = false;
  }

  /* ============================= */
  /* Compatibility                 */
  /* ============================= */

  function ensureCompatibleSave(gameState) {
    const puzzleData = gameState.currentPuzzleData;

    const scenario = getScenario(puzzleData.scenarioId);

    if (!scenario || !Array.isArray(puzzleData.cards)) {
      gameState.currentPuzzleData = generatePuzzle();

      activeContext.saveGame(gameState);

      return;
    }

    puzzleData.cards.forEach((card) => {
      if (typeof card.assignedCategory === "undefined") {
        card.assignedCategory = null;
      }
    });

    if (!Array.isArray(puzzleData.categoryOrder)) {
      puzzleData.categoryOrder = shuffleArray(
        scenario.categories.map((category) => category.id),
      );
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
    clearCompletionTimer();

    puzzleElement.classList.add("hidden");

    selectedCardId = null;

    draggedCardId = null;

    completionPending = false;

    messageElement.textContent = "";

    activeContext = null;
  }

  /* ============================= */
  /* Scenario                     */
  /* ============================= */

  function renderScenario(gameState) {
    const scenario = getScenario(gameState.currentPuzzleData.scenarioId);

    scenarioTitleElement.textContent = scenario.title;

    scenarioDescriptionElement.textContent = scenario.description;
  }

  /* ============================= */
  /* Render Whole Puzzle           */
  /* ============================= */

  function renderPuzzle(gameState) {
    renderTray(gameState);

    renderCategories(gameState);
  }

  /* ============================= */
  /* Render Tray                   */
  /* ============================= */

  function renderTray(gameState) {
    trayElement.innerHTML = "";

    const cards = gameState.currentPuzzleData.cards.filter(
      (card) => !card.assignedCategory,
    );

    cards.forEach((card) => {
      trayElement.appendChild(createEvidenceCard(card, gameState));
    });

    if (cards.length === 0) {
      const empty = document.createElement("p");

      empty.classList.add("evidence-sort-empty");

      empty.textContent = "All evidence has been filed.";

      trayElement.appendChild(empty);
    }
  }

  /* ============================= */
  /* Render Categories             */
  /* ============================= */

  function renderCategories(gameState) {
    categoriesElement.innerHTML = "";

    const puzzleData = gameState.currentPuzzleData;

    const scenario = getScenario(puzzleData.scenarioId);

    puzzleData.categoryOrder.forEach((categoryId) => {
      const category = scenario.categories.find(
        (candidate) => candidate.id === categoryId,
      );

      if (!category) {
        return;
      }

      const categoryElement = document.createElement("div");

      categoryElement.classList.add("evidence-sort-category");

      categoryElement.dataset.categoryId = category.id;

      /* ============================= */
      /* Header                        */
      /* ============================= */

      const header = document.createElement("button");

      header.type = "button";

      header.classList.add("evidence-sort-category-header");

      header.textContent = category.name;

      header.setAttribute(
        "aria-label",
        `File selected evidence under ${category.name}`,
      );

      header.addEventListener("click", () => {
        if (selectedCardId) {
          assignCard(selectedCardId, category.id, gameState);
        }
      });

      /* ============================= */
      /* Card Area                     */
      /* ============================= */

      const cardArea = document.createElement("div");

      cardArea.classList.add("evidence-sort-category-cards");

      const assignedCards = puzzleData.cards.filter(
        (card) => card.assignedCategory === category.id,
      );

      assignedCards.forEach((card) => {
        cardArea.appendChild(createEvidenceCard(card, gameState));
      });

      if (assignedCards.length === 0) {
        const empty = document.createElement("p");

        empty.classList.add("evidence-sort-empty");

        empty.textContent = "Drop evidence here.";

        cardArea.appendChild(empty);
      }

      /* ============================= */
      /* Drop Events                   */
      /* ============================= */

      categoryElement.addEventListener("dragover", (event) => {
        event.preventDefault();

        if (draggedCardId) {
          categoryElement.classList.add("drag-over");
        }
      });

      categoryElement.addEventListener("dragleave", (event) => {
        if (!categoryElement.contains(event.relatedTarget)) {
          categoryElement.classList.remove("drag-over");
        }
      });

      categoryElement.addEventListener("drop", (event) => {
        event.preventDefault();

        categoryElement.classList.remove("drag-over");

        const transferredId = event.dataTransfer.getData("text/plain");

        const cardId = draggedCardId || transferredId;

        if (!cardId) {
          return;
        }

        assignCard(cardId, category.id, gameState);

        draggedCardId = null;
      });

      categoryElement.appendChild(header);

      categoryElement.appendChild(cardArea);

      categoriesElement.appendChild(categoryElement);
    });
  }

  /* ============================= */
  /* Create Card                   */
  /* ============================= */

  function createEvidenceCard(cardData, gameState) {
    const card = document.createElement("button");

    card.type = "button";

    card.classList.add("evidence-sort-card");

    card.dataset.cardId = cardData.id;

    card.draggable = true;

    if (cardData.id === selectedCardId) {
      card.classList.add("selected");
    }

    card.setAttribute("aria-label", cardData.name);

    const symbol = document.createElement("span");

    symbol.classList.add("evidence-sort-card-symbol");

    symbol.textContent = cardData.symbol;

    const name = document.createElement("span");

    name.classList.add("evidence-sort-card-name");

    name.textContent = cardData.name;

    card.appendChild(symbol);

    card.appendChild(name);

    /* ============================= */
    /* Click Selection               */
    /* ============================= */

    card.addEventListener("click", () => {
      selectCard(cardData.id, gameState);
    });

    /* ============================= */
    /* Drag Events                   */
    /* ============================= */

    card.addEventListener("dragstart", (event) => {
      draggedCardId = cardData.id;

      selectedCardId = cardData.id;

      event.dataTransfer.effectAllowed = "move";

      event.dataTransfer.setData("text/plain", cardData.id);
    });

    card.addEventListener("dragend", () => {
      draggedCardId = null;

      document
        .querySelectorAll(".evidence-sort-category.drag-over")
        .forEach((category) => {
          category.classList.remove("drag-over");
        });
    });

    return card;
  }

  /* ============================= */
  /* Select Card                   */
  /* ============================= */

  function selectCard(cardId, gameState) {
    if (completionPending) {
      return;
    }

    if (selectedCardId === cardId) {
      selectedCardId = null;

      messageElement.textContent = "Selection cleared.";
    } else {
      selectedCardId = cardId;

      messageElement.textContent =
        "Evidence selected. Choose a case-file category.";
    }

    renderPuzzle(gameState);
  }

  /* ============================= */
  /* Assign Card                   */
  /* ============================= */

  function assignCard(cardId, categoryId, gameState) {
    if (completionPending) {
      return;
    }

    const card = gameState.currentPuzzleData.cards.find(
      (candidate) => candidate.id === cardId,
    );

    if (!card) {
      return;
    }

    card.assignedCategory = categoryId;

    selectedCardId = null;

    draggedCardId = null;

    activeContext.saveGame(gameState);

    messageElement.textContent = "Evidence filed.";

    clearCategoryFeedback();

    renderPuzzle(gameState);

    updateStatus(gameState);
  }

  /* ============================= */
  /* Check Classification          */
  /* ============================= */

  function checkClassification() {
    if (!activeContext || completionPending) {
      return;
    }

    const { gameState, saveGame } = activeContext;

    const puzzleData = gameState.currentPuzzleData;

    const unassigned = puzzleData.cards.filter(
      (card) => !card.assignedCategory,
    );

    if (unassigned.length > 0) {
      messageElement.textContent = `There ${
        unassigned.length === 1 ? "is" : "are"
      } still ${unassigned.length} unfiled ${
        unassigned.length === 1 ? "card" : "cards"
      }.`;

      return;
    }

    clearCategoryFeedback();

    let allCorrect = true;

    const incorrectCategories = new Set();

    puzzleData.cards.forEach((card) => {
      if (card.assignedCategory !== card.correctCategory) {
        allCorrect = false;

        incorrectCategories.add(card.assignedCategory);
      }
    });

    /* ============================= */
    /* Incorrect                    */
    /* ============================= */

    if (!allCorrect) {
      incorrectCategories.forEach((categoryId) => {
        const categoryElement = categoriesElement.querySelector(
          `[data-category-id="${categoryId}"]`,
        );

        if (categoryElement) {
          categoryElement.classList.add("wrong");
        }
      });

      messageElement.textContent =
        "Some evidence has been filed incorrectly. Recheck the highlighted categories.";

      return;
    }

    /* ============================= */
    /* Correct                      */
    /* ============================= */

    puzzleData.completed = true;

    saveGame(gameState);

    completionPending = true;

    checkButton.disabled = true;

    resetButton.disabled = true;

    categoriesElement
      .querySelectorAll(".evidence-sort-category")
      .forEach((category) => {
        category.classList.add("correct");
      });

    messageElement.textContent = "Classification confirmed. Evidence unlocked.";

    completionTimer = setTimeout(() => {
      if (!activeContext || !completionPending) {
        return;
      }

      completionPending = false;

      activeContext.completeCurrentClue(gameState);
    }, 900);
  }

  /* ============================= */
  /* Reset Cards                   */
  /* ============================= */

  function resetEvidence() {
    if (!activeContext || completionPending) {
      return;
    }

    const { gameState, saveGame } = activeContext;

    gameState.currentPuzzleData.cards.forEach((card) => {
      card.assignedCategory = null;
    });

    selectedCardId = null;

    draggedCardId = null;

    saveGame(gameState);

    clearCategoryFeedback();

    renderPuzzle(gameState);

    updateStatus(gameState);

    messageElement.textContent = "All evidence returned to the unsorted file.";
  }

  /* ============================= */
  /* Status                        */
  /* ============================= */

  function updateStatus(gameState) {
    const filed = gameState.currentPuzzleData.cards.filter(
      (card) => card.assignedCategory,
    ).length;

    filedCountElement.textContent = `${filed} / ${TOTAL_CARDS}`;

    remainingCountElement.textContent = TOTAL_CARDS - filed;
  }

  /* ============================= */
  /* Visual Feedback               */
  /* ============================= */

  function clearCategoryFeedback() {
    categoriesElement
      .querySelectorAll(".evidence-sort-category")
      .forEach((category) => {
        category.classList.remove("wrong", "correct");
      });
  }

  /* ============================= */
  /* Scenario Helper               */
  /* ============================= */

  function getScenario(scenarioId) {
    return scenarios.find((scenario) => scenario.id === scenarioId);
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
  /* Random Helpers                */
  /* ============================= */

  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
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
  /* Events                        */
  /* ============================= */

  checkButton.addEventListener("click", checkClassification);

  resetButton.addEventListener("click", resetEvidence);

  /* ============================= */
  /* Register Puzzle               */
  /* ============================= */

  PuzzleRegistry.evidencesort = {
    render,
    hide,
  };
})();
