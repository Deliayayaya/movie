//删除功能
//拿到删除按钮
$(function(){
	$('.del').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);
		$.ajax({
			type:'DELETE',
			url:'/admin/movie/list?id='+id
		}).done(function(results){
			if(results.success ===1){
				if(tr.length>0){
					tr.remove();
				}
			}
		})
	})
	$('#douban').blur(function(){
		var douban = $(this);
		var id = douban.val();

		if(id){
			$.ajax({
				url:'https://api.douban.com/v2/movie/subject/'+id,//id=1764796
				type:'get',
				cache:true,
				dataType:'jsonp',
				crossDomain:true,//跨域访问
				jsonp:'callback',
				success:function(data){
					alert(data);
					$('#inputTitle').val(data.title)
					$('#inputDoctor').val(data.directors[0].name)
					$('#inputCountry').val(data.countries[0])
					//$('#inputLanguage').val()
					$('#inputPoster').val(data.images.large)
					$('#inputFlash').val(data.images.small)
					$('#inputYear').val(data.year)
					$('#inputSummary').val(data.summary)
				}
			})	
		}
		
	})
})