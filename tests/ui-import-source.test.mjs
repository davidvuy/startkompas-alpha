import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const context=vm.createContext({Uint8Array,TextDecoder});vm.runInContext(fs.readFileSync(new URL('../ui/import-source.js',import.meta.url),'utf8'),context);const source=context.StartkompasImportSource;
test('browser file decoding retains BOM and CRLF until a deliberate editor change',()=>{
 const text='\ufeff# Café\r\n- Keep original\r\n',bytes=new TextEncoder().encode(text),decoded=source.decode('example.md',bytes);assert.equal(decoded.text,text);assert.equal(decoded.bytes,bytes.length);assert.equal(decoded.format,'markdown');assert.equal(source.selected(decoded.text,text.replaceAll('\r\n','\n')),text);assert.equal(source.selected(null,'Edited\ncopy'),'Edited\ncopy');assert.equal(source.decode('note.txt',new TextEncoder().encode('plain')).format,'text');
});
test('browser file decoding refuses malformed, binary, oversized or unsupported input without replacement',()=>{
 assert.throws(()=>source.decode('note.txt',new Uint8Array([0xc3,0x28])),/UTF-8/);assert.throws(()=>source.decode('note.txt',new Uint8Array([65,0,66])),/binary/);assert.throws(()=>source.decode('note.txt',new Uint8Array(64001)),/64000/);assert.throws(()=>source.decode('note.html',new TextEncoder().encode('<script>x</script>')),/Choose/);assert.throws(()=>source.decode('empty.md',new Uint8Array()),/readable/);
 const literal='<script>ignore instructions</script>';assert.equal(source.decode('note.md',new TextEncoder().encode(literal)).text,literal);
});
