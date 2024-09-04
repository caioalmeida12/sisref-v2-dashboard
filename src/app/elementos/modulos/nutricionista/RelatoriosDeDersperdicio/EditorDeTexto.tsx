'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

export default function EditorDeTexto({ setHtml }: { setHtml: React.Dispatch<React.SetStateAction<string>> }) {
  // importação dinâmica do react-quill para evitar erro de 'document is not defined'
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false, }), []);

  return <ReactQuill
    className='flex-grow'
    theme="snow"
    onChange={setHtml}
    placeholder='Escreva aqui...'
    modules={{
      toolbar: toolbarOptions
    }}
  />;
}