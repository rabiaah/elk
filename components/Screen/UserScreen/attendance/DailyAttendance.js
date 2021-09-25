import React, { Component } from 'react';
import {
    FlatList, Text, View, Image, StatusBar,
    TouchableOpacity, Platform,
    RefreshControl, BackHandler
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Actions } from 'react-native-router-flux';

import AntDesign from 'react-native-vector-icons/AntDesign'

import { DailyAttendanceStyle } from './DailyAttendanceStyle';

import{GetAttendanceFeed} from '../../../../services/UserService/EmployeeTrackService'

import { MyPanelCombo } from '../../../MenuDrawer/DrawerContent';
import { urlDev, urlResource } from '../../../../services/api/config';
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;
function StatusBarPlaceHolder()
{
    return (
        <View style={{
            width: "100%",
            height: STATUS_BAR_HEIGHT,
            backgroundColor: '#F3F3F3',
        }}>
            <StatusBar/>
        </View>
    );
}

export default class DailyAttendances extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeList: [],
            employeeDetail: {},
            statusCount: { TotalEmployee: 0, TotalCheckIn: 0, TotalCheckOut: 0 },
            refreshing: false,
            selectedId: 1,
            displayAbleEmployeeList: [],
            CompanyId: 0,
            UserId: 0,
        }
    }
    handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
    _onRefresh = async () => {
        this.setState({
            refreshing: true,
            selectedId: 1
        })
        setTimeout(function () {
            this.setState({
                refreshing: false,
            });

        }.bind(this), 2000);

       // this.getAttendanceFeed(this.state.CompanyId);
    }

    setSelectedOption = (id) => {
        this.setState({ selectedId: id });
        switch (id) {
            case 1: //All
                this.setState({ displayAbleEmployeeList: this.state.employeeList });
                break;
            case 2: //checked in
                this.setState({ displayAbleEmployeeList: this.state.employeeList.filter(x => x.IsCheckedIn) });
                break;
            case 3: //not attend
                this.setState({ displayAbleEmployeeList: this.state.employeeList.filter(x => x.NotAttend) });
                break;
            case 3: //not attend
                this.setState({ displayAbleEmployeeList: this.state.employeeList.filter(x => x.NotAttend) });
                break;
        }
    };

    async  componentDidMount() {
     
        const UserId = await AsyncStorage.getItem("userId");
        const cId = await AsyncStorage.getItem("companyId");
        this.setState({ UserId: UserId, CompanyId: cId });
        console.log("UserId", this.state.UserId);

       // this.getAttendanceFeed(cId);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }



    getAttendanceFeed = async (cId) => {
        await GetAttendanceFeed(cId)
            .then(res => {
                var cEmployee=res.result.EmployeeList.filter(x => x.UserId === this.state.UserId);
                console.log('cEmployee'+cEmployee);
                if(cEmployee==null){
                    Actions.login();
                }


                this.setState({
                    employeeList: res.result.EmployeeList.filter(x => x.UserId != this.state.UserId),
                    displayAbleEmployeeList: res.result.EmployeeList,
                    statusCount: res.result.StatusCount,
                    employeeDetail: res.result.EmployeeList
                        .filter(x => x.UserId === this.state.UserId)[0]

                });
                console.log(res.result.EmployeeList, "employeeDetail....");
                

            }).catch(() => { console.log("error occured"); });
    }
    renderStatusList() {
        return (
            <View style={DailyAttendanceStyle.countBoxContainer}>
                <TouchableOpacity onPress={() => this.setSelectedOption(1)}>
                    <View style={DailyAttendanceStyle.countBoxColumn1}>
                        <Text
                            style={this.state.selectedId == 1 ?
                                DailyAttendanceStyle.countBoxColumn1NumberActive :
                                DailyAttendanceStyle.countBoxColumn1NumberInactive}>
                            {this.state.statusCount.TotalEmployee}
                        </Text>
                        <Text
                            style={this.state.selectedId == 1 ?
                                DailyAttendanceStyle.countBoxColumn1LabelActive :
                                DailyAttendanceStyle.countBoxColumn1LabelInactive}>
                            TOTAL
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setSelectedOption(2)}>
                    <View style={DailyAttendanceStyle.countBoxColumn2}>
                        <Text style={
                            this.state.selectedId == 2 ?
                                DailyAttendanceStyle.countBoxColumn2NumberActive :
                                DailyAttendanceStyle.countBoxColumn2NumberInactive}>
                            {this.state.statusCount.TotalCheckIn}
                        </Text>
                        <Text style={
                            this.state.selectedId == 2 ?
                                DailyAttendanceStyle.countBoxColumn2LabelActive
                                :
                                DailyAttendanceStyle.countBoxColumn2LabelInactive}>
                            CHECKED IN
                    </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setSelectedOption(3)}>
                    <View style={DailyAttendanceStyle.countBoxColumn3}>
                        <Text style={
                            this.state.selectedId == 3 ?
                                DailyAttendanceStyle.countBoxColumn3NumberActive :
                                DailyAttendanceStyle.countBoxColumn3NumberInactive
                        }
                        >
                            {this.state.statusCount.TotalNotAttend}
                        </Text>
                        <Text style={
                            this.state.selectedId == 3 ? DailyAttendanceStyle.countBoxColumn3LabelActive
                                :
                                DailyAttendanceStyle.countBoxColumn3LabelInactive}
                        >
                            Not Attend
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>
        );

    }

    render() {
        return (
            <View style={DailyAttendanceStyle.container}>
               <StatusBarPlaceHolder />
                <View
                    style={DailyAttendanceStyle.HeaderContent}>
                    <View
                        style={DailyAttendanceStyle.HeaderFirstView}>
                        <TouchableOpacity
                            style={DailyAttendanceStyle.HeaderMenuicon}
                            onPress={() => { Actions.drawerOpen(); }}>
                            <Image resizeMode="contain" style={DailyAttendanceStyle.HeaderMenuiconstyle}
                                // source={require('../../../../assets/images/menu_b.png')}
                                  source={require('../../../../assets/images/menu_b.png')}
                                
                                >
                            </Image>
                        </TouchableOpacity>
                        <View
                            style={DailyAttendanceStyle.HeaderTextView}>
                            <Text
                                style={DailyAttendanceStyle.HeaderTextstyle}>
                                TODAY'S FEED
                            </Text>
                        </View>
                    </View>
                </View>
               
            </View >
        )
    }
}
