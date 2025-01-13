<?php

function appointmentTeachers_route($endpoint, $method)
{
   $api_key='';
   require_once(__DIR__ . "/../../includes/library.php");
   $pdo=connectdb();
   if(isset($_SERVER['HTTP_X_API_KEY']))
   {
      $api_key=$_SERVER["HTTP_X_API_KEY"];
      $stmt=$pdo->prepare("SELECT teacherID FROM teacher WHERE api_key = ?");
      $stmt->execute([$api_key]);
      $result=$stmt->fetch(PDO::FETCH_ASSOC);
      if(empty($result))
      {
         return ([400, ["Error"=> "The API key is invalid!"]]);
      }
      $TeacherID=$result["teacherID"];
   }

   else
   {
      return ([400, ["Error"=> "You must provide an API Key"]]);
   }
    require_once(__DIR__ . "/../../includes/library.php");
    $pdo=connectdb();
    $endpoint=trim($endpoint, "/");

    if(count(explode("/", $endpoint)) == 1 && $method ==="GET" )
    {
      $stmt=$pdo->prepare("SELECT appointment.*, teacher.subject FROM appointment JOIN teacher ON appointment.teacherID = teacher.teacherID WHERE appointment.teacherID=? ");
      $stmt->execute([$TeacherID]);
      $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
      return ([200, ["Teacher's Appointments"=>$result]]);
    }
    

   else if(count(explode("/", $endpoint)) == 4 && $method === "DELETE" && explode("/", $endpoint)[1]=="consider")
    {
      $errors=[];
      $appointID=explode("/", $endpoint)[2];
      $consider=explode("/", $endpoint)[3];
      $consider_num=$consider;
      $stmt=$pdo->prepare("SELECT 1 FROM appointment WHERE appointID = ?");
      $stmt->execute([$appointID]);
      $result=$stmt->fetch(PDO::FETCH_ASSOC);
      if(empty($result))
      {
         return ([400, ["Error"=>"AppointID does not exist"]]);
      }
      $stmt=$pdo->prepare("SELECT * FROM appointment WHERE appointID = ?");
      $stmt->execute([$appointID]);
      $result=$stmt->fetch(PDO::FETCH_ASSOC);
      $studentID=$result["studentID"];
      $year=$result["year"];
      $date=$result["date"];
      $time=$result["time"];
      $abb=$result["abb"];
      $stmt=$pdo->prepare("INSERT INTO approved(studentID, teacherID, year, date, time, abb, approved) VALUES (?, ?, ?, ?, ?, ?, ?)");
      $stmt->execute([$studentID, $TeacherID, $year, $date, $time, $abb, $consider_num]);
      $stmt=$pdo->prepare("DELETE FROM appointment WHERE appointID = ?");
      $stmt->execute([$appointID]);
     return ([200, ["Success"=> "Appointment considered"]]);

   }

   else
   {
      return ([400, ["Error"=> "Invalid endpoint!"]]);
   }
}


?>