var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;
const VerifyToken = require('../auth/VerifyToken');
const nodemailer = require('nodemailer');




router.get('/panel',VerifyToken,function(req, res) {
    //console.log("enter");
    res.render('./admin/admin');
});

router.get('/register', function(req, res) {
    res.render('./admin/register');
});

router.get('/electoral-list',VerifyToken,function(req, res){
    var status = req.session.status;
    var msg = req.session.msg ;
    req.session = null;
    res.render('./admin/electoral-list',{status: status, message: msg });
});


//CREATE NEW DRIVER
router.post('/electoral-list', function (req, res) {
    //console.log("saving new driver");
    console.log(req.body);    
    
    models.electoral_list
    .create({
        id_faculty:req.body.faculty,
        id_process_type:req.body.process_type, 
        name:req.body.name
    })
    .then(data => {
        req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+data.name+" REGISTRADO CORRECTAMENTE";
        res.redirect('/admin/electoral-list');
    })
    .catch(err => {
        req.session.status = "error"; req.session.msg = ""+err;
        res.redirect('/admin/electoral-list');
    });    
});

router.get('/electoral-list/all', VerifyToken, function (req, res) {
    models.electoral_list.findAll({
    include:[
        {model: models.faculty,attributes: ['name']},
        {model: models.process_type,attributes: ['name']},
    ]
    }).then(data => {
        //console.log(data);
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});

router.get('/faculty/all', VerifyToken, function (req, res) {
    models.faculty.findAll().then(data => {
        //console.log(data);
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});



router.get('/historical',VerifyToken,function(req,res){
    res.render('./admin/historical');
});

/*
router.post('/login', function(req, res) {
    res.redirect("/admin/panel");
});
*/

// Muestra el padron del proceso activo, accion generar claves y la accion para enviar las claves.
router.get('/padron-activo', VerifyToken, function(req, res){
    res.render('./admin/padron-activo');
});

router.get('/padron-electoral/all', VerifyToken, function (req, res) {
    models.padron_electoral.findAll({
        include:[
            {model: models.elector, attributes: ['id_elector','apn','email']},
        ]
    }).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});

//router.post('/generate-keys', VerifyToken, function(req, res)){
    //Encontrar el padron segun req.id
    //Por cada elector en el padron:
    //Hashear su nombre-dni-correo / Encriptar con clave en el sistema
    //Tomar los primeros 8 digitos del hash -> clave secreta
    //Guardar esta clave en la base de datos para este elector
    //Enviar un json con la lista de claves y id via HTTPS
    //En el front-end actualizar cada row con las claves obtenidas
//}

//router.post('/send_keys', VerifyToken, function(req, res)){
    //Encontrar el padron segun req.id
    //Por cada elector en el padron de forma asincrona:
    //Generar un mail template
    //Agregar el template y correo a una cola en la base de datos
    //Establecer un trabajador que vaya enviando los correos uno a uno
    //Cada ves que se termine de enviar el trabajado emite un evento
    //Actualizar un campo de la tabla electores con el status de correoEnviado = true
    //Enviar este evento al front-end con el id elector
    //Actualizar el estado del row con id elector enviado de una X a un Check
    //En el front end establecer un contador que vaya sumando cada enviado y actualice un grafico porcentual
    //Al 100% se emite un evento de completo
//}

// Send message to user_mail
// Wont work on global scope!
async function send_single_msg(user_mail, message){
    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        pool: true,
        maxConnections: 20,
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'tramiteunsa.soporte@unsa.edu.pe',
            pass: 'tramitedUnsa2020!'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data
    let mailOptions = {
        from: '"Evote" <tramiteunsa.soporte@unsa.edu.pe>',
        to: user_mail,
        subject: 'Credenciales Elecciones Unsa',
        text: 'Hello world',
        html: message,
        attachments: [
            {   // utf-8 string as an attachment
                filename: 'text1.txt',
                content: 'hello world!'
            },
        ]
    };

    // Actuallly send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
}

router.post('/send',VerifyToken, (req, res)=> {
    /*let user_key = 'dbasdfasdf34';
    let user_mail = 'rhualla@unsa.edu.pe';
    const message = `
        <h1>Evote credenciales</h1>
        <p>La siguiente informacion le servira para ingresar al sistema de votacion electronica.<p>
        <ul>
            <li>Usuario: Utilizar su correo institucional</li>
            <li>Clave: ${user_key}</li>
        </ul>
        <h3>No comparta esta informacion con nadie!</h3>
    `;

    send_single_msg(user_mail, message).catch(console.error)*/
    /*const shell = require('shelljs')
    shell.exec('/var/www/html/evote/scripts/send_secret_keys.sh', function(code, stdout, stderr) {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
      });*/

    var exec = require('child_process').exec;
    exec('php -f ./scripts/send_keys.php', function(code, stdout, stderr) {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
      });
    return res.status(200).send("Se ha enviado los correos");
});

router.post('/generate_keys',VerifyToken, (req, res)=> {
    const shell = require('shelljs')
    shell.exec('/var/www/html/evote/scripts/set_secret_keys.sh');
    return res.status(200).send("Se han generado las claves");
});
module.exports = router;