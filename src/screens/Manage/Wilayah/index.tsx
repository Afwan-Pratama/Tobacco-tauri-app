import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
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
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select';
import { NumericFormat } from 'react-number-format'
import { InputAdornment } from '@mui/material';

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

interface wilayahProps {
  id: number
  nama: string
  kondisi: string
  value_kondisi: number
  netto_kondisi: number
  netto_default: number
}

export default function Wilayah() {

  const [openModal, setOpenModal] = useState(false)
  const [inputWilayah, setInputWilayah] = useState({
    nama: '',
    kondisi: '',
    value_kondisi: 0,
    netto_kondisi: 0,
    netto_default: 0
  })
  const [inputId, setInputId] = useState(0)
  const [inputNama, setInputNama] = useState('')
  const [dataWilayah, setDataWilayah] = useState<wilayahProps[]>([])
  const [action, setAction] = useState("")
  const [openDial, setOpenDial] = useState(false)
  const [openSnack, setOpenSnack] = useState(false)
  const [disableDari, setDisableDari] = useState(true)
  const [disableButton, setDisableButton] = useState(true)

  async function getData() {
    const db = await Database.load('sqlite:main.db')
    setDataWilayah(await db.select('SELECT * FROM Wilayah'))
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (inputWilayah.kondisi === 'tidak' || inputWilayah.kondisi === '') {
      setDisableDari(true)
    }
    else {
      setDisableDari(false)
    }
  }, [inputWilayah.kondisi])

  useEffect(() => {
    if (inputWilayah.kondisi === '' || inputWilayah.nama === '' || inputWilayah.netto_default === 0) {
      setDisableButton(true)
    } else {
      setDisableButton(false)
    }
  }, [inputWilayah])

  function handleAdd() {
    setAction("Tambah")
    setOpenModal(true)
  }

  function handleCloseModal() {
    setInputWilayah({
      nama: '',
      kondisi: '',
      value_kondisi: 0,
      netto_kondisi: 0,
      netto_default: 0
    })
    setOpenModal(false)
  }

  async function handleSubmit() {
    const db = await Database.load('sqlite:main.db')
    if (action == "Edit") {
      await db.execute("Update Wilayah SET nama = $1, kondisi = $2, value_kondisi = $3, netto_kondisi = $4, netto_default = $5 WHERE id = $6",
        [inputWilayah.nama, inputWilayah.kondisi, inputWilayah.value_kondisi, inputWilayah.netto_kondisi, inputWilayah.netto_default, inputId])

    }
    if (action == "Tambah") {
      await db.execute("INSERT INTO Wilayah(nama,kondisi,value_kondisi,netto_kondisi,netto_default) VALUES ($1,$2,$3,$4,$5)",
        [inputWilayah.nama, inputWilayah.kondisi, inputWilayah.value_kondisi, inputWilayah.netto_kondisi, inputWilayah.netto_default])
    }
    handleCloseModal()
    setOpenSnack(true)
    window.location.reload()
  }

  function handleClickUpdate(params: wilayahProps) {
    setAction("Edit")
    setOpenModal(true)
    setInputWilayah({
      nama: params.nama,
      kondisi: params.kondisi,
      value_kondisi: params.value_kondisi,
      netto_kondisi: params.netto_kondisi,
      netto_default: params.netto_default
    })
    setInputId(params.id)
  }

  function handleClickDelete(id: number, nama: string) {
    setAction("Hapus")
    setInputNama(nama)
    setInputId(id)
    setOpenDial(true)
  }

  async function handleDeleteKode() {
    const db = await Database.load('sqlite:main.db')
    await db.execute('DELETE FROM Wilayah WHERE id = $1', [inputId])
    setOpenSnack(true)
    setOpenDial(false)
    window.location.reload()
  }

  function handleCloseSnack(_event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false)
  }

  function handleChangeKondisi(param: string) {
    if (param === 'tidak') {
      setInputWilayah({ ...inputWilayah, kondisi: param, value_kondisi: 0, netto_kondisi: 0 })
    } else {
      setInputWilayah({ ...inputWilayah, kondisi: param })
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'nama',
      headerName: 'Wilayah',
      width: 200,
    },
    {
      field: 'kondisi',
      headerName: 'Berat Keranjang',
      width: 150
    },
    {
      field: 'value_kondisi',
      headerName: 'Dari(Kg)',
      width: 100
    },
    {
      field: 'netto_kondisi',
      headerName: 'Potongan Netto Kondisi(Kg)',
      width: 200
    },
    {
      field: 'netto_default',
      headerName: 'Potongan Netto Awal(Kg)',
      width: 200
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem icon={<EditSquare />} label='Edit' onClick={() => handleClickUpdate(params.row)} />,
        <GridActionsCellItem icon={<Delete />} label='Hapus' onClick={() => handleClickDelete(params.row.id, params.row.nama)} />
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
          Berhasil {action} Wilayah
        </Alert>
      </Snackbar>
      <Dialog
        open={openDial}
        onClose={() => setOpenDial(false)}
      >
        <DialogTitle >
          {`Anda Yakin Ingin Menghapus Wilayah ${inputNama} ?`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDial(false)}>Tidak</Button>
          <Button onClick={handleDeleteKode}>Ya</Button>
        </DialogActions>
      </Dialog>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Stack sx={modalStyle} gap='20px'>
          <Typography variant='h4'>{action} Wilayah</Typography>
          <TextField
            margin='normal'
            label='Nama Wilayah'
            fullWidth
            onChange={(e) => setInputWilayah({ ...inputWilayah, nama: e.target.value })}
            value={inputWilayah.nama} />
          <FormControl fullWidth margin='normal'>
            <InputLabel>Kondisi</InputLabel>
            <Select
              label="Kondisi"
              onChange={(e) => handleChangeKondisi(e.target.value)}
              value={inputWilayah.kondisi}
            >
              <MenuItem value={'lebih'}>Lebih</MenuItem>
              <MenuItem value={'kurang'}>Kurang</MenuItem>
              <MenuItem value={'tidak'}>Tidak Ada</MenuItem>
            </Select>
          </FormControl>
          <NumericFormat
            disabled={disableDari}
            customInput={TextField}
            margin='normal'
            label='Dari'
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">Kg</InputAdornment>
              }
            }}
            //@ts-ignore
            onValueChange={(e) => setInputWilayah({ ...inputWilayah, value_kondisi: e.value })}
            value={inputWilayah.value_kondisi == 0 ? '' : inputWilayah.value_kondisi} />
          <NumericFormat
            customInput={TextField}
            margin='normal'
            label='Potongan netto Dari Kondisi'
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">Kg</InputAdornment>
              }
            }}
            //@ts-ignore
            onValueChange={(e) => setInputWilayah({ ...inputWilayah, netto_kondisi: e.value })}
            value={inputWilayah.netto_kondisi == 0 ? '' : inputWilayah.netto_kondisi} />
          <NumericFormat
            customInput={TextField}
            margin='normal'
            label='Potongan netto Default'
            fullWidth
            //@ts-ignore
            onValueChange={(e) => setInputWilayah({ ...inputWilayah, netto_default: e.value })}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">Kg</InputAdornment>
              }
            }}
            value={inputWilayah.netto_default == 0 ? '' : inputWilayah.netto_default} />
          <Button onClick={handleSubmit} disabled={disableButton} startIcon={<Save />}>Simpan</Button>
        </Stack>
      </Modal>
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h4'>Kelola Wilayah</Typography>
        <Button startIcon={<Add />} onClick={handleAdd}>Tambah Wilayah</Button>
      </Stack>
      <div style={{ margin: "20px 0", display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          columns={columns}
          rows={dataWilayah}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          disableRowSelectionOnClick
          pageSizeOptions={[20]}
          rowHeight={35}
        />
      </div>
    </Box>
  )
}
