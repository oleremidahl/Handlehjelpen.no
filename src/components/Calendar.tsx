import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = (props: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  let formattedDate: string = '';
  if (selectedDate) {
    formattedDate = selectedDate.getDay() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();
  }
  const { onRetrievedDate } = props;
  onRetrievedDate(formattedDate);
  return (
    <DatePicker
      selected={selectedDate}
      placeholderText='Klikk her for å velge dato'
      onChange={date => setSelectedDate(date)}
      minDate={new Date(Date.now() + 86400000)} // tomorrow
      withPortal
    />
  );
};

export default Calendar;
