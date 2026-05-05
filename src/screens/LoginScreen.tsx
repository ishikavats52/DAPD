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
import {loginUser} from '../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type Props = {navigation: LoginScreenNavigationProp};

// ─── Validation ───────────────────────────────────────────────────────────────
const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

// ─── Translations ─────────────────────────────────────────────────────────────
const translations: Record<string, Record<string, string>> = {
  EN: {
    ministryLabel:   'MINISTRY OF DEFENCE',
    appName:         'DAPD',
    appSubtitle:     'Defence Articles Pricing Depository',
    welcomeBack:     'Welcome Back',
    signIn:          'Sign in to your account',
    emailLabel:      'EMAIL ADDRESS',
    emailPlaceholder:'Enter your email address',
    passwordLabel:   'PASSWORD',
    passwordPlaceholder: 'Enter your password',
    show:            'Show',
    hide:            'Hide',
    loginButton:     'LOGIN',
    forgotPassword:  'Forgot Password?',
    noAccount:       "Don't have an account?",
    register:        ' Register',
    footerLine1:     'Government of India',
    footerLine2:     'Ministry of Defence',
    loggingIn:       'Signing in...',
  },
  HI: {
    ministryLabel:   'रक्षा मंत्रालय',
    appName:         'DAPD',
    appSubtitle:     'रक्षा सामग्री मूल्य निक्षेपागार',
    welcomeBack:     'वापसी पर स्वागत है',
    signIn:          'अपने खाते में साइन इन करें',
    emailLabel:      'ईमेल पता',
    emailPlaceholder:'अपना ईमेल दर्ज करें',
    passwordLabel:   'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    show:            'दिखाएं',
    hide:            'छिपाएं',
    loginButton:     'लॉगिन',
    forgotPassword:  'पासवर्ड भूल गए?',
    noAccount:       'खाता नहीं है?',
    register:        ' पंजीकरण करें',
    footerLine1:     'भारत सरकार',
    footerLine2:     'रक्षा मंत्रालय',
    loggingIn:       'साइन इन हो रहा है...',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [language, setLanguage]     = useState<'EN' | 'HI'>('EN');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);

  const t = translations[language];

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {email: '', password: ''},
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const {user} = await loginUser(data.email, data.password);
      navigation.replace('Entry', {user});
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Language Toggle */}
        <View style={styles.langRow}>
          <TouchableOpacity
            onPress={() => setLanguage('EN')}
            style={[styles.langBtn, language === 'EN' && styles.langBtnActive]}>
            <Text style={[styles.langText, language === 'EN' && styles.langTextActive]}>EN</Text>
          </TouchableOpacity>
          <View style={styles.langDivider} />
          <TouchableOpacity
            onPress={() => setLanguage('HI')}
            style={[styles.langBtn, language === 'HI' && styles.langBtnActive]}>
            <Text style={[styles.langText, language === 'HI' && styles.langTextActive]}>हि</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/images/satyamav.png')}
            style={styles.emblem}
            resizeMode="contain"
            accessibilityLabel="Government of India Emblem"
          />
          <Text style={styles.satyamevDevanagari}>सत्यमेव जयते</Text>
          <Text style={styles.satyamevGold}>सत्यमेव</Text>
          <View style={styles.headerDivider} />
          <Text style={styles.ministryLabel}>{t.ministryLabel}</Text>
          <Text style={styles.appName}>{t.appName}</Text>
          <Text style={styles.appSubtitle}>{t.appSubtitle}</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.welcomeText}>{t.welcomeBack}</Text>
          <Text style={styles.signInText}>{t.signIn}</Text>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t.emailLabel}</Text>
            <Controller
              control={control}
              name="email"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder={t.emailPlaceholder}
                  placeholderTextColor={COLORS.placeholder}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  testID="email-input"
                />
              )}
            />
            {errors.email && (
              <View style={styles.errorRow}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.errorText}>{errors.email.message}</Text>
              </View>
            )}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t.passwordLabel}</Text>
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, onBlur, value}}) => (
                <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder={t.passwordPlaceholder}
                    placeholderTextColor={COLORS.placeholder}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    testID="password-input"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(prev => !prev)}
                    style={styles.showBtn}>
                    <Text style={styles.showText}>{showPassword ? t.hide : t.show}</Text>
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

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>{t.forgotPassword}</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            testID="login-button">
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.loginBtnText}>{t.loginButton}</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>{t.noAccount}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.registerLink}>{t.register}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t.footerLine1}</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerText}>{t.footerLine2}</Text>
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
  langBorder:  '#CCCCCC',
  divider:     '#B8A880',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex:          {flex: 1, backgroundColor: COLORS.background},
  scrollContent: {flexGrow: 1, paddingBottom: 30},

  // Language Toggle
  langRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 50 : 30,
    marginRight: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.langBorder,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  langBtn:       {paddingHorizontal: 14, paddingVertical: 6, backgroundColor: COLORS.white},
  langBtnActive: {backgroundColor: COLORS.navy},
  langText:      {fontSize: 13, fontWeight: '600', color: COLORS.text},
  langTextActive:{color: COLORS.white},
  langDivider:   {width: 1, backgroundColor: COLORS.langBorder},

  // Header
  header: {alignItems: 'center', paddingTop: 24, paddingBottom: 20, paddingHorizontal: 24},
  emblem: {width: 150, height: 150, marginBottom: 8},
  satyamevDevanagari: {fontSize: 15, color: COLORS.text, fontWeight: '500', marginBottom: 2, letterSpacing: 0.5},
  satyamevGold:       {fontSize: 13, color: COLORS.gold, fontWeight: '600', letterSpacing: 2, marginBottom: 12},
  headerDivider:      {width: 200, height: 1.5, backgroundColor: COLORS.gold, marginBottom: 14},
  ministryLabel:      {fontSize: 11, letterSpacing: 2.5, color: COLORS.navyLight, fontWeight: '600', marginBottom: 4},
  appName:            {fontSize: 44, fontWeight: '800', color: COLORS.navy, letterSpacing: 6, marginBottom: 4},
  appSubtitle:        {fontSize: 13, color: COLORS.subText, textAlign: 'center', letterSpacing: 0.3},

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
  welcomeText: {fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 4},
  signInText:  {fontSize: 14, color: COLORS.subText, marginBottom: 24},

  // Fields
  fieldGroup: {marginBottom: 16},
  fieldLabel: {fontSize: 11, fontWeight: '700', color: COLORS.subText, letterSpacing: 1.2, marginBottom: 6},
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 11,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  inputError: {borderColor: COLORS.error, backgroundColor: COLORS.errorBg},
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
  },
  passwordInput: {flex: 1, paddingVertical: Platform.OS === 'ios' ? 14 : 11, fontSize: 15, color: COLORS.text},
  showBtn:  {paddingLeft: 10, paddingVertical: 10},
  showText: {fontSize: 14, fontWeight: '600', color: COLORS.navyLight},
  errorRow: {flexDirection: 'row', alignItems: 'flex-start', marginTop: 5},
  errorIcon:{fontSize: 12, color: COLORS.error, marginRight: 4, marginTop: 1},
  errorText:{fontSize: 12, color: COLORS.error, flex: 1, lineHeight: 16},

  // Forgot
  forgotContainer: {alignSelf: 'flex-end', marginBottom: 20, marginTop: 4},
  forgotText: {fontSize: 13, color: COLORS.navyLight, fontWeight: '600'},

  // Login Button
  loginBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.navy,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  loginBtnDisabled: {opacity: 0.7},
  loginBtnText: {color: COLORS.white, fontSize: 15, fontWeight: '700', letterSpacing: 2.5},

  // Register Row
  registerRow: {flexDirection: 'row', justifyContent: 'center', marginTop: 20},
  registerPrompt: {fontSize: 13, color: COLORS.subText},
  registerLink:   {fontSize: 13, color: COLORS.navyLight, fontWeight: '700'},

  // Footer
  footer: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, paddingHorizontal: 20},
  footerText: {fontSize: 12, color: COLORS.subText, fontWeight: '500'},
  footerDot:  {marginHorizontal: 8, color: COLORS.subText},
});

export default LoginScreen;
