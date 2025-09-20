import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import Database from '@tauri-apps/plugin-sql';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'No.', width: 90 },
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
    headerName: 'Harga',
    type: 'number',
    width: 160,
  },
  {
    field: 'bruto',
    headerName: 'Bruto',
    type: 'number',
    width: 100,
  },
  {
    field: 'netto',
    headerName: 'Netto',
    type: 'number',
    width: 100,
  },
  {
    field: 'jumlah_harga',
    headerName: 'Jumlah Harga',
    type: 'number',
    width: 200
  }
];


export default function DataPembelian() {

  const [refresh, setRefresh] = useState(false)
  const [dataPembelian, setDataPembelian] = useState([])

  async function getData() {
    const db = await Database.load('sqlite:test.db')
    setDataPembelian(await db.select('SELECT Pembelian.id, Kode.kode, Pembelian.nama, Pembelian.harga, Pembelian.bruto, Pembelian.netto, Pembelian.jumlah_harga from Pembelian INNER JOIN Kode ON Pembelian.kode_id = Kode.id'))
  }

  useEffect(() => {
    getData()
  }, [refresh])

  return (
    <Box>
      <Typography variant='h4'>Data Pembelian</Typography>
      <div style={{ margin: "20px 0", display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          rows={dataPembelian}
          columns={columns}
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

