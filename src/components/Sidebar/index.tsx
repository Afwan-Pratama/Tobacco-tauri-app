import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Dashboard from '@mui/icons-material/Dashboard';
import Dataset from '@mui/icons-material/Dataset';
import Input from '@mui/icons-material/Input';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Payments from '@mui/icons-material/Payments';
import PointOfSale from '@mui/icons-material/PointOfSale';
import Redeem from '@mui/icons-material/Redeem';
import Sell from '@mui/icons-material/Sell';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/icons-material/Menu';
import { AccountBox, Build, Map } from '@mui/icons-material';

type SidebarProps = {
  drawerWidth: number
}

export default function Sidebar({ drawerWidth }: SidebarProps) {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [inputOpen, setInputOpen] = useState(false)
  const [dataOpen, setDataOpen] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)

  const navigate = useNavigate()

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setInputOpen(!inputOpen)}>
            <ListItemIcon>
              <Input />
            </ListItemIcon>
            <ListItemText primary={"Input"} />
            {inputOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={inputOpen} timeout={"auto"} unmountOnExit>
          <List component={"div"} disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton onClick={() => navigate("/input-pembelian")}>
                <ListItemIcon>
                  <Payments />
                </ListItemIcon>
                <ListItemText primary={"Pembelian"} />
              </ListItemButton>
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton onClick={() => navigate("/input-penjualan")}>
                <ListItemIcon>
                  <Sell />
                </ListItemIcon>
                <ListItemText primary={"Penjualan"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setDataOpen(!dataOpen)}>
            <ListItemIcon>
              <Dataset />
            </ListItemIcon>
            <ListItemText primary={"Data"} />
            {dataOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={dataOpen} timeout={"auto"} unmountOnExit>
          <List component={"div"} disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton onClick={() => navigate("/data-pembelian")}>
                <ListItemIcon>
                  <Payments />
                </ListItemIcon>
                <ListItemText primary={"Pembelian"} />
              </ListItemButton>
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton onClick={() => navigate("/data-penjualan")}>
                <ListItemIcon>
                  <Sell />
                </ListItemIcon>
                <ListItemText primary={"Penjualan"} />
              </ListItemButton>
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton onClick={() => navigate("/data-laba-rugi")}>
                <ListItemIcon>
                  <PointOfSale />
                </ListItemIcon>
                <ListItemText primary={"Laba/Rugi"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setManageOpen(!manageOpen)}>
            <ListItemIcon>
              <Build />
            </ListItemIcon>
            <ListItemText primary={"Kelola"} />
            {manageOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={manageOpen} timeout={"auto"} unmountOnExit>
          <ListItem sx={{ pl: 4 }}>
            <ListItemButton onClick={() => navigate("/kelola-bonus")}>
              <ListItemIcon>
                <Redeem />
              </ListItemIcon>
              <ListItemText primary={"Bonus"} />
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemButton onClick={() => navigate("/kelola-kode")}>
              <ListItemIcon>
                <AccountBox />
              </ListItemIcon>
              <ListItemText primary={"Kode"} />
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemButton onClick={() => navigate("/kelola-wilayah")}>
              <ListItemIcon>
                <Map />
              </ListItemIcon>
              <ListItemText primary={"Wilayah"} />
            </ListItemButton>
          </ListItem>
        </Collapse>
      </List>
    </div>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}

