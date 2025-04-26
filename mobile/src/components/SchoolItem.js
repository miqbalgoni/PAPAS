import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const SchoolItem = ({ school, onPress }) => {
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* School Icon */}
      <View style={styles.iconContainer}>
        <Feather name="book" size={24} color="#4285F4" />
      </View>
      
      {/* School Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{school.name}</Text>
        
        <View style={styles.detailsContainer}>
          {school.type && (
            <Text style={styles.type}>{school.type}</Text>
          )}
          
          {school.city && (
            <Text style={styles.location}>
              <Feather name="map-pin" size={12} color="#666666" /> {school.city}
              {school.district && school.district !== school.city ? `, ${school.district}` : ''}
            </Text>
          )}
        </View>
        
        {/* School Approval Status */}
        <View style={styles.statusContainer}>
          {school.approved ? (
            <View style={styles.approvedBadge}>
              <Feather name="check-circle" size={12} color="#4CAF50" />
              <Text style={styles.approvedText}>{t('schools.approved')}</Text>
            </View>
          ) : (
            <View style={styles.unapprovedBadge}>
              <Feather name="alert-circle" size={12} color="#F44336" />
              <Text style={styles.unapprovedText}>{t('schools.not_approved')}</Text>
            </View>
          )}
          
          {school.feeStructure && school.feeStructure.monthly && (
            <Text style={styles.feeText}>
              {t('schools.monthly_fee')}: ₹{school.feeStructure.monthly.toLocaleString()}
            </Text>
          )}
        </View>
      </View>
      
      {/* Arrow Icon */}
      <Feather name="chevron-right" size={20} color="#CCCCCC" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  type: {
    fontSize: 13,
    color: '#666666',
    marginRight: 10,
  },
  location: {
    fontSize: 13,
    color: '#666666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  unapprovedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  approvedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 3,
  },
  unapprovedText: {
    fontSize: 12,
    color: '#F44336',
    marginLeft: 3,
  },
  feeText: {
    fontSize: 12,
    color: '#4285F4',
    fontWeight: '500',
  },
});

export default SchoolItem;
