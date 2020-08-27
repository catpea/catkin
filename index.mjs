#!/usr/bin/env -S node --experimental-modules

import fs from 'fs-extra';
import path from 'path';
import space from 'color-space';
import convert from '@csstools/convert-colors';
import template from 'lodash/template.js';

import commander from 'commander';
const program = new commander.Command();

program
  .option('-s, --saturation <value>', 'New saturation value')
  .option('-l, --luminosity <type>', 'New luminosity value')
  .option('-d, --debug', 'Debug mode, increase verbosity.')

program.parse(process.argv);

let source = 0;
const file = path.join( process.cwd(), program.args.pop() );
if(fs.pathExistsSync(file)) source = file;
const data = fs.readFileSync(source, 'utf-8').toString();

let transformed = data
.replace(/#[a-f0-9]{3,6}/g, function(match, captureGroup1, captureGroup2, captureGroup3, offset, string){ return hex(match); })
.replace(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g, function(match, r, g, b, offset, string){ return rgb(r,g,b); });

console.log(transformed);








function hex(hexadecimal){
  const [r,g,b] = convert.hex2rgb(hexadecimal);
  const [R,G,B] = change(r,g,b);
  const color = convert.rgb2hex(R,G,B);
  return color;
}

function rgb(r,g,b){
  const [R,G,B] = change(r,g,b).map(i=>i.toFixed(0));
  const color = `rgb(${R}, ${G}, ${B})`;
  return color;
}

function change(r,g,b){
  const [h,s,l] = space.rgb.hsluv([r,g,b].map(s=>parseInt(s)));
  const H = h;
  const S = (parseInt(program.saturation)||s);
  const L = (parseInt(program.luminosity)||l);
  const [R,G,B] = space.hsluv.rgb([H,S,L]);
  if(program.debug) console.log([h,s,l], [H,S,L]);
  if(program.debug) console.log([r,g,b], [R,G,B]);
  return [R,G,B];
}
