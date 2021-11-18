import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert} from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";
export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setTodo] = useState({});
  const onChangeText = (payload) => setText(payload);
  useEffect(() => {
    loadToDos();
  }, []);
  const work = () => setWorking(false);
  const travel = () => setWorking(true);


  const saveToDos = async(toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  };

  const loadToDos = async() => {
    try{
      const s = await AsyncStorage.getItem(STORAGE_KEY); 
      if(toDos !== null){
        setTodo(JSON.parse(s));
      }
    } catch(e) {
      console.log('no data!' ,e);
    }
  };


  const addTodo = async() => {
    if(text === ""){
      return;
    }
    // save to do
    const newToDos = {
      ...toDos,
      [Date.now()]: {text, working},
  }
    setTodo(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const deleteTodo = (key) => {
    Alert.alert(
      "Delete To Do", 
      "Are Your sure?", [
      {text:"Cancel"},

      {
        text: "I'm Sure", 
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setTodo(newToDos);
          saveToDos(newToDos);
      },
    },
    ]);
  };


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>

        <TouchableOpacity onPress={travel}>
          <Text 
            style={{ ...styles.btnText, color: working ? "#fff" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={work}>
        <Text style={{ ...styles.btnText, color: !working ? "#fff" : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TextInput 
        onSubmitEditing={addTodo}
        onChangeText = {onChangeText}
        returnKeyType ="done"
        keyboardType="email-address"
        style={styles.input} 
        placeholder={working ? "Add a To do" : "Where do you want to go?"}>
        </TextInput>
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
          <View style = {styles.toDo} key={key}>
          <Text style={styles.toDoText}>{toDos[key].text}</Text>
          <TouchableOpacity onPress= {() => deleteTodo(key)}>
          <Fontisto name="trash" size = {18} color="white" />
          </TouchableOpacity>
          </View>
          ) : null 
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText:{
    fontSize: 38,
    fontWeight: '600',
  },
  input:{
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  }, 
  toDo:{
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toDoText:{
    color: 'white',
    fontSize: 16,
    fontWeight: "500",
  },
});
