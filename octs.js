// ==UserScript==
// @name			OC Tweak Script
// @author			-L0Lock-, benzouye, Lamecarlate
// @namespace   		https://github.com/L0Lock/OCTweaksScript
// @description 		Améliore l'affichage des forums OpenClassrooms
// @updateURL   		https://raw.githubusercontent.com/L0Lock/OCTweaksScript/master/octs.js
// @downloadURL 		https://raw.githubusercontent.com/L0Lock/OCTweaksScript/master/octs.js
// @include			*openclassrooms.com/*
// @version			1.2.17
// @noframes
// @grant			GM_getValue
// @grant			GM_setValue
// @require			https://code.jquery.com/jquery-3.3.1.min.js
// @require			https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// ==/UserScript==

(function($, document, undefined) {
	'use strict';
	const gitUrl = "https://raw.githubusercontent.com/L0Lock/OCTweaksScript/master/";
	
  	// Réparation lien ancre cassé
  	if( window.location.href.indexOf("#") > 0 ) {
 	     window.location.href = window.location.href.replace( "#", "#message-" );
   	}

	// Copie du fil d'ariane en bas du sujet
	$(".breadcrumb").clone().insertAfter($("section.comments"));

	// Forcer affichage lien modération
	$(".actions").show();
	$(".comments").mouseout( function(e) {
		$(".actions").show();
	});

	// Retrait vieux CSS pour nouveau
	$(".btn.btn-primary").addClass("button--primary");
	$(".btn.btn-primary").removeClass("btn btn-primary");
	$(".btn").addClass("button--secondary");
	$(".btn").removeClass("btn");

	// Ajout bouton forum entête
	$(".mainTopNav").prepend('<li class="mainTopNav__itemContainer button--forum"><a class="mainTopNav__item" href="/forum">Forum</a></li>');
	if( window.location.pathname.indexOf('/forum/') !== -1 ) {
		$(".button--forum").css({"border-bottom":"3px solid #7451eb"});
		$(".button--forum>a").css({"color":"#7451eb"});
	};

	// Bouton afficher/masquer les épinglés
	if( GM_getValue( "showPostIt" ) === undefined ) GM_setValue( "showPostIt" , true );

	// Lien règles forum
	$(".nav-tabs--searchField").css( {"width": "40%"} );
	$("#secondMenu li:eq(0)").before('<li><a href="https://openclassrooms.com/forum/sujet/regles-et-bonnes-pratiques-du-forum-9">Règles du forum</a></li>');

	if( window.location.href.indexOf( "forum" ) > 0 && window.location.href.indexOf( "sujet" ) <= 0 ) {
		$("h1").eq(1).prepend( '<img id="oc-mod-showhide" class="oc-mod-tooltip" />&nbsp;' );
		$("#oc-mod-showhide").css({
			"z-index":"3000",
			"cursor":"pointer",
			"height":"20px"
		});
		toggleTopics( {data : {stable: true}} );

		function toggleTopics( event ) {
			if( !event.data.stable ) {
				GM_setValue( "showPostIt", !GM_getValue( "showPostIt" ) );
			}

			var action = GM_getValue( "showPostIt" ) ? 'show' : 'hide';
			var texte = GM_getValue( "showPostIt" ) ? 'Masquer' : 'Afficher';
			var classe = GM_getValue( "showPostIt" ) ? 'block' : 'none';

			$(".list").first().css({"display":classe});
			$("#oc-mod-showhide").attr( "src", gitUrl+action+'.png' );
			$("#oc-mod-showhide").attr( "title", texte+" les sujets épinglés" );
		};

		$("#oc-mod-showhide").click( {"stable":false}, toggleTopics );
	}

	// Bouton top
	$("#mainContentWithHeader").append('<span title="Haut de la page" class="oc-mod-tooltip oc-mod-nav button--primary" id="oc-mod-top"><i class="icon-next"></i></span>');
	if( $(window).scrollTop() < 100 ) {
		$("#oc-mod-top").hide();
	}
	$("#oc-mod-top").click( () => {
		$(window).scrollTop( 0 );
	});

	// Bouton bottom
	$("#mainContentWithHeader").append('<span title="Bas de la page" class="oc-mod-tooltip oc-mod-nav button--primary" id="oc-mod-bottom"><i class="icon-next"></i></span>');
	if( $(window).height()+$(window).scrollTop() > $(document).height()-250 ) {
		$("#oc-mod-bottom").hide();
	}
	$("#oc-mod-bottom").click( () => {
		$(window).scrollTop( $(document).height()-200 );
	});

	// Style bouton top/bottom
	$(".icon-next").css({"display":"inline-block"});
	$(".oc-mod-nav").css({
		"cursor":"pointer",
		"position":"fixed",
		"right":"50px"
	});
	$("#oc-mod-top").css({
		"top":"38%"
	});
	$("#oc-mod-top>i").css({"transform":"rotate(-90deg)"});
	$("#oc-mod-bottom").css({
		"bottom":"38%"
	});
	$("#oc-mod-bottom>i").css({"transform":"rotate(90deg)"});

	// Gestion du scroll
	$(window).scroll( () => {
		if( $(window).scrollTop() > 100 ) {
			$("#oc-mod-top").show();
		} else {
			$("#oc-mod-top").hide();
		}
		if( $(window).height()+$(window).scrollTop() < $(document).height()-250 ) {
			$("#oc-mod-bottom").show();
		} else {
			$("#oc-mod-bottom").hide();
		}
	});

	// Gestion des infobulles
	$(".oc-mod-tooltip").tooltip( {
		open: function( event, ui ) {
			$(".ui-widget-shadow").css({"background":"#fff"});
			$(".ui-widget-shadow").fadeTo(0,1);
		}
	});

	// Suppression des pubs
	$(".adviceBanner").remove();
})(window.jQuery, document);
