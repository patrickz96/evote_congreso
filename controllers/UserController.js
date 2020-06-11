var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;

const VerifySession = require('../auth/VerifySession');

const pdf = require('html-pdf');




/****************LOGIN*******************/
/****** APERTURA Y CIERRE DEL PROCESO ELECTORAL ******/
router.get('/', async function(req, res) {
    var data= await models.proceso_electoral.findOne({where:{id_proceso_electoral: 3},attributes: ['nombre','activo']});
    if(data.activo==true){
        if(req.session.google == undefined){
            res.render('index');
        }
        else{
            res.redirect('assistance');
        }
    }
    else{
        res.redirect('/apertura');
    }
});


router.get('/apertura',async function(req,res){
    
    var data= await models.proceso_electoral.findOne({where:{id_proceso_electoral: 3},attributes: ['nombre','activo']});
    if(data.activo==true){
        res.redirect('/');
    }else{
        res.render('no-apertura');
    }
});


router.post('/login', function(req, res) {
    res.redirect('assistance');
});

/***************ASISTENCIA***************/

router.get('/assistance',VerifySession,async function(req,res){

    //Verify if google user is an elector and if he is in the electoral padron 
    var query = "select pe.id_padron_electoral from elector e inner join padron_electoral pe "+
    "on e.id_elector = pe.id_elector where email='"+req.session.google.email+"'";

    var check_padron = await db.query(query);
    //console.log("checking padron");
    if(check_padron[0].length==0){
        //console.log("no se encontro en el padron");
        res.redirect("/logout");
    }
    else{
            //Verify if the user check the assitance before
            var query = "select id_asistencia,voto from elector e inner join padron_electoral pe "+
            "on e.id_elector = pe.id_elector inner join asistencia a on pe.id_padron_electoral=a.id_padron_electoral "+
            "where email='"+req.session.google.email+"'";

            var check_assistance = await db.query(query);
            if(check_assistance[0].length==0){
                //console.log("no marco asistencia");
                var id_padron_electoral = check_padron[0][0].id_padron_electoral;
                var status = req.session.status;
                var msg = req.session.msg;
                req.session.status = undefined;
                req.session.msg = undefined;
                res.render('assistance',{status: status, message: msg,id_padron_electoral:id_padron_electoral,name: req.session.google.name});    
            }
            else{
                var voto = check_assistance[0][0].voto;
                console.log("VOTO:",voto)
                if(voto==false){
                    //console.log("marco asistencia");
                    console.log("NO VOTO");
                    res.redirect("/vote");
                }else{
                    //console.log("marco voto");
                    //res.redirect("/finish-vote");
                    console.log("SI VOTO");
                    res.render('vote-finish',{name:req.session.google.name});
                }
            }
    }
});


router.post('/assistance',VerifySession,async function(req,res){
    //verify the secret_key
    //console.log(req.body);
    models.padron_electoral.findOne({
        where: {
          id_padron_electoral: req.body.id_padron_electoral,
          clave_secreta: req.body.secret_key
        }, returning: true,
        plain: true
      }).then(async data =>{
          if(data==undefined){
            req.session.status = "error";req.session.msg = "LOS DATOS INGRESADOS SON INCORRECTOS";
            return res.redirect("/assistance");
          }else{
            //FIND FACULTY AND ID_ELECTOR WITH EMAIL
            var query = `select dp.id_facultad,e.id_elector from elector e inner join docente d on 
            e.id_elector = d.id_elector inner join departamento_academico dp on 
            d.id_dpto_aca = dp.id_dpto_aca where email ='`+req.session.google.email+`'`;
            var data_json = await db.query(query);
            var id_facultad = data_json[0][0].id_facultad;
            var id_elector = data_json[0][0].id_elector;

            //FIND OPTION BLANCO IN ASAMBLEA
            var query = `select id_lista_electoral,nombre from lista_electoral where nombre='`+'VOTO BLANCO'+`' and id_tipo_proceso =`+1;
            var data_asamblea_json = await db.query(query); 
            var id_lista_asamblea = data_asamblea_json[0][0].id_lista_electoral;
            var nombre_lista_asamblea = data_asamblea_json[0][0].nombre;
            
            //FIND OPTION BLANCO IN CONSEJO
            var query = `select id_lista_electoral,nombre from lista_electoral where nombre='`+'VOTO BLANCO'+`' and id_tipo_proceso =`+2+` and id_facultad=`+id_facultad;
            var data_consejo_json = await db.query(query); 
            var id_lista_consejo = data_consejo_json[0][0].id_lista_electoral;
            var nombre_lista_consejo = data_consejo_json[0][0].nombre;


            insert_votes(res,req.body.id_padron_electoral,-1,id_facultad,id_elector,
                id_lista_asamblea,nombre_lista_asamblea,id_lista_consejo,nombre_lista_consejo);
          } 
      }).catch(err=>{
        return res.status(500).send("There was a problem. "+err);
      });
});


/****************VOTE*****************/
router.get('/vote',VerifySession,async function(req,res){
    //console.log('redirecting vote');

    //console.log("GOOGLE",req.session.google);

    var query = "select id_asistencia,voto from elector e inner join padron_electoral pe "+
    "on e.id_elector = pe.id_elector inner join asistencia a on pe.id_padron_electoral=a.id_padron_electoral "+
    "where email='"+req.session.google.email+"'";

    var check_assistance = await db.query(query);
    //console.log("length rpta",rpta[0].length);
    if(check_assistance[0].length==0){
        //console.log("verificando que no marco asistencia");
        return res.redirect('/assistance'); 
    }else{
        //console.log("verificando si realizo su votacion");

        //var query = "select id_votacion from elector e inner join padron_electoral pe "+
        //"on e.id_elector = pe.id_elector inner join asistencia a on pe.id_padron_electoral=a.id_padron_electoral "+
        //"inner join votacion v on v.id_asistencia = a.id_asistencia "+
        //"where email='"+req.session.google.email+"'";
        
        //var check_votation = await db.query(query);
        var voto = check_assistance[0][0].voto;
        if(voto==false){
            //console.log("marco asistencia");
            //search the faculty 
            var query = `select dp.id_facultad from elector e inner join docente d on 
            e.id_elector = d.id_elector inner join departamento_academico dp on 
            d.id_dpto_aca = dp.id_dpto_aca where email = `+"'"+req.session.google.email+"'";

            var check_faculty = await db.query(query);
            var id_facultad = check_faculty[0][0].id_facultad;
            //console.log("ID FACULTAD ",id_facultad);

            //GET THE NAME OF FACULTY
            var query = `select nombre from facultad where id_facultad = `+id_facultad; 
            var facultad_nombre_json =  await db.query(query);
            var facultad_nombre = facultad_nombre_json[0][0].nombre;

            //GET LISTA ASAMBLEA
            var query = `select * from lista_electoral where id_tipo_proceso = `+1+` and id_facultad IS NULL order by nombre`; 
            var lista_asamblea_json =  await db.query(query);
            var lista_asamblea = lista_asamblea_json[0];
            //console.log("LISTA ASAMBLEA ",lista_asamblea);

            //GET LISTA CONSEJO POR FACULTAD
            var query = `select * from lista_electoral where id_tipo_proceso = `+2+` and id_facultad = `+id_facultad+` order by nombre`; 
            var lista_consejo_json =  await db.query(query);
            var lista_consejo = lista_consejo_json[0];
            //console.log("LISTA CONSEJO ",lista_consejo);

            res.render('vote',{facultad_nombre:facultad_nombre,id_asistencia: check_assistance[0][0].id_asistencia,
                name:req.session.google.name,lista_asamblea:lista_asamblea,lista_consejo:lista_consejo});
    
        }else{
            //console.log("marco voto");
            res.redirect("/finish");
        }
    }
});

router.post('/vote',VerifySession,async function(req,res){
    //console.log(req.body);
    var lista_asamblea = await db.query("select id_lista_electoral,nombre,representacion from lista_electoral where id_lista_electoral="+req.body.lista_asamblea);
    var lista_consejo = await db.query("select id_lista_electoral,nombre,representacion from lista_electoral where id_lista_electoral="+req.body.lista_consejo);
    req.session.status2 = "confirm-vote"; 
    
    req.session.msg = {facultad_nombre:req.body.facultad_nombre,id_asistencia:req.body.id_asistencia,lista_asamblea:lista_asamblea[0][0],lista_consejo:lista_consejo[0][0]};
    res.redirect('/confirm-vote');
});

/***************CONFIRM-VOTE**********/
router.get('/confirm-vote',VerifySession,function(req,res){
    var status = req.session.status2;
    var msg = req.session.msg ;
    /*ELIMINANDO SESION*/
    //req.session2 = null;

    console.log("STATUS",status);
    req.session.status2 = undefined;

    if(status!='confirm-vote'){
        res.redirect('/vote');
    }else{
        res.render('vote-confirm',{status: status, data:msg,name:req.session.google.name });
    }
});

function get_content_pdf(faculty_name,vote_asamble,vote_consejo,id_elector){

    var content = `<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="file:///var/www/html/elecciones-virtuales/public/librerias/scss/estilos-pdf.css">
        </head>
        <body>
            <header>
                <div class="cabecera">
                <img src="file:///var/www/html/elecciones-virtuales/public/img/logo-unsa.svg" alt="UNSA" class="logo">
                    <div class="titulo">
                        <h1><span class="text-big">Elecciones 2020</span></h1>
                        <span>Sistema Digital de Votación <b>E-vote</b></span>
                    </div>
                </div>
            </header>
            <main>
                <!-- inicio formulario busqueda -->
                <form action="" class="formulario">
                    <fieldset>
                        <legend><h2>Asamblea Universitaria</h2></legend>
                        <br>
                        <br>
                        <br>
                        <h1><center><font size=40>`+vote_asamble+`</font></center></h1>
                        <br>
                        <br>
                        <br>
                    </fieldset>
                    <fieldset>
                        <legend><h2>Consejo de Facultad</h2></legend>
                        <h2><center>`+ faculty_name +`</center></h2>
                        <br>
                        <br>
                        <br>
                        <h1><center><font size=40>`+vote_consejo+`</font></center></h1>
                        <br>
                        <br>
                        <br>
                    </fieldset>

                </form>
            </main>
            <footer>
            <h3 style="opacity: 0.2;">20200613-`+id_elector+`</h3>
            </footer>
        </body>
        </html>`;

    return content;
}


async function insert_votes(res,id_padron_electoral,id_asistencia,id_facultad,id_elector,id_lista_asamblea,nombre_lista_asamblea,id_lista_consejo,nombre_lista_consejo){
    
    let transaction;    
    try {
      // get transaction
      transaction = await db.transaction();
      
      //CREATE VOTES IN CASE OF ASSISTENCE REQUEST
      if(id_asistencia == -1 && id_padron_electoral!=-1){
        console.log("MARCANDO ASISTENCIA");

        // save assistence
        var result = await models.asistencia.create({
        id_padron_electoral:id_padron_electoral
        },{transaction});
        id_asistencia = result.id_asistencia;

        // save vote lista_asamblea
        await models.votacion.create({
        id_lista_electoral:id_lista_asamblea,
        id_asistencia:id_asistencia,
        id_tipo_proceso:1
        },{transaction});
        
        // save vote lista_consejo
        await models.votacion.create({
            id_lista_electoral:id_lista_consejo,
            id_asistencia:id_asistencia,
            id_tipo_proceso:2
        },{transaction});

      }
      else{
        //UPDATE VOTES IN CASE OF VOTATION RESQUEST
        console.log("ACTUALIZANDO VOTOS");

        // save vote lista_asamblea
        await models.votacion.update({
            id_lista_electoral:id_lista_asamblea},
            {where: { id_asistencia: id_asistencia,id_tipo_proceso:1}
        },{transaction});
            
        // save vote lista_consejo
        await models.votacion.update({
            id_lista_electoral:id_lista_consejo
            },
            {where: { id_asistencia: id_asistencia,id_tipo_proceso:2}
        },{transaction});

        // actualizamos voto a true
        await models.asistencia.update(
            { voto: true },
            { where: { id_asistencia: id_asistencia } 
        },{transaction});

      }

      //save vote on pdf
      //obtenemos los datos para guardar el voto en el pdf
      var query = `select nombre from facultad f where id_facultad  =`+id_facultad;
      var name_facultad_json = await db.query(query);
      var name_facultad = name_facultad_json[0][0].nombre;


      //id_elector
      var content = get_content_pdf(name_facultad,nombre_lista_asamblea,nombre_lista_consejo,id_elector);
      var path = './pdf-votes/'+name_facultad+"/"+'vote-'+id_elector+'.pdf';
      var config = {format: 'A4'};
      pdf.create(content,config).toFile(path, async function(err, res2) {
        if (err){
            //console.log(err);
            throw "error saving pdf vote";
        } else {
            //updating url of the pdf of elector
            await models.asistencia.update(
                { url_pdf: path },
                { where: { id_asistencia: id_asistencia } 
            },{transaction});
            //res.download('./pdf-votes/vote-01.pdf');
        }
      });
      // commit
      await transaction.commit();

      res.redirect("/finish");
    } catch (err) {
      // Rollback transaction only if the transaction object is defined
      if (transaction) await transaction.rollback();
      res.status(500).send("Hubo un error intente ingresar de nuevo porfavor "+err);
    }   
}


router.post('/confirm-vote',VerifySession,async function (req, res) {
    //console.log(req.body);
    //verificamos que el id_asistencia pertence al usuario logueado
    var query = `select e.id_elector from asistencia a inner join padron_electoral pe on a.id_padron_electoral = pe.id_padron_electoral inner join 
    elector e on pe.id_elector = e.id_elector where id_asistencia = `+req.body.id_asistencia+` and email= `+"'"+req.session.google.email+"'";
    var id_elector_json = await db.query(query);

    if(id_elector_json[0].length==0){
        return res.status(500).send("Hubo un error intente ingresar de nuevo porfavor ");
    }else{

        var id_elector = id_elector_json[0][0].id_elector;
        //console.log("id_elector",id_elector);

        //consultamos la facultad de usuario para la lista electoral de consejo
        var query = `select dp.id_facultad from elector e inner join docente d on 
            e.id_elector = d.id_elector inner join departamento_academico dp on 
            d.id_dpto_aca = dp.id_dpto_aca where e.id_elector = `+id_elector;
        var id_facultad_json = await db.query(query);

        if(id_facultad_json[0].length==0){
            return res.status(500).send("Hubo un error intente ingresar de nuevo porfavor ");
        }
        else{
            var id_facultad = id_facultad_json[0][0].id_facultad;

            //console.log("id_facultad",id_facultad);
            //verificamos que el id_lista_asamblea pertenece al tipo_proceso 1 (ELECCION ASAMBLEA)
            var query = `select id_lista_electoral,nombre from lista_electoral le where id_lista_electoral=`+req.body.id_lista_asamblea+` and id_tipo_proceso=`+1;
            var check_lista_asamblea = await db.query(query);
            //console.log("lista_asamblea",check_lista_asamblea);
        
            //verificamos que el id_lista_consejo pertenece al tipo_proceso 2 (ELECCION CONSEJO)
            var query = `select id_lista_electoral,nombre from lista_electoral le where id_lista_electoral=`+req.body.id_lista_consejo+
                        ` and id_tipo_proceso=`+2+` and id_facultad=`+id_facultad;
            var check_lista_consejo = await db.query(query);;
            //console.log("lista_asamblea",check_lista_consejo);

            if(check_lista_asamblea[0].length==0 || check_lista_consejo[0].length==0 ){
                return res.status(500).send("Hubo un error intente ingresar de nuevo porfavor ");
            }else{
                
                var nombre_lista_asamblea = check_lista_asamblea[0][0].nombre;
                var nombre_lista_consejo = check_lista_consejo[0][0].nombre;
                insert_votes(res,-1,req.body.id_asistencia,id_facultad,id_elector,
                    req.body.id_lista_asamblea,nombre_lista_asamblea,req.body.id_lista_consejo,nombre_lista_consejo);
            }
        }    
    }
});

/***************FINISH-VOTE**********/
router.get('/finish',VerifySession,function(req,res){
    res.redirect('/assistance');
});


module.exports = router;