(function($)
{
	$.fn.extend({
		friendSelector: function(friends, options)
		{
			return this.each(function()
			{
				var obj = $(this)

				new FriendSelector(obj, friends, options)
			});
		}
	});
	
	function FriendSelector(obj, friends, options)
	{
		var currently_selected = null;
		
		$inputObject = $(obj);
		
		$inputWrapper = $('<div class="fs_wrapper"></div>')
		$inputWrapper.css({
			'position': 'relative'
		});
		
		$inputObject.before( $inputWrapper );
		$inputObject.remove()
		$inputWrapper.append( $inputObject );
		
		$uidInput = $('<input type="hidden" name="fb_uid" value="" id="fb_uid">');
		$inputWrapper.append($uidInput);
		
		friendsHash = friends;
		$friendContainer = $('<div class="fs_friend_container fs_hidden"></div>')
		
		//initialize friend input stuff		
		$inputObject.addClass('fs_input').addClass('fs_inactive').attr({'size': 25, 'maxlength': 100, 'autocomplete': 'off'}).val("Start typing a friend's name")
		.focus(function()
		{
			$(this).removeClass('fs_inactive').addClass('fs_active')

			if ($(this).val() == "Start typing a friend's name")
			{
				$(this).val('');
			}
			
			$friendContainer.removeClass('fs_hidden')
		})
		.blur(function()
		{
			$(this).removeClass('fs_active').addClass('fs_inactive')

			if ($(this).val().replace(/\s*/g,'').length == 0)
			{
				$(this).val("Start typing a friend's name")
			}
			
			if (currently_selected)
			{
				chooseFriend(currently_selected)
			}
			
			$friendContainer.addClass('fs_hidden')
			
			$('.fs_friend', $friendContainer).addClass('fs_hidden');
		})
		.keyup(function(event)
		{			
			clearChosenFriend();
			
			var current_value = $(this).val();
			var val_regexp = new RegExp('(^|\\\s)' + current_value, "gi");
			
			if (event.keyCode == 13)
			{
				$(this).blur()
				
				return true;
			}
			else if (event.keyCode == 27)
			{
				$(this).val('').blur()
								
				clearChosenFriend();
								
				return true;
			}
			
			var $test_objects = $('.fs_friend:visible', $friendContainer)
			
			if ($test_objects.length == 0 || current_value.length < 2 || (event.keyCode == 8 || event.keyCode == 46))
			{
				$test_objects = $('.fs_friend', $friendContainer);
			}
			
			$test_objects.each(function(key, element)
			{
				$name = $(element).find('.fs_friend_name');
				
				match_array = $name.text().match(val_regexp);
				if (match_array)
				{
					$(element).removeClass('fs_hidden')
				}
				else
				{
					$(element).addClass('fs_hidden')
				}
			})
			
			selectFriend( $('.fs_friend:visible')[0] );
		})
		.arrowCapture({
			'up': function(event, obj)
			{
				console.log('pressed up');
				
				event.preventDefault();
				
				return false;
			},
			
			'down': function(event, obj)
			{
				console.log('pressed down');
				
				event.preventDefault();
				return false;
			}
		});
		
		$.each(friendsHash, function(key, value)
		{
			var $friend = $('<div class="fs_friend fs_hidden">'
					+ '<span class="fs_friend_name">' + value + '</span>'
					+ '<input type="hidden" class="fs_friend_id" value="' + key + '">');
			
			$friend.mousedown(function()
			{
				chooseFriend(this)
			})
			.mouseover(function()
			{
				selectFriend(this);
			});
			
			$friendContainer.append($friend)
		})
		
		$inputWrapper.append( $friendContainer );
		
		function chooseFriend(friend_element)
		{
			if (friend_element == null)
			{
				return true;
			}
			
			var name = $('.fs_friend_name', friend_element).text()
			var id = $('.fs_friend_id', friend_element).val()
				
			$uidInput.val( id );
			$inputObject.val( name );
		}
		
		function clearChosenFriend()
		{
			$uidInput.val(0);
		}
		
		function selectFriend( friend_element )
		{
			$(friend_element)
				.addClass('fs_selected')
				.siblings()
					.removeClass('fs_selected');
					
			currently_selected = friend_element
		}
	}

})(jQuery);