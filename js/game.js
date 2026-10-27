const STORAGE_KEY = "mystery-game-save";

/* ============================= */
/* Master Case Lists             */
/* ============================= */

const availablePeople = [
  "Nathan",
  "Bailey",
  "Brecken",
  "Ally",
  "Grant",
  "Kate",
  "Cael",
  "Katie",
  "Colton",
  "Alyssa",
];

const availableItems = [
  "Diabetes Bag",
  "Pillow",
  "Pickleball Paddle",
  "Volleyball",
  "Salt Flag",
  "Whiteboard",
  "Computer",
  "Blanket",
  "Fruit Bowl",
  "Disc",
];

const availableLocations = [
  "Drake",
  "Iowa State",
  "Washington",
  "Eldridge",
  "Ada Hayden",
  "Bubba's",
  "Cornerstone",
  "Cottage Grove",
  "Mason City",
  "Aldi",
];

/* ============================= */
/* Puzzle Types                  */
/* ============================= */

const puzzleTypes = [
  "cipher",
  "wordsearch",
  "logic",
  "memory",
  "codebreaker",
  "jigsaw",
  "patternlock",
  "evidencesort",
];

/* ============================= */
/* Crime Scene Story System      */
/* ============================= */

const caseScenarios = [
  {
    id: "sabotaged-surprise",
    title: "The Sabotaged Surprise",
    incidentLabel: "Sabotage",

    opening:
      "A carefully prepared surprise was found deliberately ruined shortly before it was supposed to be revealed. Decorations had been disturbed, part of the setup had been moved, and a handwritten card that belonged with the display was missing.",

    discovery:
      "The damage was too deliberate to look accidental. Someone had enough time to interfere with the setup, use an ordinary object from the group as part of the act, and leave before anyone understood what had happened.",

    evidenceHook:
      "Investigators believe one of the listed items was directly involved in the sabotage, but the scene was disturbed before the exact object could be identified.",

    motives: [
      {
        label: "JEALOUSY",

        lead: "I was sick of watching everyone make such a big deal out of it while I was treated like I barely mattered.",

        middle:
          "I only wanted to wreck the surprise and make the whole thing fall apart for once.",
      },

      {
        label: "RESENTMENT",

        lead: "Everybody kept acting like the night had to be perfect, like nobody cared what I thought about any of it.",

        middle:
          "So I decided if they wanted a perfect little moment that badly, I would be the reason they did not get one.",
      },
    ],
  },

  {
    id: "missing-envelope",
    title: "The Vanishing Envelope",
    incidentLabel: "Theft and Concealment",

    opening:
      "A sealed envelope containing private plans for an upcoming event disappeared after being left with the group for safekeeping. When people went back for it, the envelope was gone and the place where it had been stored had clearly been searched.",

    discovery:
      "Nothing else valuable appeared to be missing, which made the disappearance look targeted. Someone wanted the contents of that envelope, wanted the envelope hidden, or wanted everyone else to believe somebody had taken it.",

    evidenceHook:
      "One of the available items appears to have been used while hiding, moving, or accessing the envelope, but no one agrees which object matters.",

    motives: [
      {
        label: "CURIOSITY",

        lead: "I wanted to know what was in that envelope, and everyone kept telling me it was none of my business.",

        middle:
          "I told myself I would look and put it back. Then I realized people were already searching for it, and I panicked.",
      },

      {
        label: "CONTROL",

        lead: "Those plans affected me too, and nobody thought I deserved a say in them.",

        middle:
          "Taking the envelope was the only way I could stop everyone from going ahead without me.",
      },
    ],
  },

  {
    id: "switched-package",
    title: "The Switched Package",
    incidentLabel: "Tampering",

    opening:
      "A package that had been prepared earlier in the day was discovered with the wrong contents inside. The wrapping looked nearly untouched, but the original contents had been removed and replaced before anyone opened it.",

    discovery:
      "Whoever made the switch had to know what the package was supposed to contain and had to work quickly enough to leave the wrapping looking normal. The replacement was not random; it was meant to create confusion when the package was finally opened.",

    evidenceHook:
      "Investigators found signs that one of the listed objects was used during the switch, but the evidence does not yet show which one.",

    motives: [
      {
        label: "REVENGE",

        lead: "You think I did all that for no reason? After what happened earlier, I wanted somebody else to feel embarrassed for once.",

        middle:
          "I switched the package because I knew exactly how much chaos it would cause when everyone opened it.",
      },

      {
        label: "PRANK GONE WRONG",

        lead: "It was supposed to be funny. That is the part none of you seem to understand.",

        middle:
          "I thought everyone would laugh when the package was opened. Then people started accusing each other and I knew I had taken it too far.",
      },
    ],
  },

  {
    id: "disturbed-room",
    title: "The Room That Wasn't Left That Way",
    incidentLabel: "Unauthorized Entry",

    opening:
      "A room the group had finished using was later found completely rearranged. Chairs and personal belongings had been moved, a small stack of notes had been scattered, and one object had been left in a place where nobody remembered seeing it before.",

    discovery:
      "There was no sign of forced entry. That means the person responsible either already had access or entered while the area was briefly unattended. The strange arrangement looked intentional, almost as if somebody wanted the scene to send a message.",

    evidenceHook:
      "One of the listed items was used or deliberately positioned during the disturbance, but the original scene was not documented well enough to identify it immediately.",

    motives: [
      {
        label: "FRUSTRATION",

        lead: "Nobody was listening to me. I kept saying something was wrong and everyone just brushed me off.",

        middle:
          "I rearranged everything because I wanted people to finally stop, look around, and pay attention.",
      },

      {
        label: "ANGER",

        lead: "I had been holding it in all night, and eventually I was done pretending I was fine.",

        middle:
          "I wanted everyone to walk back in and know somebody was angry. I did not care what happened after that.",
      },
    ],
  },

  {
    id: "deleted-file",
    title: "The Deleted File",
    incidentLabel: "Digital Sabotage",

    opening:
      "A shared document that several people had spent hours working on was suddenly found altered, with an important section erased and the newest backup missing. The deletion happened during a narrow window when several people were moving between different places.",

    discovery:
      "The changes were specific enough that investigators do not believe they were caused by a random mistake. Whoever did it knew exactly what information would cause the most trouble if it disappeared.",

    evidenceHook:
      "A physical item from the group appears to connect the person responsible to the act, even though the incident itself involved the shared file.",

    motives: [
      {
        label: "COMPETITION",

        lead: "I was tired of doing all that work just so somebody else could get the credit for it.",

        middle:
          "Deleting the file was supposed to prove they could not finish without me. I wanted them to struggle for once.",
      },

      {
        label: "COVER-UP",

        lead: "There was something in that file that I could not let everyone see.",

        middle:
          "I erased it because I thought that would end the problem. Instead, it just gave you a reason to start digging.",
      },
    ],
  },

  {
    id: "anonymous-note",
    title: "The Anonymous Warning",
    incidentLabel: "Threat and Misdirection",

    opening:
      "An anonymous warning was discovered among the group's belongings. The note accused someone in the group of lying and demanded that an upcoming plan be canceled, but it was unsigned and gave no clear explanation of what would happen otherwise.",

    discovery:
      "The note used details that only somebody close to the group should have known. Its placement also suggested the writer had been physically present shortly before the warning was discovered.",

    evidenceHook:
      "One of the listed items appears to have helped the writer prepare, hide, or deliver the warning, but investigators have not identified which one.",

    motives: [
      {
        label: "PROTECTION",

        lead: "I was trying to stop something worse from happening. Nobody was taking the situation seriously.",

        middle:
          "I wrote the warning because I thought scaring everyone would make them back off before somebody got hurt.",
      },

      {
        label: "INTIMIDATION",

        lead: "I wanted everyone nervous. I wanted them wondering who knew what they had been saying behind closed doors.",

        middle:
          "The note was supposed to make people back down without me having to confront them directly.",
      },
    ],
  },

  {
    id: "missing-keepsake",
    title: "The Missing Keepsake",
    incidentLabel: "Disappearance",

    opening:
      "A sentimental keepsake that had been brought out to show the group disappeared before the end of the evening. It had been seen earlier, but when its owner went to put it away, only the empty place where it had been displayed remained.",

    discovery:
      "The keepsake was not something a stranger would have known to look for, and nothing else nearby was taken. That made the people already connected to the evening the focus of the investigation.",

    evidenceHook:
      "Investigators believe one of the listed items played a role in moving, hiding, or distracting attention from the keepsake.",

    motives: [
      {
        label: "SPITE",

        lead: "Every time that thing came out, I had to hear the same story and watch everyone act like it was the most important thing in the world.",

        middle:
          "I hid it because I wanted one night where it did not get all the attention.",
      },

      {
        label: "PANIC",

        lead: "I picked it up when I should not have, and then something happened to it.",

        middle:
          "Once I realized I could not put everything back exactly the way it was, I hid the evidence and hoped nobody would connect it to me.",
      },
    ],
  },

  {
    id: "ruined-game",
    title: "The Ruined Game Night",
    incidentLabel: "Deliberate Disruption",

    opening:
      "A game that had been prepared for the group was found tampered with before anyone could finish it. Important pieces had been moved, part of the setup no longer matched the instructions, and one key element had vanished completely.",

    discovery:
      "The changes were subtle enough that the problem might not have been noticed until much later. Whoever interfered with the game seemed to want confusion rather than immediate destruction.",

    evidenceHook:
      "One of the listed items was connected to the tampering, but several unrelated objects had also been moved during the evening.",

    motives: [
      {
        label: "COMPETITION",

        lead: "I was tired of losing and then hearing everybody joke about it like it was nothing.",

        middle:
          "I messed with the setup because I wanted one game where nobody could beat me fairly or otherwise.",
      },

      {
        label: "ATTENTION",

        lead: "Nobody even noticed I was upset until the whole game fell apart.",

        middle:
          "I wanted to force everyone to stop what they were doing and actually pay attention to me for once.",
      },
    ],
  },
];

/* ============================= */
/* Witness Story Pieces          */
/* ============================= */

const witnessOpeners = [
  "The first report came from {witness}, who said the group had already split up by the time the problem was noticed.",

  "According to {witness}, people had been moving between different places for at least twenty minutes before the discovery.",

  "{witness} remembered seeing several people carrying things earlier in the evening, but could not say which object belonged to whom.",

  "{witness} was the first person to insist the timeline did not make sense and asked everyone to write down where they had been.",
];

const locationDisputes = [
  "Somebody placed the critical moment at {locationA}, while another witness was certain the relevant activity happened near {locationB}.",

  "The exact scene is disputed: {locationA} and {locationB} both appear in witness accounts, and neither has been cleared.",

  "Two separate accounts point investigators toward {locationA} and {locationB}, but there is not enough evidence yet to know which location matters.",
];

const suspectDisputes = [
  "{suspectA} and {suspectB} gave timelines that overlap in an awkward way, although neither account can be disproven yet.",

  "Investigators noticed that {suspectA} and {suspectB} remembered the order of events differently, making the timeline harder to reconstruct.",

  "Both {suspectA} and {suspectB} had opportunities to move through the relevant areas, but opportunity alone is not enough to accuse either of them.",
];

/* ============================= */
/* Page Elements                 */
/* ============================= */

const setupSection = document.querySelector(".setup-section");

const gameScreen = document.getElementById("gameScreen");

const setupMessage = document.getElementById("setupMessage");

const suspectCountSelect = document.getElementById("suspectCountSelect");

const itemCountSelect = document.getElementById("itemCountSelect");

const locationCountSelect = document.getElementById("locationCountSelect");

const suspectEvidence = document.getElementById("suspectEvidence");

const itemEvidence = document.getElementById("itemEvidence");

const locationEvidence = document.getElementById("locationEvidence");

const clueProgress = document.getElementById("clueProgress");

const revealedClue = document.getElementById("revealedClue");

const readyForAccusation = document.getElementById("readyForAccusation");

const accusationPrompt = document.getElementById("accusationPrompt");

const accusationSuspect = document.getElementById("accusationSuspect");

const accusationItem = document.getElementById("accusationItem");

const accusationLocation = document.getElementById("accusationLocation");

const accusationStatement = document.getElementById("accusationStatement");

const makeAccusationBtn = document.getElementById("makeAccusationBtn");

const caseSolvedResult = document.getElementById("caseSolvedResult");

const caseSolvedStatement = document.getElementById("caseSolvedStatement");

const caseSolvedClueCount = document.getElementById("caseSolvedClueCount");

const culpritName = document.getElementById("culpritName");

const culpritTranscriptName = document.getElementById("culpritTranscriptName");

const culpritMotive = document.getElementById("culpritMotive");

const culpritQuote = document.getElementById("culpritQuote");

const newCaseBtn = document.getElementById("newCaseBtn");

const currentPuzzleTitle = document.getElementById("currentPuzzleTitle");

const currentPuzzleDescription = document.getElementById(
  "currentPuzzleDescription",
);

/* Crime scene briefing */

const caseNumber = document.getElementById("caseNumber");

const caseTitle = document.getElementById("caseTitle");

const caseTime = document.getElementById("caseTime");

const caseStory = document.getElementById("caseStory");

const caseSuspectCount = document.getElementById("caseSuspectCount");

const caseItemCount = document.getElementById("caseItemCount");

const caseLocationCount = document.getElementById("caseLocationCount");

/* ============================= */
/* Start New Case                */
/* ============================= */

document.getElementById("startGameBtn").addEventListener("click", startGame);

function startGame() {
  const suspectCount = Number(suspectCountSelect.value);

  const itemCount = Number(itemCountSelect.value);

  const locationCount = Number(locationCountSelect.value);

  const suspects = getRandomSelection(availablePeople, suspectCount);

  const items = getRandomSelection(availableItems, itemCount);

  const locations = getRandomSelection(availableLocations, locationCount);

  const solution = {
    suspect: getRandomItem(suspects),

    item: getRandomItem(items),

    location: getRandomItem(locations),
  };

  const gameState = {
    suspects,

    items,

    locations,

    solution,

    caseBriefing: generateCaseBriefing({
      suspects,
      items,
      locations,
      solution,
    }),

    eliminated: {
      suspects: [],
      items: [],
      locations: [],
    },

    eliminationPlan: createEliminationPlan(
      suspects,
      items,
      locations,
      solution,
    ),

    cluesSolved: 0,

    puzzleSchedule: [],

    currentPuzzleData: null,

    readyForAccusation: false,

    completed: false,
  };

  gameState.puzzleSchedule = createPuzzleSchedule(
    gameState.eliminationPlan.length,
  );

  saveGame(gameState);

  showGame(gameState);
}

/* ============================= */
/* Crime Scene Briefing          */
/* ============================= */

function generateCaseBriefing({ suspects, items, locations, solution }) {
  const generatedNumber = Math.floor(Math.random() * 900 + 100);

  const scenario = getRandomItem(caseScenarios);

  const motive = getRandomItem(scenario.motives);

  const witness = getRandomItem(suspects);

  const suspectPair = getRandomSelection(
    suspects,
    Math.min(2, suspects.length),
  );

  const locationPair = getRandomSelection(
    locations,
    Math.min(2, locations.length),
  );

  const witnessParagraph = fillStoryTemplate(getRandomItem(witnessOpeners), {
    witness,
  });

  const locationParagraph = fillStoryTemplate(getRandomItem(locationDisputes), {
    locationA: locationPair[0] || locations[0],

    locationB: locationPair[1] || locations[0],
  });

  const suspectParagraph = fillStoryTemplate(getRandomItem(suspectDisputes), {
    suspectA: suspectPair[0] || suspects[0],

    suspectB: suspectPair[1] || suspects[0],
  });

  return {
    number: String(generatedNumber),

    title: scenario.title,

    time: generateIncidentTime(),

    incidentType: scenario.id,

    incidentLabel: scenario.incidentLabel,

    story: [
      scenario.opening,

      `${scenario.discovery} ${witnessParagraph}`,

      `${locationParagraph} ${suspectParagraph} ${scenario.evidenceHook}`,
    ],

    motive: {
      label: motive.label,

      statement: generateCulpritStatement({
        suspect: solution.suspect,

        item: solution.item,

        location: solution.location,

        scenario,

        motive,
      }),
    },
  };
}

function fillStoryTemplate(template, replacements) {
  return Object.entries(replacements).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),

    template,
  );
}

/* ============================= */
/* Culprit Statement Generator   */
/* ============================= */

function generateCulpritStatement({
  suspect,
  item,
  location,
  scenario,
  motive,
}) {
  const angryClosers = [
    "And then you had to keep digging until every single excuse I had was gone. Congratulations. You got what you wanted.",

    "You could have left it alone, but no. You kept crossing names off that board until there was nowhere left for me to hide. Happy now?",

    "I thought I had covered it well enough. Then you started pulling apart every little detail like you had something to prove.",

    "Do not stand there acting proud of yourself. If you had stopped asking questions, none of this would have come back to me.",
  ];

  const admissionLines = [
    `Yes, I was the one at ${location}. The ${item} was involved, exactly like you figured out.`,

    `Fine. I was at ${location}, and yes, the ${item} is the piece of evidence that ties it back to me.`,

    `You want the truth? I did it at ${location}. I used the ${item}, and I thought I had been careful enough that nobody would connect it to me.`,
  ];

  const aftermathLines = {
    "sabotaged-surprise":
      "Once I saw how seriously everyone took the damage, I knew admitting it would make everything worse.",

    "missing-envelope":
      "By the time everyone started searching, putting it back would have made me look guilty immediately.",

    "switched-package":
      "When the package was opened and everyone started accusing each other, I knew the joke was over.",

    "disturbed-room":
      "I did not expect the room to turn into a full investigation, but once it did, I refused to be the first person to crack.",

    "deleted-file":
      "I thought the missing information would disappear with the file. Instead, it made everybody look closer.",

    "anonymous-note":
      "I thought the warning would scare everyone into backing off. Instead, it made you even more determined.",

    "missing-keepsake":
      "I kept thinking I could fix it before anyone knew what happened, but every minute made that less possible.",

    "ruined-game":
      "I expected a few arguments and maybe a ruined night. I did not expect you to turn it into an investigation.",
  };

  return [
    motive.lead,

    motive.middle,

    getRandomItem(admissionLines),

    aftermathLines[scenario.id] ||
      "Once everyone realized something was wrong, I knew I had gone too far.",

    getRandomItem(angryClosers),
  ].join(" ");
}

/* ============================= */
/* Incident Time                 */
/* ============================= */

function generateIncidentTime() {
  const hour = Math.floor(Math.random() * 12) + 1;

  const minuteChoices = [
    "03",
    "08",
    "11",
    "17",
    "22",
    "26",
    "31",
    "37",
    "41",
    "46",
    "52",
    "57",
  ];

  const minute = getRandomItem(minuteChoices);

  const period = Math.random() < 0.72 ? "PM" : "AM";

  return `${hour}:${minute} ${period}`;
}

/* ============================= */
/* Saved Case Compatibility      */
/* ============================= */

function ensureCaseBriefing(gameState) {
  const briefing = gameState.caseBriefing;

  const hasCurrentBriefing =
    briefing &&
    briefing.number &&
    briefing.title &&
    briefing.time &&
    Array.isArray(briefing.story) &&
    briefing.story.length >= 3 &&
    briefing.motive &&
    briefing.motive.label &&
    briefing.motive.statement;

  if (hasCurrentBriefing) {
    return;
  }

  gameState.caseBriefing = generateCaseBriefing({
    suspects: gameState.suspects,

    items: gameState.items,

    locations: gameState.locations,

    solution: gameState.solution,
  });

  saveGame(gameState);
}

/* ============================= */
/* Render Case Briefing          */
/* ============================= */

function renderCaseBriefing(gameState) {
  ensureCaseBriefing(gameState);

  caseNumber.textContent = gameState.caseBriefing.number;

  caseTitle.textContent = gameState.caseBriefing.title;

  caseTime.textContent = gameState.caseBriefing.time;

  caseStory.innerHTML = "";

  gameState.caseBriefing.story.forEach((paragraphText) => {
    const paragraph = document.createElement("p");

    paragraph.textContent = paragraphText;

    caseStory.appendChild(paragraph);
  });

  caseSuspectCount.textContent = gameState.suspects.length;

  caseItemCount.textContent = gameState.items.length;

  caseLocationCount.textContent = gameState.locations.length;
}

/* ============================= */
/* Random Helpers                */
/* ============================= */

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

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
  return getRandomSelection(array, array.length);
}

/* ============================= */
/* Elimination Planning          */
/* ============================= */

function createEliminationPlan(suspects, items, locations, solution) {
  const eliminations = [];

  suspects.forEach((suspect) => {
    if (suspect !== solution.suspect) {
      eliminations.push({
        category: "suspects",

        value: suspect,
      });
    }
  });

  items.forEach((item) => {
    if (item !== solution.item) {
      eliminations.push({
        category: "items",

        value: item,
      });
    }
  });

  locations.forEach((location) => {
    if (location !== solution.location) {
      eliminations.push({
        category: "locations",

        value: location,
      });
    }
  });

  return shuffleArray(eliminations);
}

/* ============================= */
/* Puzzle Schedule               */
/* ============================= */

function createPuzzleSchedule(numberOfClues) {
  const schedule = [];

  while (schedule.length < numberOfClues) {
    let puzzleBag = shuffleArray(puzzleTypes);

    /*
     * If the last puzzle from the previous bag happens to be
     * the first puzzle in this new bag, move that puzzle somewhere
     * else so we still never get the same puzzle twice in a row.
     */
    if (schedule.length > 0 && puzzleBag[0] === schedule[schedule.length - 1]) {
      const swapIndex = puzzleBag.findIndex(
        (puzzleType) => puzzleType !== schedule[schedule.length - 1],
      );

      if (swapIndex > 0) {
        [puzzleBag[0], puzzleBag[swapIndex]] = [
          puzzleBag[swapIndex],
          puzzleBag[0],
        ];
      }
    }

    const remainingSlots = numberOfClues - schedule.length;

    schedule.push(...puzzleBag.slice(0, remainingSlots));
  }

  return schedule;
}

function ensurePuzzleSchedule(gameState) {
  const targetLength = gameState.eliminationPlan.length;

  const currentSchedule = Array.isArray(gameState.puzzleSchedule)
    ? gameState.puzzleSchedule
    : [];

  /*
   * If the saved schedule is already the correct length,
   * leave it alone. This prevents an in-progress investigation
   * from suddenly changing puzzles after an update.
   */
  if (currentSchedule.length >= targetLength) {
    return;
  }

  /*
   * Generate a fresh shuffled-bag schedule.
   *
   * Any puzzles the player has already completed remain intact.
   * Only the unfinished portion is replaced.
   */
  const completedPuzzleTypes = currentSchedule.slice(0, gameState.cluesSolved);

  const puzzlesStillNeeded = targetLength - completedPuzzleTypes.length;

  let newRemainingSchedule = createPuzzleSchedule(puzzlesStillNeeded);

  /*
   * Avoid creating a duplicate at the seam between an old
   * completed puzzle and the newly generated schedule.
   */
  if (
    completedPuzzleTypes.length > 0 &&
    newRemainingSchedule.length > 1 &&
    completedPuzzleTypes[completedPuzzleTypes.length - 1] ===
      newRemainingSchedule[0]
  ) {
    const swapIndex = newRemainingSchedule.findIndex(
      (puzzleType) =>
        puzzleType !== completedPuzzleTypes[completedPuzzleTypes.length - 1],
    );

    if (swapIndex > 0) {
      [newRemainingSchedule[0], newRemainingSchedule[swapIndex]] = [
        newRemainingSchedule[swapIndex],
        newRemainingSchedule[0],
      ];
    }
  }

  gameState.puzzleSchedule = [...completedPuzzleTypes, ...newRemainingSchedule];

  saveGame(gameState);
}

function getCurrentPuzzleType(gameState) {
  ensurePuzzleSchedule(gameState);

  return gameState.puzzleSchedule[gameState.cluesSolved] || "cipher";
}

/* ============================= */
/* Main Game Screen              */
/* ============================= */

function showGame(gameState) {
  setupSection.classList.add("hidden");

  gameScreen.classList.remove("hidden");

  renderCaseBriefing(gameState);

  renderEvidenceBoard(gameState);

  updateGameStatus(gameState);

  renderCurrentPuzzle(gameState);
}

/* ============================= */
/* Puzzle Coordinator            */
/* ============================= */

function renderCurrentPuzzle(gameState) {
  if (gameState.readyForAccusation || gameState.completed) {
    hideAllPuzzleInterfaces();

    return;
  }

  revealedClue.classList.add("hidden");

  hideAllPuzzleInterfaces();

  const puzzleType = getCurrentPuzzleType(gameState);

  const puzzleModule = PuzzleRegistry[puzzleType];

  if (puzzleModule && typeof puzzleModule.render === "function") {
    puzzleModule.render({
      gameState,

      saveGame,

      loadGame,

      completeCurrentClue,

      getRandomItem,

      getRandomSelection,
    });

    return;
  }

  renderPuzzlePlaceholder(puzzleType);
}

function hideAllPuzzleInterfaces() {
  Object.values(PuzzleRegistry).forEach((puzzleModule) => {
    if (typeof puzzleModule.hide === "function") {
      puzzleModule.hide();
    }
  });
}

/* ============================= */
/* Puzzle Placeholder            */
/* ============================= */

function renderPuzzlePlaceholder(puzzleType) {
  const puzzleNames = {
    logic: "Logic Puzzle",

    memory: "Memory Match",

    codebreaker: "Code Breaker",

    jigsaw: "Jigsaw Puzzle",

    patternlock: "Pattern Lock",

    evidencesort: "Evidence Sort",
  };

  const title = puzzleNames[puzzleType] || "Investigation Puzzle";

  currentPuzzleTitle.textContent = title;

  currentPuzzleDescription.textContent = `${title} could not be loaded.`;
}

/* ============================= */
/* Complete Current Clue         */
/* ============================= */

function completeCurrentClue(gameState) {
  const savedGame = loadGame();

  if (!savedGame) {
    return;
  }

  if (savedGame.cluesSolved !== gameState.cluesSolved) {
    return;
  }

  const nextClue = gameState.eliminationPlan[gameState.cluesSolved];

  if (!nextClue) {
    gameState.readyForAccusation = true;

    gameState.currentPuzzleData = null;

    saveGame(gameState);

    showGame(gameState);

    return;
  }

  const categoryList = gameState.eliminated[nextClue.category];

  if (!categoryList.includes(nextClue.value)) {
    categoryList.push(nextClue.value);
  }

  gameState.cluesSolved++;

  gameState.currentPuzzleData = null;

  if (gameState.cluesSolved >= gameState.eliminationPlan.length) {
    gameState.readyForAccusation = true;
  }

  saveGame(gameState);

  hideAllPuzzleInterfaces();

  showRevealedClue(nextClue);

  renderEvidenceBoard(gameState);

  updateGameStatus(gameState);

  if (gameState.readyForAccusation) {
    return;
  }

  setTimeout(() => {
    const latestGame = loadGame();

    if (!latestGame) {
      return;
    }

    if (latestGame.cluesSolved !== gameState.cluesSolved) {
      return;
    }

    renderCurrentPuzzle(latestGame);
  }, 1200);
}

/* ============================= */
/* Evidence Board                */
/* ============================= */

function renderEvidenceBoard(gameState) {
  renderEvidenceCategory(
    suspectEvidence,

    gameState.suspects,

    gameState.eliminated.suspects,
  );

  renderEvidenceCategory(
    itemEvidence,

    gameState.items,

    gameState.eliminated.items,
  );

  renderEvidenceCategory(
    locationEvidence,

    gameState.locations,

    gameState.eliminated.locations,
  );
}

function renderEvidenceCategory(container, values, eliminatedValues) {
  container.innerHTML = "";

  values.forEach((value) => {
    const entry = document.createElement("div");

    entry.classList.add("evidence-entry");

    const marker = document.createElement("span");

    marker.classList.add("evidence-marker");

    const text = document.createElement("span");

    text.textContent = value;

    if (eliminatedValues.includes(value)) {
      entry.classList.add("eliminated");

      marker.textContent = "✕";
    } else {
      marker.textContent = "•";
    }

    entry.appendChild(marker);

    entry.appendChild(text);

    container.appendChild(entry);
  });
}

/* ============================= */
/* Revealed Evidence             */
/* ============================= */

function showRevealedClue(clue) {
  let sentence = "";

  if (clue.category === "suspects") {
    sentence = `${clue.value} has been cleared as a suspect.`;
  }

  if (clue.category === "items") {
    sentence = `The ${clue.value} was not involved in the incident.`;
  }

  if (clue.category === "locations") {
    sentence = `${clue.value} has been ruled out as the location.`;
  }

  revealedClue.innerHTML = `
    <span class="clue-stamp">
      NEW EVIDENCE
    </span>

    <p>${sentence}</p>
  `;

  revealedClue.classList.remove("hidden");
}

/* ============================= */
/* Game Status                   */
/* ============================= */

function updateGameStatus(gameState) {
  clueProgress.textContent = `Clues Solved: ${gameState.cluesSolved} / ${gameState.eliminationPlan.length}`;

  if (gameState.completed) {
    revealedClue.classList.add("hidden");

    currentPuzzleTitle.textContent = "Investigation Complete";

    currentPuzzleDescription.textContent =
      "The evidence has been reviewed and the case is closed.";

    readyForAccusation.classList.remove("hidden");

    renderAccusationSection(gameState);

    return;
  }

  if (gameState.readyForAccusation) {
    revealedClue.classList.add("hidden");

    currentPuzzleTitle.textContent = "Final Evidence Review";

    currentPuzzleDescription.textContent =
      "All false leads have been eliminated. Review the final three possibilities below.";

    readyForAccusation.classList.remove("hidden");

    renderAccusationSection(gameState);

    return;
  }

  readyForAccusation.classList.add("hidden");
}

/* ============================= */
/* Final Accusation              */
/* ============================= */

function renderAccusationSection(gameState) {
  const finalSuspect = getRemainingValue(
    gameState.suspects,

    gameState.eliminated.suspects,
  );

  const finalItem = getRemainingValue(
    gameState.items,

    gameState.eliminated.items,
  );

  const finalLocation = getRemainingValue(
    gameState.locations,

    gameState.eliminated.locations,
  );

  accusationSuspect.textContent = finalSuspect || "Unknown";

  accusationItem.textContent = finalItem || "Unknown";

  accusationLocation.textContent = finalLocation || "Unknown";

  accusationStatement.textContent =
    finalSuspect && finalItem && finalLocation
      ? `Your evidence points to ${finalSuspect}, with the ${finalItem}, at ${finalLocation}.`
      : "The case file is missing a final piece of evidence.";

  if (gameState.completed) {
    accusationPrompt.classList.add("hidden");

    caseSolvedResult.classList.remove("hidden");

    caseSolvedStatement.textContent = `${gameState.solution.suspect} was responsible, the ${gameState.solution.item} was involved, and the incident took place at ${gameState.solution.location}.`;

    caseSolvedClueCount.textContent = `${gameState.cluesSolved} / ${gameState.eliminationPlan.length}`;

    renderCulpritStatement(gameState);

    return;
  }

  accusationPrompt.classList.remove("hidden");

  caseSolvedResult.classList.add("hidden");

  makeAccusationBtn.disabled = !(finalSuspect && finalItem && finalLocation);
}

/* ============================= */
/* Culprit Statement             */
/* ============================= */

function renderCulpritStatement(gameState) {
  ensureCaseBriefing(gameState);

  culpritName.textContent = gameState.solution.suspect;

  culpritTranscriptName.textContent = gameState.solution.suspect;

  culpritMotive.textContent = gameState.caseBriefing.motive.label;

  culpritQuote.textContent = `“${gameState.caseBriefing.motive.statement}”`;
}

/* ============================= */
/* Remaining Evidence            */
/* ============================= */

function getRemainingValue(values, eliminatedValues) {
  return values.find((value) => !eliminatedValues.includes(value)) || null;
}

/* ============================= */
/* Make Accusation               */
/* ============================= */

function makeFinalAccusation() {
  const gameState = loadGame();

  if (!gameState || !gameState.readyForAccusation || gameState.completed) {
    return;
  }

  const finalSuspect = getRemainingValue(
    gameState.suspects,

    gameState.eliminated.suspects,
  );

  const finalItem = getRemainingValue(
    gameState.items,

    gameState.eliminated.items,
  );

  const finalLocation = getRemainingValue(
    gameState.locations,

    gameState.eliminated.locations,
  );

  if (!finalSuspect || !finalItem || !finalLocation) {
    return;
  }

  const accusationIsCorrect =
    finalSuspect === gameState.solution.suspect &&
    finalItem === gameState.solution.item &&
    finalLocation === gameState.solution.location;

  if (!accusationIsCorrect) {
    console.error("Final accusation did not match the stored solution.");

    return;
  }

  gameState.completed = true;

  saveGame(gameState);

  hideAllPuzzleInterfaces();

  updateGameStatus(gameState);

  readyForAccusation.scrollIntoView({
    behavior: "smooth",

    block: "center",
  });
}

/* ============================= */
/* Accusation Events             */
/* ============================= */

makeAccusationBtn.addEventListener("click", makeFinalAccusation);

newCaseBtn.addEventListener("click", () => {
  hideAllPuzzleInterfaces();

  localStorage.removeItem(STORAGE_KEY);

  window.location.reload();
});

/* ============================= */
/* Save / Load                   */
/* ============================= */

function saveGame(gameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
}

function loadGame() {
  const savedGame = localStorage.getItem(STORAGE_KEY);

  if (!savedGame) {
    return null;
  }

  try {
    return JSON.parse(savedGame);
  } catch (error) {
    console.error("Could not load game:", error);

    return null;
  }
}

/* ============================= */
/* Reset / Abandon Case          */
/* ============================= */

const resetGameBtn = document.getElementById("resetGameBtn");

const abandonedCaseSecret = document.getElementById("abandonedCaseSecret");

const leaveAbandonedCaseBtn = document.getElementById("leaveAbandonedCaseBtn");

resetGameBtn.addEventListener("click", resetGame);

/* ============================= */
/* Special Abandoned Case        */
/* ============================= */

function isSecretAbandonedCase(gameState) {
  if (!gameState) {
    return false;
  }

  return (
    gameState.suspects.length === 6 &&
    gameState.items.length === 3 &&
    gameState.locations.length === 10
  );
}

/* ============================= */
/* Normal Case Reset             */
/* ============================= */

function actuallyResetGame() {
  hideAllPuzzleInterfaces();

  localStorage.removeItem(STORAGE_KEY);

  window.location.reload();
}

/* ============================= */
/* Abandon Case                  */
/* ============================= */

function resetGame() {
  const shouldReset = window.confirm(
    "Abandon this investigation and start a new case?",
  );

  if (!shouldReset) {
    return;
  }

  const gameState = loadGame();

  /*
    The hidden third clue only
    appears when the abandoned
    investigation contains:

    6 suspects
    3 items
    10 locations
  */

  if (isSecretAbandonedCase(gameState)) {
    revealAbandonedCaseSecret();

    return;
  }

  /*
    Every other case behaves
    exactly as it did before.
  */

  actuallyResetGame();
}

/* ============================= */
/* Reveal Third Number           */
/* ============================= */

function revealAbandonedCaseSecret() {
  if (!abandonedCaseSecret) {
    actuallyResetGame();

    return;
  }

  /*
    Hide any active puzzle UI so
    the abandoned case feels closed.
  */

  hideAllPuzzleInterfaces();

  abandonedCaseSecret.classList.remove("hidden");

  document.body.classList.add("secret-case-open");
}

/* ============================= */
/* Leave Secret Case             */
/* ============================= */

if (leaveAbandonedCaseBtn) {
  leaveAbandonedCaseBtn.addEventListener("click", () => {
    actuallyResetGame();
  });
}

/* ============================= */
/* Initial Load                  */
/* ============================= */

const savedGame = loadGame();

if (savedGame) {
  ensurePuzzleSchedule(savedGame);

  ensureCaseBriefing(savedGame);

  if (typeof savedGame.completed !== "boolean") {
    savedGame.completed = false;

    saveGame(savedGame);
  }

  showGame(savedGame);
}
