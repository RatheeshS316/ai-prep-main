import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ChevronLeft, Users, FileText, Clock, UploadCloud, Edit2, BarChart2, User, BookOpen, Trash2, Plus, Search } from 'lucide-react-native';
import { STAFF_THEME as THEME } from '../utils/theme';

export function StaffCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function StaffHeaderBackground() {
  return (
    <View style={styles.headerBg}>
      <View style={styles.headerBgOverlay} />
    </View>
  );
}

export function StaffScreenHeader({ title, showBack, goBack }) {
  return (
    <View style={styles.screenHeader}>
      {showBack && (
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <ChevronLeft size={24} color={THEME.colors.text.main} />
        </TouchableOpacity>
      )}
      <Text style={styles.screenHeaderTitle}>{title}</Text>
    </View>
  );
}

export function StaffInputField({ label, value, onChangeText, placeholder, multiline, keyboardType }) {
  return (
    <View style={styles.inputWrapper}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[styles.inputField, multiline && styles.inputFieldMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholderTextColor={THEME.colors.text.muted}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );
}

export function StaffPrimaryButton({ title, onPress, color = THEME.colors.primary, icon: Icon, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.primaryBtn, { backgroundColor: color }, style]}>
      {Icon && <Icon size={20} color="#FFF" style={{ marginRight: 8 }} />}
      <Text style={styles.primaryBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function StaffHomeScreen({ profile, students, materials, tests, navigate }) {
  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: THEME.colors.actions.blue },
    { label: 'Materials', value: materials.length, icon: FileText, color: THEME.colors.actions.orange },
    { label: 'Tests Active', value: tests.length, icon: Clock, color: THEME.colors.actions.green },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StaffHeaderBackground />
      <View style={styles.profileHeader}>
        <View>
          <Text style={styles.profileTitle}>Hello{profile.name ? `, ${profile.name.split(' ')[1] || profile.name}` : ''}!</Text>
          <Text style={styles.profileSubtitle}>{profile.subject || 'Staff'} Department</Text>
        </View>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{profile.name ? profile.name.charAt(0) : 'S'}</Text>
        </View>
      </View>

      <StaffCard style={styles.statsCard}>
        <Text style={styles.sectionTitleBlack}>Overview</Text>
        <View style={styles.statsRow}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <View style={[styles.statIconWrap, { backgroundColor: `${stat.color}20` }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </StaffCard>

      <Text style={styles.sectionTitleBlackBase}>Quick Actions</Text>
      <View style={styles.quickActionsRow}>
        <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: THEME.colors.actions.blue }]} onPress={() => navigate('UploadMaterial')}>
          <UploadCloud size={28} color="#FFF" />
          <Text style={styles.quickActionText}>Upload{'\n'}Material</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: THEME.colors.actions.orange }]} onPress={() => navigate('CreateTest')}>
          <Edit2 size={28} color="#FFF" />
          <Text style={styles.quickActionText}>Create{'\n'}Test</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: THEME.colors.actions.green }]} onPress={() => navigate('Performance')}>
          <BarChart2 size={28} color="#FFF" />
          <Text style={styles.quickActionText}>View{'\n'}Performance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: THEME.colors.actions.purple }]} onPress={() => navigate('StudentsTab')}>
          <User size={28} color="#FFF" />
          <Text style={styles.quickActionText}>Manage{'\n'}Students</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitleBlackBase}>Recent Tests</Text>
      {tests.length === 0 ? (
        <Text style={{ marginHorizontal: 16, color: '#6B7280', fontStyle: 'italic', marginBottom: 24 }}>No tests available.</Text>
      ) : (
        tests.slice(0, 2).map((test) => (
          <StaffCard key={test.id} style={styles.testCard}>
            <View style={styles.testCardInner}>
              <View style={styles.testIconWrap}>
                <BookOpen size={24} color={THEME.colors.primary} />
              </View>
              <View style={styles.testInfo}>
                <Text style={styles.testTitle} numberOfLines={1}>{test.title}</Text>
                <Text style={styles.testSubtitle}>{test.date} • {test.duration}</Text>
              </View>
              <View style={[styles.testStatusBtn, test.status === 'Completed' ? styles.statusBtnCompleted : styles.statusBtnActive]}>
                <Text style={[styles.testStatusText, test.status === 'Completed' ? styles.statusTextCompleted : styles.statusTextActive]}>{test.status}</Text>
              </View>
            </View>
          </StaffCard>
        ))
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

export function UploadMaterialScreen({ addMaterial, goBack }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  
  const handleUpload = () => { if (title) { addMaterial({ title, desc: desc || 'Document', type: 'PDF', size: '1.2 MB' }); goBack(); } };

  return (
    <View style={styles.screenContainer}>
      <StaffScreenHeader title="Upload Material" showBack goBack={goBack} />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <TouchableOpacity style={styles.uploadBox}>
          <UploadCloud size={48} color={THEME.colors.secondary} />
          <Text style={styles.uploadBoxText}>Tap to browse or drag file here</Text>
          <Text style={styles.uploadBoxSub}>Support PDF, DOCX, PPTX (Max 50MB)</Text>
        </TouchableOpacity>
        <StaffInputField label="Document Title" value={title} onChangeText={setTitle} placeholder="e.g., Chapter 5 Notes" />
        <StaffInputField label="Description (Optional)" value={desc} onChangeText={setDesc} placeholder="Brief description..." multiline />
        <View style={{ marginTop: 32 }}>
          <StaffPrimaryButton title="Upload File" onPress={handleUpload} color={THEME.colors.actions.blue} />
        </View>
      </ScrollView>
    </View>
  );
}

export function StudentsScreen({ students, deleteStudent }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' ? true : filter === 'Top' ? s.score >= 90 : s.score < 70;
    return matchSearch && matchFilter;
  });

  return (
    <View style={styles.screenContainer}>
      <StaffHeaderBackground />
      <View style={styles.dirHeader}>
        <Text style={styles.dirTitle}>Directory</Text>
        <View style={styles.searchBar}>
          <Search size={20} color={THEME.colors.text.muted} />
          <TextInput style={styles.searchInput} placeholder="Search students..." value={search} onChangeText={setSearch} placeholderTextColor={THEME.colors.text.muted} />
        </View>
        <View style={styles.filterRow}>
          {['All', 'Top', 'Needs Help'].map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterBtn, filter === f && styles.filterBtnActive]}>
              <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ScrollView style={{ paddingHorizontal: 16 }}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#6B7280', fontStyle: 'italic' }}>No students found.</Text>
          </View>
        ) : (
          filtered.map((student) => (
            <StaffCard key={student.id} style={{ marginBottom: 12 }}>
              <View style={styles.studentCardRow}>
                <View style={styles.studentAvatarWrap}><Text style={styles.studentAvatarText}>{student.avatar}</Text></View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentScore}>Overall Score: {student.score}%</Text>
                </View>
                <TouchableOpacity onPress={() => deleteStudent(student.id)} style={styles.deleteBtn}>
                  <Trash2 size={20} color={THEME.colors.status.error} />
                </TouchableOpacity>
              </View>
            </StaffCard>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

export function CreateTestScreen({ addTest, goBack }) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('60');
  const [questions, setQuestions] = useState([{ id: '1', q: '' }]);
  
  const saveTest = () => { if(title) { addTest({ title, duration: duration + 'm', date: 'Upcoming', questions: questions.length }); goBack(); } };

  return (
    <View style={styles.screenContainer}>
      <StaffScreenHeader title="Create New Test" showBack goBack={goBack} />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <StaffCard style={{ marginBottom: 24 }}>
          <StaffInputField label="Test Title" value={title} onChangeText={setTitle} placeholder="e.g., Weekly Mathematics Quiz" />
          <StaffInputField label="Duration (minutes)" value={duration} onChangeText={setDuration} keyboardType="numeric" />
        </StaffCard>
        <View style={styles.questionsHeader}>
          <Text style={styles.questionsTitle}>Questions ({questions.length})</Text>
          <TouchableOpacity onPress={() => setQuestions([...questions, { id: Date.now().toString(), q: '' }])} style={styles.addQuestionBtn}>
            <Plus size={16} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={styles.addQuestionText}>Add</Text>
          </TouchableOpacity>
        </View>
        {questions.map((q, i) => (
          <StaffCard key={q.id} style={{ marginBottom: 16 }}>
            <Text style={styles.qIndex}>Question {i + 1}</Text>
            <TextInput style={styles.qInput} placeholder="Enter question text..." multiline />
          </StaffCard>
        ))}
        <View style={{ marginVertical: 32 }}>
          <StaffPrimaryButton title="Publish Test" onPress={saveTest} />
        </View>
      </ScrollView>
    </View>
  );
}

export function MaterialsScreen({ materials, deleteMaterial, navigate }) {
  return (
    <View style={styles.screenContainer}>
      <StaffHeaderBackground />
      <View style={styles.matHeader}>
        <Text style={styles.dirTitle}>Materials</Text>
        <TouchableOpacity onPress={() => navigate('UploadMaterial')} style={styles.matAddBtn}>
          <Plus size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ paddingHorizontal: 16 }}>
        {materials.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#6B7280', fontStyle: 'italic' }}>No materials uploaded.</Text>
          </View>
        ) : (
          materials.map((m) => (
            <StaffCard key={m.id} style={{ marginBottom: 12 }}>
              <View style={styles.studentCardRow}>
                <View style={[styles.matIconWrap, { backgroundColor: `${THEME.colors.actions.orange}20` }]}><FileText size={24} color={THEME.colors.actions.orange} /></View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{m.title}</Text>
                  <Text style={styles.studentScore}>{m.type} • {m.size} • Uploaded {m.date}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteMaterial(m.id)} style={styles.deleteBtn}>
                  <Trash2 size={20} color={THEME.colors.text.muted} />
                </TouchableOpacity>
              </View>
            </StaffCard>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

export function PerformanceScreen({ students, goBack }) {
  const avgScore = Math.round(students.reduce((acc, s) => acc + s.score, 0) / students.length) || 0;
  return (
    <View style={styles.screenContainer}>
      <StaffScreenHeader title="Class Performance" showBack goBack={goBack} />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <StaffCard style={styles.avgCard}>
          <Text style={styles.sectionTitleBlackBase}>Class Average</Text>
          <View style={styles.avgCircle}>
            <Text style={styles.avgScoreText}>{avgScore}%</Text>
            <Text style={styles.avgScoreSub}>Overall</Text>
          </View>
        </StaffCard>
        <Text style={[styles.sectionTitleBlackBase, { marginBottom: 16 }]}>Student Rankings</Text>
        <View>
          {[...students].sort((a,b) => b.score - a.score).map((s, i) => (
            <View key={s.id} style={styles.rankRow}>
              <Text style={styles.rankIndex}>{i + 1}</Text>
              <View style={styles.rankAvatarWrap}><Text style={styles.rankAvatarText}>{s.avatar}</Text></View>
              <Text style={styles.rankName} numberOfLines={1}>{s.name}</Text>
              <Text style={styles.rankScore}>{s.score}%</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

export function StaffProfileScreen({ profile, onLogout }) {
  return (
    <View style={styles.screenContainer}>
      <StaffHeaderBackground />
      <View style={styles.spProfileHeader}>
        <View style={styles.spAvatarWrap}><Text style={styles.spAvatarText}>{profile.name ? profile.name.charAt(0) : 'S'}</Text></View>
        <Text style={styles.spName}>{profile.name || 'Staff Member'}</Text>
        <Text style={styles.spRole}>{profile.role || 'Staff Role'} - {profile.subject || 'Subject'}</Text>
      </View>
      <View style={{ padding: 16, marginTop: 32 }}>
        <StaffPrimaryButton title="Log Out" color={THEME.colors.status.error} onPress={onLogout} />
      </View>
    </View>
  );
}

// Staff Styles
const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  headerBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 256, backgroundColor: '#EFF6FF', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerBgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 96, backgroundColor: '#CFFAFE', opacity: 0.5, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  screenHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#F3F4F6', zIndex: 10 },
  backBtn: { marginRight: 16, padding: 8 },
  screenHeaderTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 },
  inputField: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 16, color: '#111827' },
  inputFieldMultiline: { minHeight: 96, textAlignVertical: 'top' },
  primaryBtn: { width: '100%', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  screenContainer: { flex: 1, backgroundColor: '#F3F4F6' },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 64, marginBottom: 32, zIndex: 10 },
  profileTitle: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 4 },
  profileSubtitle: { fontSize: 16, color: '#4B5563' },
  profileAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#1E3A8A', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  profileAvatarText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  statsCard: { marginHorizontal: 16, marginBottom: 32 },
  sectionTitleBlack: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  sectionTitleBlackBase: { fontSize: 18, fontWeight: '700', color: '#111827', marginHorizontal: 16, marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 },
  statItem: { alignItems: 'center' },
  statIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  quickActionsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 24 },
  quickActionCard: { width: '48%', height: 112, borderRadius: 16, padding: 16, justifyContent: 'space-between', marginBottom: 16, elevation: 3 },
  quickActionText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  testCard: { marginHorizontal: 16, marginBottom: 12 },
  testCardInner: { flexDirection: 'row', alignItems: 'center' },
  testIconWrap: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  testInfo: { flex: 1, marginLeft: 16 },
  testTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  testSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  testStatusBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusBtnCompleted: { backgroundColor: '#D1FAE5' },
  statusBtnActive: { backgroundColor: '#DBEAFE' },
  testStatusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  statusTextCompleted: { color: '#047857' },
  statusTextActive: { color: '#1D4ED8' },
  uploadBox: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#D1D5DB', borderRadius: 16, padding: 40, alignItems: 'center', backgroundColor: '#FFF', marginBottom: 32 },
  uploadBoxText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 16 },
  uploadBoxSub: { fontSize: 12, color: '#6B7280', marginTop: 8 },
  dirHeader: { padding: 16, paddingTop: 64, zIndex: 10 },
  dirTitle: { fontSize: 30, fontWeight: '800', color: '#111827', marginBottom: 24 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 30, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', height: 50 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#111827' },
  filterRow: { flexDirection: 'row', backgroundColor: 'rgba(229, 231, 235, 0.6)', padding: 4, borderRadius: 30, marginBottom: 24 },
  filterBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 30 },
  filterBtnActive: { backgroundColor: '#3B82F6', elevation: 2 },
  filterBtnText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  filterBtnTextActive: { color: '#FFF' },
  studentCardRow: { flexDirection: 'row', alignItems: 'center' },
  studentAvatarWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#38BDF8', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  studentAvatarText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  studentScore: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  deleteBtn: { padding: 8 },
  questionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  questionsTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  addQuestionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E3A8A', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, elevation: 1 },
  addQuestionText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  qIndex: { fontSize: 14, fontWeight: '700', color: '#6B7280', marginBottom: 12 },
  qInput: { minHeight: 48, borderBottomWidth: 1, borderColor: '#E5E7EB', paddingBottom: 8, fontSize: 16, color: '#111827' },
  matHeader: { padding: 16, paddingTop: 64, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  matAddBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  matIconWrap: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avgCard: { alignItems: 'center', paddingVertical: 32, marginBottom: 32 },
  avgCircle: { width: 144, height: 144, borderRadius: 72, borderWidth: 14, borderColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  avgScoreText: { fontSize: 30, fontWeight: '800', color: '#111827' },
  avgScoreSub: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  rankRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F9FAFB', marginBottom: 8 },
  rankIndex: { width: 24, fontSize: 14, fontWeight: '700', color: '#9CA3AF' },
  rankAvatarWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E3A8A', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rankAvatarText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  rankName: { width: 96, fontSize: 14, fontWeight: '700', color: '#111827' },
  rankScore: { flex: 1, textAlign: 'right', fontSize: 16, fontWeight: '800', color: '#111827' },
  spProfileHeader: { alignItems: 'center', paddingTop: 80, zIndex: 10 },
  spAvatarWrap: { width: 112, height: 112, borderRadius: 56, backgroundColor: '#1E3A8A', borderWidth: 4, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: 16, elevation: 4 },
  spAvatarText: { fontSize: 40, fontWeight: '800', color: '#FFF' },
  spName: { fontSize: 24, fontWeight: '800', color: '#111827' },
  spRole: { fontSize: 16, fontWeight: '500', color: '#4B5563', marginTop: 4 },
});
