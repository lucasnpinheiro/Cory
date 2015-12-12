angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

        .run(function ($ionicPlatform, $ionicPopup, API, $state, $ionicLoading, $ionicHistory) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                if (_session.get('url') != null) {
                    constant.url = _session.get('url');
                } else {
                    _session.set('url', constant.url);
                }

                if (_session.get('nome') != null) {
                    $ionicLoading.show({
                        template: '<h2>Aguarde</h2> Verificando dados.'
                    });
                    API.getLogin(_session.get('nome'), _session.get('senha')).then(
                            function successCallback(r) {
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
                                }
                            },
                            function errorCallback(data, status, headers, config) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Não foi possivel fazer o login, sem conexão com o Webservice.'
                                });
                            }
                    );

                } else {
                    _session.remove('user');
                }
            });
        })

        .filter('moeda', function ($filter) {
            return function (valor, format) {
                if (valor) {
                    return format + number_format(valor, 2, ',', '.');
                }
                else
                    return "";
            };
        })

        .filter('dataHora', function ($filter) {
            return function (valor) {
                if (valor) {
                    return date('d/m/Y H:i:s', (new Date(valor)));
                }
                else
                    return "";
            };
        })

        .filter('data', function ($filter) {
            return function (valor) {
                if (valor) {
                    return date('d/m/Y', (new Date(valor)));
                }
                else
                    return "";
            };
        })

        .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            $httpProvider.defaults.headers.post['Accept'] = 'application/x-www-form-urlencoded';
            $httpProvider.defaults.cache = false;
            $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
            $httpProvider.defaults.headers.common['Accept'] = 'application/x-www-form-urlencoded';
            $httpProvider.defaults.useXDomain = true;
            $stateProvider
                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html',
                        controller: 'AppCtrl'
                    })
                    .state('app.login', {
                        url: '/login',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/login.html',
                                controller: 'LoginCtrl'
                            }
                        }
                    })
                    .state('app.configuracoes', {
                        url: '/configuracoes',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/configuracoes.html',
                                controller: 'ConfiguracoesCtrl'
                            }
                        }
                    })
                    .state('app.meus_pedidos', {
                        url: '/meus_pedidos',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/meus_pedidos.html',
                                controller: 'MeusPedidosCtrl'
                            }
                        }
                    })
                    .state('app.detalhes', {
                        url: '/detalhes/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/detalhes.html',
                                controller: 'DetalhesCtrl'
                            }
                        }
                    })
                     .state('app.produto', {
                        url: '/produto/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/produto.html',
                                controller: 'ProdutosCtrl'
                            }
                        }
                    })
                    .state('app.playlists', {
                        url: '/playlists',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/playlists.html',
                                controller: 'PlaylistsCtrl'
                            }
                        }
                    });
            $urlRouterProvider.otherwise('/app/login');
        });