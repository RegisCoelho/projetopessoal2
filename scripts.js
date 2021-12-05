var paginaAtual = 1;
function doRequests(url){
	var toReturn = {};
	
	$.ajax({
	  url: "https://api.github.com/"+url,
	  async: false,
	  dataType: 'json',
	  success: function (json) {
		toReturn = json;
	  }
	});
	return toReturn;
}

function setRepositorios(repositorios, usuario){
	repo = $("#repositorios-wrapper");
	
	html = "<div class=\"col d-flex align-items-start\">\
			  <div class=\"icon-clircle bg-light text-dark flex-shrink-0 me-3\">\
				<i class=\"fas fa-folder-open fa-2x\"></i>\
			  </div>\
			  <div>\
				<h2>Reginaldo</h2>\
				<p>Acesso a todos os projetos realizados pelo aluno Reginaldo.</p>\
				<a href=\"https://github.com/"+usuario+"?tab=repositories\" class=\"btn btn-secondary\">\
				  Ir para repositório\
				</a>\
			  </div>\
			</div>"
	
	for(i = 0; i < repositorios.length; i++){
		
		html += "<div class=\"col d-flex align-items-start\">\
			  <div class=\"icon-clircle bg-light text-dark flex-shrink-0 me-3\">\
				<i class=\"fas fa-folder-open fa-2x\"></i>\
			  </div>\
			  <div>\
				<h2>"+repositorios[i].name+"</h2>\
				<p>"+(repositorios[i].description == null ? "Nenhuma descrição disponível" : repositorios[i].description )+"</p>\
				<a href=\""+repositorios[i].html_url+"\" class=\"btn btn-secondary\">\
				  Ir para repositório\
				</a>\
			  </div>\
			</div>"
		
	}
	
	repo.html(html);
}

function loadInfo(){
	$("#anterior").click(function(){
		if(paginaAtual > 1){
			console.log(paginaAtual);
			paginaAtual = paginaAtual - 1;
			search(paginaAtual);
		}
	});

	$("#proximo").click(function(){
		console.log(paginaAtual);
		paginaAtual = paginaAtual + 1;
		search(paginaAtual);
	});

	var usuario = "RegisCoelho"

	var userInfo = doRequests("users/"+usuario);
	
	//coloca imagem do git em profile pic 
	document.getElementById("profilePic").src = userInfo.avatar_url;
	
	
	setRepositorios(doRequests("users/"+usuario+"/repos"), usuario)
	
}

function search(page){
	$("#paginaAtual").html(paginaAtual);
	var searching = doRequests("search/repositories?q="+$("#search_input")[0].value+"&page="+page+"&per_page=10");
	
	var items_line = "<ul style=\"padding: 0;\">"
	
	for(i = 0; i < 10; i++){
		item = searching.items[i];
		
		items_line += "<li class=\"search-li\">\
							<a class=\"remove-anchor-decoration\" href=\""+item.html_url+"\">\
								<div class=\"padding-top-bottom-5px title-decoration\"><b>"+item.full_name+"</b></div>\
								<div class=\"padding-top-bottom-5px\"><b>Descrição: </b>"+item.description+"</div>\
								<div >\
									<div class=\"padding-top-bottom-5px\"><b>Tópicos: </b>"+format_topics(item.topics)+"</div>\
									<div class=\"padding-top-bottom-5px\" style=\"display: flex;\">\
										<div class=\"margin-search-10\">&#9733;: "+item.stargazers_count+"</div><div class=\"margin-search-10\">|</div>\
										<div class=\"margin-search-10\"><b>Linguagem: </b>"+item.language+"</div><div class=\"margin-search-10\">|</div>\
										<div class=\"margin-search-10\"><b>Atualizado em: </b>"+format_updateAt(item.updated_at)+"</div>\
									</div>\
								</div>\
							</a>\
						</li>"
				
	}
	items_line += "</ul>"
	
	$("#modal_result").html(items_line);
}

function format_topics(topicos){
	return topicos.toString().replaceAll(",", ", ")
}

function format_updateAt(data){
	return data.toString().replace("T"," às ").replace("Z","")
}

