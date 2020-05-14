

# Electronic Vote (evote)


### Database creation

```sql

create database evote;

create table facultades(		            		            
id_facultad	INTEGER PRIMARY KEY,			
nombre	VARCHAR(100) NOT NULL,			
estado BOOLEAN NOT NULL
);				
				
create table departamento_academico(
id_dptoaca INTEGER PRIMARY KEY,
nombres VARCHAR(100) NOT NULL,
estado BOOLEAN NOT NULL
);

create table escuelas(
id_escuela INTEGER PRIMARY KEY,
nues INTEGER NOT NULL,
nombres VARCHAR(100) NOT NULL,
estado BOOLEAN NOT NULL
);

create table tipos_electores(
id_tipo_elec INTEGER PRIMARY KEY,
nomb_tipo_elec VARCHAR(100) NOT NULL
);

create table tipos_proceso(     
id_tipo_proc_elec INTEGER PRIMARY KEY,
nomb_proc_elec VARCHAR(100) NOT NULL
);

create table procesos_electorales(      
id_proc_elec INTEGER PRIMARY KEY,
anio DATE NOT NULL,
fecha_ingreso TIMESTAMP NOT NULL,
numero_procesos INTEGER NOT NULL,
Fecha_proc_electoral TIMESTAMP NOT NULL
);

create table detalle_proceso_electoral(
id_proc_elect INTEGER NOT NULL,
id_det_proc_elect INTEGER NOT NULL,
id_tipo_proc_elec INTEGER NOT NULL,
id_tipo_elec INTEGER NOT NULL
);

create table padron_electoral(
id_proc_elect INTEGER NOT NULL,
id_elector INTEGER NOT NULL,
tipo_elector BOOLEAN NOT NULL,
dni VARCHAR(8) NOT NULL,
correo VARCHAR(100) NOT NULL,
nombres VARCHAR(100) NOT NULL,
id_facultad INTEGER NOT NULL,    
id_escuela INTEGER NOT NULL,      
id_departamento INTEGER NOT NULL, 
id_otros INTEGER NOT NULL,
clave_ingreso VARCHAR(100) NOT NULL
);

create table listas_electorales(
id_lista INTEGER NOT NULL,
id_proc_elect INTEGER NOT NULL,
id_det_proc_elect INTEGER NOT NULL,
id_tipo_proc_elec INTEGER NOT NULL,
id_facultad INTEGER NOT NULL,     
id_escuela INTEGER NOT NULL,   
id_departamento INTEGER NOT NULL,
id_general INTEGER NOT NULL,
nombre VARCHAR(100) NOT NULL,
logo VARCHAR(100) NOT NULL,
tipo_representacion VARCHAR(100) NOT NULL,
representacion VARCHAR(100) NOT NULL
);

create table asistencia_proceso_electoral(
id_asistencia INTEGER NOT NULL,
id_proc_elec INTEGER NOT NULL,
id_elector INTEGER NOT NULL,
id_facultad INTEGER NOT NULL, 
id_escuela INTEGER NOT NULL,  
id_departamento INTEGER NOT NULL,
id_general INTEGER NOT NULL,
fecha timestamp,
clave_ingreso VARCHAR(100) NOT NULL,
dni VARCHAR(8) NOT NULL
);

create table votos_emitidos(
id_voto INTEGER NOT NULL,
id_proc_elect INTEGER NOT NULL,
id_det_proc_elect INTEGER NOT NULL,
id_tipo_proc_elec INTEGER NOT NULL,
id_facultad INTEGER NOT NULL,
id_escuela INTEGER NOT NULL,
id_departamento INTEGER NOT NULL,
id_general INTEGER NOT NULL,
id_asistencia INTEGER NOT NULL,
total_listas VARCHAR(100) NOT NULL,
voto VARCHAR(100) NOT NULL
);

create table conteo_votos(
id_voto INTEGER NOT NULL,
id_proc_elect INTEGER NOT NULL,
id_det_proc_elect INTEGER NOT NULL,
id_tipo_proc_elec INTEGER NOT NULL,
id_lista INTEGER NOT NULL,
id_facultad INTEGER NOT NULL,
id_escuela INTEGER NOT NULL,   
id_departamento INTEGER NOT NULL,
id_general INTEGER NOT NULL,
total VARCHAR(100) NOT NULL
);
