// netlify/functions/add-country.ts - Fixed version
import { neon } from '@neondatabase/serverless';

export async function handler(event: any) {
  console.log('Received request:', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers,
    body: event.body
  });

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
    console.log('Parsed body:', body);
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
  if (!country_name) {
    console.error('Validation failed: Country name is required');
    return {
      statusCode: 400,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        error: 'Country name is required',
        receivedData: body 
      }),
    };
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    console.log('Database connection established');
    
    // Insert the new country
    const countries = await sql`
      INSERT INTO countries (country_name, country_image, status, created_at) 
      VALUES (${country_name}, ${country_image || ''}, true, NOW())
      RETURNING *
    `;
    
    console.log('Country inserted successfully:', countries[0]);
    
    return {
      statusCode: 201,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(countries[0]),
    };
  } catch (err) {
    console.error('Database error:', err);
    return { 
      statusCode: 500,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        error: 'Database query failed'
      }) 
    };
  }
}