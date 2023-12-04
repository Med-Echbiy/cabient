/// <reference types="react" />
import { DefaultRecourse } from "../../types";
interface WithResourcesProps {
    renderChildren(resource: DefaultRecourse): React.ReactNode;
}
declare const WithResources: ({ renderChildren }: WithResourcesProps) => JSX.Element;
export { WithResources };
