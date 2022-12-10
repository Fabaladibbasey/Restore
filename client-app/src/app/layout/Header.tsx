import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
  darkMode: boolean;
  onHandleDarkMode: () => void;
}

function Header({ darkMode, onHandleDarkMode }: Props) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" component="h1">
          Re-Store
        </Typography>
        <Switch
          checked={darkMode}
          onChange={onHandleDarkMode}
          inputProps={{ "aria-label": "controlled" }}
        />
      </Toolbar>
    </AppBar>
  );
}
export default Header;
