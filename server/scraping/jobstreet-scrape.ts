import type { Session } from "@/config/auth-client";
import { chromium } from "playwright";
/**
 * Scrapes data from jobstreet's /job directory. Works with other locations as well. Not just ph.
 * @param urlLinks - list of urls with format of -(**https://(loc).jobstreet.com/job/859...**)
 * @param session - use auth.api.getSession() function
 * @returns {object, object} - jobDetailsList and skippedLinks
 */
export async function jobStreetScrape(
  urlLinks: string[],
  session: Session | null
) {
  try {
    const browser = await chromium.launch();

    // use sample user agent if there's no session.
    const userAgent =
      session?.session.userAgent ||
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36";

    const page = await browser.newPage({ userAgent: userAgent });

    await page.setViewportSize({ width: 1280, height: 2500 });

    const jobDivContainer =
      "div._32fem00._1nh354wb8._1nh354wb1._1nh354wbq._1nh354wa4._1nh354w9x._1nh354wam";

    const jobPostRemovedDivContainer = "div._32fem00._1nh354w8k._1nh354w9o";

    const jobDetailList = [];
    const skippedLinks = [];

    for (const link of urlLinks) {
      await page.goto(link);

      const jobPostRemoved = await page
        .waitForSelector(jobPostRemovedDivContainer, { timeout: 10000 })
        .catch(() => null);

      if (jobPostRemoved) {
        console.log(`Skipped removed job: ${link}`);

        const removedPostDescription = await page.evaluate(() => {
          const description =
            (
              document.querySelector(
                `h2._32fem00._1nh354w50.gyz43x0.gyz43xh.gyz43xk._1lwlriv4.gyz43x1t`
              ) as HTMLElement
            )?.innerText || "";

          return description;
        });

        skippedLinks.push({
          link: link,
          description: removedPostDescription,
        });
        continue;
      }
      // div that contains all the job information
      await page.waitForSelector(jobDivContainer);

      await page.screenshot({
        path: "./server/scraping/screenshot.png",
        // fullPage: true,
      });
      console.count("Selector Detected...");

      const jobDetails = await page.evaluate(() => {
        const jobFields = [
          "job-detail-title",
          "advertiser-name",
          "job-detail-location",
          "job-detail-classifications",
          "job-detail-work-type",
          "job-detail-salary",
          "job-description",
        ];

        const arr: string[] = [];

        for (const fields of jobFields) {
          const jobDescription =
            (document.querySelector(`div._32fem00.owf1jk0`) as HTMLElement)
              ?.innerText || "";

          if (fields === "job-description") {
            arr.push(jobDescription);
          } else {
            arr.push(
              (
                document.querySelector(
                  `[data-automation='${fields}']`
                ) as HTMLElement
              )?.innerText || "Not Set"
            );
          }
        }

        return arr;
      });

      console.count("Page Evaluated...");

      jobDetailList.push(jobDetails);
    }

    await browser.close();

    return { jobDetailList, skippedLinks };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
