// netlify/functions/add-country.ts
import { neon } from '@neondatabase/serverless';

export async function handler(event: any) {
  console.log('=== ADD COUNTRY FUNCTION START ===');
  
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, PUT, DELETE'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse the request body
  let body;
  try {
    body = JSON.parse(event.body);
    console.log('Parsed request body - country_name length:', body.country_name?.length);
    console.log('Image data length:', body.country_image?.length || 0);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return {
      statusCode: 400,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  const { country_name, country_image } = body;

  // Validate required fields
  if (!country_name || country_name.trim() === '') {
    console.error('Validation failed: Country name is required');
    return {
      statusCode: 400,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        error: 'Country name is required'
      }),
    };
  }

  try {
    console.log('Connecting to database...');
    
    // Get database URL from environment variable
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('Database URL found, establishing connection...');
    const sql = neon(databaseUrl);
    
    console.log('Executing database query...');
    
    // Insert the new country with base64 image
    const countries = await sql`
      INSERT INTO countries (country_name, country_image, status, created_at) 
      VALUES (${country_name.trim()}, ${country_image || ''}, true, NOW())
      RETURNING id, country_name, country_image, status, created_at
    `;
    
    console.log('Database query successful, country added with ID:', countries[0].id);
    
    return {
      statusCode: 201,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(countries[0]),
    };
  } catch (err: any) {
    console.error('=== DATABASE ERROR ===');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('=== END DATABASE ERROR ===');
    
    return { 
      statusCode: 500,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        error: 'Database operation failed',
        details: err.message,
        type: 'database_error'
      }) 
    };
  }
}