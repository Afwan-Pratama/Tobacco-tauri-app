import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getLabaKoPemb, getLabaKoPembWil, getLabaKoPenj, getLabaKoPenjWil, getLabaNo, getLabaNoWil, getLabaRugi, getLabaWil } from '../../../helpers/fetchSQL/Select/labaRugi';
import { getKodePembeAsLab, getKodePenjuAsLab, getWilayahOnlyLab } from '../../../helpers/fetchSQL/Select';
import numberSplitter from '../../../helpers/numberSplitter';

const columns: GridColDef[] = [
  { field: 'no', headerName: 'No Penjual', width: 50 },
  { field: 'no_beli', headerName: 'No Penjual', width: 50 },
  {
    field: 'kode',
    headerName: 'Kode Penjualan',
  },
  {
    field: 'kode_beli',
    headerName: 'Kode Pembelian',
  },
  {
    field: 'harga',
    headerName: 'Harga Jual(Rp)',
    type: 'number',
  },
  {
    field: 'harga_beli',
    headerName: 'Harga Beli(Rp)',
    type: 'number',
  },
  {
    field: 'selisih_harga',
    headerName: 'Laba Harga(Rp)',
    type: 'number',
  },
  {
    field: 'bruto',
    headerName: 'Bruto Jual(Kg)',
    type: 'number',
  },
  {
    field: 'bruto_beli',
    headerName: 'Bruto Beli(Kg)',
    type: 'number',
  },
  {
    field: 'selisih_bruto',
    headerName: 'Selisih Bruto(Kg)',
    type: 'number',
  },
  {
    field: 'netto',
    headerName: 'Netto Jual(Kg)',
    type: 'number',
  },
  {
    field: 'netto_beli',
    headerName: 'Netto Beli(Kg)',
    type: 'number',
  },
  {
    field: 'selisih_netto',
    headerName: 'Selisih Netto(Kg)',
    type: 'number',
  },
  {
    field: 'jumlah_harga',
    headerName: 'Jumlah Harga Jual(Rp)',
    type: 'number',
  },
  {
    field: 'jumlah_beli',
    headerName: 'Jumlah Harga Beli(Rp)',
    type: 'number',
  },
  {
    field: 'selisih_jumlah',
    headerName: 'Laba Jumlah Harga(Rp)',
    type: 'number',
  }
];

interface labaRugiProps {
  id: number
  no: string
  kode: string
  harga: number
  bruto: number
  netto: number
  jumlah_harga: number
  harga_beli: number
  bruto_beli: number
  netto_beli: number
  jumlah_beli: number
  no_beli: string
  kode_beli: string
  selisih_harga: number
  selisih_bruto: number
  selisih_netto: number
  selisih_jumlah: number
}

export default function LabaRugi() {

  const [dataLabaRugi, setDataLabaRugi] = useState<labaRugiProps[]>([])
  const [jumlahTotal, setJumlahTotal] = useState({
    harga: 0,
    bruto: 0,
    netto: 0,
    jumlah_harga: 0
  })
  const [valueKodePen, setValueKodePen] = useState<{ id: number, label: string }[]>([])
  const [valueKodePem, setValueKodePem] = useState<{ id: number, label: string }[]>([])
  const [valueWilayah, setValueWilayah] = useState<{ id: number, label: string }[]>([])
  const [filterNomer, setFilterNomer] = useState('')
  const [filterWilayah, setFilterWilayah] = useState('')
  const [filterKode, setFilterKode] = useState({
    penjualan: '',
    pembelian: ''
  })

  function sendToFront(params: labaRugiProps[]) {
    setDataLabaRugi(params)
    setJumlahTotal({
      harga: params.reduce((v: number, n) => v + n.selisih_harga, 0),
      bruto: params.reduce((v: number, n) => v + n.selisih_bruto, 0),
      netto: params.reduce((v: number, n) => v + n.selisih_netto, 0),
      jumlah_harga: params.reduce((v: number, n) => v + n.selisih_jumlah, 0)
    })
  }

  async function getKode() {
    const kodePen = await getKodePenjuAsLab()
    const kodePem = await getKodePembeAsLab()
    const wilayah = await getWilayahOnlyLab()
    setValueKodePen(kodePen)
    setValueKodePem(kodePem)
    setValueWilayah(wilayah)
  }

  async function getData() {
    const data = await getLabaRugi()
    sendToFront(data)
  }

  useEffect(() => {
    getData()
    getKode()
  }, [])

  async function handleFilterNomer(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      if (filterWilayah !== '') {
        const selectWilayah = valueWilayah.find(k => k.label == filterWilayah)
        sendToFront(await getLabaNoWil(filterNomer, selectWilayah?.id))
      }
      else {
        sendToFront(await getLabaNo(filterNomer))
      }
    }
  }

  async function handleFilterKodePen(v: string) {
    setFilterKode({
      pembelian: '',
      penjualan: v
    })
    const kodeId = valueKodePen.find(k => k.label == v)
    if (filterWilayah !== '') {
      const selectWilayah = valueWilayah.find(k => k.label == filterWilayah)
      sendToFront(await getLabaKoPenjWil(kodeId?.id, selectWilayah?.id))
    } else {
      sendToFront(await getLabaKoPenj(kodeId?.id))
    }
  }

  async function handleFilterKodePem(v: string) {
    setFilterKode({
      pembelian: v,
      penjualan: ''
    })
    setFilterNomer('')
    const kodeId = valueKodePem.find(k => k.label == v)
    if (filterWilayah !== '') {
      const selectWilayah = valueWilayah.find(k => k.label == filterWilayah)
      sendToFront(await getLabaKoPembWil(kodeId?.id, selectWilayah?.id))
    } else {
      sendToFront(await getLabaKoPemb(kodeId?.id))
    }

  }

  async function handleFilterWilayah(v: string) {
    setFilterWilayah(v)
    const selectWilayah = valueWilayah.find(k => k.label == v)
    if (filterNomer !== '') {
      sendToFront(await getLabaNoWil(filterNomer, selectWilayah?.id))
    }
    if (filterKode.pembelian !== '') {
      const kodeId = valueKodePem.find(k => k.label == v)
      sendToFront(await getLabaKoPembWil(kodeId?.id, selectWilayah?.id))
    }
    if (filterKode.penjualan !== '') {
      const kodeId = valueKodePen.find(k => k.label == v)
      sendToFront(await getLabaKoPenjWil(kodeId?.id, selectWilayah?.id))
    }
    else {
      sendToFront(await getLabaWil(selectWilayah?.id))
    }
  }


  async function handleDeleteFilter() {
    if (filterWilayah != '') {
      const selectWilayah = valueWilayah.find(k => k.label == filterWilayah)
      sendToFront(await getLabaWil(selectWilayah?.id))
    } else {
      getData()
    }
    setFilterKode({
      penjualan: '',
      pembelian: ''
    })
    setFilterNomer('')
  }

  return (
    <Box>
      <Typography variant='h4'>Laporan Laba Rugi</Typography>
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
        <TextField
          type='number' label='No. Beli/Jual'
          onChange={(e) => {
            setFilterNomer(e.target.value)
            setFilterKode({
              penjualan: '',
              pembelian: ''
            })
          }}
          value={filterNomer}
          onKeyDown={handleFilterNomer}
        />
        <Autocomplete
          sx={{
            width: '300px'
          }}
          disablePortal
          disableClearable
          options={valueKodePen}
          autoHighlight
          onChange={(_e, d) => handleFilterKodePen(d === null || d === undefined ? '' : d.label)}
          inputValue={filterKode.penjualan}
          renderInput={(params) => <TextField {...params} label="Kode Penjualan" />}
        />
        <Autocomplete
          sx={{
            width: '300px'
          }}
          disablePortal
          disableClearable
          options={valueKodePem}
          autoHighlight
          onChange={(_e, d) => handleFilterKodePem(d === null || d === undefined ? '' : d.label)}
          inputValue={filterKode.pembelian}
          renderInput={(params) => <TextField {...params} label="Kode Pembelian" />}
        />
        {(filterKode.pembelian != '' || filterNomer != '' || filterKode.penjualan != '') &&
          <Button onClick={handleDeleteFilter}>Hapus Filter</Button>
        }
      </Stack>
      <div style={{ margin: "20px 0", display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          rows={dataLabaRugi}
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
      {dataLabaRugi.length != 0 &&
        <Stack justifyContent='space-between' direction='row' sx={{ p: 4, bgcolor: 'background.paper', bottom: 0, right: 0, left: 0, position: 'sticky' }}>
          <Box>
            <Typography variant='body1'>Total Keranjang: {dataLabaRugi.length}</Typography>
            <Typography variant='body1'>Rata-Rata Laba Harga: Rp. {numberSplitter(Math.floor(jumlahTotal.harga / dataLabaRugi.length))}</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Selisih Bruto : {jumlahTotal.bruto} Kg</Typography>
            <Typography variant='body1'>Rata-Rata Selisih Bruto : {Math.floor(jumlahTotal.bruto / dataLabaRugi.length)} Kg</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Selisih Netto : {jumlahTotal.netto} Kg</Typography>
            <Typography variant='body1'>Rata-Rata Selisih Netto : {Math.floor(jumlahTotal.netto / dataLabaRugi.length)} Kg</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Laba Jumlah Harga: Rp. {numberSplitter(jumlahTotal.jumlah_harga)} </Typography>
            <Typography variant='body1'>Rata-Rata Laba Jumlah Harga: Rp. {numberSplitter(Math.floor(jumlahTotal.jumlah_harga / dataLabaRugi.length))} </Typography>
          </Box>
        </Stack>
      }
    </Box>
  )
}
