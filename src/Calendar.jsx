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
        const startOfMonth = currentMonth.clone().startOf('month'); //當前月份的第一天
        const endOfMonth = currentMonth.clone().endOf('month'); //當前月份的最後一天
        const startDay = startOfMonth.clone().subtract(startOfMonth.day(), 'days'); // 從當前月份的第一天所在的週日
        const endDay = endOfMonth.clone().add(6 - endOfMonth.day(), 'days'); // 到當前月份的最後一天所在的週六
        const daysArray = [];
        //使用 for 循環從 startDay 遍歷到 endDay，每次都將當前日期 day 添加到 daysArray 中
        for (let day = startDay; day.isBefore(endDay); day.add(1, 'day')) {
            daysArray.push(day.clone());
        }
        setDays(daysArray);
    }


    const handleDateClick = (day) => {
        //不是當月日期時，直接回傳
        if (day.month() !== currentMonth.month()) {
            return;
        }
        //開始日期為空 或者 已經有結束日期 => 設定開始日期並且將結束日期設定為null
        if (!startDate || (startDate && endDate)) {
            setStartDate(day);
            setEndDate(null);
        } else if (day.isSameOrAfter(startDate)) { //點擊的日期與開始日期相同或在之後，則將該日期設置為結束日期。
            setEndDate(day);
        } else {
            setStartDate(day); //如果點擊的日期在開始日期之前，則將該日期設置為新的開始日期
        }
    };

    const isSameDay = (day1, day2) => {
        //函數檢查兩個日期（day1 和 day2）是否存在，然後使用 isSame 方法比較它們是否在同一天
        return day1 && day2 && day1.isSame(day2, 'day');
    };

    const isInRange = (day, start, end) => {
        //檢查點擊日期是否在指定範圍內
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
                {days.map(day => (
                    <button
                        type='button'
                        key={day.format('YYYY-MM-DD')}
                        onClick={() => handleDateClick(day)}
                        className='calender-day-button'
                        style={{
                            //判斷是否為當月，決定能不能點擊
                            cursor: day.month() === currentMonth.month() ? 'pointer' : 'not-allowed',
                            //如果 day 的月份不是當前月份，則文字顏色設置為#757575
                            //如果當前 day 是開始日期、結束日期或在開始和結束日期之間的日期，則文字顏色white
                            //以上條件都不符合，則文字顏色設置為black
                            color: day.month() !== currentMonth.month() ? '#757575' : isSameDay(day, startDate) || isSameDay(day, endDate) || isInRange(day, startDate, endDate) ? 'white' : 'black',
                            //如果 day 是當前日期，則背景顏色設置為#ffff76
                            //如果 day 是開始日期或結束日期，則背景顏色設置為#006edc
                            //如果 day 在開始和結束日期之間，背景顏色也設置為#006edc
                            //以上條件都不符合，背景顏色設置為空字符
                            backgroundColor: isSameDay(day, currentDay) ? '#ffff76' : isSameDay(day, currentDay) ? '#ffff76' : isSameDay(day, startDate) || isSameDay(day, endDate) ? '#006edc' : isInRange(day, startDate, endDate) ? '#006edc' : "",
                        }}
                        onMouseEnter={(e) => {
                            if (day.month() !== currentMonth.month()) {
                                e.target.style.backgroundColor = 'white'; //優化css中hover會影響日期的背景問題，讓非當月的日期不會有hover樣式
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