$(".svcSelect").click(function()
{
  $(".svcSelect").each(function(){
    $(this).parent('li').removeClass('active');
  })
  $(this).parent("li").addClass('active');
  $(".result").hide();
  var svc = $(this).attr('class').replace("svcSelect ", "");
  $(".result-"+svc).show();
});