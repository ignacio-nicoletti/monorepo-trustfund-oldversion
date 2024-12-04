import { GroupedQuotas } from "../components/Cuotas/types";

export const hasQuotas = (groupedQuotas: GroupedQuotas): boolean => {
  // Iterate over the years
  for (const year in groupedQuotas) {
    const yearData = groupedQuotas[year];
    if (!yearData) continue; // Ensure yearData is not undefined

    // Iterate over the months in that year
    for (const month in yearData) {
      const monthData = yearData[month];
      if (!monthData) continue; // Ensure monthData is not undefined

      // Check if there are any quotas for the given month
      if (monthData.quotas && monthData.quotas.length > 0) {
        return true; // Found at least one quota
      }
    }
  }
  return false; // No quotas found
};
