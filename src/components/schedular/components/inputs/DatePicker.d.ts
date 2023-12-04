interface EditorDatePickerProps {
    type?: "date" | "datetime";
    label?: string;
    variant?: "standard" | "filled" | "outlined";
    value: Date | string;
    name: string;
    onChange(name: string, date: Date): void;
    error?: boolean;
    errMsg?: string;
    touched?: boolean;
    required?: boolean;
}
declare const EditorDatePicker: ({ type, value, label, name, onChange, variant, error, errMsg, touched, required, }: EditorDatePickerProps) => JSX.Element;
export { EditorDatePicker };
