import React, { Component } from 'react';
import {
    ScrollView, Text, View, StatusBar, ActivityIndicator, Image,
    BackHandler, TextInput, TouchableOpacity,
    ToastAndroid, Platform, KeyboardAvoidingView, FlatList
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TasksCombo,
} from '../../MenuDrawer/DrawerContent';
import { Actions } from 'react-native-router-flux';
import { EmployeeList } from '../../../services/EmployeeTrackService';
import Modal from 'react-native-modalbox';
import moment from "moment";
import { CommonStyles } from '../../../common/CommonStyles';
import DateTimePicker from 'react-native-modal-datetime-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Modal as Modal1 } from 'react-native';
import { urlDev, urlResource } from '../../../services/api/config';
import ImageViewer from 'react-native-image-zoom-viewer';
import _ from "lodash";
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { TaskStyle } from '../tasks/TaskStyle';
import * as actions from '../../../common/actions';
import { SaveTask, PriorityList } from '../../../services/TaskService';


const refreshOnBack = () => {

}
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
const numColumns = 2;
export default class CreateTaskForBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connection_Status: true,
            userId: "",
            companyId: "",
            date: '',
            taskTitle: "",
            taskDescription: "",
            EmployeeList: [],
            priorityList: [],
            isDateTimePickerVisible: false,
            PriorityId: null,
            PriorityName: null,
            EmpName: null,
            EmpValue: null,
            TaskGroupId: 0,
            BordDetail: {},
            fileList: [],
            TaskId: null,
            isModelVisible: false,
        }
    }

    goBackToTasks() {
        TasksCombo();
    }
    goBack() {
        Actions.pop();
    }
    returnPage() {
        actions.push("TaskListScreen");
    }

    openmodalForImage() {
        this.refs.modalForImage.open();
    }
    _takePhoto = async () => {
        this.refs.modalForImage.close()
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            // aspect: [4, 4],
            //quality: .2,
            height: 250,
            width: 250,
        });
        console.log(pickerResult, '.......................')
        if (pickerResult.cancelled == false) {
            this.handleUploadPhoto(pickerResult)
        }
    };


    _pickImage = async () => {
        this.refs.modalForImage.close()
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            //aspect: [4, 4],
            quality: 1,
            height: 250,
            width: 250,
        });
        if (pickerResult.cancelled == false) {
            this.handleUploadPhoto(pickerResult)
        }
    };

    handleUploadPhoto = async (pickerResult) => {

        const userToken = await AsyncStorage.getItem("userToken");
        console.log(pickerResult.uri, '...............send')
        var data = new FormData();
        data.append('BlobName', {
            uri: pickerResult.uri,
            name: 'my_photo.jpg',
            type: 'image/jpg'
        })
        this.setState({ progressVisible: true });
        fetch(urlDev + "RtTaskApi/UploadDocuments?containerName=" + this.state.Imageparam, {
            headers: {
                'Authorization': `bearer ${userToken}`,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(response => {
                let attachmentModel = {
                    TaskId: this.state.TaskId,
                    FileName: response.ImagePath,
                    BlobName: response.ImagePath,
                }
                console.log("upload succes", response);
                this.setState({ fileList: this.state.fileList.concat(attachmentModel) })

                this.setState({ ImageFileName: response.ImagePath });
                this.setState({ progressVisible: false });
                ToastAndroid.show('Uploaded successfully', ToastAndroid.TOP);
                this.setState({ photo: null });
            })
            .catch(error => {
                this.setState({ progressVisible: false });
                console.log("upload error", error);
                ToastAndroid.show('Upload Fail', ToastAndroid.TOP);
                // this.errorToast();
            });
    };
    errorToast = () => {
        Toast.show('Something went wrong', {
            containerStyle: {
                backgroundColor: '#CB2431',
                paddingHorizontal: 15,
                borderRadius: 20
            },
            textColor: '#ffffff',
            duration: 1000
        })
    }
    ImageViewer() {
        this.setState({ isModelVisible: true })
    }

    ShowModalFunction(visible) {
        this.setState({ isModelVisible: false });
    }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({ date: date })

        this._hideDateTimePicker();
    }

    async componentDidMount() {
        const uId = await AsyncStorage.getItem("userId");
        const cId = await AsyncStorage.getItem("companyId");
        this.setState({ userId: uId, companyId: cId });
        this.getEmployeeList(cId);
        this.getPriorityList();
        this.setState({ BordDetail: this.props.BordDetail })
        this.setState({ TaskGroupId: this.props.BordDetail.Id })

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    gotoBordDetail(item) {
        actions.push("TaskBordDetail", { BordDetail: item });
    }
    async saveTask() {
        if (!await NetInfo.isConnected.fetch()) return ToastAndroid.show('Please connect to Internet', ToastAndroid.TOP);
        if (this.state.taskTitle === "") return ToastAndroid.show('Title Can not be Empty ', ToastAndroid.TOP);
        try {
            let taskModel = {
                CreatedById: this.state.userId,
                CompanyId: this.state.companyId,
                Title: this.state.taskTitle,
                Description: this.state.taskDescription,
                AssignToName: this.state.EmpName,
                AssignedToId: this.state.EmpValue,
                TaskGroupId: this.state.TaskGroupId,
                PriorityId: this.state.PriorityId,
                DueDate: this.state.date==''?null: moment(this.state.date).format("YYYYY-MM-DD")
            };
            this.setState({ progressVisible: true });
            const userToken = await AsyncStorage.getItem("userToken");
            var data = new FormData();
            data.append('taskmodel', JSON.stringify(taskModel))
            data.append('taskAttachmentsModel', JSON.stringify(this.state.fileList))
            fetch(urlDev + "RtTaskApi/SaveTask/", {
                headers: {
                    'Authorization': `bearer ${userToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                method: "POST",
                body: data
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({ progressVisible: false });
                    ToastAndroid.show('Task saved successfully', ToastAndroid.TOP);
                    this.gotoBordDetail(this.props.BordDetail);
                })
                .catch(error => {
                    this.setState({ progressVisible: false });
                    console.log("error occured");
                    this.setState({ touchabledisableForsaveExpense: true })
                });
        } catch (error) {
            this.setState({ progressVisible: false });
            console.log(error);
        }
    }

    getEmployeeList = async (companyId) => {
        try {
            await EmployeeList(companyId)
                .then(res => {
                    this.setState({ EmployeeList: res.result, progressVisible: false });
                })
                .catch(() => {
                    this.setState({ progressVisible: false });
                });

        } catch (error) {
            this.setState({ progressVisible: false });
        }
    }

    getPriorityList = async () => {
        try {
            await PriorityList()
                .then(res => {
                    this.setState({ priorityList: res.result, progressVisible: false });
                })
                .catch(() => {
                    this.setState({ progressVisible: false });
                });

        } catch (error) {
            this.setState({ progressVisible: false });
        }
    }

    async  setAssignTo(v, t) {
        this.setState({ EmpName: t })
        this.setState({ EmpValue: v })
        this.refs.modal1.close()
    }

    renderEmpList() {
        let content = this.state.EmployeeList.map((empName, i) => {
            return (
                <TouchableOpacity style={{ paddingVertical: 7, borderBottomColor: '#D5D5D5', borderBottomWidth: 2 }} key={i}
                    onPress={() => { this.setAssignTo(empName.Value, empName.Text) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]} key={empName.Value}>{empName.Text}</Text>
                </TouchableOpacity>
            )
        });
        return content;
    }

    async  setPriority(id, name) {
        this.setState({ PriorityId: id })
        this.setState({ PriorityName: name })
        this.refs.modalPriority.close()
    }

    renderPriorityList() {
        let content = this.state.priorityList.map((x, i) => {
            return (
                <TouchableOpacity style={{ paddingVertical: 7, borderBottomColor: '#D5D5D5', borderBottomWidth: 2 }} key={i}
                    onPress={() => { this.setPriority(x.Id, x.Name) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]} key={x.Id}>{x.Name}</Text>
                </TouchableOpacity>
            )
        });
        return content;
    }

    handleBackButton = () => {
        this.goBack();
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity
                style={{
                    //  backgroundColor: 'gray',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: "45%",
                    margin: 5,
                    alignItems: 'center',
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: 'gray',
                    marginLeft: 10,
                    // height: (Dimensions.get('window').width / numColumns) * .45,
                    height: 200,
                }}
                onPress={() => { this.gotoBordDetail(item) }}
            >
                <View>

                    <Image style={{ height: 150, width: 150, }} resizeMode='cover'
                        source={{ uri: urlResource + item.FileName }} >
                    </Image>

                </View>
            </TouchableOpacity>
        );
    };
    render() {
        return (
            <View
                style={{
                    flex: 1, backgroundColor: '#ffffff', flexDirection: 'column',
                }}>
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
                                Create Task
                            </Text>
                        </View>
                    </View>
                    <View
                        style={CommonStyles.createTaskButtonContainer}>
                        <TouchableOpacity
                            onPress={() => this.saveTask()}
                            style={CommonStyles.createTaskButtonTouch}>
                            <View style={CommonStyles.plusButton}>
                                <MaterialCommunityIcons name="content-save" size={Platform.OS==='ios'? 15.3 : 17.5} color="#ffffff" />
                            </View>
                            <View style={CommonStyles.ApplyTextButton}>
                                <Text style={CommonStyles.ApplyButtonText}>
                                    POST
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* <View style={{ flex: 1 }}> */}
                <View style={{ flex: 1, }}>
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardDismissMode="on-drag"
                        style={{ flex: 1, }}>
                        <View
                            style={TaskStyle.titleInputRow}>
                            <Text
                                style={TaskStyle.createTaskTitleLabel1}>
                                Title:
                                </Text>
                            <TextInput
                                style={TaskStyle.createTaskTitleTextBox1}
                                placeholder="write a task name here"
                                placeholderTextColor="#dee1e5"
                                autoCapitalize="none"
                                onChangeText={text => this.setState({ taskTitle: text })}
                            >
                            </TextInput>
                        </View>
                        <View
                            style={TaskStyle.descriptionInputRow}>
                            <Text
                                style={TaskStyle.createTaskTitleLabel11}>
                                Description:
                                    </Text>
                            <TextInput
                                style={TaskStyle.createTaskDescriptionTextBox}
                                multiline={true}
                                placeholder="write details here"
                                placeholderTextColor="#dee1e5"
                                autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={text => this.setState({ taskDescription: text })}
                            >
                            </TextInput>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View style={{ flex: 1, flexDirection: 'column', }}>
                                <TouchableOpacity onPress={() => this.refs.modal1.open()}>
                                    <View

                                        style={TaskStyle.assignePeopleContainer}>
                                        <Ionicons name="md-people" size={20} style={{ marginRight: 4, }} color="#4a535b" />
                                        <TextInput
                                            style={TaskStyle.assigneePeopleTextBox}
                                            placeholder="Assign People"
                                            placeholderTextColor="#dee1e5"
                                            editable={false}
                                            autoCapitalize="none"
                                            value={this.state.EmpName}
                                        >
                                        </TextInput>
                                    </View>
                                </TouchableOpacity>
                                <View style={TaskStyle.assigneePeopleTextBoxDivider}>
                                    {/* horizontal line dummy view */}
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column', }}>
                                <TouchableOpacity onPress={() => this.refs.modalPriority.open()}>
                                    <View
                                        style={TaskStyle.assignePeopleContainer}>
                                        <Ionicons name="ios-stats" size={18} style={{ marginHorizontal: 5, }}
                                            color="#4a535b" />
                                        <TextInput
                                            style={TaskStyle.assigneePeopleTextBox}
                                            placeholder="Priority"
                                            placeholderTextColor="#dee1e5"
                                            editable={false}
                                            autoCapitalize="none"
                                            value={this.state.PriorityName}
                                        >
                                        </TextInput>
                                    </View>
                                </TouchableOpacity>
                                <View style={TaskStyle.assigneePeopleTextBoxDivider}>
                                    {/* horizontal line dummy view */}
                                </View>
                            </View>
                        </View>
                        <View
                            style={TaskStyle.createTaskAttachmentContainer}>

                            <View style={TaskStyle.createTaskDueDateContainer}>
                                <TouchableOpacity onPress={this._showDateTimePicker}
                                    style={TaskStyle.createTaskDueDateIcon}>
                                    <MaterialCommunityIcons name="clock-outline" size={18} color="#4a535b"
                                        style={{ marginHorizontal: 5, }} />
                                    {this.state.date === "" ?
                                        <Text
                                            style={TaskStyle.createTaskDueDateText}>
                                            Due Date:
                                       </Text> :
                                        <Text
                                            style={TaskStyle.createTaskDueDateText}>
                                            {moment(this.state.date).format("DD MMMM YYYYY")}
                                        </Text>
                                    }

                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.isDateTimePickerVisible}
                                    onConfirm={this._handleDatePicked}
                                    onCancel={this._hideDateTimePicker}
                                    mode={'date'}
                                />
                                <View
                                    style={TaskStyle.Viewforavoid}>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                width: "95%",
                                borderRadius: 4, backgroundColor: "#ffffff",
                                alignItems: 'center', justifyContent: 'space-between',
                                // padding: 8,
                                paddingVertical: 7,
                                marginTop: 4, marginBottom: 4,
                                marginHorizontal: 10, flexDirection: 'row',
                                borderBottomColor: '#f6f7f9', borderBottomWidth: 1,
                                //  height: 30,
                            }}>
                            <View
                                style={{
                                    justifyContent: 'flex-start', flexDirection: 'row',
                                    marginLeft: 18, alignItems: 'center',
                                }}>
                                <Entypo name="attachment" size={14} color="black"
                                    style={{ marginRight: 10, }} />
                                <Text
                                    style={TaskStyle.viewTaskAttachmentLeftIcon}>
                                    Attachments
                                            </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => this.openmodalForImage()}
                                style={TaskStyle.viewTaskAttachmentPlusIcon}>
                                <Image
                                    style={{ width: 20, height: 20 }} resizeMode='contain'
                                    source={require('../../../assets/images/leftPlusBig.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                        {this.state.progressVisible == true ? (<ActivityIndicator size="large"
                            color="#1B7F67" style={TaskStyle.loaderIndicator} />) : null}
                        <View style={TaskStyle.scrollContainerView}>
                            <FlatList
                                data={this.state.fileList}
                                extraData={this.state}
                                keyExtractor={(i, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                style={TaskStyle.taskBoardContainer}
                                numColumns={numColumns}
                                renderItem={this.renderItem}

                            />
                        </View>
                        <View
                            style={TaskStyle.Viewforavoid}>
                        </View>
                    </ScrollView>
                </View>

                {/* <View style={{ justifyContent: 'flex-end', }}>
                        <View
                            style={{ height: 50, }}>
                        </View>
                        <TouchableOpacity onPress={() => this.saveTask()}
                            style={TaskStyle.createTaskSaveButtonContainer}>
                            <Feather name="edit" size={14}
                                style={{ marginHorizontal: 3, }}
                                color="#ffffff">
                            </Feather>
                            <Text style={TaskStyle.createTaskSaveButtonText}>
                                POST
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                {/* </View> */}
                <Modal style={[TaskStyle.modalforCreateCompany1]} position={"center"} ref={"modal1"} isDisabled={this.state.isDisabled}
                    backdropPressToClose={false}
                    swipeToClose={false}
                >
                    <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <View style={{ alignItems: "flex-start" }}>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={() => this.refs.modal1.close()} style={{
                                marginLeft: 0, marginTop: 0,
                            }}>
                                <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../assets/images/close.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={TaskStyle.dblModelContent}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ height: "80%" }}>
                            <View style={{}} >
                                {this.renderEmpList()}
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
                <Modal style={[TaskStyle.modalforCreateCompany1]} position={"center"} ref={"modalPriority"}
                    backdropPressToClose={false}
                    swipeToClose={false}
                >
                    <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <View style={{ alignItems: "flex-start" }}>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={() => this.refs.modalPriority.close()} style={{
                                marginLeft: 0, marginTop: 0,
                            }}>
                                <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../assets/images/close.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={TaskStyle.dblModelContent}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ height: "80%" }}>
                            <View style={{}} >
                                {this.renderPriorityList()}
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
                <Modal
                    style={{
                        height: 180,
                        width: 250,
                        borderRadius: 20,
                    }}
                    position={"center"}
                    ref={"modalForImage"}
                    isDisabled={this.state.isDisabled}
                    backdropPressToClose={true}
                    swipeToClose={false}
                >
                    <View
                        style={{
                            justifyContent: "space-between",
                            flexDirection: "row"
                        }}>
                        <View
                            style={{ alignItems: "flex-start" }}>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity
                                onPress={() => this.refs.modalForImage.close()}
                                style={{
                                    marginLeft: 0,
                                    marginTop: 0,
                                }}>
                                <Image
                                    resizeMode="contain"
                                    style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                                    source={require('../../../assets/images/close.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={{
                                color: '#000000',
                                fontSize: 24,
                                textAlign: 'center',
                                fontWeight: '500'
                            }}>Add Photos</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            padding: 15, justifyContent: 'space-between',
                            paddingTop: 20,
                        }}>
                            <TouchableOpacity onPress={() => this._takePhoto()} style={{ alignItems: "center", paddingLeft: 35 }}>
                                <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../../assets/images/photo_camera_black.png')}></Image>
                                <Text style={{ textAlign: 'center', marginTop: 4, color: '#7a7a7a', fontSize: 10 }}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this._pickImage()} style={{ alignItems: 'center', paddingRight: 35 }}>
                                <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../../assets/images/Gallary.png')}></Image>
                                <Text style={{ textAlign: 'center', marginTop: 4, color: '#7a7a7a', fontSize: 10 }}>From Gallary</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal1
                    visible={this.state.isModelVisible}
                    transparent={false}
                    onRequestClose={() => this.ShowModalFunction()}>
                    <View
                        style={{
                            width: "100%",
                            padding: 5,
                            backgroundColor: 'black',
                            justifyContent: 'space-between',

                        }}>
                        <View style={{ alignItems: "flex-start", }}>

                        </View>
                        <TouchableOpacity
                            style={{ alignItems: "flex-end", padding: 10 }}
                            onPress={() => this.ShowModalFunction()}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                                // onPress={() => this.ShowModalFunction()}
                                source={require('../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <ImageViewer
                        saveToLocalByLongPress={true}
                        // onSave={this.saveImageToFolder( this.state.images )}
                        imageUrls={this.state.images} >
                    </ImageViewer>
                </Modal1>

            </View >
        )
    }
}
