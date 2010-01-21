(function($)
{
	var handlers = {};

	var keyLEFT = 37,
		keyRIGHT = 39,
		keyUP = 40,
		keyDOWN = 38;
		
	$.fn.extend({
		arrowCapture: function(options)
		{
			return this.each(function()
			{
				var obj = this

				handlers[obj] = new arrowHandler(obj, options)
			});
		},
		
		arrowCaptureStop: function(event_arrows)
		{
			return this.each(function()
			{
				var obj = this
				
				handlers[ obj ].cancelEvents(event_arrows)
			})
		}
	});
	
	function arrowHandler(object, options)
	{
		this.options = options;
		
		$(object).keyup(function(e)
		{
			switch (e.keyCode)
			{
				case keyLEFT:
					if (typeof(options.left) != 'undefined')
					{
						return options.left(e, object);
					}
				break;
				
				case keyRIGHT:
					if (typeof(options.right) != 'undefined')
					{
						return options.right(e, object);
					}
				break;
				
				case keyUP:
					if (typeof(options.up) != 'undefined')
					{
						return options.up(e, object);
					}
				break;
				
				case keyDOWN:
					if (typeof(options.down) != 'undefined')
					{
						return options.down(e, object);
					}
				break;
			}			
		});
		
		this.cancelEvents = function(events_list)
		{
			if (false == events_list || events_list.length == 0)
			{
				events_list = ['up', 'down', 'left', 'right'];
			}
			
			$.each(events_list, function(k, ev)
			{
				switch (ev.toLowerCase())
				{
					case 'left':
						this.options.left = function() { return false; }
					break;
					
					case 'right':
						this.options.right = function() { return false; }
					break;
					
					case 'down':
						this.options.down = function() { return false; }
					break;
					
					case 'up':
						this.options.down = function() { return false; }
					break;
				}
			})
			
			return true;
		}
	}
	
})(jQuery);