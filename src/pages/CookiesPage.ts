import { Page, expect } from "@playwright/test";

export class Cookies {
    constructor(private page: Page) {

    }

    async acceptCookiesIfPresent() {
        // Wait for initial page scripts
        await this.page.waitForLoadState('networkidle');

        // Give OneTrust time to finish rendering
        await this.page.waitForTimeout(3000);

        const overlay = this.page.locator('.onetrust-pc-dark-filter');

        if (await overlay.isVisible().catch(() => false)) {
            const acceptButton = this.page.locator('#onetrust-accept-btn-handler');

            if (await acceptButton.isVisible().catch(() => false)) {
                await acceptButton.click();
            }

            await overlay.waitFor({
                state: 'hidden',
                timeout: 10000
            });
        }
    }
}