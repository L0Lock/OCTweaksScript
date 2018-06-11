// ==UserScript==
// @name			OC Tweak Script
// @author			-L0Lock-, benzouye, Lamecarlate
// @namespace   		https://github.com/L0Lock/OCTweaksScript
// @description 		Améliore l'affichage des forums OpenClassrooms
// @updateURL   		https://raw.githubusercontent.com/L0Lock/OCTweaksScript/master/octs.js
// @downloadURL 		https://raw.githubusercontent.com/L0Lock/OCTweaksScript/master/octs.js
// @include			*openclassrooms.com/forum/*
// @include			*openclassrooms.com/mp/*
// @include			*openclassrooms.com/interventions/*
// @include			*openclassrooms.com/sujets/*
// @version			1.0.3
// @noframes
// @grant			GM_getValue
// @grant			GM_setValue
// @require			https://code.jquery.com/jquery-3.3.1.min.js
// @require			https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// ==/UserScript==

(function($, document, undefined) {
    'use strict';

    // Correction CSS barre de recherche
    $(".button--iconOnly").css({"padding":"0px","min-height":"28px","height":"28px"});
    $(".inputGroup__icon.icon-search").css({"margin-top":"6px"});

    // Copie du fil d'ariane en bas du sujet
    $(".breadcrumb").clone().insertAfter($("section.comments"));

    // Bouton afficher/masquer les épinglés
    if( GM_getValue( "showPostIt" ) === undefined ) GM_setValue( "showPostIt" , false );
    if( window.location.href.indexOf( "forum" ) > 0 && window.location.href.indexOf( "sujet" ) <= 0 ) {
        let messagesLists = document.querySelectorAll(".list");
        messagesLists.forEach(function (list) {
            if (list.querySelectorAll(".postit").length > 0) {
                let button = document.createElement("button");
                button.classList.add("btn", "btn-primary");
                button.style.marginBottom = "20px";
                button.addEventListener("click", function () {
                    toggleList(list, button);
                });
                list.parentNode.insertBefore(button, list);
                toggleList(list, button, "hide");
            }
        });

        function toggleList(list, button, forcedState) {
            let buttonText;
            if (forcedState === "hide" || !GM_getValue( "showPostIt" )) {
                list.classList.add("hidden");
                buttonText = "Afficher les sujets épinglés";
                GM_setValue( "showPostIt" , true );
            } else {
                 list.classList.remove("hidden");
                buttonText = "Cacher les sujets épinglés";
                GM_setValue( "showPostIt" , false );
            }
            button.innerHTML = buttonText;
        }
    }

    // Bouton top
    $("#mainContentWithHeader").append('<span title="Haut de la page" class="oc-mod-tooltip oc-mod-nav" id="oc-mod-top"><i class="icon-next"></i></span>');
    if( $(window).scrollTop() < 100 ) {
        $("#oc-mod-top").hide();
    }
    $("#oc-mod-top").click( () => {
        $(window).scrollTop( 0 );
    });

    // Bouton bottom
    $("#mainContentWithHeader").append('<span title="Bas de la page" class="oc-mod-tooltip oc-mod-nav" id="oc-mod-bottom"><i class="icon-next"></i></span>');
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
        "right":"50px",
        "background":"#4f8a03",
        "border-radius":"5px",
        "color":"#fff"
    });
    $("#oc-mod-top").css({
        "padding":"11px 15px 15px 15px",
        "top":"38%"
    });
    $("#oc-mod-top>i").css({"transform":"rotate(-90deg)"});
    $("#oc-mod-bottom").css({
        "padding":"17px 15px 9px 15px",
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

    // Suppression des pubs
    $(".adviceBanner").remove();

    // Gestion des infobulles
    $(".oc-mod-tooltip").tooltip( {
        open: function( event, ui ) {
            $(".ui-widget-shadow").css({"background":"#fff"});
            $(".ui-widget-shadow").fadeTo(0,1);
        }
    });
})(window.jQuery, document);
