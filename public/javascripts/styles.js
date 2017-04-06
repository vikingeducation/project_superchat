$(document).ready(function(){
  $('.room').click(function(e){
    $('.room').removeClass('selected');
    $(e.target).addClass('selected');
  })

  $('#create-new-channel').click(function(){
    $('.new-channel-form').toggleClass('hidden');
  })
})