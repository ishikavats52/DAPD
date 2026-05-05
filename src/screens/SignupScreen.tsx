import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import {registerUser} from '../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────
type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;
type Props = {navigation: SignupScreenNavigationProp};

// ─── Validation ───────────────────────────────────────────────────────────────
const signupSchema = yup.object({
  name: yup.string().trim().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().trim().required('Email is required').email('Enter a valid email address'),
  mobile: yup
    .string()
    .trim()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  office_name: yup.string().trim().required('Office name is required').min(2, 'Enter a valid office name'),
  address: yup.string().trim().required('Address is required').min(5, 'Enter a complete address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

type SignupFormData = yup.InferType<typeof signupSchema>;

// ─── Component ────────────────────────────────────────────────────────────────
const SignupScreen: React.FC<Props> = ({navigation}) => {
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading]               = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '', email: '', mobile: '', office_name: '', address: '', password: '', confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.mobile, data.office_name, data.address, data.password);
      Alert.alert(
        '✅ Registration Successful',
        'Your account has been created. Please sign in.',
        [{text: 'Sign In', onPress: () => navigation.navigate('Login')}],
      );
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (
    name: keyof SignupFormData,
    label: string,
    placeholder: string,
    options: {
      keyboardType?: 'default' | 'email-address' | 'phone-pad';
      isPassword?: boolean;
      showPw?: boolean;
      togglePw?: () => void;
    } = {},
  ) => (
    <View style={styles.fieldGroup} key={name}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, onBlur, value}}) => {
          if (options.isPassword) {
            return (
              <View style={[styles.passwordContainer, errors[name] && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={placeholder}
                  placeholderTextColor={COLORS.placeholder}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value as string}
                  secureTextEntry={!options.showPw}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={options.togglePw} style={styles.showBtn}>
                  <Text style={styles.showText}>{options.showPw ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            );
          }
          return (
            <TextInput
              style={[styles.input, errors[name] && styles.inputError]}
              placeholder={placeholder}
              placeholderTextColor={COLORS.placeholder}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value as string}
              keyboardType={options.keyboardType || 'default'}
              autoCapitalize={name === 'email' ? 'none' : 'words'}
              autoCorrect={false}
            />
          );
        }}
      />
      {errors[name] && (
        <View style={styles.errorRow}>
          <Text style={styles.errorIcon}>⚠</Text>
          <Text style={styles.errorText}>{errors[name]?.message as string}</Text>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/images/satyamav.png')}
            style={styles.emblem}
            resizeMode="contain"
          />
          <Text style={styles.satyamevGold}>सत्यमेव जयते</Text>
          <View style={styles.headerDivider} />
          <Text style={styles.ministryLabel}>MINISTRY OF DEFENCE</Text>
          <Text style={styles.appName}>DAPD</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NEW REGISTRATION</Text>
            </View>
          </View>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Account</Text>
          <Text style={styles.cardSubtitle}>Fill in your details to register</Text>

          {renderField('name', 'FULL NAME', 'Enter your full name')}
          {renderField('email', 'EMAIL ADDRESS', 'Enter your email address', {keyboardType: 'email-address'})}
          {renderField('mobile', 'MOBILE NUMBER', 'Enter 10-digit mobile number', {keyboardType: 'phone-pad'})}
          {renderField('office_name', 'OFFICE NAME', 'Enter your office / unit name')}
          {renderField('address', 'ADDRESS', 'Enter your office address')}

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, onBlur, value}}) => (
                <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Create a strong password"
                    placeholderTextColor={COLORS.placeholder}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.showBtn}>
                    <Text style={styles.showText}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <View style={styles.errorRow}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.errorText}>{errors.password.message}</Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CONFIRM PASSWORD</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({field: {onChange, onBlur, value}}) => (
                <View style={[styles.passwordContainer, errors.confirmPassword && styles.inputError]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Re-enter your password"
                    placeholderTextColor={COLORS.placeholder}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(p => !p)} style={styles.showBtn}>
                    <Text style={styles.showText}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <View style={styles.errorRow}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
              </View>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerBtn, isLoading && styles.btnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.registerBtnText}>CREATE ACCOUNT</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Government of India</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerText}>Ministry of Defence</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ─── Colors ───────────────────────────────────────────────────────────────────
const COLORS = {
  background:  '#F0EDE6',
  navy:        '#1A3A6B',
  navyLight:   '#254F9A',
  gold:        '#C6922A',
  white:       '#FFFFFF',
  border:      '#D0CCC0',
  placeholder: '#A8A49C',
  text:        '#1C1C1E',
  subText:     '#6B6560',
  error:       '#D32F2F',
  errorBg:     '#FFF3F3',
  cardBg:      '#FFFFFF',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex:          {flex: 1, backgroundColor: COLORS.background},
  scrollContent: {flexGrow: 1, paddingBottom: 40},

  // Header
  header: {alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, paddingHorizontal: 24},
  emblem: {width: 90, height: 90, marginBottom: 8},
  satyamevGold: {fontSize: 13, color: COLORS.gold, fontWeight: '600', letterSpacing: 2, marginBottom: 10},
  headerDivider: {width: 160, height: 1.5, backgroundColor: COLORS.gold, marginBottom: 12},
  ministryLabel: {fontSize: 10, letterSpacing: 2.5, color: COLORS.navyLight, fontWeight: '600', marginBottom: 2},
  appName:       {fontSize: 36, fontWeight: '800', color: COLORS.navy, letterSpacing: 6, marginBottom: 10},
  badgeRow:      {flexDirection: 'row'},
  badge:         {backgroundColor: COLORS.navy, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4},
  badgeText:     {color: COLORS.white, fontSize: 10, fontWeight: '700', letterSpacing: 1.5},

  // Card
  card: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle:    {fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 4},
  cardSubtitle: {fontSize: 13, color: COLORS.subText, marginBottom: 24},

  // Fields
  fieldGroup: {marginBottom: 14},
  fieldLabel: {fontSize: 10, fontWeight: '700', color: COLORS.subText, letterSpacing: 1.2, marginBottom: 5},
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 13 : 10,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  inputError:        {borderColor: COLORS.error, backgroundColor: COLORS.errorBg},
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
  },
  passwordInput: {flex: 1, paddingVertical: Platform.OS === 'ios' ? 13 : 10, fontSize: 14, color: COLORS.text},
  showBtn:       {paddingLeft: 10, paddingVertical: 10},
  showText:      {fontSize: 13, fontWeight: '600', color: COLORS.navyLight},
  errorRow:      {flexDirection: 'row', alignItems: 'flex-start', marginTop: 4},
  errorIcon:     {fontSize: 11, color: COLORS.error, marginRight: 4, marginTop: 1},
  errorText:     {fontSize: 11, color: COLORS.error, flex: 1, lineHeight: 15},

  // Register Button
  registerBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.navy,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  btnDisabled:     {opacity: 0.7},
  registerBtnText: {color: COLORS.white, fontSize: 14, fontWeight: '700', letterSpacing: 2},

  // Login Row
  loginRow:    {flexDirection: 'row', justifyContent: 'center', marginTop: 18},
  loginPrompt: {fontSize: 13, color: COLORS.subText},
  loginLink:   {fontSize: 13, color: COLORS.navyLight, fontWeight: '700'},

  // Footer
  footer:     {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24},
  footerText: {fontSize: 11, color: COLORS.subText, fontWeight: '500'},
  footerDot:  {marginHorizontal: 8, color: COLORS.subText},
});

export default SignupScreen;
