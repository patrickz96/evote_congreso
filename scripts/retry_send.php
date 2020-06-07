<?php
use PHPMailer\PHPMailer\PHPMailer;

ini_set("max_execution_time", 0);

require "PHPMailer/src/Exception.php";
require "PHPMailer/src/PHPMailer.php";
require "PHPMailer/src/SMTP.php";

date_default_timezone_set("America/Lima");

// Variables
$nombre_proceso = "Proceso electoral 2020";
$list = [];
$email_user = "notificacion@unsa.edu.pe";
$email_pwd = "Temporal2000$";
$email_name = "EVOTE - ENVIO DE CLAVES (PARA PRUEBA DEL SISTEMA)";
$email_subject = "CLAVES DE INGRESO A ELECCIONES VIRTUALES - ".$nombre_proceso;
$connStr = "host=10.100.100.206 port=5432 dbname=evote user=postgres password=infounsadbmaster2020evote";

// Funciones
function get_db_connection($parameters){
	$conn = pg_connect($parameters." options='--client_encoding=UTF8'");
	return $conn;
}

function get_id_active_process($conn){
	$result = pg_query($conn, "select id_proceso_electoral as id from proceso_electoral order by id desc limit 1");
	if(!$result) exit;
	$line = pg_fetch_assoc($result);
	return $line['id'];
}

function send_keys($list, $process_name, $mailer, $conn){
	echo "Preparing to send...".count($list)." keys in total\n";
	$total = 0;
	echo "<strong>la fecha inicio es:</strong> " . date("d") . " del " . date("m") . " de " . date("Y").", Hora: ".date("G").":".date("i").":".date("s")."<br>\n";
	for($i = 0; $i < count($list); $i++){
		$id = $list[$i]['id'];
		$apn = utf8_decode($list[$i]['apn']);
		$email = $list[$i]['email'];
		$key = $list[$i]['clave_secreta'];
		$message = "<html>
			Estimado(a) elector ".$apn.":<br/><br/>
			Es grato dirigirnos a usted, para hacerle una invitación cordial para participar en los comicios electorales de Junio del 2020 de nuestra Universidad.<br/>
			Este proceso electoral se realizará por primera vez de forma electrónica y deberá emitir su voto para los siguientes procesos:<br/><br/>
			- Representantes docentes para Asamblea Universitaria<br/>
			- Representantes docentes para Consejo de Facultad<br/><br/>
			Por su seguridad le enviamos una clave secreta que es totalmente confidencial:<br/><br/>
			<strong>Clave Secreta:</strong> <mark>".$key.'</mark><br/><br/>
			El registro para ingresar a la aplicación informática: Voto Electrónico es únicamente con su correo institucional de la UNSA.<br/><br/>
			Para efectuar su voto, debe ingresar el dia 08/06/2020 en el horario de 07:00 PM a 09:00 PM al siguiente Link:<br><br/>
			Link: <a href="https://evote.unsa.edu.pe/">https://evote.unsa.edu.pe</a> <br/><br/>
			Ante algun incidente, puede comunicarse al correo: ouisdesarrollo@unsa.edu.pe.<br/><br/>
			<strong>Atte,<br/><br/>
			Oficina Universitaria de Informática y Sistemas.</strong><br/>
			</html>';
		$mailer->msgHtml($message);
		$mailer->addAddress($email, $apn);
		if(!$mailer->send()){
			echo "Mailer error for id ".$id." with email ".$email." ".$mailer->ErrorInfo."\n";
		}else{
			$total++;
			echo $total.": Mensaje enviado con exito a ".$email."\n";
			// update database
			pg_query("UPDATE padron_electoral SET enviado = true WHERE id_elector = ".$id);
		}
		$mailer->ClearAllRecipients();
		sleep(1);
	}
	echo "<strong>la fecha fin es:</strong> " . date("d") . " del " . date("m") . " de " . date("Y").", Hora: ".date("G").":".date("i").":".date("s")."<br>";

}

function get_mailer_layout($email_user, $email_pwd, $email_name, $email_subject){
	$mail = new PHPMailer;
	$mail->isSMTP();
	$mail->SMTPDebug = 0;	//Production use
	//$mail->Debugoutput = 'html';	// When use as web page
	$mail->Host = "smtp-relay.gmail.com";
	$mail->Port = 25;
	$mail->SMTPAuth = true;
	$mail->Username = $email_user;
	$mail->Password = $email_pwd;
	$mail->setFrom($email_user, $email_name);
	$mail->addReplyTo($email_user, $email_name);
	$mail->Subject = $email_subject;
	//$mail->msgHTML($msg);
	//$mail->addAttachment("filename.ext");
	// Add addresses
	return $mail;
}

// Obtiene el padron de electores activos en el proceso electoral activo, a los que no se envio la clave secreta
function get_padron_electoral($conn, $id_active_process){
	$list = [];
	$result = pg_query($conn, "select p.id_padron_electoral as id, e.apn, e.email, p.clave_secreta from elector e inner join padron_electoral p on e.id_elector = p.id_elector where e.estado = true and p.enviado = false and id_proceso_electoral = ".$id_active_process);

	if(!$result){
		echo "An error ocurred.\n";
		exit;
	}

	$list = pg_fetch_all($result);
	return $list;
}

$conn = get_db_connection($connStr);
$id_active_process = get_id_active_process($conn);
$list = get_padron_electoral($conn, $id_active_process);
$mailer = get_mailer_layout($email_user, $email_pwd, $email_name, $email_subject);
send_keys($list, $nombre_proceso, $mailer, $conn);
pg_close($conn);
?>