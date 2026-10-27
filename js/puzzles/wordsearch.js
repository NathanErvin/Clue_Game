(() => {
  /* ============================= */
  /* Word Search Configuration     */
  /* ============================= */

  const GRID_SIZE = 10;
  const WORD_COUNT = 3;

  const wordBank = [
    "ALIBI",
    "CLUE",
    "CASE",
    "PROOF",
    "SECRET",
    "MOTIVE",
    "WITNESS",
    "SUSPECT",
    "TRUTH",
    "TRACE",
    "SEARCH",
    "HIDDEN",
    "RECORD",
    "REPORT",
    "FILE",
    "QUESTION",
    "ANSWER",
    "THEORY",
    "SOLVE",
    "DISCOVER",
    "EVIDENCE",
    "MYSTERY",
    "DETECTIVE",
  ];

  const directions = [
    { row: 0, column: 1 },
    { row: 0, column: -1 },

    { row: 1, column: 0 },
    { row: -1, column: 0 },

    { row: 1, column: 1 },
    { row: 1, column: -1 },

    { row: -1, column: 1 },
    { row: -1, column: -1 },
  ];

  /* ============================= */
  /* DOM References                */
  /* ============================= */

  const puzzleElement = document.getElementById("wordSearchPuzzle");

  const gridElement = document.getElementById("mysteryWordSearchGrid");

  const overlayElement = document.getElementById("mysteryWordSearchOverlay");

  const foundHighlightsElement = document.getElementById(
    "mysteryFoundHighlights",
  );

  const selectionHighlightElement = document.getElementById(
    "mysterySelectionHighlight",
  );

  const targetListElement = document.getElementById("wordSearchTargetList");

  const messageElement = document.getElementById("wordSearchMessage");

  const titleElement = document.getElementById("currentPuzzleTitle");

  const descriptionElement = document.getElementById(
    "currentPuzzleDescription",
  );

  /* ============================= */
  /* Active Puzzle State           */
  /* ============================= */

  let activeContext = null;

  let selecting = false;

  let startPosition = null;
  let endPosition = null;

  let selectedPositions = [];

  let completionPending = false;

  /* ============================= */
  /* Puzzle Generation             */
  /* ============================= */

  function generatePuzzle() {
    /*
      Try generating a complete board.

      In the unlikely event that one of
      the selected words cannot be placed,
      generate a fresh board.
    */

    for (
      let generationAttempt = 0;
      generationAttempt < 50;
      generationAttempt++
    ) {
      const grid = createEmptyGrid();

      const selectedWords = getRandomSelection(wordBank, WORD_COUNT);

      const placedWords = [];

      let generationFailed = false;

      for (const word of selectedWords) {
        const positions = placeWord(grid, word);

        if (!positions) {
          generationFailed = true;

          break;
        }

        placedWords.push({
          word,
          positions,
        });
      }

      if (generationFailed) {
        continue;
      }

      fillEmptySpaces(grid);

      return {
        type: "wordsearch",

        grid,

        words: placedWords,

        foundWords: [],
      };
    }

    /*
      This should practically never
      happen with a 10x10 grid and
      only three words.
    */

    throw new Error("Unable to generate Word Search puzzle.");
  }

  function createEmptyGrid() {
    return Array.from(
      {
        length: GRID_SIZE,
      },
      () => Array(GRID_SIZE).fill(""),
    );
  }

  function placeWord(grid, word) {
    for (let attempt = 0; attempt < 400; attempt++) {
      const direction = getRandomItem(directions);

      const startRow = Math.floor(Math.random() * GRID_SIZE);

      const startColumn = Math.floor(Math.random() * GRID_SIZE);

      if (!canPlaceWord(grid, word, startRow, startColumn, direction)) {
        continue;
      }

      const positions = [];

      for (let index = 0; index < word.length; index++) {
        const row = startRow + direction.row * index;

        const column = startColumn + direction.column * index;

        grid[row][column] = word[index];

        positions.push({
          row,
          column,
        });
      }

      return positions;
    }

    return null;
  }

  function canPlaceWord(grid, word, startRow, startColumn, direction) {
    for (let index = 0; index < word.length; index++) {
      const row = startRow + direction.row * index;

      const column = startColumn + direction.column * index;

      if (row < 0 || row >= GRID_SIZE || column < 0 || column >= GRID_SIZE) {
        return false;
      }

      const existingLetter = grid[row][column];

      if (existingLetter !== "" && existingLetter !== word[index]) {
        return false;
      }
    }

    return true;
  }

  function fillEmptySpaces(grid) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let column = 0; column < GRID_SIZE; column++) {
        if (grid[row][column] !== "") {
          continue;
        }

        grid[row][column] =
          alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  /* ============================= */
  /* Render Puzzle                 */
  /* ============================= */

  function render(context) {
    activeContext = context;

    completionPending = false;

    selecting = false;

    clearSelectionState();

    const { gameState, saveGame } = context;

    puzzleElement.classList.remove("hidden");

    titleElement.textContent = "Evidence Word Search";

    descriptionElement.textContent =
      "Find all three hidden investigation words to uncover the next piece of evidence.";

    /*
      Generate once.

      currentPuzzleData is saved inside
      the case, so refreshing the page
      keeps the same board and progress.
    */

    if (
      !gameState.currentPuzzleData ||
      gameState.currentPuzzleData.type !== "wordsearch"
    ) {
      gameState.currentPuzzleData = generatePuzzle();

      saveGame(gameState);
    }

    messageElement.textContent = "";

    renderGrid(gameState);

    renderTargetList(gameState);

    /*
      Wait until layout has finished
      before drawing SVG highlights.
    */

    requestAnimationFrame(() => {
      drawFoundHighlights(gameState);
    });
  }

  /* ============================= */
  /* Hide Puzzle                   */
  /* ============================= */

  function hide() {
    puzzleElement.classList.add("hidden");

    selecting = false;

    completionPending = false;

    clearSelectionState();

    clearSelectionHighlight();

    foundHighlightsElement.innerHTML = "";

    messageElement.textContent = "";

    activeContext = null;
  }

  /* ============================= */
  /* Render Grid                   */
  /* ============================= */

  function renderGrid(gameState) {
    gridElement.innerHTML = "";

    const puzzleData = gameState.currentPuzzleData;

    puzzleData.grid.forEach((row, rowIndex) => {
      row.forEach((letter, columnIndex) => {
        const cell = document.createElement("button");

        cell.type = "button";

        cell.classList.add("mystery-word-search-cell");

        cell.dataset.row = String(rowIndex);

        cell.dataset.column = String(columnIndex);

        cell.textContent = letter;

        cell.setAttribute(
          "aria-label",
          `Row ${rowIndex + 1}, column ${columnIndex + 1}: ${letter}`,
        );

        cell.addEventListener("pointerdown", handlePointerDown);

        gridElement.appendChild(cell);
      });
    });
  }

  /* ============================= */
  /* Render Word List              */
  /* ============================= */

  function renderTargetList(gameState) {
    targetListElement.innerHTML = "";

    const puzzleData = gameState.currentPuzzleData;

    puzzleData.words.forEach((wordData) => {
      const target = document.createElement("span");

      target.classList.add("word-search-target");

      target.textContent = wordData.word;

      if (puzzleData.foundWords.includes(wordData.word)) {
        target.classList.add("found");
      }

      targetListElement.appendChild(target);
    });
  }

  /* ============================= */
  /* Pointer Selection             */
  /* ============================= */

  function handlePointerDown(event) {
    if (!activeContext) {
      return;
    }

    event.preventDefault();

    const cell = event.currentTarget;

    selecting = true;

    startPosition = {
      row: Number(cell.dataset.row),

      column: Number(cell.dataset.column),
    };

    endPosition = {
      ...startPosition,
    };

    selectedPositions = [
      {
        ...startPosition,
      },
    ];

    drawSelectionHighlight();
  }

  function handlePointerMove(event) {
    if (!selecting || !activeContext) {
      return;
    }

    const element = document.elementFromPoint(event.clientX, event.clientY);

    if (!element) {
      return;
    }

    const cell = element.closest(".mystery-word-search-cell");

    if (!cell || !gridElement.contains(cell)) {
      return;
    }

    const newEndPosition = {
      row: Number(cell.dataset.row),

      column: Number(cell.dataset.column),
    };

    const positions = getPositionsBetween(startPosition, newEndPosition);

    /*
      Only horizontal, vertical, or
      perfect diagonal selections are
      accepted.
    */

    if (positions.length === 0) {
      return;
    }

    endPosition = newEndPosition;

    selectedPositions = positions;

    drawSelectionHighlight();
  }

  function handlePointerUp() {
    if (!selecting || !activeContext) {
      return;
    }

    selecting = false;

    if (selectedPositions.length <= 1) {
      clearSelectionState();

      clearSelectionHighlight();

      return;
    }

    checkSelection();
  }

  /* ============================= */
  /* Selection Geometry            */
  /* ============================= */

  function getPositionsBetween(start, end) {
    if (!start || !end) {
      return [];
    }

    const rowDifference = end.row - start.row;

    const columnDifference = end.column - start.column;

    const rowDistance = Math.abs(rowDifference);

    const columnDistance = Math.abs(columnDifference);

    /*
      A valid selection must be:

      horizontal
      vertical
      or a perfect diagonal.
    */

    const horizontal = rowDifference === 0;

    const vertical = columnDifference === 0;

    const diagonal = rowDistance === columnDistance;

    if (!horizontal && !vertical && !diagonal) {
      return [];
    }

    const length = Math.max(rowDistance, columnDistance) + 1;

    const rowStep = rowDifference === 0 ? 0 : rowDifference > 0 ? 1 : -1;

    const columnStep =
      columnDifference === 0 ? 0 : columnDifference > 0 ? 1 : -1;

    const positions = [];

    for (let index = 0; index < length; index++) {
      positions.push({
        row: start.row + rowStep * index,

        column: start.column + columnStep * index,
      });
    }

    return positions;
  }

  /* ============================= */
  /* Validate Selection            */
  /* ============================= */

  function checkSelection() {
    if (!activeContext) {
      return;
    }

    const { gameState, saveGame, completeCurrentClue } = activeContext;

    const puzzleData = gameState.currentPuzzleData;

    if (!puzzleData || puzzleData.type !== "wordsearch") {
      clearSelectionState();

      clearSelectionHighlight();

      return;
    }

    const matchedWord = puzzleData.words.find((wordData) => {
      /*
            Already solved words should
            not be solved twice.
          */

      if (puzzleData.foundWords.includes(wordData.word)) {
        return false;
      }

      return (
        positionsMatch(selectedPositions, wordData.positions) ||
        positionsMatch(selectedPositions, [...wordData.positions].reverse())
      );
    });

    if (!matchedWord) {
      messageElement.textContent =
        "That selection is not one of the hidden words.";

      clearSelectionState();

      clearSelectionHighlight();

      return;
    }

    puzzleData.foundWords.push(matchedWord.word);

    gameState.currentPuzzleData = puzzleData;

    saveGame(gameState);

    messageElement.textContent = `Found: ${matchedWord.word}`;

    clearSelectionState();

    clearSelectionHighlight();

    renderTargetList(gameState);

    drawFoundHighlights(gameState);

    /*
      All three words have now been
      discovered.
    */

    if (puzzleData.foundWords.length >= puzzleData.words.length) {
      completionPending = true;

      messageElement.textContent = "All words found. Evidence unlocked.";

      setTimeout(() => {
        if (!activeContext || !completionPending) {
          return;
        }

        completionPending = false;

        completeCurrentClue(gameState);
      }, 700);
    }
  }

  function positionsMatch(selected, expected) {
    if (selected.length !== expected.length) {
      return false;
    }

    return selected.every(
      (position, index) =>
        position.row === expected[index].row &&
        position.column === expected[index].column,
    );
  }

  /* ============================= */
  /* SVG Selection Highlight       */
  /* ============================= */

  function drawSelectionHighlight() {
    if (selectedPositions.length === 0) {
      clearSelectionHighlight();

      return;
    }

    const firstPosition = selectedPositions[0];

    const lastPosition = selectedPositions[selectedPositions.length - 1];

    const firstCell = getCell(firstPosition);

    const lastCell = getCell(lastPosition);

    if (!firstCell || !lastCell) {
      return;
    }

    prepareOverlayCoordinateSystem();

    const startPoint = getCellCenter(firstCell);

    const endPoint = getCellCenter(lastCell);

    selectionHighlightElement.setAttribute("x1", startPoint.x);

    selectionHighlightElement.setAttribute("y1", startPoint.y);

    selectionHighlightElement.setAttribute("x2", endPoint.x);

    selectionHighlightElement.setAttribute("y2", endPoint.y);

    selectionHighlightElement.setAttribute("stroke-width", getHighlightWidth());

    selectionHighlightElement.style.display = "block";
  }

  function clearSelectionHighlight() {
    selectionHighlightElement.style.display = "none";
  }

  /* ============================= */
  /* SVG Found Highlights          */
  /* ============================= */

  function drawFoundHighlights(gameState) {
    foundHighlightsElement.innerHTML = "";

    const puzzleData = gameState.currentPuzzleData;

    if (!puzzleData || puzzleData.type !== "wordsearch") {
      return;
    }

    prepareOverlayCoordinateSystem();

    puzzleData.words.forEach((wordData) => {
      if (!puzzleData.foundWords.includes(wordData.word)) {
        return;
      }

      const firstPosition = wordData.positions[0];

      const lastPosition = wordData.positions[wordData.positions.length - 1];

      const firstCell = getCell(firstPosition);

      const lastCell = getCell(lastPosition);

      if (!firstCell || !lastCell) {
        return;
      }

      const startPoint = getCellCenter(firstCell);

      const endPoint = getCellCenter(lastCell);

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );

      line.setAttribute("x1", startPoint.x);

      line.setAttribute("y1", startPoint.y);

      line.setAttribute("x2", endPoint.x);

      line.setAttribute("y2", endPoint.y);

      line.setAttribute("stroke-width", getHighlightWidth());

      line.classList.add("mystery-found-highlight");

      foundHighlightsElement.appendChild(line);
    });
  }

  /* ============================= */
  /* SVG Geometry Helpers          */
  /* ============================= */

  function prepareOverlayCoordinateSystem() {
    const rect = overlayElement.getBoundingClientRect();

    overlayElement.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
  }

  function getCellCenter(cell) {
    const cellRect = cell.getBoundingClientRect();

    const overlayRect = overlayElement.getBoundingClientRect();

    return {
      x: cellRect.left - overlayRect.left + cellRect.width / 2,

      y: cellRect.top - overlayRect.top + cellRect.height / 2,
    };
  }

  function getHighlightWidth() {
    const firstCell = gridElement.querySelector(".mystery-word-search-cell");

    if (!firstCell) {
      return 20;
    }

    const rect = firstCell.getBoundingClientRect();

    return Math.max(16, rect.width * 0.72);
  }

  function getCell(position) {
    return gridElement.querySelector(
      `[data-row="${position.row}"][data-column="${position.column}"]`,
    );
  }

  /* ============================= */
  /* Selection Cleanup             */
  /* ============================= */

  function clearSelectionState() {
    startPosition = null;

    endPosition = null;

    selectedPositions = [];
  }

  /* ============================= */
  /* Random Helpers                */
  /* ============================= */

  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomSelection(array, amount) {
    const shuffled = [...array];

    for (let index = shuffled.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));

      [shuffled[index], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[index],
      ];
    }

    return shuffled.slice(0, amount);
  }

  /* ============================= */
  /* Global Pointer Events         */
  /* ============================= */

  document.addEventListener("pointermove", handlePointerMove);

  document.addEventListener("pointerup", handlePointerUp);

  document.addEventListener("pointercancel", () => {
    if (!selecting) {
      return;
    }

    selecting = false;

    clearSelectionState();

    clearSelectionHighlight();
  });

  /* ============================= */
  /* Resize Handling               */
  /* ============================= */

  window.addEventListener("resize", () => {
    if (!activeContext) {
      return;
    }

    const { gameState } = activeContext;

    requestAnimationFrame(() => {
      drawFoundHighlights(gameState);

      if (selecting) {
        drawSelectionHighlight();
      }
    });
  });

  /* ============================= */
  /* Register Puzzle               */
  /* ============================= */

  PuzzleRegistry.wordsearch = {
    render,
    hide,
  };
})();
