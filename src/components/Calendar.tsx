import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/CalendarStyles.css";

const Calendar = (props: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { onRetrievedDate } = props;
  
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (onRetrievedDate) {
      onRetrievedDate(date);
    }
  };

  return (
    <DatePicker
      selected={selectedDate}
      dateFormat="dd/MM/yyyy"
      placeholderText='Klikk for å velge dato'
      onChange={handleDateChange}
      minDate={new Date(Date.now() + 86400000)} // tomorrow
      // minDate={new Date(2023,3,4)}
      maxDate={new Date(2023,3,10)}
      wrapperClassName="react-datepicker-wrapper"
      withPortal
    />
  );
};

export default Calendar;
