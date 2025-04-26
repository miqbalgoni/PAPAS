import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import LoadingIndicator from '../components/LoadingIndicator';
import { getFeaturedDocuments } from '../services/api';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredDocs, setFeaturedDocs] = useState([]);

  const fetchFeaturedDocs = async () => {
    try {
      const docs = await getFeaturedDocuments();
      setFeaturedDocs(docs.data || []);
    } catch (error) {
      console.error('Error fetching featured documents:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeaturedDocs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeaturedDocs();
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>PAPAS Kashmir</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      </View>

      {/* Quick action buttons */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('Chat')}
        >
          <Feather name="message-circle" size={28} color="#4285F4" />
          <Text style={styles.actionText}>{t('home.chat_action')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('Voice')}
        >
          <Feather name="mic" size={28} color="#4285F4" />
          <Text style={styles.actionText}>{t('home.voice_action')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('SchoolStack')}
        >
          <Feather name="search" size={28} color="#4285F4" />
          <Text style={styles.actionText}>{t('home.school_lookup')}</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Updates Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.recent_updates')}</Text>
        <View style={styles.documentsContainer}>
          {featuredDocs.length > 0 ? (
            featuredDocs.map((doc, index) => (
              <TouchableOpacity
                key={index}
                style={styles.documentCard}
                onPress={() => navigation.navigate('DocumentStack', {
                  screen: 'Documents',
                  params: { docId: doc.id }
                })}
              >
                <View style={styles.docIconContainer}>
                  <Feather name="file-text" size={24} color="#4285F4" />
                </View>
                <View style={styles.docContent}>
                  <Text style={styles.docTitle} numberOfLines={2}>{doc.title}</Text>
                  <Text style={styles.docDate}>{new Date(doc.date?.seconds * 1000).toLocaleDateString()}</Text>
                  <Text style={styles.docCategory}>{doc.category}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyMessage}>{t('home.no_updates')}</Text>
          )}
        </View>
      </View>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
        <View style={styles.categoriesContainer}>
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('DocumentStack', {
              screen: 'Documents',
              params: { category: 'FFRC' }
            })}
          >
            <Feather name="dollar-sign" size={24} color="#4285F4" />
            <Text style={styles.categoryTitle}>{t('home.ffrc_orders')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('DocumentStack', {
              screen: 'Documents',
              params: { category: 'DSEK' }
            })}
          >
            <Feather name="clipboard" size={24} color="#4285F4" />
            <Text style={styles.categoryTitle}>{t('home.dsek_orders')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('DocumentStack', {
              screen: 'Documents',
              params: { category: 'J&K Education Act' }
            })}
          >
            <Feather name="book" size={24} color="#4285F4" />
            <Text style={styles.categoryTitle}>{t('home.jk_education_act')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('DocumentStack', {
              screen: 'Documents',
              params: { category: 'RTE Act' }
            })}
          >
            <Feather name="award" size={24} color="#4285F4" />
            <Text style={styles.categoryTitle}>{t('home.rte_act')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>{t('home.about_title')}</Text>
        <Text style={styles.aboutText}>{t('home.about_description')}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4285F4',
    padding: 20,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    marginTop: 5,
    fontSize: 14,
    color: '#4A4A4A',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginTop: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333',
  },
  documentsContainer: {
    gap: 10,
  },
  documentCard: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  docIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    marginRight: 10,
  },
  docContent: {
    flex: 1,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  docDate: {
    fontSize: 12,
    color: '#888888',
    marginVertical: 3,
  },
  docCategory: {
    fontSize: 12,
    color: '#4285F4',
    fontWeight: '500',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888888',
    padding: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  aboutSection: {
    padding: 20,
    margin: 15,
    marginTop: 5,
    backgroundColor: '#4285F4',
    borderRadius: 10,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  aboutText: {
    color: '#FFFFFF',
    lineHeight: 20,
  },
});

export default HomeScreen;
