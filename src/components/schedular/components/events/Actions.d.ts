import { ProcessedEvent } from "../../types";
interface Props {
    event: ProcessedEvent;
    onDelete(): void;
    onEdit(): void;
}
declare const EventActions: ({ event, onDelete, onEdit }: Props) => JSX.Element;
export default EventActions;
