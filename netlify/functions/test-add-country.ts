import { neon } from '@netlify/neon'

export async function handle(name: string, image:string){
    console.log('===Adding new country===');

    if(!name || !image){
        console.log("error: no name or image");
        return;
    }

    try{
        const sql = neon();
        const countryToAdd = await sql`INSERT INTO countries (country_name, country_image) VALUES (${name}, ${image})`;
        return{
            statusCode: 200,
            body: JSON.stringify(countryToAdd),
            headers: {'Content-Type': 'application/json'}
        };
    } catch (err){
        console.log(err);
        return {statusCode: 500, body: 'Database query failed'};
    }
}