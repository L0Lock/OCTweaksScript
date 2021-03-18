// ==UserScript==
// @name			OC Tweak Script
// @author			-L0Lock-, benzouye, Lamecarlate, Lucatorze
// @namespace   		https://github.com/L0Lock/OCTweaksScript
// @description 		Améliore l'affichage des forums OpenClassrooms
// @updateURL   		https://raw.githubusercontent.com/L0Lock/OCTweaksScript/master/octs.js
// @downloadURL 		https://raw.githubusercontent.com/L0Lock/OCTweaksScript/master/octs.js
// @include			*openclassrooms.com/*
// @version			1.2.29
// @noframes
// @grant			GM_getValue
// @grant			GM_setValue
// @require			https://code.jquery.com/jquery-3.3.1.min.js
// @require			https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// ==/UserScript==

(function($, document, undefined) {
	'use strict';
	const gitUrl = "https://raw.githubusercontent.com/L0Lock/OCTweaksScript/master/";
	const baseUrl = "https://openclassrooms.com/";
	const forumUrl = baseUrl+"forum/";
	const catUrl = forumUrl+"categorie/";

	// Ajout lien sections sur liste forum
	if( window.location.href === forumUrl ) {
		var sections = {
			'Site Web': 'site-web',
			'Entreprise': 'entreprise',
			'Programmation': 'programmation',
			'Systèmes d\'exploitation': 'systemes-d-exploitation',
			'Design': 'design',
			'Matériel & logiciels': 'materiel-logiciels',
			'Jeux vidéo': 'jeux-video',
			'Sciences': 'sciences',
			'Communauté des Zéros': 'communaute-des-zeros'
		};
		$('h2').each( function(i) {
			$(this).html( '<a title="Accès au sommaire de la catégorie '+$(this).text()+'" href="'+catUrl+sections[$(this).text()]+'">'+$(this).text()+'</a>' );
		});
	}

  	// Réparation ancre vers message cassée
  	if( window.location.href.indexOf("#") > 0 && window.location.href.indexOf("#message-") == -1 ) {
 		 window.location.href = window.location.href.replace( "#", "#message-" );
   	}

	// Copie du fil d'ariane en bas du sujet
	$(".breadcrumb").clone().insertAfter($("section.comments"));
	
	// Déplacement "Ce sujet est fermé" au titre du sujet
	$("section.comments").before($("div.banner"))

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
    let classActiveBouton = "";
	if( window.location.pathname.indexOf('/forum/') !== -1 ) {
		classActiveBouton = "oc-mainHeader__navLinkActive";
	};
	var observer = new MutationObserver( function(mutations) {
		mutations.forEach(function(mutation) {
			if( mutation.addedNodes && mutation.addedNodes.length > 0 ) {
				if( mutation.addedNodes[0].classList && mutation.addedNodes[0].classList.contains("MuiPaper-root") ) {
                  			observer.disconnect();
                			let lienForum = $("#main-menu-navigation>div>last-child").clone();
			    		lienForum.find("span>a>span").text("Forum");
			    		lienForum.find("span>a").attr("href", "/forum");
			    		$("#main-menu-navigation>div").append( $("#main-menu-navigation>div>div:nth-child(5)").clone() );
					$("#main-menu-navigation>div").append( lienForum );
				}
			}
		});
	});
	observer.observe( document.body, { childList: true, subtree: true } );

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

    // Balise kbd
    $("kbd").css({
        "background-color":"#eee",
        "border-radius": "3px",
        "border": "1px solid #b4b4b4",
        "box-shadow": "0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset",
        "color": "#333",
        "display": "inline-block",
        "font-size": ".85em",
        "font-weight": 700,
        "line-height": 1,
        "padding": "2px 4px",
        "white-space": "nowrap"
   });
   
   // Balise html (pour faire un scroll plus lisse lors du retour en haut/bas de la page)
   $("html").css({
       "scroll-behavior":"smooth"
   });

	// Suppression des pubs
	$(".adviceBanner").remove();
})(window.jQuery, document);
