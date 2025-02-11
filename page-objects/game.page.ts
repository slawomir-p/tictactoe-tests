import { Page, expect } from "@playwright/test";

export class GamePage {
  readonly gameBoard = this.page.locator("div.game-board");
  readonly boardRow = this.page.locator("div.board-row");
  readonly squareButton = this.page.locator("button.square");
  readonly gameStatus = this.page.locator("div.status");
  readonly resetButton = this.page.getByRole("button", { name: "Reset" });

  constructor(private page: Page) {}

  squareByRowAndColumnNr(rowNr: number, colNr: number) {
    return this.page
      .locator("div.board-row")
      .nth(rowNr)
      .locator("button.square")
      .nth(colNr);
  }

  async goto() {
    await this.page.goto("/");
  }

  async putMarkByRowAndColumnNr(mark: string, rowNr: number, colNr: number) {
    await expect(this.gameStatus).toHaveText(`Next player: ${mark}`);
    await this.squareByRowAndColumnNr(rowNr, colNr).click();
    await expect(this.squareByRowAndColumnNr(rowNr, colNr)).toHaveText(mark);
  }

  async goToTurnNr(turnNr: number) {
    await this.page
      .locator("button", { hasText: "Go to move # move" })
      .nth(turnNr)
      .click();
  }
}
