import { UploadFile } from "@mui/icons-material";
import { FormControl, FormHelperText, Typography } from "@mui/material";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {}

function AppDropZone(props: Props) {
  const { field, fieldState } = useController({ ...props, defaultValue: null });
  const dzStyles = {
    display: "flex",
    border: "dashed 3px",
    borderColor: "#eee",
    borderRadius: "5px",
    paddingTop: "30px",
    textAlign: "center" as "center",
    minHeight: "200px",
    maxwidth: "500px",
    alignItems: "center",
    padding: "10px",
    marginBottom: "20px",
  };

  const dzActive = {
    borderColor: "green",
  };

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      acceptedFiles[0] = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
      field.onChange(acceptedFiles[0]);
    },
    [field]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <FormControl
        style={isDragActive ? { ...dzStyles, ...dzActive } : { ...dzStyles }}
        error={fieldState.invalid}
      >
        <input {...getInputProps()} />
        <UploadFile sx={{ fontSize: 100 }} />
        <Typography variant="h6" gutterBottom>
          Drop image here or click to select image
        </Typography>
        <FormHelperText>
          {fieldState.invalid ? fieldState.error?.message : null}
        </FormHelperText>
      </FormControl>
    </div>
  );
}
export default AppDropZone;
