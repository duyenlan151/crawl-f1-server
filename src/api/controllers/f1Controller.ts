import { Request, Response } from 'express';
import { F1Metadata } from '@/core/data/types';
import { saveData, readDataFile } from '@/core/data/storage';
import { logger } from '@/utils/logger';

export async function getMetadataAndRaceData(req: Request, res: Response): Promise<void> {
  try {
    const jsonData = await readDataFile();
    const years = jsonData.years || [];
    const types = jsonData.types || [];

    const year = (req.query.year as string) || (years.length > 0 ? years[1] : null);
    const type = (req.query.type as string) || (types.length > 0 ? types[0].value : null);
    const grandPrix = (req.query.grandPrix as string) || null;

    logger.info(`Fetching Metadata: ${year} - ${type} - ${grandPrix}`);

    let grandPrixList: { name: string; dataValue: string | null; link: string }[] = [];
    if (year && type && jsonData.grandPrixList[year] && jsonData.grandPrixList[year][type]) {
      grandPrixList = Object.values(jsonData.grandPrixList[year][type]);
    }

    let raceData: any[] = [];
    if (year && type && jsonData.raceData[year] && jsonData.raceData[year][type]) {
      raceData = (jsonData.raceData[year][type] || []).filter((race: any) => race.grandPrixType === grandPrix);
    }

    logger.info(`Fetched data: ${year} - ${type} - ${grandPrix}, length: ${raceData?.length} items`);

    // const updatedData = await addIdsToRaceData(jsonData);
    // saveData(updatedData);

    res.json({
      years,
      types,
      grandPrixList,
      raceData: {
        year,
        type,
        grandPrix,
        data: raceData,
        total: raceData.length,
      },
    });
  } catch (error) {
    logger.error(`Error fetching metadata and race data: ${(error as Error).message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function addIdsToRaceData(data: F1Metadata): Promise<F1Metadata> {
  let idCounter = 1;

  for (const year in data.raceData) {
    const yearData = data.raceData[year];

    if (Array.isArray(yearData.races)) {
      yearData.races.forEach((item) => {
        item.id = String(idCounter++);
      });
    }

    if (Array.isArray(yearData.drivers)) {
      yearData.drivers.forEach((item) => {
        item.id = String(idCounter++);
      });
    }

    if (Array.isArray(yearData.team)) {
      yearData.team.forEach((item) => {
        item.id = String(idCounter++);
      });
    }

    if (Array.isArray(yearData['fastest-laps'])) {
      yearData['fastest-laps'].forEach((item) => {
        item.id = String(idCounter++);
      });
    }
  }

  return data;
}
