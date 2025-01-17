import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      // Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'You are logged in!');
      router.replace('/(dashboard)'); // Redirect to the dashboard
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Login Failed', error.message);
      } else {
        Alert.alert('Login Failed', 'An unknown error occurred.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1', '#1565c0']}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <View style={styles.iconBackground}>
              <FontAwesome name="flask" size={65} color="#fff" />
            </View>
            <Text style={styles.logoText}>VirtuLab</Text>
            <Text style={styles.subtitle}>Virtual Laboratory Platform</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.card}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.subText}>Sign in to continue your journey</Text>

              <View style={styles.inputWrapper}>
                <FontAwesome name="envelope" size={20} color="#5c6bc0" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9e9e9e"
                />
              </View>

              <View style={styles.inputWrapper}>
                <FontAwesome name="lock" size={20} color="#5c6bc0" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingRight: 50 }]}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9e9e9e"
                />
                <Pressable 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="#5c6bc0" />
                </Pressable>
              </View>

              <Pressable style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [
                  styles.button,
                  { opacity: pressed ? 0.9 : 1 }
                ]}
                onPress={handleLogin}
              >
                <LinearGradient
                  colors={['#1a237e', '#283593']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>Sign In</Text>
                </LinearGradient>
              </Pressable>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              <Pressable 
                onPress={() => router.push('/register')}
                style={({ pressed }) => [
                  styles.registerButton,
                  { opacity: pressed ? 0.8 : 1 }
                ]}
              >
                <Text style={styles.registerButtonText}>Create New Account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  iconBackground: {
    width: 110,
    height: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#e3e3e3',
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  eyeIcon: {
    padding: 15,
    position: 'absolute',
    right: 0,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 25,
    backgroundColor: 'transparent',
  },
  forgotPasswordText: {
    color: '#5c6bc0',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    borderRadius: 15,
    height: 55,
    overflow: 'hidden',
    shadowColor: '#1a237e',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
    backgroundColor: 'transparent',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 15,
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  registerButton: {
    borderWidth: 2,
    borderColor: '#1a237e',
    borderRadius: 15,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  registerButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: '600',
  },
});