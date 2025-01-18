<?php

function completedTeachers_route($endpoint, $method)
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
      $stmt=$pdo->prepare("SELECT completedAppointment.*, student.name, student.image FROM completedAppointment JOIN student ON completedAppointment.studentID = student.studentID WHERE completedAppointment.teacherID=?"); 
      $stmt->execute([$TeacherID]);
      $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
      foreach ($result as &$row) {
         if (!empty($row['image'])) {
             $row['image'] = base64_encode($row['image']);
         }
     }
      return ([200, ["Teacher's Completed Appointments"=>$result]]);
    }

    

   else
   {
      return ([400, ["Error"=> "Invalid endpoint!"]]);
   }
}


?>