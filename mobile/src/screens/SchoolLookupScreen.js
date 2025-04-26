import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SchoolItem from '../components/SchoolItem';
import { getSchools, searchSchools } from '../services/api';

const SchoolLookupScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  const fetchSchools = async (refresh = false) => {
    try {
      setLoading(true);
      const newPage = refresh ? 1 : page;
      
      const response = await getSchools(newPage, 20);
      
      if (response.success) {
        const newSchools = response.data || [];
        setSchools(refresh ? newSchools : [...schools, ...newSchools]);
        setHasMore(newSchools.length === 20);
        if (refresh) setPage(1);
      } else {
        console.error('Failed to fetch schools:', response.message);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchSchools(true);
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    if (isSearching) {
      handleSearch(true);
    } else {
      fetchSchools(true);
    }
  };
  
  const loadMore = () => {
    if (!loading && hasMore && !isSearching) {
      setPage(prevPage => prevPage + 1);
      fetchSchools();
    }
  };
  
  const handleSearch = async (isRefresh = false) => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      fetchSchools(true);
      return;
    }
    
    setIsSearching(true);
    setLoading(true);
    try {
      const response = await searchSchools(searchQuery);
      
      if (response.success) {
        setSchools(response.data || []);
        setHasMore(false);
      } else {
        console.error('Search failed:', response.message);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };
  
  const navigateToSchoolDetail = (school) => {
    navigation.navigate('SchoolDetail', { 
      schoolId: school.id,
      schoolName: school.name 
    });
  };
  
  const renderFooter = () => {
    if (!loading || refreshing || isSearching) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4285F4" />
        <Text style={styles.loadingText}>{t('schools.loading')}</Text>
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
            placeholder={t('schools.search_placeholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setSearchQuery('');
                setIsSearching(false);
                fetchSchools(true);
              }}
              style={styles.clearButton}
            >
              <Feather name="x" size={20} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => handleSearch()}
        >
          <Text style={styles.searchButtonText}>{t('schools.search')}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          {t('schools.lookup_instructions')}
        </Text>
      </View>
      
      {/* Schools List */}
      <FlatList
        data={schools}
        renderItem={({ item }) => (
          <SchoolItem 
            school={item}
            onPress={() => navigateToSchoolDetail(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.schoolsList}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Feather name="search" size={50} color="#CCCCCC" />
              <Text style={styles.emptyText}>
                {isSearching
                  ? t('schools.no_search_results')
                  : t('schools.no_schools')}
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
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchBar: {
    flex: 1,
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
  searchButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  instructionsContainer: {
    padding: 15,
    backgroundColor: '#FFF8E1',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE082',
  },
  instructionsText: {
    fontSize: 14,
    color: '#795548',
  },
  schoolsList: {
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

export default SchoolLookupScreen;
