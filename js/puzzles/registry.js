/* ============================= */
/* Puzzle Registry               */
/* ============================= */

/*
  Every puzzle module registers itself
  on this object.

  Example:

  PuzzleRegistry.cipher = {
    render,
    hide
  };

  game.js does not need to know the
  internal logic for each puzzle.
*/

window.PuzzleRegistry = {};
