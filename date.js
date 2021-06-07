exports.getDate=getDate;
function getDate()
{
    var d=new Date();
    let options={
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let day=d.toLocaleDateString("en-US",options);
    return day;
}
exports.getDay=getDay;
function getDay()
{
    var d=new Date();
    let options={
        weekday: "long",
    }
    let day=d.toLocaleDateString("en-US",options);
    return day;
}