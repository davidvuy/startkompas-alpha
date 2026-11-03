'use strict';
// Textareas normalize CR and CRLF; retain positions in the immutable source.
globalThis.StartkompasSourceSelection={
 range(raw,display,start,end){
  if(typeof raw!=='string'||typeof display!=='string')throw Error('Source text unavailable.');
  let normalized='',positions=[0];for(let i=0;i<raw.length;i++){let ch=raw[i];if(ch==='\r'){ch='\n';if(raw[i+1]==='\n')i++;}normalized+=ch;positions.push(i+1);}
  if(display!==normalized||!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<=start||end>display.length)throw Error('Select a nonempty fragment in the original text.');
  const excerpt=raw.slice(positions[start],positions[end]);if(!excerpt.trim()||!excerpt.isWellFormed())throw Error('Select readable complete characters.');
  return {start:positions[start],end:positions[end],excerpt};
 }
};
