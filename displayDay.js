module.exports=getDay;

function getDay(){
  var options={
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  var today=new Date();

  var displayDay=today.toLocaleDateString("en-US",options);
return displayDay;
}
