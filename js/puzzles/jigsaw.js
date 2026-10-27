(() => {
  /* ============================= */
  /* Jigsaw Configuration          */
  /* ============================= */

  const COLUMNS = 4;
  const ROWS = 3;

  const PIECE_COUNT = COLUMNS * ROWS;

  /*
    Each puzzle can now reconstruct
    a genuinely different piece of
    evidence.
  */

  const reconstructionTypes = [
    "casefile",
    "fingerprint",
    "map",
    "polaroid",
    "evidencebag",
    "letter",
  ];

  /* ============================= */
  /* DOM References                */
  /* ============================= */

  const puzzleElement = document.getElementById("jigsawPuzzle");

  const boardElement = document.getElementById("jigsawBoard");

  const trayElement = document.getElementById("jigsawTray");

  const pieceCountElement = document.getElementById("jigsawPieceCount");

  const messageElement = document.getElementById("jigsawMessage");

  const titleElement = document.getElementById("currentPuzzleTitle");

  const descriptionElement = document.getElementById(
    "currentPuzzleDescription",
  );

  /* ============================= */
  /* Active State                  */
  /* ============================= */

  let activeContext = null;

  let selectedPieceId = null;

  let draggedPieceId = null;

  let completionPending = false;

  let completionTimer = null;

  /* ============================= */
  /* Generate Puzzle               */
  /* ============================= */

  function generatePuzzle() {
    const reconstructionType = getRandomItem(reconstructionTypes);

    const image = createReconstructionImage(reconstructionType);

    const edges = generatePieceEdges();

    const pieces = [];

    for (let index = 0; index < PIECE_COUNT; index++) {
      pieces.push({
        id: `piece-${index}`,

        correctSlot: index,

        placed: false,

        edges: edges[index],
      });
    }

    return {
      type: "jigsaw",

      reconstructionType,

      image,

      pieces,

      trayOrder: shuffleArray(pieces.map((piece) => piece.id)),
    };
  }

  /* ============================= */
  /* Generate Matching Edges       */
  /* ============================= */

  function generatePieceEdges() {
    /*
      Edge values:

       0 = flat outer edge
       1 = tab
      -1 = notch

      Neighboring pieces always receive
      opposite values, so their shapes
      visually fit together.
    */

    const edges = Array.from(
      {
        length: PIECE_COUNT,
      },
      () => ({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }),
    );

    for (let row = 0; row < ROWS; row++) {
      for (let column = 0; column < COLUMNS; column++) {
        const index = row * COLUMNS + column;

        /* Right neighbor */

        if (column < COLUMNS - 1) {
          const direction = Math.random() < 0.5 ? 1 : -1;

          edges[index].right = direction;

          edges[index + 1].left = -direction;
        }

        /* Bottom neighbor */

        if (row < ROWS - 1) {
          const direction = Math.random() < 0.5 ? 1 : -1;

          edges[index].bottom = direction;

          edges[index + COLUMNS].top = -direction;
        }
      }
    }

    return edges;
  }

  /* ============================= */
  /* Reconstruction Artwork        */
  /* ============================= */

  function createReconstructionImage(type) {
    let artwork = "";

    if (type === "fingerprint") {
      artwork = createFingerprintArtwork();
    } else if (type === "map") {
      artwork = createMapArtwork();
    } else if (type === "polaroid") {
      artwork = createPolaroidArtwork();
    } else if (type === "evidencebag") {
      artwork = createEvidenceBagArtwork();
    } else if (type === "letter") {
      artwork = createLetterArtwork();
    } else {
      artwork = createCaseFileArtwork();
    }

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(artwork);
  }

  /* ============================= */
  /* Case File                     */
  /* ============================= */

  function createCaseFileArtwork() {
    const caseNumber = String(Math.floor(100 + Math.random() * 900));

    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="600"
        viewBox="0 0 800 600"
      >
        <rect
          width="800"
          height="600"
          fill="#e8ddc6"
        />

        <rect
          x="28"
          y="28"
          width="744"
          height="544"
          fill="none"
          stroke="#252525"
          stroke-width="5"
        />

        <rect
          x="48"
          y="48"
          width="704"
          height="84"
          fill="#252525"
        />

        <text
          x="75"
          y="101"
          font-family="monospace"
          font-size="34"
          font-weight="700"
          fill="#f3ead8"
        >
          CASE FILE ${caseNumber}
        </text>

        <g
          transform="translate(545 88) rotate(-8)"
        >
          <rect
            x="0"
            y="0"
            width="165"
            height="52"
            fill="none"
            stroke="#7a1f1f"
            stroke-width="5"
          />

          <text
            x="82"
            y="34"
            text-anchor="middle"
            font-family="monospace"
            font-size="19"
            font-weight="700"
            fill="#7a1f1f"
          >
            CONFIDENTIAL
          </text>
        </g>

        <text
          x="70"
          y="185"
          font-family="monospace"
          font-size="18"
          font-weight="700"
          fill="#171717"
        >
          INVESTIGATION REPORT
        </text>

        <line
          x1="70"
          y1="215"
          x2="430"
          y2="215"
          stroke="#756c5c"
          stroke-width="4"
        />

        <line
          x1="70"
          y1="250"
          x2="390"
          y2="250"
          stroke="#756c5c"
          stroke-width="4"
        />

        <line
          x1="70"
          y1="285"
          x2="445"
          y2="285"
          stroke="#756c5c"
          stroke-width="4"
        />

        <rect
          x="500"
          y="180"
          width="205"
          height="155"
          fill="#d4c6a7"
          stroke="#252525"
          stroke-width="3"
        />

        <circle
          cx="602"
          cy="255"
          r="52"
          fill="none"
          stroke="#252525"
          stroke-width="5"
        />

        <rect
          x="65"
          y="365"
          width="670"
          height="145"
          fill="#f1e6cf"
          stroke="#8b806a"
          stroke-width="2"
        />

        <text
          x="85"
          y="400"
          font-family="monospace"
          font-size="16"
          font-weight="700"
          fill="#7a1f1f"
        >
          DETECTIVE NOTES
        </text>

        <line
          x1="85"
          y1="430"
          x2="700"
          y2="430"
          stroke="#9b9079"
          stroke-width="2"
        />

        <line
          x1="85"
          y1="462"
          x2="640"
          y2="462"
          stroke="#9b9079"
          stroke-width="2"
        />

        <line
          x1="85"
          y1="494"
          x2="520"
          y2="494"
          stroke="#9b9079"
          stroke-width="2"
        />

        <g
          transform="translate(600 470) rotate(-9)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="75"
            ry="35"
            fill="none"
            stroke="#7a1f1f"
            stroke-width="5"
          />

          <text
            x="0"
            y="7"
            text-anchor="middle"
            font-family="monospace"
            font-size="20"
            font-weight="700"
            fill="#7a1f1f"
          >
            REVIEWED
          </text>
        </g>
      </svg>
    `;
  }

  /* ============================= */
  /* Fingerprint Record            */
  /* ============================= */

  function createFingerprintArtwork() {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="600"
        viewBox="0 0 800 600"
      >
        <rect
          width="800"
          height="600"
          fill="#e7decb"
        />

        <rect
          x="32"
          y="32"
          width="736"
          height="536"
          fill="none"
          stroke="#242424"
          stroke-width="4"
        />

        <text
          x="65"
          y="90"
          font-family="monospace"
          font-size="31"
          font-weight="700"
          fill="#242424"
        >
          LATENT PRINT RECORD
        </text>

        <line
          x1="65"
          y1="110"
          x2="735"
          y2="110"
          stroke="#242424"
          stroke-width="3"
        />

        <rect
          x="75"
          y="150"
          width="430"
          height="340"
          fill="#d7c9ad"
          stroke="#242424"
          stroke-width="4"
        />

        <g
          transform="translate(290 320)"
          fill="none"
          stroke="#282828"
          stroke-width="6"
          stroke-linecap="round"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="155"
            ry="125"
          />

          <ellipse
            cx="0"
            cy="0"
            rx="135"
            ry="105"
          />

          <ellipse
            cx="0"
            cy="0"
            rx="112"
            ry="86"
          />

          <ellipse
            cx="0"
            cy="0"
            rx="88"
            ry="66"
          />

          <ellipse
            cx="0"
            cy="0"
            rx="64"
            ry="46"
          />

          <path
            d="
              M-95 90
              C-150 30,-110 -80,-30 -95
              C70 -115,145 -30,120 65
            "
          />

          <path
            d="
              M-65 105
              C-100 45,-75 -48,-15 -65
              C55 -85,105 -20,92 55
            "
          />

          <path
            d="
              M-30 108
              C-48 65,-40 8,-4 -18
              C35 -48,74 -10,66 46
            "
          />
        </g>

        <text
          x="555"
          y="175"
          font-family="monospace"
          font-size="15"
          font-weight="700"
          fill="#7a1f1f"
        >
          SAMPLE DATA
        </text>

        <line
          x1="550"
          y1="205"
          x2="710"
          y2="205"
          stroke="#756c5c"
          stroke-width="3"
        />

        <line
          x1="550"
          y1="240"
          x2="685"
          y2="240"
          stroke="#756c5c"
          stroke-width="3"
        />

        <line
          x1="550"
          y1="275"
          x2="725"
          y2="275"
          stroke="#756c5c"
          stroke-width="3"
        />

        <g
          transform="translate(620 405) rotate(-10)"
        >
          <rect
            x="-85"
            y="-32"
            width="170"
            height="64"
            fill="none"
            stroke="#7a1f1f"
            stroke-width="5"
          />

          <text
            x="0"
            y="8"
            text-anchor="middle"
            font-family="monospace"
            font-size="21"
            font-weight="700"
            fill="#7a1f1f"
          >
            MATCH?
          </text>
        </g>

        <text
          x="70"
          y="545"
          font-family="monospace"
          font-size="13"
          fill="#554d40"
        >
          EVIDENCE LAB • PRINT COMPARISON
        </text>
      </svg>
    `;
  }

  /* ============================= */
  /* Crime Scene Map               */
  /* ============================= */

  function createMapArtwork() {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="600"
        viewBox="0 0 800 600"
      >
        <rect
          width="800"
          height="600"
          fill="#ded6bd"
        />

        <path
          d="
            M0 150
            L800 110
            M0 310
            L800 340
            M165 0
            L210 600
            M420 0
            L390 600
            M650 0
            L610 600
          "
          fill="none"
          stroke="#aaa082"
          stroke-width="28"
        />

        <path
          d="
            M0 150
            L800 110
            M0 310
            L800 340
            M165 0
            L210 600
            M420 0
            L390 600
            M650 0
            L610 600
          "
          fill="none"
          stroke="#f2ead4"
          stroke-width="18"
        />

        <rect
          x="30"
          y="30"
          width="740"
          height="540"
          fill="none"
          stroke="#252525"
          stroke-width="4"
        />

        <text
          x="60"
          y="78"
          font-family="monospace"
          font-size="29"
          font-weight="700"
          fill="#252525"
        >
          INCIDENT LOCATION MAP
        </text>

        <circle
          cx="535"
          cy="255"
          r="54"
          fill="none"
          stroke="#7a1f1f"
          stroke-width="8"
        />

        <line
          x1="497"
          y1="217"
          x2="573"
          y2="293"
          stroke="#7a1f1f"
          stroke-width="8"
        />

        <line
          x1="573"
          y1="217"
          x2="497"
          y2="293"
          stroke="#7a1f1f"
          stroke-width="8"
        />

        <path
          d="
            M110 480
            C180 430,245 510,320 445
            C380 392,440 435,505 370
          "
          fill="none"
          stroke="#7a1f1f"
          stroke-width="6"
          stroke-dasharray="10 10"
        />

        <circle
          cx="110"
          cy="480"
          r="12"
          fill="#7a1f1f"
        />

        <circle
          cx="505"
          cy="370"
          r="12"
          fill="#7a1f1f"
        />

        <text
          x="90"
          y="520"
          font-family="monospace"
          font-size="16"
          font-weight="700"
          fill="#7a1f1f"
        >
          POSSIBLE ROUTE
        </text>

        <rect
          x="585"
          y="420"
          width="140"
          height="95"
          fill="#eee6d1"
          stroke="#252525"
          stroke-width="3"
        />

        <text
          x="603"
          y="450"
          font-family="monospace"
          font-size="13"
          fill="#252525"
        >
          N
        </text>

        <path
          d="
            M655 492
            L655 445
            L642 462
            M655 445
            L668 462
          "
          fill="none"
          stroke="#252525"
          stroke-width="4"
        />
      </svg>
    `;
  }

  /* ============================= */
  /* Polaroid                      */
  /* ============================= */

  function createPolaroidArtwork() {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="600"
        viewBox="0 0 800 600"
      >
        <rect
          width="800"
          height="600"
          fill="#9b927e"
        />

        <g
          transform="translate(400 300) rotate(-4)"
        >
          <rect
            x="-260"
            y="-235"
            width="520"
            height="470"
            fill="#eee9db"
            stroke="#302f2b"
            stroke-width="5"
          />

          <rect
            x="-225"
            y="-200"
            width="450"
            height="330"
            fill="#5c665f"
          />

          <rect
            x="-225"
            y="40"
            width="450"
            height="90"
            fill="#3f4c46"
          />

          <circle
            cx="-115"
            cy="-70"
            r="64"
            fill="#222825"
          />

          <circle
            cx="100"
            cy="-90"
            r="48"
            fill="#73796f"
          />

          <path
            d="
              M-225 75
              L-130 -40
              L-40 40
              L45 -80
              L145 10
              L225 -45
              L225 130
              L-225 130
              Z
            "
            fill="#222825"
          />

          <text
            x="0"
            y="190"
            text-anchor="middle"
            font-family="monospace"
            font-size="22"
            font-weight="700"
            fill="#38352f"
          >
            11:43 PM — CAMERA 03
          </text>
        </g>

        <g
          transform="translate(610 95) rotate(8)"
        >
          <rect
            x="-85"
            y="-30"
            width="170"
            height="60"
            fill="none"
            stroke="#7a1f1f"
            stroke-width="5"
          />

          <text
            x="0"
            y="8"
            text-anchor="middle"
            font-family="monospace"
            font-size="20"
            font-weight="700"
            fill="#7a1f1f"
          >
            EVIDENCE
          </text>
        </g>
      </svg>
    `;
  }

  /* ============================= */
  /* Evidence Bag                  */
  /* ============================= */

  function createEvidenceBagArtwork() {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="600"
        viewBox="0 0 800 600"
      >
        <rect
          width="800"
          height="600"
          fill="#b1a88f"
        />

        <path
          d="
            M175 80
            L625 80
            L665 515
            L135 515
            Z
          "
          fill="#ddd6c1"
          stroke="#282828"
          stroke-width="5"
        />

        <line
          x1="170"
          y1="130"
          x2="630"
          y2="130"
          stroke="#7a1f1f"
          stroke-width="7"
        />

        <text
          x="400"
          y="185"
          text-anchor="middle"
          font-family="monospace"
          font-size="28"
          font-weight="700"
          fill="#7a1f1f"
        >
          EVIDENCE
        </text>

        <text
          x="205"
          y="235"
          font-family="monospace"
          font-size="15"
          fill="#282828"
        >
          ITEM:
        </text>

        <line
          x1="270"
          y1="230"
          x2="580"
          y2="230"
          stroke="#282828"
          stroke-width="2"
        />

        <text
          x="205"
          y="280"
          font-family="monospace"
          font-size="15"
          fill="#282828"
        >
          DATE:
        </text>

        <line
          x1="270"
          y1="275"
          x2="580"
          y2="275"
          stroke="#282828"
          stroke-width="2"
        />

        <text
          x="205"
          y="325"
          font-family="monospace"
          font-size="15"
          fill="#282828"
        >
          CASE:
        </text>

        <line
          x1="270"
          y1="320"
          x2="580"
          y2="320"
          stroke="#282828"
          stroke-width="2"
        />

        <ellipse
          cx="405"
          cy="415"
          rx="95"
          ry="48"
          fill="#5f5b50"
          opacity="0.55"
        />

        <path
          d="
            M345 425
            C365 355,450 350,470 420
            C445 452,375 460,345 425
            Z
          "
          fill="#272724"
        />

        <g
          transform="translate(545 420) rotate(-7)"
        >
          <rect
            x="-60"
            y="-28"
            width="120"
            height="56"
            fill="none"
            stroke="#7a1f1f"
            stroke-width="4"
          />

          <text
            x="0"
            y="7"
            text-anchor="middle"
            font-family="monospace"
            font-size="16"
            font-weight="700"
            fill="#7a1f1f"
          >
            SEALED
          </text>
        </g>
      </svg>
    `;
  }

  /* ============================= */
  /* Anonymous Letter              */
  /* ============================= */

  function createLetterArtwork() {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="600"
        viewBox="0 0 800 600"
      >
        <rect
          width="800"
          height="600"
          fill="#b5aa91"
        />

        <g
          transform="translate(400 300) rotate(2)"
        >
          <rect
            x="-300"
            y="-235"
            width="600"
            height="470"
            fill="#ece3d0"
            stroke="#3b3932"
            stroke-width="4"
          />

          <text
            x="-245"
            y="-165"
            font-family="monospace"
            font-size="21"
            font-weight="700"
            fill="#252525"
          >
            TO THE INVESTIGATOR,
          </text>

          <line
            x1="-245"
            y1="-120"
            x2="230"
            y2="-120"
            stroke="#716958"
            stroke-width="3"
          />

          <line
            x1="-245"
            y1="-75"
            x2="245"
            y2="-75"
            stroke="#716958"
            stroke-width="3"
          />

          <line
            x1="-245"
            y1="-30"
            x2="205"
            y2="-30"
            stroke="#716958"
            stroke-width="3"
          />

          <line
            x1="-245"
            y1="15"
            x2="255"
            y2="15"
            stroke="#716958"
            stroke-width="3"
          />

          <line
            x1="-245"
            y1="60"
            x2="185"
            y2="60"
            stroke="#716958"
            stroke-width="3"
          />

          <text
            x="-245"
            y="135"
            font-family="monospace"
            font-size="24"
            font-weight="700"
            fill="#7a1f1f"
          >
            YOU MISSED SOMETHING.
          </text>

          <text
            x="105"
            y="190"
            font-family="monospace"
            font-size="20"
            font-style="italic"
            fill="#252525"
          >
            — ?
          </text>
        </g>

        <circle
          cx="655"
          cy="115"
          r="58"
          fill="none"
          stroke="#7a1f1f"
          stroke-width="6"
        />

        <text
          x="655"
          y="122"
          text-anchor="middle"
          font-family="monospace"
          font-size="17"
          font-weight="700"
          fill="#7a1f1f"
        >
          RECEIVED
        </text>
      </svg>
    `;
  }

  /* ============================= */
  /* Render Puzzle                 */
  /* ============================= */

  function render(context) {
    clearCompletionTimer();

    activeContext = context;

    selectedPieceId = null;

    draggedPieceId = null;

    completionPending = false;

    const { gameState, saveGame } = context;

    puzzleElement.classList.remove("hidden");

    titleElement.textContent = "Evidence Reconstruction";

    descriptionElement.textContent =
      "Reassemble the damaged evidence to recover the next clue.";

    if (
      !gameState.currentPuzzleData ||
      gameState.currentPuzzleData.type !== "jigsaw"
    ) {
      gameState.currentPuzzleData = generatePuzzle();

      saveGame(gameState);
    }

    ensureCompatibleSave(gameState);

    messageElement.textContent =
      "Select a fragment, then choose where it belongs.";

    renderBoard(gameState);

    renderTray(gameState);

    updateStatus(gameState);
  }

  /* ============================= */
  /* Compatibility                 */
  /* ============================= */

  function ensureCompatibleSave(gameState) {
    const puzzleData = gameState.currentPuzzleData;

    /*
      Old rectangular Jigsaw saves do
      not contain edge information.

      Give them new matching edges
      without throwing away placement
      progress.
    */

    if (
      !Array.isArray(puzzleData.pieces) ||
      puzzleData.pieces.length !== PIECE_COUNT
    ) {
      gameState.currentPuzzleData = generatePuzzle();

      activeContext.saveGame(gameState);

      return;
    }

    const missingEdges = puzzleData.pieces.some((piece) => !piece.edges);

    if (missingEdges) {
      const edges = generatePieceEdges();

      puzzleData.pieces.forEach((piece, index) => {
        piece.edges = edges[index];
      });
    }

    if (!Array.isArray(puzzleData.trayOrder)) {
      puzzleData.trayOrder = shuffleArray(
        puzzleData.pieces.map((piece) => piece.id),
      );
    }

    if (!puzzleData.reconstructionType) {
      puzzleData.reconstructionType = "casefile";
    }

    if (!puzzleData.image) {
      puzzleData.image = createReconstructionImage(
        puzzleData.reconstructionType,
      );
    }

    activeContext.saveGame(gameState);
  }

  /* ============================= */
  /* Hide Puzzle                   */
  /* ============================= */

  function hide() {
    clearCompletionTimer();

    puzzleElement.classList.add("hidden");

    selectedPieceId = null;

    draggedPieceId = null;

    completionPending = false;

    messageElement.textContent = "";

    activeContext = null;
  }

  /* ============================= */
  /* Render Board                  */
  /* ============================= */

  function renderBoard(gameState) {
    boardElement.innerHTML = "";

    boardElement.classList.remove("completed");

    const puzzleData = gameState.currentPuzzleData;

    for (let slotIndex = 0; slotIndex < PIECE_COUNT; slotIndex++) {
      const slot = document.createElement("button");

      slot.type = "button";

      slot.classList.add("jigsaw-slot");

      slot.dataset.slotIndex = String(slotIndex);

      slot.setAttribute("aria-label", `Evidence position ${slotIndex + 1}`);

      const placedPiece = puzzleData.pieces.find(
        (piece) => piece.correctSlot === slotIndex && piece.placed,
      );

      if (placedPiece) {
        addPieceVisual(slot, placedPiece, puzzleData.image, true);
      }

      /* ============================= */
      /* Click / Tap Placement         */
      /* ============================= */

      slot.addEventListener("click", () => {
        if (selectedPieceId) {
          attemptPlacement(selectedPieceId, slotIndex, slot);
        }
      });

      /* ============================= */
      /* Drag Placement                */
      /* ============================= */

      slot.addEventListener("dragover", (event) => {
        event.preventDefault();

        if (draggedPieceId) {
          slot.classList.add("drag-over");
        }
      });

      slot.addEventListener("dragleave", () => {
        slot.classList.remove("drag-over");
      });

      slot.addEventListener("drop", (event) => {
        event.preventDefault();

        slot.classList.remove("drag-over");

        const transferredId = event.dataTransfer.getData("text/plain");

        const pieceId = draggedPieceId || transferredId;

        if (!pieceId) {
          return;
        }

        attemptPlacement(pieceId, slotIndex, slot);

        draggedPieceId = null;
      });

      boardElement.appendChild(slot);
    }

    if (getPlacedCount(puzzleData) === PIECE_COUNT) {
      boardElement.classList.add("completed");
    }
  }

  /* ============================= */
  /* Render Tray                   */
  /* ============================= */

  function renderTray(gameState) {
    trayElement.innerHTML = "";

    const puzzleData = gameState.currentPuzzleData;

    puzzleData.trayOrder.forEach((pieceId) => {
      const pieceData = puzzleData.pieces.find((piece) => piece.id === pieceId);

      if (!pieceData || pieceData.placed) {
        return;
      }

      const pieceElement = document.createElement("button");

      pieceElement.type = "button";

      pieceElement.classList.add("jigsaw-piece");

      pieceElement.dataset.pieceId = pieceData.id;

      pieceElement.draggable = true;

      pieceElement.setAttribute("aria-label", "Unplaced evidence fragment");

      addPieceVisual(pieceElement, pieceData, puzzleData.image, false);

      if (pieceData.id === selectedPieceId) {
        pieceElement.classList.add("selected");
      }

      /* ============================= */
      /* Click / Tap Selection         */
      /* ============================= */

      pieceElement.addEventListener("click", () => {
        selectPiece(pieceData.id, gameState);
      });

      /* ============================= */
      /* Drag Events                   */
      /* ============================= */

      pieceElement.addEventListener("dragstart", (event) => {
        draggedPieceId = pieceData.id;

        selectedPieceId = pieceData.id;

        event.dataTransfer.effectAllowed = "move";

        event.dataTransfer.setData("text/plain", pieceData.id);
      });

      pieceElement.addEventListener("dragend", () => {
        draggedPieceId = null;

        document.querySelectorAll(".jigsaw-slot.drag-over").forEach((slot) => {
          slot.classList.remove("drag-over");
        });
      });

      trayElement.appendChild(pieceElement);
    });

    if (trayElement.children.length === 0) {
      const complete = document.createElement("p");

      complete.textContent = "All fragments placed.";

      complete.style.margin = "auto";

      complete.style.opacity = "0.6";

      trayElement.appendChild(complete);
    }
  }

  /* ============================= */
  /* Add Jigsaw Piece Visual       */
  /* ============================= */

  function addPieceVisual(container, piece, image, placed) {
    const visual = document.createElement("span");

    visual.classList.add("jigsaw-piece-visual");

    const svg = createPieceSvg(piece, image);

    visual.innerHTML = svg;

    if (placed) {
      visual.style.inset = "-18%";
    }

    container.appendChild(visual);
  }

  /* ============================= */
  /* Create Irregular SVG Piece    */
  /* ============================= */

  function createPieceSvg(piece, image) {
    const row = Math.floor(piece.correctSlot / COLUMNS);

    const column = piece.correctSlot % COLUMNS;

    /*
      The visible SVG is 136 × 136.

      The central piece occupies:
        x 18 → 118
        y 18 → 118

      This leaves room for tabs to
      protrude outward.
    */

    const path = createPiecePath(piece.edges);

    /*
      Full puzzle image is scaled so
      each 100×100 core corresponds
      to one quarter by one third of
      the original artwork.
    */

    const imageWidth = COLUMNS * 100;

    const imageHeight = ROWS * 100;

    const imageX = 18 - column * 100;

    const imageY = 18 - row * 100;

    const clipId = `clip-${piece.id}-${Math.random().toString(36).slice(2)}`;

    return `
      <svg
        class="jigsaw-piece-svg"
        viewBox="0 0 136 136"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath
            id="${clipId}"
          >
            <path
              d="${path}"
            />
          </clipPath>
        </defs>

        <g
          clip-path="url(#${clipId})"
        >
          <rect
            x="0"
            y="0"
            width="136"
            height="136"
            fill="#e6dcc8"
          />

          <image
            href="${image}"
            x="${imageX}"
            y="${imageY}"
            width="${imageWidth}"
            height="${imageHeight}"
            preserveAspectRatio="none"
          />
        </g>

        <path
          d="${path}"
          fill="none"
          stroke="#292720"
          stroke-width="2.2"
          stroke-linejoin="round"
        />
      </svg>
    `;
  }

  /* ============================= */
  /* Build Jigsaw Shape            */
  /* ============================= */

  function createPiecePath(edges) {
    const left = 18;
    const top = 18;

    const right = 118;
    const bottom = 118;

    let path = `M ${left} ${top}`;

    /* ============================= */
    /* Top Edge                     */
    /* ============================= */

    path += createHorizontalEdge(left, right, top, edges.top, -1);

    /* ============================= */
    /* Right Edge                   */
    /* ============================= */

    path += createVerticalEdge(top, bottom, right, edges.right, 1);

    /* ============================= */
    /* Bottom Edge                  */
    /* ============================= */

    path += createHorizontalEdgeReverse(right, left, bottom, edges.bottom, 1);

    /* ============================= */
    /* Left Edge                    */
    /* ============================= */

    path += createVerticalEdgeReverse(bottom, top, left, edges.left, -1);

    path += " Z";

    return path;
  }

  /* ============================= */
  /* Horizontal Top Edge           */
  /* ============================= */

  function createHorizontalEdge(start, end, y, edge, outwardDirection) {
    if (edge === 0) {
      return ` L ${end} ${y}`;
    }

    const protrusion = edge * outwardDirection * 18;

    return `
      L 55 ${y}
      C 58 ${y}
        58 ${y + protrusion}
        68 ${y + protrusion}
      C 78 ${y + protrusion}
        78 ${y}
        81 ${y}
      L ${end} ${y}
    `;
  }

  /* ============================= */
  /* Horizontal Bottom Edge        */
  /* ============================= */

  function createHorizontalEdgeReverse(start, end, y, edge, outwardDirection) {
    if (edge === 0) {
      return ` L ${end} ${y}`;
    }

    const protrusion = edge * outwardDirection * 18;

    return `
      L 81 ${y}
      C 78 ${y}
        78 ${y + protrusion}
        68 ${y + protrusion}
      C 58 ${y + protrusion}
        58 ${y}
        55 ${y}
      L ${end} ${y}
    `;
  }

  /* ============================= */
  /* Vertical Right Edge           */
  /* ============================= */

  function createVerticalEdge(start, end, x, edge, outwardDirection) {
    if (edge === 0) {
      return ` L ${x} ${end}`;
    }

    const protrusion = edge * outwardDirection * 18;

    return `
      L ${x} 55
      C ${x} 58
        ${x + protrusion} 58
        ${x + protrusion} 68
      C ${x + protrusion} 78
        ${x} 78
        ${x} 81
      L ${x} ${end}
    `;
  }

  /* ============================= */
  /* Vertical Left Edge            */
  /* ============================= */

  function createVerticalEdgeReverse(start, end, x, edge, outwardDirection) {
    if (edge === 0) {
      return ` L ${x} ${end}`;
    }

    const protrusion = edge * outwardDirection * 18;

    return `
      L ${x} 81
      C ${x} 78
        ${x + protrusion} 78
        ${x + protrusion} 68
      C ${x + protrusion} 58
        ${x} 58
        ${x} 55
      L ${x} ${end}
    `;
  }

  /* ============================= */
  /* Piece Selection               */
  /* ============================= */

  function selectPiece(pieceId, gameState) {
    if (completionPending) {
      return;
    }

    if (selectedPieceId === pieceId) {
      selectedPieceId = null;

      messageElement.textContent = "Selection cleared.";
    } else {
      selectedPieceId = pieceId;

      messageElement.textContent =
        "Fragment selected. Choose a position on the evidence board.";
    }

    renderTray(gameState);
  }

  /* ============================= */
  /* Placement                     */
  /* ============================= */

  function attemptPlacement(pieceId, slotIndex, slotElement) {
    if (!activeContext || completionPending) {
      return;
    }

    const { gameState, saveGame } = activeContext;

    const puzzleData = gameState.currentPuzzleData;

    const piece = puzzleData.pieces.find(
      (candidate) => candidate.id === pieceId,
    );

    if (!piece || piece.placed) {
      return;
    }

    /*
      Fragments only snap into their
      correct position.
    */

    if (piece.correctSlot !== slotIndex) {
      messageElement.textContent = "That fragment does not fit there.";

      showWrongSlot(slotElement);

      return;
    }

    piece.placed = true;

    selectedPieceId = null;

    draggedPieceId = null;

    saveGame(gameState);

    messageElement.textContent = "Fragment recovered.";

    renderBoard(gameState);

    renderTray(gameState);

    updateStatus(gameState);

    checkCompletion(gameState);
  }

  /* ============================= */
  /* Wrong Slot Animation          */
  /* ============================= */

  function showWrongSlot(slotElement) {
    if (!slotElement) {
      return;
    }

    slotElement.classList.remove("wrong");

    void slotElement.offsetWidth;

    slotElement.classList.add("wrong");

    setTimeout(() => {
      slotElement.classList.remove("wrong");
    }, 320);
  }

  /* ============================= */
  /* Status                        */
  /* ============================= */

  function updateStatus(gameState) {
    const placedCount = getPlacedCount(gameState.currentPuzzleData);

    pieceCountElement.textContent = `${placedCount} / ${PIECE_COUNT}`;
  }

  function getPlacedCount(puzzleData) {
    return puzzleData.pieces.filter((piece) => piece.placed).length;
  }

  /* ============================= */
  /* Completion                    */
  /* ============================= */

  function checkCompletion(gameState) {
    if (getPlacedCount(gameState.currentPuzzleData) !== PIECE_COUNT) {
      return;
    }

    completionPending = true;

    boardElement.classList.add("completed");

    messageElement.textContent =
      "Evidence reconstructed. New evidence unlocked.";

    completionTimer = setTimeout(() => {
      if (!activeContext || !completionPending) {
        return;
      }

      completionPending = false;

      activeContext.completeCurrentClue(gameState);
    }, 1000);
  }

  /* ============================= */
  /* Helpers                       */
  /* ============================= */

  function clearCompletionTimer() {
    if (completionTimer) {
      clearTimeout(completionTimer);

      completionTimer = null;
    }
  }

  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
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

  PuzzleRegistry.jigsaw = {
    render,
    hide,
  };
})();
