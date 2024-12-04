
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select.tsx";

export type Item = {
    id: string;
    type: string | null;
};
interface Props {
    placeHolder: string;
    id: string;
    items: Item[] ;
    value?: string ; // Ensure value is always string
    onChange: (value: string) => void; // Handler for the change event
    isDisabled?: boolean;
}

function InputSelect({ placeHolder, id, items, value, onChange, isDisabled = false }: Props) {
    return (
        <Select disabled={isDisabled} onValueChange={onChange} value={value ? String(value) : undefined}> {/* Convert value to string */}
            <SelectTrigger className="w-full bg-primary/15 border border-primary/30">
                <SelectValue placeholder={placeHolder} id={id} />
            </SelectTrigger>
            <SelectContent>
                {items && items.map((e, index) => (
                    <SelectItem key={index} value={e.id}>{e.type}</SelectItem> // Ensure each item has a unique key
                ))}
            </SelectContent>
        </Select>
    );
}

export default InputSelect;
