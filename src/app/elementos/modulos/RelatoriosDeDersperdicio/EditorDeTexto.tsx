"use client"

import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

export default function EditorDeTexto() {
  // valor - string html do editor
  const [valor, setValor] = useState('');
  // importação dinâmica do react-quill para evitar erro de 'document is not defined'
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false, }), []);

  useEffect(() => {
    console.log(valor);
  }, [valor])

  return <ReactQuill
    theme="snow"
    value={valor}
    onChange={setValor}
    placeholder='Escreva aqui...'
    modules={{
      toolbar: toolbarOptions
    }}
  />;
}
