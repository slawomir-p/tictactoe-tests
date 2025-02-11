import { test as base } from "@playwright/test";
import { GamePage } from "./game.page";

export type TestOptions = {
  gamePage: GamePage;
};

export const test = base.extend<TestOptions>({
  gamePage: async ({ page }, use) => {
    await use(new GamePage(page));
  },
});
