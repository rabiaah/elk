import React from 'react';
import {
    Platform, StatusBar, Dimensions,
    TouchableOpacity, View, Text,
    Image, ScrollView,
    BackHandler,
    RefreshControl,
    FlatList, StyleSheet,
} from 'react-native';
import Timeline from 'react-native-timeline-flatlist'
import { Actions } from 'react-native-router-flux';
import * as actions from '../../../common/actions';
import { DailyAttendanceStyle } from './DailyAttendanceStyle';
import {
    GetMyTodayAttendance,
    GetMovementDetails
} from '../../../services/EmployeeTrackService';

import { CommonStyles } from '../../../common/CommonStyles';
import { ConvertUtcToLocalTime } from '../../../common/commonFunction';

import call from 'react-native-phone-call'

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;
function StatusBarPlaceHolder() {
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

export default class DailyAttendanceDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DepartmentName: "",
            Designation: "",
            EmployeeName: "",
            UserId: "",
            Latitude: 0,
            Longitude: 0,
            LogLocation: '',
            EmpTrackList: [],
            data: [],
        }
    }
    call = () => {
        //handler to make a call
        const args = {
            number: global.phoneNumber,
            prompt: false,
        };
        call(args).catch(console.error);
    }

    async componentDidMount() {
        global.aItemUserId = await this.props.aItem.UserId;
        await this.getEmpTrackInfo();
        await this.getEmpInfo();
        global.phoneNumber = await this.props.aItem.PhoneNumber;
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        Actions.DailyAttendance();
        return true;
    }

    getEmpTrackInfo = async () => {
        try {
            await GetMovementDetails(global.aItemUserId)
                .then(res => {
                    this.setState({
                        EmpTrackList: res.result,
                    });
                    res.result.map((userData, index) => {
                        var title = '';
                        var color = '';
                        if (userData.IsCheckInPoint) {
                            title = "Checked In";
                            color = "green"
                        } else if (userData.IsCheckOutPoint) {
                            title = "Checked Out";
                            color = "red"
                        } else {
                            title = "Checked point";
                            color = "gray"
                        }
                        var myObj = {
                            "time": ConvertUtcToLocalTime(userData.LogDateTime),
                            "title": title,
                            "description":  userData.LogLocation,
                            "circleColor": color
                        };
                        this.state.data.push(myObj);
                    });
                    this.setState({
                        Longitude: res.result[res.result.length - 1].Longitude,
                        Latitude: res.result[res.result.length - 1].Latitude,
                        LogLocation: res.result[res.result.length - 1].LogLocation,
                    });
                })
                .catch((ex) => {
                    console.log(ex, "GetMovementDetails error occured");
                });
        }
        catch (error) {
            console.log(error);
        }
    }

    goBack() {
        // Actions.NoticeDetail();
        actions.push("DailyAttendance");

    };

    getEmpInfo = async () => {
        try {

            await GetMyTodayAttendance(global.aItemUserId)
                .then(res => {
                    console.log(res.result, "getEmpInfo");
                    this.setState({ EmployeeName: res.result.EmployeeName, });
                    this.setState({ DepartmentName: res.result.DepartmentName, });
                    this.setState({ Designation: res.result.Designation, });
                    global.aItemEmployeeName = res.result.EmployeeName;

                })
                .catch(() => {
                    console.log("error occured");
                });

        } catch (error) {
            console.log(error);
        }
    }
    _onRefresh = async () => {
        this.setState({ refreshing: true });
        setTimeout(function () {
            this.setState({
                refreshing: false,
            });

        }.bind(this), 2000);
        this.getEmpTrackInfo();
    };
    renderTrackList() {
        return (
            <View style={styles.container}>
                <Timeline
                    style={styles.list}
                    data={this.state.data}
                    circleSize={20}
                    circleColor={"circleColor"}
                    lineColor='rgb(45,156,219)'
                    timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
                    timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13, marginTop: 5, }}
                    descriptionStyle={{ color: 'gray' }}
                    options={{
                        style: { paddingTop: 5 }
                    }}
                    innerCircle={'dot'}
                />
            </View>
        );
    }

    render() {
        var { width, height } = Dimensions.get('window');
        return (
            <View style={DailyAttendanceStyle.container}>
                <StatusBarPlaceHolder />
                <View
                    style={CommonStyles.HeaderContent}>
                    <View
                        style={CommonStyles.HeaderFirstView}>
                        <TouchableOpacity
                            style={CommonStyles.HeaderMenuicon}
                            onPress={() => { this.goBack() }}>
                            <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                                source={require('../../../assets/images/left_arrow.png')}>
                            </Image>
                        </TouchableOpacity>
                        <View
                            style={CommonStyles.HeaderTextView}>
                            <Text
                                style={CommonStyles.HeaderTextstyle}>
                                {this.state.EmployeeName}

                            </Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={this.call}
                            style={{
                                padding: 8, paddingVertical: 2,

                            }}>
                            <Image style={{ width: 20, height: 20, alignItems: 'center', marginTop: 5, }}
                                resizeMode='contain'
                                source={require('../../../assets/images/call.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>


                <StatusBar hidden={false} backgroundColor="rgba(0, 0, 0, 0.2)" />
                <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#f5f7f9',
                    }}>
                    <View style={{ backgroundColor: '#ffffff' }}>
                        <View style={{ flexDirection: 'column' }}>
                            {this.renderTrackList()}
                            {/* {this.state.data.length>0?this.renderTrackList():<View><Text>No Activities Found to show</Text></View>} */}
                        </View>
                    </View>
                </View>
            </ScrollView>
         
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20, paddingTop: 0,

        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
});
