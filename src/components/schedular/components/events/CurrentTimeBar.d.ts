interface CurrentTimeBarProps {
    today: Date;
    startHour: number;
    step: number;
    minuteHeight: number;
    timeZone?: string;
    color?: string;
    zIndex?: number;
}
declare const CurrentTimeBar: (props: CurrentTimeBarProps) => JSX.Element | null;
export default CurrentTimeBar;
