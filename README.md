

# Electronic Vote (evote)


### Database creation

```sql

create database evote;


create table facultades(		            		            
id_facultad	PRIMARY KEY,			
nombre	VARCHAR(100) NOT NULL,			
estado BOOLEAN NOT NULL
);				
				
create table departamento_academico(
id_dptoaca PRIMARY KEY,
nombres VARCHAR(100) NOT NULL,
estado BOOLEAN NOT NULL
);

create table escuelas(
id_escuela PRIMARY KEY,
nues INTEGER NOT NULL,
nombres VARCHAR(100) NOT NULL,
estado BOOLEAN NOT NULL
);

create table tipos_electores(
id_tipo_elec PRIMARY KEY,
nomb_tipo_elec VARCHAR(100) NOT NULL
);

create table tipos_proceso(     
id_tipo_proc_elec PRIMARY KEY,
nomb_proc_elec VARCHAR(100) NOT NULL
);


create table procesos_electorales(      
id_proc_elec PRIMARY KEY,
ano INTEGER(4) NOT NULL,
fecha_ingreso TIMESTAMP NOT NULL,
numero de procesos INTEGER NOT NULL,
Fecha_proc_electoral TIMESTAMP NOT NULL
);

create table DETALLE PROCESO ELECTORAL(
id_proc_elect INTEGER NOT NULL,
id_det_proc_elect INTEGER NOT NULL,
id_tipo_proc_elec INTEGER NOT NULL,
id_tipo_elec INTEGER NOT NULL,
);

create table Padron_Electoral(
id_proc_elect INTEGER NOT NULL,
Id_elector INTEGER NOT NULL,
Tipo_elector 
dni INTEGER NOT NULL,
correo VARCHAR(100) NOT NULL,
nombres VARCHAR(100) NOT NULL,
Id_facultad INTEGER NOT NULL,    
Id_escuela INTEGER NOT NULL,      
Id_departamento INTEGER NOT NULL, 
id_otros INTEGER NOT NULL,
Clave de ingreso VARCHAR(100) NOT NULL
);


create table LISTA ELECTORALES
id_lista INTEGER NOT NULL,
id_proc_elect INTEGER NOT NULL,
id_det_proc_elect INTEGER NOT NULL,
id_tipo_proc_elec INTEGER NOT NULL,
Id_facultad INTEGER NOT NULL,     
Id_escuela INTEGER NOT NULL,   
Id_departamento INTEGER NOT NULL,
id_general INTEGER NOT NULL,
NOMBRE VARCHAR(100) NOT NULL,
LOGO VARCHAR(100) NOT NULL,
tipo_representacion VARCHAR(100) NOT NULL,
representacion VARCHAR(100) NOT NULL,


create table Asistencia Proceso electoral
Id_asistencia
Id_proc_elec
Id_elector
fecha
Id_facultad     
Id_escuela    
Id_departamento 
id_general

      Clave de ingreso
      DNI


create table Votos_emitidos
id_voto
id_proc_elect
id_det_proc_elect
id_tipo_proc_elec
total de listas
voto
Id_facultad     
Id_escuela    
Id_departamento 
id_general
=Id_asistencia



create table CONTEO_votos
id_voto
id_proc_elect
id_det_proc_elect
id_tipo_proc_elec
    Id_lista  
    Total
Id_facultad     
Id_escuela    
Id_departamento 
id_general
```
