const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const create = (request, response) => {
    const { mmsi, status_navigasi, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, haluan, kecepatan, nama_lokasi_kejadian, pelabuhan_asal, pelabuhan_tujuan, jumlah_awak, jumlah_penumpang, jenis_muatan, kondisi_awak_kapal, kondisi_kapal, posisi_bbm, kecepatan_angin, temperature, arus, kelembaban, curah_hujan, arah_angin, tinggi_gelombang, jarak_pandang, pasang_surut, tekanan_udara, remarks, voyage_id, created_by }
        = request.body

    const created_time = new Date;
    pool.query('INSERT INTO tbl_insaf_noon_position (mmsi, status_navigasi, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, haluan, kecepatan, nama_lokasi_kejadian, pelabuhan_asal, pelabuhan_tujuan, jumlah_awak, jumlah_penumpang, jenis_muatan, kondisi_awak_kapal, kondisi_kapal, posisi_bbm, kecepatan_angin, temperature, arus, kelembaban, curah_hujan, arah_angin, tinggi_gelombang, jarak_pandang, pasang_surut, tekanan_udara, remarks, voyage_id, created_by, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35)'
        , [mmsi, status_navigasi, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, haluan, kecepatan, nama_lokasi_kejadian, pelabuhan_asal, pelabuhan_tujuan, jumlah_awak, jumlah_penumpang, jenis_muatan, kondisi_awak_kapal, kondisi_kapal, posisi_bbm, kecepatan_angin, temperature, arus, kelembaban, curah_hujan, arah_angin, tinggi_gelombang, jarak_pandang, pasang_surut, tekanan_udara, remarks, voyage_id, created_by, created_time], (error, results) => {

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


    pool.query('SELECT count(*) as total FROM tbl_insaf_noon_position where is_delete=false', (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT n.*,k.flag,t.ship_type as jenis_kapal,p.ais_status_navigation,k.ship_name,k.gt,k.mmsi,k.call_sign FROM tbl_insaf_noon_position n left join tbl_masdex_kapal k on k.mmsi = n.mmsi left join tbl_insaf_ais_status_navigation p on p.id = n.status_navigasi left join tbl_masdex_jenis_kapal t on k.ship_type = t.id where n.is_delete=false ORDER BY n.id DESC'
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

    pool.query('SELECT count(*) as total FROM tbl_insaf_noon_position where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT n.*,i.nama_pelabuhan as pelabuhan_akhir, l.nama_pelabuhan as pelabuhan_awal,k.imo,k.flag,t.ship_type as jenis_kapal,p.ais_status_navigation,k.ship_name,k.gt,k.mmsi,k.call_sign FROM tbl_insaf_noon_position n left join tbl_masdex_kapal k on k.mmsi = n.mmsi left join tbl_insaf_ais_status_navigation p on p.id = n.status_navigasi left join tbl_masdex_jenis_kapal t on k.ship_type = t.id left join tbl_masdex_pelabuhan l on l.id = n.pelabuhan_asal left join tbl_masdex_pelabuhan i on i.id = n.pelabuhan_tujuan where n.id=$1 and n.is_delete=false ORDER BY n.id DESC'
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

const read_by_last = (request, response) => {

    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_noon_position where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT n.*,k.ship_name FROM tbl_insaf_noon_position n left join tbl_masdex_kapal k on k.mmsi = n.mmsi where n.is_delete=false ORDER BY n.id DESC limit 1'
     pool.query(sql ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })
  
  }

const read_by_voyage = (request, response) => {

    const id = parseInt(request.params.id);
    //console.log('Here');
    //console.log(id);
    const { page, rows } = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

    pool.query('SELECT count(*) as total FROM tbl_insaf_noon_position where voyage_id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT n.*,i.nama_pelabuhan as pelabuhan_akhir, l.nama_pelabuhan as pelabuhan_awal,k.imo,k.flag,t.ship_type as jenis_kapal,p.ais_status_navigation,k.ship_name,k.gt,k.mmsi,k.call_sign FROM tbl_insaf_noon_position n left join tbl_masdex_kapal k on k.mmsi = n.mmsi left join tbl_insaf_ais_status_navigation p on p.id = n.status_navigasi left join tbl_masdex_jenis_kapal t on k.ship_type = t.id left join tbl_masdex_pelabuhan l on l.id = n.pelabuhan_asal left join tbl_masdex_pelabuhan i on i.id = n.pelabuhan_tujuan where n.voyage_id=$1 and n.is_delete=false ORDER BY n.id DESC'
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
        const { mmsi, status_navigasi, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, haluan, kecepatan, nama_lokasi_kejadian, pelabuhan_asal, pelabuhan_tujuan, jumlah_awak, jumlah_penumpang, jenis_muatan, kondisi_awak_kapal, kondisi_kapal, posisi_bbm, kecepatan_angin, temperature, arus, kelembaban, curah_hujan, arah_angin, tinggi_gelombang, jarak_pandang, pasang_surut, tekanan_udara, remarks, voyage_id, updated_by }
        = request.body

    pool.query('SELECT count(*) as total FROM tbl_insaf_noon_position where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }

    })


    pool.query('SELECT * FROM tbl_insaf_noon_position where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }

        let name = results.rows[0].logo
        let complete_path = results.rows[0].url_logo

        const update_time = new Date;
        pool.query('UPDATE tbl_insaf_noon_position SET mmsi=$1, status_navigasi=$2, degree1=$3, minute1=$4, second1=$5, direction1=$6, degree2=$7, minute2=$8, second2=$9, direction2=$10, haluan=$11, kecepatan=$12, nama_lokasi_kejadian=$13, pelabuhan_asal=$14, pelabuhan_tujuan=$15, jumlah_awak=$16, jumlah_penumpang=$17, jenis_muatan=$18, kondisi_awak_kapal=$19, kondisi_kapal=$20, posisi_bbm=$21, kecepatan_angin=$22, temperature=$23, arus=$24, kelembaban=$25, curah_hujan=$26, arah_angin=$27, tinggi_gelombang=$28, jarak_pandang=$29, pasang_surut=$30, tekanan_udara=$31, remarks=$32, voyage_id=$33, updated_by=$34, updated_at=$35 where id=$36'
            , [mmsi, status_navigasi, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, haluan, kecepatan, nama_lokasi_kejadian, pelabuhan_asal, pelabuhan_tujuan, jumlah_awak, jumlah_penumpang, jenis_muatan, kondisi_awak_kapal, kondisi_kapal, posisi_bbm, kecepatan_angin, temperature, arus, kelembaban, curah_hujan, arah_angin, tinggi_gelombang, jarak_pandang, pasang_surut, tekanan_udara, remarks, voyage_id, updated_by, update_time, id ], (error, results) => {
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

    pool.query('SELECT count(*) as total FROM tbl_insaf_noon_position where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }

    })

    pool.query('SELECT * FROM tbl_insaf_noon_position where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }


        const deletetime = new Date;
        pool.query('UPDATE tbl_insaf_noon_position SET deleted_at=$1,is_delete=$2, deleted_by=$4 where id=$3'
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
    read_by_last,
    read_by_voyage,
    update,
    delete_
}