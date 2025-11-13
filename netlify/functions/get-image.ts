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
    // Get the store for images with site ID and token
    const store = getStore('country-images', {
      siteID: 'bfe97a73-8cab-4778-973d-90f591010ef2',
      token: process.env.NETLIFY_BLOB_READ_WRITE_TOKEN
    });
    
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
        'Content-Type': 'image/jpeg',
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