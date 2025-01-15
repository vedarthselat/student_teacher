<?php

function appointments_route($endpoint, $method)
{
   $api_key='';
   require_once(__DIR__ . "/../../includes/library.php");
   $pdo=connectdb();
   if(isset($_SERVER['HTTP_X_API_KEY']))
   {
      $api_key=$_SERVER["HTTP_X_API_KEY"];
      $stmt=$pdo->prepare("SELECT studentID FROM student WHERE api_key = ?");
      $stmt->execute([$api_key]);
      $result=$stmt->fetch(PDO::FETCH_ASSOC);
      if(empty($result))
      {
         return ([400, ["Error"=> "The API key is invalid!"]]);
      }
      $StudentID=$result["studentID"];
   }

   else
   {
      return ([400, ["Error"=> "You must provide an API Key"]]);
   }
    require_once(__DIR__ . "/../../includes/library.php");
    $pdo=connectdb();
    $endpoint=trim($endpoint, "/");

    if (count(explode("/", $endpoint)) == 1 && $method === "GET") {
      $stmt = $pdo->prepare("
          SELECT appointment.*, teacher.subject, teacher.image, teacher.name
          FROM appointment
          JOIN teacher ON appointment.teacherID = teacher.teacherID
          WHERE appointment.studentID = ?
      ");
      $stmt->execute([$StudentID]);
      $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
  
      // Iterate through each row to encode the image field
      foreach ($results as &$row) {
          if (!empty($row['image'])) {
              $row['image'] = base64_encode($row['image']);
          }
      }
  
      return ([200, ["Student's Appointments" => $results]]);
  }
  


    else if(count(explode("/", $endpoint)) == 2 && $method ==="POST" && explode("/", $endpoint)[1] == "entries")
    {
      $errors=[];
      if(!isset($_POST["teacherID"]))
      {
         $errors["teacherID"]="teacherID not provided";
      }
      if(!isset($_POST["year"]))
      {
         $errors["year"]="year not provided";
      }
      if(!isset($_POST["date"]))
      {
         $errors["date"]="date not provided";
      }
      if(!isset($_POST["time"]))
      {
         $errors["time"]="time not provided";
      }
      if(!isset($_POST["abb"]))
      {
         $errors["abb"]="Abbreviation not provided";
      }

      if(!empty($errors))
      {
         return ([400, ["Error"=>$errors]]);
      }
      $teacherID=$_POST["teacherID"];
      $year=$_POST["year"];
      $date=$_POST["date"];
      $time=$_POST["time"];
      $abb=$_POST["abb"];
      $stmt=$pdo->prepare("SELECT 1 FROM teacher WHERE teacherID= ?");
      $stmt->execute([$teacherID]);
      $result=$stmt->fetch(PDO::FETCH_ASSOC);
      if(empty($result))
      {
         return ([400, ["Error"=>"Teacher does not exist"]]);
      }

      if($year < 2025)
      {
         return ([400, ["Error"=> "Invalid Year"]]);
      }

      $stmt=$pdo->prepare("INSERT INTO appointment (studentID, teacherID, year, date, time, abb) VALUES (?, ?, ?, ?, ?, ?)");
      $stmt->execute([$StudentID, $teacherID, $year, $date, $time, $abb]);
      return ([200, ["Success"=> "Data inserted"]]);
    }

    else if(count(explode("/", $endpoint)) == 3 && $method === "DELETE" && explode("/", $endpoint)[1]=="entries")
    {
      $errors=[];
      $appointID=explode("/", $endpoint)[2];
      $stmt=$pdo->prepare("SELECT 1 FROM appointment WHERE appointID = ?");
      $stmt->execute([$appointID]);
      $result=$stmt->fetch(PDO::FETCH_ASSOC);
      if(empty($result))
      {
         return ([400, ["Error"=>"AppointID does nit exist"]]);
      }
     $stmt=$pdo->prepare("DELETE FROM appointment WHERE appointID = ?");
     $stmt->execute([$appointID]);
     return ([200, ["Success"=> "Appointment cancelled"]]);

   }

   else
   {
      return ([400, ["Error"=> "Invalid endpoint!"]]);
   }
}


?>