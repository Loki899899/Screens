import React from  'react';
import HomePage from "./Homepage"

export const ProfileScreen = ({navigation})=> <HomePage navigation ={navigation} name = "Assessment Categories" />
export const MessageScreen = ({navigation})=> <HomePage navigation ={navigation} name = "AddPost" />

export const ActivityScreen = ({navigation})=> <HomePage navigation ={navigation} name = "Assessment Test Paper" />
export const ListScreen = ({navigation})=> <HomePage navigation ={navigation} name = "Account Settings" />
export const ReportScreen = ({navigation})=> <HomePage navigation ={navigation} name = "Registered Users" />
export const ResultScreen = ({navigation})=> <HomePage navigation ={navigation} name = "Assessment Test Status and Result" />
export const SignOut = ({navigation})=> <HomePage navigation ={navigation} name = "Signout" />
