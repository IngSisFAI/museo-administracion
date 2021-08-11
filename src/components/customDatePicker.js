import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import React, { useState } from "react";

function invalid(fecha) {
  if (fecha === null || (fecha.toString()).trim() === 'Invalid Date')
    return true;
  else
    return false;

}

const CustomDatePicker = (props) => {
  const [date, setDate] = useState(null);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        margin="normal"
        id="date-picker-dialog"
        label="Ingrese Fecha"
        format="dd/MM/yyyy"
        clearable
        value={date}
        onChange={(event) => {

         // if (!invalid(event)) {

          // console.log("Date picker value: ", event);
          //  console.log(props.columnDef.tableData.id);

            setDate(event);
            props.onFilterChanged(props.columnDef.tableData.id, event);
         // }

        }}
        KeyboardButtonProps={{
          "aria-label": "change date"
        }}
      />
    </MuiPickersUtilsProvider>
  );
};
export default CustomDatePicker;
