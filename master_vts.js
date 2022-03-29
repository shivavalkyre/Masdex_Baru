const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const req = require('request')
const cheerio = require ('cheerio')

var i=0;
var USD_start=0;
var USD_end=0;
var satuan=1;
var nilai_jual=0;
var nilai_beli=0;
var nilai_tengah=0;




const create = (request, response) => {
    const {voyage_id,status_bernavigasi,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,jenis_telkompel,kurs_tengah,preamble,berita,ck,tagihan_lsc,tagihan_llc,total_tagihan,is_payable,mmsi,no_jurnal,jenis_berita,more_information,jenis_pelayaran,communication_station,user_agen,company_agen} 
    = request.body

   // get kurs_tengah
    if (mmsi.length==0){
    pool.query('INSERT INTO tbl_insaf_master_vts (voyage_id,status_bernavigasi,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,jenis_telkompel,kurs_tengah,preamble,berita,ck,tagihan_lsc,tagihan_llc,total_tagihan,is_payable,no_jurnal,jenis_berita,more_information,jenis_pelayaran,communication_station,user_agen,company_agen) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9, $10, $11, $12, $13, $14, $15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)'
    , [parseInt(voyage_id),status_bernavigasi,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,jenis_telkompel,parseFloat(kurs_tengah),preamble,berita,ck,parseFloat(tagihan_lsc),parseFloat(tagihan_llc),parseFloat(total_tagihan),is_payable,no_jurnal,jenis_berita,more_information,jenis_pelayaran,communication_station,user_agen,company_agen], (error, results) =>{
      if (error) {
         throw error
        response.status(201).send(error)
        if (error.code == '23505')
        {
            //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
            response.status(400).send('Duplicate data')
            return;
        }
      }else
      {
        pool.query(`SELECT id FROM tbl_insaf_master_vts ORDER BY id DESC limit 1`, (error90, results90) => {
            if (error90) {
                response.status(400).send({success:false,data:error90})
            }
            let master_vts_id = results90.rows[0].id;
            response.status(200).send(
                {
                    success:true,
                    data:'data master vts berhasil dibuat',
                    last_id: master_vts_id
                }
            )
        })
      }

    })
    }else
    {
        pool.query('INSERT INTO tbl_insaf_master_vts (voyage_id,status_bernavigasi,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,jenis_telkompel,kurs_tengah,preamble,berita,ck,tagihan_lsc,tagihan_llc,total_tagihan,is_payable,mmsi,no_jurnal,jenis_berita,more_information,jenis_pelayaran,communication_station,user_agen,company_agen) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9, $10, $11, $12, $13, $14, $15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)'
        , [parseInt(voyage_id),status_bernavigasi,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,jenis_telkompel,parseFloat(kurs_tengah),preamble,berita,ck,parseFloat(tagihan_lsc),parseFloat(tagihan_llc),parseFloat(total_tagihan),is_payable,mmsi,no_jurnal,jenis_berita,more_information,jenis_pelayaran,communication_station,user_agen,company_agen], (error, results) =>{
          if (error) {
             throw error
            response.status(201).send(error)
            if (error.code == '23505')
            {
                //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                response.status(400).send('Duplicate data')
                return;
            }
          }else
          {
              
                pool.query(`SELECT id FROM tbl_insaf_master_vts ORDER BY id DESC limit 1`, (error90, results90) => {
                    if (error90) {
                        response.status(400).send({success:false,data:error90})
                    }
                    let master_vts_id = results90.rows[0].id;
                    response.status(200).send(
                        {
                            success:true,
                            data:'data master vts berhasil dibuat',
                            last_id: master_vts_id
                        }
                    )
                })
          }
    
        })
    }
}


const read = (request, response) => {

    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_master_vts where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_master_vts where is_delete=false ORDER BY id ASC'
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
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_master_vts where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_master_vts where id=$1 and is_delete=false'
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

const read_by_voyage_id = (request, response) => {

    const id = parseInt(request.params.id);
    //console.log('Here');
    //console.log(id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_master_vts where voyage_id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_master_vts where voyage_id=$1 and is_delete=false'
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

const read_by_voyage_pkk = (request, response) => {

    // const id = parseInt(request.params.id);
    //console.log('Here');
    //console.log(id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_master_vts where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT c.id, c.voyage_id, v.pkk_id, c.created_at as date, p.ship_name, p.imo, p.call_sign, p.gt, p.mmsi, p.flag, c.status_bernavigasi, c.degree1 as lat_deg, c.minute1 as lat_min, c.second1 as lat_sec, c.direction1 as lat_dir, c.degree2 as long_deg, c.minute2 as long_min, c.second2 as long_sec, c.direction2 as long_dir, jb.jenis_berita, c.more_information, c.kurs_tengah, c.total_tagihan, c.is_delete, pp.nama_lengkap as perusahaan_pelayaran, pa.nama_lengkap as perusahaan_agen, c.communication_station, p.pelabuhan_asal, p.pelabuhan_tujuan, p.pelabuhan_selanjutnya FROM tbl_insaf_master_vts c left join tbl_insaf_jenis_berita jb on jb.id = c.jenis_berita left join tbl_insaf_voyage v on v.id = c.voyage_id left join masdex_pkk p on v.pkk_id = p.id left join tbl_stakeholders pp on p.perusahaan_pelayaran_id = pp.id left join tbl_stakeholders pa on c.company_agen = pa.id where c.is_delete=false  order by c.id asc'
     pool.query(sql, (error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })

}

const read_by_voyage_detail = (request, response) => {

    const id = parseInt(request.params.id);
    //console.log('Here');
    //console.log(id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_master_vts where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT c.id, c.voyage_id, v.pkk_id, c.created_at as date, p.ship_name, p.imo, p.call_sign, p.gt, p.mmsi, p.flag, c.status_bernavigasi, c.degree1 as lat_deg, c.minute1 as lat_min, c.second1 as lat_sec, c.direction1 as lat_dir, c.degree2 as long_deg, c.minute2 as long_min, c.second2 as long_sec, c.direction2 as long_dir, jb.jenis_berita, c.more_information, c.kurs_tengah, c.total_tagihan, c.is_delete, pp.nama_lengkap as perusahaan_pelayaran, pa.nama_lengkap as perusahaan_agen, c.communication_station, p.pelabuhan_asal, p.pelabuhan_tujuan, p.pelabuhan_selanjutnya FROM tbl_insaf_master_vts c left join tbl_insaf_jenis_berita jb on jb.id = c.jenis_berita left join tbl_insaf_voyage v on v.id = c.voyage_id left join masdex_pkk p on v.pkk_id = p.id left join tbl_stakeholders pp on p.perusahaan_pelayaran_id = pp.id left join tbl_stakeholders pa on c.company_agen = pa.id where c.id=$1 and c.is_delete=false  order by c.id asc'
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
    const { voyage_id,status_bernavigasi,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,jenis_telkompel,kurs_tengah,preamble,berita,ck,tagihan_lsc,tagihan_llc,total_tagihan,is_payable,mmsi,no_jurnal,jenis_berita,more_information,jenis_pelayaran,communication_station,user_agen,company_agen } 
    = request.body;
    let doc;
    //console.log(mmsi);

    pool.query('SELECT count(*) as total FROM tbl_insaf_master_vts where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_insaf_master_vts where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

          const update_time = new Date;

        if (mmsi.length==0){

            pool.query('UPDATE tbl_insaf_master_vts SET voyage_id=$1,status_bernavigasi=$2,degree1=$3,minute1=$4,second1=$5,direction1=$6,degree2=$7,minute2=$8,second2=$9,direction2=$10,jenis_telkompel=$11,kurs_tengah=$12,preamble=$13,berita=$14,ck=$15,tagihan_lsc=$16,tagihan_llc=$17,total_tagihan=$18,updated_at=$19,is_payable=$20,no_jurnal=$21,jenis_berita=$22,more_information=$23,jenis_pelayaran=$25,communication_station=$26,user_agen=$27,company_agen=$28 where id=$24'
         , [parseInt(voyage_id),status_bernavigasi,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,jenis_telkompel,parseFloat(kurs_tengah),preamble,berita,ck,parseFloat(tagihan_lsc),parseFloat(tagihan_llc),parseFloat(total_tagihan),update_time,is_payable,no_jurnal,jenis_berita,more_information, id, jenis_pelayaran, communication_station,user_agen,company_agen], (error, results) =>{
           if (error) {
              throw error
             //response.status(201).send(error)
             //console.log(error);
             if (error.code == '23505')
             {
                 //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                 response.status(400).send('Duplicate data')
                 return;
             }
           }else
           {
               response.status(200).send({success:true,data:'data master vts berhasil diperbarui'})
           }
     
         })

        }else{

            pool.query('UPDATE tbl_insaf_master_vts SET voyage_id=$1,status_bernavigasi=$2,degree1=$3,minute1=$4,second1=$5,direction1=$6,degree2=$7,minute2=$8,second2=$9,direction2=$10,jenis_telkompel=$11,kurs_tengah=$12,preamble=$13,berita=$14,ck=$15,tagihan_lsc=$16,tagihan_llc=$17,total_tagihan=$18,updated_at=$19,is_payable=$20,mmsi=$21,no_jurnal=$22,jenis_berita=$23,more_information=$24,jenis_pelayaran=$26,communication_station=$27,user_agen=$28,company_agen=$29 where id=$25'
            , [parseInt(voyage_id),status_bernavigasi,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,jenis_telkompel,parseFloat(kurs_tengah),preamble,berita,ck,parseFloat(tagihan_lsc),parseFloat(tagihan_llc),parseFloat(total_tagihan),update_time,is_payable,mmsi,no_jurnal,jenis_berita,more_information,id,jenis_pelayaran,communication_station,user_agen,company_agen], (error, results) =>{
              if (error) {
                 throw error
                //response.status(201).send(error)
                //console.log(error);
                if (error.code == '23505')
                {
                    //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                    response.status(400).send('Duplicate data')
                    return;
                }
              }else
              {
                  response.status(200).send({success:true,data:'data master vts berhasil diperbarui'})
              }
        
            })

        }
        
         




        });

        

   

   
    
}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 

    pool.query('SELECT count(*) as total FROM tbl_insaf_master_vts where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_insaf_master_vts where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_insaf_master_vts SET deleted_at=$1,is_delete=$2 where id=$3'
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
               response.status(200).send({success:true,data:'data master vts berhasil dihapus'})
           }
     
         })




        });
    
}

// ========================================= KURS TENGAH ==================================================

const kurs_tengah_data = (request,response) => {
    let url = 'https://www.ortax.org/ortax/?mod=kursbi'
    req(url, function (err, res, body) {
        if (err && res.statusCode !== 200) throw err;
        let $ = cheerio.load(body);
        
        $('table.table-striped').each((i, value) => {
            
            $(value).find('td').each((j, data) => {
                //console.log($(data).text());
                if ($(data).text() === 'Dolar Amerika Serikat')
                    
                    {
                        //console.log(i);
                        if (i==115){
                        //console.log(i)
                        //console.log($(data).text())
                        USD_start = i
                        }
                    }
                else
                    {
                      if (i>=115){
                        if (i==USD_start+1)
                        {
                            //console.log(i)
                            
                            // satuan
                            satuan = $(data).text()
                            //console.log('satuan: '+ satuan)
                            
                        }
                        else if (i==USD_start+2)
                        {
                            //console.log(i)
                            // nilai jual
                            nilai_jual=$(data).text();
                            //console.log(nilai_jual)
                            //console.log('nilai_jual: '+ nilai_jual);
                            
                        }
                        else if (i==USD_start+3)
                        {
                            //console.log(i)
                            // nilai beli
                            nilai_beli=$(data).text();
                            //console.log('nilai_beli: '+ nilai_beli);
                            //console.log(nilai_beli)
                            
                        }
                        else if (i==USD_start+4)
                        {
                            //console.log(i)
                            // nilai tengah
                            nilai_tengah=$(data).text();
                            //console.log('nilai_tengah: '+ nilai_tengah);
                            //console.log(nilai_tengah)
                            //return
                            //return nilai_tengah;
                            
                        }
                     }
                    }
                    
              //console.log($(data).text() + ' i:' + i)
              i++    
            })
           
        })
        USD_start=0
        //response.status(200).json({success:true,data:nilai_tengah})
    })
   
    i=0;
    response.status(200).json({success:true,data:nilai_tengah})
}


const kurs_tengah = (request, response) => 
{
                    // get kurs tengah
                    var myInt = setInterval(function () {
                        // let url ='http://localhost:3012/api/V1/kurs'
                        let url ='http://api-insafmasdex.disnavpriok.id/api/V1/kurs'

                        req(url, function (err, res, body) {
                            //console.log(body)
                            var mykurs = JSON.parse(body)
                            //console.log(mykurs.data)
                            if (mykurs.data>"0")
                            {
                                kurs = mykurs.data
                                response.status(200).json({success:true,data:kurs})
                                //console.log(kurs)
                                clearInterval(myInt);
                            }
                        })
                    }, 500);
}

// ======================================================================================================================

// ========================================= CEK TOTAL TAGIHAN ==========================================================
const cek_total_tagihan= (request, response)  =>
{
    // =========== location ===========
    // 1. VTS
    // 2. SROP
    const location = parseInt(request.params.location)

    var Total_Tagihan = 0;
    var bendera = '';
    var counter = 5;
    var kurs = 0;

    if (location == 1)
    {
        // VTS
        const {jenis_pelayaran,mmsi} = request.body
        // hitung cost
        // 1. get GT Kapal,bendera from mmsi -> query
        // 2. jenis pelayaran (dalam,luar) -> param
        //jenis_pelayaran = '1' 

        pool.query('SELECT flag,gt FROM tbl_masdex_kapal WHERE mmsi=$1',[mmsi], (error, results) => {
            if (error) {
              throw error
            }
            //response.status(200).json(results.rows)
            var str = results.rows[0].flag
            bendera = str.toUpperCase()
            GT =results.rows[0].gt

            
        if (jenis_pelayaran=='VDN' || bendera != 'INDONESIA')
        {
            // get kurs tengah
                 var myInt = setInterval(function () {
                    // let url ='http://localhost:3012/api/V1/kurs'
                    let url ='http://api-insafmasdex.disnavpriok.id/api/V1/kurs'

                    req(url, function (err, res, body) {
                        var mykurs = JSON.parse(body)
                        //console.log(mykurs.data)
                        if (mykurs.data>"0")
                        {
                            var str = mykurs.data
                            kurs = parseFloat(str.replace(".",""))
                            //response.status(200).json({success:true,data:kurs})
                            //console.log(kurs)

                            if (GT<=5000)
                            {
                                Total_Tagihan = 20 * kurs
                            }
                            else if(GT>5000 && GT<=10000)
                            {
                                 Total_Tagihan = 25 * kurs
                                 
                            }
                            else if (GT>10000)
                            {   
                                Total_Tagihan = 30 * kurs
                            }

                            response.status(200).json({success:true,data:{kurs_tengah:kurs,total_tagihan:Total_Tagihan}})

                            clearInterval(myInt);
                        }
                    })
                }, 500);




        }
        else
        {
            if (GT<=300)
            {
                Total_Tagihan =75000
            }
            else if(GT>300 && GT<=1000)
            {
                Total_Tagihan = 100000
            }
            else if(GT>1000 && GT<=3000)
            {
                Total_Tagihan = 125000
            }
            else if(GT>3000 && GT<=5000)
            {
                Total_Tagihan = 150000
            }
            else if(GT>5000 && GT<=10000)
            {
                Total_Tagihan = 175000
            }
            else if(GT>10000)
            {
                Total_Tagihan = 200000
            }
            response.status(200).json({success:true,data:Total_Tagihan})
        }


          })

          //console.log(bendera)


    }

    else
    {
        // SROP
        //const {no_jurnal,tanggal,sumber_informasi,keterangan,agen,jenis_pelayaran,mmmsi,status_bernavigasi,degree1,minute1,second1,direction1,degree2,minute2,second2,direaction2,pelabuhan_asal,pelabuhan_tujuan,eta} = request.body
        const {mmsi,kedatangan_lsc,kedatangan_llc,kedatangan_pengali,isi_berita,jenis_muatan,permintaan_lokasi_sandar,permintaan_lokasi_sts,permintaan_karantina,permintaan_pemeriksaan_bea_cukai,permintaan_pemeriksaan_imigrasi,permintaan_bunker_bahan_bakar,permintaan_bunker_air_tawar,permintaan_ship_chalander,permintaan_suku_cadang,permintaan_layanan_perbaikan_kapal,permintaan_ambulance,permintaan_layanan_medis,permintaan_layanan_fumigasi,permintaan_layanan_crewing,permintaan_layanan_sertifikasi_dan_buku_pelaut,informasi_dan_permintaan_lain} = request.body
        var isi_telegram= isi_berita;

        var jenis_muatan1="";
        var permintaan_lokasi_sandar1="";
        var permintaan_lokasi_sts1="";
        var permintaan_karantina1="";
        var permintaan_pemeriksaan_bea_cukai1=";"
        var permintaan_pemeriksaan_imigrasi1="";
        var permintaan_bunker_bahan_bakar1="";
        var permintaan_bunker_air_tawar1="";
        var permintaan_ship_chalander1="";
        var permintaan_suku_cadang1=""
        var permintaan_layanan_perbaikan_kapal1="";
        var permintaan_ambulance1="";
        var permintaan_layanan_medis1="";
        var permintaan_layanan_fumigasi1=""
        var permintaan_layanan_crewing1="";
        var permintaan_layanan_sertifikasi_dan_buku_pelaut1="";
        var informasi_dan_permintaan_lain1="";
        
            //1
            if (typeof jenis_muatan === 'undefined'){
                jenis_muatan1 = "";
                //console.log('here')
            }else{
                if (jenis_muatan !== null){
                    jenis_muatan1 = " "+jenis_muatan;
                }else{
                    jenis_muatan1 = "";
                }
                //console.log('here1')
            }
            //2
            if (typeof permintaan_lokasi_sandar === 'undefined'){
                permintaan_lokasi_sandar1 = "";
                //console.log('here')
            }else{
                if (permintaan_lokasi_sandar!== null){
                    permintaan_lokasi_sandar1 = " "+ permintaan_lokasi_sandar;
                //console.log('here1')
                }else{
                    permintaan_lokasi_sandar1 = "";
                }
            }
            //3
            if (typeof permintaan_lokasi_sts === 'undefined'){
                permintaan_lokasi_sts1 = "";
            }else{
                if(permintaan_lokasi_sts!== null){
                permintaan_lokasi_sts1 = " "+ permintaan_lokasi_sts;
                }else{
                    permintaan_lokasi_sts1 = "";
                }
            }
            //4
            if (typeof permintaan_karantina === 'undefined'){
                permintaan_karantina1 = "";
            }else{
                if(permintaan_karantina !== null){
                permintaan_karantina1 = " "+ permintaan_karantina;
                }else{
                    permintaan_karantina1 = "";
                }
            }
            //5
            if (typeof permintaan_pemeriksaan_bea_cukai === 'undefined'){
                permintaan_pemeriksaan_bea_cukai1 = "";
            }else{
                if ( permintaan_pemeriksaan_bea_cukai!==null){
                    permintaan_pemeriksaan_bea_cukai1 = " "+ permintaan_pemeriksaan_bea_cukai;
                }else{
                    permintaan_pemeriksaan_bea_cukai1 = "";
                }
            }
            //6
            if (typeof permintaan_pemeriksaan_imigrasi === 'undefined'){
                permintaan_pemeriksaan_imigrasi1 = "";
            }else{
                if(permintaan_pemeriksaan_imigrasi!== null){
                permintaan_pemeriksaan_imigrasi1 = " "+ permintaan_pemeriksaan_imigrasi;
                }else{
                    permintaan_pemeriksaan_imigrasi1 = "";
                }
            }
            //7
            if (typeof permintaan_bunker_bahan_bakar === 'undefined'){
                permintaan_bunker_bahan_bakar1 = "";
            }else{
                if(permintaan_bunker_bahan_bakar !== null){
                permintaan_bunker_bahan_bakar1 = " "+ permintaan_bunker_bahan_bakar;
                }else{
                    permintaan_bunker_bahan_bakar1 = "";
                }
            }
            //8
            if (typeof permintaan_bunker_air_tawar === 'undefined'){
                permintaan_bunker_air_tawar1 = "";
            }else{
                if (permintaan_bunker_air_tawar !== null){
                permintaan_bunker_air_tawar1 = " "+ permintaan_bunker_air_tawar;
                }else{
                    permintaan_bunker_air_tawar1 = "";
                }
            }
            //9
            if (typeof permintaan_ship_chalander === 'undefined'){
                permintaan_ship_chalander1 = "";
            }else{
                if(permintaan_ship_chalander!==null){
                permintaan_ship_chalander1 = " "+ permintaan_ship_chalander;
                }else{
                    permintaan_ship_chalander1 = "";
                }
            }
            //10
            if (typeof permintaan_suku_cadang === 'undefined'){
                permintaan_suku_cadang1 = "";
            }else{
                if(permintaan_suku_cadang !== null){
                permintaan_suku_cadang1 = " "+ permintaan_suku_cadang;
                }else{
                    permintaan_suku_cadang1 = "";
                }
            }
            //11
            if (typeof permintaan_layanan_perbaikan_kapal === 'undefined'){
                permintaan_layanan_perbaikan_kapal1 = "";
            }else{
                if (permintaan_layanan_perbaikan_kapal!==null){
                permintaan_layanan_perbaikan_kapal1 = " "+ permintaan_layanan_perbaikan_kapal;
                } else{
                    permintaan_layanan_perbaikan_kapal1 = "";
                }
            }
            //12
            if (typeof permintaan_ambulance === 'undefined'){
                permintaan_ambulance1 = "";
            }else{
                if(permintaan_ambulance !== null){
                permintaan_ambulance1 = " "+ permintaan_ambulance;
                }else {
                    permintaan_ambulance1 = "";
                }
            }
            //13
            if (typeof permintaan_layanan_medis === 'undefined'){
                permintaan_layanan_medis1 = "";
            }else{
                if(permintaan_layanan_medis !== null){
                permintaan_layanan_medis1 = " "+ permintaan_layanan_medis;
                } else{
                    permintaan_layanan_medis1 = "";
                }
            }
            //14
            if (typeof permintaan_layanan_fumigasi === 'undefined'){
                permintaan_layanan_fumigasi1 = "";
            }else{
                if(permintaan_layanan_fumigasi!== null){
                permintaan_layanan_fumigasi1 = " "+ permintaan_layanan_fumigasi;
                }else{
                    permintaan_layanan_fumigasi1 = "";
                }
            }
            //15
            if (typeof permintaan_layanan_crewing === 'undefined'){
                permintaan_layanan_crewing1 = "";
            }else{
                if (permintaan_layanan_crewing!==null){
                permintaan_layanan_crewing1 = " "+ permintaan_layanan_crewing;
                }else{
                    permintaan_layanan_crewing1 = "";
                }
            }
            //16
            if (typeof permintaan_layanan_sertifikasi_dan_buku_pelaut === 'undefined'){
                permintaan_layanan_Medis1 = "";
            }else{
                if(permintaan_layanan_sertifikasi_dan_buku_pelaut!==null){
                permintaan_layanan_sertifikasi_dan_buku_pelaut1 = " "+ permintaan_layanan_sertifikasi_dan_buku_pelaut;
                }else{
                    permintaan_layanan_Medis1 = "";
                }
            }
            //17
            if (typeof informasi_dan_permintaan_lain === 'undefined'){
                informasi_dan_permintaan_lain1 = "";
            }else{
                if (informasi_dan_permintaan_lain!==null){
                informasi_dan_permintaan_lain1 = " "+ informasi_dan_permintaan_lain;
                }else{
                    informasi_dan_permintaan_lain1 = "";
                }
            }

        var berita_tambahan = jenis_muatan1.concat(permintaan_lokasi_sandar1,permintaan_lokasi_sts1,permintaan_karantina1,permintaan_pemeriksaan_bea_cukai1,permintaan_pemeriksaan_imigrasi1,permintaan_bunker_bahan_bakar1,permintaan_bunker_air_tawar1,permintaan_ship_chalander1,permintaan_suku_cadang1,permintaan_layanan_perbaikan_kapal1,permintaan_ambulance1+permintaan_layanan_medis1,permintaan_layanan_fumigasi1,permintaan_layanan_crewing1,permintaan_layanan_sertifikasi_dan_buku_pelaut1,informasi_dan_permintaan_lain1,'|');
        //console.log(berita_tambahan);
        //console.log(berita_tambahan.length);
        //var words_c = berita_tambahan;
        //words_c = words_c.replace(/\s/g, '|');
        //var numberOfWords1 = berita_tambahan.match(/(\w+)/g).length;
        //console.log(numberOfWords1);

        var data = isi_telegram.concat(berita_tambahan);
        //console.log (data);
        var shipname = ''
        var callsign = ''
        var preamble = ''
        // setting preamble by mmsi and date
        pool.query('SELECT ship_name,call_sign FROM tbl_masdex_kapal WHERE mmsi=$1',[mmsi],(error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
            //response.status(200).send({success:true,data:results.rows})
            shipname = results.rows[0].ship_name
            callsign = results.rows[0].call_sign

            // tanggal process
            var today = new Date()
            var dd = today.getDate();

            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();

            var hh = today.getHours()

            if (hh<10)
            {
              hh = '0'+hh;
            }
            if (min<10)
            {
              min = '0'+ min;
            }
            var min = today.getMinutes()
            var jam = hh +':'+ min
            
            if(dd<10) 
            {
              dd='0'+dd;
            } 

            if(mm<10) 
            {
              mm='0'+mm;
            } 
            today = dd+'/'+mm+'/'+yyyy 

            preamble = shipname+'/'+ callsign + ' CK:' + jumlah_ck_berbayar +'  '+ today + ' '+ jam


        })
        
        
        var jumlah_ck=0;
        var jumlah_ck_berbayar=0;
        var paid_ck =0;
        var lengthword=0
        var numberOfLineBreaks = (data.match(/\n/g)||[]).length;
        var numberOfWords = data.match(/(\w+)/g).length;
        var words1 = data;
        words1 = words1.replace(/\s/g, '|');
        console.log(words1);
        var word_counter = 0;
        var all_word_counter =0;

        //console.log(words1.length);

        for (i=0;i<=words1.length;i++)
        {
            //console.log(words1[i]);
            if (words1[i] ==='|')
            {
                //console.log('space');
                //console.log('wc:' + word_counter);
                
                all_word_counter = all_word_counter +1;
                //console.log ('awc:'+ all_word_counter);

                if (word_counter>10)
                {
                    all_word_counter = all_word_counter +1;
                }
                word_counter = 0;
            } 
            else if(words1 === undefined)
            {
                word_counter = word_counter +1;	
            } 
            else
            {
                //counting word
                word_counter = word_counter +1;	
            }
        }

        jumlah_ck_berbayar = all_word_counter;


        if (jumlah_ck_berbayar <=7)
        {
            jumlah_ck_berbayar = 7;
        }

        paid_ck = jumlah_ck_berbayar;
        console.log('paid_ck: ' + paid_ck);
        //console.log(jumlah_ck_berbayar)
        //console.log(numberOfWords)

        if (jumlah_ck_berbayar == numberOfWords)
        {
            jumlah_ck_berbayar = jumlah_ck_berbayar
        }
        else
        {
            if (jumlah_ck_berbayar > numberOfWords){
            jumlah_ck_berbayar = jumlah_ck_berbayar  +'/' + numberOfWords
            }else{
                jumlah_ck_berbayar = numberOfWords
            }
        }

            //isi berita
       
        var lsc = parseFloat(kedatangan_lsc||0.6)
        var llc = parseFloat(kedatangan_llc||0.15)

        //console.log('lsc: ' + lsc);
        //console.log('llc: ' + llc);

        var pengali = parseFloat(kedatangan_pengali||2.5374)
        console.log('pengali: '+ pengali)

        // get kurs tengah
        var myInt = setInterval(function () {
        //   let url ='http://localhost:3012/api/V1/kurs'
        let url ='http://api-insafmasdex.disnavpriok.id/api/V1/kurs'

          req(url, function (err, res, body) {
              var mykurs = JSON.parse(body)
              //console.log(mykurs.data)
              if (mykurs.data>"0")
              {
                var str = mykurs.data
                kurs = parseFloat(str.replace(".",""))
                var kurstengah = kurs
                var tagihan_llc = Math.round (((llc*paid_ck)/pengali) * kurstengah,2)
                //console.log('tagihan llc: '+ tagihan_llc);
                var tagihan_lsc = Math.round(((lsc*paid_ck)/pengali)*kurstengah,2)
                //console.log('tagihan lsc: '+ tagihan_lsc);
                var total_tagihan = tagihan_llc+tagihan_lsc
                //var jumlah_karakter = jumlah_ck_berbayar +'/' +jumlah_ck
                //var total_tagihan_lsc = tagihan_lsc
                //var total_tagihan_llc = tagihan_llc
                response.status(200).json({success:true,data:{preamble:preamble,ck:jumlah_ck_berbayar,kurs_tengah:kurstengah,tagihanLsc:tagihan_lsc,tagihan_llc:tagihan_llc,total_tagihan:total_tagihan}})
                //console.log(total_tagihan)
                clearInterval(myInt);
              }
          })
      }, 500);

        //var kurstengah = kurs
        //var tagihan_llc = Math.round (((llc*jumlah_ck_berbayar)/pengali) * kurstengah,2)
        //var tagihan_lsc = Math.round(((lsc*jumlah_ck_berbayar)/pengali)*kurstengah,2)
        //var total_tagihan = tagihan_llc+tagihan_lsc
        //var jumlah_karakter = jumlah_ck_berbayar +'/' +jumlah_ck
        //var total_tagihan_lsc = tagihan_lsc
        //var total_tagihan_llc = tagihan_llc
    }

}
// ======================================================================================================================
module.exports = {
    create,
    read,
    read_by_id,
    read_by_voyage_id,
    read_by_voyage_pkk,
    read_by_voyage_detail,
    update,
    delete_,
    kurs_tengah_data,
    kurs_tengah,
    cek_total_tagihan
    }