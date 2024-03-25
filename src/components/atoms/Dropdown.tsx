import { format, setMonth, getYear } from "date-fns";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../shadcnUIKit/select";
import { ko } from "date-fns/locale";

interface DropdownProps {
  name: string;
  value: Date;
  onDateChange: (newDate: number) => void;
}

const Dropdown = ({ name, value, onDateChange }: DropdownProps) => {

  if (name === "months") {
    const selectItems = Array.from({ length: 12 }, (_, i) => ({
      value: i.toString(),
      label: format(setMonth(new Date(), i), "MMM", { locale: ko }),
    }));


    return (
      <div className="w-[90px]">
        <Select
          onValueChange={(newValue) => {
            onDateChange(parseInt(newValue));
          }}
          value={value.getMonth().toString()}
        >
          <SelectTrigger>
            {format(value, "MMM", { locale: ko })}
          </SelectTrigger>
          <SelectContent>
            {selectItems.map((selectItem) => (
              <SelectItem key={selectItem.value} value={selectItem.value}>
                {selectItem.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  else if (name === "years") {
    const startYear = 2000;
    const endYear = getYear(new Date()) + 10;
    const selectItems = [];
    for (let year = startYear; year <= endYear; year++) {
      selectItems.push({
        value: year.toString(),
        label: year.toString(),
      });
    }

    return (
      <div className="w-[120px]">
        <Select
          onValueChange={(newValue) => {
            onDateChange(parseInt(newValue));
          }}
          value={value.getFullYear().toString()}
        >
          <SelectTrigger>{`${value.getFullYear()}년`}</SelectTrigger>
          <SelectContent>
            {selectItems.map((selectItem) => (
              <SelectItem key={selectItem.value} value={selectItem.value}>
                {selectItem.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return null;
}

export default Dropdown;