function formatDate(dateString) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}

function formatForBirthdayInput(birthdayStr) {
    const birthdayDate = new Date(birthdayStr);

    const year = birthdayDate.getFullYear();
    const month = String(birthdayDate.getMonth() + 1).padStart(2, '0');
    const day = String(birthdayDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

module.exports = { formatDate, formatForBirthdayInput };