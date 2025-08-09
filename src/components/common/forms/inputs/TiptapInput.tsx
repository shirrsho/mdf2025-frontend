'use client';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Heading, { Level } from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import FontSize from '@tiptap/extension-font-size';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Underline from '@tiptap/extension-underline';

import { axios, lorem } from '@/utils';
import { FormItemProps } from 'antd';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Type,
  Zap,
  Palette,
  Code,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaBold } from 'react-icons/fa';
import { FontSizeIcon } from '@radix-ui/react-icons';

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
  const [fontSize, setFontSizeState] = useState<number>(16);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      ListItem,
      BulletList,
      OrderedList,
      TextStyle,
      Color,
      FontSize.configure({
        types: ['textStyle'],
      }),
      Image.configure({ allowBase64: true }),
      ImageResize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
      CodeBlock.configure({
        languageClassPrefix: 'language',
        HTMLAttributes: {
          class:
            'prose prose-invert my-4 min-w-full max-w-full w-full overflow-auto font-CODE rounded-sm p-4',
          style:
            'background-color: #2a2a2a; border: 1px solid #4d4d4d; color: #D1D5DB;',
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-invert focus:outline-none min-w-full w-full h-[200px]',
        placeholder: placeholder || 'Enter your text',
      },
    },
    autofocus: autoFocus ? 'end' : false,
    onBlur: (props) => {
      setIsFocused(false);
      onChange && onChange(props?.editor?.getHTML());
    },
    onFocus: () => {
      setIsFocused(true);
    },
    onUpdate: ({ editor }) => {
      const marks = editor.getAttributes('textStyle');
      if (marks.fontSize) {
        const size = parseInt(marks.fontSize);
        if (!isNaN(size)) {
          setFontSizeState(size);
        }
      } else {
        setFontSizeState(16);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const marks = editor.getAttributes('textStyle');
      if (marks.fontSize) {
        const size = parseInt(marks.fontSize);
        if (!isNaN(size)) {
          setFontSizeState(size);
        }
      } else {
        setFontSizeState(16);
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value?.length) {
      editor?.commands?.setContent(value ?? '');
    }
  }, [editor, value]);

  const updateFontSize = (newSize: number) => {
    if (editor) {
      if (!editor.state.selection.empty) {
        setFontSizeState(newSize);
        editor
          .chain()
          .focus()
          .setMark('textStyle', { fontSize: `${newSize}px` })
          .run();
      } else {
        editor.chain().focus().run();
      }
    }
  };

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
    editor?.isActive(format, options) ? 'text-white' : '';

  const handleButtonClick = (callback: any) => {
    if (editor) {
      editor.chain().focus();
      callback();
    }
  };

  const setColor = (color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  };

  const colors = [
    '#F9FAFB',
    '#F4612E',
    '#bfab25',
    '#6a0136',
    '#395b50',
    '#1f2f16',
    '#ef4444',
  ];
  const headings: Level[] = [1, 2, 3];

  const MenuBar = () => (
    <div
      className='mb-2 flex w-full flex-wrap items-center gap-1 border-b p-3'
      style={{ borderColor: '#4d4d4d', backgroundColor: '#232323' }}
    >
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('textStyle')}`}
        style={{
          color: '#D1D5DB',
          backgroundColor: isFocused ? '#2a2a2a' : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = isFocused
            ? '#2a2a2a'
            : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          updateFontSize(Math.max(fontSize - 2, 8));
        }}
      >
        <FontSizeIcon className='h-3 w-3' />
      </button>
      <span style={{ color: '#D1D5DB' }}>{fontSize}</span>
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('textStyle')}`}
        style={{
          color: '#D1D5DB',
          backgroundColor: isFocused ? '#2a2a2a' : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = isFocused
            ? '#2a2a2a'
            : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          updateFontSize(Math.min(fontSize + 2, 96));
        }}
      >
        <FontSizeIcon className='h-5 w-5' />
      </button>
      <div className='h-6 w-px' style={{ backgroundColor: '#4d4d4d' }} />
      <div className='group relative'>
        <button
          disabled={!isFocused}
          className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50`}
          style={{
            color: '#D1D5DB',
            backgroundColor: isFocused ? '#2a2a2a' : '#232323',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#313131')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = isFocused
              ? '#2a2a2a'
              : '#232323')
          }
        >
          <Palette className='h-4 w-4' />
        </button>
        <div
          className='absolute top-0 z-10 hidden gap-1 rounded-lg p-2 shadow-lg group-hover:flex'
          style={{ backgroundColor: '#2a2a2a' }}
        >
          {colors.map((color) => (
            <button
              key={color}
              className='h-6 w-6 rounded-full'
              style={{ backgroundColor: color }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setColor(color);
              }}
            />
          ))}
        </div>
      </div>
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('bold')}`}
        style={{
          color: editor?.isActive('bold') ? '#F4612E' : '#D1D5DB',
          backgroundColor: editor?.isActive('bold')
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = editor?.isActive('bold')
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleButtonClick(() => editor?.chain().toggleBold().run());
        }}
      >
        <FaBold className='h-4 w-4' />
      </button>
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('italic')}`}
        style={{
          color: editor?.isActive('italic') ? '#F4612E' : '#D1D5DB',
          backgroundColor: editor?.isActive('italic')
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = editor?.isActive('italic')
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleButtonClick(() => editor?.chain().toggleItalic().run());
        }}
      >
        <ItalicIcon className='h-4 w-4' />
      </button>
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('underline')}`}
        style={{
          color: editor?.isActive('underline') ? '#F4612E' : '#D1D5DB',
          backgroundColor: editor?.isActive('underline')
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = editor?.isActive('underline')
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleButtonClick(() => editor?.chain().toggleUnderline().run());
        }}
      >
        <UnderlineIcon className='h-4 w-4' />
      </button>
      <div className='h-6 w-px' style={{ backgroundColor: '#4d4d4d' }} />
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('codeBlock')}`}
        style={{
          color: editor?.isActive('codeBlock') ? '#F4612E' : '#D1D5DB',
          backgroundColor: editor?.isActive('codeBlock')
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = editor?.isActive('codeBlock')
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleButtonClick(() => editor?.chain().toggleCodeBlock().run());
        }}
      >
        <Code className='h-4 w-4' />
      </button>
      <div className='h-6 w-px' style={{ backgroundColor: '#4d4d4d' }} />
      {headings.map((level) => (
        <button
          key={`heading-${level}`}
          disabled={!isFocused}
          className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('heading', { level })}`}
          style={{
            color: editor?.isActive('heading', { level })
              ? '#F4612E'
              : '#D1D5DB',
            backgroundColor: editor?.isActive('heading', { level })
              ? '#2a2a2a'
              : isFocused
                ? '#2a2a2a'
                : '#232323',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#313131')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = editor?.isActive(
              'heading',
              { level }
            )
              ? '#2a2a2a'
              : isFocused
                ? '#2a2a2a'
                : '#232323')
          }
          onMouseDown={(e) => {
            e.preventDefault();
            handleButtonClick(() =>
              editor?.chain().toggleHeading({ level }).run()
            );
          }}
        >
          <Type className='mr-0.5 h-4 w-4' /> {level}
        </button>
      ))}
      <div className='h-6 w-px' style={{ backgroundColor: '#4d4d4d' }} />
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('bulletList')}`}
        style={{
          color: editor?.isActive('bulletList') ? '#F4612E' : '#D1D5DB',
          backgroundColor: editor?.isActive('bulletList')
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = editor?.isActive(
            'bulletList'
          )
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleButtonClick(() => editor?.chain().toggleBulletList().run());
        }}
      >
        <List className='h-4 w-4' />
      </button>
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('orderedList')}`}
        style={{
          color: editor?.isActive('orderedList') ? '#F4612E' : '#D1D5DB',
          backgroundColor: editor?.isActive('orderedList')
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = editor?.isActive(
            'orderedList'
          )
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleButtonClick(() => editor?.chain().toggleOrderedList().run());
        }}
      >
        <ListOrdered className='h-4 w-4' />
      </button>
      <div className='h-6 w-px' style={{ backgroundColor: '#4d4d4d' }} />
      <button
        disabled={!isFocused}
        className='flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50'
        style={{
          color: '#D1D5DB',
          backgroundColor: isFocused ? '#2a2a2a' : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = isFocused
            ? '#2a2a2a'
            : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addImage();
        }}
      >
        <ImageIcon className='h-4 w-4' />
      </button>
      <div className='h-6 w-px' style={{ backgroundColor: '#4d4d4d' }} />
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('align', { alignment: 'left' })}`}
        style={{
          color: editor?.isActive({ textAlign: 'left' })
            ? '#F4612E'
            : '#D1D5DB',
          backgroundColor: editor?.isActive({ textAlign: 'left' })
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = editor?.isActive({
            textAlign: 'left',
          })
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleButtonClick(() => editor?.chain().setTextAlign('left').run());
        }}
      >
        <AlignLeft className='h-4 w-4' />
      </button>
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('align', { alignment: 'center' })}`}
        style={{
          color: editor?.isActive({ textAlign: 'center' })
            ? '#F4612E'
            : '#D1D5DB',
          backgroundColor: editor?.isActive({ textAlign: 'center' })
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = editor?.isActive({
            textAlign: 'center',
          })
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleButtonClick(() => editor?.chain().setTextAlign('center').run());
        }}
      >
        <AlignCenter className='h-4 w-4' />
      </button>
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('align', { alignment: 'right' })}`}
        style={{
          color: editor?.isActive({ textAlign: 'right' })
            ? '#F4612E'
            : '#D1D5DB',
          backgroundColor: editor?.isActive({ textAlign: 'right' })
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = editor?.isActive({
            textAlign: 'right',
          })
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleButtonClick(() => editor?.chain().setTextAlign('right').run());
        }}
      >
        <AlignRight className='h-4 w-4' />
      </button>
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${isActive('align', { alignment: 'justify' })}`}
        style={{
          color: editor?.isActive({ textAlign: 'justify' })
            ? '#F4612E'
            : '#D1D5DB',
          backgroundColor: editor?.isActive({ textAlign: 'justify' })
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = editor?.isActive({
            textAlign: 'justify',
          })
            ? '#2a2a2a'
            : isFocused
              ? '#2a2a2a'
              : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleButtonClick(() =>
            editor?.chain().setTextAlign('justify').run()
          );
        }}
      >
        <AlignJustify className='h-4 w-4' />
      </button>
      <div className='h-6 w-px' style={{ backgroundColor: '#4d4d4d' }} />
      <button
        disabled={!isFocused}
        className={`flex items-center justify-center rounded-lg p-2 transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50`}
        style={{
          color: '#D1D5DB',
          backgroundColor: isFocused ? '#2a2a2a' : '#232323',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#313131')}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = isFocused
            ? '#2a2a2a'
            : '#232323')
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleButtonClick(() =>
            editor?.commands?.setContent(lorem.generateSentences(5))
          );
        }}
      >
        <Zap className='h-4 w-4' />
      </button>
    </div>
  );

  return (
    <div
      className='overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md'
      style={{ borderColor: '#4d4d4d', backgroundColor: '#232323' }}
    >
      <MenuBar />
      <EditorContent
        editor={editor}
        className='p-4'
        onFocus={onFocus}
        style={{ color: '#D1D5DB' }}
      />
    </div>
  );
};
