import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = (props: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTomorrow, setIsTomorrow] = useState<Boolean>();
  let formattedDate: string = '';
  useEffect(() => {
    if (selectedDate) {
      formattedDate = selectedDate.getDay() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();
      var today = new Date();
      if (selectedDate.getDate() === today.getDate() + 1){
        setIsTomorrow(true);
        console.log(true);
      }
    }
  }, [selectedDate])
  
  const { onRetrievedDate } = props;
  onRetrievedDate(formattedDate);
  return (
    <DatePicker
      selected={selectedDate}
      dateFormat="dd/MM/yyyy"
      placeholderText='Klikk her for å velge dato'
      onChange={date => setSelectedDate(date)}
      minDate={new Date(Date.now() + 86400000)} // tomorrow
      // minDate={new Date(2023,3,4)}
      maxDate={new Date(2023,3,10)}
      withPortal
    />
  );
};

export default Calendar;
