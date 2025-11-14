import {neon} from '@netlify/neon';

export async function handler(){
    try {
        const sql = neon();
        const users = await sql`SELECT * FROM users ORDER BY username`;
        
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);

        return{
            statusCode: 200,
            body: JSON.stringify(usersWithoutPasswords),
            headers: {'Content-Type' : 'application/json'},
        };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: ' Database query failed' };
    }
}