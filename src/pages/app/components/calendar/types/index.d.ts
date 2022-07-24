export interface CalendarData {
  week: string,
  day: string,
  value: number,
}

export interface CalendarProps {
  data: CalendarData[],
}