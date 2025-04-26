/**
 * This file defines the School schema for Firebase Firestore.
 * In Firestore, we don't strictly need schema definitions as it's a NoSQL database,
 * but this acts as documentation for the expected structure.
 */

/**
 * School document structure
 * 
 * @typedef {Object} School
 * @property {string} name - Name of the school
 * @property {string} address - Physical address of the school
 * @property {string} city - City where the school is located
 * @property {string} district - District where the school is located
 * @property {string} phone - Contact phone number
 * @property {string} email - Contact email address
 * @property {string} website - School website if available
 * @property {string} type - Type of school (e.g., 'Primary', 'Secondary', 'Higher Secondary')
 * @property {boolean} approved - Whether the school is officially approved
 * @property {string} approvalNumber - Approval number/identifier from education department
 * @property {Object} feeStructure - Object containing fee details
 * @property {number} feeStructure.annual - Annual fee amount
 * @property {number} feeStructure.monthly - Monthly fee amount
 * @property {number} feeStructure.admission - One-time admission fee
 * @property {Array<string>} documents - Array of document IDs related to this school
 * @property {string} ffrcDetails - FFRC (Fee Fixation Regulatory Committee) details
 * @property {Object} location - Geographic coordinates
 * @property {number} location.latitude - Latitude coordinate
 * @property {number} location.longitude - Longitude coordinate
 * @property {Date} lastUpdated - Timestamp of last data update
 */

/**
 * Example school document in Firestore:
 * 
 * {
 *   name: "Delhi Public School",
 *   address: "Athwajan, NH1A",
 *   city: "Srinagar",
 *   district: "Srinagar",
 *   phone: "+91-1234567890",
 *   email: "info@dpskashmir.com",
 *   website: "https://www.dpskashmir.com",
 *   type: "Higher Secondary",
 *   approved: true,
 *   approvalNumber: "DSEK-12345",
 *   feeStructure: {
 *     annual: 25000,
 *     monthly: 2000,
 *     admission: 15000
 *   },
 *   documents: ["doc_id_1", "doc_id_2"],
 *   ffrcDetails: "FFRC Order No. 123 dated 15-01-2023",
 *   location: {
 *     latitude: 34.0518,
 *     longitude: 74.8001
 *   },
 *   lastUpdated: Timestamp(2023-11-15)
 * }
 */

// Not exporting any code as this is just documentation for Firestore structure
