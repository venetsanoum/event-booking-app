export const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString('el-GR', { weekday: 'long' });
    const dateFormatted = date.toLocaleDateString('el-GR');
    const timeFormatted = date.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${weekday}, ${dateFormatted}, ${timeFormatted}`;
};

export const formatEventDateRange = (start, end) => {
    if (!start && !end) return "Δεν έχει οριστεί ημερομηνία";
    if (!start || !end) return formatEventDate(start || end);

    if (new Date(start).toDateString() === new Date(end).toDateString()) {
        return formatEventDate(start);
    }
    return `${formatEventDate(start)} - ${formatEventDate(end)}`;
};