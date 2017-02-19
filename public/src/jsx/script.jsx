/* global $ */ // avoid ESLint warning

$(function() {
   $('div.mdl-select > ul > li').click(function(e) {
      let text = $(e.target).text();
      //noinspection JSUnresolvedFunction
       $(e.target).parents('.mdl-select').addClass('is-dirty').children('input').val(text);
   });
   resizeTitleArea();

   $(window).resize(resizeTitleArea);
});

function resizeTitleArea() {
   let height = $(window).height() - $('header').height();
   $('#title').css('height', height + 'px');
}
