# XMEN DNA Solver
_Servicio en NodeJS que busca encontrar la mayor cantidad de mutantes de acuerdo a unos patrones que estos tienen en su ADN._

## Comenzando 🚀
Las instrucciones aquí te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.
Mira **Instalación 🔧** para conocer como instalar el proyecto.

### Pre-requisitos 📋
_Para realizar la instalación local de debe contar con unos requisitos:_
```
- NodeJS v12+
- NPM
- Postgresql DB
- Redis
```
_Si se tiene instalado Docker es mucho más fácil, solo se necesita:_
```
Docker
docker-compose
```

### Instalación 🔧
Hay dos formas de poner a correr nuestro servicio xmen:
1. Forma tradicional (instaladar todo en el equipo)
2. Docker con docker-compose

#### Forma tradicional 🔧
Para la forma tradicional, debemos tener antes una base de datos en Postgresql y una instancia de Redis.
Primero que todo debemos instalar las dependendencias del proyecto ejecutando:
```
npm install
```
Luego debemos modificar las variables de entorno que se encuentran dentro del archivo _.env.dev_ (development).
Por ultimo para correr nuestro programa solo debemos ejecutar el comando:
```
npm run watch
```
Luego de esto quedará una instancia corriendo en el puerto 3000.
Para probar que todo funciona bien puede hacerse una petición HTTP:
```
GET http://localhost:3000/stats/
```

#### Docker y docker-compose 🔧
Para esta forma, debemos tener previamente instalado docker y docker-compose en nuestro equipo.
Luego, lo unico que debemos ejecutar es:
```
docker-compose up
```
De esta manera, se creará una instancia de Postgresql, Redis y una de nuestro xmen-service.
Luego de esto quedará una instancia corriendo en el puerto 3000.
Para probar que todo funciona bien puede hacerse una petición HTTP:
```
GET http://localhost:3000/stats/
```

## Ejecutando las pruebas ⚙️
En esta ocasión, las pruebas que realizaremos serán unitarias.
Nos enfocaremos en las pruebas del algoritmo de reconocimiento de DNA, para estas pruebas se crean una clase en util, con el patrón Builder, ayudandonos a realizar los tests más fácilmente.
Las pruebas se ejecutan automaticamente al hacer un push o pull request con GitHub Actions, pero también podemos ejecutarlas manualmente.
Primero debemos instalar los paquetes de npm con el comando:
```
npm install
```
Una vez instalados nuestros paquetes de npm podemos ejecutar las pruebas con:
```
npm test
```

## Despliegue a la nube 📦
Para el despliegue a la nube, teniendo en cuenta que el servicio podía recibir muchas peticiones (100 mil a 1 millón), se optó por utilizar un proxy reverso llamado Traefik, esto acompañado del servicio distribuido en varias instancias dentro de varios servidores, orquestado por la herramienta Docker Swarm.
Para dar marcha a esto, se utilizó la herramienta de GitHub Actions para realizar un build de la imagen de docker del servicio y hacer push al registrador de imagenes en DockerHub cada vez que se hiciera un push a la rama _main_ del repositorio.

El despliegue será manual.
Una vez la imagen esté en DockerHub, dentro del archivo _stack.yml_ podemos ver las configuraciones necesarias para hacer funcionar nuestro servicio.
Debemos tener en cuenta que para esto, previamente se configuró DockerSwarm, Traefik, una instancia de Redis y una de Postgresql.
Con el siguiente comando desplegamos nuestro servicio:
```
docker stack deploy -c stack.yml xmen
```
Para pruebas podemos hacer peticiones a las siguientes URL:
```
POST - https://api.rankey.info/xmen/mutant
GET - https://api.rankey.info/xmen/stats
```

## Explicación lógica
En la carpeta logic de este repositorio se encuentra 3 notebooks con lógicas para resolver el problema del algoritmo.
Estos algoritmos se hicieron en Python con Jupyter Notebooks y posteriormente pasados a NodeJS.

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