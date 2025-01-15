<?php
function teachers_func($endpoint, $method)
{
    // require_once(__DIR__."/../..includes/library.php");
    require_once( "../includes/library.php");
    $pdo = connectdb();
    $endpoint = trim($endpoint, "/");


    if ($method === "GET" && count(explode("/", $endpoint)) == 1 && isset($_GET["name"]) && isset($_GET["subject"])) {
        $name = "%" . $_GET["name"] . "%";
        $subject = $_GET["subject"];
        $stmt = $pdo->prepare("SELECT teacherID, name, username, email, image, subject FROM teacher WHERE name LIKE ? AND subject = ?");
        $stmt->execute([$name, $subject]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($result as &$row) {
            if (!empty($row['image'])) {
                $row['image'] = base64_encode($row['image']); // Convert binary data to Base64
            }
        }
        return ([200, ["teachers" => $result]]);
    }

    if ($method === "GET" && count(explode("/", $endpoint)) == 1 && isset($_GET["name"])) {
        $name = "%" . $_GET["name"] . "%";
        $stmt = $pdo->prepare("SELECT teacherID, name, username, email, image, subject FROM teacher WHERE name LIKE ?");
        $stmt->execute([$name]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($result as &$row) {
            if (!empty($row['image'])) {
                $row['image'] = base64_encode($row['image']); // Convert binary data to Base64
            }
        }
        return ([200, ["teachers" => $result]]);
    }


    if (count(explode("/", $endpoint)) == 1 && $method === "GET" && isset($_GET["subject"])) {
        $subject = $_GET["subject"];
        $stmt = $pdo->prepare("SELECT teacherID, name, username, email, image, subject FROM teacher WHERE subject = ?");
        $stmt->execute([$subject]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return ([200, ["teachers of subject" => $result]]);
    }


    if (count(explode("/", $endpoint)) == 1 && $method === "GET") {
        $stmt = $pdo->query("SELECT teacherID, name, username, email, image, subject FROM teacher");
        $allRows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Encode BLOB data as Base64
        foreach ($allRows as &$row) {
            if (!empty($row['image'])) {
                $row['image'] = base64_encode($row['image']); // Convert binary data to Base64
            }
        }
    
        return ([200, ["All teachers" => $allRows]]);
    }

    else if (count(explode("/", $endpoint)) == 2 && $method === "GET") {
        $stmt = $pdo->prepare("SELECT username, email, name, image, subject FROM teacher WHERE teacherID = ?");
        $stmt->execute([explode("/", $endpoint)[1]]);
        $results = $stmt->fetch(PDO::FETCH_ASSOC);
        if (empty($results)) {
            return ([400, ["Error" => "ID does not exist!"]]);
        } 
        if(!empty($results['image'])){
        $results['image'] = base64_encode($results['image']); // Convert binary data to Base64
        }
        return ([200, ["Info of teacher" => $results]]);
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
         $errors["email"]="email not provided";
      }
      if(!isset($_POST["password"]))
      {
         $errors["password"]="password not provided";
      }
      if(!isset($_POST["subject"]))
      {
         $errors["subject"]="subject not provided";
      }
      if(!isset($_POST["name"]))
      {
         $errors["name"]="subject not provided";
      }

      if(!empty($errors))
      {
         return ([400, ["Error"=>$errors]]);
      }

      if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        return ([400, ["Error" => "No file uploaded or there was an error uploading the file."]]);
    }

    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg'];
    if (!in_array($_FILES['image']['type'], $allowedTypes)) {
        return ([400, ["Error" => "Invalid file type. Only JPG, PNG, and GIF are allowed."]]);
    }

    // Read file content
    $imageData = file_get_contents($_FILES['image']['tmp_name']);
      $username=$_POST["username"];
      $email=$_POST["email"];
      $subject=$_POST["subject"];
      $password=$_POST["password"];
      $name=$_POST["name"];
      $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
      function generate_api_key() {
        return bin2hex(random_bytes(16)); // Generate a 64-character API key
    }
    $api_key=generate_api_key();
      if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ([400, ["Error"=> "Invalid email!"]]);
    } 
        $stmt=$pdo->prepare("INSERT INTO teacher (username, email, password, subject, name, api_key, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$username, $email, $hashedPassword, $subject, $name, $api_key, $imageData]);
        return ([200, ["Success"=> "Data inserted"]]);
      
    }

    else if(count(explode("/", $endpoint)) == 3 && $method === "DELETE" && explode("/", $endpoint)[1]=="entries")
   {
      $teacherID=explode("/", $endpoint)[2];
      $stmt=$pdo->prepare("SELECT 1 FROM teacher WHERE teacherID = ?");
      $stmt->execute([$teacherID]);
      $result=$stmt->fetch(PDO::FETCH_ASSOC);
      if(empty($result))
      {
         return ([400, ["The teacher does not exist in toWatchList table"]]);
      }
      $stmt=$pdo->prepare("DELETE FROM teacher WHERE teacherID= ?");
      $stmt->execute([$teacherID]);
      return([200, ["Success"=> "Deleted the teacher successfully"]]);
   }


   if(count(explode("/", $endpoint)) == 2 && $method=="POST" && explode("/", $endpoint)[1] == "session")
    {
        $username=$_POST["username"] ?? "";
        $password=$_POST["password"] ?? "";
        $errors=[];
        if(empty($username))
        {
            $errors["username"]="You must provide a username";
        }
        if(empty($password))
        {
            $errors["password"]="You must provide a password";
        }
        if(!empty($errors))
        {
            return([400, ["Errors"=>$errors]]);
        }
        $stmt = $pdo->prepare("SELECT username, password, api_key FROM teacher WHERE username = :username");
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user) {
            $errors['username'] = "Username does not exist";
        } else {
            if (!password_verify($password, $user['password'])) {
                $errors['password'] = "Password is incorrect";
            }
        }
        if(!empty($errors))
        {
            return([400, ["Error(s)"=>$errors]]);
        }
        return([200, ["Your API Key"=>$user['api_key']]]);
    }


    
    
    else {
        return ([400, ["Endpoint not found!"]]);
    }
}
?>