import  React , {useState} from 'react';
import { Text, View, StyleSheet, SafeAreaView, TextInput, ImageBackground, Image } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from 'react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LinearGradient from 'react-native-linear-gradient';

const Tab = createMaterialTopTabNavigator();

const Header = (props) => {
  return (
    <Text style={{}}>props.text</Text>
  );
}

const Choice = (props) => {
  if(props.selected) {
    return (
    <LinearGradient>
      <Text>props.text</Text>
    </LinearGradient>
  );
  } else {
    <Text>props.text</Text>
  }
}

const JobType = (props) => {
  const [isFullTimeSelected, setIsFullTimeSelected] = useState(true)
  const [isFresherSelected, setIsFresherSelected] = useState(false)
  const [isPartTimeSelected, setIsPartTimeSelected] = useState(false)

  return (
    <View>
      <Header text='JOB TYPE' />
      <Choice text='Full Time' selected={isFullTimeSelected} />
      <Choice text='Fresher' selected={isFresherSelected} />
      <Choice text='Part Time' selected={isPartTimeSelected} />
    </View>
  );
}

const Salary = (props) => {
  return (
    <Header text='SALARY' />
    // range slider here
  );
}

const Location = (props) => {
  return (
    <View>
      <Header text='LOCATION' />
      <TextInput></TextInput>
    </View>
  );
}

const Experience = (props) => {
  return (
    <View>
      <Header text='EXPERIENCE' />
      // range slider here
    </View>
  );
}

const Freshness = (props) => {
  return (
    <View>
      <Header text='FRESHNESS' />  
      <Choice text='1 day old' />
      <Choice text='< 3 days old' />
      <Choice text='< 7 days old' />
    </View>
  );
}

const Industry = (props) => {
  
  return (
    <View>
      <Header text='INDUSTRY' />
      <Choice text='IT software, software services' selected={} />
      <Choice text='BPO, Call centre, ITes' selected={} />
      <Choice text='Banking, financial' selected={} />
      <Choice text='Construction, Engineering, metals' selected={} />
    </View>
  )
}

const FunctionalArea = (props) => {
  return (
    <View>
      <Header text='FUNCTIONAL AREA' />
      <Choice text='IT software, software services' selected={} />
      <Choice text='BPO, Call centre, ITes' selected={} />
      <Choice text='Banking, financial' selected={} />
      <Choice text='Construction, Engineering, metals' selected={} />
    </View>
  )
}

const Actions = (props) => {
  <Button></Button>
  <Button></Button>
}

const JobListing = () => {
  return (
    <SafeAreaView>
      <ImageBackground source={require('')} style={{paddingTop:1}}>
        <View>
          <Text>Filter</Text>
          <Image source={require('')} style={{width:20, height:20}}>
          </Image>
          <JobType />
          <Salary />
          <Location />
          <Experience />
          <Freshness />
          <Industry />
          <FunctionalArea />
          <Actions />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Screen
        name='JobListing'
        component={JobListing}
        options={{
          title:'Job Listing'
        }}
      ></Tab.Screen>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});
