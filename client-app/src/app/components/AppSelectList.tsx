import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
  options: string[];
}

function AppSelectList(props: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: "" });
  const { label, options } = props;
  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{label}</InputLabel>
      <Select value={field.value} label={label} onChange={field.onChange}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}
export default AppSelectList;
