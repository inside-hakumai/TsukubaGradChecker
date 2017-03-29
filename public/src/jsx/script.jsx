/* global $ */ // avoid ESLint warning

let $ = require(`jquery`);

let window_height;

$(document).ready(function () {
   $(window).resize(resizeTitleArea);
   $('main.mdl-layout__content').scroll(changeHeaderColorIfNeeded);
   resizeTitleArea();
   changeHeaderColorIfNeeded();
   $('div.mdl-select > ul > li').click(function (e) {
      let text = $(e.target).text();
      //noinspection JSUnresolvedFunction
      $(e.target).parents('.mdl-select').addClass('is-dirty').children('input').val(text);
   });
});

$(window).on(`load`, function () {
   $('body').css('display', 'block');
});

function resizeTitleArea(e) {
   window_height = $(window).height();
   $('#title').css('height', window_height + 'px');
}

function changeHeaderColorIfNeeded() {
   let onTitleAreaNow = $('main.mdl-layout__content').scrollTop() < window_height;

   if (changeHeaderColorIfNeeded.onTitleArea === undefined) {
      changeHeaderColorIfNeeded.onTitleArea = !onTitleAreaNow;
   }

   if (onTitleAreaNow && !changeHeaderColorIfNeeded.onTitleArea) {
      $('header.mdl-layout__header.mdl-layout__header--transparent.is-casting-shadow').css('background-color', 'transparent');
      changeHeaderColorIfNeeded.onTitleArea = true;
   } else if (!onTitleAreaNow && changeHeaderColorIfNeeded.onTitleArea) {
      $('header.mdl-layout__header.mdl-layout__header--transparent.is-casting-shadow').css('background-color', 'rgba(0, 0, 0, 0.65)');
      changeHeaderColorIfNeeded.onTitleArea = false;
   }
}
