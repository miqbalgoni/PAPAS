import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const DocumentItem = ({ document }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  // Format date if available
  const formattedDate = document.date 
    ? new Date(document.date.seconds * 1000).toLocaleDateString() 
    : '';
  
  // Get icon based on document category
  const getDocumentIcon = (category) => {
    switch (category) {
      case 'FFRC':
        return 'dollar-sign';
      case 'DSEK':
        return 'clipboard';
      case 'J&K Education Act':
        return 'book';
      case 'RTE Act':
        return 'award';
      default:
        return 'file-text';
    }
  };
  
  // Get color based on document category
  const getDocumentColor = (category) => {
    switch (category) {
      case 'FFRC':
        return '#4CAF50';
      case 'DSEK':
        return '#F44336';
      case 'J&K Education Act':
        return '#2196F3';
      case 'RTE Act':
        return '#FF9800';
      default:
        return '#607D8B';
    }
  };
  
  // Handle document press - in a real app, this would open the document
  const handleDocumentPress = () => {
    // Navigation to a document detail screen would be implemented here
    // For now, we'll just show an alert
    alert(`Opening document: ${document.title}`);
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={handleDocumentPress}>
      {/* Document Icon */}
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: getDocumentColor(document.category) }
        ]}
      >
        <Feather 
          name={getDocumentIcon(document.category)} 
          size={20} 
          color="#FFFFFF" 
        />
      </View>
      
      {/* Document Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{document.title}</Text>
        
        <View style={styles.detailsContainer}>
          {document.category && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{document.category}</Text>
            </View>
          )}
          
          {document.type && (
            <Text style={styles.type}>{document.type}</Text>
          )}
          
          {formattedDate && (
            <Text style={styles.date}>{formattedDate}</Text>
          )}
        </View>
        
        {document.description && (
          <Text 
            style={styles.description} 
            numberOfLines={2}
          >
            {document.description}
          </Text>
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
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
  tagContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 3,
  },
  tagText: {
    fontSize: 12,
    color: '#666666',
  },
  type: {
    fontSize: 12,
    color: '#999999',
    marginRight: 8,
    marginBottom: 3,
  },
  date: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 3,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default DocumentItem;
