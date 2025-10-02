import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Modal from '@mui/material/Modal'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import EditSquare from '@mui/icons-material/EditSquare';
import Save from '@mui/icons-material/Save';
import { useEffect, useState } from 'react';
import Database from '@tauri-apps/plugin-sql';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

interface kodeProps {
  id: number
  kode: string
  aktif: boolean
}

export default function KodePenjualan() {

  const [openModal, setOpenModal] = useState(false)
  const [inputId, setInputId] = useState(0)
  const [inputKode, setInputKode] = useState('')
  const [inputAktif, setInputAktif] = useState(true)
  const [disableButton, setDisableButton] = useState(true)
  const [dataKode, setDataKode] = useState<kodeProps[]>([])
  const [action, setAction] = useState("")
  const [openDial, setOpenDial] = useState(false)
  const [openSnack, setOpenSnack] = useState(false)
  const [refresh, setRefresh] = useState(false)

  async function getData() {
    const db = await Database.load('sqlite:main.db')
    setDataKode(await db.select('SELECT * FROM Kode_Penjualan'))
  }

  useEffect(() => {
    if (inputKode == '') {
      setDisableButton(true)
    }
    else {
      setDisableButton(false)
    }
  }, [inputKode])

  useEffect(() => {
    getData()
  }, [refresh])

  function handleAddKode() {
    setAction("Tambah")
    setOpenModal(true)
  }

  function handleCloseModal() {
    setInputKode('')
    setOpenModal(false)
  }

  async function handleSubmitKode() {
    const db = await Database.load('sqlite:main.db')
    if (action == "Edit") {
      await db.execute('UPDATE Kode_Penjualan SET kode = $1, aktif = $2 WHERE id = $3', [inputKode, inputAktif, inputId])
    }
    if (action == "Tambah") {
      await db.execute("INSERT INTO Kode_Penjualan (kode,aktif) VALUES ($1,$2)", [inputKode, inputAktif])
    }
    handleCloseModal()
    setOpenSnack(true)
    setRefresh(!refresh)
  }

  function handleClickUpdate(params: kodeProps) {
    setAction("Edit")
    setOpenModal(true)
    setInputKode(params.kode)
    setInputAktif(params.aktif)
    setInputId(params.id)
  }

  function handleClickDelete(id: number, kode: string) {
    setAction("Hapus")
    setInputKode(kode)
    setInputId(id)
    setOpenDial(true)
  }

  async function handleDeleteKode() {
    const db = await Database.load('sqlite:main.db')
    await db.execute('DELETE FROM Kode_Penjualan WHERE id = $1', [inputId])
    setOpenSnack(true)
    setOpenDial(false)
    setRefresh(!refresh)
  }

  function handleCloseSnack(_event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false)
  }

  const columns: GridColDef[] = [
    {
      field: 'kode',
      headerName: 'Kode',
      width: 200,
    },
    {
      field: 'aktif',
      headerName: 'Aktif',
      type: 'boolean',
      width: 200
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem icon={<EditSquare />} label='Edit' onClick={() => handleClickUpdate(params.row)} />,
        <GridActionsCellItem icon={<Delete />} label='Hapus' onClick={() => handleClickDelete(params.row.id, params.row.kode)} />
      ]
    }
  ];

  return (
    <Box>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnack} autoHideDuration={5000} onClose={handleCloseSnack}>
        <Alert
          onClose={handleCloseSnack}
          severity='success'
          variant='filled'
          sx={{ width: '100%' }}
        >
          Berhasil {action} Kode Penjualan
        </Alert>
      </Snackbar>
      <Dialog
        open={openDial}
        onClose={() => setOpenDial(false)}
      >
        <DialogTitle >
          {`Anda Yakin Ingin Menghapus Kode ${inputKode} ?`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDial(false)}>Tidak</Button>
          <Button onClick={handleDeleteKode}>Ya</Button>
        </DialogActions>
      </Dialog>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Stack sx={modalStyle} gap='20px'>
          <Typography variant='h4'>{action} Kode Penjualan</Typography>
          <TextField label='Kode' value={inputKode} onChange={(e) => setInputKode(e.target.value)} />
          <FormControl fullWidth>
            <FormLabel>Status</FormLabel>
            <RadioGroup
              // @ts-ignore
              onChange={(e) => setInputAktif(e.target.value)}
              value={inputAktif}
              defaultValue={true}
              name="radio-buttons-group"
            >
              <FormControlLabel value={true} control={<Radio />} label="Aktif" />
              <FormControlLabel value={false} control={<Radio />} label="Tidak Aktif" />
            </RadioGroup>
          </FormControl>
          <Button disabled={disableButton} onClick={handleSubmitKode} startIcon={<Save />}>Simpan</Button>
        </Stack>
      </Modal>
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h4'>Kelola Kode Penjualan</Typography>
        <Button startIcon={<Add />} onClick={handleAddKode}>Tambah Kode Penjualan</Button>
      </Stack>
      <div style={{ margin: "20px 0", display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          columns={columns}
          rows={dataKode}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[20]}
          rowHeight={35}
          disableRowSelectionOnClick
        />
      </div>
    </Box>
  )
}
