# Sej Engine

Sej \[ˈsɛj\]. (Pronounced like the word "say")

`SejEngine` is an performance oriented 3D editor.
It is written in TypeScript and rewrite [three.js](https://threejs.org/)'s editor.

`SejEngine` is:

-   Performance oriented, but
-   Heavily opinionated

[![PR Checker](https://github.com/andrewisen-tikab/sej/actions/workflows/pr.yml/badge.svg)](https://github.com/andrewisen-tikab/sej/actions/workflows/pr.yml)

[![Release](https://github.com/andrewisen-tikab/sej/actions/workflows/release.yml/badge.svg)](https://github.com/andrewisen-tikab/sej/actions/workflows/release.yml)

## Getting started

Begin by installing `sej`:

```bash
yarn add sej
```

Use the `SEJ` namespace to avoid conflicts with other libraries:

```ts
import * as SEJ from 'sej';
```

The `SejEngine` consists of multiple parts.
You are free to pick and choose which parts you want to use.
This will determine how your application will look and behave.

To aid you with this, there are some factories that you can use to build your own `SejEngine`:

```ts
const factory = new AbstractExampleFactory();
const sej = factory.build();
```

The variable `sej` will now contain a `SejEngine` that has all the bells and whistles that you need to create simple scene.

## Demo

A list of working examples can be found here:

-   [https://andrewisen-tikab.github.io/sej/examples/](https://andrewisen-tikab.github.io/sej/examples/)

## WIP

The purpose of `Sej` is to be "the future of 3D editors".

This means that `Sej` will drop support for WebGL in favor WebGPU.
However, because of the state of WebGPU (and web in general - yes, I'm looking at you Safari), `sej` will not be production ready for a while.

## Models used

["Spartan Armour MKV - Halo Reach" by McCarthy3D](https://sketchfab.com/3d-models/spartan-armour-mkv-halo-reach-57070b2fd9ff472c8988e76d8c5cbe66)

["Simple Metal Fence" by Blender3D](https://sketchfab.com/3d-models/simple-metal-fence-9450c03e6c074982b9f86cd73866b461)

["City 1" by ithappy](https://sketchfab.com/3d-models/city-1-55b5426840fd45f19f19efdb4293f986)

["Pringles Cans | 5 Different Flavours | GAMEREADY" by NKaap](https://sketchfab.com/3d-models/pringles-cans-5-different-flavours-gameready-ba9779250e314c16abe05e9a00f33a02)

## Dependency Graph

<img src="https://github.com/andrewisen-tikab/sej/blob/dev/resources/dependency-graph-01.svg?raw=true" width="100%" />

<img src="https://github.com/andrewisen-tikab/sej/blob/dev/resources/dependency-graph-02.svg?raw=true" width="100%" />

<img src="https://github.com/andrewisen-tikab/sej/blob/dev/resources/dependency-graph-03.svg?raw=true" width="100%" />

## Tests

Testing is done locally with `cypress`.
