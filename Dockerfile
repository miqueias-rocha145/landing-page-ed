# Imagem leve do Nginx para servir arquivos estáticos
FROM nginx:alpine

# Copia os arquivos do projeto para a pasta do Nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando para rodar o Nginx no primeiro plano
CMD ["nginx", "-g", "daemon off;"]
