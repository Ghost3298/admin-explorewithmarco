import { neon } from '@netlify/neon';

export async function handler() {
  try {
    const sql = neon(); // uses NETLIFY_DATABASE_URL automatically
    const countries = await sql`SELECT * FROM countries ORDER BY created_at DESC`;
    return {
      statusCode: 200,
      body: JSON.stringify(countries),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Database query failed' };
  }
}
