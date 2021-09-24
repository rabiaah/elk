import React, { Component } from 'react';
import {
    loadFromStorage,
    storage,
    CurrentUserProfile
} from "../../common/storage";
import DrawerContentAdmin  from './DrawerContentAdmin';
import UserDrawerContent  from './UserDrawerContent';
export default class DrawerContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: 'admin'
        }
    }

    async  componentDidMount() {
        var userDetails = await loadFromStorage(storage, CurrentUserProfile);
        this.setState({ userType: userDetails.item.UserType })
        global.userType=userDetails.item.UserType;
        console.log(global.userType);
    };

    render() {
        if(this.state.userType=='admin'){
            return (<DrawerContentAdmin/>);
        }
        else{
            return (<UserDrawerContent/>)
        }
     };
}
