import { Before, After, setDefaultTimeout, Status } from "@cucumber/cucumber";
import { chromium } from "playwright";
import { CustomWorld } from "./world";
import fs from "fs";

setDefaultTimeout(60 * 1000);


Before(async function (this: CustomWorld) {

    this.browser = await chromium.launch({
        headless: true,
        args: [
            "--disable-dev-shm-usage",
            "--no-sandbox"
        ]
    });


    this.context = await this.browser.newContext({

        viewport: {
            width: 1920,
            height: 1080
        },

        recordVideo: {
            dir: "videos/",
            size: {
                width: 1920,
                height: 1080
            }
        }

    });


    await this.context.tracing.start({

        screenshots: true,
        snapshots: true,
        sources: true

    });


    this.page = await this.context.newPage();

    this.page.setDefaultTimeout(30000);
    this.page.setDefaultNavigationTimeout(60000);

});



After(async function (this: CustomWorld, scenario) {


    const scenarioName = scenario.pickle.name
        .replace(/[^a-zA-Z0-9]/g, "_");


    const tracePath =
        `test-results/${scenarioName}-trace.zip`;


    let videoPath;


    if (this.page) {

        videoPath = await this.page.video()?.path();

    }



    // FAILED TEST HANDLING

    if (scenario.result?.status === Status.FAILED) {


        if (this.page) {

            const screenshot =
                await this.page.screenshot({

                    path: `screenshots/${scenarioName}.png`,
                    fullPage: true

                });


            await this.attach(
                screenshot,
                {
                    mediaType: "image/png",
                    fileName: `${scenarioName}.png`
                }
            );

        }



        // stop tracing only if context exists

        if (this.context) {

            await this.context.tracing.stop({

                path: tracePath

            });

        }


    }

    else {


        if (this.context) {

            await this.context.tracing.stop();

        }

    }



    // close page

    if (this.page) {

        await this.page.close();

    }



    // close context

    if (this.context) {

        await this.context.close();

    }



    // attach video

    if (
        scenario.result?.status === Status.FAILED &&
        videoPath &&
        fs.existsSync(videoPath)
    ) {


        const video =
            fs.readFileSync(videoPath);


        await this.attach(

            video,

            {
                mediaType: "video/webm",
                fileName: `${scenarioName}.webm`
            }

        );

    }



    // attach trace

    if (
        scenario.result?.status === Status.FAILED &&
        fs.existsSync(tracePath)
    ) {


        const trace =
            fs.readFileSync(tracePath);


        await this.attach(

            trace,

            {
                mediaType: "application/zip",
                fileName: `${scenarioName}-trace.zip`
            }

        );

    }



    // close browser

    if (this.browser) {

        await this.browser.close();

    }


});