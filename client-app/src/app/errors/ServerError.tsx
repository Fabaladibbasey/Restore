import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ServerError() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      <Container
        component={Paper}
        maxWidth="md"
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          p: 3,
        }}
      >
        {state?.error ? (
          <>
            <Typography variant="h3" color="error" gutterBottom>
              {state.error.title}
            </Typography>
            <Divider />
            <Typography
              sx={{
                mt: 2,
                mb: 2,
                color: "text.secondary",
                textAlign: "center",
                width: "100%",
                wordWrap: "break-word",
              }}
            >
              {state.error.detail || "Internal server error"}
            </Typography>
          </>
        ) : (
          <Typography variant="h5" gutterBottom>
            Server Error
          </Typography>
        )}
        <Button
          component="a"
          startIcon={<ArrowBackIcon fontSize="small" />}
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => navigate(-1)}
        >
          Go back to previous page
        </Button>
      </Container>
    </Box>
  );
}
