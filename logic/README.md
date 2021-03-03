# Lógica

El problema básicamente es una matriz de NxN en el que solo se encuentran letras A-C-T-G, partiendo de esto, para saber si una muestra de ADN pertenece a un mutante, debemos encontrar una combinación de las _letras_ repetidas en 4 ocasiones dentro de la matriz y esta combinación debe estar por lo menos en 2 ocasiones.
De acuerdo a estas condiciones, desarrollé 3 algoritmos, hice pruebas y me decidí por el algoritmo que resolviera el problema en menor tiempo posible.

### Direcciones posibles
Para las 3 lógicas de este algoritmo se basó en la misma técnica de direcciones, basicamente en una coordenada vamos a realizar una serie de busquedas hacia todos los lados posibles.
Arriba, abajo, derecha, izquierda, arriba izquierda, arriba derecha, abajo izquierda, abajo derecha

## Lógica 1 - Buscar combinaciones de 4 letras
Para el primer algoritmo, la idea fue recorrer cada una de las posiciones de la matriz, en cada posición se intenta encontrar una combinación de 4 letras repetidas de acuerdo a la letra en la que se esté en el momento de recorrer, ejemplo, en la posición (3,3) se encuentra la letra C, por lo que se buscará alrededor de esta posición CCCC en todas las **Direcciones posibles**.
Con este algoritmo se tuvo una respuesta de 12ms en promedio.

## Lógica 2 - Evitando 1 ciclo for
En este algoritmo, lo que intenté realizar fue modificar un poco más la anterior lógica para disminuir el tiempo.
Para esto obté por evitar realizar tantos ciclos for, pero su lógica funcionaría similar al otro, en una coordenada buscaría una combinación de 4 letras en todas **Direcciones posibles**, pero la forma en la que se recorrer la matriz es diferente, hacemos un cálculo para ver cuantas iteraciones se realizarían en una matriz de NxN, para esto, multiplicamos las dimensiones de la matriz, ejemplo, 4x4=16, 16 iteraciones, evitandonos 1 ciclo for, ahora para calcular las filas dentro del ciclo calculamos int(i/N) y para las columnas int(i%N).
Desafortunadamente de esta forma el algoritmo alcanzó mayores tiempos de respuesta, 17ms en promedio.

## Lógica 3 - Algoritmo de backtracking
En el último intento de algoritmos, recorreremos la matriz de la forma tradicional, utilizando dos ciclos for, uno para filas y otro para columnas, además, también utilizaremos todas las **Direcciones Posibles**, ahora lo que cambiará es la forma de buscar la respuesta, para esto utilizaremos un algoritmo recursivo de backtracking, utilizado comunmente para recorrer Arboles, además, con la filosofía de DFS (Deep First Search).
Este algoritmo lo que nos permite es recorrer cada una de las coordenadas y en cada direccion, intentará buscar palabra combinación de 4, si la siguiente letra en esa dirección no es la misma de la coordenada inicial, volverá al punto inicial, ejemplo, en la posición (3,3) se encuentra la letra C, entonces la primer dirección puede ser arriba, entonces mirará (2,3) si en esta se encuentra una C, mirará (1,3), si en esta no hay una letra C, volverá a probar otra dirección comenzando desde (3,3).
La ventaja de este algoritmo es que evita que el programa examine todas las combinaciones posibles, solo recorrera si es correcto, de lo contrario no "botará más escape ahí".
Para sorpresa mía, este algoritmo fue el más efectivo, aunque en principio pensé que sería más rápido los otros 2.
Al ejecutar las pruebas en este, tenemos entregó resultado con un promedio de 1000 microsegundos (1ms), superando por mucho a los otros 2 algoritmos.