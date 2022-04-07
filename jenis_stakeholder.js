const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url

const create = (request, response) => {
    const { stakeholder, alias, logo, created_by }
        = request.body

    let name, complete_path

    if (request.files) {
        let sampleFile = request.files.logo;
        console.log(sampleFile);
        const now = Date.now()
        name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
        console.log(__dirname);
        complete_path = base_url+'dokumens/jenis_stakeholder/logo/'+name;
        sampleFile.mv(path.join(__dirname + '/dokumens/jenis_stakeholder/logo/') + name, function (err) {
            if (err)
                console.log(err);
        });
    }

    pool.query('INSERT INTO tbl_jenis_stakeholder (stakeholder, alias, logo, created_by, url_logo) VALUES($1, $2, $3 ,$4, $5)'
        , [stakeholder, alias, name, created_by, complete_path], (error, results) => {

            if (error) {
                throw error
                response.status(201).send(error)
                if (error.code == '23505') {
                    //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                    response.status(400).send('Duplicate data')
                    return;
                }
            } else {
                response.status(200).send({ success: true, data: 'data jenis stakeholder berhasil dibuat' })
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


    pool.query('SELECT count(*) as total FROM tbl_jenis_stakeholder where is_delete=false', (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT * FROM tbl_jenis_stakeholder where is_delete=false ORDER BY id DESC'
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

    pool.query('SELECT count(*) as total FROM tbl_jenis_stakeholder where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT * FROM tbl_jenis_stakeholder where id=$1 and is_delete=false'
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
        const { stakeholder, alias, logo, updated_by }
        = request.body

    pool.query('SELECT count(*) as total FROM tbl_jenis_stakeholder where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }

    })



    pool.query('SELECT * FROM tbl_jenis_stakeholder where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }

        let name = results.rows[0].logo
        let complete_path = results.rows[0].url_logo

        if (request.files) {
            let doc = results.rows[0].logo;
            var doc_path = __dirname + path.join('/dokumens/jenis_stakeholder/logo/' + doc);
            console.log(doc_path);
            if (fs.existsSync(doc_path)) {
                fs.unlinkSync(doc_path);
            }

            let sampleFile = request.files.logo;
            console.log(sampleFile);
            const now = Date.now()
            name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
            console.log(__dirname);
            complete_path = base_url+'dokumens/jenis_stakeholder/logo/'+name;
            sampleFile.mv(path.join(__dirname + '/dokumens/jenis_stakeholder/logo/') + name, function (err) {
                if (err)
                    console.log(err);
            });
        }

        const update_time = new Date;
        pool.query('UPDATE tbl_jenis_stakeholder SET stakeholder=$1,updated_at=$2, updated_by=$4, alias=$5, logo=$6, url_logo=$7 where id=$3'
            , [stakeholder, update_time, id, updated_by, alias, name, complete_path ], (error, results) => {
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
                    response.status(200).send({ success: true, data: 'data jenis stakeholder berhasil diperbarui' })
                }

            })
    });



}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
    
    const { deleted_by }
        = request.body

    pool.query('SELECT count(*) as total FROM tbl_jenis_stakeholder where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }

    })

    pool.query('SELECT * FROM tbl_jenis_stakeholder where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }


        const deletetime = new Date;
        pool.query('UPDATE tbl_jenis_stakeholder SET deleted_at=$1,is_delete=$2, deleted_by=$4 where id=$3'
            , [deletetime, true, id, deleted_by], (error, results) => {
                if (error) {

                    if (error.code == '23505') {
                        //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                        response.status(400).send('Duplicate data')
                        return;
                    }
                } else {
                    response.status(200).send({ success: true, data: 'data jenis stakeholder berhasil dihapus' })
                }

            })




    });



}


const download = (request, response) => {
    const filename = request.params.filename;
    console.log(filename);
    var doc_path = __dirname + path.join('/dokumens/jenis_stakeholder/logo/' + filename);
    console.log(doc_path);
    response.download(doc_path);
  };

module.exports = {
    create,
    read,
    read_by_id,
    update,
    delete_,
    download
}