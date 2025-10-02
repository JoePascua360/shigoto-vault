import type { Session } from "@/config/auth-client";
import { chromium } from "playwright";

export async function linkedInScrape(
  urlLinks: string[],
  session?: Session | null
) {
  try {
    // will only run if there's at least 1 url
    if (urlLinks.length > 0) {
      const browser = await chromium.launch();

      // use sample user agent if there's no session.
      const userAgent =
        session?.session.userAgent ||
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36";

      const jobDetailList: string[][] = [];
      const skippedLinks: { link: string; description: string }[] = [];

      const scrapeData = async (link: string) => {
        const page = await browser.newPage({ userAgent });

        // add a custom script to be used inside page.evaluate()
        await page.addInitScript(
          `window.jobPostDetailsArray = function(querySelector) {
            const arr = [];
                for (const selector of querySelector) {
                const details = document.querySelector(selector).innerText.trim();

                arr.push(details);
                }

                return arr;
           }`
        );

        await page.goto(link);

        let payRange = "";
        // if the job has base pay included:
        const payRangeSection = await page
          .waitForSelector("div.compensation__salary-range", {
            timeout: 2000,
          })
          .catch(() => null);

        if (payRangeSection) {
          const salary = await page.evaluate(() => {
            const compensation = (
              document.querySelector("div.compensation__salary") as HTMLElement
            ).innerText;
            return compensation;
          });

          payRange = salary;
        }

        const headerSectionDetails = await page.evaluate(() => {
          const jobDetails = (window as any).jobPostDetailsArray([
            "h1.top-card-layout__title", // job title
            "a.topcard__org-name-link", // company
            "span.topcard__flavor--bullet", // location
            "span.description__job-criteria-text", // employment type
            "div.show-more-less-html__markup", // job description
          ]);

          return jobDetails;
        });

        console.count("Page Evaluated...");

        jobDetailList.push([...headerSectionDetails, payRange]);
      };

      await Promise.all(urlLinks.map((link) => scrapeData(link)));

      return { jobDetailList, skippedLinks };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
