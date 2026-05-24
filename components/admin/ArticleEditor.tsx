"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

const TOOLBAR_BUTTON =
  'rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50';

export default function ArticleEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm min-h-[200px] max-w-none rounded border border-slate-200 bg-white p-3 focus:border-slate-400 focus:outline-none',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="min-h-[200px] rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
        Loading editor…
      </div>
    );
  }

  const addLink = () => {
    const url = prompt('Link URL:');
    if (!url) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={TOOLBAR_BUTTON}
          aria-pressed={editor.isActive('bold')}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={TOOLBAR_BUTTON}
          aria-pressed={editor.isActive('italic')}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={TOOLBAR_BUTTON}
          aria-pressed={editor.isActive('heading', { level: 2 })}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={TOOLBAR_BUTTON}
          aria-pressed={editor.isActive('bulletList')}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={TOOLBAR_BUTTON}
          aria-pressed={editor.isActive('orderedList')}
        >
          1. List
        </button>
        <button type="button" onClick={addLink} className={TOOLBAR_BUTTON}>
          Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className={TOOLBAR_BUTTON}
        >
          Clear
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
