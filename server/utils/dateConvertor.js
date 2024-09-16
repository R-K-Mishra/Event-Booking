module.exports = dateConvertor = (currentDate) => {

    // Using Date object and toLocaleString

    const dateObject = new Date(currentDate);

    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    };

    const formattedDate = dateObject.toLocaleString('en-US', options);

    return formattedDate;

} 