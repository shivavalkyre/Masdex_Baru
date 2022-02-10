const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;
var complete_path='';

const create = (request, response) => {
    const { dokumen, keterangan_lainnya, title, valid_from, valid_to, url_dokumen, created_by } 
    = request.body

    var name = '';
    if (request.files) {
        let sampleFile = request.files.dokumen;
        console.log(sampleFile);
        const now = Date.now()
        name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
        complete_path = base_url + 'dokumens/ntm/' + name;
        console.log(__dirname+' ini dirname');
        sampleFile.mv(path.join(__dirname + '/dokumens/ntm/') + name, function (err) {
            if (err)
                console.log(err);
        });
    } else {
        name = null;
    }

    pool.query('INSERT INTO tbl_insaf_notice_to_mariner (dokumen, keterangan_lainnya, title, valid_from, valid_to, url_dokumen, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7)'
    , [name, keterangan_lainnya, title, valid_from, valid_to, complete_path, created_by], (error, results) =>{
      if (error) {
        throw error
        //response.status(201).send(error)
        if (error.code == '23505')
        {
            //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
            response.status(400).send('Duplicate data')
            return;
        }
      }
      else
      {
        pool.query('SELECT id FROM tbl_insaf_notice_to_mariner ORDER BY id DESC LIMIT 1',  (error, results) => {
            if (error) 
            {
                throw error
            }
            response.status(200).send({success:true,data: results.rows[0].id})
        })
      }
    })

}

const read = (request, response) => {

    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

  
    pool.query('SELECT count(*) as total FROM tbl_insaf_notice_to_mariner where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_notice_to_mariner where is_delete=false ORDER BY id ASC'
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

const read_by_id = (request, response) => {

    const id = parseInt(request.params.id);
    //console.log('Here');
    //console.log(id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_notice_to_mariner where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_notice_to_mariner where id=$1 and is_delete=false'
     pool.query(sql,[id] ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })

}

const update = (request, response) => {
    const id = parseInt(request.params.id);
    const { dokumen, keterangan_lainnya, title, valid_from, valid_to, url_dokumen } 
    = request.body;
    let doc;
    //console.log(mmsi);
    let jenis_telkompel;

     pool.query('SELECT * FROM tbl_insaf_notice_to_mariner where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

          var name;
          var complete_path;

          name = results.rows[0].dokumen;
          complete_path = results.rows[0].url_dokumen;
              if (request.files) {
                  doc = results.rows[0].dokumen;
                  var doc_path = __dirname + path.join('/dokumens/ntm/' + doc);
                  console.log(doc_path);
                  fs.unlinkSync(doc_path);
                  console.log(doc_path);
                  var name = '';
                  let sampleFile = request.files.dokumen;
                  console.log(sampleFile);
                  const now = Date.now()
                  name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
                  complete_path = base_url + 'dokumens/ntm/' + name;
                  console.log(__dirname);
                  sampleFile.mv(path.join(__dirname + '/dokumens/ntm/') + name, function (err) {
                      if (err)
                          console.log(err);
                  });
              } else {
                  name = null;
              }
        //  console.log(name);
            const update_time = new Date;
            pool.query('UPDATE tbl_insaf_notice_to_mariner SET dokumen=$1, keterangan_lainnya=$2, title=$3, valid_from=$4, valid_to=$5, url_dokumen=$6 where id=$7'
          , [name, keterangan_lainnya, title, valid_from, valid_to, complete_path, id], (error, results) =>{
            if (error) {
               throw error
            }else
            {
                response.status(200).send({success:true,data:'data berhasil diperbarui'})
            }
     
          });

        });

}

const delete_ = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT count(*) as total FROM tbl_insaf_notice_to_mariner where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }else{
        //console.log(results.rows);
      }
  })

  pool.query('SELECT * FROM tbl_insaf_notice_to_mariner where id=$1 and is_delete=false',[id] ,(error, results) => {
      if (error) {
        throw error
      }

    const deletetime = new Date;
    pool.query('UPDATE tbl_insaf_notice_to_mariner SET deleted_at=$1,is_delete=$2 where id=$3'
    , [deletetime, true,id], (error, results) =>{
      if (error) {

        if (error.code == '23505')
        {
          //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
          response.status(400).send('Duplicate data')
          return;
        }
      }else
      {
        
        pool.query('UPDATE tbl_insaf_notice_to_mariner_detail SET deleted_at=$1,is_delete=$2 WHERE ntm_id = $3 ', [id], (error, results) =>  { 
          if (error) {
            throw error
          }
        })

        response.status(200).send({success:true,data:'data berhasil dihapus'})
      }
    })
  });
}

const download = (request, response) => {
  const filename = request.params.filename;
  console.log(filename);
  var doc_path = __dirname + path.join('/dokumens/ntm/'+ filename);
  console.log(doc_path);
  response.download(doc_path);
  //response.status(200).send({success:true,data:'data berhasil diunduh'})
}


const createDetail = (request, response) => {
  const { ntm_id, voyage_id, user_id, created_by } 
  = request.body
  pool.query('INSERT INTO tbl_insaf_notice_to_mariner_detail (ntm_id, voyage_id, user_id, created_by) VALUES ($1, $2, $3, $4)'
  , [ntm_id, voyage_id, user_id, created_by], (error, results) =>{
    if (error) {
      // throw error
      response.status(201).send(error)
      if (error.code == '23505')
      {
          //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
          response.status(201).send({status:false,data:`Duplicate Data`})
          return;
      }
    }
    else
    {
      response.status(200).send({status:true,data:`Added Detail Successfuly !`})
    }      
  })
}

const readDetail = (request, response) => {

    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

  
    pool.query('SELECT count(*) as total FROM tbl_insaf_notice_to_mariner_detail where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_notice_to_mariner_detail where is_delete=false ORDER BY id ASC'
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

const read_by_idDetail = (request, response) => {

    const id = parseInt(request.params.id);
    //console.log('Here');
    //console.log(id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_notice_to_mariner_detail where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_notice_to_mariner_detail where id=$1 and is_delete=false'
     pool.query(sql,[id] ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })

}

const updateDetail = (request,response) => {
  const id = parseInt(request.params.id)
  const {ntm_id, voyage_id, user_id } = request.body
  var updated_at = new Date()
  pool.query(    
    'UPDATE tbl_insaf_notice_to_mariner_detail SET ntm_id = $1, voyage_id = $2, user_id = $3, updated_at = $4 WHERE id = $5',
      [ntm_id, voyage_id, user_id, updated_at, id],
      (error1, results) => {
        if (error1) {
          throw error1
        }
        response.status(200).send({status:true,data:`User modified with ID: ${id}`})
      }
    )
}

const deleteDetail = (request, response) => {
  const id = parseInt(request.params.id)
  // response.status(200).json(id)
  pool.query('UPDATE tbl_insaf_notice_to_mariner_detail SET is_delete= true  WHERE  id = $1 ', [id], (error, results) =>  { 
  
    if (error) {
      throw error
    }
    
    response.status(200).json({status:true, data:results.rows})
  })
}

module.exports = {
create,
read,
read_by_id,
update,
delete_,
download,
createDetail,
readDetail,
read_by_idDetail,
updateDetail,
deleteDetail,
}