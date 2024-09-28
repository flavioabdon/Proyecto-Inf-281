<?php 
class Conexion{	  
    public static function Conectar(){
        $host ="localhost";
        $dbname ="DB-281";
        $username ="postgres";
        $pasword ="123456";
    try{
        $conn = new PDO("pgsql:host=$host; dbname=$dbname", $username,$pasword);
        return $conn;
    }
    catch(PDOException $exp){
        echo ("no se pudo conectar, $exp");
    }
     
 }
}