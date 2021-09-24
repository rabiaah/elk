
import React from 'react';
import
{
    Platform, StatusBar, RefreshControl, TouchableOpacity,
    View, Text, FlatList, Image, ScrollView, ActivityIndicator,
    BackHandler, AsyncStorage
} from 'react-native';
import { ActionConst, Actions } from 'react-native-router-flux';
import * as actions from '../../../../common/actions';

import { NoticeStyle } from './NoticeStyle';
import { getNotice } from '../../../../services/UserService/Notice';
import { SearchBar } from 'react-native-elements';
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
export default class Notice extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            noticeList: [],
            companyId: 0
        }
        this.arrayholder = [];
    }

    handleBackButton = () =>
    {
        BackHandler.exitApp()       
        return true;
    }
    goBack()
    {
        Actions.DailyAttendance();
    }

    goToDetail(item)
    {
        actions.push("NoticeDetailUser", { aItem: item });

    };
    _onRefresh = async () =>
    {
        this.setState({ refreshing: true });
        setTimeout(function ()
        {
            this.setState({
                refreshing: false,
            });

        }.bind(this), 2000);

        this.getNoticeList(this.state.companyId, false);
    };
    async componentDidMount()
    {
        const cId = await AsyncStorage.getItem("companyId");
        this.setState({ companyId: cId });
        this.getNoticeList(cId, true);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount()
    {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    getNoticeList = async (companyId, isProgress) =>
    {
        try
        {
            this.setState({ progressVisible: isProgress });
            await getNotice(companyId)
                .then(res =>
                {
                    this.setState({ noticeList: res.result, progressVisible: false });
                    this.arrayholder = res.result;
                    console.log(res.result, '.....noticeresult');
                })
                .catch(() =>
                {
                    this.setState({ progressVisible: false });
                    console.log("error occured");
                });

        } catch (error)
        {
            this.setState({ progressVisible: false });
            console.log(error);
        }
    }
    searchFilterFunction = text =>
    {
        this.setState({
            value: text,
        });

        const newData = this.arrayholder.filter(item =>
        {
            const itemData = `${item.PostingDate.toUpperCase()} ${item.Details.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            noticeList: newData,
        });
    };
    renderHeader = () =>
    {
        return (
            <SearchBar
                placeholder="Type Here..."
                style={{ position: 'absolute', zIndex: 1 }}
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
    render()
    {
        return (
            <View style={NoticeStyle.container}>
                <StatusBarPlaceHolder />
                <View
                    style={NoticeStyle.HeaderContent}>
                    <View
                        style={NoticeStyle.HeaderFirstView}>
                        <TouchableOpacity
                            style={NoticeStyle.HeaderMenuicon}
                            onPress={() => { Actions.drawerOpen(); }}>
                            <Image resizeMode="contain" style={NoticeStyle.HeaderMenuiconstyle}
                                source={require('../../../../assets/images/menu_b.png')}>
                            </Image>
                        </TouchableOpacity>
                        <View
                            style={NoticeStyle.HeaderTextView}>
                            <Text
                                style={NoticeStyle.HeaderTextstyle}>
                                NOTICE BOARD
                            </Text>
                        </View>
                    </View>
                </View>

                {this.state.progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={NoticeStyle.loaderIndicator} />) : null}
                <ScrollView>
                    <View style={{ flex: 1, margin: 10, }}>

                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                            data={this.state.noticeList}
                            keyExtractor={(x, i) => i.toString()}
                            ListHeaderComponent={this.renderHeader()}
                            renderItem={({ item }) =>
                                <TouchableOpacity
                                    onPress={() => this.goToDetail(item)}
                                >
                                    <View
                                        style={NoticeStyle.listContainer}>
                                        {item.ImageFileName === "" ?
                                            <View style={NoticeStyle.listDivider}>
                                                <View style={NoticeStyle.noticepart}>
                                                    <Text style={{  fontFamily: 'OPENSANS_REGULAR'}}>{item.Details}</Text>
                                                </View>

                                            </View> : <View style={{
                                                justifyContent: 'space-between', flexDirection: 'row',
                                                borderBottomColor: '#edeeef', borderBottomWidth: 1, paddingBottom: 10,
                                            }}>
                                                <View style={{
                                                    alignItems: 'flex-start', width: '80%',
                                                    color: '#1a1a1a', fontSize: 10, fontFamily: 'OPENSANS_REGULAR'
                                                }}>
                                                    <Text style={{}}>{item.Details}</Text>
                                                </View>
                                                <View style={{ alignItems: 'flex-end', width: '20%', }}>
                                                    <View style={{
                                                        borderRadius: 5,
                                                    }}>

                                                        {item.ImageFileName !== "" ?
                                                            <Image resizeMode="cover"
                                                                style={NoticeStyle.noticelistImage} source={{ uri: "http://medilifesolutions.blob.core.windows.net/resourcetracker/" + item.ImageFileName }} /> : <Text></Text>}
                                                    </View>
                                                </View>
                                            </View>}
                                        <View style={NoticeStyle.dateContainer}>
                                            <View style={{ alignItems: 'flex-start', }}>
                                                <Text
                                                    style={NoticeStyle.postedtextStyle}>
                                                    Posted Date
                                        </Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end', }}>
                                                <Text style={NoticeStyle.createDateStyle}>

                                                    {item.CreateDate.substr(0, 10)}
                                                </Text>
                                            </View>
                                        </View>

                                    </View>

                                </TouchableOpacity>
                            }
                        >
                        </FlatList>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
