<?php

function approved_route($endpoint, $method)
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

    if(count(explode("/", $endpoint)) == 1 && $method ==="GET" )
    {
      $stmt=$pdo->prepare("SELECT teacherID, year, date, time, abb, approve FROM approved WHERE studentID=?"); 
      $stmt->execute([$StudentID]);
      $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
      return ([200, ["Student's Appointments"=>$result]]);
    }



   else
   {
      return ([400, ["Error"=> "Invalid endpoint!"]]);
   }
}


?>