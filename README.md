# Midnight Pizza Temptation

![](https://raw.githubusercontent.com/Platane/midnight-pizza-temptation/master/screenshot/full.jpg)

[![wercker status](https://img.shields.io/wercker/ci/wercker/docs.svg?style=flat-square "wercker status")](https://app.wercker.com/project/byKey/dcb860cd65d725036775cc32f6f602be)

[play !](http://platane.github.io/midnight-pizza-temptation)

Game submited for the js13k game contest.

My entry page is here : [js13kgames.com/entries/midnight-pizza-temptation](http://js13kgames.com/entries/midnight-pizza-temptation)


__Featuring ...__

_cool pizza explosion_

<img src="https://raw.githubusercontent.com/Platane/midnight-pizza-temptation/master/screenshot/explosion.gif" width="300">

_insane pizza rain_

<img src="https://raw.githubusercontent.com/Platane/midnight-pizza-temptation/master/screenshot/rain.gif" width="300">

# About

I wanted to explore city-like procerualy generated map and traffic jam logic. So here it is, the resultis certainly not so fun to play ( sorry ), but was quite interesting to develop.

## map generation

<img title="map" src="https://github.com/Platane/midnight-pizza-temptation/blob/master/screenshot/map.png?raw=true" width="200">

The map generation follows this steps:
- pick N points in a non uniform, perlin noise based repartition.
- generate a first graph from the voronoi tesselation of the N points.
- use A* algorithm with non-optimal heuristic to link end points to each others, keep only the arcs found as solutions.

## navigation AI

The carriers determine the path to follow with a simple A* algorithm.

They accelerate when the distance with the carrier ahead is short enought, brake otherwise.

The hard thing is to determine which one is ahead, especially near to an intersection.

This is achieve by precomputing for each intersection all the combinaison ( incoming arc, outgoing arc ) and which ones crosses. When they cross, respect "priority to whom comes from right" rule.

<img title="road intersection priority" src="https://github.com/Platane/midnight-pizza-temptation/blob/master/screenshot/exchange.jpg?raw=true" width="200">

The algorithm also does checks to prevent deadlock.

## rendering

I did a procedural pizza generator!

<img title="pizza sample" src="https://github.com/Platane/midnight-pizza-temptation/blob/master/screenshot/pizza.png?raw=true" width="200">

The ui was quite simple, until I added paricule effects everywhere and screen shake !

## tooling

I set up some useful automated processes.

There is some unit tests running at each commit on [wercker](http://wercker.com/). If they passed, the index.html built and the zip file are push to gh-pages.

This is quite cool since I actually never run the build myself. I just checked the size from time to time on the CI server.

## golfing

I actually did not consider the size limit very much. The fact that the result is ziped makes the space saved for one trick difficult to predict.

In addition, before zip the minified source is ~45Ko which is HUGE. I did not restrain my self to waste space to increase readability ( webpack usage, long named object properties ... ).

<img title="size evolution" src="https://github.com/Platane/midnight-pizza-temptation/blob/master/screenshot/size.jpg?raw=true" height="200">
