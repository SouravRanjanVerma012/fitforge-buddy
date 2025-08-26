import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../lib/authUniversal';
import { testNetworkConnection, findWorkingConnection } from '../lib/networkConfig';

interface LoginScreenProps {
  onSwitchToSignup: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with email:', email);
      await login(email, password);
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Test network connectivity first
      console.log('🧪 Testing network connectivity...');
      const testResponse = await fetch('http://10.0.2.2:5000/api/health');
      console.log('✅ Network test response:', testResponse.status);
      
      // Try admin credentials first
      await login('admin@fitforge.com', 'admin123');
    } catch (error) {
      console.log('❌ Network test failed, trying alternative IP...');
      try {
        // Try with localhost as fallback
        const testResponse2 = await fetch('http://localhost:5000/api/health');
        console.log('✅ Localhost test response:', testResponse2.status);
        await login('admin@fitforge.com', 'admin123');
      } catch (secondError) {
        try {
          // Try user credentials
          await login('user@example.com', 'password123');
        } catch (thirdError) {
          try {
            // Try coach credentials
            await login('coach@fitforge.com', 'coach123');
          } catch (fourthError) {
            setError('Network connection failed. Please check your backend server.');
            Alert.alert(
              'Connection Error', 
              'Cannot connect to backend server. Please ensure the server is running on port 5000.'
            );
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              Welcome to{'\n'}
              <Text style={styles.brandText}>FitForge Buddy</Text>
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Your personal fitness companion. Track workouts, monitor progress, and achieve your fitness goals with our comprehensive platform designed to support your journey to a healthier lifestyle.
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Login</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
              />
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.demoButton]}
              onPress={handleDemoLogin}
              disabled={loading}
            >
              <Text style={styles.demoButtonText}>Demo Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={async () => {
                try {
                  console.log('🧪 Testing network connection...');
                  const result = await testNetworkConnection();
                  
                  if (result.success) {
                    Alert.alert('Network Test', `✅ Connection successful!\nURL: ${result.url}`);
                  } else {
                    console.log('❌ Network test failed, trying to find working connection...');
                    const workingURL = await findWorkingConnection();
                    
                    if (workingURL) {
                      Alert.alert('Network Test', `✅ Found working connection!\nURL: ${workingURL}`);
                    } else {
                      Alert.alert('Network Test', `❌ Connection failed.\nError: ${result.error}\n\nPlease check if your backend server is running on port 5000.`);
                    }
                  }
                } catch (error) {
                  console.log('❌ Network test failed:', error);
                  Alert.alert('Network Test', '❌ Connection failed. Check if backend is running.');
                }
              }}
              disabled={loading}
            >
              <Text style={styles.testButtonText}>Test Connection</Text>
            </TouchableOpacity>

            {/* Test Credentials Info */}
            <View style={styles.credentialsInfo}>
              <Text style={styles.credentialsTitle}>Test Credentials:</Text>
              <Text style={styles.credentialsText}>Admin: admin@fitforge.com / admin123</Text>
              <Text style={styles.credentialsText}>User: user@example.com / password123</Text>
              <Text style={styles.credentialsText}>Coach: coach@fitforge.com / coach123</Text>
            </View>

            {/* Social Login Options */}
            <View style={styles.socialSection}>
              <Text style={styles.socialText}>or login with:</Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialIcon}>📘</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialIcon}>🐦</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialIcon}>🔍</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialIcon}>🐙</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupSection}>
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text style={styles.signupLink} onPress={onSwitchToSignup}>
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
    color: '#1e293b',
  },
  brandText: {
    color: '#fd7e14',
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#64748b',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#1e293b',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#fd7e14',
  },
  demoButton: {
    backgroundColor: '#28a745',
  },
  testButton: {
    backgroundColor: '#007bff',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  credentialsInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  credentialsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
  },
  credentialsText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 4,
  },
  socialSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  socialText: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    fontSize: 20,
  },
  signupSection: {
    alignItems: 'center',
  },
  signupText: {
    color: '#6b7280',
    fontSize: 14,
  },
  signupLink: {
    color: '#fd7e14',
    fontWeight: '600',
  },
});

export default LoginScreen; 