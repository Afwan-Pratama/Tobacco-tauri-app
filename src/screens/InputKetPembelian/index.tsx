import Stack from "@mui/material/Stack";
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import { getKodePembeAsLab, getWilayahOnlyLab } from "../../helpers/fetchSQL/Select";
import CustomDatePicker from "../../components/CustomDatePicker";
import { getCustomKet } from "../../helpers/fetchSQL/Select/pembelian";
import { sendKeterangan } from "../../helpers/fetchSQL/Insert/Keterangan";
import { dateNow } from "../../helpers/dateNow";
import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { Button } from "@mui/material";
import { updateKeteranganOnPembelian } from "../../helpers/fetchSQL/Update";
import { getTopIdKeterangan } from "../../helpers/fetchSQL/Select/getTopId";

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

export default function InputKetPembelian() {

  const [dataPembelian, setDataPembelian] = useState<pembelianProps[]>([])
  const [valueWilayah, setValueWilayah] = useState<{ id: number, label: string }[]>([])
  const [inputBayar, setInputBayar] = useState(0)
  const [valueKode, setValueKode] = useState<{ id: number, label: string }[]>([])
  const [inputDate, setInputDate] = useState('')
  const [inputKode, setInputKode] = useState('')
  const [inputWilayah, setInputWilayah] = useState('')
  const [openSnack, setOpenSnack] = useState(false)
  const [loading, setLoading] = useState(false)

  const calKet = useMemo(() => {
    if (dataPembelian.length != 0) {
      const total = dataPembelian.reduce((v: number, n) => v + n.jumlah_harga, 0)
      return {
        total_bayar: total,
        sisa: total - inputBayar
      }
    } else {
      return {
        total_bayar: 0,
        sisa: 0
      }
    }
  }, [dataPembelian, inputBayar])

  async function getData() {
    setValueWilayah(await getWilayahOnlyLab())
    setValueKode(await getKodePembeAsLab())
  }

  useEffect(() => {
    getData()
  }, [])

  async function handleEnterWil(e: string) {
    setInputWilayah(e)
    if (inputDate != '' && inputKode != '') {
      const wilayahId = valueWilayah.find(w => w.label == e)
      const kodeId = valueKode.find(k => k.label == inputKode)
      setDataPembelian(await getCustomKet(kodeId?.id, wilayahId?.id, inputDate))
    }
  }

  async function handleEnter(e: string) {
    setInputKode(e)
    if (inputDate != '' && inputWilayah != '') {
      const wilayahId = valueWilayah.find(w => w.label == inputWilayah)
      const kodeId = valueKode.find(k => k.label == e)
      setDataPembelian(await getCustomKet(kodeId?.id, wilayahId?.id, inputDate))
    }
  }

  async function handleEnterDate(e: string) {
    setInputDate(e)
    if (inputKode != '' && inputWilayah != '') {
      const wilayahId = valueWilayah.find(w => w.label == inputWilayah)
      const kodeId = valueKode.find(k => k.label == inputKode)
      setDataPembelian(await getCustomKet(kodeId?.id, wilayahId?.id, e))
    }
  }

  async function getKeteranganId() {
    const data = await getTopIdKeterangan()
    if (data.length > 0) {
      return data[0].id
    }
    else {
      return 1
    }
  }

  async function sendToDB() {
    if (inputBayar != 0) {
      setLoading(true)
      const wilayahId = valueKode.find((k) => k.label == inputKode)
      const kodeId = valueKode.find((k) => k.label == inputKode)
      await sendKeterangan(
        dateNow(),
        inputDate,
        kodeId?.id,
        calKet.total_bayar,
        inputBayar,
        calKet.sisa,
        wilayahId?.id
      )
      for (let i = 0; i < dataPembelian.length; i++) {
        await updateKeteranganOnPembelian(dataPembelian[i].id, await getKeteranganId())
      }
      setOpenSnack(true)
      setDataPembelian(await getCustomKet(kodeId?.id, wilayahId?.id, inputDate))
      setLoading(false)
    }
  }

  async function handleEnterBayar(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      await sendToDB()
    }
  }

  async function handleClickBayar() {
    await sendToDB()
  }

  function handleCloseSnack(_event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false)
  }

  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnack}
        autoHideDuration={5000}
        onClose={handleCloseSnack}>
        <Alert
          onClose={handleCloseSnack}
          severity='success'
          variant='filled'
          sx={{ width: '100%' }}
        >
          Berhasil Menyimpan Data Keterangan
        </Alert>
      </Snackbar>
      <Typography variant="h5">Input Keterangan Pembelian</Typography>
      <Stack marginY='20px' direction='row' alignItems='center' gap='20px'>
        <Autocomplete
          sx={{
            width: '300px'
          }}
          fullWidth
          autoFocus
          disablePortal
          options={valueWilayah}
          autoHighlight
          inputValue={inputWilayah}
          onChange={(_e, d) => handleEnterWil(d === null || d === undefined ? '' : d.label)}
          renderInput={(params) => <TextField {...params} label="Wilayah" />}
        />
        <FormControl
          sx={{
            width: '300px'
          }}
        >
          <Autocomplete
            autoFocus
            disablePortal
            options={valueKode}
            autoHighlight
            inputValue={inputKode}
            onChange={(_e, d) => handleEnter(d === null || d === undefined ? '' : d.label)}
            renderInput={(params) => <TextField {...params} label="Kode" />}
          />
          {
            valueKode.length == 0 && (
              <FormHelperText error={true} >Data Kode Pembelian Masih Kosong</FormHelperText>
            )
          }
        </FormControl>
        <CustomDatePicker
          value={inputDate}
          onChange={(e) => handleEnterDate(e)}
          disable={false}
          label="Tanggal"
        />
      </Stack>
      {
        dataPembelian.length != 0 &&
        <>
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
                    <TableCell>{v.harga}</TableCell>
                    <TableCell>{v.bruto}</TableCell>
                    <TableCell>{v.netto}</TableCell>
                    <TableCell>{v.jumlah_harga}</TableCell>
                  </TableRow>
                ))
                }
              </TableBody>
            </Table>
          </TableContainer>
          <Stack
            justifyContent='space-between'
            direction='row'
            sx={{
              p: 4,
              bgcolor: 'background.paper',
              bottom: 0,
              right: 0,
              left: 0,
              position: 'sticky'
            }}
          >
            <Stack direction='row' gap='20px' alignItems='center'>
              <TextField
                label='Bayar'
                value={inputBayar == 0 ? '' : inputBayar}
                //@ts-ignore
                onChange={(e) => setInputBayar(e.target.value)}
                onKeyDown={handleEnterBayar}
              />
              <Button
                loading={loading}
                disabled={loading}
                onClick={handleClickBayar}>
                Bayar
              </Button>
            </Stack>
            <Box>
              <Typography variant="body1">Total Bayar : Rp. {calKet.total_bayar}</Typography>
              <Typography variant="body1">Bayar : Rp. {inputBayar}</Typography>
              <Typography variant="body1">Sisa : Rp. {calKet.sisa}</Typography>
            </Box>
          </Stack>
        </>
      }
    </Box>
  )
}
