angular.module('starter.controllers', ['ionic', 'ngCordova'])


        .controller('AppCtrl', function ($scope, $state, $ionicPopup, LoadedUser) {
            LoadedUser.get();
            $scope.sair = function () {
                $ionicPopup.confirm({
                    title: 'Sair do aplicativo Cory',
                    template: 'Você realmente deseja sair do aplicativo?'
                }).then(function (res) {
                    if (res) {
                        constant.user = {};
                        _session.remove('nome');
                        _session.remove('senha');
                        ionic.Platform.exitApp();
                        $state.go('app.login');
                    }
                });
            }
            
        })

        .controller('ConfiguracoesCtrl', function ($scope, $state, $ionicLoading, LoadedUser) {
            LoadedUser.get();
            $scope.config = constant;
            $scope.save = function () {
                constant.url = $scope.config.url;
                _session.set('url', constant.url);
                $state.go('app.login');
            };
            
        })

        .controller('LoginCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, $ionicHistory, API, LoadedUser) {
            LoadedUser.get();
            $scope.loginData = {};
            $scope.doLogin = function () {
                
                $ionicLoading.show({
                    template: '<h2>Aguarde</h2> Verificando dados.'
                });
                API.getLogin($scope.loginData.nome, $scope.loginData.senha).then(
                        function (r) {
                            $ionicLoading.hide();
                            if (r.data.usuarios != null) {
                                constant.user = r.data.usuarios;
                                _session.set('nome', r.data.usuarios.nome);
                                _session.set('senha', r.data.usuarios.senha);
                                $ionicHistory.nextViewOptions({
                                    disableAnimate: true,
                                    disableBack: true
                                });
                                $state.go('app.playlists');
                            } else {
                                $ionicPopup.alert({
                                    title: 'Dados invalidos',
                                    template: 'Usuário e/ou senha informados invalidos.'
                                });
                            }
                        },
                        function (data) {
                            alert(JSON.stringify(data));
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Error',
                                template: 'Não foi possivel fazer o login, sem conexão com o Webservice.'
                            });
                        }
                );
            };
           
        })

        .controller('PlaylistsCtrl', function ( $cordovaSQLite, $scope, $ionicPopup, $ionicLoading, $state, API, LoadedUser) {
            LoadedUser.get();
            validarUser();
            $scope.tentativas = 0;
            
          
            $scope.lista = function () {
                API.getProdutos().then(function (response) {
                    $scope.playlists = response.data.produtos;
                    $scope.total = 0;
                    $scope.quantidade_total = 0;
                    $ionicLoading.hide();
                }, function (response) {
                    $ionicLoading.hide();
                });
            };
            $ionicLoading.show({
                template: '<h2>Aguarde</h2> Carregando lista de produtos.'
            });
            $scope.linhaColor = function (id) {
                return (id % 2 === 0 ? 'linhaPar' : 'linhaImpar');
            }
            $scope.lista();
            $scope.change = function (q, idx, valor, div) {

                if(!q.quantidade){
                    q.quantidade = 0;
                }

                if(q.quantidade.toString().length > 4){
                    q.quantidade = parseInt(q.quantidade.toString().substr(0, 4));
                }

                $scope.playlists[div]['produtos'][idx].sub_total = parseFloat(parseFloat(q.quantidade) * parseFloat(valor));
                $scope.playlists[div]['produtos'][idx].sub_quantidade = parseFloat(q.quantidade);
                $scope.total = $scope.quantidade_total = 0;
                angular.forEach($scope.playlists, function (v) {
                    angular.forEach(v.produtos, function (value) {
                        if (value.sub_total > 0) {
                            $scope.total += parseFloat(value.sub_total);
                            $scope.quantidade_total += parseFloat(value.sub_quantidade);
                        }
                    });
                });

                if(q.quantidade === 0){
                    q.quantidade = '';
                }
            };
            $scope.finalizar = function () {
                $ionicLoading.show({
                    template: '<h2>Aguarde</h2> Gerando o número do pedido.'
                });
                dados = [];
                pedido = {};
                pedido.total = $scope.total;
                pedido.usuario_id = constant.user.id;
                pedido.empresa = constant.user.filial;
                pedido.status = 'L';
                pedido.data = date('Y-m-d', (new Date()));
                angular.forEach($scope.playlists, function (v) {
                    angular.forEach(v.produtos, function (value) {
                        if (value.sub_total > 0) {
                            dados.push(value);
                        }
                    });
                });
                if (dados.length > 0) {

                    API.setPedido(dados, pedido).then(
                            function(r) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Número do pedido.',
                                    template: '<div style="text-align: center"><h1 style="font-size: 125px;">' + r.data.pedido.id + '</h1></div>'
                                });
                                $scope.lista();
                            },
                            function(data, status, headers, config) {
                                $ionicLoading.hide();
                                if($scope.tentativas < 3){
                                    $scope.tentativas++;
                                    $scope.finalizar();
                                } else {
                                   $ionicPopup.alert({
                                        title: 'Erros no envio do pedido.',
                                        template: 'Após ' + scope.tentativas + ' tentativas sem sucesso de envio do pedido o sistema ta encontrando erro de comunicação, por favor tentar novamente ou entrar em contato com o administrador do sistema.'
                                    }); 
                                }
                            }
                    );
                } else {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Não foi informado menhum produto para venda.'
                    });
                }
            };
        })

        .controller('MeusPedidosCtrl', function ($scope, API, $ionicLoading, $state, LoadedUser) {
            LoadedUser.get();
            validarUser();
            
            $scope.linhaColor = function (id) {
                return (id % 2 === 0 ? 'linhaPar' : 'linhaImpar');
            }
            $ionicLoading.show({
                template: '<h2>Aguarde</h2> Carregando lista de pedidos.'
            });
            API.getPedidos().then(function (response) {
                $scope.lista = response.data.pedidos;
                $ionicLoading.hide();
            }, function (response) {
                $ionicLoading.hide();
            });
        })

        .controller('DetalhesCtrl', function ($stateParams, $scope, API, $ionicLoading, $state, LoadedUser) {
            LoadedUser.get();
            var id = $stateParams.id;
            $scope.lista = {};
            $scope.linhaColor = function (id) {
                return (id % 2 === 0 ? 'linhaPar' : 'linhaImpar');
            }
            validarUser();
            
            $ionicLoading.show({
                template: '<h2>Aguarde</h2> Carregando os dados do Pedido.'
            });
            API.getPedido(id).then(function (response) {
                $scope.lista = response.data.pedido;
                $ionicLoading.hide();
            }, function (response) {
                $ionicLoading.hide();
            });
        })
        
        
        .controller('ProdutosCtrl', function ($stateParams, $scope, API, $ionicLoading, $state, LoadedUser) {
            LoadedUser.get();
            var id = $stateParams.id;
            $scope.lista = {};
            $scope.linhaColor = function (id) {
                return (id % 2 === 0 ? 'linhaPar' : 'linhaImpar');
            }
            validarUser();
            
            $ionicLoading.show({
                template: '<h2>Aguarde</h2> Carregando os dados do Pedido.'
            });
            API.getProduto(id).then(function (response) {
                $scope.lista = response.data.produto;
                $ionicLoading.hide();
            }, function (response) {
                $ionicLoading.hide();
            });
        })