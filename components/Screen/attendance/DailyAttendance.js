import React, { Component } from 'react';
import {View, Text} from 'react-native';
import {
    loadFromStorage,
    storage,
    CurrentUserProfile
} from "../../../common/storage";
import DailyAttendances  from '../UserScreen/attendance/DailyAttendance';
import AdminTodayAttendance from '../attendance/AdminTodayAttendance';
export default class DailyAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: 'admin'
        }
    }

    async  componentDidMount() {

        var userDetails = await loadFromStorage(storage, CurrentUserProfile)
        .then(res=>{
            console.log("userTTTT",res)
            this.setState({ userType: 'user' })
            global.userType='user';
        })
        

    };

    render() {
        return (<DailyAttendances/>)
        // return (
        //     <View><Text>ghfhfh</Text></View>
        // )
     };
}