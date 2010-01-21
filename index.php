<?
session_start();

define('FB_API_KEY', 'b4123a590dcef7749c326a811fd0c310');
define('FB_APP_SECRET', 'e1555729e7bec7ef5ecca69539b599bd');
define('FB_APP_ID', '265223232652');

define('SERVER_BASE_PATH', 'http://fbselect.dev.jimsc.com/');
define('FACEBOOK_BASE_PATH', 'http://apps.facebook.com/jq_friend_select/');

require_once './facebook.php';

function get_fb_friends($uid, $sex = false)
{
	$fql_query = array(
		'user_friends' => "SELECT uid2 FROM friend WHERE uid1 = {$uid}",
		'friend_info' => 'SELECT uid, first_name, last_name, name, pic_small, pic_big, pic_square, pic, sex '
						. ' FROM user WHERE uid IN ( SELECT uid2 FROM #user_friends )'
	);
	
	try
	{
		$query_result = facebook_client()->api_client->fql_multiQuery($fql_query);

	
		$friends = array();
	
		if (!empty($query_result[1]) && !empty($query_result[1]['fql_result_set']))
		{
			foreach ($query_result[1]['fql_result_set'] as $friend)
			{
				if (($sex && $friend['sex'] == $sex) || false == $sex)
				{
					$friends[ $friend['uid'] ] = $friend;
				}
			}
		}
		else
		{
			$friends = false;
		}
	
	}
	catch (Exception $e)
	{
		$friends = false;
	}
	
	return $friends;
}

$fb_uid = facebook_client()->require_login();

if (1 || false == isset($_SESSION['friends']))
{
	$friends = get_fb_friends($fb_uid);
	
	$_SESSION['friends'] = $friends;
	
	$friends_list = array();
	foreach ($friends as $fb_uid => $friend)
	{
		$friends_list[ $fb_uid ] = $friend['name'];
	}
	
	$_SESSION['friends_list'] = $friends_list;
}
else
{
	$friends = $_SESSION['friends'];
	$friends_list = $_SESSION['friends_list'];
}
	
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>Facebook Friend Selector Demo</title>
<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/combo?2.8.0r4/build/reset/reset-min.css"> 
<style type="text/css" media="screen">
body { font-family: 'lucida grande', tahoma, verdana, arial, sans-serif; font-size: 11px; color: #333; }

.inputbutton, .inputsubmit { background-color: #3B5998;  border-color: #D9DFEA #0E1F5B #0E1F5B #D9DFEA; border-style: solid; border-width: 1px; color: #FFF; padding: 2px 15px 3px; text-align: center; }
.inputaux { background: #F0F0F0; border-color: #E7E7E7 #666 #666 #E7E7E7; color: #000; }

p { margin: 1em 0; }

a { color: #3B5998; text-decoration: none; }

.hidden { display: none; }
.validation_error { color: #D14E69; font-weight: bold; }

/* friend selector styles */
.fs_hidden { display: none; }

.fs_wrapper { display: inline; text-align: left !important; }

.fs_friend_container { position: absolute; z-index: 3; left: 0; width: 100%; max-height: 225px; overflow-y: auto; }
.fs_input { border: 1px solid #BDC7D8; padding: 3px; background: #FFF; }

.fs_friend { cursor: pointer; padding: 5px; background: #FFF; border: 1px solid #999; border-top: none; text-align: left !important; }
.fs_selected { background: #3B5998; }
.fs_friend_name { color: #000; }
.fs_selected .fs_friend_name { color: #FFF; }

</style>
</head>
<? if (!empty($_POST['fb_uid'])): ?>
	<p>
		You Chose: <fb:name uid="<?= $_POST['fb_uid']; ?>" linked="false"></fb:name>
	</p>
<? endif; ?>

<div id="choose_friend">	
	<form action="" method="post" id="pick_friend_form">
		<label for="friend_selector">Pick a friend:</label>
		<input type="text" name="friend_selector" id="friend_selector" class="friend_selector">
		<input type="submit" value="Go" class="inputsubmit">
		<input type="hidden" name="new_friend" id="new_friend" value="1">
	</form>
</div>

<script src="/js/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="/js/jquery.FBfriend_selector.js" type="text/javascript" charset="utf-8"></script>
<script src="/js/jquery.arrow_cap.js" type="text/javascript" charset="utf-8"></script>
<script src="http://static.ak.connect.facebook.com/js/api_lib/v0.4/FeatureLoader.js.php/en_US" type="text/javascript"></script>
<script type="text/javascript" charset="utf-8">
window.fb_api_key = "<?= FB_API_KEY; ?>";
window.fb_xd_receiver_url = "/xd_receiver.php";
FB_RequireFeatures(["XFBML", "Connect", "CanvasUtil"], function(){
	FB.Facebook.init(window.fb_api_key, window.fb_xd_receiver_url);
	FB.CanvasClient.startTimerToSizeToContent();
	return true;
});

(function($)
{
	$(document).ready(function()
	{
		$('.friend_selector')
			.friendSelector(<?= json_encode($friends_list); ?>)
	});
	
})(jQuery);
</script>
