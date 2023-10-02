export const formatDate = (date) => {
    // check instance of date
    if (!(date instanceof Date)) {
        date = new Date(date*1000)
    }
    // get local datetime
    const localDate = date.toLocaleDateString()
    return localDate;
}