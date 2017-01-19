/* global $ */ // avoid ESLint warning

$(function() {
   $('div.mdl-select > ul > li').click(function(e) {
      var text = $(e.target).text();
      $(e.target).parents('.mdl-select').addClass('is-dirty').children('input').val(text);
   });
});