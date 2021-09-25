import React, { Component } from 'react';

import
{
    ScrollView, StatusBar, Platform, Dimensions,
    Text, View, TouchableOpacity, Image, Alert, AsyncStorage
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import { DrawerContentStyle } from './DrawerContentStyle';
import
{
    clearStorageValue
} from "../../common/storage";
import
{
    Feather,
} from '@expo/vector-icons';
const logOut = () =>
{
    global.DrawerContentId = 8;
    Alert.alert(
        'Log Out'
        ,
        'Log Out From The App?', [{
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
        }, {
            text: 'OK',
            style: 'ok',
            onPress: async () =>
            {
                await clearStorageValue();
                Actions.auth({ type: 'reset'})
            }
        },], {
        cancelable: false
    }
    )
    return true;
};
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;

const drawerContent = 9;
const drawerSelectedOption = (id) =>
{
    global.DrawerContentId = id
   
};

const DailyAttendanceCombo = () =>
{
        Actions.DailyAttendance(); drawerSelectedOption(1);
}
const TasksCombo = () =>
{
        Actions.userTask(); drawerSelectedOption(2);
}

//user
const MyPanelCombo = () =>
{
    Actions.MyPanel(); drawerSelectedOption(4);
}
const LeavesCombo = () =>
{

        Actions.LeaveListUser(); drawerSelectedOption(5);
}


const NoticeCombo = () =>
{
        Actions.NoticeUser(); drawerSelectedOption(6);

}
const LeaderBoardCombo = () =>
{
    Actions.LeaderBoard(); drawerSelectedOption(7);
}
const SettingsCombo = () =>
{
        drawerSelectedOption(8);
        logOut();

}
var { width, height } = Dimensions.get('window');
export
{
    DailyAttendanceCombo,
    TasksCombo,
    LeavesCombo,
    NoticeCombo, SettingsCombo,
    drawerSelectedOption,
    MyPanelCombo,
}

function StatusBarPlaceHolder()
{
    return (
        <View style={{
            width: "100%",
            height: STATUS_BAR_HEIGHT,
            backgroundColor: '#F3F3F3',
        }}>
            <StatusBar />
        </View>
    );
}
export default class UserDrawerContent extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            selectedId: 1,
        }
    }
    async componentDidMount()
    {
        global.DrawerContentId = 1;
    }
    getMyPanel()
    {
        if (global.userType == "user")
        {
            return (<TouchableOpacity
                onPress={() => MyPanelCombo()}
                style={
                    global.DrawerContentId == 3 ?
                        DrawerContentStyle.itemContainerSelected :
                        DrawerContentStyle.itemContainer}>
                <Feather name="map" size={24} color="#218f6f"
                    style={{ transform: [{ scaleX: -1 }] }}
                />
                <Text style={DrawerContentStyle.itemTextStyle}>
                    My panel
            </Text>
            </TouchableOpacity>)
        }
    }
    render()
    {
        return (
            <View style={DrawerContentStyle.container}>

                <View
                    style={[DrawerContentStyle.logoImage,
                    { marginBottom: 5, marginTop: 10,
                       justifyContent: "flex-start", alignItems: 'center', flexDirection: 'row' }
                    ]}>
                    <Image
                        resizeMode='contain'
                        style={{ height: 38, width: 38,   marginVertical:15, }}
                        source={require('../../assets/images/icon_s.png')} >
                    </Image>
                    <Text style={{
                        marginLeft: 5,
                        fontSize: 26,
                        fontWeight: "bold",
                        color: "#000000",
                        fontFamily: "Montserrat_Bold",
                    }}>
                        OFFICE HR PRO
                    </Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* <TouchableOpacity
                        onPress={() => DailyAttendanceCombo()}
                        style={
                            global.DrawerContentId == 1 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                        <Image
                            resizeMode='contain'
                            style={{ width: 23, height: 23, }}
                            source={require('../../assets/images/attndt.png')} >
                        </Image>

                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Attendance
                        </Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                    onPress={() => MyPanelCombo()}
                    style={
                        global.DrawerContentId == 4 ?
                            DrawerContentStyle.itemContainerSelected :
                            DrawerContentStyle.itemContainer}>
                        <Feather name="map" size={24} color="#218f6f"
                            style={{ transform: [{ scaleX: -1 }] }}
                        />
                        <Text style={DrawerContentStyle.itemTextStyle}> My Panel</Text>
                </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => TasksCombo()}
                        style={
                            global.DrawerContentId == 2 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>

                        <Image
                            resizeMode='contain'
                            style={{ width: 23, height: 23, }}
                            source={require('../../assets/images/taskList.png')} >

                        </Image>
                            <Text style={DrawerContentStyle.itemTextStyle}>My Tasks</Text>
                    </TouchableOpacity>
                   
                    {/* <TouchableOpacity
                        onPress={() => LeavesCombo()}
                        style={
                            global.DrawerContentId == 5 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                        <Image
                            resizeMode='contain'
                            style={{ width: 23, height: 23, }}
                            source={require('../../assets/images/leave_s.png')} >

                        </Image>
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Leaves
                        </Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity
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
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity
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
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={() => SettingsCombo()}
                        style={
                            global.DrawerContentId == 9 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                            <Feather name="log-out" size={25} color="#c24a4a" />
                   
                            <Text style={DrawerContentStyle.itemTextStyle}>
                                Logout
                    </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View >
        )
    }
}
