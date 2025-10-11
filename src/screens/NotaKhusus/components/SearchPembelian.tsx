import NavigateNext from "@mui/icons-material/NavigateNext";
import Alert from '@mui/material/Alert'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import Stack from "@mui/material/Stack";
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from "@mui/material/Typography";
import { useState } from "react";
import numberSplitter from "../../../helpers/numberSplitter";

interface pembelianProps {
  id: number
  no: string
  wilayah_id: number
  kode_id: string
  nama: string
  harga: number
  bruto: number
  netto: number
  jumlah_harga: number
  bonus: number
  created_date: string
}

type SearchPembelianProps = {
  handleGetData: (kode_id: number | undefined, wilayah_id: number | undefined, no: string) => void
  handleSubmitPembelian: (arg0: pembelianProps) => void
  dataPembelian: pembelianProps[]
  getKodePem: { id: number, label: string }[]
  getWil: { id: number, label: string }[]
  jumlah: pembelianProps[]
}

export default function SearchPembelian(props: SearchPembelianProps) {

  const { handleGetData, handleSubmitPembelian, dataPembelian, getKodePem, getWil, jumlah } = props

  const [inputKode, setInputKode] = useState('')
  const [inputNo, setInputNo] = useState('')
  const [inputWilayah, setInputWilayah] = useState('')
  const [openSnack, setOpenSnack] = useState({
    param: '',
    bool: false
  })

  function handleEnter(e: string) {
    setInputKode(e)
    const wilayahId = getWil.find(w => w.label == inputWilayah)
    const kodeId = getKodePem.find(k => k.label == e)
    handleGetData(kodeId?.id, wilayahId?.id, inputNo)
  }

  function handleNoEnter(e: React.KeyboardEvent) {
    if (e.key == 'Enter') {
      const wilayahId = getWil.find(w => w.label == inputWilayah)
      const kodeId = getKodePem.find(k => k.label == inputKode)
      handleGetData(kodeId?.id, wilayahId?.id, inputNo)
    }
  }

  function handleChoosePembelian(params: pembelianProps) {
    let cek: boolean = false
    if (jumlah.length > 0) {
      for (let i = 0; i < jumlah.length; i++) {
        if (jumlah[i].id == params.id) {
          cek = true
          setOpenSnack({
            param: 'id',
            bool: true
          })
        }
        if (jumlah[i].kode_id != params.kode_id || jumlah[i].nama != params.nama || jumlah[i].created_date != params.created_date) {
          cek = true
          setOpenSnack({
            param: 'value',
            bool: true
          })
        }
      }
    }
    if (!cek) {
      handleSubmitPembelian(params)
    }
  }

  function handleEnterWil(params: string) {
    setInputWilayah(params)
    const kodeId = getKodePem.find(k => k.label == inputKode)
    const wilayahId = getWil.find(w => w.label == params)
    handleGetData(kodeId?.id, wilayahId?.id, inputNo)
  }

  function handleCloseSnack(_event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack({
      param: '',
      bool: false
    })
  }

  return (
    <Box>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnack.bool} autoHideDuration={10000} onClose={handleCloseSnack}>
        <Alert
          onClose={handleCloseSnack}
          severity='error'
          variant='filled'
          sx={{ width: '100%' }}
        >
          {openSnack.param === 'id' ? 'Data yang dipilih sama dengan data yang sebelumnya'
            : 'Data yang dipilih tidak memiliki data nama,tanggal,kode yang sama dengan data sebelumnya'}
        </Alert>
      </Snackbar>
      <Typography variant="h5">Mohon untuk mencari data pembelian</Typography>
      <Stack marginY='20px' direction='row' alignItems='center' gap='20px'>
        <Autocomplete
          fullWidth
          autoFocus
          disablePortal
          options={getWil}
          autoHighlight
          inputValue={inputWilayah}
          onChange={(_e, d) => handleEnterWil(d === null || d === undefined ? '' : d.label)}
          renderInput={(params) => <TextField {...params} label="Wilayah" />}
        />
        <TextField
          label='No. Pembelian'
          value={inputNo}
          onChange={(e) => setInputNo(e.target.value.toUpperCase())}
          onKeyDown={handleNoEnter}
        />
        <FormControl fullWidth >
          <Autocomplete
            autoFocus
            disablePortal
            options={getKodePem}
            autoHighlight
            inputValue={inputKode}
            onChange={(_e, d) => handleEnter(d === null || d === undefined ? '' : d.label)}
            renderInput={(params) => <TextField {...params} label="Kode" />}
          />
          {
            getKodePem.length == 0 && (
              <FormHelperText error={true} >Data Kode Pembelian Masih Kosong</FormHelperText>
            )
          }
        </FormControl>
      </Stack>
      {dataPembelian.length != 0 &&
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>No. </TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Nama </TableCell>
                <TableCell>Kode</TableCell>
                <TableCell>Harga </TableCell>
                <TableCell>Bruto </TableCell>
                <TableCell>Netto </TableCell>
                <TableCell>Jumlah </TableCell>
                <TableCell>Pilih</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataPembelian.map((v, i) => (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope="row">{v.no}</TableCell>
                  <TableCell>{v.created_date}</TableCell>
                  <TableCell>{v.nama}</TableCell>
                  <TableCell>{v.kode_id}</TableCell>
                  <TableCell>{numberSplitter(v.harga)}</TableCell>
                  <TableCell>{v.bruto}</TableCell>
                  <TableCell>{v.netto}</TableCell>
                  <TableCell>{numberSplitter(v.jumlah_harga)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleChoosePembelian(v)}>
                      <NavigateNext />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      }
    </Box>
  )
}
