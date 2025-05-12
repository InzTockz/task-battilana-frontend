#Imagen base con NGINX
FROM nginx:alpine

#Copiar el contenido del build Angular a la carpeta que NGINX sirve
COPY dist/task-battilana /usr/share/nginx/html

#(Opcional) sobreescribir el nginx.conf si quieres rutas personalizadas (como angular routing)
#COPY nginx.conf /etc/nginx/conf.d/default.conf

#Exponer el puerto donde corre NGINX
EXPOSE 80