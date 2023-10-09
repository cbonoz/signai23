export const formatDate = (date) => {
    // check instance of date
    if (!(date instanceof Date)) {
        date = new Date(date*1000)
    }
    // get local datetime
    const localDate = date.toLocaleDateString()
    return localDate;
}

export const isEmpty = s => {
    return !s || s.length === 0
}

export const parseError = (error) => {
    if (error.response && error.response.data) {
        error = error.response.data.error?.error || error.response.data.error || error.response.data;
    }
    console.log('error', error)
    if (error.body) {
        return error.body.error?.errorMsg || error.body.error || error.body;
    }
    return error.error_msg || error.error || error.message || error;
}