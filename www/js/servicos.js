angular.module('starter').factory('API',function($http){
	var _getProdutos = function(){
		return $http({ method: 'GET', url: constant.url + 'produtos.json' });
	}
	var _getProduto = function(id){
		return $http({ method: 'GET', url: constant.url + 'produtos/view/' + id + '.json' });
	}
	var _setPedido = function(dados, pedido){
		return  $http({ method: 'POST', url: constant.url + 'pedidos/add.json', data: { produtos: dados, pedidos: pedido } });
	}
	var _getPedidos = function(){
		return $http({ method: 'GET', url: constant.url + 'pedidos.json?limit=100&sort=id&direction=desc&usuario_id=' + constant.user.id });
	}
	var _getPedido = function(id){
		return $http({ method: 'GET', url: constant.url + 'pedidos/view/' + id + '.json' });
	}
	var _getLogin = function(nome, senha){
		return $http({ method: 'GET', url: constant.url + 'usuarios/login.json?nome=' + nome + '&senha=' + senha + '', });
	}


	return {
		getProdutos : _getProdutos,
		getProduto : _getProduto,
		getPedidos : _getPedidos,
		getPedido : _getPedido,
		setPedido : _setPedido,
		getLogin : _getLogin
	};

});


angular.module('starter').factory('LoadedUser', function($rootScope){
	return {
		get : function(){
			$rootScope.nome = getUer();
		}
	};	
})