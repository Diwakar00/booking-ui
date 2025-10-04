import type { TimeFrame, IDateRange } from "../types";

// Calculate date range based on timeFrame selection
export const calculateDateRange = (
  timeFrame: TimeFrame,
  customRange: IDateRange | null = null
): IDateRange | null => {
  const today = new Date();

  switch (timeFrame) {
    case "lastMonth": {
      // Get previous month
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );

      return {
        from: formatDate(lastMonth),
        to: formatDate(lastDayOfLastMonth),
      };
    }

    case "lastYear": {
      // Get previous year
      const lastYear = today.getFullYear() - 1;
      const firstDayOfLastYear = new Date(lastYear, 0, 1); // January 1st
      const lastDayOfLastYear = new Date(lastYear, 11, 31); // December 31st

      return {
        from: formatDate(firstDayOfLastYear),
        to: formatDate(lastDayOfLastYear),
      };
    }

    case "custom": {
      // Return custom date range if provided
      if (customRange && customRange.from && customRange.to) {
        return {
          from: customRange.from,
          to: customRange.to,
        };
      }
      return null;
    }

    case "all":
    default:
      return null; // No date range filter
  }
};

// Format date to YYYY-MM-DD string
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

//Get display label for timeFrame options
export const getTimeFrameLabel = (
  timeFrame: TimeFrame,
  customRange: IDateRange | null = null
): string => {
  const dateRange = calculateDateRange(timeFrame, customRange);

  switch (timeFrame) {
    case "lastMonth":
      return dateRange
        ? `Last Month (${dateRange.from} to ${dateRange.to})`
        : "Last Month";
    case "lastYear":
      return dateRange
        ? `Last Year (${dateRange.from} to ${dateRange.to})`
        : "Last Year";
    case "custom":
      return dateRange
        ? `Custom (${dateRange.from} to ${dateRange.to})`
        : "Custom Date Range";
    case "all":
    default:
      return "All Time";
  }
};
