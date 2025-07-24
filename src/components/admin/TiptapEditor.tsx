'use client';

import React, { useCallback } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  slug?: string; // 이미지 파일명 규칙 적용을 위해
}

const uploadImageToBlob = async (file: File, slug?: string, index?: number) => {
  const formData = new FormData();
  let filename = file.name;
  if (slug) {
    const ext = file.name.split('.').pop();
    filename = `${slug}_${index || Date.now()}.${ext}`;
  }
  formData.append('file', file, filename);
  const res = await fetch('/api/upload/blob', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('이미지 업로드 실패');
  const data = await res.json();
  return data.url as string;
};

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange, placeholder = '본문을 입력하세요...', className = '', slug }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[240px] p-4 focus:outline-none',
        placeholder,
      },
    },
    immediatelyRender: false,
  });

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const url = await uploadImageToBlob(input.files[0], slug);
        editor.chain().focus().setImage({ src: url }).run();
      }
    };
    input.click();
  }, [editor, slug]);

  if (!editor) return <div>에디터 로딩 중...</div>;

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* 툴바 */}
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-blue-200 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'} title="굵게"><strong>B</strong></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-blue-200 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'} title="기울임"><em>I</em></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-blue-200 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'} title="밑줄"><u>U</u></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-blue-200 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'} title="리스트">• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-blue-200 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'} title="제목">H2</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'bg-blue-200 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'}>좌</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'bg-blue-200 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'}>중</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'bg-blue-200 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'}>우</button>
        <button type="button" onClick={handleImageUpload} className="p-2 rounded hover:bg-gray-200" title="이미지 업로드">🖼️</button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-2 rounded hover:bg-gray-200" title="실행 취소">↺</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-2 rounded hover:bg-gray-200" title="다시 실행">↻</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor; 