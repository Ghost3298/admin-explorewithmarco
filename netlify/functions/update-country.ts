// update-country.ts - Alternative simpler version
import { neon } from '@netlify/neon';

export async function handler(event: any) {
  console.log('=== update-country function ===');
  
  // Handle CORS and method checking (same as above)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS, GET, POST, DELETE'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'PUT') {
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

  const { id, name, image, status } = body;

  // Validate required fields
  if (!id) {
    return {
      statusCode: 400,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ error: 'Country ID is required' })
    };
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    let updatedCountry;
    
    // Determine which fields to update
    if (name !== undefined && image !== undefined && status !== undefined) {
      // Update all fields
      updatedCountry = await sql`
        UPDATE countries 
        SET country_name = ${name}, country_image = ${image}, status = ${status}
        WHERE id = ${id}
        RETURNING id, country_name, country_image, status, created_at
      `;
    } else if (name !== undefined && image !== undefined) {
      // Update name and image only
      updatedCountry = await sql`
        UPDATE countries 
        SET country_name = ${name}, country_image = ${image}
        WHERE id = ${id}
        RETURNING id, country_name, country_image, status, created_at
      `;
    } else if (name !== undefined && status !== undefined) {
      // Update name and status only
      updatedCountry = await sql`
        UPDATE countries 
        SET country_name = ${name}, status = ${status}
        WHERE id = ${id}
        RETURNING id, country_name, country_image, status, created_at
      `;
    } else if (image !== undefined && status !== undefined) {
      // Update image and status only
      updatedCountry = await sql`
        UPDATE countries 
        SET country_image = ${image}, status = ${status}
        WHERE id = ${id}
        RETURNING id, country_name, country_image, status, created_at
      `;
    } else if (name !== undefined) {
      // Update name only
      updatedCountry = await sql`
        UPDATE countries 
        SET country_name = ${name}
        WHERE id = ${id}
        RETURNING id, country_name, country_image, status, created_at
      `;
    } else if (image !== undefined) {
      // Update image only
      updatedCountry = await sql`
        UPDATE countries 
        SET country_image = ${image}
        WHERE id = ${id}
        RETURNING id, country_name, country_image, status, created_at
      `;
    } else if (status !== undefined) {
      // Update status only
      updatedCountry = await sql`
        UPDATE countries 
        SET status = ${status}
        WHERE id = ${id}
        RETURNING id, country_name, country_image, status, created_at
      `;
    } else {
      return {
        statusCode: 400,
        headers: { 
          'Access-Control-Allow-Origin': '*', 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ error: 'At least one field to update is required' })
      };
    }
    
    if (updatedCountry.length === 0) {
      return {
        statusCode: 404,
        headers: { 
          'Access-Control-Allow-Origin': '*', 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ error: 'Country not found' })
      };
    }
    
    console.log('Country updated successfully:', updatedCountry[0].id);
    
    return {
      statusCode: 200,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(updatedCountry[0])
    };
  } catch (err) {
    console.log('Database error:', err);
    return {
      statusCode: 500, 
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        error: 'Database update failed',
        details: err instanceof Error ? err.message : 'Unknown error'
      })
    };
  }
}