import { ProcessedEvent } from "../../types";
interface MonthEventProps {
    events: ProcessedEvent[];
    today: Date;
    eachWeekStart: Date[];
    eachFirstDayInCalcRow: Date | null;
    daysList: Date[];
    onViewMore(day: Date): void;
    cellHeight: number;
}
declare const MonthEvents: ({ events, today, eachWeekStart, eachFirstDayInCalcRow, daysList, onViewMore, cellHeight, }: MonthEventProps) => JSX.Element;
export default MonthEvents;
