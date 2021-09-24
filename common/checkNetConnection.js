import { ToastAndroid } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

export const CheckConnection = {

    async isconnection(){
        if (await NetInfo.isConnected.fetch()){
            ToastAndroid.show('Connected', ToastAndroid.TOP);
        }
        else{
            ToastAndroid.show('Plese Connect the Internet', ToastAndroid.TOP);
        }
        
    }
    
}
