import Save from "@mui/icons-material/Save";
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import Stack from '@mui/material/Stack';
import { dateNow } from "../../../../helpers/dateNow";
import Autocomplete from '@mui/material/Autocomplete'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from "@mui/material/TableRow";
import Database from "@tauri-apps/plugin-sql";
import { useParams } from "react-router-dom";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { NumericFormat } from "react-number-format";

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

type FormPenjualanProps = {
  removeChoosed: () => void
  valueKode: { id: number, label: string }[]
  choosed: pembelianProps | undefined
  handleBack: () => void
}

export default function FormPenjualan(props: FormPenjualanProps) {

  const { id } = useParams()

  const { removeChoosed, handleBack, valueKode, choosed } = props

  const [inputValue, setInputValue] = useState({
    no: '',
    kode_id: '',
    harga: 0,
    bruto: 0,
    netto: 0,
  })
  const [loading, setLoading] = useState(false)

  const jumlahHarga = useMemo<number>(() => (
    inputValue.netto > 0 ?
      inputValue.netto * inputValue.harga :
      0
  ), [inputValue.harga, inputValue.netto])

  useEffect(() => {
    if (choosed != undefined) {
      setInputValue({
        ...inputValue,
        bruto: choosed.bruto,
        netto: choosed.netto
      })
    }
  }, [])


  async function handleSendToDB() {
    setLoading(true)
    const db = await Database.load('sqlite:main.db')
    const getKodeId = await db.select<{ id: number }[]>('SELECT id FROM Kode_Penjualan WHERE kode = $1'
      , [inputValue.kode_id])
    await db.execute('INSERT INTO Penjualan (no,wilayah_id,kode_id,pembelian_id,harga,bruto,netto,jumlah_harga,created_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [inputValue.no,
        id,
      getKodeId[0].id,
      choosed?.id,
      inputValue.harga,
      inputValue.bruto,
      inputValue.netto,
        jumlahHarga,
      dateNow()])
    await db.execute('UPDATE Pembelian SET sold = 1 WHERE id = $1', [choosed?.id])
    setInputValue({
      ...inputValue,
      no: '',
      harga: 0,
      bruto: 0,
      netto: 0,
    })
    setLoading(false)
    removeChoosed()
  }

  return (
    <Box sx={{ marginBottom: '20px' }}>
      {choosed != undefined && (
        <Stack
          component={"section"}
          alignItems={'start'}
          justifyContent='space-between'
          sx={{ p: 2, border: '2px solid black', borderRadius: 1, marginY: '20px' }}>
          <Button
            sx={{ marginBottom: '20px' }}
            startIcon={<ChevronLeft />}
            onClick={handleBack}>
            Kembali
          </Button>
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
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope="row">{choosed.no}</TableCell>
                  <TableCell>{choosed.created_date}</TableCell>
                  <TableCell>{choosed.nama}</TableCell>
                  <TableCell>{choosed.kode_id}</TableCell>
                  <TableCell>{choosed.harga}</TableCell>
                  <TableCell>{choosed.bruto}</TableCell>
                  <TableCell>{choosed.netto}</TableCell>
                  <TableCell>{choosed.jumlah_harga}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TextField
            autoFocus
            margin="normal"
            label="No."
            fullWidth
            onChange={(e) => setInputValue({
              ...inputValue,
              no: e.target.value.toUpperCase()
            })
            }
            value={inputValue.no}
          />

          <FormControl fullWidth margin="normal">
            <Autocomplete
              disablePortal
              options={valueKode}
              autoHighlight
              inputValue={inputValue.kode_id}
              onChange={(_e, d) => setInputValue({
                ...inputValue,
                kode_id: d === null || d === undefined ? '' : d.label
              })}
              renderInput={(params) => <TextField {...params} label="Kode" />}
            />
            {
              valueKode.length == 0 && (
                <FormHelperText error={true} >Data Kode Pejualan Masih Kosong</FormHelperText>
              )
            }
          </FormControl>

          <NumericFormat
            customInput={TextField}
            label="Harga"
            margin="normal"
            fullWidth
            thousandSeparator
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">Rp.</InputAdornment>
              }
            }}
            onValueChange={(e) => setInputValue({
              ...inputValue,
              //@ts-ignore
              harga: e.value
            })}
            value={inputValue.harga == 0 ? '' : inputValue.harga} />
          <NumericFormat
            customInput={TextField}
            label="Bruto"
            margin="normal"
            fullWidth
            thousandSeparator
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">Kg</InputAdornment>
              }
            }}
            onValueChange={(e) => setInputValue({
              ...inputValue,
              //@ts-ignore
              bruto: e.value
            })}
            value={inputValue.bruto == 0 ? '' : inputValue.bruto} />
          <NumericFormat
            customInput={TextField}
            label="Bonus"
            margin="normal"
            fullWidth
            thousandSeparator
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">Kg</InputAdornment>
              }
            }}
            onValueChange={(e) => setInputValue({
              ...inputValue,
              //@ts-ignore
              netto: e.value
            })}
            value={inputValue.netto == 0 ? '' : inputValue.netto} />
          <Typography variant="body1">Jumlah Harga: Rp.{jumlahHarga}</Typography>
          <Button
            variant="contained"
            sx={{ margin: '20px' }}
            disabled={
              inputValue.harga == 0 ||
              inputValue.bruto == 0 ||
              inputValue.no == '' ||
              inputValue.kode_id == '' ||
              inputValue.netto == 0 ||
              loading
            }
            loading={loading}
            endIcon={<Save />}
            onClick={handleSendToDB}>
            Simpan
          </Button>
        </Stack>
      )}
    </Box>
  )
}
