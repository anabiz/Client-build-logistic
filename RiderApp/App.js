import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput, BackHandler, KeyboardAvoidingView, Platform, Image, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showItemDetailModal, setShowItemDetailModal] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [podPhoto, setPodPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sound, setSound] = useState();
  const [isRinging, setIsRinging] = useState(false);

  // Configure notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    const backAction = () => {
      if (activeTab === 'delivery-detail') {
        setActiveTab('deliveries');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [activeTab]);

  const playRingtone = async () => {
    try {
      setIsRinging(true);
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
        { shouldPlay: true, isLooping: true }
      );
      setSound(sound);
      
      // Vibrate in pattern
      Vibration.vibrate([1000, 1000, 1000, 1000], true);
      
      // Stop after 30 seconds
      setTimeout(() => {
        stopRingtone();
      }, 30000);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const stopRingtone = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(undefined);
    }
    Vibration.cancel();
    setIsRinging(false);
  };

  const triggerDeliveryNotification = async (delivery) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚚 New Delivery Assignment!',
        body: `Item ${delivery.item} for ${delivery.customer}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });
    
    playRingtone();
    
    Alert.alert(
      '📞 New Delivery Assignment',
      `Item: ${delivery.item}\nCustomer: ${delivery.customer}\nAddress: ${delivery.address}`,
      [
        { text: 'Dismiss', onPress: stopRingtone },
        { text: 'View Details', onPress: () => { stopRingtone(); startDelivery(delivery); } }
      ],
      { cancelable: false }
    );
  };

  const showItemDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setShowItemDetailModal(true);
  };

  const startDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setRecipientName(delivery.customer);
    setActiveTab('delivery-detail');
  };

  const takePODPhoto = async () => {
    try {
      // Check if we're in a supported environment
      if (Platform.OS === 'web') {
        // Web environment - use simulation
        Alert.alert('Camera Simulation', 'Camera not available on web. Using simulation.');
        setPodPhoto('photo_captured_' + Date.now());
        return;
      }

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPodPhoto(result.assets[0].uri);
        Alert.alert('Photo Captured', 'POD photo has been saved successfully!');
      }
    } catch (error) {
      // Fallback to simulation if camera fails
      Alert.alert('Camera Error', 'Camera not available. Using simulation.');
      setPodPhoto('photo_captured_' + Date.now());
    }
  };

  const confirmDelivery = () => {
    if (!podPhoto) {
      Alert.alert('Photo Required', 'Please take a POD photo before confirming delivery');
      return;
    }
    Alert.alert('Delivery Confirmed', 'Delivery has been marked as completed!', [
      { text: 'OK', onPress: () => {
        setSelectedDelivery(null);
        setPodPhoto(null);
        setRecipientName('');
        setDeliveryNotes('');
        setActiveTab('deliveries');
      }}
    ]);
  };

  const theme = {
    dark: {
      container: '#111b21',
      card: '#1f2937',
      text: 'white',
      textSecondary: '#9ca3af',
      textTertiary: '#d1d5db',
      tabBar: '#1f2937',
      border: '#374151',
      progressBg: '#374151'
    },
    light: {
      container: '#f8fafc',
      card: 'white',
      text: '#1f2937',
      textSecondary: '#6b7280',
      textTertiary: '#4b5563',
      tabBar: 'white',
      border: '#d1d5db',
      progressBg: '#f1f5f9'
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const cardBorderColor = isDarkMode ? 'transparent' : currentTheme.border;

  const deliveries = [
    { id: '1', item: 'CB-2024-000001', customer: 'Adebayo Johnson', address: '15 Admiralty Way, Lekki', status: 'dispatched', qrCode: 'QR001234567' },
    { id: '2', item: 'CB-2024-000002', customer: 'Fatima Abdullahi', address: '42 Wuse II District, Abuja', status: 'in-transit', qrCode: 'QR001234568' },
    { id: '3', item: 'CB-2024-000003', customer: 'Chukwudi Okafor', address: '8 New Haven, Enugu', status: 'delivered', qrCode: 'QR001234569' },
  ];

  const historyData = [
    { id: '1', item: 'CB-2024-000001', customer: 'Adebayo Johnson', address: '15 Admiralty Way, Lekki', status: 'delivered', date: '2024-01-15', time: '2:30 PM', rating: 5 },
    { id: '2', item: 'CB-2024-000002', customer: 'Fatima Abdullahi', address: '42 Wuse II District, Abuja', status: 'delivered', date: '2024-01-14', time: '11:45 AM', rating: 4 },
    { id: '3', item: 'CB-2024-000003', customer: 'Chukwudi Okafor', address: '8 New Haven, Enugu', status: 'delivered', date: '2024-01-13', time: '4:20 PM', rating: 5 },
    { id: '4', item: 'CB-2024-000004', customer: 'Aisha Mohammed', address: '23 Garki Area, Abuja', status: 'delivered', date: '2024-01-12', time: '9:15 AM', rating: 3 },
    { id: '5', item: 'CB-2024-000005', customer: 'Emeka Nwankwo', address: '67 Victoria Island, Lagos', status: 'delivered', date: '2024-01-11', time: '1:00 PM', rating: 5 },
    { id: '6', item: 'CB-2024-000006', customer: 'Kemi Adebayo', address: '12 Ring Road, Ibadan', status: 'cancelled', date: '2024-01-10', time: '3:45 PM', rating: 0 },
  ];

  const renderDashboard = () => (
    <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Ionicons name="car" size={20} color="#F35C7A" style={{ marginBottom: 6 }} />
          <Text style={[styles.statNumber, { color: currentTheme.text }]}>8</Text>
          <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Today's Deliveries</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Ionicons name="time" size={20} color="#d97706" style={{ marginBottom: 6 }} />
          <Text style={[styles.statNumber, { color: '#d97706' }]}>3</Text>
          <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Pending</Text>
        </View>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Ionicons name="star" size={20} color="#F35C7A" style={{ marginBottom: 6 }} />
          <Text style={[styles.statNumber, { color: currentTheme.text }]}>4.8</Text>
          <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Current Rating</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Ionicons name="trophy" size={20} color="#059669" style={{ marginBottom: 6 }} />
          <Text style={[styles.statNumber, { color: '#059669' }]}>96%</Text>
          <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>SLA Score</Text>
        </View>
      </View>
      
      <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>📈 Performance Overview</Text>
        <View style={styles.performanceRow}>
          <Text style={[styles.performanceLabel, { color: currentTheme.textSecondary }]}>SLA Compliance</Text>
          <Text style={[styles.performanceValue, { color: '#F35C7A' }]}>96.5%</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: currentTheme.progressBg }]}>
          <View style={[styles.progressFill, { width: '96.5%' }]} />
        </View>
        
        <View style={styles.deliveryStats}>
          <View style={styles.deliveryStat}>
            <Text style={[styles.deliveryLabel, { color: currentTheme.textSecondary }]}>On-Time</Text>
            <Text style={[styles.deliveryNumber, { color: '#059669' }]}>330</Text>
          </View>
          <View style={styles.deliveryStat}>
            <Text style={[styles.deliveryLabel, { color: currentTheme.textSecondary }]}>Late</Text>
            <Text style={[styles.deliveryNumber, { color: '#dc2626' }]}>12</Text>
          </View>
          <View style={styles.deliveryStat}>
            <Text style={[styles.deliveryLabel, { color: currentTheme.textSecondary }]}>Avg Time</Text>
            <Text style={[styles.deliveryNumber, { color: currentTheme.text }]}>2.1d</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>📅 Quick Stats</Text>
        <View style={styles.deliveryStats}>
          <View style={styles.deliveryStat}>
            <Text style={[styles.deliveryLabel, { color: currentTheme.textSecondary }]}>This Week</Text>
            <Text style={[styles.deliveryNumber, { color: currentTheme.text }]}>45</Text>
          </View>
          <View style={styles.deliveryStat}>
            <Text style={[styles.deliveryLabel, { color: currentTheme.textSecondary }]}>This Month</Text>
            <Text style={[styles.deliveryNumber, { color: currentTheme.text }]}>187</Text>
          </View>
          <View style={styles.deliveryStat}>
            <Text style={[styles.deliveryLabel, { color: currentTheme.textSecondary }]}>Total</Text>
            <Text style={[styles.deliveryNumber, { color: currentTheme.text }]}>342</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderDeliveries = () => (
    <View style={styles.content}>
      <View style={[styles.deliverySummary, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={[styles.summaryTitle, { color: currentTheme.text }]}><Ionicons name="cube" size={16} color="#F35C7A" /> Today's Deliveries</Text>
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={() => setActiveTab('history')}
          >
            <Ionicons name="clipboard" size={12} color="white" style={{ marginRight: 3 }} />
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: currentTheme.text }]}>5</Text>
            <Text style={[styles.summaryLabel, { color: currentTheme.textSecondary }]}>Pending</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: currentTheme.text }]}>3</Text>
            <Text style={[styles.summaryLabel, { color: currentTheme.textSecondary }]}>In Transit</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: currentTheme.text }]}>12</Text>
            <Text style={[styles.summaryLabel, { color: currentTheme.textSecondary }]}>Completed</Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {deliveries.map(delivery => (
          <View key={delivery.id} style={[styles.deliveryCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
            <TouchableOpacity onPress={() => startDelivery(delivery)}>
          <View style={styles.deliveryHeader}>
            <View style={styles.deliveryInfo}>
              <Text style={[styles.itemNumber, { color: currentTheme.text }]}><Ionicons name="cube" size={14} color="#F35C7A" /> {delivery.item}</Text>
              <Text style={[styles.customerName, { color: currentTheme.textSecondary }]}><Ionicons name="person" size={14} color="#6b7280" /> {delivery.customer}</Text>
            </View>
            <View style={[styles.statusBadge, 
              delivery.status === 'delivered' ? styles.delivered : 
              delivery.status === 'in-transit' ? styles.pickedUp : styles.assigned
            ]}>
              <Text style={styles.statusText}>
                {delivery.status === 'delivered' ? '✅ DELIVERED' :
                 delivery.status === 'in-transit' ? '🚚 IN TRANSIT' : '📋 DISPATCHED'}
              </Text>
            </View>
          </View>
          
          <View style={styles.addressRow}>
            <Ionicons name="location" size={14} color="#dc2626" />
            <Text style={[styles.address, { color: currentTheme.textTertiary }]}>{delivery.address}</Text>
          </View>
          
          <View style={styles.deliveryMeta}>
            <Text style={[styles.metaText, { color: currentTheme.textSecondary }]}><Ionicons name="qr-code" size={12} color="#059669" /> QR: {delivery.qrCode}</Text>
            <Text style={[styles.metaText, { color: currentTheme.textSecondary }]}><Ionicons name="map" size={12} color="#d97706" /> 2.3 km away</Text>
          </View>
          
          {delivery.status !== 'delivered' && (
            <View style={styles.actionButtons}>
              {delivery.status === 'dispatched' && (
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#F35C7A' }]}
                  onPress={() => startDelivery(delivery)}
                >
                  <Text style={styles.actionButtonText}>🚀 Start Delivery</Text>
                </TouchableOpacity>
              )}
              {delivery.status === 'in-transit' && (
                <>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#F35C7A' }]}
                    onPress={() => startDelivery(delivery)}
                  >
                    <Text style={styles.actionButtonText}>🚀 Start Delivery</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          
          {delivery.status === 'delivered' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#F35C7A', opacity: 0.7 }]}
                onPress={() => startDelivery(delivery)}
              >
                <Text style={styles.actionButtonText}>📋 View Details</Text>
              </TouchableOpacity>
            </View>
          )}
          </TouchableOpacity>
        </View>
      ))}
      </ScrollView>
    </View>
  );

  const renderPerformance = () => (
    <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>🏆 Overall Performance</Text>
        <View style={styles.slaMetric}>
          <Text style={[styles.slaPercentage, { color: currentTheme.text }]}>96.5%</Text>
          <Text style={styles.slaStatus}>EXCELLENT</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: currentTheme.progressBg }]}>
          <View style={[styles.progressFill, { width: '96.5%' }]} />
        </View>
        <Text style={[styles.ratingSubtext, { color: currentTheme.textSecondary, textAlign: 'center' }]}>SLA Compliance Rate</Text>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={[styles.statNumber, { color: '#059669' }]}>330</Text>
          <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>On-Time Deliveries</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Text style={styles.statIcon}>⏰</Text>
          <Text style={[styles.statNumber, { color: '#dc2626' }]}>12</Text>
          <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Late Deliveries</Text>
        </View>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={[styles.statNumber, { color: '#F35C7A' }]}>4.8</Text>
          <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Average Rating</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Text style={styles.statIcon}>🚚</Text>
          <Text style={[styles.statNumber, { color: currentTheme.text }]}>2.1</Text>
          <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Avg Days</Text>
        </View>
      </View>
      
      <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>📈 Recent Performance</Text>
        <ScrollView style={{ maxHeight: 200 }} contentContainerStyle={{ paddingBottom: 30 }}>
        {[
          { date: '2024-01-15', item: 'CB-001', status: 'delivered', time: '1.8 days', rating: 5 },
          { date: '2024-01-14', item: 'CB-002', status: 'delivered', time: '2.1 days', rating: 4 },
          { date: '2024-01-13', item: 'CB-003', status: 'late', time: '3.2 days', rating: 3 },
          { date: '2024-01-12', item: 'CB-004', status: 'delivered', time: '1.5 days', rating: 5 },
          { date: '2024-01-11', item: 'CB-005', status: 'delivered', time: '2.0 days', rating: 4 },
          { date: '2024-01-10', item: 'CB-006', status: 'late', time: '4.1 days', rating: 2 },
          { date: '2024-01-09', item: 'CB-007', status: 'delivered', time: '1.9 days', rating: 5 },
          { date: '2024-01-08', item: 'CB-008', status: 'delivered', time: '2.3 days', rating: 4 },
        ].map((delivery, index) => (
          <View key={index} style={[styles.historyItem, { borderBottomColor: currentTheme.border }]}>
            <View style={styles.historyInfo}>
              <Text style={[styles.historyDate, { color: currentTheme.text }]}>{delivery.item}</Text>
              <Text style={[styles.historyTime, { color: currentTheme.textSecondary }]}>{delivery.date}</Text>
            </View>
            <View style={styles.historyMetrics}>
              <Text style={[styles.historyTime, { color: currentTheme.textSecondary }]}>{delivery.time}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={[styles.historyTime, { color: '#F35C7A' }]}>⭐ {delivery.rating}</Text>
                <View style={[styles.historyBadge, 
                  delivery.status === 'delivered' ? styles.delivered : styles.late
                ]}>
                  <Text style={styles.statusText}>{delivery.status === 'delivered' ? 'ON TIME' : 'LATE'}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
        </ScrollView>
      </View>
    </ScrollView>
  );

  const renderHistory = () => {
    const filteredHistory = historyData.filter(item => {
      const matchesSearch = item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return (
      <View style={activeTab === 'history' ? styles.contentNoTabs : styles.content}>
        <View style={[styles.card, { backgroundColor: currentTheme.card, borderWidth: 0 }]}>
          <TouchableOpacity onPress={() => setActiveTab('deliveries')} style={styles.backButton}>
            <View style={styles.backButtonContent}>
              <Ionicons name="arrow-back" size={16} color="#F35C7A" style={{ marginRight: 6 }} />
              <Text style={styles.backButtonText}>Back to Deliveries</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { backgroundColor: currentTheme.container, color: currentTheme.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search deliveries..."
              placeholderTextColor={currentTheme.textSecondary}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {['all', 'delivered', 'cancelled'].map(status => (
              <TouchableOpacity
                key={status}
                style={[styles.filterButton, 
                  { backgroundColor: statusFilter === status ? '#F35C7A' : currentTheme.border }
                ]}
                onPress={() => setStatusFilter(status)}
              >
                <Text style={[styles.filterText, 
                  { color: statusFilter === status ? 'white' : currentTheme.textSecondary }
                ]}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }}>
          {filteredHistory.map(delivery => (
            <TouchableOpacity key={delivery.id} onPress={() => showItemDetails(delivery)}>
            <View style={[styles.deliveryCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
              <View style={styles.deliveryHeader}>
                <View style={styles.deliveryInfo}>
                  <Text style={[styles.itemNumber, { color: currentTheme.text }]}>📦 {delivery.item}</Text>
                  <Text style={[styles.customerName, { color: currentTheme.textSecondary }]}>👤 {delivery.customer}</Text>
                </View>
                <View style={[styles.statusBadge, 
                  delivery.status === 'delivered' ? styles.delivered : styles.late
                ]}>
                  <Text style={styles.statusText}>
                    {delivery.status === 'delivered' ? '✅ DELIVERED' : '❌ CANCELLED'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.addressRow}>
                <Text style={styles.addressIcon}>📍</Text>
                <Text style={[styles.address, { color: currentTheme.textTertiary }]}>{delivery.address}</Text>
              </View>
              
              <View style={styles.deliveryMeta}>
                <Text style={[styles.metaText, { color: currentTheme.textSecondary }]}>📅 {delivery.date} at {delivery.time}</Text>
                {delivery.rating > 0 && (
                  <Text style={[styles.metaText, { color: currentTheme.textSecondary }]}>⭐ {delivery.rating}/5</Text>
                )}
              </View>
            </View>
            </TouchableOpacity>
          ))}
          {filteredHistory.length === 0 && (
            <View style={[styles.card, { backgroundColor: currentTheme.card, alignItems: 'center', padding: 40 }]}>
              <Text style={[styles.cardTitle, { color: currentTheme.textSecondary }]}>No deliveries found</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderProfile = () => (
    <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={[styles.profileCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>TB</Text>
        </View>
        <Text style={[styles.profileName, { color: currentTheme.text }]}>Tunde Bakare</Text>
        <Text style={[styles.profileId, { color: currentTheme.textSecondary }]}>ID: R001</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingNumber}>4.8</Text>
          <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
        </View>
      </View>
      
      <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📧</Text>
          <Text style={[styles.infoText, { color: currentTheme.textTertiary }]}>tunde.bakare@clientbuild.ng</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📱</Text>
          <Text style={[styles.infoText, { color: currentTheme.textTertiary }]}>+234 803 123 4567</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🚗</Text>
          <Text style={[styles.infoText, { color: currentTheme.textTertiary }]}>LAG-456-XY</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={[styles.infoText, { color: currentTheme.textTertiary }]}>Lagos</Text>
        </View>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Text style={[styles.statNumber, { color: currentTheme.text }]}>342</Text>
          <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Total Deliveries</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Text style={[styles.statNumber, { color: currentTheme.text }]}>4.8</Text>
          <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Average Rating</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderDeliveryDetail = () => (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={'padding'}
    >
    <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
        <TouchableOpacity onPress={() => setActiveTab('deliveries')} style={styles.backButton}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={16} color="#F35C7A" style={{ marginRight: 6 }} />
            <Text style={{ color: '#F35C7A', fontSize: 16 }}>Back to Deliveries</Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>📦 {selectedDelivery?.item}</Text>
        <Text style={[styles.customerName, { color: currentTheme.textSecondary }]}>👤 {selectedDelivery?.customer}</Text>
        <Text style={[styles.address, { color: currentTheme.textTertiary }]}>📍 {selectedDelivery?.address}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>📷 POD Photo</Text>
        {selectedDelivery?.status === 'delivered' ? (
          <View style={{ alignItems: 'center' }}>
            <View style={styles.mockImageContainer}>
              <Text style={styles.mockImageText}>📷 POD Photo</Text>
              <Text style={[styles.mockImageSubtext, { color: currentTheme.textSecondary }]}>Captured on delivery</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: podPhoto ? '#F35C7A' : '#F35C7A' }]}
            onPress={takePODPhoto}
          >
            <Text style={styles.actionButtonText}>
              {podPhoto ? '✅ Photo Captured' : '📷 Take Photo'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedDelivery?.status === 'delivered' && (
        <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.text }]}>📦 Delivery Details</Text>
          <Text style={[styles.metaText, { color: currentTheme.textSecondary, marginBottom: 8 }]}>📅 Delivered: Jan 15, 2024 at 2:30 PM</Text>
          <Text style={[styles.metaText, { color: currentTheme.textSecondary, marginBottom: 8 }]}>👤 Received by: {selectedDelivery?.customer}</Text>
          <Text style={[styles.metaText, { color: currentTheme.textSecondary, marginBottom: 8 }]}>📷 POD Photo: Captured</Text>
          <Text style={[styles.metaText, { color: currentTheme.textSecondary }]}>📍 GPS: 6.5244, 3.3792</Text>
        </View>
      )}

      {selectedDelivery?.status !== 'delivered' && (
        <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: cardBorderColor }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.text }]}>📝 Delivery Information</Text>
          <Text style={[styles.inputLabel, { color: currentTheme.textSecondary }]}>Recipient Name</Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: currentTheme.container, color: currentTheme.text }]}
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder="Enter recipient name"
          />
          <Text style={[styles.inputLabel, { color: currentTheme.textSecondary }]}>Notes</Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: currentTheme.container, color: currentTheme.text, height: 80 }]}
            value={deliveryNotes}
            onChangeText={setDeliveryNotes}
            placeholder="Additional notes..."
            multiline
          />
        </View>
      )}

      {selectedDelivery?.status !== 'delivered' && (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#F35C7A', margin: 16 }]}
          onPress={confirmDelivery}
        >
          <Text style={styles.actionButtonText}>✅ Confirm Delivery</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.container }]}>
      <StatusBar style="light" />
      <View style={[styles.header, { backgroundColor: '#F35C7A' }]}>
        <View>
          <Text style={styles.title}>
            {activeTab === 'dashboard' ? 'Rider Dashboard' :
             activeTab === 'deliveries' ? 'My Deliveries' :
             activeTab === 'history' ? 'Delivery History' :
             activeTab === 'performance' ? 'Performance' : 'Profile'}
          </Text>
          <Text style={styles.subtitle}>
            {activeTab === 'dashboard' ? 'Welcome back, Tunde!' :
             activeTab === 'deliveries' ? 'Manage your assignments' :
             activeTab === 'history' ? 'View past deliveries' :
             activeTab === 'performance' ? 'Track your metrics' : 'Tunde Bakare'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'deliveries' && renderDeliveries()}
      {activeTab === 'history' && renderHistory()}
      {activeTab === 'performance' && renderPerformance()}
      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'delivery-detail' && renderDeliveryDetail()}
      
      {/* Test Notification Button */}
      <TouchableOpacity 
        style={styles.testNotificationButton}
        onPress={() => triggerDeliveryNotification(deliveries[0])}
      >
        <Text style={styles.testNotificationText}>📞 Test Notification</Text>
      </TouchableOpacity>
      
      {/* Item Detail Modal */}
      {showItemDetailModal && selectedDelivery && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme.card }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: currentTheme.text }]}>📦 Item Details</Text>
                <TouchableOpacity onPress={() => setShowItemDetailModal(false)}>
                  <Ionicons name="close" size={24} color={currentTheme.text} />
                </TouchableOpacity>
              </View>
              
              <View style={[styles.card, { backgroundColor: currentTheme.container, marginHorizontal: 0 }]}>
                <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Item Information</Text>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: currentTheme.textSecondary }]}>Item Number:</Text>
                  <Text style={[styles.detailValue, { color: currentTheme.text }]}>{selectedDelivery.item}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: currentTheme.textSecondary }]}>Customer:</Text>
                  <Text style={[styles.detailValue, { color: currentTheme.text }]}>{selectedDelivery.customer}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: currentTheme.textSecondary }]}>Status:</Text>
                  <View style={[styles.statusBadge, selectedDelivery.status === 'delivered' ? styles.delivered : styles.late]}>
                    <Text style={styles.statusText}>{selectedDelivery.status.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
              
              <View style={[styles.card, { backgroundColor: currentTheme.container, marginHorizontal: 0 }]}>
                <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Delivery Address</Text>
                <Text style={[styles.address, { color: currentTheme.textTertiary }]}>📍 {selectedDelivery.address}</Text>
              </View>
              
              {selectedDelivery.status === 'delivered' && (
                <View style={[styles.card, { backgroundColor: '#f0fdf4', marginHorizontal: 0 }]}>
                  <Text style={[styles.cardTitle, { color: '#166534' }]}>📷 Proof of Delivery (POD)</Text>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: '#166534' }]}>Delivered:</Text>
                    <Text style={[styles.detailValue, { color: '#166534' }]}>{selectedDelivery.date} at {selectedDelivery.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: '#166534' }]}>GPS Location:</Text>
                    <Text style={[styles.detailValue, { color: '#166534' }]}>6.5244, 3.3792</Text>
                  </View>
                  <View style={styles.podSection}>
                    <Text style={[styles.detailLabel, { color: '#166534' }]}>Photo Evidence:</Text>
                    <View style={styles.podPhotoContainer}>
                      <Text style={styles.podPhotoText}>📷</Text>
                      <Text style={[styles.podPhotoSubtext, { color: '#166534' }]}>POD Photo Available</Text>
                    </View>
                  </View>
                  <View style={styles.podSection}>
                    <Text style={[styles.detailLabel, { color: '#166534' }]}>Recipient Signature:</Text>
                    <View style={styles.podPhotoContainer}>
                      <Text style={styles.podPhotoText}>✍️</Text>
                      <Text style={[styles.podPhotoSubtext, { color: '#166534' }]}>Signature Captured</Text>
                    </View>
                  </View>
                  {selectedDelivery.rating > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: '#166534' }]}>Rating:</Text>
                      <Text style={[styles.detailValue, { color: '#166534' }]}>⭐ {selectedDelivery.rating}/5</Text>
                    </View>
                  )}
                </View>
              )}
              
              {selectedDelivery.status === 'cancelled' && (
                <View style={[styles.card, { backgroundColor: '#fef2f2', marginHorizontal: 0 }]}>
                  <Text style={[styles.cardTitle, { color: '#dc2626' }]}>❌ Delivery Cancelled</Text>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: '#dc2626' }]}>Reason:</Text>
                    <Text style={[styles.detailValue, { color: '#dc2626' }]}>Recipient not available</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: '#dc2626' }]}>Date:</Text>
                    <Text style={[styles.detailValue, { color: '#dc2626' }]}>{selectedDelivery.date} at {selectedDelivery.time}</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
      
      {activeTab !== 'delivery-detail' && activeTab !== 'history' && (
        <View style={[styles.tabBar, { backgroundColor: currentTheme.tabBar }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons name="bar-chart" size={16} color={activeTab === 'dashboard' ? '#F35C7A' : currentTheme.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText, { color: activeTab === 'dashboard' ? '#F35C7A' : currentTheme.textSecondary }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'deliveries' && styles.activeTab]}
          onPress={() => setActiveTab('deliveries')}
        >
          <Ionicons name="cube" size={16} color={activeTab === 'deliveries' ? '#F35C7A' : currentTheme.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'deliveries' && styles.activeTabText, { color: activeTab === 'deliveries' ? '#F35C7A' : currentTheme.textSecondary }]}>Deliveries</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'performance' && styles.activeTab]}
          onPress={() => setActiveTab('performance')}
        >
          <Ionicons name="trending-up" size={16} color={activeTab === 'performance' ? '#F35C7A' : currentTheme.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'performance' && styles.activeTabText, { color: activeTab === 'performance' ? '#F35C7A' : currentTheme.textSecondary }]}>Performance</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons name="person" size={16} color={activeTab === 'profile' ? '#F35C7A' : currentTheme.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText, { color: activeTab === 'profile' ? '#F35C7A' : currentTheme.textSecondary }]}>Profile</Text>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    fontSize: 24,
    padding: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingBottom: 120,
    paddingTop: 8,
  },
  contentNoTabs: {
    flex: 1,
    paddingBottom: 30,
    paddingTop: 8,
  },
  card: {
    marginHorizontal: 12,
    marginVertical: 3,
    padding: 12,
    borderRadius: 8,
    borderWidth: 0.2,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 0.5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceLabel: {
    fontSize: 14,
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F35C7A',
    borderRadius: 3,
  },
  deliveryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  deliveryStat: {
    alignItems: 'center',
  },
  deliveryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  deliveryNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F35C7A',
  },
  ratingStars: {
    fontSize: 16,
  },
  ratingSubtext: {
    fontSize: 12,
  },
  deliveryCard: {
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  deliverySummary: {
    marginHorizontal: 12,
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    flex: 1,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 1,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  deliveryInfo: {
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  addressIcon: {
    fontSize: 14,
  },
  deliveryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  customerName: {
    marginBottom: 4,
    fontSize: 14,
  },
  address: {
    marginBottom: 12,
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  assigned: {
    backgroundColor: '#6366f1',
  },
  pickedUp: {
    backgroundColor: '#f59e0b',
  },
  delivered: {
    backgroundColor: '#10b981',
  },
  late: {
    backgroundColor: '#dc2626',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  actionButtons: {
    marginTop: 12,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F35C7A',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  slaMetric: {
    alignItems: 'center',
    marginBottom: 12,
  },
  slaPercentage: {
    fontSize: 32,
    fontWeight: '700',
  },
  slaStatus: {
    fontSize: 12,
    color: '#F35C7A',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyMetrics: {
    alignItems: 'flex-end',
  },
  historyTime: {
    fontSize: 12,
    marginBottom: 4,
  },
  historyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  profileCard: {
    marginHorizontal: 12,
    marginVertical: 4,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 0.5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F35C7A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileId: {
    marginBottom: 8,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
  },
  tabBar: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  backButton: {
    marginBottom: 16,
    backgroundColor: 'rgba(243, 92, 122, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    minWidth: 60,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F35C7A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 70,
  },
  historyButtonIcon: {
    fontSize: 12,
    marginRight: 3,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonIcon: {
    color: '#F35C7A',
    fontSize: 16,
    marginRight: 6,
  },
  backButtonText: {
    color: '#F35C7A',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(243, 92, 122, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#F35C7A',
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    padding: 12,
    fontSize: 14,
  },
  mockImageContainer: {
    width: 200,
    height: 150,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  mockImageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  mockImageSubtext: {
    fontSize: 12,
    fontWeight: '400',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  podSection: {
    marginBottom: 12,
  },
  podPhotoContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 8,
    marginTop: 4,
  },
  podPhotoText: {
    fontSize: 24,
    marginBottom: 4,
  },
  podPhotoSubtext: {
    fontSize: 12,
    fontWeight: '500',
  },
  testNotificationButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#F35C7A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 999,
  },
  testNotificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
