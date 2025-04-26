const { db } = require('./db');
const { eq, sql } = require('drizzle-orm');
const { desc } = require('drizzle-orm');

// Since we can't directly import from TypeScript, we'll define table names here
// These should match the actual table names in the database
const users = { id: 'id', username: 'username' };
const documents = { id: 'id', title: 'title', content: 'content', category: 'category' };
const schools = { id: 'id', name: 'name', location: 'location' };
const feeStructures = { id: 'id', school_id: 'school_id' };
const chatHistory = { id: 'id', user_id: 'user_id', message: 'message', is_user: 'is_user', language: 'language', created_at: 'created_at' };
const savedDocuments = { id: 'id', user_id: 'user_id', document_id: 'document_id' };
const savedSchools = { id: 'id', user_id: 'user_id', school_id: 'school_id' };

/**
 * Interface for storage operations
 */
class IStorage {
  async getUser(id) { throw new Error('Not implemented'); }
  async getUserByUsername(username) { throw new Error('Not implemented'); }
  async createUser(userData) { throw new Error('Not implemented'); }
  async saveDocument(userId, documentId) { throw new Error('Not implemented'); }
  async saveSchool(userId, schoolId) { throw new Error('Not implemented'); }
  async getDocuments(page, limit, category) { throw new Error('Not implemented'); }
  async getDocumentById(id) { throw new Error('Not implemented'); }
  async searchDocuments(query) { throw new Error('Not implemented'); }
  async getSchools(page, limit) { throw new Error('Not implemented'); }
  async getSchoolById(id) { throw new Error('Not implemented'); }
  async searchSchools(query) { throw new Error('Not implemented'); }
  async saveChatMessage(userId, message, isUser, language) { throw new Error('Not implemented'); }
  async getChatHistory(userId, limit) { throw new Error('Not implemented'); }
}

/**
 * Database storage implementation
 */
class DatabaseStorage extends IStorage {
  async getUser(id) {
    try {
      const { rows: users } = await db.query(`
        SELECT * FROM users WHERE id = ${id}
      `);
      return users.length > 0 ? users[0] : undefined;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByUsername(username) {
    try {
      const { rows: users } = await db.query(`
        SELECT * FROM users WHERE username = '${username.replace(/'/g, "''")}'
      `);
      return users.length > 0 ? users[0] : undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(userData) {
    try {
      const { rows: users } = await db.query(`
        INSERT INTO users (
          username, 
          email, 
          password, 
          preferred_language, 
          notification_token, 
          created_at
        )
        VALUES (
          '${userData.username.replace(/'/g, "''")}',
          '${userData.email.replace(/'/g, "''")}',
          '${userData.password.replace(/'/g, "''")}',
          '${userData.preferred_language || 'english'}',
          ${userData.notification_token ? `'${userData.notification_token.replace(/'/g, "''")}'` : 'NULL'},
          NOW()
        )
        RETURNING *
      `);
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  async saveDocument(userId, documentId) {
    try {
      const { rows: savedDoc } = await db.query(`
        INSERT INTO saved_documents (user_id, document_id, saved_at)
        VALUES (${userId}, ${documentId}, NOW())
        RETURNING *
      `);
      
      return savedDoc.length > 0 ? savedDoc[0] : null;
    } catch (error) {
      console.error('Error saving document:', error);
      return null;
    }
  }

  async saveSchool(userId, schoolId) {
    try {
      const { rows: savedSchool } = await db.query(`
        INSERT INTO saved_schools (user_id, school_id, saved_at)
        VALUES (${userId}, ${schoolId}, NOW())
        RETURNING *
      `);
      
      return savedSchool.length > 0 ? savedSchool[0] : null;
    } catch (error) {
      console.error('Error saving school:', error);
      return null;
    }
  }

  async getDocuments(page = 1, limit = 20, category = null) {
    try {
      const offset = (page - 1) * limit;
      let sqlQuery = `
        SELECT * FROM documents 
      `;
      
      if (category) {
        sqlQuery += `WHERE category = '${category}' `;
      }
      
      sqlQuery += `LIMIT ${limit} OFFSET ${offset}`;
      
      const { rows: documents } = await db.query(sqlQuery);
      return documents;
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }

  async getDocumentById(id) {
    try {
      const { rows: docs } = await db.query(`
        SELECT * FROM documents WHERE id = ${id}
      `);
      return docs.length > 0 ? docs[0] : undefined;
    } catch (error) {
      console.error('Error fetching document by ID:', error);
      return undefined;
    }
  }

  async searchDocuments(query) {
    try {
      // Basic search implementation - in a production app, would use full-text search
      const { rows: documents } = await db.query(`
        SELECT * FROM documents 
        WHERE title ILIKE '%${query}%' OR content ILIKE '%${query}%'
      `);
      return documents;
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  }

  async getSchools(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    try {
      // Use raw SQL query for now to simplify
      const { rows: schoolsList } = await db.query(`
        SELECT * FROM schools LIMIT ${limit} OFFSET ${offset}
      `);
      
      // For each school, fetch its fee structure
      const schoolsWithFees = await Promise.all(schoolsList.map(async (school) => {
        const { rows: feeResults } = await db.query(`
          SELECT * FROM fee_structures WHERE school_id = ${school.id}
        `);
        const feeStructure = feeResults.length > 0 ? feeResults[0] : null;
        return { ...school, feeStructure };
      }));
      
      return schoolsWithFees;
    } catch (error) {
      console.error('Error fetching schools:', error);
      return [];
    }
  }

  async getSchoolById(id) {
    try {
      const { rows: schools } = await db.query(`
        SELECT * FROM schools WHERE id = ${id}
      `);
      
      if (schools.length === 0) return undefined;
      
      const school = schools[0];
      
      // Get fee structure
      const { rows: feeResults } = await db.query(`
        SELECT * FROM fee_structures WHERE school_id = ${id}
      `);
      
      const feeStructure = feeResults.length > 0 ? feeResults[0] : null;
      
      return { ...school, feeStructure };
    } catch (error) {
      console.error('Error fetching school by ID:', error);
      return undefined;
    }
  }

  async searchSchools(query) {
    try {
      // Basic search implementation - in a production app, would use full-text search
      const { rows: schoolsList } = await db.query(`
        SELECT * FROM schools 
        WHERE name ILIKE '%${query}%' OR location ILIKE '%${query}%'
      `);
      
      // For each school, fetch its fee structure
      const schoolsWithFees = await Promise.all(schoolsList.map(async (school) => {
        const { rows: feeResults } = await db.query(`
          SELECT * FROM fee_structures WHERE school_id = ${school.id}
        `);
        const feeStructure = feeResults.length > 0 ? feeResults[0] : null;
        return { ...school, feeStructure };
      }));
      
      return schoolsWithFees;
    } catch (error) {
      console.error('Error searching schools:', error);
      return [];
    }
  }

  async saveChatMessage(userId, message, isUser, language = 'english') {
    try {
      const { rows: chatMessage } = await db.query(`
        INSERT INTO chat_history (user_id, message, is_user, language, created_at)
        VALUES (
          ${userId}, 
          '${message.replace(/'/g, "''")}', 
          ${isUser}, 
          '${language}', 
          NOW()
        )
        RETURNING *
      `);
      
      return chatMessage.length > 0 ? chatMessage[0] : null;
    } catch (error) {
      console.error('Error saving chat message:', error);
      return null;
    }
  }

  async getChatHistory(userId, limit = 50) {
    try {
      const { rows: history } = await db.query(`
        SELECT * FROM chat_history
        WHERE user_id = ${userId}
        ORDER BY created_at ASC
        LIMIT ${limit}
      `);
      
      return history;
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }
}

// These imports are already at the top of the file

// Export the database storage instance
const storage = new DatabaseStorage();

module.exports = {
  IStorage,
  DatabaseStorage,
  storage
};