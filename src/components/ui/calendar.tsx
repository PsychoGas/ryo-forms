import * as React from "react";

export interface CalendarProps {
  onSelect: (date: Date) => void;
  selectedDate?: Date;
}

export function Calendarcomp({ onSelect, selectedDate }: CalendarProps) {
  const [date, setDate] = React.useState(selectedDate || new Date());

  const handleDateChange = (newDate: Date) => {
    onSelect(newDate);
  };

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + direction);
    setDate(newDate);
  };

  return (
    <div
      style={{
        border: "1px solid #505F5A",
        padding: "10px",
        color: "#505F5A",
        boxShadow: "0px 0px 10px rgba(80, 95, 90, 0.5)",
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <h2
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button onClick={() => handleMonthChange(-1)}>&lt;</button>
        <div style={{ textAlign: "center" }}>
          <b>
            {date.toLocaleString("default", { month: "long", year: "numeric" })}
          </b>
        </div>
        <button onClick={() => handleMonthChange(1)}>&gt;</button>
      </h2>
      <table>
        <thead>
          <tr>
            <th style={{ color: "#505F5A" }}>Sun</th>
            <th style={{ color: "#505F5A" }}>Mon</th>
            <th style={{ color: "#505F5A" }}>Tue</th>
            <th style={{ color: "#505F5A" }}>Wed</th>
            <th style={{ color: "#505F5A" }}>Thu</th>
            <th style={{ color: "#505F5A" }}>Fri</th>
            <th style={{ color: "#505F5A" }}>Sat</th>
          </tr>
        </thead>
        <tbody>
          {getWeeks(date).map((week, index) => (
            <tr key={index}>
              {week.map((day, index) => (
                <td key={index}>
                  {day === null ? (
                    <span>&nbsp;</span>
                  ) : (
                    <button
                      style={{
                        borderRadius: "35%",
                        border: "1px solid #505F5A",
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#505F5A",
                        backgroundColor: "#FFFFFF",
                        transition: "background-color 0.5s, color 0.5s",
                      }}
                      onMouseOver={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor =
                          "#505F5A";
                        (e.target as HTMLButtonElement).style.color = "#FFFFFF";
                      }}
                      onMouseOut={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor =
                          "#FFFFFF";
                        (e.target as HTMLButtonElement).style.color = "#505F5A";
                      }}
                      onClick={() => handleDateChange(day)}
                    >
                      {day.getDate()}
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getWeeks(date: Date) {
  const firstDayOfWeek = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfWeek = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const weeks: (Date | null)[][] = [];

  for (let i = 0; i < 6; i++) {
    const week: (Date | null)[] = [];

    for (let j = 0; j < 7; j++) {
      const day = new Date(
        firstDayOfWeek.getTime() + (i * 7 + j) * 24 * 60 * 60 * 1000
      );

      if (day.getMonth() === date.getMonth()) {
        week.push(day);
      } else {
        week.push(null);
      }
    }

    weeks.push(week);
  }

  return weeks;
}
