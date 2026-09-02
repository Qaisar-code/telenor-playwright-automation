import { Page, expect } from "@playwright/test";
import { Cookies } from "./CookiesPage";

export class HomePage {
    constructor(private page: Page) {

    }

  async navigateToTelenor() {

    const url = "https://telenor.se/";

    for (let attempt = 1; attempt <= 5; attempt++) {

        try {

            console.log(`Attempt ${attempt}: Opening ${url}`);

            await this.page.goto(url, {
                waitUntil: "networkidle",
                timeout: 90000
            });

            await this.page.waitForLoadState("domcontentloaded");

            console.log("Telenor loaded successfully");
            return;

        } catch (error) {

            console.log(`Attempt ${attempt} failed`);

            if (attempt === 5) {
                throw error;
            }

            await this.page.waitForTimeout(10000);

            await this.page.reload({
                waitUntil: "domcontentloaded",
                timeout: 90000
            }).catch(() => {});
        }
    }
}


    async clickOnHandlaBredbandLink(): Promise<void> {
        // handling cookies popup bfore click
        const cookies = new Cookies(this.page)
        await cookies.acceptCookiesIfPresent()

        await this.page.waitForLoadState("domcontentloaded");
        const bredBandDropDownLink = this.page.locator('[data-test="Bredband"]').first();
        await expect(bredBandDropDownLink).toBeVisible({
            timeout: 30000
        })
        await bredBandDropDownLink.click()

        const clickOnBroadBandViaFiber = this.page.getByRole('link', { name: /Bredband via fiber|Fiber broadband/i })


        await expect(clickOnBroadBandViaFiber).toBeVisible({
            timeout: 16000
        });


        await clickOnBroadBandViaFiber.click()
    }


}

