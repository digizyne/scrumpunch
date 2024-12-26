import pg from "pg";

const { Pool } = pg;

const pool = new Pool();

pool.on('error', (err: any) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

export { pool };