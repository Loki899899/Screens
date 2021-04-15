import Toast from 'react-native-simple-toast';
export default class CheckPermission{
    static async Check(val){
        let permission = await AsyncStorage.getItem("permission")
        // console.log(permission(item=>"1"==item), "-------permission-----")
        permission = JSON.parse(permission)
        // console.log(typeof(permission))
        // console.log(permission.indexOf("1"))

        if (permission.indexOf(val) == -1) {
            Toast.showWithGravity("You don't have permission to perform this action! Please Contact Main User.", Toast.SHORT, Toast.BOTTOM);
            
            return 0
        }
        else{
            return 1
        }
    }
}