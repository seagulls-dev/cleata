		//AnimationjQuery
jQuery(document).ready(function() {
	jQuery('.animate1').addClass("hidden").viewportChecker({
	  classToAdd: 'visible animated slideInDown',
	  offset: 100
	});
	jQuery('.animate2').addClass("hidden").viewportChecker({
		classToAdd: 'visible animated slideInLeft',
		offset: 100
	});
	jQuery('.animate3').addClass("hidden").viewportChecker({
		classToAdd: 'visible animated slideInRight',
		offset: 100
	});
	jQuery('.animate4').addClass("hidden").viewportChecker({
		classToAdd: 'visible animated fadeIn',
		offset: 100
	});
	jQuery('.animate5').addClass("hidden").viewportChecker({
		classToAdd: 'visible animated fadeInUp',
		offset: 100
	});
	jQuery('.animate6').addClass("hidden").viewportChecker({
		classToAdd: 'visible animated fadeInDown',
		offset: 100
	});
	jQuery('.animate7').addClass("hidden").viewportChecker({
		classToAdd: 'visible animated fadeInLeft',
		offset: 100
	});
	jQuery('.animate8').addClass("hidden").viewportChecker({
		classToAdd: 'visible animated fadeInRight',
		offset: 100
	});
	jQuery('.animate9').addClass("hidden").viewportChecker({
		classToAdd: 'visible animated fadeInUpBig',
		offset: 100
	});
	jQuery('.animate10').addClass("hidden").viewportChecker({
		classToAdd: 'visible animated fadeInDownBig',
		offset: 100
	});

	$(".search-panel i").click(function () {
	console.log("fsfd");
			$(".search-content").toggleClass('search-panel-open');
		
		});
		
		$(".search-content i").click(function(){
        $(".search-content").removeClass("search-panel-open");
       });
});



		
		
		// $(function() {
  //   $('a[href*="#howitwork"').click(function() {
  //     if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
  //       var target = $(this.hash);
  //       target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
  //       if (target.length) {
  //         $('html, body').animate({
  //           scrollTop: target.offset().top
  //         }, 1000);
  //         return false;
  //       }
  //     }
  //   });
  // });
  
  

$(function() {
    $(window).on("scroll", function() {
        if($(window).scrollTop() > 50) {
            $("header").addClass("active");
        } else {
            //remove the background property so it comes transparent again (defined in your css)
           $("header").removeClass("active");
        }
    });
});


$(document).ready(function(){
	$('#nav-menus').click(function(){
		$(this).toggleClass('open');
	});
});

