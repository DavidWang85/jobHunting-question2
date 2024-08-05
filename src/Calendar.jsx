import moment from 'moment';
import { useEffect, useState } from 'react';
const Calendar = () => {
    const [days, setDays] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(moment());
    const [currentDay, setCurrentDay] = useState(currentMonth.clone());
    const [weekdays, setWeekDays] = useState(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // 生成從開始日到結束日的所有日期
    const createMonthAllDays = () => {
        const startOfMonth = currentMonth.clone().startOf('month');
        const endOfMonth = currentMonth.clone().endOf('month');
        const startDay = startOfMonth.clone().subtract(startOfMonth.day(), 'days'); // 從當前月份的第一天所在的週日開始
        const endDay = endOfMonth.clone().add(6 - endOfMonth.day(), 'days'); // 到當前月份的最後一天所在的週六結束
        const daysArray = [];
        for (let day = startDay; day.isBefore(endDay); day.add(1, 'day')) {
            daysArray.push(day.clone());
        }
        setDays(daysArray);
    }


    const handleDateClick = (day) => {
        if (day.month() !== currentMonth.month()) {
            return;
        }
        if (!startDate || (startDate && endDate)) {
            setStartDate(day);
            setEndDate(null);
        } else if (day.isSameOrAfter(startDate)) {
            setEndDate(day);
        } else {
            setStartDate(day);
        }
    };

    const isSameDay = (day1, day2) => {
        return day1 && day2 && day1.isSame(day2, 'day');
    };

    const isInRange = (day, start, end) => {
        return start && end && day.isBetween(start, end, 'day', '[]');
    };

    useEffect(() => {
        createMonthAllDays();
    }, [currentMonth])

    return (
        <div className='container'>
            <div className='calender-header d-flex justify-content-center align-items-center'>
                <button className='calender-month-select' type='button'>{'<'}</button>
                <h3>{currentMonth.format('YYYY年M月')}</h3>
                <button className='calender-month-select' type='button'>{'>'}</button>
            </div>
            <div className='d-flex flex-wrap'>
                {weekdays.map(day => (
                    <div
                        key={day}
                        className='calender-week-title'
                    >
                        {day}
                    </div>
                ))}
                {console.log(currentMonth.day())}
                {days.map(day => (
                    <button
                        type='button'
                        key={day.format('YYYY-MM-DD')}
                        onClick={() => handleDateClick(day)}
                        className='calender-day-button'
                        style={{
                            cursor: day.month() === currentMonth.month() ? 'pointer' : 'not-allowed',
                            color: day.month() !== currentMonth.month() ? '#757575' : isSameDay(day, startDate) || isSameDay(day, endDate) || isInRange(day, startDate, endDate) ? 'white' : 'black',
                            backgroundColor: isSameDay(day, currentDay) ? '#ffff76' : isSameDay(day, currentDay) ? '#ffff76' : isSameDay(day, startDate) || isSameDay(day, endDate) ? '#006edc' : isInRange(day, startDate, endDate) ? '#006edc' : "",
                        }}
                        onMouseEnter={(e) => {
                            if (day.month() !== currentMonth.month()) {
                                e.target.style.backgroundColor = 'white';
                            }
                        }}
                    >
                        {day.format('D')}日
                    </button>
                ))}
            </div>
        </div>
    );
}
export default Calendar;