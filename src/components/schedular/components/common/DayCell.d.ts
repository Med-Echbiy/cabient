/// <reference types="react" />
import { CellRenderedProps } from "../../types";
interface CellProps {
    day: Date;
    start: Date;
    height: number;
    end: Date;
    resourceKey: string;
    resourceVal: string | number;
    cellRenderer?(props: CellRenderedProps): JSX.Element;
    children?: JSX.Element;
}
declare const DayCell: ({ day, start, end, resourceKey, resourceVal, cellRenderer, height, children, }: CellProps) => JSX.Element | null;
export default DayCell;
