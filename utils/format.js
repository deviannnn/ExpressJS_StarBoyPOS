function formatDate(dateString) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}

module.exports = { formatDate };