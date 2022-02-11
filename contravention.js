const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const create = (request, response) => {
    const { no_jurnal, mmsi, data_feed_type, created_by, jenis_pelanggaran_id, tanggal_contravention, keterangan_pelanggaran, voyage_id }
        = request.body


    const create_time = new Date;
    pool.query('INSERT INTO tbl_insaf_contravention (no_jurnal, mmsi, data_feed_type, created_by, jenis_pelanggaran_id, tanggal_contravention, keterangan_pelanggaran, created_at, voyage_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)'
        , [no_jurnal, mmsi, parseInt(data_feed_type), created_by, jenis_pelanggaran_id, tanggal_contravention, keterangan_pelanggaran, create_time, voyage_id], (error, results) => {
            if (error) {
                throw error
                response.status(201).send(error)
                if (error.code == '23505') {
                    //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                    response.status(400).send('Duplicate data')
                    return;
                }
            } else {
                response.status(200).send({ success: true, data: 'data contravention berhasil dibuat' })
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


    pool.query('SELECT count(*) as total FROM tbl_insaf_contravention where is_delete=false', (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT * FROM insaf_contravention_read_all'
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

    pool.query('SELECT count(*) as total FROM tbl_insaf_contravention where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT * FROM insaf_contravention_read_all where id=$1'
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
    const { no_jurnal, mmsi, data_feed_type, updated_by, jenis_pelanggaran_id, tanggal_contravention, keterangan_pelanggaran, voyage_id }
        = request.body
    let doc;

    pool.query('SELECT count(*) as total FROM tbl_insaf_contravention where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }

    })



    pool.query('SELECT * FROM tbl_insaf_contravention where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }


        const update_time = new Date;
        pool.query('UPDATE tbl_insaf_contravention SET no_jurnal=$1, mmsi=$2, data_feed_type=$3, updated_by=$4, jenis_pelanggaran_id=$5, tanggal_contravention=$6, keterangan_pelanggaran=$7, updated_at=$8, voyage_id=$10 where id=$9'
            , [no_jurnal, mmsi, parseInt(data_feed_type), updated_by, jenis_pelanggaran_id, tanggal_contravention, keterangan_pelanggaran, update_time, id, voyage_id], (error, results) => {
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
                    response.status(200).send({ success: true, data: 'data contravention berhasil diperbarui' })
                }

            })




    });



}

const update_by_ksop = (request, response) => {
    const id = parseInt(request.params.id);
    const { voyage_id, tanggal_ditanggapi, feedback, updated_by }
        = request.body
    let doc;

    pool.query('SELECT count(*) as total FROM tbl_insaf_contravention where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }

    })



    pool.query('SELECT * FROM tbl_insaf_contravention where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }


        const update_time = new Date;
        pool.query('UPDATE tbl_insaf_contravention SET feedback=$1, tanggal_ditanggapi=$2, updated_at=$3, voyage_id=$4, updated_by=$5 where id=$6'
            , [feedback, tanggal_ditanggapi, update_time, voyage_id, updated_by, id], (error, results) => {
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
                    response.status(200).send({ success: true, data: 'data contravention berhasil diperbarui' })
                }

            })




    });



}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);

    const { deleted_by }
        = request.body

    // const deleted_by = 0;

    pool.query('SELECT count(*) as total FROM tbl_insaf_contravention where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }

    })

    pool.query('SELECT * FROM tbl_insaf_contravention where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }


        const deletetime = new Date;
        pool.query('UPDATE tbl_insaf_contravention SET deleted_at=$1,is_delete=$2, deleted_by=$4 where id=$3'
            , [deletetime, true, id, deleted_by], (error, results) => {
                if (error) {

                    if (error.code == '23505') {
                        //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                        response.status(400).send('Duplicate data')
                        return;
                    }
                } else {
                    response.status(200).send({ success: true, data: 'data contravention berhasil dihapus' })
                }

            })




    });



}

module.exports = {
    create,
    read,
    read_by_id,
    update,
    delete_,
    update_by_ksop
}