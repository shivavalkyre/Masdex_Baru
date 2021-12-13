const { Pool } = require('pg');

    const pool = new Pool({
        user: 'postgres',
        host: '156.67.214.169',
        database: 'masdex_dev',
        password: 'disprioK2021db',
        port: 5432
    });
    
    module.exports = {
        query: (text, params,results) => pool.query(text, params,results)
      }