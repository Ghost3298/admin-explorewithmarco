// test-add-country.ts - Fixed version
import { neon } from '@netlify/neon';

export async function handler(event: any) {
  console.log('=== test-add-country function ===');
  
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
    console.log('Parsed request body:', body);
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

  const { name, image } = body;

  if (!name || !image) {
    console.log("error: no name or image");
    return {
      statusCode: 400,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ error: 'Name and image are required' })
    };
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Insert the country and return the inserted record
    const countryToAdd = await sql`
      INSERT INTO countries (country_name, country_image, status, created_at) 
      VALUES (${name}, ${image}, true, NOW())
      RETURNING id, country_name, country_image, status, created_at
    `;
    
    console.log('Country added successfully:', countryToAdd[0].id);
    
    return {
      statusCode: 200,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(countryToAdd[0])
    };
  } catch (err) {
    console.log('Database error:', err);
    return {
      statusCode: 500, 
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ error: 'Database query failed' })
    };
  }
}