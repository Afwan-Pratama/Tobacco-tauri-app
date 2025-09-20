import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'no', headerName: 'No.', width: 90 },
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
    field: 'jumlah',
    headerName: 'Jumlah',
    type: 'number',
    width: 200
  }
];


export default function DataPenjualan() {
  return (
    <Box>
      <Typography variant='h4'>Data Penjualan</Typography>
      <div style={{ margin: "20px 0", display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[20]}
          checkboxSelection
          rowHeight={35}
          disableRowSelectionOnClick
        />
      </div>
    </Box>
  )
}

const rows = [
  { id: 1, no: 1, nama: 'Snow', kode: 'Jon', bruto: 14, harga: 15000, netto: 100, jumlah: 100000 },
  { id: 2, no: 2, nama: 'Lannister', kode: 'Cersei', bruto: 31, harga: 15000, netto: 100, jumlah: 100000 },
  { id: 3, no: 3, nama: 'Lannister', kode: 'Jaime', bruto: 31, harga: 15000, netto: 100, jumlah: 100000 },
  { id: 4, no: 4, nama: 'Stark', kode: 'Arya', bruto: 11, harga: 15000, netto: 100, jumlah: 100000 },
  { id: 5, no: 5, nama: 'Targaryen', kode: 'Daenerys', bruto: 150, harga: 15000, netto: 100, jumlah: 100000 },
  { id: 6, no: 6, nama: 'Melisandre', kode: 'Harvey', bruto: 150, harga: 15000, netto: 100, jumlah: 100000 },
  { id: 7, no: 7, nama: 'Clifford', kode: 'Ferrara', bruto: 44, harga: 15000, netto: 100, jumlah: 100000 },
  { id: 8, no: 8, nama: 'Clifford', kode: 'Ferrara', bruto: 44, harga: 15000, netto: 100, jumlah: 100000 },
  { id: 9, no: 9, nama: 'Clifford', kode: 'Ferrara', bruto: 44, harga: 15000, netto: 100, jumlah: 100000 },
  { id: 10, no: 10, nama: 'Clifford', kode: 'Ferrara', bruto: 44, harga: 15000, netto: 100, jumlah: 100000 },
  { id: 11, no: 11, nama: 'Clifford', kode: 'Ferrara', bruto: 44, harga: 15000, netto: 100, jumlah: 100000 },
  { id: 12, no: 12, nama: 'Clifford', kode: 'Ferrara', bruto: 44, harga: 15000, netto: 100, jumlah: 100000 },
];
