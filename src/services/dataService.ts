import { loadCSVData as loadCSV } from "../utils/csvLoader";

export const loadCSVData = async (filePath: string) => {
  return await loadCSV(filePath);
};
