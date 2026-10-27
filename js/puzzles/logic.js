(() => {
  const PuzzleRegistry = window.PuzzleRegistry;

  /* ============================= */
  /* Puzzle Settings               */
  /* ============================= */

  const GRID_SIZE = 4;

  const PUZZLE_VERSION = 2;

  const MIN_CLUES = 4;
  const MAX_CLUES = 7;

  const peopleBank = [
    "Avery",
    "Blake",
    "Casey",
    "Drew",
    "Jordan",
    "Morgan",
    "Riley",
    "Taylor",
  ];

  const locationBank = [
    "Library",
    "Garden",
    "Cafe",
    "Station",
    "Theater",
    "Archive",
    "Courtyard",
    "Gallery",
  ];

  let activeContext = null;

  /* ============================= */
  /* DOM                           */
  /* ============================= */

  const logicPuzzle = document.getElementById("logicPuzzle");

  const logicClueList = document.getElementById("logicClueList");

  const logicGrid = document.getElementById("logicGrid");

  const submitLogicBtn = document.getElementById("submitLogicBtn");

  const clearLogicBtn = document.getElementById("clearLogicBtn");

  const logicMessage = document.getElementById("logicMessage");

  /* ============================= */
  /* Generate Puzzle               */
  /* ============================= */

  function generatePuzzle(context) {
    for (let attempt = 0; attempt < 100; attempt++) {
      const people = context.getRandomSelection(peopleBank, GRID_SIZE);

      const locations = context.getRandomSelection(locationBank, GRID_SIZE);

      const solution = shuffleIndexes(GRID_SIZE);

      const allSolutions = generateAllPermutations(GRID_SIZE);

      const candidateClues = buildCandidateClues(people, locations, solution);

      const selectedClues = chooseClues(candidateClues, allSolutions, solution);

      if (!selectedClues) {
        continue;
      }

      return {
        type: "logic",

        version: PUZZLE_VERSION,

        people,

        locations,

        solution,

        clues: selectedClues,

        marks: createEmptyMarks(),

        solved: false,
      };
    }

    return generateFallbackPuzzle(context);
  }

  /* ============================= */
  /* Candidate Clues               */
  /* ============================= */

  function buildCandidateClues(people, locations, solution) {
    const clues = [];

    people.forEach((person, personIndex) => {
      locations.forEach((location, locationIndex) => {
        if (solution[personIndex] === locationIndex) {
          return;
        }

        clues.push({
          type: "not-location",

          person: personIndex,

          location: locationIndex,

          compound: false,

          text: `${person} was not at the ${location}.`,
        });
      });
    });

    for (let first = 0; first < GRID_SIZE; first++) {
      for (let second = first + 1; second < GRID_SIZE; second++) {
        for (let location = 0; location < GRID_SIZE; location++) {
          if (solution[first] === location || solution[second] === location) {
            continue;
          }

          clues.push({
            type: "neither-at-location",

            people: [first, second],

            location,

            compound: true,

            text: `Neither ${people[first]} nor ${people[second]} was at the ${locations[location]}.`,
          });
        }
      }
    }

    for (let person = 0; person < GRID_SIZE; person++) {
      const trueLocation = solution[person];

      for (let otherLocation = 0; otherLocation < GRID_SIZE; otherLocation++) {
        if (otherLocation === trueLocation) {
          continue;
        }

        clues.push({
          type: "person-either-location",

          person,

          locations: [trueLocation, otherLocation],

          compound: true,

          text: `${people[person]} was at either the ${locations[trueLocation]} or the ${locations[otherLocation]}.`,
        });
      }
    }

    for (let location = 0; location < GRID_SIZE; location++) {
      const truePerson = solution.indexOf(location);

      for (let otherPerson = 0; otherPerson < GRID_SIZE; otherPerson++) {
        if (otherPerson === truePerson) {
          continue;
        }

        clues.push({
          type: "location-either-person",

          location,

          people: [truePerson, otherPerson],

          compound: true,

          text: `The person at the ${locations[location]} was either ${people[truePerson]} or ${people[otherPerson]}.`,
        });
      }
    }

    for (let first = 0; first < GRID_SIZE; first++) {
      for (let second = first + 1; second < GRID_SIZE; second++) {
        const firstLocation = solution[first];

        const secondLocation = solution[second];

        clues.push({
          type: "pair-occupies-pair",

          people: [first, second],

          locations: [firstLocation, secondLocation],

          compound: true,

          text: `Of ${people[first]} and ${people[second]}, one was at the ${locations[firstLocation]} and the other was at the ${locations[secondLocation]}.`,
        });
      }
    }

    for (let firstPerson = 0; firstPerson < GRID_SIZE; firstPerson++) {
      const trueLocation = solution[firstPerson];

      for (let secondPerson = 0; secondPerson < GRID_SIZE; secondPerson++) {
        if (secondPerson === firstPerson) {
          continue;
        }

        for (
          let falseLocation = 0;
          falseLocation < GRID_SIZE;
          falseLocation++
        ) {
          if (solution[secondPerson] === falseLocation) {
            continue;
          }

          clues.push({
            type: "exclusive-or",

            firstFact: {
              person: firstPerson,

              location: trueLocation,
            },

            secondFact: {
              person: secondPerson,

              location: falseLocation,
            },

            compound: true,

            text: `Either ${people[firstPerson]} was at the ${locations[trueLocation]} or ${people[secondPerson]} was at the ${locations[falseLocation]}, but not both.`,
          });
        }
      }
    }

    return shuffle(removeDuplicateClues(clues));
  }

  /* ============================= */
  /* Choose a Unique Clue Set      */
  /* ============================= */

  function chooseClues(cluePool, allSolutions, actualSolution) {
    let remainingSolutions = [...allSolutions];

    const chosen = [];

    const usedTexts = new Set();

    let compoundCount = 0;

    while (remainingSolutions.length > 1 && chosen.length < MAX_CLUES) {
      const possibleChoices = cluePool
        .filter((clue) => !usedTexts.has(clue.text))
        .map((clue) => {
          const filtered = remainingSolutions.filter((candidate) =>
            clueMatchesSolution(clue, candidate),
          );

          return {
            clue,
            filtered,
          };
        })
        .filter((entry) => {
          if (entry.filtered.length === remainingSolutions.length) {
            return false;
          }

          if (entry.filtered.length === 0) {
            return false;
          }

          if (chosen.length < MIN_CLUES - 1 && entry.filtered.length === 1) {
            return false;
          }

          if (compoundCount < 2 && chosen.length < 3 && !entry.clue.compound) {
            return false;
          }

          return true;
        });

      if (possibleChoices.length === 0) {
        return null;
      }

      possibleChoices.sort((a, b) => a.filtered.length - b.filtered.length);

      const topRange = possibleChoices.slice(
        0,
        Math.min(6, possibleChoices.length),
      );

      const selected = topRange[Math.floor(Math.random() * topRange.length)];

      chosen.push(selected.clue);

      usedTexts.add(selected.clue.text);

      if (selected.clue.compound) {
        compoundCount++;
      }

      remainingSolutions = selected.filtered;
    }

    if (remainingSolutions.length !== 1) {
      return null;
    }

    if (chosen.length < MIN_CLUES) {
      return null;
    }

    if (compoundCount < 2) {
      return null;
    }

    if (!sameSolution(remainingSolutions[0], actualSolution)) {
      return null;
    }

    return shuffle(chosen);
  }

  /* ============================= */
  /* Evaluate Clues                */
  /* ============================= */

  function clueMatchesSolution(clue, candidate) {
    switch (clue.type) {
      case "not-location":
        return candidate[clue.person] !== clue.location;

      case "neither-at-location":
        return (
          candidate[clue.people[0]] !== clue.location &&
          candidate[clue.people[1]] !== clue.location
        );

      case "person-either-location":
        return clue.locations.includes(candidate[clue.person]);

      case "location-either-person": {
        const personAtLocation = candidate.indexOf(clue.location);

        return clue.people.includes(personAtLocation);
      }

      case "pair-occupies-pair": {
        const first = candidate[clue.people[0]];

        const second = candidate[clue.people[1]];

        return (
          (first === clue.locations[0] && second === clue.locations[1]) ||
          (first === clue.locations[1] && second === clue.locations[0])
        );
      }

      case "exclusive-or": {
        const firstTrue =
          candidate[clue.firstFact.person] === clue.firstFact.location;

        const secondTrue =
          candidate[clue.secondFact.person] === clue.secondFact.location;

        return firstTrue !== secondTrue;
      }

      default:
        return false;
    }
  }

  /* ============================= */
  /* Render                        */
  /* ============================= */

  function render(context) {
    activeContext = context;

    logicPuzzle.classList.remove("hidden");

    document.getElementById("currentPuzzleTitle").textContent = "Logic Grid";

    document.getElementById("currentPuzzleDescription").textContent =
      "Cross-reference the witness statements to determine each person's location.";

    let puzzle = context.gameState.currentPuzzleData;

    if (
      !puzzle ||
      puzzle.type !== "logic" ||
      puzzle.version !== PUZZLE_VERSION
    ) {
      puzzle = generatePuzzle(context);

      context.gameState.currentPuzzleData = puzzle;

      context.saveGame(context.gameState);
    }

    ensureMarks(puzzle);

    renderClues(puzzle);

    renderGrid(puzzle);

    logicMessage.textContent = "";

    logicMessage.classList.remove("logic-success");
  }

  /* ============================= */
  /* Render Clues                  */
  /* ============================= */

  function renderClues(puzzle) {
    logicClueList.innerHTML = "";

    puzzle.clues.forEach((clue) => {
      const item = document.createElement("li");

      item.textContent = clue.text;

      logicClueList.appendChild(item);
    });
  }

  /* ============================= */
  /* Render Grid                   */
  /* ============================= */

  function renderGrid(puzzle) {
    logicGrid.innerHTML = "";

    logicGrid.style.gridTemplateColumns = `minmax(120px, 1.35fr) repeat(${GRID_SIZE}, minmax(78px, 1fr))`;

    const corner = document.createElement("div");

    corner.className = "logic-grid-corner";

    corner.textContent = "PERSON / LOCATION";

    logicGrid.appendChild(corner);

    puzzle.locations.forEach((location) => {
      const header = document.createElement("div");

      header.className = "logic-grid-header";

      header.textContent = location;

      logicGrid.appendChild(header);
    });

    puzzle.people.forEach((person, personIndex) => {
      const nameCell = document.createElement("div");

      nameCell.className = "logic-grid-person";

      nameCell.textContent = person;

      logicGrid.appendChild(nameCell);

      puzzle.locations.forEach((location, locationIndex) => {
        const button = document.createElement("button");

        button.type = "button";

        button.className = "logic-grid-cell";

        button.dataset.person = String(personIndex);

        button.dataset.location = String(locationIndex);

        button.setAttribute("aria-label", `${person} at ${location}`);

        applyMarkToCell(button, puzzle.marks[personIndex][locationIndex]);

        button.addEventListener("click", () => {
          cycleCell(personIndex, locationIndex);
        });

        logicGrid.appendChild(button);
      });
    });
  }

  /* ============================= */
  /* Mark Cells                    */
  /* ============================= */

  function cycleCell(personIndex, locationIndex) {
    if (!activeContext) {
      return;
    }

    const gameState = activeContext.loadGame();

    if (
      !gameState ||
      !gameState.currentPuzzleData ||
      gameState.currentPuzzleData.type !== "logic"
    ) {
      return;
    }

    const puzzle = gameState.currentPuzzleData;

    ensureMarks(puzzle);

    const current = puzzle.marks[personIndex][locationIndex];

    /*
      New click order:

      blank
        ↓
      X
        ↓
      checkmark
        ↓
      blank
    */

    if (current === "blank") {
      puzzle.marks[personIndex][locationIndex] = "no";
    } else if (current === "no") {
      setYes(puzzle, personIndex, locationIndex);
    } else {
      puzzle.marks[personIndex][locationIndex] = "blank";
    }

    activeContext.saveGame(gameState);

    renderGrid(puzzle);

    logicMessage.textContent = "";
  }

  function setYes(puzzle, personIndex, locationIndex) {
    for (let column = 0; column < GRID_SIZE; column++) {
      puzzle.marks[personIndex][column] =
        column === locationIndex ? "yes" : "no";
    }

    for (let row = 0; row < GRID_SIZE; row++) {
      if (row === personIndex) {
        continue;
      }

      puzzle.marks[row][locationIndex] = "no";
    }
  }

  function applyMarkToCell(cell, mark) {
    cell.classList.remove("mark-no", "mark-yes");

    cell.textContent = "";

    if (mark === "no") {
      cell.classList.add("mark-no");

      cell.textContent = "✕";
    }

    if (mark === "yes") {
      cell.classList.add("mark-yes");

      cell.textContent = "✓";
    }
  }

  /* ============================= */
  /* Check Answer                  */
  /* ============================= */

  function checkAnswer() {
    if (!activeContext) {
      return;
    }

    const gameState = activeContext.loadGame();

    if (
      !gameState ||
      !gameState.currentPuzzleData ||
      gameState.currentPuzzleData.type !== "logic"
    ) {
      return;
    }

    const puzzle = gameState.currentPuzzleData;

    ensureMarks(puzzle);

    const playerSolution = extractPlayerSolution(puzzle);

    if (!playerSolution) {
      logicMessage.textContent =
        "Your deduction is incomplete. Each person needs exactly one ✓, and every location can only be used once.";

      return;
    }

    if (!sameSolution(playerSolution, puzzle.solution)) {
      logicMessage.textContent =
        "Something in the deduction conflicts with the witness notes. Recheck how the clues interact.";

      shakeIncorrectSelections(puzzle);

      return;
    }

    puzzle.solved = true;

    activeContext.saveGame(gameState);

    logicMessage.textContent =
      "Deduction confirmed. The witness accounts line up.";

    logicMessage.classList.add("logic-success");

    submitLogicBtn.disabled = true;

    setTimeout(() => {
      submitLogicBtn.disabled = false;

      activeContext.completeCurrentClue(gameState);
    }, 700);
  }

  function extractPlayerSolution(puzzle) {
    const result = [];

    const usedLocations = new Set();

    for (let person = 0; person < GRID_SIZE; person++) {
      const yesLocations = [];

      for (let location = 0; location < GRID_SIZE; location++) {
        if (puzzle.marks[person][location] === "yes") {
          yesLocations.push(location);
        }
      }

      if (yesLocations.length !== 1) {
        return null;
      }

      const selectedLocation = yesLocations[0];

      if (usedLocations.has(selectedLocation)) {
        return null;
      }

      usedLocations.add(selectedLocation);

      result.push(selectedLocation);
    }

    return result;
  }

  /* ============================= */
  /* Incorrect Feedback            */
  /* ============================= */

  function shakeIncorrectSelections(puzzle) {
    const cells = logicGrid.querySelectorAll(".logic-grid-cell");

    cells.forEach((cell) => {
      const person = Number(cell.dataset.person);

      const location = Number(cell.dataset.location);

      if (
        puzzle.marks[person][location] === "yes" &&
        puzzle.solution[person] !== location
      ) {
        cell.classList.remove("logic-wrong-cell");

        void cell.offsetWidth;

        cell.classList.add("logic-wrong-cell");
      }
    });
  }

  /* ============================= */
  /* Clear                         */
  /* ============================= */

  function clearGrid() {
    if (!activeContext) {
      return;
    }

    const gameState = activeContext.loadGame();

    if (
      !gameState ||
      !gameState.currentPuzzleData ||
      gameState.currentPuzzleData.type !== "logic"
    ) {
      return;
    }

    gameState.currentPuzzleData.marks = createEmptyMarks();

    activeContext.saveGame(gameState);

    renderGrid(gameState.currentPuzzleData);

    logicMessage.textContent = "";
  }

  /* ============================= */
  /* Mark Helpers                  */
  /* ============================= */

  function createEmptyMarks() {
    return Array.from(
      {
        length: GRID_SIZE,
      },
      () =>
        Array.from(
          {
            length: GRID_SIZE,
          },
          () => "blank",
        ),
    );
  }

  function ensureMarks(puzzle) {
    if (!Array.isArray(puzzle.marks) || puzzle.marks.length !== GRID_SIZE) {
      puzzle.marks = createEmptyMarks();

      return;
    }

    for (let row = 0; row < GRID_SIZE; row++) {
      if (
        !Array.isArray(puzzle.marks[row]) ||
        puzzle.marks[row].length !== GRID_SIZE
      ) {
        puzzle.marks = createEmptyMarks();

        return;
      }
    }
  }

  /* ============================= */
  /* Permutations                  */
  /* ============================= */

  function generateAllPermutations(size) {
    const numbers = Array.from(
      {
        length: size,
      },
      (_, index) => index,
    );

    const results = [];

    permute(numbers, 0, results);

    return results;
  }

  function permute(array, start, results) {
    if (start === array.length) {
      results.push([...array]);

      return;
    }

    for (let index = start; index < array.length; index++) {
      [array[start], array[index]] = [array[index], array[start]];

      permute(array, start + 1, results);

      [array[start], array[index]] = [array[index], array[start]];
    }
  }

  function shuffleIndexes(size) {
    const values = Array.from(
      {
        length: size,
      },
      (_, index) => index,
    );

    return shuffle(values);
  }

  function shuffle(array) {
    const copy = [...array];

    for (let index = copy.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));

      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }

    return copy;
  }

  function sameSolution(first, second) {
    return first.every((value, index) => value === second[index]);
  }

  /* ============================= */
  /* Duplicate Clue Removal        */
  /* ============================= */

  function removeDuplicateClues(clues) {
    const seen = new Set();

    return clues.filter((clue) => {
      if (seen.has(clue.text)) {
        return false;
      }

      seen.add(clue.text);

      return true;
    });
  }

  /* ============================= */
  /* Fallback Puzzle               */
  /* ============================= */

  function generateFallbackPuzzle(context) {
    const people = context.getRandomSelection(peopleBank, GRID_SIZE);

    const locations = context.getRandomSelection(locationBank, GRID_SIZE);

    const solution = shuffleIndexes(GRID_SIZE);

    const clues = [];

    clues.push({
      type: "pair-occupies-pair",

      people: [0, 1],

      locations: [solution[0], solution[1]],

      compound: true,

      text: `Of ${people[0]} and ${people[1]}, one was at the ${locations[solution[0]]} and the other was at the ${locations[solution[1]]}.`,
    });

    clues.push({
      type: "pair-occupies-pair",

      people: [2, 3],

      locations: [solution[2], solution[3]],

      compound: true,

      text: `Of ${people[2]} and ${people[3]}, one was at the ${locations[solution[2]]} and the other was at the ${locations[solution[3]]}.`,
    });

    const falseForZero = [0, 1, 2, 3].find(
      (location) => location !== solution[0],
    );

    const falseForTwo = [0, 1, 2, 3].find(
      (location) => location !== solution[2],
    );

    clues.push({
      type: "not-location",

      person: 0,

      location: falseForZero,

      compound: false,

      text: `${people[0]} was not at the ${locations[falseForZero]}.`,
    });

    clues.push({
      type: "not-location",

      person: 2,

      location: falseForTwo,

      compound: false,

      text: `${people[2]} was not at the ${locations[falseForTwo]}.`,
    });

    for (let person = 0; person < GRID_SIZE; person++) {
      for (let location = 0; location < GRID_SIZE; location++) {
        if (location === solution[person]) {
          continue;
        }

        const text = `${people[person]} was not at the ${locations[location]}.`;

        if (clues.some((clue) => clue.text === text)) {
          continue;
        }

        clues.push({
          type: "not-location",

          person,

          location,

          compound: false,

          text,
        });

        const possible = generateAllPermutations(GRID_SIZE).filter(
          (candidate) =>
            clues.every((clue) => clueMatchesSolution(clue, candidate)),
        );

        if (possible.length === 1) {
          break;
        }
      }

      const possible = generateAllPermutations(GRID_SIZE).filter((candidate) =>
        clues.every((clue) => clueMatchesSolution(clue, candidate)),
      );

      if (possible.length === 1) {
        break;
      }
    }

    return {
      type: "logic",

      version: PUZZLE_VERSION,

      people,

      locations,

      solution,

      clues,

      marks: createEmptyMarks(),

      solved: false,
    };
  }

  /* ============================= */
  /* Hide                          */
  /* ============================= */

  function hide() {
    logicPuzzle.classList.add("hidden");

    logicMessage.textContent = "";

    logicMessage.classList.remove("logic-success");

    activeContext = null;
  }

  /* ============================= */
  /* Events                        */
  /* ============================= */

  submitLogicBtn.addEventListener("click", checkAnswer);

  clearLogicBtn.addEventListener("click", clearGrid);

  /* ============================= */
  /* Register Puzzle               */
  /* ============================= */

  PuzzleRegistry.logic = {
    render,
    hide,
  };
})();
