import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, MessageSquare, FileText, User as UserIcon, Users, BookOpen } from 'lucide-react-native';
import { COLORS, STAFF_THEME } from '../utils/theme';

import LoadingScreen from '../components/LoadingScreen';
import AuthScreen from '../screens/AuthScreen';
import { HomeTab, StudyTab, TestTab, AIChatTab, ProfileTab, StudentUploadNotesScreen, StudentWatchVideosScreen } from '../screens/StudentScreens';
import { StaffHomeScreen, UploadMaterialScreen, StudentsScreen, CreateTestScreen, MaterialsScreen, PerformanceScreen, StaffProfileScreen, StaffPrimaryButton } from '../screens/StaffScreens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const STUDENT_TASKS_INITIAL = [];

const STAFF_INITIAL_DATA = {
  profile: { name: '', subject: '', role: '' },
  students: [],
  materials: [],
  tests: []
};

//-----------------------------------
// STUDENT NAVIGATION
//-----------------------------------
function StudentTabs({ handleLogout, navigation, currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });
  const [inputValue, setInputValue] = useState('');

  React.useEffect(() => {
    AsyncStorage.getItem(`tasks_${currentUser.id}`).then(res => {
      if (res) setTasks(JSON.parse(res));
    });
  }, []);

  const save = async (newTasks) => {
    setTasks(newTasks);
    await AsyncStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(newTasks));
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  const openModal = (type, data = null) => {
    setInputValue(data ? data.title : '');
    setModalConfig({ isOpen: true, type, data });
  };
  const closeModal = () => setModalConfig({ isOpen: false, type: '', data: null });

  const saveTask = () => {
    if (!inputValue.trim()) return;
    if (modalConfig.type === 'add_task') {
      save([...tasks, { id: Date.now(), title: inputValue, completed: false }]);
    } else if (modalConfig.type === 'edit_task') {
      save(tasks.map(t => t.id === modalConfig.data.id ? { ...t, title: inputValue } : t));
    }
    closeModal();
  };
  const deleteTask = (id) => save(tasks.filter(t => t.id !== id));
  const toggleTask = (id) => save(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: { height: 70, borderTopLeftRadius: 32, borderTopRightRadius: 32, position: 'absolute', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, borderTopWidth: 0, paddingBottom: 10, paddingTop: 10 },
          tabBarActiveTintColor: COLORS.blue500,
          tabBarInactiveTintColor: COLORS.gray400,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 2 },
        }}
      >
        <Tab.Screen 
          name="Home" 
          options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }}
        >
          {() => <HomeTab tasks={tasks} progressPercent={progressPercent} completedTasks={completedTasks} toggleTask={toggleTask} openModal={openModal} deleteTask={deleteTask} navigateToScreen={(s) => navigation.navigate(s)} navigateToTab={(t) => navigation.navigate(t)} currentUser={currentUser} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Study" 
          options={{ tabBarIcon: ({ color }) => <Calendar color={color} size={24} /> }}
        >
          {() => <StudyTab tasks={tasks} openModal={openModal} toggleTask={toggleTask} deleteTask={deleteTask} />}
        </Tab.Screen>
        <Tab.Screen 
          name="AIChatPage" 
          options={{ tabBarLabel: 'AI Chat', tabBarIcon: ({ color }) => <MessageSquare color={color} size={24} /> }}
        >
          {() => <AIChatTab currentUser={currentUser} />}
        </Tab.Screen>
        <Tab.Screen 
          name="TestPage" 
          options={{ tabBarLabel: 'Test Page', tabBarIcon: ({ color }) => <FileText color={color} size={24} /> }}
        >
          {() => <TestTab />}
        </Tab.Screen>
        <Tab.Screen 
          name="Profile" 
          options={{ tabBarIcon: ({ color }) => <UserIcon color={color} size={24} /> }}
        >
          {() => <ProfileTab onLogout={handleLogout} currentUser={currentUser} />}
        </Tab.Screen>
      </Tab.Navigator>

      <Modal visible={modalConfig.isOpen} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput style={styles.modalInput} value={inputValue} onChangeText={setInputValue} placeholder="e.g. Read Chapter 5" autoFocus />
            <TouchableOpacity style={styles.modalBtn} onPress={saveTask}>
              <Text style={styles.modalBtnText}>{modalConfig.type === 'edit_task' ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

function StudentApp({ handleLogout, currentUser }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentTabs">
        {(props) => <StudentTabs {...props} handleLogout={handleLogout} currentUser={currentUser} />}
      </Stack.Screen>
      <Stack.Screen name="UploadNotes">
        {(props) => <StudentUploadNotesScreen {...props} currentUser={currentUser} />}
      </Stack.Screen>
      <Stack.Screen name="WatchVideos" component={StudentWatchVideosScreen} />
    </Stack.Navigator>
  );
}

//-----------------------------------
// STAFF NAVIGATION
//-----------------------------------
function StaffTabs({ handleLogout, navigation, data, commands }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: { height: 70, borderTopLeftRadius: 24, borderTopRightRadius: 24, position: 'absolute', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, borderTopWidth: 0, paddingBottom: 10, paddingTop: 10 },
        tabBarActiveTintColor: STAFF_THEME.colors.primary,
        tabBarInactiveTintColor: STAFF_THEME.colors.text.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 2 },
      }}
    >
      <Tab.Screen name="StaffHome" options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <Home color={color} size={24} /> }}>
        {() => <StaffHomeScreen profile={data.profile} students={data.students} materials={data.materials} tests={data.tests} navigate={(s) => navigation.navigate(s)} />}
      </Tab.Screen>
      <Tab.Screen name="StudentsTab" options={{ tabBarLabel: 'Students', tabBarIcon: ({ color }) => <Users color={color} size={24} /> }}>
        {() => <StudentsScreen students={data.students} deleteStudent={commands.deleteStudent} />}
      </Tab.Screen>
      <Tab.Screen name="MaterialsTab" options={{ tabBarLabel: 'Materials', tabBarIcon: ({ color }) => <BookOpen color={color} size={24} /> }}>
        {() => <MaterialsScreen materials={data.materials} deleteMaterial={commands.deleteMaterial} navigate={(s) => navigation.navigate(s)} />}
      </Tab.Screen>
      <Tab.Screen name="StaffProfile" options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => <UserIcon color={color} size={24} /> }}>
        {() => <StaffProfileScreen profile={data.profile} onLogout={handleLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';

function StaffApp({ handleLogout, currentUser }) {
  const [data, setData] = useState({
    profile: { name: currentUser.fullName, subject: currentUser.department || 'General', role: 'Staff Educator' },
    students: [], materials: [], tests: []
  });

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(`staff_data_${currentUser.id}`);
        if (stored) setData(JSON.parse(stored));
        const allUsers = JSON.parse(await AsyncStorage.getItem('app_users') || '[]');
        const stds = allUsers.filter(u => u.role === 'Student').map(s => ({
          id: s.id, name: s.fullName, score: Math.floor(Math.random() * 40) + 60, avatar: s.fullName.charAt(0).toUpperCase()
        }));
        setData(p => ({ ...p, students: stds }));
      } catch(e) {}
    };
    loadData();
  }, []);

  const save = async (newData) => {
    setData(newData);
    await AsyncStorage.setItem(`staff_data_${currentUser.id}`, JSON.stringify(newData));
  };

  const commands = {
    addStudent: (student) => save({ ...data, students: [...data.students, { ...student, id: Date.now().toString() }] }),
    deleteStudent: (id) => save({ ...data, students: data.students.filter(s => s.id !== id) }),
    addMaterial: (material) => save({ ...data, materials: [{ ...material, id: Date.now().toString(), date: 'Just now' }, ...data.materials] }),
    deleteMaterial: (id) => save({ ...data, materials: data.materials.filter(m => m.id !== id) }),
    addTest: (test) => save({ ...data, tests: [{ ...test, id: Date.now().toString(), status: 'Upcoming' }, ...data.tests] }),
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StaffTabs">
        {(props) => <StaffTabs {...props} handleLogout={handleLogout} data={data} commands={commands} />}
      </Stack.Screen>
      <Stack.Screen name="UploadMaterial">
        {(props) => <UploadMaterialScreen addMaterial={commands.addMaterial} goBack={props.navigation.goBack} />}
      </Stack.Screen>
      <Stack.Screen name="CreateTest">
        {(props) => <CreateTestScreen addTest={commands.addTest} goBack={props.navigation.goBack} />}
      </Stack.Screen>
      <Stack.Screen name="Performance">
        {(props) => <PerformanceScreen students={data.students} goBack={props.navigation.goBack} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

//-----------------------------------
// MAIN APP ROUTER
//-----------------------------------
export default function AppNavigator() {
  const [appState, setAppState] = useState('auth'); 
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = async (role, formData, mode) => {
    setAppState('loading');
    try {
      const usersStr = await AsyncStorage.getItem('app_users');
      let globalUsers = usersStr ? JSON.parse(usersStr) : [];
      let finalUser = null;

      if (mode === 'signup') {
        finalUser = { id: Date.now().toString(), role, ...formData };
        globalUsers.push(finalUser);
        await AsyncStorage.setItem('app_users', JSON.stringify(globalUsers));
      } else {
        finalUser = globalUsers.find(u => 
          u.role === role && u.password === formData.password &&
          ((role === 'Student' && u.registerNumber === formData.registerNumber) || 
           (role === 'Staff' && u.email === formData.email))
        );
        if (!finalUser) {
          alert("Invalid credentials. Please check and try again.");
          setAppState('auth');
          return;
        }
      }

      setCurrentUser(finalUser);
      setTimeout(() => {
        setAppState(role === 'Student' ? 'student' : 'staff');
      }, 1000);
    } catch(e) {
      setAppState('auth');
    }
  };

  const handleLogout = () => {
    setAppState('loading');
    setTimeout(() => {
      setCurrentUser(null);
      setAppState('auth');
    }, 800);
  };

  return (
    <NavigationContainer>
      {appState === 'loading' ? (
        <LoadingScreen />
      ) : appState === 'auth' ? (
        <AuthScreen onLogin={handleLogin} />
      ) : appState === 'student' ? (
        <StudentApp handleLogout={handleLogout} currentUser={currentUser} />
      ) : (
        <StaffApp handleLogout={handleLogout} currentUser={currentUser} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#FFF', padding: 24, borderRadius: 24 },
  modalInput: { borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 24 },
  modalBtn: { backgroundColor: COLORS.blue500, padding: 16, borderRadius: 12, alignItems: 'center' },
  modalBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
