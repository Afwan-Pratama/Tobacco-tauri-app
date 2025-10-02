import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/id'

type CustomDatePickerProps = {
  onChange: (date: string) => void,
  value: string
  label: string
  disable: boolean
}

export default function CustomDatePicker(props: CustomDatePickerProps) {

  const { onChange, value, label, disable } = props

  const [valueDayjs, setValuejs] = useState<Dayjs | null>(null)

  useEffect(() => {
    if (value != '') {
      setValuejs(dayjs(value, 'D-M-YYYY'))
    }
  }, [value])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='id'>
      <DatePicker
        disabled={disable}
        label={label}
        value={valueDayjs}
        onChange={(n) => {
          if (n != undefined) {
            const date = `${n.date()}-${n.month() + 1}-${n.year()}`
            onChange(date)
          }
        }
        }
      />
    </LocalizationProvider>

  )
}
