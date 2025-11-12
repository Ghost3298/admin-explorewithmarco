import { neon } from '@netlify/neon';

export async function handler(event: any) {
  // Parse the request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  const { country_name, country_image } = body;

  // Validate required fields
  if (!country_name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Country name is required' }),
    };
  }

  try {
    const sql = neon();
    
    // Insert the new country and return the created record
    const countries = await sql`
      INSERT INTO countries (country_name, country_image, status, created_at) 
      VALUES (${country_name}, ${country_image || ''}, true, NOW())
      RETURNING *
    `;
    
    return {
      statusCode: 201,
      body: JSON.stringify(countries[0]),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (err) {
    console.error('Database error:', err);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Database query failed' }) 
    };
  }
}
