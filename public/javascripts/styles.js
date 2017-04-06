$(document).ready(function(){
  $('.room').click(function(e){
    $('.room').removeClass('selected');
    $(e.target).addClass('selected');
  })
})