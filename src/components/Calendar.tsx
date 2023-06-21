import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/CalendarStyles.css";

const Calendar = (props: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);
  const { onRetrievedDate, passedDate } = props;

  useEffect(() => {
    const today = new Date(); // get today's date
    setMaxDate(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()));
  }, [])
  
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (onRetrievedDate) {
      onRetrievedDate(date);
    }
  };

  const filterDate = (date: any) => {
    const timeOfDay = new Date().getHours();
    
    // Enable dates between 3rd of April and 10th of April
    if (date >= new Date("2023-04-02") && date <= new Date("2023-04-10")){
      if (date.getDate() === new Date().getDate() && timeOfDay > 20) {
        return false;
      }
      return true;
    }
  
    // Enable every Tuesday after 10th of April up until 17th of June
    if (
      date >= new Date("2023-04-10") &&
      date <= new Date("2023-06-17") &&
      date.getDay() === 2
    ){
      return true;
    }
  
    // Enable every date after 2nd of July up until 17th of August
    if (date >= new Date("2023-07-02") && date <= new Date("2023-08-17")) {
      return true;
    }
  
  
    // Disable all other dates
    return false;
  };
  

  return (
    <DatePicker
      selected={selectedDate || passedDate}
      dateFormat="dd/MM/yyyy"
      placeholderText='Klikk for å velge dato'
      onChange={handleDateChange}
      minDate={new Date()} // today
      // minDate={new Date(2023,3,3)}
      maxDate={maxDate}
      wrapperClassName="react-datepicker-wrapper"
      withPortal
      filterDate={filterDate}
    />
  );
};

export default Calendar;
