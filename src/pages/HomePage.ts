import { Page, expect } from "@playwright/test";
import { Cookies } from "./CookiesPage";

export class HomePage {
    constructor(private page: Page) {

    }

    async navigateToTelenor() {
    await this.page.goto("https://telenor.se/", {
        waitUntil: "domcontentloaded",
        timeout: 60000
    });
}


    async clickOnHandlaBredbandLink(): Promise<void>{
        // handling cookies popup bfore click
        const cookies = new Cookies(this.page)
        await cookies.acceptCookiesIfPresent()


        const bredBandDropDownLink = this.page.locator('[data-test="Bredband"]').first()
        await expect(bredBandDropDownLink).toBeVisible()
        await bredBandDropDownLink.click()

        const clickOnBroadBandViaFiber = this.page.locator('a[href="/handla/bredband/"]').nth(1)
        await clickOnBroadBandViaFiber.click()
    }


}