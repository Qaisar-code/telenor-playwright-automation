import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { HomePage } from "../pages/HomePage";
import { HandlaBredbandPage } from "../pages/HandlaBredbandPage";


Given(
    "I navigate to Telenor website",
    async function (this: CustomWorld) {

        const homePage = new HomePage(this.page)

        await homePage.navigateToTelenor()
    })


When("I click Handla\\/Bredband", async function (this: CustomWorld) {
    const homePage = new HomePage(this.page)

    await homePage.clickOnHandlaBredbandLink()
})

When('I enter address "Kungsgatan 103, Uppsala"', async function (this: CustomWorld) {
    const handlaBredBandPage = new HandlaBredbandPage(this.page)
    await handlaBredBandPage.inputAddressInSearchBar()
    await handlaBredBandPage.selectSearchedItem()
})

Then("featured product grid should not be empty", async function(this: CustomWorld){
    const handlaBredBandPage = new HandlaBredbandPage(this.page)
    await handlaBredBandPage.verifyGridIsNotEmpty()
})
