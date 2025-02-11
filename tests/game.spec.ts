import { expect } from "@playwright/test";
import { test } from "../page-objects/base.page";

/*
Requirements:
- The game is played on a grid that's 3 squares by 3 squares. - OK
- You are X, your friend is O. Players take turns putting their marks in empty squares. - OK
- The first player to get 3 of their marks in a row (up, down, across, or diagonally) is the winner. - OK
- When all 9 squares are full, the game is over. If no player has 3 marks in a row, the game ends in a draw. NOK - draw message not displayed
- You can restart the game at any time. - OK
- The game should display the winner or a draw message when the game is over. - NOK, draw message not displayed
- The game should display the current player's turn. - OK
- The game should display the history of the turns. - OK
- The game should allow you to go back to any previous turn. - OK
*/

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.resetButton.click();
});

test("check the game is played on a grid that's 3 squares by 3 squares", async ({
  gamePage,
}) => {
  await expect(gamePage.boardRow).toHaveCount(3);
  await expect(gamePage.squareButton).toHaveCount(9);
});

test("can't set mark on already marked square", async ({ gamePage }) => {
  await gamePage.putMarkByRowAndColumnNr("X", 0, 0);

  await expect(gamePage.gameStatus).toHaveText("Next player: O");
  await gamePage.squareByRowAndColumnNr(0, 0).click();
  await expect(gamePage.squareByRowAndColumnNr(0, 0)).toHaveText("X");
  await expect(gamePage.gameStatus).toHaveText("Next player: O");
});

test("player X wins diagonally", async ({ gamePage }) => {
  await gamePage.putMarkByRowAndColumnNr("X", 0, 0);
  await gamePage.putMarkByRowAndColumnNr("O", 0, 1);
  await gamePage.putMarkByRowAndColumnNr("X", 0, 2);
  await gamePage.putMarkByRowAndColumnNr("O", 1, 0);
  await gamePage.putMarkByRowAndColumnNr("X", 1, 1);
  await gamePage.putMarkByRowAndColumnNr("O", 1, 2);
  await gamePage.putMarkByRowAndColumnNr("X", 2, 0);
  await expect(gamePage.gameStatus).toHaveText("Winner: X");
});

test("player O wins horizontally", async ({ gamePage }) => {
  await gamePage.putMarkByRowAndColumnNr("X", 0, 0);
  await gamePage.putMarkByRowAndColumnNr("O", 1, 0);
  await gamePage.putMarkByRowAndColumnNr("X", 0, 1);
  await gamePage.putMarkByRowAndColumnNr("O", 1, 1);
  await gamePage.putMarkByRowAndColumnNr("X", 2, 0);
  await gamePage.putMarkByRowAndColumnNr("O", 1, 2);
  await expect(gamePage.gameStatus).toHaveText("Winner: O");
});

test("player X wins vertically", async ({ gamePage }) => {
  await gamePage.putMarkByRowAndColumnNr("X", 1, 2);
  await gamePage.putMarkByRowAndColumnNr("O", 1, 0);
  await gamePage.putMarkByRowAndColumnNr("X", 2, 2);
  await gamePage.putMarkByRowAndColumnNr("O", 1, 1);
  await gamePage.putMarkByRowAndColumnNr("X", 0, 2);
  await expect(gamePage.gameStatus).toHaveText("Winner: X");
});

test("draw", async ({ gamePage }) => {
  await gamePage.putMarkByRowAndColumnNr("X", 0, 0);
  await gamePage.putMarkByRowAndColumnNr("O", 0, 1);
  await gamePage.putMarkByRowAndColumnNr("X", 0, 2);
  await gamePage.putMarkByRowAndColumnNr("O", 1, 0);
  await gamePage.putMarkByRowAndColumnNr("X", 1, 1);
  await gamePage.putMarkByRowAndColumnNr("O", 2, 0);
  await gamePage.putMarkByRowAndColumnNr("X", 1, 2);
  await gamePage.putMarkByRowAndColumnNr("O", 2, 2);
  await gamePage.putMarkByRowAndColumnNr("X", 2, 1);

  //BUG: draw message is not displayed
  await expect(gamePage.gameStatus).toHaveText("Draw");
});

test("can see the game history and go back to any previous turn", async ({
  page,
  gamePage,
}) => {
  await gamePage.gameBoard.screenshot({ path: "test-data/game-start.png" });

  await gamePage.putMarkByRowAndColumnNr("X", 0, 0);
  await gamePage.putMarkByRowAndColumnNr("O", 1, 1);
  await gamePage.gameBoard.screenshot({ path: "test-data/move-2.png" });

  await gamePage.putMarkByRowAndColumnNr("X", 0, 1);
  await gamePage.gameBoard.screenshot({ path: "test-data/move-3.png" });

  await gamePage.goToTurnNr(0);
  await expect(page).toHaveScreenshot("test-data/game-start.png");

  await gamePage.goToTurnNr(2);
  await expect(page).toHaveScreenshot("test-data/move-3.png");

  await gamePage.goToTurnNr(1);
  await expect(page).toHaveScreenshot("test-data/move-2.png");
});
