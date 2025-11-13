// netlify/functions/add-country.ts - Simplified version
import { neon } from '@neondatabase/serverless';

export async function handler(event: any) {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // For now, let's just handle text data without file upload
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    const { country_name, country_image } = body;

    // Validate required fields
    if (!country_name) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Country name is required' }),
      };
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    // Insert the new country (for now, just store the filename)
    const countries = await sql`
      INSERT INTO countries (country_name, country_image, status, created_at) 
      VALUES (${country_name}, ${country_image || ''}, true, NOW())
      RETURNING *
    `;
    
    return {
      statusCode: 201,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(countries[0]),
    };
  } catch (err) {
    console.error('Error:', err);
    return { 
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }) 
    };
  }
}