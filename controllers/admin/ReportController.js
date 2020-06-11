var express = require('express');
var router = express.Router();

const models = require(process.cwd()+"/models");
const db = require(process.cwd()+"/models").sequelize;
const VerifyToken = require(process.cwd()+'/auth/VerifyToken');

router.get('/assistence-report',VerifyToken,function(req, res){
    res.render('./admin/assistence-report');
});

router.get('/votation-report',VerifyToken,function(req, res){
    res.render('./admin/votation-report');
});


router.get('/asistencia-departamento', VerifyToken, async function (req, res) {
    
    var query = `select 
    da.nombre,coalesce(t.habilitados,0) as habilitados,coalesce(t.asistentes,0) as asistentes,coalesce(t.porcentaje,0) as porcentaje
    from
    (SELECT habilitados,asistentes,t1.nombre,(asistentes*100)/habilitados as porcentaje FROM
    (select count(*) as habilitados,dp.nombre from padron_electoral pe inner join docente d on pe.id_elector = d.id_elector
    inner join departamento_academico dp on d.id_dpto_aca = dp.id_dpto_aca group by dp.nombre) t1 
    inner join
    (select count(*) as asistentes,dp.nombre from padron_electoral pe inner join docente d on pe.id_elector = d.id_elector
        inner join departamento_academico dp on d.id_dpto_aca = dp.id_dpto_aca inner join asistencia a 
        on pe.id_padron_electoral = a.id_padron_electoral group by dp.nombre) t2
    ON t1.nombre = t2.nombre) t
    right join 
    (select nombre from departamento_academico) da on t.nombre = da.nombre order by da.nombre`;

    var data =  await db.query(query);
    res.status(200).send(data[0]);
});

router.get('/asistencia-facultad', VerifyToken, async function (req, res) {
    
    var query = `select 
    fa.nombre,coalesce(t.habilitados,0) as habilitados,coalesce(t.asistentes,0) as asistentes,coalesce(t.porcentaje,0) as porcentaje
    from
    (SELECT habilitados,asistentes,t1.nombre,(asistentes*100)/habilitados as porcentaje FROM
    (select count(*) as habilitados,f.nombre from padron_electoral pe inner join docente d on pe.id_elector = d.id_elector
    inner join departamento_academico dp on d.id_dpto_aca = dp.id_dpto_aca inner join facultad f on dp.id_facultad = f.id_facultad
    group by f.nombre) t1 
    inner join
    (select count(*) as asistentes,f.nombre from padron_electoral pe inner join docente d on pe.id_elector = d.id_elector
        inner join departamento_academico dp on d.id_dpto_aca = dp.id_dpto_aca inner join asistencia a 
        on pe.id_padron_electoral = a.id_padron_electoral inner join facultad f on dp.id_facultad = f.id_facultad
    group by f.nombre) t2
    ON t1.nombre = t2.nombre) t
    right join 
    (select nombre from facultad) fa
    on t.nombre = fa.nombre order by fa.nombre`;

    var data =  await db.query(query);
    res.status(200).send(data[0]);
});


router.get('/asistencia-area', VerifyToken, async function (req, res) {
    
    var query = `select 
    are.nombre,coalesce(t.habilitados,0)as habilitados,coalesce(t.asistentes,0) as asistentes,coalesce(t.porcentaje,0) as porcentaje
    from
    (SELECT habilitados,asistentes,t1.nombre,(asistentes*100)/habilitados as porcentaje FROM
    (select count(*) as habilitados,ar.nombre from padron_electoral pe inner join docente d on pe.id_elector = d.id_elector
    inner join departamento_academico dp on d.id_dpto_aca = dp.id_dpto_aca inner join facultad f on dp.id_facultad = f.id_facultad
    inner join area ar on f.id_area = ar.id_area group by ar.nombre) t1 
    inner join
    (select count(*) as asistentes,ar.nombre from padron_electoral pe inner join docente d on pe.id_elector = d.id_elector
        inner join departamento_academico dp on d.id_dpto_aca = dp.id_dpto_aca inner join asistencia a 
        on pe.id_padron_electoral = a.id_padron_electoral inner join facultad f on dp.id_facultad = f.id_facultad
        inner join area ar on f.id_area = ar.id_area group by ar.nombre
    ) t2
    ON t1.nombre = t2.nombre) t
    right join 
    (select nombre from area) are
    on t.nombre = are.nombre order by are.nombre`;

    var data =  await db.query(query);
    res.status(200).send(data[0]);
});

router.get('/votacion-asamblea', VerifyToken, async function (req, res) {
    
    var facultades_json = await db.query("select id_facultad,nombre from facultad order by nombre");
    var facultades = facultades_json[0];
    //console.log(facultades);
    var votos_fac = [];
    for(var i=0; i<facultades.length; i++){

        //console.log(facultades[i].id_facultad);

        
        var query = `select t1.id_lista_electoral, t1.nombre, t1.representacion, coalesce(t2.total,0) as total
        from
        (
        select id_lista_electoral,nombre,representacion from lista_electoral le where id_tipo_proceso =1
        ) t1
        left join 
        (
        select count(*) as total,v.id_lista_electoral from votacion v inner join asistencia a 
        on v.id_asistencia = a.id_asistencia inner join 
        padron_electoral pe on pe.id_padron_electoral = a.id_padron_electoral 
        inner join docente d on pe.id_elector = d.id_elector inner join departamento_academico 
        dp on d.id_dpto_aca = dp.id_dpto_aca inner join facultad f on dp.id_facultad = f.id_facultad
        inner join lista_electoral l on v.id_lista_electoral = l.id_lista_electoral 
        where v.id_tipo_proceso= 1 and f.id_facultad =`+ facultades[i].id_facultad +` group by v.id_lista_electoral, l.nombre
        order by l.nombre
        ) t2
        on t2.id_lista_electoral = t1.id_lista_electoral order by t1.nombre
        `;

        var votos_listas_json = await db.query(query);
        var votos_listas = votos_listas_json[0];
        //console.log(votos_listas);
  
        var query = `select count(*) as habilitados from padron_electoral pe inner join docente d on pe.id_elector = d.id_elector
        inner join departamento_academico dp on d.id_dpto_aca = dp.id_dpto_aca inner join facultad f on dp.id_facultad = f.id_facultad
        where f.id_facultad = ` + facultades[i].id_facultad +` group by f.id_facultad`;
        var habilitados_json = await db.query(query);
        //var habilitados = habilitados_json.habilitados;
        var habilitados = 0;
        if(habilitados_json[0].length!=0){
            console.log("Habilitados: ",habilitados_json[0][0].habilitados);
            habilitados = parseInt(habilitados_json[0][0].habilitados);
        }
        
        votos_fac.push({"listas":listas,"nombre_fac": facultades[i].nombre ,"votos": votos_listas,"habilitados":habilitados}); 
 
    }

    var query = `select id_lista_electoral,nombre,representacion from lista_electoral le where id_tipo_proceso =1 order by nombre`;
    var listas_json = await db.query(query);
    var listas = listas_json[0];

    res.status(200).send({votos_fac:votos_fac,listas:listas});
});


router.get('/votacion-ranking', VerifyToken, async function (req, res) {

    var query = `select * from 
    (
    select t2.id_lista_electoral,t2.nombre,t2.representacion,coalesce(t1.total,0) as total from
    (
    select count(*) as total,l.nombre,v.id_lista_electoral,l.representacion from votacion v
        inner join lista_electoral l on v.id_lista_electoral = l.id_lista_electoral 
        where v.id_tipo_proceso= 1 group by v.id_lista_electoral,l.nombre,l.representacion 
    
    ) t1
    right join
    (
    select id_lista_electoral,nombre, representacion from lista_electoral where id_tipo_proceso =1 ) t2
    on t1.id_lista_electoral = t2.id_lista_electoral
    ) t3 order by t3.total desc`
    var data = await db.query(query);
    res.status(200).send(data[0]);

}); 

router.get('/get_facultades_ranking', VerifyToken, async function (req, res){
    //console.log("DENTRO");
    var query = `select id_facultad,nombre from facultad`;
    var facultades = await db.query(query);


    var facultades = facultades[0];
    //var votos_fac = [];
    for(var i=0; i<facultades.length; i++){
        console.log(facultades[i]);
    }
    res.status(200).send(facultades);
});


router.get('/ciencias-biologicas-ranking', VerifyToken, async function (req, res) {

    var query = `select 
    t1.id_lista_electoral, t1.nombre, t1.representacion, coalesce(t2.total,0) as total
    from
    (
      select id_lista_electoral,nombre,representacion from lista_electoral le where id_tipo_proceso =2
      and id_facultad = `+9+` ) t1
    left join 
    (
    select count(*) as total,v.id_lista_electoral from votacion v inner join asistencia a 
    on v.id_asistencia = a.id_asistencia inner join 
    padron_electoral pe on pe.id_padron_electoral = a.id_padron_electoral 
    inner join docente d on pe.id_elector = d.id_elector inner join departamento_academico 
    dp on d.id_dpto_aca = dp.id_dpto_aca inner join facultad f on dp.id_facultad = f.id_facultad
    inner join lista_electoral l on v.id_lista_electoral = l.id_lista_electoral 
    where v.id_tipo_proceso= 2 and f.id_facultad = `+9+ ` group by v.id_lista_electoral, l.nombre
    order by l.nombre
    ) t2
    on t2.id_lista_electoral = t1.id_lista_electoral order by t1.nombre`;

    var data = await db.query(query);
    res.status(200).send(data[0]);

});    


router.get('/administracion-ranking', VerifyToken, async function (req, res) {

    var query = `select 
    t1.id_lista_electoral, t1.nombre, t1.representacion, coalesce(t2.total,0) as total
    from
    (
      select id_lista_electoral,nombre,representacion from lista_electoral le where id_tipo_proceso =2
      and id_facultad = `+40+` ) t1
    left join 
    (
    select count(*) as total,v.id_lista_electoral from votacion v inner join asistencia a 
    on v.id_asistencia = a.id_asistencia inner join 
    padron_electoral pe on pe.id_padron_electoral = a.id_padron_electoral 
    inner join docente d on pe.id_elector = d.id_elector inner join departamento_academico 
    dp on d.id_dpto_aca = dp.id_dpto_aca inner join facultad f on dp.id_facultad = f.id_facultad
    inner join lista_electoral l on v.id_lista_electoral = l.id_lista_electoral 
    where v.id_tipo_proceso= 2 and f.id_facultad = `+40+ ` group by v.id_lista_electoral, l.nombre
    order by l.nombre
    ) t2
    on t2.id_lista_electoral = t1.id_lista_electoral order by t1.nombre`;

    var data = await db.query(query);
    res.status(200).send(data[0]);

});  


router.get('/ing-procesos-ranking', VerifyToken, async function (req, res) {

    var query = `select 
    t1.id_lista_electoral, t1.nombre, t1.representacion, coalesce(t2.total,0) as total
    from
    (
      select id_lista_electoral,nombre,representacion from lista_electoral le where id_tipo_proceso =2
      and id_facultad = `+30+` ) t1
    left join 
    (
    select count(*) as total,v.id_lista_electoral from votacion v inner join asistencia a 
    on v.id_asistencia = a.id_asistencia inner join 
    padron_electoral pe on pe.id_padron_electoral = a.id_padron_electoral 
    inner join docente d on pe.id_elector = d.id_elector inner join departamento_academico 
    dp on d.id_dpto_aca = dp.id_dpto_aca inner join facultad f on dp.id_facultad = f.id_facultad
    inner join lista_electoral l on v.id_lista_electoral = l.id_lista_electoral 
    where v.id_tipo_proceso= 2 and f.id_facultad = `+30+ ` group by v.id_lista_electoral, l.nombre
    order by l.nombre
    ) t2
    on t2.id_lista_electoral = t1.id_lista_electoral order by t1.nombre`;

    var data = await db.query(query);
    res.status(200).send(data[0]);

});  



/* 
router.post('/electoral-list',VerifyToken,function (req, res) {
    console.log(req.body);    
    models.lista_electoral
    .create({
        id_facultad:req.body.faculty,
        id_tipo_proceso:req.body.process_type, 
        nombre:req.body.name,
        representacion:req.body.representation
    })
    .then(data => {
        req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+data.nombre+" REGISTRADO CORRECTAMENTE";
        res.redirect('/admin/electoral-list');
    })
    .catch(err => {

        if(err.name == "SequelizeUniqueConstraintError"){
            console.log("ERROR DUPLICADO");
            if(err.parent.code == 23505){
              req.session.status = "error"; req.session.msg = "LA LISTA: YA SE ENCUENTRA REGISTRADA";
              res.redirect('/admin/electoral-list');
            }
        }
        if(err.name == "SequelizeValidationError"){
            req.session.status = "error"; req.session.msg = ""+err;
            res.redirect('/admin/electoral-list');
        }


    });
    
  });

  router.post('/electoral-list-update',VerifyToken, function (req, res) {
    //console.log(req.body);
    
    models.lista_electoral.update(
        { nombre:req.body.name,id_tipo_proceso:req.body.type_process, id_facultad:req.body.faculty,representacion:req.body.representation}, 
        {where: { id_lista_electoral: req.body.id },returning: true,plain:true},)  
      .then(obj => {
        req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+obj[1].nombre+" ACTUALIZADO CORRECTAMENTE";
        res.redirect('/admin/electoral-list');
      }).catch(err=>{
          req.session.status = "error"; req.session.msg = ""+err;
          res.redirect('/admin/electoral-list');
      });
    
});




router.get('/electoral-list/all', VerifyToken, function (req, res) {
    models.lista_electoral.findAll({
    include:[
        {model: models.facultad,attributes: ['id_facultad','nombre']},
        {model: models.tipo_proceso,attributes: ['id_tipo_proceso','nombre']},
    ],
    order: [
        [models.tipo_proceso, 'nombre', 'ASC'],
        [models.facultad, 'nombre', 'ASC'],
        ['nombre', 'ASC']
    ]}).then(data => {
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("Hubo un problema cargando la lista padron." + err);
    });
});

router.post('/get-electoral-list', VerifyToken, function (req, res) {

    //console.log("llego");
    models.lista_electoral.findAll({
    where:{id_tipo_proceso:req.body.id_tipo_proceso,id_facultad:req.body.id_facultad}
    }).then(data => {
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});


router.post('/electoral-list-delete', function (req, res) {

    models.lista_electoral.destroy({
        where: {
            id_lista_electoral: req.body.id
        }
      }).then(data=>{
        return res.status(200).send("ok");
      }).catch(err=>{
        return res.status(500).send("Hubo un problema al eliminar la lista electoral "+err);
      });
});



router.get('/faculty/all', VerifyToken, function (req, res) {
    models.facultad.findAll().then(data => {
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});

router.get('/padron-list/all', VerifyToken, function (req, res) {
    models.padron_electoral.findAll({
    include:[
        {model: models.facultad,attributes: ['id_facultad','nombre']},
        {model: models.tipo_proceso,attributes: ['id_tipo_proceso','nombre']},
    ]
    }).then(data => {
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("Hubo un problema cargando la lista padron." + err);
    });
});
*/

module.exports = router;