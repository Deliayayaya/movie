$(function(){
	$('.comment').click(function(e){
		console.log('in')
		var target = $(this);
		//cid为一级评论，tid为二级评论，通过多表查询获取from._id;

		var cid = target.data('cid');
		console.log(cid);
		var tid = target.data('tid');
			console.log(tid);
			if($('#toId').length>0){
				$('#toId').val(tid);
			}else{
				$('<input>').attr({
				type:'hidden',
				id:'toId',
				name:'comment[tid]',
				value:tid
				}).appendTo('#commentForm');
			}
			if($('#commentId').length>0){
				$('#commentId').val(cid);
			}else{
				$('<input>').attr({
				type:'hidden',
				id:'commentId',
				name:'comment[cid]',
				value:cid
				}).appendTo('#commentForm');
			}
	})
})