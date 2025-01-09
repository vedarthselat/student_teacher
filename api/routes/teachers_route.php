<?php
function teachers_func($endpoint, $method)
{
    // require_once(__DIR__."/../..includes/library.php");
    require_once( "../includes/library.php");
    $pdo = connectdb();
    $endpoint = trim($endpoint, "/");

    
    if (count(explode("/", $endpoint)) == 1 && $method === "GET") {
     
        $stmt = $pdo->query("SELECT teacherID, username, subject FROM teacher");
        $allRows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $arr = [200,  $allRows];
        return $arr;
    }

    else if (count(explode("/", $endpoint)) == 2 && $method === "GET") {
        $stmt = $pdo->prepare("SELECT username, email, subject FROM teacher WHERE teacherID = ?");
        $stmt->execute([explode("/", $endpoint)[1]]);
        $results = $stmt->fetch(PDO::FETCH_ASSOC);
        if (empty($results)) {
            return ([400, ["Error" => "ID does not exist!"]]);
        } 
        else
            return ([200, ["Info of movie of id " . explode("/", $endpoint)[1] => $results]]);
    } 

    else if(count(explode("/", $endpoint)) == 2 && $method ==="POST" && explode("/", $endpoint)[1] == "entries")
    {
      $errors=[];
      if(!isset($_POST["username"]))
      {
         $errors["username"]="username not provided";
      }
      if(!isset($_POST["email"]))
      {
         $errors["priority"]="email not provided";
      }
      if(!isset($_POST["password"]))
      {
         $errors["password"]="password not provided";
      }
      if(!isset($_POST["subject"]))
      {
         $errors["subject"]="subject not provided";
      }

      if(!empty($errors))
      {
         return ([400, ["Error"=>$errors]]);
      }
      $username=$_POST["username"];
      $email=$_POST["email"];
      $subject=$_POST["subject"];
      $password=$_POST["password"];
      $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
      if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ([400, ["Error"=> "Invalid email!"]]);
    } 
        $stmt=$pdo->prepare("INSERT INTO teacher (username, email, password, subject) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $email, $hashedPassword, $subject]);
        return ([200, ["Success"=> "Data inserted"]]);
      
    }


    
    
    else {
        return ([400, ["Endpoint not found!"]]);
    }
}
?>