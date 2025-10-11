import Box from "@mui/material/Box"
import Save from "@mui/icons-material/Save";
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import CustomDatePicker from "../../../components/CustomDatePicker";
import numberSplitter from "../../../helpers/numberSplitter";
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

interface wilayahProps {
  id: number
  nama: string
  kondisi: string
  value_kondisi: number
  netto_kondisi: number
  netto_default: number
}

type FormPemProps = {
  valueKode: { id: number, label: string }[]
  handleAdd: (data: pembelianProps) => void
  choosed: pembelianProps
  wilayahChoosed: wilayahProps | undefined
}

export default function FormPem(props: FormPemProps) {

  const { valueKode, handleAdd, choosed, wilayahChoosed } = props

  const [inputValue, setInputValue] = useState({
    no: '',
    kode_id: '',
    nama: '',
    harga: 0,
    bruto: 0,
    netto: 0,
    bonus: 0,
    created_date: ''
  })
  const [fieldDisable, setFieldDisable] = useState(false)

  const jumlahHarga = useMemo<number>(() => (
    inputValue.netto > 0 ?
      inputValue.netto * inputValue.harga :
      0
  ), [inputValue.harga, inputValue.netto])


  useEffect(() => {
    if (wilayahChoosed != undefined) {
      const wilayah = wilayahChoosed
      switch (wilayah.kondisi) {
        case "kurang":
          if (inputValue.bruto < wilayah.value_kondisi) {
            setInputValue({
              ...inputValue,
              netto: inputValue.bruto - wilayah.netto_kondisi
            })
          } else {
            setInputValue({
              ...inputValue,
              netto: inputValue.bruto - wilayah.netto_default
            })
          }
          break;
        case "lebih":
          if (inputValue.bruto > wilayah.value_kondisi) {
            setInputValue({
              ...inputValue,
              netto: inputValue.bruto - wilayah.netto_kondisi
            })
          } else {
            setInputValue({
              ...inputValue,
              netto: inputValue.bruto - wilayah.netto_default
            })
          }
          break;
        case "tidak":
          setInputValue({
            ...inputValue,
            netto: inputValue.bruto - wilayah.netto_default
          })
          break;
      }
    }
  }, [inputValue.bruto])

  useEffect(() => {
    if (choosed != undefined) {
      setInputValue({
        no: choosed.no,
        kode_id: choosed.kode_id,
        nama: choosed.nama,
        harga: choosed.harga,
        bruto: choosed.bruto,
        netto: choosed.netto,
        bonus: choosed.bonus,
        created_date: choosed.created_date
      })
    }
  }, [choosed])

  const handleNext = () => {
    if (wilayahChoosed != undefined) {
      handleAdd(
        {
          ...inputValue,
          id: choosed.id,
          wilayah_id: wilayahChoosed.id,
          jumlah_harga: jumlahHarga
        }
      )
    }
    setFieldDisable(true)
  }

  return (
    <Box>
      <TextField
        autoFocus
        margin="normal"
        label="No."
        fullWidth
        onChange={(e) => setInputValue({
          ...inputValue,
          no: e.target.value.toUpperCase()
        })}
        value={inputValue.no}
      />
      <CustomDatePicker
        disable={fieldDisable}
        label="Tanggal"
        value={inputValue.created_date}
        onChange={(e) => setInputValue({
          ...inputValue,
          created_date: e
        })}
      />
      <FormControl fullWidth margin="normal">
        <Autocomplete
          disablePortal
          options={valueKode}
          autoHighlight
          inputValue={choosed.kode_id}
          disabled={fieldDisable}
          onChange={(_e, d) => setInputValue({
            ...inputValue,
            kode_id: d === null || d === undefined ? '' : d.label
          })}
          renderInput={(params) => <TextField {...params} label="Kode" />}
        />
        {
          valueKode.length == 0 && (
            <FormHelperText error={true}>Data Kode Pembelian Masih Kosong</FormHelperText>
          )
        }
      </FormControl>
      <TextField
        disabled={fieldDisable}
        margin="normal"
        label={"Nama"}
        fullWidth
        onChange={(e) => setInputValue({
          ...inputValue,
          nama: e.target.value.toUpperCase()
        })}
        value={inputValue.nama} />
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
            startAdornment: <InputAdornment position="start">Rp.</InputAdornment>
          }
        }}
        onValueChange={(e) => setInputValue({
          ...inputValue,
          //@ts-ignore
          bonus: e.value
        })}
        value={inputValue.bonus == 0 ? '' : inputValue.bonus} />
      <Typography variant="body1">Netto : {inputValue.netto} Kg</Typography>
      <Typography variant="body1">Jumlah Harga: Rp.{numberSplitter(jumlahHarga)}</Typography>
      <Button
        variant="contained"
        sx={{ margin: '20px' }}
        disabled={
          inputValue.harga == 0 ||
          inputValue.bruto == 0 ||
          inputValue.no == '' ||
          inputValue.kode_id == '' ||
          inputValue.nama == '' ||
          inputValue.bonus == 0
        }
        endIcon={<Save />}
        onClick={handleNext}>
        Lanjutkan
      </Button>
    </Box>

  )
}
