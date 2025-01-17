import { Drawer } from 'expo-router/drawer';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { signOut } from 'firebase/auth'; // Firebase signOut import
import { auth } from '@/firebase'; // Your Firebase auth config
import { Alert } from 'react-native';
import { router } from 'expo-router';


function CustomDrawerContent(props: DrawerContentComponentProps) {
  // Filter out the routes we don't want to show in the drawer  // Initialize the navigation hook
  const filteredProps = {
    ...props,
    state: {
      ...props.state,
      routeNames: props.state.routeNames.filter(
        (routeName) => !['projectile', 'shm-lab'].includes(routeName)
      ),
      routes: props.state.routes.filter(
        (route) => !['projectile', 'shm-lab'].includes(route.name)
      ),
    },
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      Alert.alert('Success', 'You have logged out successfully', [
        {
          text: 'OK',
          onPress: () => {
            router.push('/(auth)/login'); // Navigate to (auth)/login
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <DrawerContentScrollView 
      {...filteredProps}
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <LinearGradient
        colors={['#1a237e', '#0d47a1']}
        style={{
          padding: 20,
          paddingTop: 40,
          alignItems: 'center',
        }}
      >
        <View style={{
          width: 80,
          height: 80,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 40,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 15,
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.3)',
        }}>
          <FontAwesome name="flask" size={40} color="#fff" />
        </View>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: 5,
        }}>VirtuLab</Text>
        <Text style={{
          fontSize: 14,
          color: 'rgba(255, 255, 255, 0.8)',
        }}>Virtual Laboratory Platform</Text>
      </LinearGradient>

      <View style={{ 
        flex: 1, 
        backgroundColor: '#fff', 
        paddingTop: 10,
      }}>
        <DrawerItemList {...filteredProps} />
      </View>

      <Pressable 
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
          backgroundColor: pressed ? '#f0f0f0' : '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        })}
        onPress={handleLogout}
      >
        <FontAwesome name="sign-out" size={22} color="#FF5252" />
        <Text style={{ 
          marginLeft: 32,
          color: '#FF5252',
          fontSize: 16,
          fontWeight: '500',
        }}>Logout</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

export default function DashboardLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a237e',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#1a237e',
        drawerInactiveTintColor: '#666',
        drawerLabelStyle: {
          marginLeft: -15,
          fontSize: 15,
          fontWeight: '500',
        },
        drawerStyle: {
          backgroundColor: '#fff',
          width: 300,
        }
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Dashboard',
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color }) => (
            <View style={{
              backgroundColor: color === '#1a237e' ? '#E8EAF6' : 'transparent',
              padding: 8,
              borderRadius: 10,
              width: 38,
              height: 38,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FontAwesome name="home" size={20} color={color} />
            </View>
          )
        }}
      />
      <Drawer.Screen
        name="course"
        options={{
          title: 'Courses',
          drawerLabel: 'Courses',
          drawerIcon: ({ color }) => (
            <View style={{
              backgroundColor: color === '#1a237e' ? '#E8EAF6' : 'transparent',
              padding: 8,
              borderRadius: 10,
              width: 38,
              height: 38,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FontAwesome name="book" size={20} color={color} />
            </View>
          )
        }}
      />
      <Drawer.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          drawerLabel: 'Quiz',
          drawerIcon: ({ color }) => (
            <View style={{
              backgroundColor: color === '#1a237e' ? '#E8EAF6' : 'transparent',
              padding: 8,
              borderRadius: 10,
              width: 38,
              height: 38,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FontAwesome name="question-circle" size={20} color={color} />
            </View>
          )
        }}
      />
      <Drawer.Screen
        name="virtual-lab"
        options={{
          title: 'Virtual Lab',
          drawerLabel: 'Virtual Lab',
          drawerIcon: ({ color }) => (
            <View style={{
              backgroundColor: color === '#1a237e' ? '#E8EAF6' : 'transparent',
              padding: 8,
              borderRadius: 10,
              width: 38,
              height: 38,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FontAwesome name="flask" size={20} color={color} />
            </View>
          )
        }}
      />
      {/* Add these screens but hide them from drawer */}
      <Drawer.Screen
        name="projectile-lab/index"
        options={{
          drawerItemStyle: { height: 0 }
        }}
      />
      <Drawer.Screen
        name="shm-lab/index"
        options={{
          drawerItemStyle: { height: 0 }
        }}
      />
    </Drawer>
  );
}