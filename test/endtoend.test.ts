import { describe } from 'mocha';
import { expect } from 'chai';
import { Builder, By, Key } from 'selenium-webdriver';
import {readFileSync } from 'fs';


// describe("end to end", () => {
//     it("test", async () => {
//         const driver = new Builder().forBrowser('chrome').build();
//         const file = readFileSync("build/present.js", "utf8");
//         await driver.get("https://docs.wpilib.org/en/stable/docs/controls-overviews/control-system-hardware.html");
//         await driver.sleep(1000);
//         await driver.executeScript(file);
//         await driver.executeScript(`present();`);
//         await driver.sleep(2000);
//         let button = await driver.findElement(By.className("navigate-right enabled"));
//         for (let i = 0; i < 12; i++) {
//             await driver.sleep(500);
//             // @ts-ignore
//             await button.click();
//         }
//         await driver.quit();
//     });
// });

