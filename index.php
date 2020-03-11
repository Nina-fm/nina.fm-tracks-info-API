<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

include 'credentials.php';

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

function requireData($data){
	if(empty($data['title']) || empty($data['artist']) || empty($data['type'])){
		http_response_code(400);
		$arr = array('message' => 'Please specify at least title artist and type');
		echo json_encode($arr);
		exit();
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
				// Return empty content
				echo json_encode([]);

				// Return "No Content" error code
				http_response_code(204);
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

		$data = json_decode(file_get_contents('php://input'), true);

		requireData($data);

		$cover = null;

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
			"tags" => $data["tags"],
			"comments" => $data["comments"]
		);

		array_push($metadata, $data);

		saveData($metadata);

		break;

	case 'PUT':
		secure();

		$data = json_decode(file_get_contents('php://input'), true);

		requireData($data);

		$id;

		if(isset($data['id'])){
			foreach ($metadata as $key => $value) {
				if($value -> id  == $data['id']){
					$id = $value -> id;
					$index = $key;
				}
			}		
		}

		if($id === null){
			http_response_code(404);
			$arr = array('message' => 'Cannot find data with this id');
			echo json_encode($arr);
			return;
		}

		if(empty($data['title']) || empty($data['artist']) || empty($data['type'])){
			http_response_code(400);
			$arr = array('message' => 'Please specify at least title artist and type');
			echo json_encode($arr);
			return;
		}

		$cover;
		//Cover
		if(!empty($data['cover'])){
			preg_match('"data:image\/([a-zA-Z]*);base64,([^\"]*)"', $data['cover'], $matches);
			if(!empty($matches)){
				//We got a file

				//Delete old picture
				unlink('pics/'.$metadata[$index] -> cover);

				//Save new one
				$cover = $id.'.'.$matches[1];
				file_put_contents('pics/'.$cover, base64_decode($matches[2]));

			} else {
				$cover = $metadata[$index] -> cover;
			}
		} else {
			//Delete old picture
			unlink('pics/'.$metadata[$index] -> cover);

			$cover = null;
		}

		echo $cover;

		$data = array(
			"id" => $id,
			"title" => $data["title"],
			"artist" => $data["artist"],
			"type" => $data["type"],
			"cover" => $cover,
			"tracks" => $data["tracks"],
			"year" => $data["year"],
			"tags" => $data["tags"],
			"comments" => $data["comments"],
			"text_tracks" => $metadata[$index] -> text_tracks
		);

		$metadata[$index] = $data;

		saveData($metadata);
	break;
	
	case 'DELETE':

		secure();

		if(isset($_GET['id'])){
			foreach ($metadata as $key => $value) {
				if($value -> id  == $_GET['id']){
					unlink('pics/'.$metadata[$key] -> cover);
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