import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface Props {
  options: { value: string; label: string }[];
  onChange: (e: any) => void;
  seletedValue: string;
}

function RadioButtonGroup({ options, onChange, seletedValue }: Props) {
  return (
    <FormControl>
      <FormLabel>Sort by</FormLabel>
      <RadioGroup onChange={onChange} value={seletedValue}>
        {options.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
export default RadioButtonGroup;
