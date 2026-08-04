import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const page = await browser.newPage();

page.on("console", (msg) => {
  console.log("console:", msg.type(), msg.text());
});

page.on("pageerror", (error) => {
  console.log("pageerror:", error.message);
});

page.on("requestfailed", (request) => {
  console.log("requestfailed:", request.url(), request.failure()?.errorText);
});

await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });
console.log("title:", await page.title());
console.log("body:", await page.locator("body").innerText());

await browser.close();
