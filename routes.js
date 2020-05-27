const { Router } = require('express');
const mysql = require('mysql');
const fs = require('fs');
const router = Router();

require('./config');

const mysqlConnection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME
});

mysqlConnection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Conectado a la base de datos');
    }
});


router.post('/login', (req, res) => {
    const user = req.body.usuario;
    const pass = req.body.clave;

    mysqlConnection.query(`SELECT * FROM usuario WHERE usuario='${user}' AND clave='${pass}'`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            if (rows.length > 0) {
                delete rows[0].clave;
                res.status(200).json({
                    status: 200,
                    ok: true,
                    msg: {
                        ...rows[0],
                        text: 'Inicio de sesión correcto.'
                    }
                });
            } else {
                res.status(200).json({
                    status: 404,
                    ok: true,
                    msg: 'Usuario y/o clave incorrectos.'
                });
            }
        }
    });
});

router.get('/eventos', (req, res) => {
    mysqlConnection.query(`SELECT * FROM evento`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: rows
            });
        }
    });
});

router.get('/eventos/:id', (req, res) => {
    const id = req.params.id;
    mysqlConnection.query(`SELECT * FROM evento WHERE id=${id}`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: rows
            });
        }
    });
});

router.get('/eventos/redirect/:id', (req, res) => {
    const id = req.params.id;

    mysqlConnection.query(`SELECT * FROM evento WHERE url='${id}'`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: rows
            });
        }
    });
});

router.put('/eventos/:id', (req, res) => {
    const id = req.params.id;
    const descripcion = req.body.descripcion;
    const fechainicio = req.body.fechainicio; //2020-05-27 07:30:00
    const fechafin = req.body.fechafin; //2020-05-27 07:30:00
    const estado = req.body.estado;
    const enlace = req.body.enlace;
    const grabacion = req.body.grabacion;
    const entidad = req.body.entidad;
    const dependencia = req.body.dependencia;
    const responsable = req.body.responsable;
    const email = req.body.email;
    const telefono = req.body.telefono;
    const inscripcion = req.body.inscripcion;
    const area = req.body.area;

    mysqlConnection.query(`UPDATE evento SET descripcion='${descripcion}',fechainicio='${fechainicio}',fechafin='${fechafin}',estado='${estado}',enlace='${enlace}',grabacion='${grabacion}',entidad='${entidad}',dependencia='${dependencia}',responsable='${responsable}',email='${email}',telefono='${telefono}',inscripcion='${inscripcion}',area='${area}' WHERE id=${id}`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: 'Actualización exitosa.'
            });
        }
    });
});

router.delete('/eventos/:id', (req, res) => {
    const id = req.params.id;
    mysqlConnection.query(`DELETE FROM evento WHERE id=${id}`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: 'Eliminado correctamente.'
            });
        }
    });
});

router.post('/eventos/search', (req, res) => {
    const nombre = req.body.nombre;
    mysqlConnection.query(`SELECT * FROM evento WHERE nombre LIKE '%${nombre}%'`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: rows
            });
        }
    });
});

router.post('/eventos', (req, res) => {
    const nombre = `'${req.body.nombre}'`;
    const url = `${nombre.toLowerCase().replace(/ /g, '')}`;
    const descripcion = `'${req.body.descripcion}'`;
    const fechainicio = `'${req.body.fechainicio}'`;
    const fechafin = `'${req.body.fechafin}'`;
    const estado = `${req.body.estado}`;
    const enlace = req.body.enlace===''?'DEFAULT':`'${req.body.enlace}'`;
    const grabacion = req.body.grabacion===''?'DEFAULT':`'${req.body.grabacion}'`;
    const entidad = `${req.body.entidad}`;
    const dependencia = req.body.dependencia===''?'DEFAULT':`'${req.body.dependencia}'`;
    const responsable = `'${req.body.responsable}'`;
    const email = `'${req.body.email}'`;
    const telefono = `'${req.body.telefono}'`;
    const inscripcion = req.body.inscripcion===''?'DEFAULT':`'${req.body.inscripcion}'`;
    const area = `${req.body.area}`;
    let file = req.body.file;
    // let filen;
    if (file !== null) {
    //     filen = req.body.file.filename.split('.');
    //     archivo = `${url.replace(/'/g,'') +'.'+filen[1]}`;
    //     fs.writeFile(`./imgs/${archivo}`, file.value, { encoding: 'base64' }, function (err) {
    //         //Finished
    //     });
        file = `'${file.value}'`;
    }
    const sql = `INSERT INTO evento VALUES (DEFAULT,${nombre},${url},${descripcion},${fechainicio},${fechafin},${estado},${enlace},${grabacion},${entidad},${dependencia},${responsable},${email},${telefono},${inscripcion},${area},${file})`;
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: 'Registro exitoso.'
            });
        }
    });
});

router.get('/entidades', (req, res) => {
    mysqlConnection.query(`SELECT * FROM entidad`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: rows
            });
        }
    });
});

router.get('/entidades/:id', (req, res) => {
    const id = req.params.id;
    mysqlConnection.query(`SELECT * FROM entidad WHERE id=${id}`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: rows
            });
        }
    });
});

router.delete('/entidades/:id', (req, res) => {
    const id = req.params.id;
    mysqlConnection.query(`DELETE FROM entidad WHERE id=${id}`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: 'Eliminado correctamente.'
            });
        }
    });
});

router.put('/entidades/:id', (req, res) => {
    const id = req.params.id;
    const nombre = req.body.nombre;
    const tipo = req.body.tipo;
    const ciudad = req.body.ciudad;
    mysqlConnection.query(`UPDATE entidad SET nombre='${nombre}', tipo=${tipo}, ciudad='${ciudad}' WHERE id=${id}`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: 'Registro exitoso.'
            });
        }
    });
});

router.post('/entidades', (req, res) => {
    const nombre = req.body.nombre;
    const tipo = req.body.tipo;
    const ciudad = req.body.ciudad;

    mysqlConnection.query(`INSERT INTO entidad VALUES (NULL,'${nombre}',${tipo},'${ciudad}')`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: 'Registro exitoso.'
            });
        }
    });
});

router.get('/areas', (req, res) => {
    mysqlConnection.query(`SELECT * FROM area`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: rows
            });
        }
    });
});

router.get('/areas/:id', (req, res) => {
    const id = req.params.id;
    mysqlConnection.query(`SELECT * FROM area WHERE id=${id}`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: rows
            });
        }
    });
});

router.delete('/areas/:id', (req, res) => {
    const id = req.params.id;
    mysqlConnection.query(`DELETE FROM area WHERE id=${id}`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: 'Eliminado correctamente.'
            });
        }
    });
});

router.post('/areas', (req, res) => {
    const descripcion = req.body.descripcion;

    mysqlConnection.query(`INSERT INTO area VALUES (NULL,'${descripcion}'`, (err, rows, fields) => {
        if (err) {
            res.status(400).json({
                status: 400,
                ok: false,
                msg: err
            });
        } else {
            res.status(200).json({
                status: 200,
                ok: true,
                msg: 'Registro exitoso.'
            });
        }
    });
});

module.exports = router;