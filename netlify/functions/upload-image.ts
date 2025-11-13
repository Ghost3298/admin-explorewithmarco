// netlify/functions/upload-image.ts
import { getStore } from '@netlify/blobs';

export async function handler(event: any) {
  console.log('=== UPLOAD IMAGE FUNCTION START ===');
  
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
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

  try {
    const body = JSON.parse(event.body);
    const { image, filename } = body;

    if (!image || !filename) {
      return {
        statusCode: 400,
        headers: { 
          'Access-Control-Allow-Origin': '*', 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ error: 'Image data and filename are required' })
      };
    }

    // Get the store for images with site ID and token
    const store = getStore('country-images', {
      siteID: 'bfe97a73-8cab-4778-973d-90f591010ef2',
      token: process.env.NETLIFY_BLOB_READ_WRITE_TOKEN
    });
    
    // Store the base64 string directly
    await store.set(filename, image, {
      metadata: {
        contentType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      }
    });

    // Generate the URL for the stored image
    const imageUrl = `/api/images/${filename}`;

    return {
      statusCode: 200,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        success: true, 
        imageUrl,
        filename 
      })
    };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return {
      statusCode: 500,
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        error: 'Failed to upload image',
        details: error.message 
      })
    };
  }
}