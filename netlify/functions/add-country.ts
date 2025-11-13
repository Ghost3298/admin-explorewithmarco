import { neon } from '@neondatabase/serverless';
import { getStore } from '@netlify/blobs';

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const formData = await parseFormData(event);
    const country_name = formData.get('country_name') as string;
    const country_image = formData.get('country_image') as File;

    if (!country_name) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Country name is required' }),
      };
    }

    let imageUrl = '';
    
    // Handle image upload to Netlify Blobs
    if (country_image && country_image.size > 0) {
      const store = getStore('country-images');
      const imageKey = `country-${Date.now()}-${country_image.name}`;
      
      // Convert File to Buffer
      const arrayBuffer = await country_image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Store in Netlify Blobs
      await store.set(imageKey, buffer, {
        metadata: {
          contentType: country_image.type,
          originalName: country_image.name
        }
      });
      
      // Generate the URL for the image
      imageUrl = `/api/images/${imageKey}`;
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    // Insert the new country with the blob URL
    const countries = await sql`
      INSERT INTO countries (country_name, country_image, status, created_at) 
      VALUES (${country_name}, ${imageUrl}, true, NOW())
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

// Helper function to parse multipart form data
async function parseFormData(event: any): Promise<FormData> {
  const formData = new FormData();
  
  if (event.body && event.headers['content-type']?.includes('multipart/form-data')) {
    const boundary = event.headers['content-type']?.split('boundary=')[1];
    const parts = event.body.split(`--${boundary}`);
    
    for (const part of parts) {
      if (part.includes('Content-Disposition')) {
        const nameMatch = part.match(/name="([^"]+)"/);
        const filenameMatch = part.match(/filename="([^"]+)"/);
        const contentTypeMatch = part.match(/Content-Type:\s*([^\r\n]+)/);
        
        if (nameMatch) {
          const name = nameMatch[1];
          const valuePart = part.split('\r\n\r\n')[1];
          const value = valuePart?.split('\r\n')[0];
          
          if (filenameMatch && contentTypeMatch && value) {
            // It's a file
            const filename = filenameMatch[1];
            const contentType = contentTypeMatch[1];
            const arrayBuffer = new TextEncoder().encode(value).buffer;
            const file = new File([arrayBuffer], filename, { type: contentType });
            formData.append(name, file);
          } else if (value) {
            // It's a regular field
            formData.append(name, value);
          }
        }
      }
    }
  }
  
  return formData;
}