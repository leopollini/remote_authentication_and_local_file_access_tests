<?php

    // error_reporting(E_ALL);
    // ini_set('display_errors', 1);

    const ACCESS_KEYS_PATH = "access_keys.json";
    const HASHED_KEYS_PATH = "hashed_keys.json";
    const RANDOM_STRING_LEN = 10;
    const EXPIRATION_KEY_TIME = 10;  // in secs

    $client_id = $_GET["terminal_id"];
    if (!isset($client_id)) die("No id provided");

    $terminal_name = "terminal_".$client_id;
    
    $file_content = file_get_contents(filename: ACCESS_KEYS_PATH) or die("Could not open/read keys file");
    $content = json_decode($file_content) or die("Could not parse keys file");

    if (!isset($content->$terminal_name)) die ("Terminal not registered");

    $key = $content->$terminal_name->key;

    // var_dump($key);

    $random_string = "_".bin2hex(random_bytes(RANDOM_STRING_LEN / 2));

    // $key_random_hashed = $key.$random_string;
    $key_random_hashed = hash("sha256", $key.$random_string);

    if ($keys_checker = file_get_contents(filename: HASHED_KEYS_PATH))
        $checker_content = json_decode($keys_checker);
    else
        $checker_content = (object)[];

    // echo "<br><br>";

    $checker_content->$terminal_name = (object)["extra_code" => $random_string, "expected_hash" => $key_random_hashed, "expires" => time() + EXPIRATION_KEY_TIME];

    $hashed_keys_file = fopen(HASHED_KEYS_PATH, 'w');
    fwrite($hashed_keys_file, json_encode($checker_content));
    fclose($hashed_keys_file);
    
    // var_dump($checker_content);

    echo '{"key_extra": "'.$random_string.'"}';
    
    die();
?>

<!-- Terminal access key generator. -->
<!--    When a terminal tries to connect, this script sends ONLY a passkey which must be 
        - appended to the actual key,
        - hashed client-side along with the terminal's key,
        - returned in the query string while requesting for thepage.php
-->