import Autorenew from '@mui/icons-material/Autorenew';
import { default as MenuIcon } from "@mui/icons-material/Menu";
import Menu from '@mui/material/Menu'
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import MenuItem from "@mui/material/MenuItem"
import Modal from "@mui/material/Modal"
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'

interface ToolbarHeaderProps {
  handleDrawer: () => void
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function ToolbarHeader(props: ToolbarHeaderProps) {

  const { handleDrawer } = props

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openSnack, setOpenSnack] = useState(false)
  const [loadingDown, setLoadingDown] = useState(false)

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    handleClose()
  }

  function handleCloseSnack(_event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false)
  }

  async function handleCekUpdate() {
    setLoading(true)
    const update = await check()
    if (update) {
      setOpenModal(true)
    }
    else {
      handleClose()
      setOpenSnack(true)
    }
    setLoading(false)
  }

  async function handleUpdate() {
    setLoadingDown(true)
    const update = await check()
    await update?.downloadAndInstall()
    await relaunch()
    setLoadingDown(false)
  }

  return (
    <Toolbar>
      <Modal open={openModal}>
        <Box sx={modalStyle} gap='20px'>
          <Typography variant="h4">{loadingDown ? 'Mendownload & Menginstal Aplikasi' : 'Ada Update Aplikasi Terbaru'}</Typography>
          {!loadingDown && <Stack direction='row' justifyContent='space-around'>
            <Button onClick={handleCloseModal}>Nanti Saja</Button>
            <Button onClick={handleUpdate}>Update</Button>
          </Stack>}
          {loadingDown && (
            <>
              <CircularProgress />
              <Typography variant="h6">Harap Tunggu Sebentar</Typography>
            </>
          )}
        </Box>
      </Modal>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnack} autoHideDuration={5000} onClose={handleCloseSnack}>
        <Alert
          onClose={handleCloseSnack}
          severity='success'
          variant='filled'
          sx={{ width: '100%' }}
        >
          Aplikasi sudah terbaru
        </Alert>
      </Snackbar>
      <Stack direction='row' justifyContent='space-between' width='100%'>
        <Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawer}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Tobacco Transaction App
          </Typography>
        </Box>
        <Box>
          <Button variant='outlined' sx={{
            color: 'white'
          }} onClick={handleClick} startIcon={<Autorenew />}>
            Update
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleCekUpdate}>Cek Update Aplikasi</MenuItem>
            {loading && <LinearProgress />}
          </Menu>
        </Box>
      </Stack>
    </Toolbar>
  )
}
