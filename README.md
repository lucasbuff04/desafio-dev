# Como rodar
## Instalando as dependências
1. Execute ```npm i```
2. Entre na pasta client: ```cd client```
3. Execute ```npm i```

## Rode os containers
```docker-compose up -d```

# Acessando a aplicação
- Client: ```http://localhost:3000```
- Server: ```http://localhost:3001``` (há um proxy do client para o server para acessar a api)

# API
GET /transactions - Retorna todas as transações previamente salvas no banco de dados
POST /uploadFile
headers:
```
{
	"content-type": "multipart/form-data" 
}
```
body:
```
{
	"upload_file": {file}
}
```