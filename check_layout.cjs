const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);
    const result = await page.evaluate(() => {
      const section = document.querySelector('section.relative');
      const galaxy = document.querySelector('.galaxy-container');
      const canvas = document.querySelector('.galaxy-container canvas');
      return {
        sectionHeight: section ? section.offsetHeight : null,
        galaxyHeight: galaxy ? galaxy.offsetHeight : null,
        canvasCSSHeight: canvas ? canvas.offsetHeight : null,
        canvasAttrHeight: canvas ? canvas.height : null
      };
    });
    console.log("LAYOUT:", result);
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
