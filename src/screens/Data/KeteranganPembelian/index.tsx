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

interface keteranganProps {
  id: number
  tgl_masuk: string
  tgl_pembelian: string
  wilayah_id: number
  kode: string
  total: number
  bayar: number
  sisa: number
  bonus: number
}

export default function KeteranganPembelian() {

  const [dataKeterangan, setDataKeterangan] = useState<keteranganProps[]>([])
  const [jumlahTotal, setJumlahTotal] = useState({
    total_bayar: 0,
    bayar: 0,
    sisa: 0,
  })
  const [valueKode, setValueKode] = useState<{ id: number, label: string }[]>([])
  const [valueWilayah, setValueWilayah] = useState<{ id: number, label: string }[]>([])
  const [filterDate, setFilterDate] = useState('')
  const [filterWilayah, setFilterWilayah] = useState('')
  const [filterKode, setFilterKode] = useState('')
  const [refresh, setRefresh] = useState(true)

  function sendToFront(params: keteranganProps[]) {
    setDataKeterangan(params)
    setJumlahTotal({
      total_bayar: params.reduce((v: number, n) => v + n.total, 0),
      bayar: params.reduce((v: number, n) => v + n.bayar, 0),
      sisa: params.reduce((v: number, n) => v + n.sisa, 0),
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
    setDataKeterangan([])
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
          rows={dataKeterangan}
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
      {dataKeterangan.length != 0 &&
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
            <Typography variant='body1'>Total Bruto : {jumlahTotal.bruto} Kg</Typography>
            <Typography variant='body1'>Rata-Rata Bruto : {Math.floor(jumlahTotal.bruto / dataKeterangan.length)} Kg</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Netto : {jumlahTotal.netto} Kg</Typography>
            <Typography variant='body1'>Rata-Rata Netto : {Math.floor(jumlahTotal.netto / dataKeterangan.length)} Kg</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Keranjang: {dataKeterangan.length}</Typography>
            <Typography variant='body1'>Rata-Rata Bonus: Rp. {Math.floor(jumlahTotal.bonus / dataKeterangan.length)} </Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Jumlah Bonus : Rp. {jumlahTotal.jumlah_bonus} </Typography>
            <Typography variant='body1'>Rata-Rata Jumlah Bonus: Rp. {Math.floor(jumlahTotal.jumlah_bonus / dataKeterangan.length)} </Typography>
          </Box>
        </Stack>
      }
    </Box>
  )
}
