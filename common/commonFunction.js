//import moment from "moment";
import moment from "moment-timezone";
import * as Localization from 'expo-localization';
export const IsNullOrEmpty = (value ) => {
    if (value ==null){
        return true;
    }
    if(value ==""){
        return true;
    }
    return false;
};
export const ConvertUtcToLocalTime = (date ) => {
    if (IsNullOrEmpty(date)){
        return date;
    }
   else{
    var stillUtc = moment.utc(date).toDate();
    tz = Localization.timezone;
    var date = moment(stillUtc);
    var localTime = date.tz(tz).format('LT');
    return localTime;
   }
};