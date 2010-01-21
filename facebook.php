<?php

require_once 'facebook/facebook.php';

function facebook_client()
{
	static $facebook_api;
	
	if (null == $facebook_api)
	{
		$facebook_api = new Facebook(FB_API_KEY, FB_APP_SECRET);
	}
	
	return $facebook_api;
}

function facebook_redirect($url)
{
	echo '<fb:redirect url="' . $url . '" />';
	exit;
}
