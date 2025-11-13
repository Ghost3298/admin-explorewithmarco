// netlify/functions/get-image.ts
import { getStore } from '@netlify/blobs';

export async function handler(event: any) {
  const { filename } = event.queryStringParameters;

  if (!filename) {
    return {
      statusCode: 400,
      body: 'Filename is required'
    };
  }

  try {
    const store = getStore('country-images');
    const imageBase64 = await store.get(filename);
    
    if (!imageBase64) {
      return {
        statusCode: 404,
        body: 'Image not found'
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/jpeg', // Adjust based on actual image type
        'Cache-Control': 'public, max-age=31536000'
      },
      body: imageBase64,
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error retrieving image:', error);
    return {
      statusCode: 500,
      body: 'Error retrieving image'
    };
  }
}