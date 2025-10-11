import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import numberSplitter from "../../helpers/numberSplitter";

interface pembelianProps {
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

interface biayaPembelianProps {
  administrasi: number
  pajak: number
  rokok: number
  mod_rokok: number
}

interface biayaAkhirProps {
  administrasi: number
  pajak: number
  rokok: number
  jumlah_rokok: number
}

interface jumlahTotalProps {
  harga: number
  bruto: number
  netto: number
}

type PrintPageProps = {
  dataPembelian: pembelianProps[]
  dataBiaya: biayaPembelianProps | undefined
  biayaAkhir: biayaAkhirProps
  jumlahTotal: jumlahTotalProps
  totalAkhir: number
}

export default function PreviewPrint(props: PrintPageProps) {

  const { dataPembelian, dataBiaya, biayaAkhir, jumlahTotal, totalAkhir } = props

  return (
    <Box sx={{ border: '2px solid black' }} height='100%'>
      <Stack justifyContent='space-between' height='100%'>
        <Box>
          <Stack justifyContent='space-between' direction='row' sx={{ padding: '10px' }}>
            <Box>
              <Typography variant="body2">Kode : {dataPembelian.length != 0 ? dataPembelian[0].kode_id : ''}</Typography>
              <Typography variant="body2">Tanggal : {dataPembelian.length != 0 ? dataPembelian[0].created_date : ''}</Typography>
            </Box>
            <Typography variant="body2">Kepada : {dataPembelian.length != 0 ? dataPembelian[0].nama : ''}</Typography>
          </Stack>
          <Stack direction='row' sx={{ border: '2px solid black' }} justifyContent='space-between'>
            <Typography variant="body2">GIRIK</Typography>
            <Typography variant="body2">BK</Typography>
            <Typography variant="body2">BB</Typography>
            <Typography variant="body2">HARGA</Typography>
            <Typography variant="body2">JUMLAH</Typography>
          </Stack>
          {dataPembelian.map((v, i: number) => (
            <Stack key={i} direction='row' justifyContent='space-between'>
              <Typography variant="body2">{v.no}</Typography>
              <Typography variant="body2">{v.bruto}</Typography>
              <Typography variant="body2">{v.netto}</Typography>
              <Typography variant="body2">x Rp. {numberSplitter(v.harga)}</Typography>
              <Typography variant="body2">Rp. {numberSplitter(v.jumlah_harga)}</Typography>
            </Stack>
          ))}
        </Box>
        {dataPembelian.length != 0 && (
          <Box>
            <Stack direction='row' sx={{ border: '2px solid black' }} justifyContent='space-between'>
              <Typography variant="body2">TOTAL JUMLAH</Typography>
              <Typography variant="body2">Rp. {numberSplitter(jumlahTotal.harga)}</Typography>
            </Stack>
            <Stack direction='row'>
              <Typography variant="body2">JUMLAH KERANJANG : {dataPembelian.length}</Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant="body2">LAIN-LAIN: </Typography>
              <Typography variant="body2">Rp. {numberSplitter(biayaAkhir.pajak)}</Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant="body2">ROKOK : Rp. {numberSplitter(dataBiaya?.rokok)}</Typography>
              <Typography variant="body2">x {biayaAkhir.jumlah_rokok}</Typography>
              <Typography variant="body2">Rp. {numberSplitter(biayaAkhir.rokok)}</Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant="body2">BAYAR : </Typography>
              <Typography variant="body2">Rp. {numberSplitter(totalAkhir)}</Typography>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  )
}
