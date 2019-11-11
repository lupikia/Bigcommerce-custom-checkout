/*
 * Treeview 1.4.3 - jQuery plugin to hide and show branches of a tree
 * Author: PSDCenter
*/

;(function($) {

	// TODO rewrite as a widget, removing all the extra plugins
	$.extend($.fn, {
		swapClass: function(c1, c2, settings) {

			var c1Elements = this.filter('.' + c1);
			this.filter('.' + c2).removeClass(c2).addClass(c1);
			if(this.parent().hasClass(CLASSES.expandable)){
				if(!settings.expandedArrow){
					this.html("")
				}else {
					this.html(settings.expandedArrow)
				}
			}

			if(this.parent().hasClass(CLASSES.collapsable)){
				if(!settings.collapsedArrow){
					this.html("")
				}else {
					this.html(settings.collapsedArrow)
				}
			}

			c1Elements.removeClass(c1).addClass(c2);

			return this;
		},
		replaceClass: function(c1, c2) {
			return this.filter('.' + c1).removeClass(c1).addClass(c2).end();
		},
		hoverClass: function(className) {
			className = className || "hover";
			return this.hover(function() {
				$(this).addClass(className);
			}, function() {
				$(this).removeClass(className);
			});
		},
		heightToggle: function(animated, callback) {
			animated ?
				this.animate({ height: "toggle" }, animated, callback) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
					if(callback)
						callback.apply(this, arguments);
				});
		},
		heightHide: function(animated, callback) {
			if (animated) {
				this.animate({ height: "hide" }, animated, callback);
			} else {
				this.hide();
				if (callback)
					this.each(callback);
			}
		},
		prepareBranches: function(settings) {
			if (!settings.prerendered) {
				// mark last tree items
				this.filter(":last-child:not(ul)").addClass(CLASSES.last);
				// collapse whole tree, or only those marked as closed, anyway except those marked as open
				this.filter((settings.collapsed ? "" : "." + CLASSES.closed) + ":not(." + CLASSES.open + ")").find(">ul").hide();
			}
			// return all items with sublists
			return this.filter(":has(>ul)");
		},
		test:function(){
			this.not(":has(>ul:hidden)")
							.addClass(CLASSES.collapsable)
							.replaceClass(CLASSES.last, CLASSES.lastCollapsable);
		},
		applyClasses: function(settings, toggler) {
			// TODO use event delegation
			this.filter(":has(>ul):not(:has(>a))").find(">span").unbind("click.treeview").bind("click.treeview", function(event) {
				// don't handle click events on children, eg. checkboxes
				if ( this == event.target )
					toggler.apply($(this).next());
			}).add( $("a", this) ).hoverClass();

			if (!settings.prerendered) {
				// handle closed ones first
				this.filter(":has(>ul:hidden)")
						.addClass(CLASSES.expandable)
						.replaceClass(CLASSES.last, CLASSES.lastExpandable);

				// handle open ones
				this.not(":has(>ul:hidden)")
							.addClass(CLASSES.collapsable)
							.replaceClass(CLASSES.last, CLASSES.lastCollapsable);
				// var this=this;

	            // create hitarea if not present
				var hitarea = this.find("div." + CLASSES.hitarea);
				if (!hitarea.length)

				hitarea = this.prepend("<div class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea);
				if(settings.collapsedArrow || settings.expandedArrow){
					if(settings.collapsedArrow!="" || settings.expandedArrow!=""){
						 hitarea.html(settings.collapsedArrow);
					}
				}
				hitarea.removeClass().addClass(CLASSES.hitarea).each(function() {
					var classes = "";
					$.each($(this).parent().attr("class").split(" "), function() {
						classes += this + "-hitarea ";
					});
					$(this).addClass( classes );
				})
			}

			// apply event to hitarea
			this.find("div." + CLASSES.hitarea).click( toggler );
		},
		treeview: function(settings) {

			settings = $.extend({
				cookieId: "treeview"
			}, settings);

			if ( settings.toggle ) {
				var callback = settings.toggle;
				settings.toggle = function() {
					return callback.apply($(this).parent()[0], arguments);
				};
			}

			// factory for treecontroller
			function treeController(tree, control) {
				// factory for click handlers
				function handler(filter) {
					return function() {
						// reuse toggle event handler, applying the elements to toggle
						// start searching for all hitareas
						toggler.apply( $("div." + CLASSES.hitarea, tree).filter(function() {
							// for plain toggle, no filter is provided, otherwise we need to check the parent element
							return filter ? $(this).parent("." + filter).length : true;
						}) );
						return false;
					};
				}
				// click on first element to collapse tree
				$("a:eq(0)", control).click( handler(CLASSES.collapsable) );
				// click on second to expand tree
				$("a:eq(1)", control).click( handler(CLASSES.expandable) );
				// click on third to toggle tree
				$("a:eq(2)", control).click( handler() );
			}

			// handle toggle event
			function toggler() {
				$(this)
					.parent()
					// swap classes for hitarea
					.find(">.hitarea")
						.swapClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea, settings )
						.swapClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea, settings )
					.end()
					// swap classes for parent li
					.swapClass( CLASSES.collapsable, CLASSES.expandable, settings )
					.swapClass( CLASSES.lastCollapsable, CLASSES.lastExpandable, settings )
					// find child lists
					.find( ">ul" )
					// toggle them
					.heightToggle( settings.animated, settings.toggle );
				if ( settings.unique ) {
					$(this).parent()
						.siblings()
						// swap classes for hitarea
						.find(">.hitarea")
							.replaceClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea )
							.replaceClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea )
						.end()
						.replaceClass( CLASSES.collapsable, CLASSES.expandable )
						.replaceClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
						.find( ">ul" )
						.heightHide( settings.animated, settings.toggle );
				}
			}
			this.data("toggler", toggler);

			function serialize() {
				function binary(arg) {
					return arg ? 1 : 0;
				}
				var data = [];
				branches.each(function(i, e) {
					data[i] = $(e).is(":has(>ul:visible)") ? 1 : 0;
				});
				$.cookie(settings.cookieId, data.join(""), settings.cookieOptions );
			}

			function deserialize() {
				var stored = $.cookie(settings.cookieId);
				if ( stored ) {
					var data = stored.split("");
					branches.each(function(i, e) {
						$(e).find(">ul")[ parseInt(data[i]) ? "show" : "hide" ]();
					});
				}
			}

			// add treeview class to activate styles
			this.addClass("treeview");

			// prepare branches and find all tree items with child lists
			var branches = this.find("li").prepareBranches(settings);

			switch(settings.persist) {
			case "cookie":
				var toggleCallback = settings.toggle;
				settings.toggle = function() {
					serialize();
					if (toggleCallback) {
						toggleCallback.apply(this, arguments);
					}
				};
				deserialize();
				break;
			case "location":
				var current = this.find("a").filter(function() {
					return location.href.toLowerCase().indexOf(this.href.toLowerCase()) == 0;
				});
				if ( current.length ) {
					// TODO update the open/closed classes
					// alert('r')
					var items = current.addClass("selected").parents("ul, li").add( current.next() ).show();
					// alert(settings.prerendereda)
					if (!settings.prerendered) {
						// if prerendered is on, replicate the basic class swapping
						setTimeout(function(){
						items.filter("li")
							.swapClass( CLASSES.collapsable, CLASSES.expandable, settings )
							.swapClass( CLASSES.lastCollapsable, CLASSES.lastExpandable, settings )
							.find(">.hitarea")
								.swapClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea, settings )
								.swapClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea, settings );
						},1000);
					}
				}
				break;
			}

			branches.applyClasses(settings, toggler);
				setTimeout(function(){
					branches.test();
				},1000);
			// if control option is set, create the treecontroller and show it
			if ( settings.control ) {
				treeController(this, settings.control);
				$(settings.control).show();
			}

			return this;
		}
	});

	// classes used by the plugin
	// need to be styled via external stylesheet, see first example
	$.treeview = {};
	var CLASSES = ($.treeview.classes = {
		open: "open",
		closed: "closed",
		expandable: "expandable",
		expandableHitarea: "expandable-hitarea",
		lastExpandableHitarea: "lastExpandable-hitarea",
		collapsable: "collapsable",
		collapsableHitarea: "collapsable-hitarea",
		lastCollapsableHitarea: "lastCollapsable-hitarea",
		lastCollapsable: "lastCollapsable",
		lastExpandable: "lastExpandable",
		last: "last",
		hitarea: "hitarea"
	});

})(jQuery);
