const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const create = (request, response) => {
    const { tmas_id, nama_pasien, jenis_kelamin, umur, no_telepon, penyakit, keluhan, spesialis_kesehatan_id, created_by, jenis_asuransi, nomor_asuransi }
        = request.body

    const created_time = new Date;
    pool.query('INSERT INTO tbl_masdex_tmas_pasien (tmas_id, nama_pasien, jenis_kelamin, umur, no_telepon, penyakit, keluhan, spesialis_kesehatan_id, created_by, created_at, jenis_asuransi, nomor_asuransi) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)'
        , [tmas_id, nama_pasien, jenis_kelamin, umur, no_telepon, penyakit, keluhan, spesialis_kesehatan_id, created_by, created_time, jenis_asuransi, nomor_asuransi], (error, results) => {

            if (error) {
                throw error
                response.status(201).send(error)
                if (error.code == '23505') {
                    //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                    response.status(400).send('Duplicate data')
                    return;
                }
            } else {
                response.status(200).send({ success: true, data: 'data berhasil dibuat' })
            }
        })
}

const read = (request, response) => {

    const { page, rows } = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []


    pool.query('SELECT count(*) as total FROM tbl_masdex_tmas_pasien where is_delete=false', (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT * FROM tbl_masdex_tmas_pasien where is_delete=false ORDER BY id DESC'
        pool.query(sql, (error, results) => {
            if (error) {
                throw error
            }
            items.push({ rows: results.rows })
            res.push(items)
            response.status(200).send({ success: true, data: res })
        })

    })

}

const read_by_id = (request, response) => {

    const id = parseInt(request.params.id);
    //console.log('Here');
    //console.log(id);
    const { page, rows } = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

    pool.query('SELECT count(*) as total FROM tbl_masdex_tmas_pasien where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT * FROM tbl_masdex_tmas_pasien where id=$1 and is_delete=false'
        pool.query(sql, [id], (error, results) => {
            if (error) {
                throw error
            }
            items.push({ rows: results.rows })
            res.push(items)
            response.status(200).send({ success: true, data: res })
        })

    })

}


const read_by_tmas = (request, response) => {

    const id = parseInt(request.params.id);
    //console.log('Here');
    //console.log(id);
    const { page, rows } = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

    pool.query('SELECT count(*) as total FROM tbl_masdex_tmas_pasien where tmas_id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT p.*,s.sepesialisasi FROM tbl_masdex_tmas_pasien p join tbl_spesialisasi_kesehatan s on s.id = p.spesialis_kesehatan_id where p.tmas_id=$1 and p.is_delete=false'
        pool.query(sql, [id], (error, results) => {
            if (error) {
                throw error
            }
            items.push({ rows: results.rows })
            res.push(items)
            response.status(200).send({ success: true, data: res })
        })

    })

}


const update = (request, response) => {
    const id = parseInt(request.params.id);
        const { tmas_id, nama_pasien, jenis_kelamin, umur, no_telepon, penyakit, keluhan, spesialis_kesehatan_id, updated_by, jenis_asuransi, nomor_asuransi }
        = request.body

    pool.query('SELECT count(*) as total FROM tbl_masdex_tmas_pasien where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }

    })


    pool.query('SELECT * FROM tbl_masdex_tmas_pasien where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }

        let name = results.rows[0].logo
        let complete_path = results.rows[0].url_logo

        const update_time = new Date;
        pool.query('UPDATE tbl_masdex_tmas_pasien SET tmas_id=$1, nama_pasien=$2, jenis_kelamin=$3, umur=$4, no_telepon=$5, penyakit=$6, keluhan=$7, spesialis_kesehatan_id=$8, updated_by=$9, updated_at=$10, jenis_asuransi=$12, nomor_asuransi=$13 where id=$11'
            , [tmas_id, nama_pasien, jenis_kelamin, umur, no_telepon, penyakit, keluhan, spesialis_kesehatan_id, updated_by, update_time, id, jenis_asuransi, nomor_asuransi ], (error, results) => {
                if (error) {
                    throw error
                    //response.status(201).send(error)
                    //console.log(error);
                    if (error.code == '23505') {
                        //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                        response.status(400).send('Duplicate data')
                        return;
                    }
                } else {
                    response.status(200).send({ success: true, data: 'data berhasil diperbarui' })
                }

            })
    });



}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
    
    const { deleted_by }
        = request.body

    pool.query('SELECT count(*) as total FROM tbl_masdex_tmas_pasien where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }

    })

    pool.query('SELECT * FROM tbl_masdex_tmas_pasien where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }


        const deletetime = new Date;
        pool.query('UPDATE tbl_masdex_tmas_pasien SET deleted_at=$1,is_delete=$2, deleted_by=$4 where id=$3'
            , [deletetime, true, id, deleted_by], (error, results) => {
                if (error) {

                    if (error.code == '23505') {
                        //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                        response.status(400).send('Duplicate data')
                        return;
                    }
                } else {
                    response.status(200).send({ success: true, data: 'data berhasil dihapus' })
                }

            })




    });



}



module.exports = {
    create,
    read,
    read_by_id,
    read_by_tmas,
    update,
    delete_
}