/* get the day of the year */
function doy (datestr) {
    var start = new Date(datestr.getFullYear(),0,0);
    var diff = (datestr - start) + ((start.getTimezoneOffset() - datestr.getTimezoneOffset())*60*1000);
    var oneDay = 1000*60*60*24;
    var day = Math.floor(diff/oneDay);
    return day;
}

module.exports.doy = doy;
