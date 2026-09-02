import { Page, expect } from "@playwright/test";
import { addressData } from "../test-data/addressData";

export class HandlaBredbandPage {
    constructor(private page: Page) {

    }

    async verifyUrl(): Promise<void> {
        await expect(this.page).toHaveURL(/\/handla\/bredband\//);
    }

    async inputAddressInSearchBar(): Promise<void> {
        const searchBar = this.page.locator('[data-test="address-search-inputt"] input');
        await expect(searchBar).toBeVisible({ timeout: 15000 })
        await searchBar.fill(
            `${addressData.broadbandAddress.street}, ${addressData.broadbandAddress.city}`
        );
        await expect(searchBar).toHaveValue('Kungsgatan 103, Uppsala')
    }

    async selectSearchedItem(): Promise<void> {
        const searchedResult = this.page.locator('[data-test="address-list"]')
        await expect(searchedResult).toBeVisible()
        await searchedResult.click()
    }

    async verifyGridIsNotEmpty(): Promise<void> {
        const resultGrid = this.page.locator('[data-test="grid-container"] li')
        await expect(resultGrid).not.toHaveCount(0);


    }


}