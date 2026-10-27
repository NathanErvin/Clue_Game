# Clue Game — Interactive Mystery & Puzzle Game

A browser-based mystery-solving game inspired by the classic board game *Clue*. Players take on the role of a detective, solving interactive puzzles, collecting evidence, and eliminating possibilities to uncover the truth behind a randomly generated mystery.

Built using **HTML, CSS, and JavaScript**, the game combines deduction, logic, memory, and problem-solving into a customizable investigation experience.

## How to Play

Every investigation revolves around three questions:

- **Who** was responsible?
- **What item** was involved?
- **Where** did the incident occur?

### 1. Set Up Your Investigation

Before starting, choose the number of possible suspects, items, and locations.

Each category supports **3–10 options**, allowing you to customize the size and difficulty of your mystery.

The game randomly selects participants, objects, and locations from predefined lists, then secretly chooses one from each category as the solution.

### 2. Review Your Case

Once the investigation begins, you'll receive a case briefing containing information about the mysterious incident.

Each case includes a scenario, an incident description, and a set of possible suspects, items, and locations.

### 3. Solve Puzzles

Complete interactive puzzles to uncover clues about the mystery.

Successfully solving puzzles reveals evidence that helps eliminate incorrect possibilities.

### 4. Analyze the Evidence

Use the evidence board to track your investigation, review clues, and narrow down the possible solutions.

### 5. Solve the Mystery

When you believe you've identified the correct suspect, item, and location, make your final accusation.

Use your deductive reasoning to solve the case!

---

## Features

### Randomized Investigations

Every new game generates a unique mystery using randomly selected suspects, items, and locations.

- Customizable investigation sizes
- Randomly selected solutions
- Multiple crime scene scenarios
- Dynamic case briefings
- Different combinations of evidence and puzzles

### Eight Interactive Puzzle Types

The game includes eight different puzzle modules, each designed to test a different skill.

| Puzzle | Description |
|---|---|
| Cipher | Decode encrypted messages to uncover information |
| Word Search | Find hidden investigation-related words |
| Logic Puzzle | Use deductive reasoning to solve logic challenges |
| Memory | Test your memory by identifying matching patterns |
| Codebreaker | Discover a hidden code using logical deduction |
| Jigsaw | Reassemble scrambled puzzle pieces |
| Pattern Lock | Memorize and reproduce sequences |
| Evidence Sort | Organize evidence by analyzing clues and relationships |

Each puzzle has its own JavaScript logic and CSS styling, allowing the different challenges to operate independently.

### Evidence Board

The evidence board serves as the central hub for each investigation.

Players can review their available options, track eliminated possibilities, and monitor the number of clues they've uncovered.

### Dynamic Case Stories

Investigations feature different mystery scenarios, each with its own narrative.

The game generates case details to give players context for the investigation and make each mystery feel like a distinct case.

### Automatic Save System

The game uses the browser's `localStorage` to preserve investigation progress.

This allows players to:

- Resume an unfinished investigation
- Keep their current case information
- Preserve puzzle progress
- Continue after refreshing or reopening the page

Saved data is stored locally in the player's browser and does not require an account.

### Interactive Interface

The game features a detective-themed interface with dedicated sections for case setup, investigation details, puzzles, and evidence tracking.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and game interface |
| CSS3 | Responsive layouts, styling, and puzzle visuals |
| JavaScript | Game mechanics, puzzle generation, and interactions |
| Local Storage API | Saving and restoring investigation progress |
| DOM API | Dynamic updates to game screens and puzzle elements |

The project is built entirely with **vanilla JavaScript**, without requiring React, Angular, Vue, or other front-end frameworks.

No database or backend server is required.

---

## Project Structure

```text
Clue/
│
├── index.html                  # Main game interface
├── styles.css                  # Main application styling
│
├── js/
│   ├── game.js                 # Main game logic and case management
│   │
│   └── puzzles/
│       ├── registry.js         # Puzzle module registry
│       ├── cipher.js           # Cipher puzzle
│       ├── wordsearch.js       # Word search puzzle
│       ├── logic.js            # Logic puzzle
│       ├── memory.js           # Memory puzzle
│       ├── codebreaker.js      # Codebreaker puzzle
│       ├── jigsaw.js           # Jigsaw puzzle
│       ├── patternlock.js      # Pattern lock puzzle
│       └── evidencesort.js     # Evidence sorting puzzle
│
├── css/
│   └── puzzles/
│       ├── cipher.css
│       ├── wordsearch.css
│       ├── logic.css
│       ├── memory.css
│       ├── codebreaker.css
│       ├── jigsaw.css
│       ├── patternlock.css
│       └── evidencesort.css
│
└── .vscode/
    └── settings.json
```

## Getting Started

### Prerequisites

You will need:

- A modern web browser (Chrome, Edge, Firefox, or Safari)
- A code editor such as Visual Studio Code (recommended)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

**2. Navigate to the project**

```bash
cd YOUR-REPOSITORY
```

**3. Launch the game**

Open `index.html` in your web browser.

Alternatively, use the Live Server extension in Visual Studio Code to launch the game through a local development server.

**4. Begin your investigation**

Select your preferred number of suspects, items, and locations, then click **Start Investigation**.

No additional dependencies or installation steps are required.

---

## How It Works

### Game Management

The primary game logic is located in `js/game.js`.

This file handles the core investigation systems, including:

- Creating randomized cases
- Selecting suspects, items, and locations
- Generating case scenarios
- Tracking investigation progress
- Managing evidence and deductions
- Coordinating puzzle progression
- Saving and restoring game state

### Modular Puzzle System

The game uses a puzzle registry to keep the individual puzzle modules separate from the main game logic.

Each puzzle registers its functionality with the shared `PuzzleRegistry` object.

This modular structure makes it easier to maintain existing puzzles and introduce new ones without rewriting the main game.

### Local Save Data

Investigation progress is saved in the browser using the following local storage key:

```javascript
const STORAGE_KEY = "mystery-game-save";
```

Because the game uses browser storage, clearing site data may erase saved investigation progress.

---

## Possible Future Improvements

Potential additions to the game include:

- Additional puzzle types and mystery scenarios
- More suspects, items, and locations
- Difficulty settings for individual puzzles
- Investigation statistics and completion history
- Timed mystery challenges
- Achievements and rewards
- Expanded storylines and case narratives
- Additional accessibility and mobile improvements

---

## Disclaimer

This project is an unofficial, fan-made mystery game inspired by the classic board game *Clue*.

*Clue* and related trademarks belong to their respective owners. This project is not affiliated with or endorsed by the official creators or publishers of *Clue*.

This game was created for personal, educational, and entertainment purposes.

---

## About the Project

This project was developed to explore interactive web development through a combination of game design, logical problem-solving, and modular JavaScript programming.

The game demonstrates practical experience with DOM manipulation, randomized content generation, browser-based data persistence, interactive puzzle mechanics, and front-end application architecture.