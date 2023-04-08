import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Store } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { logoutUser } from "../../features/account/accountSlice";

interface Props {
  darkMode: boolean;
  onHandleDarkMode: () => void;
}

function Header({ darkMode, onHandleDarkMode }: Props) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { basket } = useAppSelector((state) => state.basket);
  const itemCount =
    basket?.items.reduce((a, b) => a + (b.quantity || 0), 0) ?? 0;

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const pages = ["Catalog", "About", "Contact", "Test-Error"];

  const settings = user
    ? ["Profile", "Account", "Orders", "Logout"]
    : ["Login", "Register"];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Switch
            checked={darkMode}
            onChange={onHandleDarkMode}
            inputProps={{ "aria-label": "controlled" }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  component={NavLink}
                  to={page}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Store sx={{ display: "flex", mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={NavLink}
            to="/"
            sx={{
              mr: 2,
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              alignSelf: "center",
              wordWrap: "break-word",
            }}
          >
            Re-Store
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  "&:hover": {
                    color: "red",
                  },
                  "&.active": {
                    color: "red",
                  },
                }}
                component={NavLink}
                to={page}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box marginRight="1.2rem">
            <IconButton
              component={Link}
              to="/basket"
              size="large"
              color="inherit"
              sx={{ position: "relative" }}
            >
              <Badge
                badgeContent={itemCount}
                color="secondary"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  border: (theme) =>
                    `2px solid ${theme.palette.background.paper}`,
                  padding: "0 4px",
                  borderRadius: "50%",
                  transform: "scale(0.7)",
                  transformOrigin: "top right",
                  zIndex: 1,
                }}
              />
              <ShoppingCart />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center",
            }}
          >
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                color="inherit"
                sx={{
                  padding: 0,
                  display: "flex",
                  placeSelf: "center",
                }}
              >
                <Avatar alt={user?.username} src="" />
              </IconButton>
            </Tooltip>
            {user && (
              <Typography
                variant="body2"
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {user.username}
              </Typography>
            )}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => {
                if (setting === "Logout") {
                  return (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        dispatch(logoutUser());
                        handleCloseUserMenu();
                      }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  );
                }
                return (
                  <MenuItem
                    key={setting}
                    onClick={handleCloseUserMenu}
                    component={NavLink}
                    to={setting}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
