import {
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

interface Props {
  items: string[];
  title: string;
  checkedItems: string[];
  onChange: (checked: string[]) => void;
}

function CheckboxButtons({ items, title, checkedItems, onChange }: Props) {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    if (checked) {
      onChange([...checkedItems, name]);
    } else {
      onChange(checkedItems.filter((item) => item !== name));
    }
  };

  return (
    <FormGroup>
      <FormLabel>Filter by {title}</FormLabel>
      {items.map((item) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.includes(item)}
              onChange={handleCheckboxChange}
              name={item}
            />
          }
          label={item}
          key={item}
        />
      ))}
    </FormGroup>
  );
}
export default CheckboxButtons;
