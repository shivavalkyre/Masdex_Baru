const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var complete_path = '';
var password_hash;


const create = (request, response) => {
    const {
        username,
        password,
        email,
        photo,
        nama_lengkap,
        stakeholder_id,
        id_spesialis,
        role_id
    } = request.body
    pool.query('SELECT Count(*) as total FROM masdex_users_all WHERE username = $1 and is_delete = false ', [username], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows[0].total > 0) {
            // pool.query('SELECT password from tbl_user_stakeholders WHERE username =$1',[username],(error,results) => {
            //     bcrypt.compare(password, results.rows[0].password, function(err, res) {

            //         if(res) {
            //             //console.log('Your password mached with database hash password');
            //             response.status(200).json({success:true,data: "User sudah ada" });
            //         } else {
            //             //console.log('Your password not mached.');
            //             response.status(400).json({success:true,data: "password tidak sama" });
            //         }
            //     });

            // })
            response.status(200).json({
                success: true,
                data: "User sudah ada"
            });

        } else {
            // user not exist
            let name = 'default.jpg'
            let complete_path = 'https://api-insafmasdex.disnavpriok.id/api/V1/dokumens/user_stakeholder/' + name;
            if (request.files) {
                let sampleFile = request.files.photo;
                console.log(sampleFile);
                const now = Date.now()
                name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
                complete_path = 'https://api-insafmasdex.disnavpriok.id/api/V1/dokumens/user_stakeholder/' + name;
                console.log(__dirname);
                sampleFile.mv(path.join(__dirname + '/dokumens/user_stakeholder/') + name, function (err) {
                    if (err)
                        console.log(err);
                });
            }else
            {
                name=null;
                complete_path=null;
            }

            bcrypt.genSalt(10, function (err, res) {
                salt = res
                bcrypt.hash(password, salt, function (err, res) {
                    password_hash = res;
                    console.log(password_hash);
                    if (role_id==null){
                        role_id=0;
                    }
                    pool.query('INSERT INTO tbl_user_stakeholders (username,password,email,photo,nama_lengkap,url_photo, stakeholder_id, role_id, id_spesialis) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)', [username, password_hash, email, name, nama_lengkap, complete_path, stakeholder_id, role_id, id_spesialis], (error, results) => {
                        if (error) {
                            throw error
                        }
                        response.status(200).json({
                            success: true,
                            data: "User baru berhasil dibuat"
                        });
                    })
                });
            });



        }
    })


}

const read = (request, response) => {
    const {
        username,
        password
    } = request.body

    pool.query('SELECT count(*) as total from tbl_user_stakeholders WHERE username =$1 and is_delete=false', [username], (error, results) => {
        if (results.rows[0].total > 0) {
            pool.query('SELECT * from tbl_user_stakeholders WHERE username =$1 and is_delete=false', [username], (error, results) => {

                bcrypt.compare(password, results.rows[0].password, function (err, res) {

                    if (res) {
                        //console.log('Your password mached with database hash password');
                        //response.status(200).json({success:true,data: "User ditemukan" });
                        const token = generateAccessToken({
                            username: username
                        })
                        console.log(token);
                        response.status(200).json({
                            "token": token,
                            "id": results.rows[0].id,
                            "username": username
                        })
                    } else {
                        //console.log('Your password not mached.');
                        response.status(400).json({
                            success: false,
                            data: "password tidak sama"
                        });
                    }
                });

            })
        } else {
            response.status(400).json({
                success: false,
                data: "user tidak ditemukan"
            });
        }


    })
}

const readall = (request, response) => {
    var res = []
    var items = []
    pool.query('SELECT count(*) as total from tbl_user_stakeholders', (error, results) => {

        pool.query("SELECT u.*, r.role, 'eksternal' as type from tbl_user_stakeholders u left join tbl_role r on r.id = u.role_id WHERE u.is_delete=$1", [false], (error, results1) => {
            //bcrypt.compare(password, results.rows[0].password, function(err, res) {

            if (results1) {
                items.push({
                    rows: results1.rows
                })
                res.push(items)
                response.status(200).json({
                    success: true,
                    data: res
                })

            } else {
                //console.log('Your password not mached.');
                response.status(400).json({
                    success: false,
                    data: "password tidak sama"
                });
            }
        });

    });
}

const readeksternal = (request, response) => {
    var res = []
    var items = []
    pool.query('SELECT count(*) as total from tbl_user_stakeholders', (error, results) => {

        pool.query("SELECT u.id, u.nama_lengkap, u.username, u.password, u.email, u.role_id, r.role, 'eksternal' as type, u.created_at, u.updated_at, u.deleted_at, u.is_delete, u.stakeholder_id as company_id, s.nama_lengkap as company_name from tbl_user_stakeholders u left join tbl_stakeholders s on s.id = u.stakeholder_id left join tbl_role r on r.id = u.role_id WHERE u.role_id in (11,12,29,13,14) and u.is_delete=$1", [false], (error, results1) => {
            //bcrypt.compare(password, results.rows[0].password, function(err, res) {

            if (results1) {
                items.push({
                    rows: results1.rows
                })
                res.push(items)
                response.status(200).json({
                    success: true,
                    data: res
                })

            } else {
                //console.log('Your password not mached.');
                response.status(400).json({
                    success: false,
                    data: "password tidak sama"
                });
            }
        });

    });
}

const read_nahkoda = (request, response) => {
    var res = []
    var items = []
    pool.query('SELECT count(*) as total from tbl_user_stakeholders WHERE is_delete=$1 AND role_id=(SELECT id FROM tbl_role WHERE role=$2)', [false, 'Nahkoda'], (error, results) => {

        pool.query('SELECT * from tbl_user_stakeholders WHERE is_delete=$1 AND role_id=(SELECT id FROM tbl_role WHERE role=$2)', [false, 'Nahkoda'], (error, results1) => {
            //bcrypt.compare(password, results.rows[0].password, function(err, res) {

            if (results1) {
                items.push({
                    rows: results1.rows
                })
                res.push(items)
                response.status(200).json({
                    success: true,
                    data: res
                })

            } else {
                //console.log('Your password not mached.');
                response.status(400).json({
                    success: false,
                    data: "password tidak sama"
                });
            }
        });

    });


}

const detail_profile = (request, response) => {

    var res = []
    var items = []
    const id = parseInt(request.params.id);
    pool.query('SELECT count(*) as total from tbl_user_stakeholders WHERE id =$1 and is_delete=false', [id], (error, results) => {
        res.push({
            total: results.rows[0].total
        })
        if (results.rows[0].total > 0) {
            pool.query('SELECT tbl_user_stakeholders.nama_lengkap as nama_user, tbl_stakeholders.nama_lengkap as nama_kantor, tbl_stakeholders.unit_kantor, tbl_stakeholders.npwp, tbl_stakeholders.telepon_kantor, tbl_stakeholders.alamat_kantor, tbl_user_stakeholders.email, tbl_user_stakeholders.url_photo, tbl_stakeholders.url_logo from tbl_user_stakeholders JOIN tbl_stakeholders ON tbl_user_stakeholders.stakeholder_id = tbl_stakeholders.id WHERE tbl_user_stakeholders.id = $1 and tbl_user_stakeholders.is_delete=false', [id], (error2, results2) => {

                items.push({
                    rows: results2.rows
                })
                res.push(items)
                response.status(200).send({
                    success: true,
                    data: res
                })

            })
        } else {
            response.status(400).json({
                success: false,
                data: "user tidak ditemukan"
            });
        }


    })
}

const read_by_id = (request, response) => {
    var res = [];
    var items = [];
    const id = parseInt(request.params.id);

    pool.query('SELECT count(*) as total from tbl_users', (error, results) => {

        pool.query('SELECT * from tbl_user_stakeholders WHERE is_delete=$1 AND id=$2', [false, id], (error, results1) => {
            //bcrypt.compare(password, results.rows[0].password, function(err, res) {

            if (results1) {
                items.push({
                    rows: results1.rows
                })
                res.push(items)
                response.status(200).json({
                    success: true,
                    data: res
                })
            } else {
                response.status(400).json({
                    success: false,
                    data: "id tidak ditemukan"
                });
            }
        });

    });


}

const update = (request, response) => {
    const id = parseInt(request.params.id);
    const {
        username,
        password,
        email,
        photo,
        nama_lengkap,
        stakeholder_id,
        id_spesialis,
        role_id
    } = request.body

    pool.query('SELECT Count(*) as total FROM tbl_user_stakeholders WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows[0].total > 0) {
            // user exist
            bcrypt.genSalt(10, function (err, res) {
                salt = res
                bcrypt.hash(password, salt, function (err, res) {
                    console.log(password_hash);
                    pool.query('SELECT * FROM tbl_user_stakeholders WHERE id = $1', [id], (error, results) => {
                        password_hash = res;
                        console.log(results.rows[0].password);
                        if (password == null || password == '') {
                            password_hash = results.rows[0].password;
                        }
                        console.log(password_hash);
                        console.log(password);

                        if (error) {
                            throw error
                        }

                        var name;
                        var complete_path;

                        name = results.rows[0].photo;
                        complete_path = results.rows[0].url_photo;
                        if (request.files) {
                            console.log('ada foto')
                            // doc = results.rows[0].photo;
                            // if (doc != 'default.jpg') {
                            //     var doc_path = __dirname + path.join('/dokumens/user_stakeholder/' + doc);
                            //     console.log(doc_path);
                            //     fs.unlinkSync(doc_path);
                            //     console.log(doc_path);
                            // }

                            // console.log(doc_path);
                            var name = '';
                            let sampleFile = request.files.photo;
                            console.log(sampleFile);
                            const now = Date.now()
                            name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
                            complete_path = 'https://api-insafmasdex.disnavpriok.id/api/V1/dokumens/user_stakeholder/' + name;
                            console.log(__dirname);
                            sampleFile.mv(path.join(__dirname + '/dokumens/user_stakeholder/') + name, function (err) {
                                if (err)
                                    console.log(err);
                            });
                        }
                        if (role_id==null)
                        {
                            role_id=0;
                        }
                        pool.query('UPDATE tbl_user_stakeholders SET username=$1,password=$2,email=$3,photo=$4,nama_lengkap=$5,url_photo=$6,stakeholder_id=$8, role_id=$9, id_spesialis=$10 WHERE username=$7', [username, password_hash, email, name, nama_lengkap, complete_path, username, stakeholder_id, role_id, id_spesialis], (error, results) => {
                            if (error) {
                                throw error
                            }

                            response.status(200).json({
                                success: true,
                                data: "User baru berhasil diperbarui"
                            });
                        });
                    });
                });
            });

        } else {
            // user not exist
            response.status(400).json({
                success: false,
                data: "user tidak ada"
            });
        }
    })
}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('SELECT count(*) as total FROM tbl_user_stakeholders where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }
    })

    pool.query('SELECT * FROM tbl_user_stakeholders where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }
        const deletetime = new Date;
        pool.query('UPDATE tbl_user_stakeholders SET deleted_at=$1,is_delete=$2 where id=$3', [deletetime, true, id], (error, results) => {
            if (error) {

                if (error.code == '23505') {
                    //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                    response.status(400).send('Duplicate data')
                    return;
                }
            } else {
                response.status(200).send({
                    success: true,
                    data: 'data user berhasil dihapus'
                })
            }

        })
    });
}

const download = (request, response) => {
    const filename = request.params.filename;
    console.log(filename);
    var doc_path = __dirname + path.join('/dokumens/user_stakeholder/' + filename);
    console.log(doc_path);
    response.download(doc_path);
};

// ======================================== Access token =======================================
function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, {
        expiresIn: '1800s'
    });
}

// =============================================================================================

// ========================================= encrypt & decript function ========================

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    //return encrypted.toString('hex')
    iv_text = iv.toString('hex')

    return {
        iv: iv_text,
        encryptedData: encrypted.toString('hex'),
        key: key.toString('hex')
    };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let enkey = Buffer.from(text.key, 'hex') //will return key;
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(enkey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

//================================================================================================


module.exports = {
    create,
    read,
    readall,
    readeksternal,
    read_nahkoda,
    read_by_id,
    update,
    delete_,
    download,
    detail_profile
}