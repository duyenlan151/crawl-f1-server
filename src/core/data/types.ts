export interface GrandPrixEntry {
  name: string;
  dataValue: string | null;
  link: string;
}

export interface RaceDataEntry {
  id?: string;
  year: string;
  grandPrixType: string | null;
  grandPrixLink: string;
  grandPrix?: string | null;
  date?: string | null;
  winner?: string | null;
  car?: string | null;
  laps?: string | null;
  time?: string | null;
  pos?: string | null;
  driver?: string | null;
  nationality?: string | null;
  pts?: string | null;
  team?: string | null;
}

export interface F1Metadata {
  years: string[];
  types: { name: string; value: string }[];
  grandPrixList: Record<string, Record<string, GrandPrixEntry[]>>;
  raceData: Record<string, Record<string, RaceDataEntry[]>>;
}