



export const DateConverterEventCard = (InputDate) => {

    const localDate = new Date(InputDate);

    const arr = localDate.toString().split(" ");

    const x = parseInt(arr[4].substring(0, 2), 10);

    const hour = (x > 12 ? (x - 12).toString() : x.toString());

    const outputDate = arr[0] + ', ' + (arr[2][0] === '0' ? arr[2][1] : arr[2]) + ' ' + arr[1] + ' ' + arr[3] + ' • ' + hour + arr[4].substring(2, 5) + (Number(arr[4].substring(0, 2)) > 12 ? ' PM ' : ' AM ') + arr[5].substring(0, 4) + (arr[5][4] === '0' ? '' : arr[5][4]) + arr[5][5] + ':' + arr[5].substring(6, 8);

    return outputDate;
    
}

export const DateConverterEventPage = (InputDate) => {

    const localDate = new Date(InputDate);

    const arr = localDate.toString().split(" ");

    const x = parseInt(arr[4].substring(0, 2), 10);

    const hour = (x > 12 ? (x - 12).toString() : x.toString());

    switch (arr[1]) {
        case 'Jan':
            arr[1] = 'January'; break;
        case 'Feb':
            arr[1] = 'February'; break;
        case 'Mar':
            arr[1] = 'March'; break;
        case 'Apr':
            arr[1] = 'April'; break;
        case 'May':
            arr[1] = 'May'; break;
        case 'Jun':
            arr[1] = 'June'; break;
        case 'July':
            arr[1] = 'July'; break;
        case 'Aug':
            arr[1] = 'August'; break;
        case 'Sep':
            arr[1] = 'September'; break;
        case 'Oct':
            arr[1] = 'October'; break;
        case 'Nov':
            arr[1] = 'November'; break;
        case 'Dec':
            arr[1] = 'December'; break;
        default: break
    }

    switch (arr[0]) {
        case 'Sun':
            arr[0] = 'Sunday'; break;
        case 'Mon':
            arr[0] = 'Monday'; break;
        case 'Tue':
            arr[0] = 'Tuesday'; break;
        case 'Wed':
            arr[0] = 'Wednesday'; break;
        case 'Thu':
            arr[0] = 'Thursday'; break;
        case 'Fri':
            arr[0] = 'Friday'; break;
        case 'Sat':
            arr[0] = 'Saturday'; break;
        default: break
    }

    const outputDate = arr[0] + ', ' + (arr[2][0] === '0' ? arr[2][1] : arr[2]) + ' ' + arr[1] + ' ' + arr[3] + ' • ' + hour + arr[4].substring(2, 5) + (Number(arr[4].substring(0, 2)) > 12 ? ' PM ' : ' AM ') + ' - ' + arr[5].substring(0, 4) + (arr[5][4] === '0' ? '' : arr[5][4]) + arr[5][5] + ':' + arr[5].substring(6, 8);

    return outputDate;
    
}