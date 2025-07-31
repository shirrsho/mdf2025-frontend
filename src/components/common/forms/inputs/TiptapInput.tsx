'use client';
import { useEffect } from 'react';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Heading, { Level } from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import FontSize from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import { FormItemProps } from 'antd';

import { axios, lorem } from '@/utils';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Image as ImageIcon,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Type,
  Zap,
} from 'lucide-react';

interface TiptapInputProps extends Omit<FormItemProps, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onFocus?: any;
  autoFocus?: boolean;
}

export const AppRichTextInput = ({
  value,
  onChange,
  placeholder,
  onFocus,
  autoFocus,
}: TiptapInputProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }),
      ListItem,
      BulletList,
      OrderedList,
      Image.configure({ allowBase64: true }),
      ImageResize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      FontSize.configure({}),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-w-full w-full',
        placeholder: placeholder || 'Enter you Text',
      },
    },
    autofocus: autoFocus ? 'end' : false,
    onBlur: (props) => {
      onChange && onChange(props?.editor?.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value?.length) {
      editor?.commands?.setContent(value ?? '');
    }
  }, [editor, value]);

  const addImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await axios.post('/image/v2/upload', formData);
          const imageUrl = `${process.env.NEXT_PUBLIC_BUCKET_URI}/${response.data}`;
          if (imageUrl) {
            editor?.chain().focus().setImage({ src: imageUrl }).run();
          }
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    };
  };

  const isActive = (format: any, options = {}) =>
    editor?.isActive(format, options) ? 'bg-blue-200' : '';

  const handleButtonClick = (callback: any) => {
    if (editor) {
      editor.chain().focus();
      callback();
    }
  };

  const headings: Level[] = [1, 2, 3];

  const MenuBar = () => (
    <div className='mb-4 flex space-x-2 overflow-x-auto rounded-md bg-background p-2 shadow-md'>
      <button
        className={`flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-200 ${isActive('bold')}`}
        onMouseDown={(e) => {
          e.preventDefault();
          handleButtonClick(() =>
            editor?.commands?.setContent(lorem.generateSentences(5))
          );
        }}
      >
        <Zap className='h-3 w-3 md:h-3.5 md:w-3.5' />
      </button>
      <button
        className={`flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-200 ${isActive('bold')}`}
        onMouseDown={(e) => {
          e.preventDefault();
          handleButtonClick(() => editor?.chain().toggleBold().run());
        }}
      >
        <BoldIcon className='h-3 w-3 md:h-3.5 md:w-3.5' />
      </button>
      <button
        className={`flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-200 ${isActive('italic')}`}
        onMouseDown={(e) => {
          e.preventDefault();
          handleButtonClick(() => editor?.chain().toggleItalic().run());
        }}
      >
        <ItalicIcon className='h-3 w-3 md:h-3.5 md:w-3.5' />
      </button>
      {headings.map((level) => (
        <button
          key={`heading-${level}`}
          className={`flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-200 ${isActive('heading', { level })}`}
          onMouseDown={(e) => {
            e.preventDefault();
            handleButtonClick(() =>
              editor?.chain().toggleHeading({ level }).run()
            );
          }}
        >
          <Type className='mr-1 h-3 w-3 md:h-3.5 md:w-3.5' /> H{level}
        </button>
      ))}
      <button
        className={`flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-200 ${isActive('bulletList')}`}
        onMouseDown={(e) => {
          e.preventDefault();
          handleButtonClick(() => editor?.chain().toggleBulletList().run());
        }}
      >
        <List className='h-3 w-3 md:h-3.5 md:w-3.5' />
      </button>
      <button
        className={`flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-200 ${isActive('orderedList')}`}
        onMouseDown={(e) => {
          e.preventDefault();
          handleButtonClick(() => editor?.chain().toggleOrderedList().run());
        }}
      >
        <ListOrdered className='h-3 w-3 md:h-3.5 md:w-3.5' />
      </button>
      <button
        className='flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-200'
        onMouseDown={(e) => {
          e.preventDefault();
          addImage();
        }}
      >
        <ImageIcon className='h-3 w-3 md:h-3.5 md:w-3.5' />
      </button>
      <button
        className={`flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-200 ${isActive('align', { alignment: 'left' })}`}
        onMouseDown={(e) => {
          e.preventDefault();
          handleButtonClick(() => editor?.chain().setTextAlign('left').run());
        }}
      >
        <AlignLeft className='h-3 w-3 md:h-3.5 md:w-3.5' />
      </button>
      <button
        className={`flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-200 ${isActive('align', { alignment: 'center' })}`}
        onMouseDown={(e) => {
          e.preventDefault();
          handleButtonClick(() => editor?.chain().setTextAlign('center').run());
        }}
      >
        <AlignCenter className='h-3 w-3 md:h-3.5 md:w-3.5' />
      </button>
      <button
        className={`flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-200 ${isActive('align', { alignment: 'right' })}`}
        onMouseDown={(e) => {
          e.preventDefault();
          handleButtonClick(() => editor?.chain().setTextAlign('right').run());
        }}
      >
        <AlignRight className='h-3 w-3 md:h-3.5 md:w-3.5' />
      </button>
    </div>
  );

  return (
    <div className='mx-auto rounded-md border border-gray-300 bg-white p-4 shadow-md'>
      <MenuBar />
      <EditorContent
        editor={editor}
        className='rounded-md border border-gray-200 p-4 focus:ring focus:ring-blue-500'
        onFocus={onFocus}
      />
    </div>
  );
};
