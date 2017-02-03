$(function(){
	$('.catedel').click(function(e){
		var target = $(e.target);
		var id = target.data('id'); 
		var tr = $('.item-id-'+id);
		$.ajax({
			type:'DELETE',
			url:'/admin/categorylist?id='+id
		}).done(function(results){
			if(results){
				console.log('success');
				tr.remove();
			}else{
				console.log('err');
			}
		})
	})
})