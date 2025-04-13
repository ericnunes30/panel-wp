Index (Listar Usuários)

Sucesso:
Status HTTP: 200 OK
Descrição: Retorna uma lista de usuários, onde cada usuário inclui seus dados básicos (ID, nome, email) e uma lista de seus sites relacionados (também com ID, nome, URL e api_key).
Erros:
Status HTTP: 500 Internal Server Error
Descrição: Erro inesperado ao consultar o banco de dados ou ao processar os dados.


store (Criar Usuário)

Sucesso:
Status HTTP: 201 Created
Descrição: Retorna o usuário recém-criado (com ID, nome, email, etc.).
Erros:
Status HTTP: 400 Bad Request
Descrição: Erro de validação dos dados fornecidos (ex: email inválido, campos obrigatórios faltando, email já existe, etc.). A mensagem detalhada do erro de validação deve ser retornada.
Status HTTP: 500 Internal Server Error
Descrição: Erro inesperado ao tentar criar o usuário no banco de dados.


show (Exibir Usuário)

Sucesso:
Status HTTP: 200 OK
Descrição: Retorna os dados do usuário solicitado (ID, nome, email) e uma lista de seus sites (com ID, nome, URL e api_key).
Erros:
Status HTTP: 404 Not Found
Descrição: O usuário com o ID especificado não foi encontrado.


update (Atualizar Usuário)

Sucesso:
Status HTTP: 200 OK
Descrição: Retorna os dados do usuário atualizado.
Erros:
Status HTTP: 404 Not Found
Descrição: O usuário com o ID especificado não foi encontrado.
Status HTTP: 400 Bad Request
Descrição: Erro de validação dos dados fornecidos na atualização. A mensagem detalhada do erro de validação deve ser retornada.
Status HTTP: 500 Internal Server Error
Descrição: Erro inesperado ao tentar atualizar o usuário no banco de dados.


destroy (Excluir Usuário)

Sucesso:
Status HTTP: 204 No Content
Descrição: O usuário foi excluído com sucesso. Nenhuma informação adicional é retornada no corpo da resposta.
Erros:
Status HTTP: 404 Not Found
Descrição: O usuário com o ID especificado não foi encontrado.
Status HTTP: 500 Internal Server Error
Descrição: Erro inesperado ao tentar deletar o usuário no banco de dados.
SitesController


index (Listar Sites)

Sucesso:
Status HTTP: 200 OK
Descrição: Retorna uma lista de sites associados ao usuário autenticado (com ID, nome, URL e api_key).
Erros:
Status HTTP: 500 Internal Server Error
Descrição: Erro inesperado ao consultar o banco de dados ou ao processar os dados.
Status HTTP: 401 Unauthorized
Descrição: O usuario não esta autenticado.


store (Criar Site)

Sucesso:
Status HTTP: 201 Created
Descrição: Retorna o site recém-criado (com ID, nome, URL e api_key).
Erros:
Status HTTP: 400 Bad Request
Descrição: Erro de validação dos dados fornecidos (ex: campos obrigatórios faltando, api_key inválida, etc.). A mensagem detalhada do erro de validação deve ser retornada.
Status HTTP: 500 Internal Server Error
Descrição: Erro inesperado ao tentar criar o site no banco de dados.
Status HTTP: 401 Unauthorized
Descrição: O usuario não esta autenticado.


show (Exibir Site)

Sucesso:
Status HTTP: 200 OK
Descrição: Retorna os dados do site solicitado (ID, nome, URL e api_key).
Erros:
Status HTTP: 404 Not Found
Descrição: O site com o ID especificado não foi encontrado.
Status HTTP: 500 Internal Server Error
Descrição: Erro inesperado ao tentar buscar o site no banco de dados.


update (Atualizar Site)

Sucesso:
Status HTTP: 200 OK
Descrição: Retorna os dados do site atualizado.
Erros:
Status HTTP: 404 Not Found
Descrição: O site com o ID especificado não foi encontrado.
Status HTTP: 400 Bad Request
Descrição: Erro de validação dos dados fornecidos na atualização. A mensagem detalhada do erro de validação deve ser retornada.
Status HTTP: 500 Internal Server Error
Descrição: Erro inesperado ao tentar atualizar o site no banco de dados.


destroy (Excluir Site)

Sucesso:
Status HTTP: 204 No Content
Descrição: O site foi excluído com sucesso. Nenhuma informação adicional é retornada no corpo da resposta.
Erros:
Status HTTP: 404 Not Found
Descrição: O site com o ID especificado não foi encontrado.
Status HTTP: 500 Internal Server Error
Descrição: Erro inesperado ao tentar deletar o site no banco de dados.
SessionController

store (Login)

Sucesso:
Status HTTP: 200 OK
Descrição: Retorna um token de acesso válido.
Erros:
Status HTTP: 400 Bad Request
Descrição: Erro de validação nos dados fornecidos ou credenciais inválidas (email ou senha incorretos). A mensagem de erro deve ser clara indicando o problema.
Status HTTP: 500 Internal Server Error
Descrição: Erro inesperado ao tentar fazer login.
destroy (Logout)

Sucesso:
Status HTTP: 200 OK
Descrição: O token de acesso do usuario foi excluido com sucesso.
Status HTTP: 204 No Content
Descrição: O token do usuário foi invalidado com sucesso.
Erros:
Status HTTP: 401 Unauthorized
Descrição: Usuario não esta autenticado.
Status HTTP: 500 Internal Server Error
Descrição: Erro inesperado ao tentar invalidar o token.