import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrainCircuit, CheckCircle2, Circle, Plus, Trash2, Edit2, PlayCircle, Upload, FileText, UploadCloud, ChevronLeft, Check, Clock, Send, User, Paperclip, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/theme';

export function QuickActionBtn({ icon: Icon, label, bgColors, onPress }) {
  return (
    <TouchableOpacity style={styles.quickActionGroup} onPress={onPress}>
      <LinearGradient colors={bgColors} style={styles.quickActionBtn}>
        <Icon color="#FFF" size={32} />
      </LinearGradient>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export function HomeTab({ tasks, progressPercent, completedTasks, toggleTask, openModal, deleteTask, navigateToScreen, navigateToTab, currentUser }) {
  return (
    <ScrollView style={styles.tabContainer} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={styles.p6}>
        <View style={styles.headerRow}>
          <View>
            <View style={styles.aiPrepLabel}>
              <BrainCircuit color={COLORS.blue600} size={20} />
              <Text style={styles.aiPrepText}> AI Prep</Text>
            </View>
            <Text style={styles.greeting}>Hello{currentUser?.fullName ? `, ${currentUser.fullName.split(' ')[0]}` : ''}!</Text>
          </View>
          <View style={styles.profilePicWrapper}>
            <View style={[styles.profilePic, { backgroundColor: COLORS.blue500, alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '700' }}>{currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'S'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardMain}>
          <View style={styles.blurCircle} />
          <Text style={styles.examTitle}>No Upcoming Exams</Text>
          <View style={styles.examDaysRow}>
            <Text style={styles.examDaysNum}>0</Text>
            <Text style={styles.examDaysLabel}>days</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Preparation</Text>
              <Text style={styles.progressLabel}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient colors={[COLORS.cyan400, COLORS.blue500]} style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.cardSecondary}>
          <View style={styles.cardHeaderFlex}>
            <Text style={styles.cardTitle}>Today's Plan</Text>
            <TouchableOpacity onPress={() => openModal('add_task')} style={styles.addBtnContainer}>
              <Plus color={COLORS.blue500} size={20} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tasksList}>
            {tasks.length === 0 ? (
              <Text style={styles.emptyText}>No tasks for today. Add one!</Text>
            ) : (
              tasks.map(task => (
                <View key={task.id} style={styles.taskItem}>
                  <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.taskCheckbox}>
                    {task.completed ? <CheckCircle2 color={COLORS.cyan500} size={24} /> : <Circle color={COLORS.gray300} size={24} />}
                  </TouchableOpacity>
                  <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>{task.title}</Text>
                  <View style={styles.taskActions}>
                    <TouchableOpacity onPress={() => openModal('edit_task', task)} style={styles.actionBtn}>
                      <Edit2 color={COLORS.gray400} size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.actionBtn}>
                      <Trash2 color={COLORS.gray400} size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.progressSmallContainer}>
            <Text style={styles.progressLabelSmall}>Progress</Text>
            <View style={styles.progressBarSmallBg}>
              <View style={[styles.progressBarSmallFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressValSmall}>{completedTasks}/{tasks.length}</Text>
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Boost Your Prep</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionBtn icon={Upload} label={"Upload\nNotes"} bgColors={[COLORS.blue400, COLORS.blue600]} onPress={() => navigateToScreen('UploadNotes')} />
            <QuickActionBtn icon={FileText} label={"Take\nTest"} bgColors={[COLORS.orange400, '#F97316']} onPress={() => navigateToTab('TestPage')} />
            <QuickActionBtn icon={BrainCircuit} label={"Ask\nAI"} bgColors={[COLORS.green100, COLORS.green500]} onPress={() => navigateToTab('AIChatPage')} />
            <QuickActionBtn icon={PlayCircle} label={"Watch\nVideos"} bgColors={[COLORS.purple500, '#7C3AED']} onPress={() => navigateToScreen('WatchVideos')} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export function StudyTab({ tasks, openModal, toggleTask, deleteTask }) {
  const dates = [{ day: 'Sun', date: '19', active: true }, { day: 'Tue', date: '20', active: false }, { day: 'Wed', date: '21', active: false }, { day: 'Thu', date: '22', active: false }];
  return (
    <ScrollView style={styles.tabContainer} contentContainerStyle={styles.p6}>
      <Text style={styles.pageTitle}>Study Schedule</Text>
      <Text style={styles.pageSubtitle}>October 19</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesRow}>
        {dates.map((d, i) => (
          <TouchableOpacity key={i} style={[styles.dateCard, d.active && styles.dateCardActive]}>
            <Text style={[styles.dateDay, d.active && styles.dateDayActive]}>{d.day}</Text>
            <Text style={[styles.dateNum, d.active && styles.dateNumActive]}>{d.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.cardHeaderFlex}>
        <Text style={styles.cardTitle}>Today's</Text>
        <TouchableOpacity onPress={() => openModal('add_task')} style={styles.addBtnPill}>
          <Text style={styles.addBtnPillText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 32 }}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskCardBox}>
            <View style={styles.taskCardLeft}>
              <TouchableOpacity onPress={() => toggleTask(task.id)}>
                {task.completed ? <CheckCircle2 color={COLORS.cyan500} size={24} /> : <Circle color={COLORS.gray300} size={24} />}
              </TouchableOpacity>
              <View style={{ marginLeft: 16 }}>
                <Text style={[styles.taskCardTitle, task.completed && styles.taskTitleDone]}>{task.title}</Text>
                <View style={styles.taskCardStatus}>
                  <Clock color={COLORS.gray500} size={12} style={{ marginRight: 4 }} />
                  <Text style={styles.taskCardStatusText}>{task.completed ? 'Complete' : 'Pending'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.taskActions}>
              <TouchableOpacity onPress={() => openModal('edit_task', task)} style={styles.actionBtn}>
                <Edit2 color={COLORS.gray400} size={16} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.actionBtn}>
                <Trash2 color={COLORS.gray400} size={16} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Upcoming task removed */}
    </ScrollView>
  );
}

export function TestTab({ navigation }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const questions = [];

  const handleNext = () => {
    if (currentQ < questions.length - 1) { setCurrentQ(c => c + 1); setSelectedOpt(null); } 
    else { setIsFinished(true); }
  };

  if (isFinished) return (
    <View style={styles.testFinishedContainer}>
      <View style={styles.testFinishedIcon}>
         <Check color={COLORS.green500} size={48} />
      </View>
      <Text style={styles.testFinishedTitle}>Test Completed!</Text>
      <TouchableOpacity 
         style={styles.retakeBtn} 
         onPress={() => { setIsFinished(false); setCurrentQ(0); setSelectedOpt(null); }}
      >
        <Text style={styles.retakeBtnText}>Retake Test</Text>
      </TouchableOpacity>
    </View>
  );

  if (questions.length === 0) {
    return (
      <View style={[styles.tabContainer, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: COLORS.gray500 }}>No mock tests available currently.</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      <View style={styles.testHeader}>
        <View style={styles.cardHeaderFlex}>
          <Text style={styles.pageTitle}>Mock Test 1</Text>
          <View style={styles.timerPill}><Text style={styles.timerText}>58:32</Text></View>
        </View>
        <Text style={styles.pageSubtitle}>Question {currentQ + 1} of {questions.length}</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{questions[currentQ].q}</Text>
          <View style={{ marginTop: 24 }}>
            {questions[currentQ].opts.map((opt, i) => {
              const active = selectedOpt === i;
              return (
                <TouchableOpacity 
                   key={i} 
                   style={[styles.answerOption, active && styles.answerOptionActive]}
                   onPress={() => setSelectedOpt(i)}
                >
                  <View style={[styles.answerOptionLetter, active && styles.answerOptionLetterActive]}>
                    <Text style={[styles.answerOptionLetterText, active && styles.answerOptionLetterTextActive]}>{String.fromCharCode(65 + i)}</Text>
                  </View>
                  <Text style={[styles.answerOptionText, active && styles.answerOptionTextActive]}>{opt}</Text>
                  {active && <CheckCircle2 color={COLORS.blue500} size={20} />}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.testFooter}>
        <TouchableOpacity disabled={currentQ === 0} onPress={() => setCurrentQ(c => c - 1)} style={[styles.testNavBtn, currentQ === 0 ? styles.testNavBtnDisabled : styles.testNavBtnPrev]}>
          <Text style={[styles.testNavBtnText, currentQ === 0 ? styles.testNavBtnTextDisabled : styles.testNavBtnPrevText]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={selectedOpt === null} onPress={handleNext} style={[styles.testNavBtn, selectedOpt === null ? styles.testNavBtnDisabled : styles.testNavBtnNext]}>
          <Text style={[styles.testNavBtnText, selectedOpt === null ? styles.testNavBtnTextDisabled : styles.testNavBtnNextText]}>{currentQ === questions.length - 1 ? 'Finish' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function AIChatTab({ currentUser }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      AsyncStorage.getItem(`chat_${currentUser.id}`).then(res => {
        if (res) setChatMessages(JSON.parse(res));
      });
    }
  }, [currentUser]);

  const saveChat = async (newMsgs) => {
    setChatMessages(newMsgs);
    if (currentUser) {
      await AsyncStorage.setItem(`chat_${currentUser.id}`, JSON.stringify(newMsgs));
    }
  };

  const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; // Replace with your actual Gemini API Key

  const handleSend = async () => {
    if (!input.trim() && !attachedFile) return;
    
    let textToSend = input.trim();
    if (attachedFile) {
      textToSend = `[Attached ${attachedFile.type}: ${attachedFile.name}]\n${textToSend}`;
    }
    
    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    const updated = [...chatMessages, userMsg];
    saveChat(updated);
    setInput('');
    setAttachedFile(null);
    setIsTyping(true);

    if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      setTimeout(() => {
        saveChat([...updated, { id: Date.now() + 1, sender: 'ai', text: "I see your message! Please add your GEMINI_API_KEY in the source code to let me analyze files or talk to you." }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: textToSend }] }]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        saveChat([...updated, { id: Date.now() + 1, sender: 'ai', text: `API Error: ${data.error.message}` }]);
      } else {
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not generate a response.";
        saveChat([...updated, { id: Date.now() + 1, sender: 'ai', text: aiText }]);
      }
    } catch (error) {
      saveChat([...updated, { id: Date.now() + 1, sender: 'ai', text: "Network error connecting to the AI." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAttach = () => {
    setAttachedFile({ name: 'document.pdf', type: 'PDF' });
  };

  return (
    <KeyboardAvoidingView style={styles.tabContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.testHeader, { borderBottomWidth: 1, borderColor: COLORS.gray100, paddingBottom: 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.aiAvatar}><Text style={styles.aiAvatarText}>AI</Text></View>
          <Text style={[styles.pageTitle, { marginBottom: 0 }]}>AI Assistant</Text>
        </View>
      </View>

      <ScrollView 
         style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 16 }} 
         contentContainerStyle={{ paddingBottom: 24, flexGrow: 1, justifyContent: chatMessages.length === 0 ? 'center' : 'flex-start' }}
         ref={scrollViewRef}
         onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {chatMessages.length === 0 ? (
          <View style={{ alignItems: 'center' }}>
            <BrainCircuit color={COLORS.gray300} size={64} style={{ marginBottom: 16 }} />
            <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.gray400 }}>No messages yet</Text>
            <Text style={{ fontSize: 14, color: COLORS.gray400, marginTop: 4 }}>Ask me anything or attach files below.</Text>
          </View>
        ) : (
          chatMessages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <View key={msg.id} style={[styles.msgRow, isUser ? styles.msgUser : styles.msgAi]}>
                <View style={[styles.msgBubble, isUser ? styles.msgBubbleUser : styles.msgBubbleAi]}>
                  <Text style={[styles.msgText, isUser ? styles.msgTextUser : styles.msgTextAi]}>{msg.text}</Text>
                </View>
              </View>
            );
          })
        )}
        {isTyping && (
          <View style={[styles.msgRow, styles.msgAi]}>
            <View style={[styles.msgBubble, styles.msgBubbleAi]}>
              <Text style={[styles.msgText, styles.msgTextAi, { fontStyle: 'italic', color: COLORS.gray500 }]}>AI is typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.chatFooter}>
        {attachedFile && (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.blue50, padding: 8, borderRadius: 8, marginBottom: 8, alignSelf: 'flex-start' }}>
            <FileText size={16} color={COLORS.blue600} />
            <Text style={{ fontSize: 12, color: COLORS.blue600, marginLeft: 8, marginRight: 16 }}>{attachedFile.name}</Text>
            <TouchableOpacity onPress={() => setAttachedFile(null)}>
              <X size={16} color={COLORS.gray500} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.chatInputWrapper}>
          <TouchableOpacity onPress={handleAttach} style={{ padding: 8, marginRight: 4 }}>
            <Paperclip color={COLORS.gray500} size={20} />
          </TouchableOpacity>
          <TextInput 
             style={styles.chatInput} 
             value={input} 
             onChangeText={setInput} 
             placeholder="Message AI..." 
             placeholderTextColor={COLORS.gray400} 
             onSubmitEditing={handleSend}
          />
          <TouchableOpacity onPress={handleSend} style={[styles.chatSendBtn, { backgroundColor: input.trim() || attachedFile ? COLORS.blue500 : COLORS.gray300 }]} disabled={!input.trim() && !attachedFile}>
            <Send color="#FFF" size={16} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export function ProfileTab({ onLogout, currentUser }) {
  return (
    <ScrollView style={styles.tabContainer} contentContainerStyle={styles.p6}>
      <View style={styles.profileHeaderCard}>
        <View style={[styles.profileImg, { backgroundColor: COLORS.blue500, alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ color: '#FFF', fontSize: 32, fontWeight: '700' }}>{currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'S'}</Text>
        </View>
        <View>
          <Text style={styles.pageTitle}>{currentUser?.fullName || 'Student'}</Text>
          <Text style={styles.pageSubtitle}>Reg: {currentUser?.registerNumber || 'N/A'}</Text>
        </View>
      </View>
      <Text style={[styles.cardTitle, { marginBottom: 16 }]}>Performance Overview</Text>
      <View style={styles.cardSecondary}>
        <View style={styles.cardHeaderFlex}>
           <Text style={styles.progressLabel}>Overall Score:</Text>
           <Text style={styles.scoreText}>0%</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
         <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export function StudentUploadNotesScreen({ navigation, currentUser }) {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    if (currentUser) {
      AsyncStorage.getItem(`uploads_${currentUser.id}`).then(res => {
        if (res) setUploads(JSON.parse(res));
      });
    }
  }, [currentUser]);

  const saveFiles = async (newUploads) => {
    setUploads(newUploads);
    if (currentUser) {
      await AsyncStorage.setItem(`uploads_${currentUser.id}`, JSON.stringify(newUploads));
    }
  };

  const uploadSimulatedFile = () => {
    const newFile = {
      id: Date.now().toString(),
      title: 'Uploaded_Notes_' + Math.floor(Math.random() * 1000) + '.pdf',
      size: (Math.random() * 3 + 1).toFixed(1) + ' MB',
      date: 'Just now',
      iconBg: COLORS.blue100,
      iconColor: COLORS.blue500
    };
    saveFiles([newFile, ...uploads]);
  };

  const deleteFile = (id) => {
    saveFiles(uploads.filter(u => u.id !== id));
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={COLORS.gray900} size={24} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Upload Notes</Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 24 }}>
        <TouchableOpacity style={styles.uploadArea} onPress={uploadSimulatedFile}>
          <UploadCloud color={COLORS.blue500} size={40} style={{ marginBottom: 12 }} />
          <Text style={styles.uploadAreaTitle}>Tap to browse or drag file</Text>
          <Text style={styles.uploadAreaSub}>PDF, DOCX, Images (Max 10MB)</Text>
        </TouchableOpacity>

        <Text style={[styles.cardTitle, { marginBottom: 16 }]}>My Uploads</Text>
        {uploads.length === 0 ? (
          <Text style={{ color: COLORS.gray500, fontStyle: 'italic' }}>No uploads yet.</Text>
        ) : (
          uploads.map(file => (
            <View key={file.id} style={styles.uploadItem}>
               <View style={[styles.uploadIconWrap, { backgroundColor: file.iconBg }]}>
                 <FileText color={file.iconColor} size={24} />
               </View>
               <View style={{ flex: 1 }}>
                 <Text style={styles.uploadItemTitle}>{file.title}</Text>
                 <Text style={styles.uploadItemSub}>{file.size} • {file.date}</Text>
               </View>
               <TouchableOpacity onPress={() => deleteFile(file.id)} style={{ padding: 8 }}>
                 <Trash2 color={COLORS.gray400} size={20} />
               </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

export function StudentWatchVideosScreen({ navigation }) {
  const videos = [];

  return (
    <View style={[styles.screenContainer, { backgroundColor: COLORS.gray50 }]}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={COLORS.gray900} size={24} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Watch Videos</Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {videos.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: COLORS.gray500, fontStyle: 'italic' }}>No videos available.</Text>
          </View>
        ) : (
          videos.map(v => (
            <TouchableOpacity key={v.id} style={styles.videoCard}>
              <LinearGradient colors={v.colors} style={styles.videoThumb}>
                <View style={styles.videoPlayBtn}>
                  <PlayCircle color={COLORS.blue500} size={28} />
                </View>
                <View style={styles.videoDurationWrap}>
                  <Text style={styles.videoDurationText}>{v.duration}</Text>
                </View>
              </LinearGradient>
              <View style={{ padding: 16 }}>
                <Text style={styles.videoTitle}>{v.title}</Text>
                <Text style={styles.videoSubTitle}>AI Prep Channel • 1.2k views</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Student Styles
const styles = StyleSheet.create({
  tabContainer: { flex: 1, backgroundColor: COLORS.transparent },
  screenContainer: { flex: 1, backgroundColor: '#FFF' },
  p6: { padding: 24, paddingVertical: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  aiPrepLabel: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  aiPrepText: { color: COLORS.blue600, fontWeight: '500' },
  greeting: { fontSize: 28, fontWeight: '700', color: COLORS.gray900 },
  profilePicWrapper: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: '#FFF', elevation: 2 },
  profilePic: { width: '100%', height: '100%' },
  cardMain: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginBottom: 24, elevation: 3, overflow: 'hidden' },
  blurCircle: { position: 'absolute', right: -24, top: -24, width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.cyan500, opacity: 0.1 },
  examTitle: { fontSize: 18, fontWeight: '600', color: COLORS.gray800 },
  examDaysRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 16, marginBottom: 24 },
  examDaysNum: { fontSize: 56, fontWeight: '700', color: COLORS.gray900, lineHeight: 60 },
  examDaysLabel: { fontSize: 18, color: COLORS.gray500, fontWeight: '500', marginBottom: 8, marginLeft: 8 },
  progressContainer: {},
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 14, color: COLORS.gray500, fontWeight: '500' },
  progressBarBg: { height: 8, backgroundColor: COLORS.gray100, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  cardSecondary: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, elevation: 3 },
  cardHeaderFlex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: COLORS.gray900 },
  addBtnContainer: { padding: 4, backgroundColor: COLORS.blue50, borderRadius: 16 },
  tasksList: { marginBottom: 24 },
  emptyText: { color: COLORS.gray400, fontStyle: 'italic', fontSize: 14 },
  taskItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  taskCheckbox: { marginRight: 12 },
  taskTitle: { flex: 1, fontSize: 16, color: COLORS.gray700, fontWeight: '500' },
  taskTitleDone: { color: COLORS.gray400, textDecorationLine: 'line-through' },
  taskActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 4 },
  progressSmallContainer: { flexDirection: 'row', alignItems: 'center' },
  progressLabelSmall: { fontSize: 14, fontWeight: '500', color: COLORS.gray500, marginRight: 12 },
  progressBarSmallBg: { flex: 1, height: 8, backgroundColor: COLORS.gray100, borderRadius: 4, overflow: 'hidden' },
  progressBarSmallFill: { height: '100%', backgroundColor: COLORS.blue400, borderRadius: 4 },
  progressValSmall: { fontSize: 14, fontWeight: '700', color: COLORS.gray700, marginLeft: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.gray900, marginBottom: 16, marginLeft: 4 },
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  quickActionGroup: { alignItems: 'center', width: '23%', marginBottom: 16 },
  quickActionBtn: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  quickActionLabel: { fontSize: 11, fontWeight: '600', color: COLORS.gray600, textAlign: 'center', marginTop: 8 },
  largeActionCard: { marginBottom: 16, borderRadius: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  largeActionGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderRadius: 24 },
  largeActionContent: { flex: 1, marginRight: 16 },
  largeActionTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  largeActionSub: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.8)' },
  pageTitle: { fontSize: 24, fontWeight: '700', color: COLORS.gray900, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: COLORS.gray500, marginBottom: 24 },
  datesRow: { flexDirection: 'row', marginBottom: 32 },
  dateCard: { paddingVertical: 12, width: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  dateCardActive: { backgroundColor: '#FFF', elevation: 2, borderWidth: 1, borderColor: COLORS.gray100 },
  dateDay: { fontSize: 14, color: COLORS.gray500 },
  dateDayActive: { fontWeight: '500', color: COLORS.gray900 },
  dateNum: { fontSize: 20, marginTop: 4, color: COLORS.gray500 },
  dateNumActive: { fontWeight: '700', color: COLORS.gray900 },
  addBtnPill: { backgroundColor: COLORS.blue50, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  addBtnPillText: { color: COLORS.blue500, fontWeight: '500', fontSize: 14 },
  taskCardBox: { backgroundColor: '#FFF', padding: 16, borderRadius: 20, elevation: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderWidth: 1, borderColor: COLORS.gray50 },
  taskCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  taskCardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.gray800 },
  taskCardStatus: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  taskCardStatusText: { fontSize: 12, color: COLORS.gray500 },
  upcomingIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.blue50, alignItems: 'center', justifyContent: 'center' },
  testHeader: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  timerPill: { backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: COLORS.gray100, elevation: 1 },
  timerText: { fontSize: 14, fontWeight: '700', color: COLORS.gray900 },
  questionCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, elevation: 1, borderWidth: 1, borderColor: COLORS.gray50, minHeight: 300 },
  questionText: { fontSize: 20, fontWeight: '600', color: COLORS.gray800 },
  answerOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: COLORS.gray100, backgroundColor: '#FFF', marginBottom: 12 },
  answerOptionActive: { borderColor: COLORS.blue500, backgroundColor: COLORS.blue50 },
  answerOptionLetter: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  answerOptionLetterActive: { backgroundColor: COLORS.blue500 },
  answerOptionLetterText: { fontSize: 14, fontWeight: '700', color: COLORS.gray800 },
  answerOptionLetterTextActive: { color: '#FFF' },
  answerOptionText: { flex: 1, fontSize: 16, fontWeight: '500', color: COLORS.gray800 },
  answerOptionTextActive: { color: COLORS.blue700 },
  testFooter: { padding: 24, flexDirection: 'row', justifyContent: 'space-between' },
  testNavBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  testNavBtnPrev: { backgroundColor: '#FFF', borderWidth: 1, borderColor: COLORS.gray100, elevation: 1 },
  testNavBtnNext: { backgroundColor: COLORS.blue500, elevation: 2 },
  testNavBtnDisabled: { backgroundColor: COLORS.gray200 },
  testNavBtnText: { fontSize: 16, fontWeight: '700' },
  testNavBtnPrevText: { color: COLORS.blue500 },
  testNavBtnNextText: { color: '#FFF' },
  testNavBtnTextDisabled: { color: COLORS.gray400 },
  testFinishedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  testFinishedIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.green100, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  testFinishedTitle: { fontSize: 24, fontWeight: '700', color: COLORS.gray900, marginBottom: 32 },
  retakeBtn: { paddingHorizontal: 32, paddingVertical: 12, backgroundColor: COLORS.blue500, borderRadius: 12, elevation: 2 },
  retakeBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  aiAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 1, marginRight: 12 },
  aiAvatarText: { color: COLORS.blue500, fontWeight: '700' },
  msgRow: { flexDirection: 'row', marginBottom: 16 },
  msgUser: { justifyContent: 'flex-end' },
  msgAi: { justifyContent: 'flex-start' },
  msgBubble: { maxWidth: '80%', padding: 16, borderRadius: 16 },
  msgBubbleUser: { backgroundColor: COLORS.blue500, borderBottomRightRadius: 4 },
  msgBubbleAi: { backgroundColor: '#FFF', borderBottomLeftRadius: 4, elevation: 1 },
  msgText: { fontSize: 14 },
  msgTextUser: { color: '#FFF' },
  msgTextAi: { color: COLORS.gray800 },
  chatFooter: { padding: 16, backgroundColor: COLORS.gray50, borderTopWidth: 1, borderColor: COLORS.gray200 },
  chatInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 8, borderRadius: 24, borderWidth: 1, borderColor: COLORS.gray200 },
  chatInput: { flex: 1, paddingHorizontal: 16, fontSize: 14, color: COLORS.gray700 },
  chatSendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.blue500, alignItems: 'center', justifyContent: 'center' },
  profileHeaderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 24, elevation: 1, marginBottom: 32 },
  profileImg: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: COLORS.cyan400, marginRight: 16 },
  scoreText: { fontSize: 32, fontWeight: '700', color: COLORS.gray900 },
  logoutBtn: { width: '100%', marginTop: 32, paddingVertical: 16, backgroundColor: COLORS.red50, borderRadius: 16, borderWidth: 1, borderColor: COLORS.red100, alignItems: 'center' },
  logoutBtnText: { color: COLORS.red500, fontSize: 16, fontWeight: '700' },
  screenHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 40, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: COLORS.gray100 },
  backBtn: { marginRight: 16, padding: 8, borderRadius: 20 },
  uploadArea: { borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.blue400, borderRadius: 24, padding: 32, alignItems: 'center', backgroundColor: '#EFF6FF', marginBottom: 32 },
  uploadAreaTitle: { fontSize: 16, fontWeight: '600', color: COLORS.gray900, marginBottom: 4 },
  uploadAreaSub: { fontSize: 12, color: COLORS.gray500 },
  uploadItem: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, elevation: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: COLORS.gray100 },
  uploadIconWrap: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  uploadItemTitle: { fontSize: 14, fontWeight: '600', color: COLORS.gray800 },
  uploadItemSub: { fontSize: 12, color: COLORS.gray500, marginTop: 2 },
  videoCard: { backgroundColor: '#FFF', borderRadius: 24, elevation: 1, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.gray100 },
  videoThumb: { height: 160, width: '100%', alignItems: 'center', justifyContent: 'center' },
  videoPlayBtn: { width: 56, height: 56, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  videoDurationWrap: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  videoDurationText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  videoTitle: { fontSize: 16, fontWeight: '700', color: COLORS.gray900 },
  videoSubTitle: { fontSize: 12, fontWeight: '500', color: COLORS.gray500, marginTop: 6 },
});
