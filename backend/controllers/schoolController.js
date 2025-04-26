/**
 * School Controller
 * Handles API requests related to schools
 */

const { sampleSchools } = require('../utils/sampleData');

// When Firebase is not available, use the sample data directly
const USE_SAMPLE_DATA = true;

/**
 * Get all schools with pagination
 */
exports.getAllSchools = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    
    if (USE_SAMPLE_DATA) {
      // Use sample data
      const paginatedSchools = sampleSchools.slice(startIndex, startIndex + limit);
      
      return res.json({
        success: true,
        count: sampleSchools.length,
        page,
        totalPages: Math.ceil(sampleSchools.length / limit),
        data: paginatedSchools
      });
    }
    
    // Firebase implementation would go here
    
  } catch (error) {
    console.error('Error fetching schools:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching schools',
      error: error.message
    });
  }
};

/**
 * Get school by ID
 */
exports.getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'School ID is required'
      });
    }
    
    if (USE_SAMPLE_DATA) {
      // Find school in sample data
      const school = sampleSchools.find(school => school.id === id);
      
      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        });
      }
      
      return res.json({
        success: true,
        data: school
      });
    }
    
    // Firebase implementation would go here
    
  } catch (error) {
    console.error('Error fetching school:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching school details',
      error: error.message
    });
  }
};

/**
 * Search schools by name or location
 */
exports.searchSchools = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    if (USE_SAMPLE_DATA) {
      // Search in sample data
      const searchTerm = query.toLowerCase();
      const results = sampleSchools.filter(school => 
        school.name.toLowerCase().includes(searchTerm) || 
        school.location.toLowerCase().includes(searchTerm)
      );
      
      return res.json({
        success: true,
        count: results.length,
        data: results
      });
    }
    
    // Firebase implementation would go here
    
  } catch (error) {
    console.error('Error searching schools:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching schools',
      error: error.message
    });
  }
};