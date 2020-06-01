<?php
use PHPMailer\PHPMailer\PHPMailer;

ini_set("max_execution_time", 0);

require "PHPMailer/src/Exception.php";
require "PHPMailer/src/PHPMailer.php";
require "PHPMailer/src/SMTP.php";

date_default_timezone_set("America/Lima");

// Variables
$file_padron = "padron_claves.csv";
$nombre_proceso = "Proceso electoral 2020";
$list = [];
$email_user = "notificacion@unsa.edu.pe";
$email_pwd = "Temporal2000$";
$email_name = "EVOTE - ENVIO DE CLAVES (TEST NO RESPONDER)";
$email_subject = "CLAVES DE INGRESO A ELECCIONES VIRTUALES - ".$nombre_proceso;
$connStr = "host=localhost port=5432 dbname=evote user=postgres password=infounsadbmaster2020evote";
$id_active_process = 3;

// Funciones
function get_db_connection($parameters){
	$conn = pg_connect($parameters." options='--client_encoding=UTF8'");
	return $conn;
}

function read_file($filename){
	$list = [];
	echo "reading file ".$filename."\n";
	if(($f = fopen($filename, "r")) !== FALSE){
		fgetcsv($f, 1000, ","); # skip header
		while(($data = fgetcsv($f, 1000, ",")) !== FALSE){
			$list[] = $data;
		}
	}
	fclose($f);
	return $list;
}

function send_keys($list, $process_name, $mailer, $conn){
	echo "Preparing to send...".count($list)." keys in total\n";
	$total = 0;
	echo "<strong>la fecha inicio es:</strong> " . date("d") . " del " . date("m") . " de " . date("Y").", Hora: ".date("G").":".date("i").":".date("s")."<br>";
	for($i = 0; $i < count($list); $i++){
		$id = $list[$i][0];
		$apn = utf8_decode($list[$i][1]);
		$email = $list[$i][2];
		$key = $list[$i][3];
		$message = "<html>
			Estimado(a) elector ".$apn.":<br/>
			Es grato dirigirnos a usted para hacerle entrega de su clave para la eleccion virtual - ".$process_name.":<br/><br/><strong>Clave:</strong> <mark>".$key."</mark><br/><br/>No compartir esta clave con nadie, bajo su responsabilidad.<br/>No responder a este correo.<br> Gracias</html>";
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

$list = read_file($file_padron);
$mailer = get_mailer_layout($email_user, $email_pwd, $email_name, $email_subject);
$conn = get_db_connection($connStr);
$result = pg_query($conn, "select id_elector, enviado from padron_electoral where id_proceso_electoral = ".$id_active_process);
//var_dump(pg_fetch_all($result));
send_keys($list, $nombre_proceso, $mailer, $conn);
pg_close($conn);
?>
