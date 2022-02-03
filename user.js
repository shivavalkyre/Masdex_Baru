const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const res = require('express/lib/response');
const req = require('express/lib/request');
var complete_path = '';
var password_hash;


const create = (request, response) => {
    const {
        username,
        password,
        email,
        photo,
        nama_lengkap
    } = request.body

    pool.query('SELECT Count(*) as total FROM masdex_users_all WHERE username = $1', [username], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows[0].total > 0) {
            response.status(400).json({
                success: false,
                data: "user sudah ada"
            });

        } else {
            // user not exist
            var name = '';
            if (request.files.size > 0) {
                let sampleFile = request.files.photo;
                console.log(sampleFile);
                const now = Date.now()
                name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
                complete_path = base_url + 'dokumens/user/' + name;
                console.log(__dirname);
                sampleFile.mv(path.join(__dirname + '/dokumens/user/') + name, function (err) {
                    if (err)
                        console.log(err);
                });
            } else {
                name = null;
            }


            bcrypt.genSalt(10, function (err, res) {
                salt = res
                bcrypt.hash(password, salt, function (err, res) {
                    password_hash = res;
                    console.log(password_hash);
                    pool.query('INSERT INTO tbl_users (username,password,email,photo,nama_lengkap,url_photo) VALUES($1,$2,$3,$4,$5,$6)', [username, password_hash, email, name, nama_lengkap, complete_path], (error, results) => {
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

    pool.query('SELECT count(*) as total from tbl_users WHERE username =$1', [username], (error, results) => {
        if (results.rows[0].total > 0) {
            pool.query('SELECT * from tbl_users WHERE username =$1', [username], (error, results) => {
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
                data: "user tidak di temukan"
            });
        }


    })
}

const login = (request, response) => {
    const {
        username,
        password
    } = request.body

    pool.query('SELECT count(*) as total from tbl_users WHERE username =$1', [username], (error, results) => {
        console.log(results)
        if (results.rows[0].total > 0) {
            pool.query('SELECT * from tbl_users WHERE username =$1', [username], (error, results) => {
                bcrypt.compare(password, results.rows[0].password, function (err, res) {

                    if (res) {
                        //console.log('Your password mached with database hash password');
                        //response.status(200).json({success:true,data: "User ditemukan" });
                        const token = generateAccessToken({
                            username: username
                        })
                        //console.log(token);
                        response.status(200).json({
                            success: true,
                            "token": token,
                            "id": results.rows[0].id,
                            "username": username,
                            role: results.rows[0].stakeholder || 'disnav',
                            nama_lengkap: results.rows[0].nama_lengkap
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
                data: "user tidak di temukan"
            });
        }


    })
}

const readall = (request, response) => {
    var res = [];
    var items = [];

    pool.query('SELECT count(*) as total from tbl_users', (error, results) => {

        pool.query('SELECT * from tbl_users WHERE is_delete=$1', [false], (error, results1) => {
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

const read_by_id = (request, response) => {
    var res = [];
    var items = [];
    const id = parseInt(request.params.id);

    pool.query('SELECT count(*) as total from tbl_users', (error, results) => {

        pool.query('SELECT * from tbl_users WHERE is_delete=$1 AND id=$2', [false, id], (error, results1) => {
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
            nama_lengkap
        } = request.body

        pool.query('SELECT Count(*) as total FROM tbl_users WHERE id = $1', [id], (error, results) => {
                if (error) {
                    throw error
                }
                if (results.rows[0].total > 0) {
                    // user exist
                    bcrypt.genSalt(10, function (err, res) {
                            salt = res
                            bcrypt.hash(password, salt, function (err, res) {
                                    console.log(password_hash);
                                    pool.query('SELECT * FROM tbl_users WHERE id = $1', [id], (error, results) => {
                                            password_hash = results.rows[0].password;
                                            if (password != null || password != '') {
                                                password_hash = res;
                                            }

                                            if (error) {
                                                throw error
                                            }

                                            var name;
                                            var complete_path;

                                            name = results.rows[0].photo;
                                            complete_path = results.rows[0].url_photo;
                                                if (request.files.size > 0) {
                                                    doc = results.rows[0].photo;
                                                    var doc_path = __dirname + path.join('/dokumens/user/' + doc);
                                                    console.log(doc_path);
                                                    fs.unlinkSync(doc_path);
                                                    console.log(doc_path);
                                                    var name = '';
                                                    let sampleFile = request.files.photo;
                                                    console.log(sampleFile);
                                                    const now = Date.now()
                                                    name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
                                                    complete_path = base_url + 'dokumens/user/' + name;
                                                    console.log(__dirname);
                                                    sampleFile.mv(path.join(__dirname + '/dokumens/user/') + name, function (err) {
                                                        if (err)
                                                            console.log(err);
                                                    });
                                                } else {
                                                    name = null;
                                                }
                                                pool.query('UPDATE tbl_users SET username=$1,password=$2,email=$3,photo=$4,nama_lengkap=$5,url_photo=$6 WHERE username=$7', [username, password_hash, email, name, nama_lengkap, complete_path, username], (error, results) => {
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

                    }
                    else {
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


            pool.query('SELECT count(*) as total FROM tbl_users where id=$1 and is_delete=false', [id], (error, results) => {
                if (error) {
                    throw error
                } else {
                    //console.log(results.rows);
                }

            })

            pool.query('SELECT * FROM tbl_users where id=$1 and is_delete=false', [id], (error, results) => {
                if (error) {
                    throw error
                }


                const deletetime = new Date;
                pool.query('UPDATE tbl_users SET deleted_at=$1,is_delete=$2 where id=$3', [deletetime, true, id], (error, results) => {
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
            var doc_path = __dirname + path.join('/dokumens/user/' + filename);
            console.log(doc_path);
            response.download(doc_path);
            //response.status(200).send({success:true,data:'data berhasil diunduh'})
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
            login,
            read_by_id,
            update,
            delete_,
            download
        }