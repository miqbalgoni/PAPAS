import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { getSchoolById } from '../services/api';

const SchoolDetailScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const { schoolId } = route.params;
  
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        setLoading(true);
        const response = await getSchoolById(schoolId);
        
        if (response.success) {
          setSchool(response.data);
        } else {
          setError(response.message || t('schools.detail_error'));
        }
      } catch (error) {
        console.error('Error fetching school details:', error);
        setError(t('schools.detail_error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchoolDetails();
  }, [schoolId]);
  
  const openPhone = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };
  
  const openEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };
  
  const openWebsite = (website) => {
    Linking.openURL(website);
  };
  
  const openMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>{t('schools.loading_details')}</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={50} color="#F44336" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>{t('common.go_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (!school) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="help-circle" size={50} color="#FF9800" />
        <Text style={styles.errorText}>{t('schools.not_found')}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>{t('common.go_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* School Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.schoolName}>{school.name}</Text>
        <View style={styles.typeContainer}>
          <Text style={styles.schoolType}>{school.type}</Text>
        </View>
        
        {school.approved ? (
          <View style={styles.approvalBadge}>
            <Feather name="check-circle" size={16} color="#4CAF50" />
            <Text style={styles.approvalText}>{t('schools.approved')}</Text>
          </View>
        ) : (
          <View style={[styles.approvalBadge, styles.notApprovedBadge]}>
            <Feather name="alert-circle" size={16} color="#F44336" />
            <Text style={[styles.approvalText, styles.notApprovedText]}>
              {t('schools.not_approved')}
            </Text>
          </View>
        )}
      </View>
      
      {/* Contact Info Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t('schools.contact_info')}</Text>
        
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={20} color="#4285F4" />
          <Text style={styles.infoText}>{school.address}</Text>
        </View>
        
        {school.location && (
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={() => openMap(school.location.latitude, school.location.longitude)}
          >
            <Feather name="map" size={16} color="#FFFFFF" />
            <Text style={styles.mapButtonText}>{t('schools.view_on_map')}</Text>
          </TouchableOpacity>
        )}
        
        {school.phone && (
          <TouchableOpacity 
            style={styles.infoRow}
            onPress={() => openPhone(school.phone)}
          >
            <Feather name="phone" size={20} color="#4285F4" />
            <Text style={[styles.infoText, styles.clickableText]}>{school.phone}</Text>
          </TouchableOpacity>
        )}
        
        {school.email && (
          <TouchableOpacity 
            style={styles.infoRow}
            onPress={() => openEmail(school.email)}
          >
            <Feather name="mail" size={20} color="#4285F4" />
            <Text style={[styles.infoText, styles.clickableText]}>{school.email}</Text>
          </TouchableOpacity>
        )}
        
        {school.website && (
          <TouchableOpacity 
            style={styles.infoRow}
            onPress={() => openWebsite(school.website)}
          >
            <Feather name="globe" size={20} color="#4285F4" />
            <Text style={[styles.infoText, styles.clickableText]}>{school.website}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Fee Structure Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t('schools.fee_structure')}</Text>
        
        {school.feeStructure ? (
          <View>
            {school.feeStructure.annual !== undefined && (
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>{t('schools.annual_fee')}</Text>
                <Text style={styles.feeAmount}>₹{school.feeStructure.annual.toLocaleString()}</Text>
              </View>
            )}
            
            {school.feeStructure.monthly !== undefined && (
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>{t('schools.monthly_fee')}</Text>
                <Text style={styles.feeAmount}>₹{school.feeStructure.monthly.toLocaleString()}</Text>
              </View>
            )}
            
            {school.feeStructure.admission !== undefined && (
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>{t('schools.admission_fee')}</Text>
                <Text style={styles.feeAmount}>₹{school.feeStructure.admission.toLocaleString()}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.noDataText}>{t('schools.fee_not_available')}</Text>
        )}
        
        {school.ffrcDetails && (
          <View style={styles.ffrcContainer}>
            <Text style={styles.ffrcLabel}>{t('schools.ffrc_details')}</Text>
            <Text style={styles.ffrcText}>{school.ffrcDetails}</Text>
          </View>
        )}
      </View>
      
      {/* Approval Details Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t('schools.approval_details')}</Text>
        
        {school.approved ? (
          <View>
            {school.approvalNumber && (
              <View style={styles.approvalRow}>
                <Text style={styles.approvalLabel}>{t('schools.approval_number')}</Text>
                <Text style={styles.approvalValue}>{school.approvalNumber}</Text>
              </View>
            )}
            
            {school.lastUpdated && (
              <View style={styles.approvalRow}>
                <Text style={styles.approvalLabel}>{t('schools.last_updated')}</Text>
                <Text style={styles.approvalValue}>
                  {new Date(school.lastUpdated?.seconds * 1000).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.notApprovedInfo}>
            <Feather name="alert-triangle" size={20} color="#FF9800" />
            <Text style={styles.notApprovedInfoText}>
              {t('schools.not_approved_info')}
            </Text>
          </View>
        )}
      </View>
      
      {/* Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>{t('schools.disclaimer')}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666666',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  schoolName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  typeContainer: {
    marginBottom: 10,
  },
  schoolType: {
    fontSize: 16,
    color: '#666666',
  },
  approvalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  notApprovedBadge: {
    backgroundColor: '#FFEBEE',
  },
  approvalText: {
    marginLeft: 5,
    color: '#4CAF50',
    fontWeight: '500',
  },
  notApprovedText: {
    color: '#F44336',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666666',
    flex: 1,
  },
  clickableText: {
    color: '#4285F4',
  },
  mapButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  mapButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: '500',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  feeLabel: {
    fontSize: 16,
    color: '#666666',
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  noDataText: {
    fontStyle: 'italic',
    color: '#999999',
    marginBottom: 10,
  },
  ffrcContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 5,
  },
  ffrcLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1976D2',
    marginBottom: 5,
  },
  ffrcText: {
    fontSize: 14,
    color: '#333333',
  },
  approvalRow: {
    marginBottom: 10,
  },
  approvalLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },
  approvalValue: {
    fontSize: 16,
    color: '#333333',
  },
  notApprovedInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    padding: 10,
    borderRadius: 5,
  },
  notApprovedInfoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#795548',
    flex: 1,
  },
  disclaimerContainer: {
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default SchoolDetailScreen;
