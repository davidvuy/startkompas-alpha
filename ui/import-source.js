'use strict';
// Decode only explicitly selected UTF-8 text; retain BOM and line endings.
globalThis.StartkompasImportSource={
 decode(name,bytes){
  if(typeof name!=='string'||! /\.(txt|md|markdown)$/i.test(name))throw Error('Choose a .txt, .md or .markdown file.');
  if(!(bytes instanceof Uint8Array)||bytes.byteLength>64000)throw Error('Choose a text file of at most 64000 bytes.');
  let text;try{text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes);}catch{throw Error('This file is not valid UTF-8. Convert a copy to UTF-8 before importing; nothing was replaced.');}
  if(!text.trim()||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(text))throw Error('Choose readable text without binary control characters.');
  return {text,format:/\.(md|markdown)$/i.test(name)?'markdown':'text',bytes:bytes.byteLength};
 },
 selected(original,editorText){return original===null?editorText:original;}
};
