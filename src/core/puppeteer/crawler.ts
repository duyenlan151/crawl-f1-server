import puppeteer, { Page } from 'puppeteer';
import { saveData } from '@/core/data/storage';
import { F1Metadata } from '@/core//data/types';
import { sendMessage } from '@/websocket/messages';
import { WebSocket } from 'ws';
import { env } from '@/config';
import { logger } from '@/utils/logger';

export async function scrapeF1Results(ws: WebSocket): Promise<F1Metadata> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    sendMessage(ws, 5, 'Starting crawl...');
    logger.info('Starting crawl process');
    await page.goto(env.F1_BASE_URL, { waitUntil: 'networkidle2' });

    const years = await page.evaluate(() =>
      Array.from(document.querySelectorAll('ul.f1-menu-wrapper')[0].querySelectorAll('li a')).map(
        (el) => el.textContent!.trim(),
      ),
    );
    sendMessage(ws, 10, 'Fetched list of years');
    logger.info(`Fetched ${years.length} years: ${JSON.stringify(years)}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const types = await page.evaluate(() =>
      Array.from(document.querySelectorAll('ul.f1-menu-wrapper')[1].querySelectorAll('li')).map(
        (el) => ({
          name: el.innerText.trim(),
          value: el.getAttribute('data-value')!,
        }),
      ),
    );
    sendMessage(ws, 15, 'Fetched list of types');
    logger.info(`Fetched ${types.length} types: ${JSON.stringify(types)}`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const grandPrixList: Record<string, Record<string, any[]>> = {};
    const raceData: Record<string, Record<string, any[]>> = {};
    const totalSteps = years.length * types.length;
    let currentStep = 0;

    for (const year of years) {
      grandPrixList[year] = {};
      raceData[year] = {};

      for (const type of types) {
        const url = `${"https://www.formula1.com/en/results"}/${year}/${type.value}`;
        await page.goto(url, { waitUntil: 'networkidle2' });
        currentStep++;
        sendMessage(ws, Math.floor((currentStep / totalSteps) * 50) + 15, `Crawling ${year} - ${type.name}`);
        logger.info(`Crawling ${year} - ${type.name} (${url})`);
        // await new Promise((resolve) =>  setTimeout(resolve, 1000));

        const grandPrix = await page.evaluate(
          (year, type) =>
            Array.from(
              document.querySelectorAll('ul.f1-menu-wrapper')[2]?.querySelectorAll('li') || [],
            ).map((el) => {
              const name = el.innerText.trim();
              const dataValue = el.getAttribute('data-value') || el.getAttribute('data-id');
              const dataId = el.getAttribute('data-id');

              let link = dataValue
                ? `${"https://www.formula1.com/en/results"}/${year}/${type}/${dataId}/${dataValue}${
                    type === 'races' ? '/race-result' : ''
                  }`
                : `${"https://www.formula1.com/en/results"}/${year}/${type}`;

              if (type === 'team') {
                link = `${"https://www.formula1.com/en/results"}/${year}/${type}/${dataId || ''}`;
              }
              return { name, dataValue, link };
            }),
            year,
            type.value,
          );
        logger.info(`Fetched grandPrix ${grandPrix.length} entries for ${year} - ${type.name}`);
        grandPrixList[year][type.value] = grandPrix;
        raceData[year][type.value] = [];

        const totalGpSteps = grandPrix.length;
        let gpStep = 0;

        for (const gp of grandPrix) {
          await page.goto(gp.link, { waitUntil: 'networkidle2' });
          gpStep++;
          sendMessage(
            ws,
            Math.floor((currentStep / totalSteps) * 50) + 15 + Math.floor((gpStep / totalGpSteps) * 10),
            `Crawling ${year} - ${type.name} - ${gp.name}`,
          );
          logger.info(`Crawling ${year} - ${type.name} - ${gp.name}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));

          try {
            await page.waitForSelector('.f1-table-with-data tbody tr', { timeout: 5000 });
            const exists = await page.$('.f1-table-with-data tbody tr');
            if (!exists) {
              sendMessage(
                ws as any,
                Math.floor((currentStep / totalSteps) * 50) + 15,
                `No data found for ${gp.name} in ${year} (${type.name})`,
              );
              logger.warn(`No data found for ${gp.name} in ${year} (${type.name})`);
              continue;
            }

            const tableData = await evaluateTableData(page, year, type.value, gp);
            raceData[year][type.value].push(...tableData);
            logger.info(`Fetched ${tableData.length} entries for ${year} - ${type.name}`);
          } catch (error) {
            sendMessage(
              ws,
              Math.floor((currentStep / totalSteps) * 50) + 15,
              `No data found for ${gp.name} in ${year} (${type.name})`,
            );
            logger.error(`No data found for ${gp.name} in ${year} - ${type.name}`);
            continue;
          }
        }
      }
    }

    sendMessage(ws, 90, 'Finalizing data...');
    logger.info(`Finalizing data...`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const metadata: F1Metadata = { years, types, grandPrixList, raceData };
    saveData(metadata);
    sendMessage(ws, 100, 'Crawl completed');
    logger.info(`Crawl completed`);
    ws.send(JSON.stringify({ progress: 100, message: 'Crawl completed', data: metadata }));

    return metadata;
  } catch (error) {
    const errorMessage = `Crawl failed: ${(error as Error).message}`;
    sendMessage(ws, 0, errorMessage);
    logger.error(`Crawl failed: ${(error as Error).message}`);
    ws.send(JSON.stringify({ error: errorMessage, progress: 0, message: 'Crawl failed' }));
    throw error;
  } finally {
    await browser.close();
    logger.info('Browser closed');
  }
}

async function evaluateTableData(page: Page, year: string, type: string, gp: any): Promise<any[]> {
  return await page.evaluate(
    (year, type, gp) => {
      const rows = document.querySelectorAll('.f1-table-with-data tbody tr');
      if (!rows) return [];
      const results: any[] = [];

      rows.forEach((row) => {
        const columns = row.querySelectorAll('td');
        if (columns.length > 0) {
          const entry: Record<string, string | null> = {
            year,
            grandPrixType: gp.dataValue,
            grandPrixLink: gp.link,
          };
          if (type === "races") {
            entry.grandPrix = columns[0]?.innerText.trim();
            entry.date = columns[1]?.innerText.trim();
            // entry.winner = getWinnerFromColumn(columns, 2);
            let winnerRaces = null;
            const tdRaces = columns[2];
            if (tdRaces) {
              const spans = tdRaces.querySelectorAll("span");
              if (spans.length >= 2) {
                winnerRaces =  `${spans[0].textContent} ${spans[1].textContent}`.trim();
              }
              winnerRaces = tdRaces?.textContent?.trim();
            }
            entry.winner = winnerRaces || '';
            entry.car = columns[3]?.innerText.trim();
            entry.laps = columns[4]?.innerText.trim();
            entry.time = columns[5]?.innerText.trim();
          } else if (type === "drivers") {
            entry.pos = columns[0]?.innerText.trim();
            // entry.driver = getWinnerFromColumn(columns);
            let driverDrivers = null;
            const tdDrivers = columns[1];
            if (tdDrivers) {
              const spans = tdDrivers.querySelectorAll("span");
              if (spans.length >= 2) {
                driverDrivers = `${spans[0].textContent} ${spans[1].textContent}`.trim();
              }
              driverDrivers =  tdDrivers?.textContent?.trim();
            }
            entry.driver = driverDrivers || '';
            entry.nationality = columns[2]?.innerText.trim();
            entry.car = columns[3]?.innerText.trim();
            entry.pts = columns[4]?.innerText.trim();
          } else if (type === "team") {
            entry.pos = columns[0]?.innerText.trim();
            entry.team = columns[1]?.innerText.trim();
            entry.pts = columns[2]?.innerText.trim();
          } else if (type === "fastest-laps") {
            // entry.driver = getWinnerFromColumn(columns);
            let driverFastest = null;
            const tdFastest = columns[1];
            if (tdFastest) {
              const spans = tdFastest.querySelectorAll("span");
              if (spans.length >= 2) {
                driverFastest = `${spans[0].textContent} ${spans[1].textContent}`.trim();
              }
              driverFastest =  tdFastest?.textContent?.trim();
            }
            entry.driver = driverFastest || '';
            entry.car = columns[2]?.innerText.trim();
            entry.time = columns[3]?.innerText.trim();
          }
          results.push(entry);
        }
      });

      return results;
    },
    year,
    type,
    gp,
  );
}
