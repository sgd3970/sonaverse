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

const uploadImageToBlob = async (file: File, slug?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'editor'); // 에디터용 이미지로 구분
  
  if (slug) {
    // slug가 있으면 커스텀 파일명 사용
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const customFilename = `${slug}_content_${timestamp}`;
    formData.append('filename', customFilename);
  }

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || '이미지 업로드 실패');
  }
  
  const data = await res.json();
  return data.url as string;
};

const TiptapEditor: React.FC<TiptapEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = '본문을 입력하세요...', 
  className = '', 
  slug 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({ 
        inline: false, 
        allowBase64: false,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({ 
        types: ['heading', 'paragraph'] 
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[300px] p-4 focus:outline-none prose prose-lg max-w-none',
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
        try {
          // 로딩 상태 표시
          const loadingNode = editor.view.state.selection.$from;
          editor.chain().focus().insertContent('<p>이미지 업로드 중...</p>').run();
          
          const url = await uploadImageToBlob(input.files[0], slug);
          
          // 로딩 텍스트 제거하고 이미지 삽입
          editor.chain().focus().undo().run(); // 로딩 텍스트 제거
          editor.chain().focus().setImage({ src: url }).run();
          
        } catch (error) {
          console.error('이미지 업로드 오류:', error);
          editor.chain().focus().undo().run(); // 로딩 텍스트 제거
          alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
        }
      }
    };
    
    input.click();
  }, [editor, slug]);

  // 링크 추가 핸들러
  const handleAddLink = useCallback(() => {
    if (!editor) return;
    
    const url = prompt('링크 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  // 링크 제거 핸들러
  const handleRemoveLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        에디터 로딩 중...
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* 툴바 */}
      <div className="bg-gray-50 border-b p-3 flex flex-wrap gap-2">
        {/* 텍스트 서식 */}
        <div className="flex gap-1 border-r pr-2">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive('bold') 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100 border'
            }`} 
            title="굵게"
          >
            <strong>B</strong>
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            className={`px-3 py-1 rounded text-sm transition-colors ${
              editor.isActive('italic') 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100 border'
            }`} 
            title="기울임"
          >
            <em>I</em>
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            className={`px-3 py-1 rounded text-sm transition-colors ${
              editor.isActive('underline') 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100 border'
            }`} 
            title="밑줄"
          >
            <u>U</u>
          </button>
        </div>

        {/* 제목 */}
        <div className="flex gap-1 border-r pr-2">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            className={`px-3 py-1 rounded text-sm transition-colors ${
              editor.isActive('heading', { level: 2 }) 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100 border'
            }`} 
            title="제목 2"
          >
            H2
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            className={`px-3 py-1 rounded text-sm transition-colors ${
              editor.isActive('heading', { level: 3 }) 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100 border'
            }`} 
            title="제목 3"
          >
            H3
          </button>
        </div>

        {/* 리스트 */}
        <div className="flex gap-1 border-r pr-2">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            className={`px-3 py-1 rounded text-sm transition-colors ${
              editor.isActive('bulletList') 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100 border'
            }`} 
            title="불릿 리스트"
          >
            • 리스트
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            className={`px-3 py-1 rounded text-sm transition-colors ${
              editor.isActive('orderedList') 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100 border'
            }`} 
            title="번호 리스트"
          >
            1. 리스트
          </button>
        </div>

        {/* 정렬 */}
        <div className="flex gap-1 border-r pr-2">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().setTextAlign('left').run()} 
            className={`px-3 py-1 rounded text-sm transition-colors ${
              editor.isActive({ textAlign: 'left' }) 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100 border'
            }`}
            title="왼쪽 정렬"
          >
            ←
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().setTextAlign('center').run()} 
            className={`px-3 py-1 rounded text-sm transition-colors ${
              editor.isActive({ textAlign: 'center' }) 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100 border'
            }`}
            title="가운데 정렬"
          >
            ↔
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().setTextAlign('right').run()} 
            className={`px-3 py-1 rounded text-sm transition-colors ${
              editor.isActive({ textAlign: 'right' }) 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100 border'
            }`}
            title="오른쪽 정렬"
          >
            →
          </button>
        </div>

        {/* 링크 & 이미지 */}
        <div className="flex gap-1 border-r pr-2">
          <button 
            type="button" 
            onClick={handleAddLink} 
            className={`px-3 py-1 rounded text-sm transition-colors ${
              editor.isActive('link') 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100 border'
            }`}
            title="링크 추가"
          >
            🔗
          </button>
          {editor.isActive('link') && (
            <button 
              type="button" 
              onClick={handleRemoveLink} 
              className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
              title="링크 제거"
            >
              🚫
            </button>
          )}
          <button 
            type="button" 
            onClick={handleImageUpload} 
            className="px-3 py-1 rounded text-sm bg-white hover:bg-gray-100 border transition-colors"
            title="이미지 업로드"
          >
            🖼️
          </button>
        </div>

        {/* 실행 취소/다시 실행 */}
        <div className="flex gap-1">
          <button 
            type="button" 
            onClick={() => editor.chain().focus().undo().run()} 
            className="px-3 py-1 rounded text-sm bg-white hover:bg-gray-100 border transition-colors"
            title="실행 취소"
            disabled={!editor.can().undo()}
          >
            ↺
          </button>
          <button 
            type="button" 
            onClick={() => editor.chain().focus().redo().run()} 
            className="px-3 py-1 rounded text-sm bg-white hover:bg-gray-100 border transition-colors"
            title="다시 실행"
            disabled={!editor.can().redo()}
          >
            ↻
          </button>
        </div>
      </div>
      
      {/* 에디터 영역 */}
      <div className="min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor; 