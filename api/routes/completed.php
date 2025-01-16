<?php

function completed_route($endpoint, $method)
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

    if ($method === "GET" && count(explode("/", $endpoint)) == 1 && isset($_GET["name"])) {
        $name = "%" . $_GET["name"] . "%";
        $stmt = $pdo->prepare("SELECT teacher.name, teacher.image, completedAppointment.* FROM completedAppointment JOIN teacher ON completedAppointment.teacherID = teacher.teacherID WHERE teacher.name LIKE ? AND completedAppointment.studentID = ?");
        
        $stmt->execute([$name, $StudentID]);

      //   var_dump($stmt) ;
      //   exit;
         
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($result as &$row) {
            if (!empty($row['image'])) {
                $row['image'] = base64_encode($row['image']); // Convert binary data to Base64
            }
        }
        return ([200, ["Student's Completed Appointments" => $result]]);
     }



    if(count(explode("/", $endpoint)) == 1 && $method ==="GET" )
    {
      $stmt=$pdo->prepare("SELECT teacher.teacherID, teacher.name, teacher.image, completedAppointment.* FROM completedAppointment JOIN teacher ON completedAppointment.teacherID = teacher.teacherID WHERE studentID=?"); 
      $stmt->execute([$StudentID]);
      $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
      foreach ($result as &$row) {
        if (!empty($row['image'])) {
            $row['image'] = base64_encode($row['image']); // Convert binary data to Base64
        }
    }
      return ([200, ["Student's Completed Appointments"=>$result]]);
    }

    

   else
   {
      return ([400, ["Error"=> "Invalid endpoint!"]]);
   }
}


?>