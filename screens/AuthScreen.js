import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrainCircuit, User, Hash, Mail, Calendar, Briefcase, School, Lock, Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '../utils/theme';

function AuthInput({ icon: Icon, placeholder, value, onChangeText, error, secureTextEntry, toggleSecure, isPassword }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputWrapper}>
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        isFocused ? styles.inputFocused : null
      ]}>
        {Icon && <Icon color={error ? COLORS.red400 : COLORS.gray400} size={20} style={styles.icon} />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray400}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isPassword && (
          <TouchableOpacity onPress={toggleSecure} style={styles.eyeIcon}>
            {secureTextEntry ? <EyeOff color={COLORS.gray400} size={18} /> : <Eye color={COLORS.gray400} size={18} />}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function AuthScreen({ onLogin }) {
  const [role, setRole] = useState('Staff');
  const [mode, setMode] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '', registerNumber: '', collegeName: '', 
    collegeCode: '', email: '', department: '', 
    password: '', confirmPassword: '', dob: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
    setFormData({
      fullName: '', registerNumber: '', collegeName: '', 
      collegeCode: '', email: '', department: '', 
      password: '', confirmPassword: '', dob: ''
    });
  }, [role, mode]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    let newErrors = {};
    if (mode === 'signup') {
      if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
      if (role === 'Student' && !formData.registerNumber.trim()) newErrors.registerNumber = "Register Number is required";
      if (role === 'Student' && !formData.dob) newErrors.dob = "Date of Birth is required";
      if (!formData.collegeName.trim()) newErrors.collegeName = "College Name is required";
      if (!formData.collegeCode.trim()) newErrors.collegeCode = "College Code is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
      if (role === 'Staff' && !formData.department.trim()) newErrors.department = "Department is required";
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Minimum 6 characters required";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    } else {
      if (role === 'Student') {
        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!formData.registerNumber.trim()) newErrors.registerNumber = "Register Number is required";
      }
      if (role === 'Staff') {
        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
      }
      if (!formData.password) newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onLogin(role, formData, mode);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={['#ECFEFF', '#DBEAFE']} style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <LinearGradient colors={['#22D3EE', '#3B82F6']} style={styles.logoBox}>
              <BrainCircuit color="#FFF" size={32} />
            </LinearGradient>
            <Text style={styles.title}>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</Text>
            <Text style={styles.subtitle}>Please authenticate to continue</Text>

            <View style={styles.roleToggle}>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'Student' && styles.roleBtnActive]}
                onPress={() => setRole('Student')}
              >
                <Text style={[styles.roleBtnText, role === 'Student' && styles.roleBtnTextActive]}>Student</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'Staff' && styles.roleBtnActive]}
                onPress={() => setRole('Staff')}
              >
                <Text style={[styles.roleBtnText, role === 'Staff' && styles.roleBtnTextActive]}>Staff</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
            <AuthInput icon={User} placeholder="Full Name" value={formData.fullName} onChangeText={(v) => handleChange('fullName', v)} error={errors.fullName} />
            
            {role === 'Student' && (
              <AuthInput icon={Hash} placeholder="Register Number" value={formData.registerNumber} onChangeText={(v) => handleChange('registerNumber', v)} error={errors.registerNumber} />
            )}

            {(role === 'Staff' || mode === 'signup') && (
              <AuthInput icon={Mail} placeholder="Email Address" value={formData.email} onChangeText={(v) => handleChange('email', v)} error={errors.email} />
            )}

            {mode === 'signup' && (
              <>
                {role === 'Student' && <AuthInput icon={Calendar} placeholder="Date of Birth" value={formData.dob} onChangeText={(v) => handleChange('dob', v)} error={errors.dob} />}
                {role === 'Staff' && <AuthInput icon={Briefcase} placeholder="Department" value={formData.department} onChangeText={(v) => handleChange('department', v)} error={errors.department} />}
                <AuthInput icon={School} placeholder="College Name" value={formData.collegeName} onChangeText={(v) => handleChange('collegeName', v)} error={errors.collegeName} />
                <AuthInput icon={Hash} placeholder="College Code" value={formData.collegeCode} onChangeText={(v) => handleChange('collegeCode', v)} error={errors.collegeCode} />
              </>
            )}

            <AuthInput icon={Lock} placeholder="Password" value={formData.password} onChangeText={(v) => handleChange('password', v)} error={errors.password} isPassword secureTextEntry={!showPassword} toggleSecure={() => setShowPassword(!showPassword)} />
            
            {mode === 'signup' && (
              <AuthInput icon={Lock} placeholder="Confirm Password" value={formData.confirmPassword} onChangeText={(v) => handleChange('confirmPassword', v)} error={errors.confirmPassword} isPassword secureTextEntry={!showConfirmPassword} toggleSecure={() => setShowConfirmPassword(!showConfirmPassword)} />
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <LinearGradient colors={['#06B6D4', '#2563EB']} style={styles.submitGradient}>
                <Text style={styles.submitText}>{mode === 'signin' ? `Sign In as ${role}` : 'Register Account'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.switchModeContainer}>
              <Text style={styles.switchModeText}>
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                <Text style={styles.switchModeLink}>{mode === 'signin' ? 'Sign Up' : 'Sign In'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray500,
    marginBottom: 24,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(229, 231, 235, 0.8)',
    padding: 4,
    borderRadius: 30,
    width: 240,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  roleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray500,
  },
  roleBtnTextActive: {
    color: COLORS.blue600,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  formContent: {
    paddingBottom: 40,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.gray100,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  inputError: {
    borderColor: COLORS.red400,
    backgroundColor: 'rgba(254, 242, 242, 0.5)',
  },
  inputFocused: {
    borderColor: COLORS.blue500,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.gray800,
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    color: COLORS.red500,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
    marginTop: 6,
  },
  submitBtn: {
    marginTop: 24,
    borderRadius: 16,
    shadowColor: COLORS.blue400,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  switchModeText: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  switchModeLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.blue600,
  },
});
