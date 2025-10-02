import NavigateNext from "@mui/icons-material/NavigateNext";
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
  handleGetData: (kode_id: number | undefined, no: string) => void
  handleSubmitPembelian: (arg0: pembelianProps) => void
  dataPembelian: pembelianProps[]
  getKodePem: { id: number, label: string }[]
}

export default function SearchPembelianPen(props: SearchPembelianProps) {

  const { handleGetData, handleSubmitPembelian, dataPembelian, getKodePem } = props

  const [inputKode, setInputKode] = useState('')
  const [inputNo, setInputNo] = useState('')

  function handleEnter(e: string) {
    setInputKode(e)
    const kodeId = getKodePem.find(k => k.label == e)
    handleGetData(kodeId?.id, inputNo)
  }

  function handleNoEnter(e: React.KeyboardEvent) {
    if (e.key == 'Enter') {
      const kodeId = getKodePem.find(k => k.label == inputKode)
      handleGetData(kodeId?.id, inputNo)
    }
  }

  function handleChoosePembelian(params: pembelianProps) {
    handleSubmitPembelian(params)
  }

  return (
    <Box>
      <Typography variant="h5">Mohon untuk mencari data pembelian yang belum terjual</Typography>
      <Stack marginY='20px' direction='row' alignItems='center' gap='20px'>
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
                  <TableCell>{v.harga}</TableCell>
                  <TableCell>{v.bruto}</TableCell>
                  <TableCell>{v.netto}</TableCell>
                  <TableCell>{v.jumlah_harga}</TableCell>
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
