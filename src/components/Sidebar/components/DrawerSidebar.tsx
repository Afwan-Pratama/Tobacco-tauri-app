import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
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
import AccountBox from '@mui/icons-material/AccountBox';
import Build from '@mui/icons-material/Build';
import Map from '@mui/icons-material/Map';
import Analytics from '@mui/icons-material/Analytics';
import Note from '@mui/icons-material/Note'
import { useNavigate } from 'react-router-dom';
import Database from '@tauri-apps/plugin-sql';
import { useEffect, useState } from 'react';

export default function DrawerSidebar() {

  const [openCollapse, setOpenCollapse] = useState({
    inputPembelian: false,
    inputPenjualan: false,
    dataPembelian: false,
    dataPenjualan: false,
    report: false,
    manage: false
  })

  const [dataWilayah, setDataWilayah] = useState<{ id: number, nama: string }[]>([])

  const navigate = useNavigate()
  async function getData() {
    const db = await Database.load('sqlite:main.db')
    const data = await db.select<{ id: number, nama: string }[]>('SELECT id,nama FROM Wilayah')
    setDataWilayah(data)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
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
          <ListItemButton onClick={() => setOpenCollapse({
            ...openCollapse,
            inputPembelian: !openCollapse.inputPembelian
          })}>
            <ListItemIcon>
              <Input />
            </ListItemIcon>
            <ListItemText primary={"Input Pembelian"} />
            {openCollapse.inputPembelian ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCollapse.inputPembelian} timeout={"auto"} unmountOnExit>
          <List component={"div"} disablePadding>
            {dataWilayah.length != 0 && dataWilayah.map((v) => (
              <ListItem key={v.id} sx={{ pl: 4 }}>
                <ListItemButton onClick={() => navigate(`/input-pembelian/${v.id}`)}>
                  <ListItemIcon>
                    <Payments />
                  </ListItemIcon>
                  <ListItemText primary={v.nama} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenCollapse({
            ...openCollapse,
            inputPenjualan: !openCollapse.inputPenjualan
          })}>
            <ListItemIcon>
              <Input />
            </ListItemIcon>
            <ListItemText primary={"Input Penjualan"} />
            {openCollapse.inputPenjualan ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCollapse.inputPenjualan} timeout={"auto"} unmountOnExit>
          <List component={"div"} disablePadding>
            {dataWilayah.length != 0 && dataWilayah.map((v) => (
              <ListItem key={v.id} sx={{ pl: 4 }}>
                <ListItemButton onClick={() => navigate(`/input-penjualan/${v.id}`)}>
                  <ListItemIcon>
                    <Sell />
                  </ListItemIcon>
                  <ListItemText primary={v.nama} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenCollapse({
            ...openCollapse,
            dataPembelian: !openCollapse.dataPembelian
          })}>
            <ListItemIcon>
              <Dataset />
            </ListItemIcon>
            <ListItemText primary={"Data Pembelian"} />
            {openCollapse.dataPembelian ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCollapse.dataPembelian} timeout={"auto"} unmountOnExit>
          <List component={"div"} disablePadding>
            {dataWilayah.length != 0 && dataWilayah.map((v) => (
              <ListItem key={v.id} sx={{ pl: 4 }}>
                <ListItemButton onClick={() => navigate(`/data-pembelian/${v.id}`)}>
                  <ListItemIcon>
                    <Payments />
                  </ListItemIcon>
                  <ListItemText primary={v.nama} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenCollapse({
            ...openCollapse,
            dataPenjualan: !openCollapse.dataPenjualan
          })}>
            <ListItemIcon>
              <Dataset />
            </ListItemIcon>
            <ListItemText primary={"Data Penjualan"} />
            {openCollapse.dataPenjualan ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCollapse.dataPenjualan} timeout={"auto"} unmountOnExit>
          <List component={"div"} disablePadding>
            {dataWilayah.length != 0 && dataWilayah.map((v) => (
              <ListItem key={v.id} sx={{ pl: 4 }}>
                <ListItemButton onClick={() => navigate(`/data-penjualan/${v.id}`)}>
                  <ListItemIcon>
                    <Sell />
                  </ListItemIcon>
                  <ListItemText primary={v.nama} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
        {/* <ListItem disablePadding> */}
        {/*   <ListItemButton onClick={() => navigate('/input-ket-pembelian')}> */}
        {/*     <ListItemIcon> */}
        {/*       <Input /> */}
        {/*     </ListItemIcon> */}
        {/*     <ListItemText primary={"Input Keterangan Pembelian"} /> */}
        {/*   </ListItemButton> */}
        {/* </ListItem> */}
        {/* <ListItem disablePadding> */}
        {/*   <ListItemButton onClick={() => navigate('/data-ket-pembelian')}> */}
        {/*     <ListItemIcon> */}
        {/*       <Dataset /> */}
        {/*     </ListItemIcon> */}
        {/*     <ListItemText primary={"Data Keterangan Pembelian"} /> */}
        {/*   </ListItemButton> */}
        {/* </ListItem> */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/nota-khusus')}>
            <ListItemIcon>
              <Note />
            </ListItemIcon>
            <ListItemText primary={"Nota Khusus"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenCollapse({
            ...openCollapse,
            report: !openCollapse.report
          })}>
            <ListItemIcon>
              <Analytics />
            </ListItemIcon>
            <ListItemText primary={"Laporan"} />
            {openCollapse.report ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCollapse.report} timeout={"auto"} unmountOnExit>
          <List component={"div"} disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton onClick={() => navigate("/laporan-laba-rugi")}>
                <ListItemIcon>
                  <PointOfSale />
                </ListItemIcon>
                <ListItemText primary={"Laba/Rugi"} />
              </ListItemButton>
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton onClick={() => navigate("/laporan-bonus")}>
                <ListItemIcon>
                  <Redeem />
                </ListItemIcon>
                <ListItemText primary={"Bonus"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenCollapse({
            ...openCollapse,
            manage: !openCollapse.manage
          })}>
            <ListItemIcon>
              <Build />
            </ListItemIcon>
            <ListItemText primary={"Kelola"} />
            {openCollapse.manage ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCollapse.manage} timeout={"auto"} unmountOnExit>
          <List component={"div"} disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton onClick={() => navigate("/kelola-kode-pembelian")}>
                <ListItemIcon>
                  <AccountBox />
                </ListItemIcon>
                <ListItemText primary={"Kode Pembelian"} />
              </ListItemButton>
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton onClick={() => navigate("/kelola-kode-penjualan")}>
                <ListItemIcon>
                  <AccountBox />
                </ListItemIcon>
                <ListItemText primary={"Kode Penjualan"} />
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
          </List>
        </Collapse>
      </List>
    </div>

  )
}
