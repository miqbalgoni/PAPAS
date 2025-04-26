/**
 * This file defines the Document schema for Firebase Firestore.
 * In Firestore, we don't strictly need schema definitions as it's a NoSQL database,
 * but this acts as documentation for the expected structure.
 */

/**
 * Document document structure
 * 
 * @typedef {Object} Document
 * @property {string} title - Title of the document
 * @property {string} description - Brief description of the document content
 * @property {string} content - Full text content of the document
 * @property {string} category - Category of the document (e.g., 'FFRC', 'DSEK', 'J&K Education Act', 'RTE Act')
 * @property {string} type - Type of document (e.g., 'order', 'regulation', 'act', 'notification')
 * @property {string} documentNumber - Official number/identifier of the document
 * @property {Date} date - Date the document was issued
 * @property {string} issuedBy - Authority that issued the document
 * @property {string} language - Language of the document ('english' or 'urdu')
 * @property {string} fileUrl - URL to the original document file if available
 * @property {Array<string>} tags - Array of keywords for improved searchability
 * @property {Date} addedAt - Timestamp when document was added to the system
 * @property {Date} updatedAt - Timestamp of the last update to the document
 */

/**
 * Example document in Firestore:
 * 
 * {
 *   title: "Fee Structure Regulation for Private Schools 2023-24",
 *   description: "Regulation by FFRC regarding fee structure for private schools for academic year 2023-24",
 *   content: "The Fee Fixation & Regulation Committee hereby orders that...",
 *   category: "FFRC",
 *   type: "order",
 *   documentNumber: "FFRC/26/2023",
 *   date: Timestamp(2023-03-15),
 *   issuedBy: "Chairman, Fee Fixation Regulatory Committee",
 *   language: "english",
 *   fileUrl: "https://storage.example.com/documents/ffrc-26-2023.pdf",
 *   tags: ["fee", "private schools", "regulation", "2023-24", "academic year"],
 *   addedAt: Timestamp(2023-03-16),
 *   updatedAt: Timestamp(2023-03-16)
 * }
 */

// Not exporting any code as this is just documentation for Firestore structure
