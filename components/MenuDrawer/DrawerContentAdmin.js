import React, { Component } from 'react';

import {
    ScrollView, StatusBar, Platform,
    Text, View, TouchableOpacity, Image, Alert, AsyncStorage
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import { DrawerContentStyle } from './DrawerContentStyle';
import {
    Feather,
} from '@expo/vector-icons';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;

const drawerContent = 2;
const drawerSelectedOption = (id) => {
    global.DrawerContentId = id
    
};
const LiveTrackingCombo = () => {
    Actions.LiveTraking(); drawerSelectedOption(1);
}
const DailyAttendanceCombo = () => {
    Actions.DailyAttendance(); drawerSelectedOption(2);
}
const TasksCombo = () => {
    Actions.TabnavigationInTasks(); drawerSelectedOption(3);
}
const TasksboardCombo = () => {
    Actions.TaskBoardScreen(); drawerSelectedOption(4);
}

const LeavesCombo = () => {
    Actions.LeaveList(); drawerSelectedOption(5);
}



const ReportsCombo = () => {
    Actions.ReportScreen(); drawerSelectedOption(6);
}

const NoticeCombo = () => {
    Actions.Notice(); drawerSelectedOption(7);
}
const LeaderBoardCombo = () => {
    Actions.LeaderBoard(); drawerSelectedOption(8);
}
const SettingsCombo = () => {
    Actions.SettingScreen(); drawerSelectedOption(9);
}

export {
    DailyAttendanceCombo,
    LiveTrackingCombo,
    TasksCombo,
    LeavesCombo,
    ReportsCombo, NoticeCombo, SettingsCombo,
    drawerSelectedOption,
    TasksboardCombo,
}

export default class DrawerContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedId: 1,
        }
    }
    async componentDidMount() {
        global.DrawerContentId = 2;
    }
    
    render() {
        return (
            <View style={DrawerContentStyle.container}>
         
                <View
                    style={[DrawerContentStyle.logoImage,
                    { marginBottom: 2, marginTop: 2, justifyContent: "flex-start", alignItems: 'center' }
                    ]}>
                    <Image
                        resizeMode='contain'
                        style={{ height: 90, }}
                        source={require('../../assets/images/logo_ns.png')} >
                    </Image>
                </View>
         
                <ScrollView showsVerticalScrollIndicator={false}>
                    
                    <TouchableOpacity
                        onPress={() => DailyAttendanceCombo()}
                        style={
                            global.DrawerContentId == 2 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                        <Image
                            resizeMode='contain'
                            style={{ width: 23, height: 23, }}
                            source={require('../../assets/images/home.png')} >
                        </Image>

                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Today Attendance
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => LiveTrackingCombo()}
                        style={
                            global.DrawerContentId == 1 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                        <Image
                            resizeMode='contain'
                            style={{ width: 23, height: 23, }}
                            source={require('../../assets/images/pin_s.png')} >
                        </Image>

                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Live Tracking
                        </Text>
                    </TouchableOpacity>

                  
                    <TouchableOpacity
                        onPress={() => TasksCombo()}
                        style={
                            global.DrawerContentId == 3 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>

                        <Image
                            resizeMode='contain'
                            style={{ width: 23, height: 23, }}
                            source={require('../../assets/images/task.png')} >

                        </Image>
                        <Text style={DrawerContentStyle.itemTextStyle}>
                        All Tasks
                </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress={() => LeavesCombo()}
                        style={
                            global.DrawerContentId == 5 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                        <Image
                            resizeMode='contain'
                            style={{ width: 23, height: 23, }}
                            source={require('../../assets/images/leaves.png')} >

                        </Image>
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Leaves
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => ReportsCombo()}
                        style={
                            global.DrawerContentId == 6 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>

                        <Image
                            resizeMode='contain'
                            style={{ width: 23, height: 23, }}
                            source={require('../../assets/images/report.png')} >

                        </Image>
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Attendance Report
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => NoticeCombo()}
                        style={
                            global.DrawerContentId == 7 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>

                        <Image
                            resizeMode='contain'
                            style={{ width: 23, height: 23, }}
                            source={require('../../assets/images/notice.png')} >

                        </Image>
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Notice Board
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => LeaderBoardCombo()}
                        style={
                            global.DrawerContentId == 8 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>

                        <Feather name="activity" size={24} color="#218f6f"
                            style={{ transform: [{ scaleX: -1 }] }}
                        />
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Leader Board
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => SettingsCombo()}
                        style={
                            global.DrawerContentId == 9 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                                <Image
                                resizeMode='contain'
                                style={{ width: 23, height: 23, }}
                                source={require('../../assets/images/setting.png')} >

                            </Image>
                            <Text style={DrawerContentStyle.itemTextStyle}>
                            Settings
                    </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View >
        )
    }
}
