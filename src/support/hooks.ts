import { Before, After, setDefaultTimeout, Status } from "@cucumber/cucumber";
import { chromium } from "playwright";
import { CustomWorld } from "./world";
import fs from "fs";


setDefaultTimeout(60 * 1000);



Before(async function (this: CustomWorld) {


    const headless = process.env.CI ? true : false;


    this.browser = await chromium.launch({

        headless,

        args: ['--start-maximized']

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



});



After(async function (this: CustomWorld, scenario) {


    const scenarioName = scenario.pickle.name
        .replace(/[^a-zA-Z0-9]/g, "_");


    const tracePath = `test-results/${scenarioName}-trace.zip`;


    const videoPath = this.page
        ? await this.page.video()?.path()
        : undefined;



    if (scenario.result?.status === Status.FAILED) {


        if (this.page) {


            const screenshot = await this.page.screenshot({

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



        await this.context.tracing.stop({

            path: tracePath

        });


    }
    else {


        await this.context.tracing.stop();


    }



    // Close browser resources safely

    if (this.page) {

        await this.page.close();

    }


    if (this.context) {

        await this.context.close();

    }



    // Attach video after context close

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



    // Attach trace

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



    if (this.browser) {

        await this.browser.close();

    }



});