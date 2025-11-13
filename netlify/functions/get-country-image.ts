// netlify/functions/get-country-image.ts
import { getStore } from '@netlify/blobs';

export async function handler(event: any) {
  const { key } = event.queryStringParameters;

  if (!key) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Image key is required' })
    };
  }

  try {
    const store = getStore('country-images');
    const image = await store.get(key, { type: 'blob' });
    
    if (!image) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Image not found' })
      };
    }

    const metadata = await store.getMetadata(key);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': metadata?.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Access-Control-Allow-Origin': '*'
      },
      body: image.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error fetching image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch image' })
    };
  }
}