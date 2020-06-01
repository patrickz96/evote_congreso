-- MySQL Script generated by MySQL Workbench
-- Tue May 26 16:40:47 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`electores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`electores` ;

CREATE TABLE IF NOT EXISTS `mydb`.`electores` (
  `id_elector` INT NOT NULL COMMENT 'Identificador autonumerico',
  `documento_identidad` VARCHAR(15) NULL COMMENT '\'dni,pasaporte,carne de extranjeria\'',
  `ap_paterno` VARCHAR(100) NULL COMMENT '\'apellido paterno\'',
  `ap_materno` VARCHAR(100) NULL COMMENT '\'apellido materno\'',
  `nombres` VARCHAR(45) NULL COMMENT '\'nombres\'',
  `email` VARCHAR(45) NULL COMMENT '\'correo electronico\'',
  `tipo_elector` TINYINT NULL COMMENT '0=docente, 1=administrativo, 2=estudiante',
  `estado` TINYINT NULL COMMENT '\'0=activo,1=inactivo\'',
  `created_at` VARCHAR(45) NULL COMMENT '\'creado en (fecha-hora)\'',
  `updated_at` VARCHAR(45) NULL COMMENT '\'actualizado en (fecha-hora)\'',
  PRIMARY KEY (`id_elector`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;


-- -----------------------------------------------------
-- Table `mydb`.`facultades`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`facultades` ;

CREATE TABLE IF NOT EXISTS `mydb`.`facultades` (
  `id_facultad` INT NOT NULL COMMENT 'identificador autonumerico',
  `codigo` VARCHAR(45) NULL COMMENT '\'Codigo interno de la Facultad\'',
  `nombre` VARCHAR(100) NULL COMMENT '\'nombre de la facultad\'',
  `estado` TINYINT NULL COMMENT '\'0=activo,1=inactivo\'',
  `created_at` DATETIME NULL COMMENT 'creado en (fecha-hora)',
  `updated_at` DATETIME NULL COMMENT 'actualizado en (fecha-hora)',
  PRIMARY KEY (`id_facultad`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;


-- -----------------------------------------------------
-- Table `mydb`.`departamentos_academicos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`departamentos_academicos` ;

CREATE TABLE IF NOT EXISTS `mydb`.`departamentos_academicos` (
  `id_dpto_aca` INT NOT NULL COMMENT 'identificador autonumerico',
  `id_facultad` INT NOT NULL COMMENT 'Identificador de la facultad',
  `codigo` VARCHAR(45) NULL COMMENT '\'Codigo interno de los departamentos academicos\'',
  `nombre` VARCHAR(100) NULL COMMENT '\'nombre del departamento académico\'',
  `estado` TINYINT NULL COMMENT '\'0=activo,1=inactivo\'',
  `created_at` DATETIME NULL COMMENT 'creado en (fecha-hora)',
  `updated_at` DATETIME NULL COMMENT 'actualizado en (fecha-hora)',
  PRIMARY KEY (`id_dpto_aca`),
  CONSTRAINT `fk_departamentos_academicos_facultades`
    FOREIGN KEY (`id_facultad`)
    REFERENCES `mydb`.`facultades` (`id_facultad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;

CREATE INDEX `fk_departamentos_academicos_facultades_idx` ON `mydb`.`departamentos_academicos` (`id_facultad` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mydb`.`escuelas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`escuelas` ;

CREATE TABLE IF NOT EXISTS `mydb`.`escuelas` (
  `id_escuela` INT NOT NULL COMMENT 'identificador autonumerico',
  `id_facultad` INT NOT NULL COMMENT 'Identificador de la Facultad',
  `codigo` VARCHAR(45) NULL COMMENT '\'Codigo interno de las escuelas\'',
  `nombre` VARCHAR(100) NULL COMMENT '\'nombre de la escuela\'',
  `estado` TINYINT NULL COMMENT '\'0=activo,1=inactivo\'',
  `created_at` DATETIME NULL COMMENT 'creado en (fecha-hora)',
  `updated_at` DATETIME NULL COMMENT 'actualizado en (fecha-hora)',
  PRIMARY KEY (`id_escuela`),
  CONSTRAINT `fk_escuelas_facultades1`
    FOREIGN KEY (`id_facultad`)
    REFERENCES `mydb`.`facultades` (`id_facultad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;

CREATE INDEX `fk_escuelas_facultades1_idx` ON `mydb`.`escuelas` (`id_facultad` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mydb`.`procesos_electorales`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`procesos_electorales` ;

CREATE TABLE IF NOT EXISTS `mydb`.`procesos_electorales` (
  `id_proceso_electoral` INT NOT NULL COMMENT 'Identificador autonumerico',
  `nombre` VARCHAR(4) NULL COMMENT '\'Nombre de las elecciones macro\'',
  `numero_procesos` VARCHAR(4) NULL COMMENT '\'cantidad de tipos de elecciones que pertenecen al proceso\'',
  `apertura` DATETIME NULL COMMENT 'fecha y hora de apertura de la votación',
  `cierre` DATETIME NULL COMMENT 'fecha y hora de cierre de la votación',
  `activo` TINYINT NULL COMMENT '0=inactivo,1=activo',
  `created_at` DATETIME NULL COMMENT 'creado en (fecha-hora)',
  `updated_at` DATETIME NULL COMMENT 'actualizado (fecha-hora)',
  PRIMARY KEY (`id_proceso_electoral`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;


-- -----------------------------------------------------
-- Table `mydb`.`padron_electoral`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`padron_electoral` ;

CREATE TABLE IF NOT EXISTS `mydb`.`padron_electoral` (
  `id_padron_electoral` INT NOT NULL COMMENT 'Id autonumerico',
  `id_proceso_electoral` INT NOT NULL,
  `id_elector` INT NOT NULL COMMENT 'Identificador del elector',
  `enviado` TINYINT NULL COMMENT '0=inactivo, 1=activo',
  `estado` TINYINT NULL,
  `clave_secreta` VARCHAR(45) NULL,
  `created_at` DATETIME NULL COMMENT 'creado en (fecha-hora)',
  `updated_at` DATETIME NULL COMMENT 'actualizado en (fecha-hora)',
  PRIMARY KEY (`id_padron_electoral`),
  CONSTRAINT `fk_padron_electores_electores1`
    FOREIGN KEY (`id_elector`)
    REFERENCES `mydb`.`electores` (`id_elector`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_padron_electores_procesos_electorales1`
    FOREIGN KEY (`id_proceso_electoral`)
    REFERENCES `mydb`.`procesos_electorales` (`id_proceso_electoral`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;

CREATE INDEX `fk_padron_electores_electores1_idx` ON `mydb`.`padron_electoral` (`id_elector` ASC) VISIBLE;

CREATE INDEX `fk_padron_electores_procesos_electorales1_idx` ON `mydb`.`padron_electoral` (`id_proceso_electoral` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mydb`.`asistencias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`asistencias` ;

CREATE TABLE IF NOT EXISTS `mydb`.`asistencias` (
  `id_asistencia` INT NOT NULL COMMENT 'Identificador autonumerico',
  `id_padron_electoral` INT NOT NULL COMMENT 'Identificador del padron con sus electores',
  `clave_ingreso` VARCHAR(45) NULL COMMENT '\'Clave encriptada\'',
  `created_at` DATETIME NULL COMMENT 'creado en (fecha-hora)',
  `updated_at` DATETIME NULL COMMENT 'actualizado en (fecha-hora)',
  PRIMARY KEY (`id_asistencia`),
  CONSTRAINT `fk_asistencias_padron_electores1`
    FOREIGN KEY (`id_padron_electoral`)
    REFERENCES `mydb`.`padron_electoral` (`id_padron_electoral`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;

CREATE INDEX `fk_asistencias_padron_electores1_idx` ON `mydb`.`asistencias` (`id_padron_electoral` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mydb`.`tipos_procesos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`tipos_procesos` ;

CREATE TABLE IF NOT EXISTS `mydb`.`tipos_procesos` (
  `id_tipos_procesos` INT NOT NULL COMMENT 'Identificador autonumerico',
  `id_proceso_electoral` INT ZEROFILL NOT NULL COMMENT 'Identificador del proceso electoral macro',
  `nombre` VARCHAR(45) NULL COMMENT '\'Nombre del tipo de proceso electoral\'',
  `activo` TINYINT NULL COMMENT '0=inactivo,1=activo',
  `created_at` DATETIME NULL COMMENT 'creado en (fecha-hora)',
  `updated_at` DATETIME NULL COMMENT 'actualizado en (fecha-hora)',
  PRIMARY KEY (`id_tipos_procesos`),
  CONSTRAINT `fk_tipos_procesos_procesos_electorales1`
    FOREIGN KEY (`id_proceso_electoral`)
    REFERENCES `mydb`.`procesos_electorales` (`id_proceso_electoral`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;

CREATE INDEX `fk_tipos_procesos_procesos_electorales1_idx` ON `mydb`.`tipos_procesos` (`id_proceso_electoral` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mydb`.`listas_electorales`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`listas_electorales` ;

CREATE TABLE IF NOT EXISTS `mydb`.`listas_electorales` (
  `id_listas_electorales` INT NOT NULL COMMENT 'Identificador autonumerico',
  `id_tipos_procesos` INT NOT NULL COMMENT 'Identificador del tipo de proceso para una lista',
  `id_facultad` INT NOT NULL,
  `nombre` VARCHAR(45) NULL COMMENT '\'Nombre de la agrupacion politica\'',
  `logo` VARCHAR(45) NULL COMMENT '\'Logo de la agrupacion politica\'',
  `representacion` VARCHAR(45) NULL COMMENT '\'Nombre de la representacion\'',
  `tipo_representacion` VARCHAR(45) NULL COMMENT '\'Tipo de representacion\'',
  `estado` TINYINT NULL COMMENT '0=inactivo,1=inactivo',
  `created_at` DATETIME NULL COMMENT 'creado en (fecha-hora)',
  `updated_at` DATETIME NULL COMMENT 'actualizado en (fecha-hora)',
  PRIMARY KEY (`id_listas_electorales`),
  CONSTRAINT `fk_listas_electorales_tipos_procesos1`
    FOREIGN KEY (`id_tipos_procesos`)
    REFERENCES `mydb`.`tipos_procesos` (`id_tipos_procesos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_listas_electorales_facultades1`
    FOREIGN KEY (`id_facultad`)
    REFERENCES `mydb`.`facultades` (`id_facultad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;

CREATE INDEX `fk_listas_electorales_tipos_procesos1_idx` ON `mydb`.`listas_electorales` (`id_tipos_procesos` ASC) VISIBLE;

CREATE INDEX `fk_listas_electorales_facultades1_idx` ON `mydb`.`listas_electorales` (`id_facultad` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mydb`.`votacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`votacion` ;

CREATE TABLE IF NOT EXISTS `mydb`.`votacion` (
  `id_votacion` INT NOT NULL COMMENT 'Identificador autonumerico',
  `id_listas_electorales` INT NOT NULL COMMENT 'Identificador de las listas electorales',
  `id_asistencia` INT NOT NULL COMMENT 'Identificador de la asistencia',
  `created_at` DATETIME NULL COMMENT 'creado en (fecha-hora)',
  `updated_at` DATETIME NULL COMMENT 'actualizado en (fecha-hora)',
  PRIMARY KEY (`id_votacion`),
  CONSTRAINT `fk_votacion_listas_electorales1`
    FOREIGN KEY (`id_listas_electorales`)
    REFERENCES `mydb`.`listas_electorales` (`id_listas_electorales`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_votacion_asistencias1`
    FOREIGN KEY (`id_asistencia`)
    REFERENCES `mydb`.`asistencias` (`id_asistencia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;

CREATE INDEX `fk_votacion_listas_electorales1_idx` ON `mydb`.`votacion` (`id_listas_electorales` ASC) VISIBLE;

CREATE INDEX `fk_votacion_asistencias1_idx` ON `mydb`.`votacion` (`id_asistencia` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mydb`.`docentes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`docentes` ;

CREATE TABLE IF NOT EXISTS `mydb`.`docentes` (
  `id_elector` INT NOT NULL COMMENT 'Identificador de la llave compartida de electores',
  `id_dpto_aca` INT NOT NULL COMMENT 'Identificador del departamento academico',
  `codigo` VARCHAR(45) NULL COMMENT 'Codigo del docente',
  PRIMARY KEY (`id_elector`),
  CONSTRAINT `fk_docentes_departamentos_academicos1`
    FOREIGN KEY (`id_dpto_aca`)
    REFERENCES `mydb`.`departamentos_academicos` (`id_dpto_aca`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_docentes_electores1`
    FOREIGN KEY (`id_elector`)
    REFERENCES `mydb`.`electores` (`id_elector`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;

CREATE INDEX `fk_docentes_departamentos_academicos1_idx` ON `mydb`.`docentes` (`id_dpto_aca` ASC) VISIBLE;

CREATE INDEX `fk_docentes_electores1_idx` ON `mydb`.`docentes` (`id_elector` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mydb`.`dependencias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`dependencias` ;

CREATE TABLE IF NOT EXISTS `mydb`.`dependencias` (
  `id_dependencias` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador de las dependencias',
  `nombre` VARCHAR(45) NULL COMMENT 'Nombres de las dependencias',
  `estado` TINYINT NULL COMMENT '0=inactivo,1=activo',
  PRIMARY KEY (`id_dependencias`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;


-- -----------------------------------------------------
-- Table `mydb`.`administrativos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`administrativos` ;

CREATE TABLE IF NOT EXISTS `mydb`.`administrativos` (
  `id_elector` INT NOT NULL COMMENT 'Identificador de la llave compartida de elector',
  `id_dependencias` INT NOT NULL COMMENT 'Identificador de las dependencias',
  `codigo` VARCHAR(45) NULL COMMENT 'Codigo del administrativo',
  PRIMARY KEY (`id_elector`),
  CONSTRAINT `fk_administrativos_dependencias1`
    FOREIGN KEY (`id_dependencias`)
    REFERENCES `mydb`.`dependencias` (`id_dependencias`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_administrativos_electores1`
    FOREIGN KEY (`id_elector`)
    REFERENCES `mydb`.`electores` (`id_elector`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;

CREATE INDEX `fk_administrativos_dependencias1_idx` ON `mydb`.`administrativos` (`id_dependencias` ASC) VISIBLE;

CREATE INDEX `fk_administrativos_electores1_idx` ON `mydb`.`administrativos` (`id_elector` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mydb`.`esudiantes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`esudiantes` ;

CREATE TABLE IF NOT EXISTS `mydb`.`esudiantes` (
  `id_elector` INT NOT NULL COMMENT 'Identificador de la llave compartir de elector',
  `id_escuela` INT NOT NULL COMMENT 'Identificador de la Escuela',
  `cui` VARCHAR(12) NULL COMMENT 'Codigo unico institucional',
  PRIMARY KEY (`id_elector`),
  CONSTRAINT `fk_esudiantes_electores1`
    FOREIGN KEY (`id_elector`)
    REFERENCES `mydb`.`electores` (`id_elector`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_esudiantes_escuelas1`
    FOREIGN KEY (`id_escuela`)
    REFERENCES `mydb`.`escuelas` (`id_escuela`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_spanish_ci;

CREATE INDEX `fk_esudiantes_electores1_idx` ON `mydb`.`esudiantes` (`id_elector` ASC) VISIBLE;

CREATE INDEX `fk_esudiantes_escuelas1_idx` ON `mydb`.`esudiantes` (`id_escuela` ASC) VISIBLE;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
