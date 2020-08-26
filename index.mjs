#!/usr/bin/env -S node --experimental-modules

import fs from 'fs';
import path from 'path';
import space from 'color-space';
import convert from '@csstools/convert-colors';
import commander from 'commander';

const program = new commander.Command();




program
  .option('-s, --saturation <value>', 'New saturation value')
  .option('-l, --luminosity <type>', 'New luminosity value')

program.parse(process.argv);

 
const data = fs.readFileSync(0, 'utf-8').toString();


//console.log(data);

const list = data.split("\n");

for(let color of list){
  if (color) {
    const [r,g,b] = convert.hex2rgb(color);
    const [h,s,l] = space.rgb.hsluv([r,g,b]);
    const [R,G,B] = space.hsluv.rgb([h,program.saturation||s,program.luminosity||l]);
    const hex = convert.rgb2hex(R,G,B);
    console.log(hex);
  }
}
