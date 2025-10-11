import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getKodePembeAsLab, getWilayahOnlyLab } from '../../../helpers/fetchSQL/Select';
import { getCustomBonus } from '../../../helpers/fetchSQL/Select/Bonus';
import CustomDatePicker from '../../../components/CustomDatePicker';
import Button from '@mui/material/Button'
import numberSplitter from '../../../helpers/numberSplitter';

const columns: GridColDef[] = [
  { field: 'no', headerName: 'No.', width: 90 },
  {
    field: 'created_date',
    headerName: 'Tanggal',
    width: 100
  },
  {
    field: 'kode',
    headerName: 'Kode',
    width: 100,
  },
  {
    field: 'nama',
    headerName: 'Nama',
    width: 150,
  },
  {
    field: 'harga',
    headerName: 'Harga (Rp)',
    type: 'number',
    width: 160,
  },
  {
    field: 'bruto',
    headerName: 'Bruto (Kg)',
    type: 'number',
    width: 100,
  },
  {
    field: 'netto',
    headerName: 'Netto (Kg)',
    type: 'number',
    width: 100,
  },
  {
    field: 'jumlah_harga',
    headerName: 'Jumlah Harga (Rp)',
    type: 'number',
    width: 200
  },
  {
    field: 'bonus',
    headerName: 'Bonus (Rp)',
    type: 'number',
    width: 100
  },
  {
    field: 'jumlah_bonus',
    headerName: 'Jumlah Bonus (Rp)',
    type: 'number',
    width: 150
  },
];

interface bonusProps {
  id: number
  no: string
  created_date: string
  nama: string
  kode: string
  harga: number
  bruto: number
  netto: number
  jumlah_harga: number
  bonus: number
  jumlah_bonus: number
}

export default function Bonus() {

  const [dataBonus, setDataBonus] = useState<bonusProps[]>([])
  const [jumlahTotal, setJumlahTotal] = useState({
    bonus: 0,
    bruto: 0,
    netto: 0,
    jumlah_bonus: 0,
  })
  const [valueKode, setValueKode] = useState<{ id: number, label: string }[]>([])
  const [valueWilayah, setValueWilayah] = useState<{ id: number, label: string }[]>([])
  const [filterDate, setFilterDate] = useState('')
  const [filterWilayah, setFilterWilayah] = useState('')
  const [filterKode, setFilterKode] = useState('')
  const [refresh, setRefresh] = useState(true)

  function sendToFront(params: bonusProps[]) {
    setDataBonus(params)
    setJumlahTotal({
      bonus: params.reduce((v: number, n) => v + n.bonus, 0),
      bruto: params.reduce((v: number, n) => v + n.bruto, 0),
      netto: params.reduce((v: number, n) => v + n.netto, 0),
      jumlah_bonus: params.reduce((v: number, n) => v + n.jumlah_bonus, 0),
    })
  }

  async function getValue() {
    setValueKode(await getKodePembeAsLab())
    setValueWilayah(await getWilayahOnlyLab())
  }

  async function getData(a: string, b: string, c: string) {
    const kodeId = valueKode.find(k => k.label == b)
    const wilayahId = valueWilayah.find(w => w.label == a)
    sendToFront(await getCustomBonus(wilayahId?.id, kodeId?.id, c))
  }

  useEffect(() => {
    getValue()
  }, [])

  useEffect(() => {
    if (filterDate != '' || filterKode != '' || filterWilayah != '')
      getData(filterWilayah, filterKode, filterDate)
  }, [refresh])

  async function handleFilterWilayah(e: string) {
    setFilterWilayah(e)
    setRefresh(!refresh)
  }

  async function handleFilterKode(e: string) {
    setFilterKode(e)
    setRefresh(!refresh)
  }

  async function handleFilterDate(d: string) {
    setFilterDate(d)
    setRefresh(!refresh)
  }

  function handleDeleteFilter() {
    setDataBonus([])
    setFilterWilayah('')
    setFilterKode('')
    setFilterDate('')
  }

  return (
    <Box>
      <Typography variant='h4'>Laporan Bonus</Typography>
      <Stack direction='row' marginTop='20px' gap='20px'>
        <Autocomplete
          sx={{
            width: '300px'
          }}
          disablePortal
          disableClearable
          options={valueWilayah}
          autoHighlight
          onChange={(_e, d) => handleFilterWilayah(d === null || d === undefined ? '' : d.label)}
          inputValue={filterWilayah}
          renderInput={(params) => <TextField {...params} label="Wilayah" />}
        />
        <CustomDatePicker
          disable={false}
          label='Tanggal'
          onChange={(d) => handleFilterDate(d)}
          value={filterDate} />
        <Autocomplete
          sx={{
            width: '300px'
          }}
          disablePortal
          disableClearable
          options={valueKode}
          autoHighlight
          onChange={(_e, d) => handleFilterKode(d === null || d === undefined ? '' : d.label)}
          inputValue={filterKode}
          renderInput={(params) => <TextField {...params} label="Kode" />}
        />
        {(filterKode != '' || filterDate != '' || filterWilayah != '') &&
          <Button onClick={handleDeleteFilter}>Hapus Filter</Button>
        }
      </Stack>
      <div style={{ margin: "20px 0", display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          rows={dataBonus}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          rowHeight={35}
          disableRowSelectionOnClick
        />
      </div>
      {dataBonus.length != 0 &&
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
          <Box>
            <Typography variant='body1'>Total Bruto : {numberSplitter(jumlahTotal.bruto)} Kg</Typography>
            <Typography variant='body1'>Rata-Rata Bruto : {Math.floor(jumlahTotal.bruto / dataBonus.length)} Kg</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Netto : {numberSplitter(jumlahTotal.netto)} Kg</Typography>
            <Typography variant='body1'>Rata-Rata Netto : {Math.floor(jumlahTotal.netto / dataBonus.length)} Kg</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Keranjang: {dataBonus.length}</Typography>
            <Typography variant='body1'>Rata-Rata Bonus: Rp. {numberSplitter(Math.floor(jumlahTotal.bonus / dataBonus.length))} </Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Jumlah Bonus : Rp. {numberSplitter(jumlahTotal.jumlah_bonus)} </Typography>
            <Typography variant='body1'>Rata-Rata Jumlah Bonus: Rp. {numberSplitter(Math.floor(jumlahTotal.jumlah_bonus / dataBonus.length))} </Typography>
          </Box>
        </Stack>
      }
    </Box>
  )
}
