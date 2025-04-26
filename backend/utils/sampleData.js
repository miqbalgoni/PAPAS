/**
 * Sample data for testing purposes
 * This file contains sample data that can be used to initialize Firestore collections
 * for testing and development.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
try {
  if (!admin.apps.length) {
    admin.initializeApp();
    console.log('Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

/**
 * Sample school data
 */
const sampleSchools = [
  {
    id: 'school1',
    name: 'Delhi Public School',
    location: 'Srinagar',
    type: 'Private',
    affiliation: 'CBSE',
    contact: {
      phone: '+91-194-2468123',
      email: 'dpskashmir@example.com',
      website: 'www.dpskashmir.edu.in'
    },
    approvalStatus: {
      approved: true,
      registrationNumber: 'DSEK/2010/3456',
      approvalDate: '2010-05-15'
    },
    feeStructure: {
      annual: {
        nursery: 45000,
        primary: 55000,
        middle: 65000,
        secondary: 75000
      },
      monthly: {
        nursery: 3500,
        primary: 4000,
        middle: 4500,
        secondary: 5000
      },
      approved: true,
      lastUpdated: '2023-03-10'
    },
    facilities: [
      'Smart Classrooms',
      'Science Labs',
      'Computer Lab',
      'Library',
      'Sports Complex',
      'Transport'
    ]
  },
  {
    id: 'school2',
    name: 'Kashmir Valley School',
    location: 'Baramulla',
    type: 'Private',
    affiliation: 'JKBOSE',
    contact: {
      phone: '+91-194-2452789',
      email: 'kvs@example.com',
      website: 'www.kvs.edu.in'
    },
    approvalStatus: {
      approved: true,
      registrationNumber: 'DSEK/2015/7890',
      approvalDate: '2015-08-22'
    },
    feeStructure: {
      annual: {
        nursery: 38000,
        primary: 42000,
        middle: 48000,
        secondary: 55000
      },
      monthly: {
        nursery: 2800,
        primary: 3200,
        middle: 3600,
        secondary: 4200
      },
      approved: true,
      lastUpdated: '2023-02-18'
    },
    facilities: [
      'Smart Classrooms',
      'Science Lab',
      'Computer Lab',
      'Library',
      'Playground',
      'Transport'
    ]
  },
  {
    id: 'school3',
    name: 'Modern Academy',
    location: 'Anantnag',
    type: 'Private',
    affiliation: 'JKBOSE',
    contact: {
      phone: '+91-194-2456123',
      email: 'modern.academy@example.com',
      website: 'www.modernacademy.edu.in'
    },
    approvalStatus: {
      approved: true,
      registrationNumber: 'DSEK/2012/5678',
      approvalDate: '2012-06-30'
    },
    feeStructure: {
      annual: {
        nursery: 35000,
        primary: 40000,
        middle: 45000,
        secondary: 52000
      },
      monthly: {
        nursery: 2500,
        primary: 3000,
        middle: 3500,
        secondary: 4000
      },
      approved: true,
      lastUpdated: '2023-01-25'
    },
    facilities: [
      'Classrooms',
      'Science Lab',
      'Computer Lab',
      'Library',
      'Playground',
      'Transport'
    ]
  },
  {
    id: 'school4',
    name: 'Green Valley Public School',
    location: 'Srinagar',
    type: 'Private',
    affiliation: 'CBSE',
    contact: {
      phone: '+91-194-2467890',
      email: 'gvps@example.com',
      website: 'www.gvps.edu.in'
    },
    approvalStatus: {
      approved: true,
      registrationNumber: 'DSEK/2009/2345',
      approvalDate: '2009-04-12'
    },
    feeStructure: {
      annual: {
        nursery: 50000,
        primary: 60000,
        middle: 70000,
        secondary: 80000
      },
      monthly: {
        nursery: 4000,
        primary: 4500,
        middle: 5000,
        secondary: 5500
      },
      approved: true,
      lastUpdated: '2023-03-05'
    },
    facilities: [
      'Smart Classrooms',
      'Science Labs',
      'Computer Lab',
      'Library',
      'Auditorium',
      'Sports Complex',
      'Transport'
    ]
  },
  {
    id: 'school5',
    name: 'New Light Public School',
    location: 'Kupwara',
    type: 'Private',
    affiliation: 'JKBOSE',
    contact: {
      phone: '+91-194-2459876',
      email: 'nlps@example.com',
      website: 'www.nlps.edu.in'
    },
    approvalStatus: {
      approved: false,
      registrationNumber: null,
      approvalDate: null
    },
    feeStructure: {
      annual: {
        nursery: 30000,
        primary: 35000,
        middle: 40000,
        secondary: 45000
      },
      monthly: {
        nursery: 2200,
        primary: 2500,
        middle: 2800,
        secondary: 3200
      },
      approved: false,
      lastUpdated: '2023-02-10'
    },
    facilities: [
      'Classrooms',
      'Computer Lab',
      'Library',
      'Playground'
    ]
  }
];

/**
 * Sample document data
 */
const sampleDocuments = [
  {
    id: 'doc1',
    title: 'Fee Fixation Committee Order 2023',
    category: 'fee-fixation',
    issueDate: '2023-01-15',
    issuedBy: 'Fee Fixation & Regulation Committee, J&K',
    summary: 'Order regarding fee structure for private schools for the academic year 2023-2024',
    content: 'The Fee Fixation and Regulation Committee (FFRC) after considering the proposals submitted by various private schools, and conducting hearings with school management and parent associations, hereby fixes the maximum fee structure for private schools operating in J&K for the academic year 2023-2024.\n\nKey points:\n\n1. No private school shall increase any fee by more than 3% compared to previous academic year without specific approval from FFRC.\n\n2. All schools must publish their fee structure, as approved by FFRC, on their notice boards and websites.\n\n3. No school shall charge any fee not approved by FFRC including charges for excursions, sports day, annual day or any other activity.\n\n4. Schools found violating these directions shall be liable for penalties as prescribed under the J&K School Education Act.\n\n5. Parents may file complaints regarding violations directly to FFRC office or through online portal.',
    downloadUrl: 'https://example.com/documents/ffrc-order-2023.pdf'
  },
  {
    id: 'doc2',
    title: 'DSEK Circular: School Safety Guidelines',
    category: 'dsek-orders',
    issueDate: '2023-02-10',
    issuedBy: 'Director of School Education, Kashmir',
    summary: 'Guidelines for ensuring safety and security in schools',
    content: 'The Directorate of School Education Kashmir hereby issues comprehensive guidelines to ensure safety and security of students in all schools operating in Kashmir Division.\n\nAll schools must implement the following measures:\n\n1. Formation of School Safety Committee comprising principal, teachers, parents and students.\n\n2. Regular safety audits of school buildings, electrical installations, fire safety equipment and transport facilities.\n\n3. Installation of CCTV cameras at strategic locations and ensuring their proper functioning.\n\n4. Proper verification of all staff including teaching, non-teaching and contractual employees.\n\n5. Regular mock drills for fire, earthquake and other disasters.\n\n6. Display of emergency contact numbers at prominent places.\n\n7. First-aid facilities and trained staff to handle medical emergencies.\n\nCompliance report must be submitted within 30 days of this circular.',
    downloadUrl: 'https://example.com/documents/dsek-safety-guidelines.pdf'
  },
  {
    id: 'doc3',
    title: 'J&K School Education Act, 2002 (Amended 2018)',
    category: 'laws',
    issueDate: '2018-07-22',
    issuedBy: 'J&K Legislature',
    summary: 'The primary legislation governing school education in Jammu & Kashmir',
    content: 'This Act provides the legislative framework for regulation and development of school education in Jammu & Kashmir. The Act aims to ensure quality education, proper infrastructure facilities, qualified teaching staff, reasonable fee structure, and proper governance in all schools.\n\nKey provisions include:\n\n1. Establishment of State Board of School Education and its powers and functions.\n\n2. Registration and recognition of schools and conditions thereof.\n\n3. Qualifications, service conditions and training of teachers.\n\n4. Establishment of Fee Fixation & Regulation Committee to regulate fee structure in private schools.\n\n5. Prohibition of capitation fee and screening procedures for admission.\n\n6. Constitution of School Management Committees and Parent-Teacher Associations.\n\n7. Penalties for violations of provisions of the Act.\n\nThe 2018 amendments strengthened provisions related to fee regulation, safety standards, and quality of education.',
    downloadUrl: 'https://example.com/documents/jk-school-edu-act.pdf'
  },
  {
    id: 'doc4',
    title: 'Right to Education Act Implementation Guidelines for J&K',
    category: 'laws',
    issueDate: '2020-03-15',
    issuedBy: 'School Education Department, J&K',
    summary: 'Guidelines for implementation of RTE Act in Jammu & Kashmir after extension of central laws',
    content: 'Following the reorganization of the erstwhile state of J&K and the extension of Central Laws, the Right of Children to Free and Compulsory Education Act, 2009 (RTE Act) has been extended to J&K. These guidelines outline the framework for implementation of the Act in J&K.\n\nKey implementation guidelines:\n\n1. Free and compulsory education for all children between 6-14 years of age in neighborhood schools.\n\n2. 25% reservation in private schools for children from disadvantaged groups and weaker sections.\n\n3. Prohibition of screening procedures and capitation fees for admission.\n\n4. Comprehensive and continuous evaluation of academic performance.\n\n5. Age-appropriate admission for children who have never been enrolled or have dropped out.\n\n6. Special training for children admitted to age-appropriate classes.\n\n7. Pupil-Teacher Ratio and infrastructure standards as per RTE norms.\n\n8. School Management Committees with 75% parents\' representation.\n\nAll schools must comply with these provisions within the timelines specified.',
    downloadUrl: 'https://example.com/documents/rte-implementation-jk.pdf'
  },
  {
    id: 'doc5',
    title: 'DSEK Order: Academic Calendar 2023-24',
    category: 'dsek-orders',
    issueDate: '2023-03-05',
    issuedBy: 'Director of School Education, Kashmir',
    summary: 'Academic calendar for schools in Kashmir Division for 2023-24',
    content: 'The Directorate of School Education Kashmir hereby notifies the academic calendar for all schools (government and private) in Kashmir Division for the academic year 2023-24.\n\nKey dates:\n\n1. Academic session: March 1, 2023 to December 15, 2023 for all schools up to higher secondary level.\n\n2. Summer vacation: July 1 to July 15, 2023 for schools in areas up to 7000 ft altitude; July 1 to July 31, 2023 for schools in areas above 7000 ft altitude.\n\n3. Winter vacation: December 16, 2023 to February 28, 2024 for all schools.\n\n4. Examination schedule:\n   - Class 10 & 12 (Annual): October 25 to November 20, 2023\n   - Class 9 & 11 (Annual): October 15 to November 10, 2023\n   - Classes 1-8 (Annual): October 5 to October 25, 2023\n\n5. Parent-Teacher Meetings: Last Saturday of each month.\n\nAll schools are directed to plan their academic and co-curricular activities in accordance with this calendar.',
    downloadUrl: 'https://example.com/documents/dsek-academic-calendar-2023-24.pdf'
  }
];

/**
 * Function to upload sample data to Firestore
 */
const uploadSampleData = async () => {
  try {
    const db = admin.firestore();
    
    // Upload schools
    const schoolsCollection = db.collection('schools');
    for (const school of sampleSchools) {
      await schoolsCollection.doc(school.id).set(school);
    }
    
    // Upload documents
    const documentsCollection = db.collection('documents');
    for (const document of sampleDocuments) {
      await documentsCollection.doc(document.id).set(document);
    }
    
    return { success: true, message: 'Sample data uploaded successfully' };
  } catch (error) {
    console.error('Error uploading sample data:', error);
    throw error;
  }
};

module.exports = {
  sampleSchools,
  sampleDocuments,
  uploadSampleData
};