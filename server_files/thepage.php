<!-- sample hidden page -->

<?php
    const HASHED_KEYS_PATH = "hashed_keys.json";

    // var_dump($_GET);
    $client_id = $_GET["terminal_id"];
    $client_key = $_GET["key"];

    if (!isset($client_id)) die("No id provided.");
    if (!isset($client_key)) die ("No key provided");

    $file_content = file_get_contents(filename: HASHED_KEYS_PATH) or die("Could not open/read hashed keys file");
    $content = json_decode($file_content) or die("Could not parse hash keys file");

    $terminal_name = "terminal_".$client_id;
    $expected_key = $content->$terminal_name->expected_hash;
    $expiration = $content->$terminal_name->expires;

    // var_dump($_GET);
    // echo "clis key: $client_key    ";
    // echo "<br><br><br>";
    // echo "exp key: $expected_key";
    // var_dump($content);

    if (!isset($expected_key)) die ("User did not have a registered key: no hash registered");
    if ($expiration < time()) die ("Key has expired!");
    if ($expected_key != $client_key) die ("Bad key!");

        // WIP
//     function clear_keys($hash_keys_list, $filename)
//     {
//         $newkeys = array_filter($hash_keys_list, function ($v) {$v->expiration >= time();});

//         $hashed_keys_file = fopen(HASHED_KEYS_PATH, 'w');
//         fwrite($hashed_keys_file, json_encode($newkeys));
//         fclose($hashed_keys_file);
//     }

//     clear_keys($content, HASHED_KEYS_PATH);
?>

<!DOCTYPE html>

<html>
    <head>
        <title>PHP Testen</title>
    </head>
    <body>
        Here lie secrets beyond interns' comprehension.
    </body>
</html>
