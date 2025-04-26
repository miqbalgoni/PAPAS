import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import DocumentItem from '../components/DocumentItem';
import { getDocuments, searchDocuments } from '../services/api';

const DocumentScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(route.params?.category || 'all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const categories = [
    { id: 'all', name: t('documents.all') },
    { id: 'FFRC', name: t('documents.ffrc') },
    { id: 'DSEK', name: t('documents.dsek') },
    { id: 'J&K Education Act', name: t('documents.jk_edu_act') },
    { id: 'RTE Act', name: t('documents.rte_act') }
  ];
  
  const fetchDocuments = useCallback(async (refresh = false) => {
    try {
      setLoading(true);
      const newPage = refresh ? 1 : page;
      const category = activeCategory === 'all' ? null : activeCategory;
      
      const response = await getDocuments(newPage, 15, category);
      
      if (response.success) {
        const newDocs = response.data || [];
        setDocuments(refresh ? newDocs : [...documents, ...newDocs]);
        setHasMore(newDocs.length === 15);
        if (refresh) setPage(1);
      } else {
        console.error('Failed to fetch documents:', response.message);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, activeCategory, documents]);
  
  useEffect(() => {
    // Check if we have a specific document ID to show
    if (route.params?.docId) {
      // Implement showing a single document
      // This would typically open a modal or navigate to a document detail screen
    } else {
      fetchDocuments(true);
    }
  }, [activeCategory]);
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchDocuments(true);
  };
  
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
      fetchDocuments();
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchDocuments(true);
      return;
    }
    
    setLoading(true);
    try {
      const response = await searchDocuments(searchQuery);
      if (response.success) {
        setDocuments(response.data || []);
        setHasMore(false);
      } else {
        console.error('Search failed:', response.message);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderFooter = () => {
    if (!loading || refreshing) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4285F4" />
        <Text style={styles.loadingText}>{t('documents.loading')}</Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#999999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('documents.search_placeholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setSearchQuery('');
                fetchDocuments(true);
              }}
              style={styles.clearButton}
            >
              <Feather name="x" size={20} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Category Filters */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                activeCategory === item.id && styles.activeCategoryButton
              ]}
              onPress={() => setActiveCategory(item.id)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  activeCategory === item.id && styles.activeCategoryText
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Documents List */}
      <FlatList
        data={documents}
        renderItem={({ item }) => <DocumentItem document={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.documentsList}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Feather name="file-text" size={50} color="#CCCCCC" />
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? t('documents.no_search_results') 
                  : t('documents.no_documents')}
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoriesList: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeCategoryButton: {
    backgroundColor: '#4285F4',
  },
  categoryText: {
    color: '#666666',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  documentsList: {
    padding: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 5,
    color: '#999999',
  },
});

export default DocumentScreen;
