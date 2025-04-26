require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Sample data for our database
const sampleUsers = [
  {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123', // Will be hashed before insertion
    preferred_language: 'english'
  },
  {
    username: 'parentuser',
    email: 'parent@example.com',
    password: 'securepass', // Will be hashed before insertion
    preferred_language: 'urdu'
  }
];

const sampleSchools = [
  {
    name: 'Delhi Public School',
    location: 'Srinagar, Kashmir',
    type: 'Private',
    affiliation: 'CBSE',
    contact_phone: '+91 1234567890',
    contact_email: 'info@dps.edu',
    contact_website: 'https://www.dps.edu',
    approval_status: true,
    registration_number: 'KAS-SCH-001',
    facilities: JSON.stringify(['Library', 'Computer Lab', 'Sports Facilities', 'Science Labs'])
  },
  {
    name: 'Kashmir Valley School',
    location: 'Baramulla, Kashmir',
    type: 'Private',
    affiliation: 'JKBOSE',
    contact_phone: '+91 9876543210',
    contact_email: 'contact@kvs.edu',
    contact_website: 'https://www.kvs.edu',
    approval_status: true,
    registration_number: 'KAS-SCH-002',
    facilities: JSON.stringify(['Library', 'Computer Lab', 'Playground'])
  },
  {
    name: 'Modern Public School',
    location: 'Anantnag, Kashmir',
    type: 'Private',
    affiliation: 'CBSE',
    contact_phone: '+91 8765432109',
    contact_email: 'info@mps.edu',
    contact_website: 'https://www.mps.edu',
    approval_status: false,
    facilities: JSON.stringify(['Library', 'Computer Lab'])
  }
];

const sampleFeeStructures = [
  {
    school_id: 1, // Will be set dynamically
    nursery_annual: 15000,
    nursery_monthly: 1500,
    primary_annual: 20000,
    primary_monthly: 2000,
    middle_annual: 25000,
    middle_monthly: 2500,
    secondary_annual: 30000,
    secondary_monthly: 3000,
    approved: true
  },
  {
    school_id: 2, // Will be set dynamically
    nursery_annual: 12000,
    nursery_monthly: 1200,
    primary_annual: 18000,
    primary_monthly: 1800,
    middle_annual: 22000,
    middle_monthly: 2200,
    secondary_annual: 28000,
    secondary_monthly: 2800,
    approved: true
  },
  {
    school_id: 3, // Will be set dynamically
    nursery_annual: 10000,
    nursery_monthly: 1000,
    primary_annual: 15000,
    primary_monthly: 1500,
    middle_annual: 20000,
    middle_monthly: 2000,
    secondary_annual: 25000,
    secondary_monthly: 2500,
    approved: false
  }
];

const sampleDocuments = [
  {
    title: 'Fee Fixation Committee Order 2023',
    category: 'Fee Fixation',
    issue_date: '2023-04-15',
    issued_by: 'Kashmir Education Department',
    summary: 'Annual order regarding school fee regulations for 2023-24 academic year',
    content: `This document outlines the regulations for school fee fixation in Kashmir for the academic year 2023-24. 
    Schools are required to follow the guidelines set forth by the committee. 
    Any school found charging fees in excess of the approved structure will face penalties.
    
    Key points:
    1. Maximum fee increase capped at 8% from previous year
    2. Fee structure must be transparent and available publicly
    3. No additional fees can be charged without prior approval
    4. Schools must provide scholarships to at least 10% of students from economically weaker sections`,
    download_url: 'https://example.com/docs/fee-fixation-2023.pdf'
  },
  {
    title: 'School Registration Guidelines 2023',
    category: 'Registration',
    issue_date: '2023-03-01',
    issued_by: 'Director of School Education Kashmir',
    summary: 'Updated guidelines for school registration and renewal',
    content: `This document provides comprehensive guidelines for school registration and renewal in Kashmir.
    
    Requirements for new school registration:
    1. Land area: Minimum 1 acre for primary, 2 acres for secondary
    2. Building safety certificate from competent authority
    3. Fire safety clearance
    4. Hygiene and sanitation certificate
    5. Qualified teaching staff as per student-teacher ratio
    6. Adequate infrastructure including labs, library, and sports facilities
    
    Renewal process:
    1. Annual inspection by education department
    2. Compliance report submission
    3. Fee structure approval
    4. Academic performance review`,
    download_url: 'https://example.com/docs/registration-guidelines-2023.pdf'
  },
  {
    title: 'Child Rights Protection Act Summary',
    category: 'Child Rights',
    issue_date: '2022-11-10',
    issued_by: 'Kashmir Child Rights Commission',
    summary: 'Summary of the Child Rights Protection Act and its implementation in schools',
    content: `This document summarizes the Child Rights Protection Act and its implementation in educational institutions in Kashmir.
    
    Key provisions:
    1. Right to Education: Every child between 6-14 years has the right to free and compulsory education
    2. Protection from harassment: Schools must establish anti-harassment committees
    3. Corporal punishment prohibition: Strict action against any form of physical punishment
    4. Inclusive education: Schools must provide facilities for differently-abled students
    5. Mental health support: Schools must have counselors available for students
    
    Reporting mechanisms:
    1. Child helpline: 1098
    2. Online complaint portal
    3. School-level grievance committee`,
    download_url: 'https://example.com/docs/child-rights-summary.pdf'
  }
];

async function seedDatabase() {
  console.log('Initializing database connection for seeding...');
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    console.log('Starting database seed process...');
    
    // Insert users
    console.log('Seeding users...');
    const insertedUsers = [];
    for (const user of sampleUsers) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const result = await pool.query(
        `INSERT INTO users (username, email, password, preferred_language, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) 
         RETURNING id, username, email, preferred_language, created_at`,
        [user.username, user.email, hashedPassword, user.preferred_language]
      );
      
      insertedUsers.push(result.rows[0]);
      console.log(`Added user: ${user.username}`);
    }
    
    // Insert schools
    console.log('Seeding schools...');
    const insertedSchools = [];
    for (const school of sampleSchools) {
      const result = await pool.query(
        `INSERT INTO schools (
          name, location, type, affiliation, contact_phone, contact_email, 
          contact_website, approval_status, registration_number, facilities, 
          created_at, updated_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
        RETURNING id, name, location, type`,
        [
          school.name, 
          school.location, 
          school.type, 
          school.affiliation, 
          school.contact_phone, 
          school.contact_email, 
          school.contact_website, 
          school.approval_status, 
          school.registration_number, 
          school.facilities
        ]
      );
      
      insertedSchools.push(result.rows[0]);
      console.log(`Added school: ${school.name}`);
    }
    
    // Insert fee structures
    console.log('Seeding fee structures...');
    for (let i = 0; i < sampleFeeStructures.length; i++) {
      const feeStructure = sampleFeeStructures[i];
      feeStructure.school_id = insertedSchools[i].id;
      
      await pool.query(
        `INSERT INTO fee_structures (
          school_id, nursery_annual, nursery_monthly, primary_annual, 
          primary_monthly, middle_annual, middle_monthly, secondary_annual, 
          secondary_monthly, approved, last_updated
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
        [
          feeStructure.school_id,
          feeStructure.nursery_annual,
          feeStructure.nursery_monthly,
          feeStructure.primary_annual,
          feeStructure.primary_monthly,
          feeStructure.middle_annual,
          feeStructure.middle_monthly,
          feeStructure.secondary_annual,
          feeStructure.secondary_monthly,
          feeStructure.approved
        ]
      );
      
      console.log(`Added fee structure for school ID: ${feeStructure.school_id}`);
    }
    
    // Insert documents
    console.log('Seeding documents...');
    for (const document of sampleDocuments) {
      await pool.query(
        `INSERT INTO documents (
          title, category, issue_date, issued_by, summary, content, 
          download_url, created_at, updated_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          document.title,
          document.category,
          document.issue_date,
          document.issued_by,
          document.summary,
          document.content,
          document.download_url
        ]
      );
      
      console.log(`Added document: ${document.title}`);
    }
    
    // Add some sample saved items for the first user
    const userId = insertedUsers[0].id;
    
    // Save first document
    await pool.query(
      `INSERT INTO saved_documents (user_id, document_id, saved_at) 
       VALUES ($1, 1, NOW())`,
      [userId]
    );
    console.log(`User ${userId} saved document ID 1`);
    
    // Save first school
    await pool.query(
      `INSERT INTO saved_schools (user_id, school_id, saved_at) 
       VALUES ($1, 1, NOW())`,
      [userId]
    );
    console.log(`User ${userId} saved school ID 1`);
    
    // Add some chat history
    await pool.query(
      `INSERT INTO chat_history (user_id, message, is_user, language, created_at) 
       VALUES 
       ($1, 'What are the fee regulations for private schools?', true, 'english', NOW() - INTERVAL '30 minutes'),
       ($1, 'According to the Fee Fixation Committee Order 2023, private schools can only increase fees by a maximum of 8% from the previous year. All fee structures must be transparent and publicly available.', false, 'english', NOW() - INTERVAL '29 minutes'),
       ($1, 'How can I find if a school is properly registered?', true, 'english', NOW() - INTERVAL '20 minutes'),
       ($1, 'You can verify a school''s registration status by checking their registration number which should start with KAS-SCH followed by a unique identifier. All approved schools will have this registration displayed. You can also use our School Lookup feature to check a school''s registration status.', false, 'english', NOW() - INTERVAL '19 minutes')`,
      [userId]
    );
    console.log(`Added chat history for user ${userId}`);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase().catch(console.error);