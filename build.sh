#!/bin/bash
#=================================================================#     
#Arquivo: build.sh                                                #  
#Autor: Ralfam Portela         Email: ralfam.portela@3db.cloud    #      
#Contribuição Sebastião Santos Email: sebastiao.santos@3db.cloud  #      
#Data: 21-10-2022                                                 # 
#                                                                 # 
#Esse arquivo é de build de imagens jsp-bi  Front                 #  
#                                                                 #
#                                                                 #
#                                                                 #  
#=================================================================#     

#Colocar o dados da cloud
USER="grj7uyekqpbi/ludemeury@vedastech.com.br"

TENANT="grj7uyekqpbi" 

APP="jsp-bi-front"
VERSION="1.0.19"

echo "Construindo a imagem ${VERSION}"
#Faz um build baseado no Dockfile
docker build -t ${VERSION} .

echo "Marcando a tag latest também"
#Faz duas tags sendo a latest será a que usaremos em produção
docker tag ${VERSION} gru.ocir.io/${TENANT}/${APP}:${VERSION}
docker tag ${VERSION} gru.ocir.io/${TENANT}/${APP}:latest

#Envia as duas imagens para o OCI Container Registry
echo "Enviando a imagem para nuvem docker"
docker push gru.ocir.io/${TENANT}/${APP}:${VERSION}
docker push gru.ocir.io/${TENANT}/${APP}:latest
