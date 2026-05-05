import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';

// ─── Types ────────────────────────────────────────────────────────────────────
type EntryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Entry'>;
type EntryScreenRouteProp      = RouteProp<RootStackParamList, 'Entry'>;
type Props = {navigation: EntryScreenNavigationProp; route: EntryScreenRouteProp};

// ─── Component ────────────────────────────────────────────────────────────────
const EntryScreen: React.FC<Props> = ({navigation, route}) => {
  const {user} = route.params;

  const handleLogout = () => {
    navigation.replace('Login');
  };

  // Get initials for avatar
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={COLORS.navy} barStyle="light-content" />

      {/* ── Top Banner ── */}
      <View style={styles.banner}>
        <Image
          source={require('../assets/images/satyamav.png')}
          style={styles.emblem}
          resizeMode="contain"
        />
        <Text style={styles.bannerMinistry}>MINISTRY OF DEFENCE</Text>
        <Text style={styles.bannerApp}>DAPD</Text>
        <Text style={styles.bannerSubtitle}>Defence Articles Pricing Depository</Text>
        <View style={styles.bannerDivider} />

        {/* Avatar */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.bannerWelcome}>Welcome,</Text>
        <Text style={styles.bannerName}>{user.name}</Text>
      </View>

      {/* ── Profile Card ── */}
      <View style={styles.profileCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLine} />
          <Text style={styles.cardHeaderLabel}>USER PROFILE</Text>
          <View style={styles.cardHeaderLine} />
        </View>

        {/* Detail Rows */}
        {[
          {icon: '✉', label: 'Email Address',  value: user.email},
          {icon: '📱', label: 'Mobile Number',  value: user.mobile},
          {icon: '🏛', label: 'Office Name',    value: user.office_name},
          {icon: '📍', label: 'Address',        value: user.address},
        ].map(item => (
          <View key={item.label} style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Text style={styles.detailIcon}>{item.icon}</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Entry Label ── */}
      <View style={styles.entryBadgeRow}>
        <View style={styles.entryBadge}>
          <Text style={styles.entryBadgeText}>🔒  SECURE SESSION ACTIVE</Text>
        </View>
      </View>

      {/* ── Status Card ── */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, {backgroundColor: COLORS.success}]} />
          <Text style={styles.statusText}>Connected to MongoDB Atlas</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, {backgroundColor: COLORS.gold}]} />
          <Text style={styles.statusText}>Authentication: JWT Verified</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, {backgroundColor: COLORS.navyLight}]} />
          <Text style={styles.statusText}>Account ID: {String(user.id).slice(-8).toUpperCase()}</Text>
        </View>
      </View>

      {/* ── Logout Button ── */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutIcon}>⏻</Text>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Government of India  •  Ministry of Defence</Text>
      </View>
    </ScrollView>
  );
};

// ─── Colors ───────────────────────────────────────────────────────────────────
const COLORS = {
  background:  '#F0EDE6',
  navy:        '#1A3A6B',
  navyLight:   '#254F9A',
  gold:        '#C6922A',
  goldLight:   '#F5DFA0',
  white:       '#FFFFFF',
  text:        '#1C1C1E',
  subText:     '#6B6560',
  cardBg:      '#FFFFFF',
  border:      '#E5E0D8',
  success:     '#2E7D32',
  successBg:   '#E8F5E9',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex:          {flex: 1, backgroundColor: COLORS.background},
  scrollContent: {flexGrow: 1, paddingBottom: 40},

  // Banner
  banner: {
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  emblem:          {width: 60, height: 60, marginBottom: 8, tintColor: COLORS.goldLight},
  bannerMinistry:  {fontSize: 10, letterSpacing: 2.5, color: COLORS.goldLight, fontWeight: '600', marginBottom: 2},
  bannerApp:       {fontSize: 36, fontWeight: '800', color: COLORS.white, letterSpacing: 6, marginBottom: 2},
  bannerSubtitle:  {fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.3, marginBottom: 20},
  bannerDivider:   {width: 160, height: 1, backgroundColor: COLORS.gold, opacity: 0.5, marginBottom: 20},
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText:    {fontSize: 26, fontWeight: '800', color: COLORS.white},
  bannerWelcome: {fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 2},
  bannerName:    {fontSize: 22, fontWeight: '700', color: COLORS.white, letterSpacing: 0.5},

  // Profile Card
  profileCard: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 20,
    marginTop: -16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeaderRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 18},
  cardHeaderLine:{flex: 1, height: 1, backgroundColor: COLORS.border},
  cardHeaderLabel:{fontSize: 10, fontWeight: '700', color: COLORS.subText, letterSpacing: 1.8, marginHorizontal: 10},

  // Detail Rows
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0EDE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  detailIcon:    {fontSize: 16},
  detailContent: {flex: 1, justifyContent: 'center'},
  detailLabel:   {fontSize: 10, fontWeight: '700', color: COLORS.subText, letterSpacing: 1, marginBottom: 2},
  detailValue:   {fontSize: 14, color: COLORS.text, fontWeight: '500'},

  // Entry Badge
  entryBadgeRow: {alignItems: 'center', marginTop: 20, marginBottom: 8},
  entryBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  entryBadgeText: {fontSize: 11, fontWeight: '700', color: COLORS.success, letterSpacing: 1},

  // Status Card
  statusCard: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  statusRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  statusDot: {width: 8, height: 8, borderRadius: 4, marginRight: 10},
  statusText:{fontSize: 12, color: COLORS.subText, fontWeight: '500'},

  // Logout Button
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.navy,
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.navy,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  logoutIcon: {fontSize: 16, color: COLORS.white, marginRight: 8},
  logoutText: {color: COLORS.white, fontSize: 14, fontWeight: '700', letterSpacing: 2.5},

  // Footer
  footer:     {alignItems: 'center', paddingBottom: 10},
  footerText: {fontSize: 11, color: COLORS.subText},
});

export default EntryScreen;
