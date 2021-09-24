import React from 'react';
import {
    Platform, StatusBar, Dimensions,
    TouchableOpacity, View, Text,
    Image, ScrollView,
    BackHandler,
    RefreshControl,
    FlatList, StyleSheet, AsyncStorage
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from "react-native-maps-directions";
import Modal from 'react-native-modalbox';
import { Actions } from 'react-native-router-flux';
// // import * as actions from '../../../common/actions';
import { LiveTrackingStyle } from './LiveTrackingStyle';
import { DrawerContentStyle } from "../../MenuDrawer/DrawerContentStyle"
import {
    GetMovementDetailsAll,
    GetMovementDetails
} from '../../../services/EmployeeTrackService';
import Iconic from 'react-native-vector-icons/Feather'
import { CommonStyles } from '../../../common/CommonStyles';
import { SearchBar } from 'react-native-elements';
import { GetEmployeeWithCompanyId } from "../../../services/AccountService";
import { urlDev, urlResource } from '../../../services/api/config';
import { googlemapApiForAutoCheckPoint } from '../../../services/api/config';
const { width, height } = Dimensions.get('window');
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

export default class LiveTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyId: null,
            employeeList: [],
            DepartmentName: "",
            Designation: "",
            EmployeeName: "",
            UserId: "",
            Latitude: 0,
            Longitude: 0,
            LogLocation: '',
            EmpTrackList: [],
            data: [],
            markers: [],
            slectedEmployeeId: 0,
            selctedEmployeeValue: 'All Employee',
        }
        this.arrayholder = [];
        this.mapView = null;
    }


    async componentDidMount() {
        const cId = await AsyncStorage.getItem("companyId");
        this.setState({ companyId: cId });
        await this.getEmpTrackInfo();
        await this.getEmpAllWithCompanyId(cId);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        Actions.DailyAttendance();
        return true;
    }
    getEmpAllWithCompanyId = async (companyId) => {
        try {
            this.setState({ progressVisible: true })
            await GetEmployeeWithCompanyId(companyId)
                .then(res => {
                   this.setState({ employeeList: res.result });
                    this.arrayholder = res.result;
                    this.setState({ progressVisible: false })
                })
                .catch(() => {
                    this.setState({ progressVisible: false })
                    console.log("error occured");
                });
        } catch (error) {
            this.setState({ progressVisible: false })
            console.log(error);
        }
    }
    getEmpTrackInfo = async () => {
        try {
            this.setState({ markers: [] });
            if (this.state.selctedEmployeeValue === "All Employee") {
                await GetMovementDetailsAll(this.state.companyId)
                    .then(res => {
                        this.setState({
                            EmpTrackList: res.result,
                        });
                        var markerlist = [];
                        console.log('movement details', res.result)
                        res.result.map((userData, index) => {
                            var title = '';
                            var color = '';
                            if (userData.IsCheckInPoint) {
                                title = "Checked In";
                                color = 'green';
                            } else if (userData.IsCheckOutPoint) {
                                title = "Checked Out";
                                color = 'red';
                            } else {
                                title = "Checked point";
                                color = 'orange';
                            }
                            var newMarkerObj = {
                                "title": userData.UserName + " " + title + " " + (index + 1),
                                "description": userData.LogLocation,
                                "color": color,
                                coordinates: {
                                    "latitude": userData.Latitude,
                                    "longitude": userData.Longitude
                                },
                            }
                            markerlist.push(newMarkerObj);
                        });
                        this.setState({ markers: this.state.markers.concat(markerlist) });
                        this.setState({
                            Longitude: res.result[res.result.length - 1].Longitude,
                            Latitude: res.result[res.result.length - 1].Latitude,
                            LogLocation: res.result[res.result.length - 1].LogLocation,
                        });
                    })
                    .catch((ex) => {
                        console.log(ex, "GetMovementDetails error occured");
                    });
            } else {
                await GetMovementDetails(this.state.slectedEmployeeId)
                    .then(res => {
                        this.setState({
                            EmpTrackList: res.result,
                        });
                        var markerlist = [];
                        console.log('movement details', res.result)
                        res.result.map((userData, index) => {
                            var title = '';
                            var color = '';
                            if (userData.IsCheckInPoint) {
                                title = "Checked In";
                                color = 'green';
                            } else if (userData.IsCheckOutPoint) {
                                title = "Checked Out";
                                color = 'red';
                            } else {
                                title = "Checked point";
                                color = index===res.result.length -1?'red': 'yellow';
                            }
                            var newMarkerObj = {
                                "title": title + " " + (index + 1),
                                "description": userData.LogLocation,
                                "color": color,
                                coordinates: {
                                    "latitude": userData.Latitude,
                                    "longitude": userData.Longitude
                                },
                            }
                            markerlist.push(newMarkerObj);

                        });
                        this.setState({ markers: this.state.markers.concat(markerlist) });
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
        }
        catch (error) {
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

    async  closeEmployeeModal(item) {
        this.refs.employeeModal.close();
        await this.setState({ selctedEmployeeValue: item.UserName })
        await this.setState({ slectedEmployeeId: item.UserId })
        this.getEmpTrackInfo();
    }
    searchFilterFunction = text => {
        this.setState({
            value: text,
        });

        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.UserName.toUpperCase()} ${item.DepartmentName.toUpperCase()} ${item.Designation.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            employeeList: newData,
        });
    };
    renderSearchHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
                style={{ position: 'absolute', zIndex: 1, marginBottom: 0 }}
                lightTheme
                containerStyle={{ backgroundColor: '#f6f7f9', }}
                inputContainerStyle={{ backgroundColor: 'white', }}
                round
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false}
                value={this.state.value}
            />

        );
    };

	onReady = (result) => {
		this.mapView.fitToCoordinates(result.coordinates, {
			edgePadding: {
				right: (width / 20),
				bottom: (height / 20),
				left: (width / 20),
				top: (height / 20),
			}
		});
	}
    onStart = (result) => {
            console.log('onstart',result);
	}
	onError = (errorMessage) => {
        console.log(errorMessage);
	}
    renderMapView() {
        console.log('coor',this.state.markers)
        return (
            <View style={{
                flexDirection: 'column'
            }}>
                <View style={{ margin: 10 }}>
                    <MapView

                        provider={PROVIDER_GOOGLE}
                        style={{
                            height: (height * 80) / 100,
                        }}
                        ref={c => this.mapView = c}
                        loadingEnabled={true}
                        showsUserLocation={false}
                        followUserLocation={false}
                        zoomEnabled={true}
                        region={{
                            latitude: this.state.Latitude,
                            longitude: this.state.Longitude,
                            latitudeDelta:  0.0922,//0.001200,
                            longitudeDelta: 0.0922* (width / height)//0.001200 * .60
                        }}

                    >
                        {this.state.markers.map((marker, index)=> (
                            <MapView.Marker
                                key={index}
                                tracksViewChanges={true}
                                tracksInfoWindowChanges={true}
                                pinColor={marker.color}
                                coordinate={marker.coordinates}
                                title={marker.title}
                                description={marker.description}
                            />
                        ))}
                       {this.state.selctedEmployeeValue!="All Employee" && this.state.markers.length>1? 
                       <MapViewDirections
                       origin={this.state.markers[0].coordinates}
                       destination={this.state.markers[this.state.markers.length-1].coordinates}
                            apikey={googlemapApiForAutoCheckPoint}
                            strokeWidth={4}
                            strokeColor="#43B6D5"
                            optimizeWaypoints={true}
                            onReady={this.onReady}
                            onError={this.onError}
                            onStart={this.onStart}
                        />:null
                        }
                    </MapView>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={LiveTrackingStyle.container}>
                <StatusBarPlaceHolder />
                <View
                    style={CommonStyles.HeaderContent}>
                    <View
                        style={CommonStyles.HeaderFirstView}>
                        <TouchableOpacity
                            style={CommonStyles.HeaderMenuicon}
                            onPress={() => { Actions.drawerOpen(); }}>
                            <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                                source={require('../../../assets/images/menu_b.png')}>
                            </Image>
                        </TouchableOpacity>
                        <View
                            style={[DrawerContentStyle.logoImage, {
                                flexDirection:'row', justifyContent:"center", alignItems:"center"
                            }]}>
                            <TouchableOpacity
                                style={{   flexDirection:'row', justifyContent:"center", alignItems:"center"}}
                                onPress={() => this.refs.employeeModal.open()}>
                                <Text
                                    style={DrawerContentStyle.employeeModalTextStyle}>
                                    {this.state.selctedEmployeeValue}

                                </Text>
                                <Iconic
                                    name="chevrons-down" size={14} color="#d6d6d6"
                                    style={DrawerContentStyle.employeeModalIconStyle}>
                                </Iconic>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <StatusBar hidden={false} backgroundColor="rgba(0, 0, 0, 0.2)" />
                {this.renderMapView()}
                <Modal style={{
                    height: "85%",
                    width: "100%",
                    borderRadius: 10,
                    backgroundColor: '#EBEBEB',
                    marginTop: "10%"
                }}
                    position={"center"} ref={"employeeModal"} isDisabled={this.state.isDisabled}
                    backdropPressToClose={false}
                    swipeToClose={false}
                >
                    <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <View style={{ alignItems: "flex-start" }}>
                            <Text style={{ padding: 10 }}>Employee Select</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={() => this.refs.employeeModal.close()} style={{
                                marginLeft: 0, marginTop: 0,
                            }}>
                                <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                                    source={require('../../../assets/images/close.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ paddingVertical: 20, }}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ height: "100%" }}>
                            <View style={{ flex: 1, padding: 10, }}>
                                <FlatList
                                    data={this.state.employeeList}
                                    keyExtractor={(x, i) => i.toString()}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() => this.closeEmployeeModal(item)}>
                                            <View
                                                style={LiveTrackingStyle.FlatlistMainView}>
                                                <View style={{ paddingRight: 10, }}>
                                                    {item.ImageFileName !== "" ?
                                                        (<Image style={LiveTrackingStyle.imageradious} resizeMode="contain" source={{ uri: urlResource + item.ImageFileName }} />) :
                                                        (<Image style={
                                                            LiveTrackingStyle.imageradious
                                                        } resizeMode='contain' source={require('../../../assets/images/employee.png')} />)}

                                                </View>
                                                <View>
                                                    <Text style={LiveTrackingStyle.EmpText}>
                                                        {item.UserName}
                                                    </Text>
                                                    <Text style={LiveTrackingStyle.EmpText}>
                                                        {item.Designation}
                                                    </Text>
                                                    <Text style={LiveTrackingStyle.EmpText}>
                                                        {item.DepartmentName}
                                                    </Text>
                                                </View>

                                            </View>
                                        </TouchableOpacity>
                                    }
                                    ListHeaderComponent={this.renderSearchHeader()}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
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
