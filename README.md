# XMEN DNA Solver

_Servicio que busca encontrar la mayor cantidad de mutantes de acuerdo a unos patrones que estos tienen en su ADN.

## Comenzando 🚀

Las instrucciones aquí te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.
Mira **Deployment** para conocer como desplegar el proyecto.

### Pre-requisitos 📋

_Para realizar la instalación de debe contar con unos requisitos_

```
- NodeJS v12+
- NPM
- Postgresql DB
- Redis
```

### Instalación 🔧

Este es un ejemplo de como correr el servicio en development.
Primero que todo debemos instalar las dependendencias del proyecto ejecutando:
```
npm install
```

Luego debemos modificar las variables de entorno que se encuentran dentro del archivo _.env.dev_ (development), ejemplo:

```
DB_HOST=localhost
DB_PORT=2345
DB_USER=user123
DB_PASSWORD=password123
DB_NAME=dbsample
DB_LOGGING=false
CACHE_HOST=localhost
CACHE_PASSWORD=password123
```

Por ultimo para correr nuestro programa solo debemos ejecutar el comando:
```
npm run watch
```
Luego de esto quedará una instancia corriendo en el puerto 3000


Para probar que todo funciona bien puede hacerse una petición HTTP:
```
GET http://localhost:3000/stats/
```

## Ejecutando las pruebas ⚙️

Una vez instalados nuestros paquetes de npm podemos ejecutar las pruebas con:
```
npm test
```

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Despliegue 📦

Para desplegar este servicio se recomienda utilizar _Docker_
Si queremos hacer un despliegue en un servidor o en nuestra maquina, que previamente tenga instalado docker, podemos realizarlo utilizando docker y docker-compose solo ejecutando el comando:
```
docker-compose up --build
```
Este comando lanzará una instancia de Redis y una de Postgresql, luego de que estas estén corriendo, se iniciaría el servicio xmen, que se conectará automaticamente a las instancias anteriores.

## Despliegue a la nube 📦

Para el despliegue a la nube, teniendo en cuenta que el servicio podía recibir muchas peticiones (100 mil a 1 millón), se optó por utilizar un proxy reverso llamado Traefik, esto acompañado del servicio distribuido en varias instancias dentro de varios servidores, orquestado por la herramienta Docker Swarm.
Para dar marcha a esto, se utilizó la herramienta de GitHub actions para realizar un build de la imagen de docker del servicio y hacer push al registrador de imagenes en DockerHub cada vez que se hiciera un push a la rama _main_ del repositorio.

El despliegue será manual.
Una vez la imagen esté en DockerHub, dentro del archivo _stack.yml_ podemos ver las configuraciones necesarias para hacer funcionar nuestro servicio.
Debemos tener en cuenta que para esto, previamente se configuró DockerSwarm, Traefik, una instancia de Redis y una de Postgresql.
Con el siguiente comando desplegamos nuestro servicio:
```
docker stack deploy -c stack.yml xmen
```

## Construido con 🛠️

* [Backtraing](https://en.wikipedia.org/wiki/Backtracking) - Algoritmo base para resolver el problema
* [NodeJS](https://nodejs.org/) - Entorno en tiempo de ejecución multiplataforma
* [Express](https://expressjs.com/) - Framework en nodejs para realizar APIs
* [InversifyJS](https://github.com/inversify/InversifyJS) - Contenedor para inversión de control (IoC)
* [TypeORM](https://typeorm.io/#/) - ORM para conexión a bases de datos
* [Redis](https://redis.io/) - Almacen de datos en memoria
* [Postgresql](https://www.postgresql.org/) - Base de datos relacional
* [Docker](https://www.docker.com/) - Plataforma de contenedorización open-source
* [Docker Swarm](https://docs.docker.com/engine/swarm/) - Herramienta de orquestacion de contenedores
* [Traefik](https://traefik.io/) - HTTP proxy reverso

## Autores ✒️

* **Jhon Gil Sepulveda** - *Trabajo Inicial* - [rankey1496](https://github.com/rankey1496)

## Licencia 📄

Este proyecto está bajo la Licencia ISC

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
