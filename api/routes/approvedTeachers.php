<?php

function approvedTeachers_route($endpoint, $method)
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
      $stmt=$pdo->prepare("SELECT student.name, student.image, approved.approvedID, approved.studentID, approved.year, approved.date, approved.time, approved.abb, approved.approve FROM approved JOIN student ON approved.studentID = student.studentID WHERE approved.teacherID=?"); 
      $stmt->execute([$TeacherID]);
      $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
      foreach ($result as &$row) {
         if (!empty($row['image'])) {
             $row['image'] = base64_encode($row['image']);
         }
     }
      return ([200, ["Teacher's Appointments"=>$result]]);
    }
    else if(count(explode("/", $endpoint)) == 2 && $method ==="DELETE")
    {
        $approvedID=explode("/", $endpoint)[1];
        $stmt=$pdo->prepare("SELECT * FROM approved WHERE approvedID=?");
        $stmt->execute([$approvedID]);
        $result=$stmt->fetch(PDO::FETCH_ASSOC);
        
        if(empty($result))
        {
            return ([400, ["Error"=> "Invalid approvedID"]]);
        }
        if($result["approve"]==0)
        {
            return ([400, ["Error"=> "Cannot mark unapproved appointment as completed"]]);
        }
        $studentID=$result["studentID"];
        $year=$result["year"];
        $date=$result["date"];
        $time=$result["time"];
        $abb=$result["abb"];
        $stmt=$pdo->prepare("INSERT INTO completedAppointment (studentID, teacherID, year, date, time, abb) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$studentID, $TeacherID, $year, $date, $time, $abb]);
        $stmt=$pdo->prepare("DELETE FROM approved WHERE approvedID=?");
        $stmt->execute([$approvedID]);
        return ([200, ["Success"=> "Appointment marked as completed"]]);
    }
      

   else
   {
      return ([400, ["Error"=> "Invalid endpoint!"]]);
   }
}


?>