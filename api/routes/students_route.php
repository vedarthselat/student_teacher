<?php

function students_func($endpoint, $method)
{
    require_once("../includes/library.php");
    $pdo = connectdb();
    $endpoint = trim($endpoint, "/");
    


    if ($method === "GET" && count(explode("/", $endpoint)) == 1 && isset($_GET["name"])) {
        $name = "%" . $_GET["name"] . "%";
        $stmt = $pdo->prepare("SELECT studentID, name, username, email, image FROM student WHERE name LIKE ?");
        $stmt->execute([$name]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($result as &$row) {
            if (!empty($row['image'])) {
                $row['image'] = base64_encode($row['image']); // Convert binary data to Base64
            }
        }
        return ([200, ["students" => $result]]);
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
        $stmt = $pdo->prepare("SELECT username, password, api_key FROM student WHERE username = :username");
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

    if (count(explode("/", $endpoint)) == 1 && $method === "GET") {
        $stmt = $pdo->query("SELECT studentID, name, username, email, image FROM student");
        $allRows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Encode BLOB data as Base64
        foreach ($allRows as &$row) {
            if (!empty($row['image'])) {
                $row['image'] = base64_encode($row['image']); // Convert binary data to Base64
            }
        }
    
        return ([200, ["All students" => $allRows]]);
    }

    



    else if(count(explode("/", $endpoint)) == 2 && $method=="POST" && explode("/", $endpoint)[1] == "entries")
    {
        $username=$_POST["username"] ?? "";
        $email=$_POST["email"] ?? "";
        $password=$_POST["password"] ?? "";
        $name=$_POST["name"] ?? "";
        $errors=[];
        

        if(empty($username))
        {
            $errors["username"]="You must provide a username";
        }
        if(empty($email))
        {
            $errors["email"]="You must provide an email";
        }
        if(empty($password))
        {
            $errors["password"]="You must provide a password";
        }
        if(empty($name))
        {
            $errors["name"]="You must provide a name";
        }
        if(!empty($errors))
        {
            return([400, ["Errors"=>$errors]]);
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
        function generate_api_key() {
            return bin2hex(random_bytes(16)); // Generate a 64-character API key
        }
        $api_key=generate_api_key();
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO student (username, email, password, api_key, name, image) VALUES (?, ?, ?, ?, ?, ?)");

        $stmt->execute([$username, $email, $hashedPassword, $api_key, $name, $imageData]);
        return([200, ["Success"=>"Data inserted"]]);
       
    }

    else if(count(explode("/", $endpoint)) == 3 && $method === "DELETE" && explode("/", $endpoint)[1]=="entries")
   {
      $studentID=explode("/", $endpoint)[2];
      $stmt=$pdo->prepare("SELECT 1 FROM student WHERE studentID = ?");
      $stmt->execute([$studentID]);
      $result=$stmt->fetch(PDO::FETCH_ASSOC);
      if(empty($result))
      {
         return ([400, ["The studentID does not exist in the student table"]]);
      }
      $stmt=$pdo->prepare("DELETE FROM student WHERE studentID= ?");
      $stmt->execute([$studentID]);
      return([200, ["Success"=> "Deleted the student successfully"]]);
   }
}
?>
