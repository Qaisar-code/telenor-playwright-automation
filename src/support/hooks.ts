import { Before, After, setDefaultTimeout, Status } from "@cucumber/cucumber";
import { chromium } from "playwright";
import { CustomWorld } from "./world";
import fs from "fs";


setDefaultTimeout(60 * 1000);



Before(async function (this: CustomWorld) {


    this.browser = await chromium.launch({

        headless: false,
        args: ['--start-maximized']

    });


    this.context = await this.browser.newContext({

        viewport: null,

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


});



After(async function (this: CustomWorld, scenario) {


    const scenarioName = scenario.pickle.name
        .replace(/[^a-zA-Z0-9]/g, "_");


    const videoPath = await this.page.video()?.path();


    const tracePath = `test-results/${scenarioName}-trace.zip`;


    if (scenario.result?.status === Status.FAILED) {


        const screenshotPath = `screenshots/${scenarioName}.png`;


        const screenshot = await this.page.screenshot({

            path: screenshotPath,

            fullPage: true

        });


        await this.attach(

            screenshot,

            {
                mediaType: "image/png",
                fileName: `${scenarioName}.png`
            }

        );


        await this.context.tracing.stop({

            path: tracePath

        });


    }
    else {


        await this.context.tracing.stop();


    }



    await this.page.close();


    await this.context.close();



    // Attach video to Allure after context is closed
    if (scenario.result?.status === Status.FAILED && videoPath) {


        const video = fs.readFileSync(videoPath);


        await this.attach(

            video,

            {
                mediaType: "video/webm",
                fileName: `${scenarioName}.webm`
            }

        );

    }



    // Attach trace to Allure
    if (scenario.result?.status === Status.FAILED && fs.existsSync(tracePath)) {


        const trace = fs.readFileSync(tracePath);


        await this.attach(

            trace,

            {
                mediaType: "application/zip",
                fileName: `${scenarioName}-trace.zip`
            }

        );

    }



    await this.browser.close();


});