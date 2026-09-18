export const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString('el-GR', { weekday: 'long' });
    const dateFormatted = date.toLocaleDateString('el-GR');
    const timeFormatted = date.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${weekday}, ${dateFormatted}, ${timeFormatted}`;
};

export const formatEventDateRange = (start, end) => {
    if (new Date(start).toDateString() === new Date(end).toDateString()) {
        return formatEventDate(start);
    }
    else return `${formatEventDate(start)} - ${formatEventDate(end)}`;
}