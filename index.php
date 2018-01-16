<?php

include 'credentials.php';

header('Access-Control-Allow-Origin: *');

$metadata = json_decode(file_get_contents("data.json"));

function secure(){
	global $credentials;

	if(!isset($_GET['username']) || !isset($_GET['password'])){
		http_response_code(401);
		exit();
	}
	if($_GET['username'] != $credentials['username'] || $_GET['password'] != $credentials['password']){
		http_response_code(401);
		exit();
	}
}

function saveData($data){
	file_put_contents("data.json", json_encode($data));
}
		
function find_exact_match($artist, $title, $metadata){

	foreach($metadata as $struct) {

	    if (strcasecmp($title, $struct -> title) == 0 && strcasecmp($artist, $struct -> artist) == 0){

        	return $struct;
        	break;
	    }
	}
}

switch ($_SERVER['REQUEST_METHOD']) {

	case 'GET':

		if(array_key_exists('artist', $_GET) && array_key_exists('title', $_GET)){

			//Search exact match, inexpensive
			$result = find_exact_match($_GET['artist'], $_GET['title'], $metadata);

			if($result != null)
				$result = array($result);

			if(!$result){
				http_response_code(400);
				return;
			}	

		} else {
			$result = $metadata;
		}

		foreach ($result as $key => $value) {
			if(isset($value -> cover)){
				$result[$key] -> cover = 'pics/' . $value -> cover;
			}
		}

		echo json_encode($result);

		break;

	case 'POST':

		secure();

		$id = uniqid();

		$cover = null;

		$data = json_decode(file_get_contents('php://input'), true);

		if(empty($data['title']) || empty($data['artist']) || empty($data['type'])){
			http_response_code(400);
			$arr = array('message' => 'Please specify at least title artist and type');
			echo json_encode($arr);
			return;
		}

		if(!empty($data['cover'])){
			preg_match('"data:image\/([a-zA-Z]*);base64,([^\"]*)"', $data['cover'], $matches);
			$cover = $id.'.'.$matches[1];
			file_put_contents('pics/'.$cover, base64_decode($matches[2]));
		}

		$data = array(
			"id" => $id,
			"title" => $data["title"],
			"artist" => $data["artist"],
			"type" => $data["type"],
			"cover" => $cover,
			"tracks" => $data["tracks"],
			"year" => $data["year"],
			"comments" => $data["comments"]
		);

		array_push($metadata, $data);

		saveData($metadata);

		break;
	
	case 'DELETE':

		secure();

		if(isset($_GET['id'])){
			foreach ($metadata as $key => $value) {
				if($value -> id  == $_GET['id']){
					array_splice($metadata, $key, 1);
					saveData($metadata);
					http_response_code(200);
					exit();
				}
			}		
		}

		http_response_code(400);

	break;

	default:
		# code...
		break;
}

?>