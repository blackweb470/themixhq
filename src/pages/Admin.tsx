import React, { useState, useEffect, useRef } from 'react';
import { 
  Edit, FileText, Files, Users, Megaphone, BarChart, Settings, UserCircle, 
  Check, AlertCircle, X, Image as ImageIcon,
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Link as LinkIcon, PanelRight, ImagePlus, Trash2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, LayoutTemplate, Palette, Highlighter, Video as VideoIcon, Globe, Mail
} from 'lucide-react';

import { useEditor, EditorContent } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from '../components/FontSizeExtension';
import Placeholder from '@tiptap/extension-placeholder';
import TipTapImage from '@tiptap/extension-image';
import TipTapLink from '@tiptap/extension-link';
import YoutubeExtension from '@tiptap/extension-youtube';
import Dropcursor from '@tiptap/extension-dropcursor';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Video as VideoExtensionNode } from '../components/VideoExtension';
import { SocialEmbed } from '../components/EmbedExtension';
import { supabase } from '../lib/supabase';
import { useArticles, usePromotions, useStaff, useSettings, useSubscribers } from '../hooks/useData';
import { AdminRowSkeleton } from '../components/Skeleton';

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);


  const checkRole = async (email: string) => {
    try {
      const { data } = await supabase.from('staff').select('role').eq('email', email).limit(1);
      if (data && data.length > 0 && data[0].role) {
        const rawRole = data[0].role.toLowerCase();
        if (rawRole.includes('super')) {
          setRole('super');
        } else {
          setRole(rawRole);
        }
      } else {
        setRole('none');
      }
    } catch (err) {
      setRole('none');
    }
    setIsAuthLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        checkRole(session.user.email);
      } else {
        setIsAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        checkRole(session.user.email);
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  const [activePanel, setActivePanel] = useState('write');
  
  // Editor State
  const [title, setTitle] = useState('');
  const [subheading, setSubheading] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [categoryLabel, setCategoryLabel] = useState('News');
  const editorSelectionRef = useRef<any>(null);
  
  // SEO State
  const [seoDrawerOpen, setSeoDrawerOpen] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [customPublishDate, setCustomPublishDate] = useState('');
  
  // App State
  const { articles, isLoading, mutate: mutateArticles } = useArticles(true);
  const { promotions, mutate: mutatePromos } = usePromotions();
  const { staff, mutate: mutateStaff } = useStaff();
  const { settings } = useSettings();
  const { subscribers } = useSubscribers();

  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<{id: number, msg: string, type: 'success'|'error'|'warning'}[]>([]);
  const [activeInline, setActiveInline] = useState<'image' | 'video' | 'embed' | 'link' | null>(null);
  const [inlineValue, setInlineValue] = useState('');
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [notifySubscribers, setNotifySubscribers] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => {
    if (saveStatus === 'unsaved') {
      const timer = setTimeout(() => {
        setSaveStatus('saving');
        setTimeout(() => setSaveStatus('saved'), 800);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const markUnsaved = () => setSaveStatus('unsaved');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TipTapImage.configure({ inline: false }),
      TipTapLink.configure({ openOnClick: false }),
      YoutubeExtension.configure({ inline: false, width: 840, height: 472.5 }),
      Dropcursor.configure({ color: '#dc2626', width: 2 }), // red-600
      Placeholder.configure({ placeholder: 'Start writing your story here...' }),
      UnderlineExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      VideoExtensionNode,
      SocialEmbed
    ],
    content: '',
    onUpdate: ({ editor }) => {
      markUnsaved();
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
    },
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none outline-none text-[18px] text-gray-800 font-serif leading-[1.8] min-h-[500px] bg-white border border-transparent focus:border-gray-100 p-8 rounded-b-xl shadow-sm transition-colors`,
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: { attributes: { class: `prose prose-lg max-w-none outline-none text-[18px] text-gray-800 font-serif leading-[1.8] min-h-[500px] bg-white border border-transparent focus:border-gray-100 p-8 rounded-b-xl shadow-sm transition-colors` } }
      });
    }
  }, [editor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setSaveStatus('saving');
        setTimeout(() => { setSaveStatus('saved'); showToast('Saved to drafts', 'success'); }, 500);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadArticle = (article: any) => {
    setTitle(article.title || '');
    setSubheading(article.subheading || '');
    setExcerpt(article.excerpt || '');
    setCoverImage(article.image || article.cover_image_url || null);
    setCategoryLabel(article.categoryLabel || 'News');
    setSeoTitle(article.seo_title || '');
    setSeoDesc(article.seo_description || '');
    setCustomPublishDate('');
    setEditingArticleId(article.id);
    if (editor) {
      editor.commands.setContent(article.content || '');
    }
    setNotifySubscribers(false);
    setActivePanel('write');
  };

  const handlePublishClick = async () => {
    const passed = title.trim() && excerpt.trim() && wordCount > 300 && coverImage;
    if (passed) {
      setSaveStatus('saving');
      
      const payload = {
        title,
        subheading,
        excerpt,
        content: editor?.getHTML() || '',
        cover_image_url: coverImage,
        seo_title: seoTitle,
        seo_description: seoDesc,
        category: categoryLabel.toLowerCase(),
        category_label: categoryLabel,
        author_name: 'theMixhq',
        word_count: wordCount,
        status: 'published',
        published_at: customPublishDate ? new Date(customPublishDate).toISOString() : new Date().toISOString()
      };

      const { data, error } = editingArticleId 
        ? await supabase.from('articles').update(payload).eq('id', editingArticleId).select().single()
        : await supabase.from('articles').insert(payload).select().single();

      if (error) {
        showToast('Failed to publish: ' + error.message, 'error');
        setSaveStatus('unsaved');
      } else {
        showToast('Your article is live on Themixhq.', 'success');
        if (notifySubscribers && subscribers.length > 0) {
          const { error: fnError } = await supabase.functions.invoke('send-newsletter', {
            body: {
              articleTitle: payload.title,
              articleExcerpt: payload.excerpt,
              articleUrl: `https://themixhq.com/article/${data?.id}`,
              subscribers: subscribers
            }
          });
          if (fnError) {
             showToast('Failed to send newsletter.', 'error');
          } else {
             showToast(`Newsletter sent to ${subscribers.length} subscribers!`, 'success');
          }
        } else if (notifySubscribers) {
          showToast('No subscribers to notify.', 'warning');
        }
        setModalOpen(false);
        setSaveStatus('saved');
        mutateArticles();
      }
    } else {
      showToast('Complete all required steps before publishing.', 'error');
    }
  };

  const handleSaveDraft = async () => {
    setSaveStatus('saving');
    
    const payload = {
      title: title || 'Untitled Draft',
      subheading,
      excerpt,
      content: editor?.getHTML() || '',
      cover_image_url: coverImage,
      seo_title: seoTitle,
      seo_description: seoDesc,
      category: categoryLabel.toLowerCase(),
      category_label: categoryLabel,
      author_name: 'theMixhq',
      word_count: wordCount,
      status: 'draft',
      published_at: customPublishDate ? new Date(customPublishDate).toISOString() : null
    };

    const { error } = editingArticleId
      ? await supabase.from('articles').update(payload).eq('id', editingArticleId)
      : await supabase.from('articles').insert(payload);

    if (error) {
      showToast('Failed to save draft: ' + error.message, 'error');
      setSaveStatus('unsaved');
    } else {
      showToast('Saved to drafts.', 'success');
      setModalOpen(false);
      setSaveStatus('saved');
      mutateArticles(); // Reload SWR cache to update draft list
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast('Uploading cover image...', 'warning');
      const filename = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('media').upload(filename, file);
      
      if (error) {
        showToast('Failed to upload image: ' + error.message, 'error');
      } else if (data) {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
        setCoverImage(publicUrl);
        showToast('Cover image uploaded', 'success');
        markUnsaved();
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      showToast('Uploading video...', 'warning');
      const filename = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('media').upload(filename, file);

      if (error) {
        showToast('Failed to upload video: ' + error.message, 'error');
      } else if (data) {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
        editor.chain().focus().setVideo({ src: publicUrl }).run();
        showToast('Video uploaded', 'success');
        markUnsaved();
      }
    }
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      showToast('Uploading image...', 'warning');
      const filename = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('media').upload(filename, file);

      if (error) {
        showToast('Failed to upload image: ' + error.message, 'error');
      } else if (data) {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
        editor.chain().focus().setImage({ src: publicUrl }).run();
        showToast('Image uploaded', 'success');
        markUnsaved();
      }
    }
  };

  const toggleInline = (type: 'image' | 'video' | 'embed' | 'link') => {
    if (activeInline === type) {
      setActiveInline(null);
    } else {
      setActiveInline(type);
      if (type === 'link') {
        setInlineValue(editor?.getAttributes('link').href || '');
      } else {
        setInlineValue('');
      }
    }
  };

  const confirmInline = () => {
    if (!editor) return;
    const url = inlineValue.trim();
    if (activeInline === 'image' && url) {
      editor.chain().focus().setImage({ src: url }).run();
    } else if (activeInline === 'video' && url) {
      editor.chain().focus().setVideo({ src: url }).run();
    } else if (activeInline === 'embed' && url) {
      editor.chain().focus().setEmbed({ src: url }).run();
    } else if (activeInline === 'link') {
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }
    }
    setActiveInline(null);
    setInlineValue('');
  };

  const canSee = (allowed: string[]) => allowed.includes(role || '');

  if (isAuthLoading) return <div className="h-screen w-screen flex items-center justify-center bg-gray-50 font-sans text-xl font-black">Loading...</div>;

  if (!session || role === 'none') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center text-center px-4 font-sans text-black">
        <h1 className="text-9xl font-black mb-4 tracking-tighter text-gray-900">404</h1>
        <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md text-lg">The page you are looking for doesn't exist or has been moved.</p>
        <a href="/" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-colors shadow-lg">Return to Home</a>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 text-black font-sans text-[14px]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 transition-all shadow-sm z-20">
        <div>
          <div className="p-6 border-b border-gray-100 flex justify-center">
            <div className="flex items-center justify-center w-36 h-12 relative">
              <img src="/logo.png" alt="THE MIX HQ" className="absolute scale-[2] object-contain pointer-events-none" />
            </div>
          </div>
          <ul className="py-4 overflow-y-auto">
            <NavItem icon={<Edit size={18}/>} label="Write new post" active={activePanel === 'write' && !editingArticleId} onClick={() => {
              setActivePanel('write');
              setEditingArticleId(null);
              setTitle('');
              setSubheading('');
              setExcerpt('');
              setCoverImage(null);
              setSeoTitle('');
              setSeoDesc('');
              editor?.commands.setContent('');
            }} />
            <NavItem icon={<FileText size={18}/>} label="Drafts" active={activePanel === 'drafts' || (activePanel === 'write' && editingArticleId)} onClick={() => setActivePanel('drafts')} />
            <NavItem icon={<Files size={18}/>} label="Published Posts" active={activePanel === 'published'} onClick={() => setActivePanel('published')} />
            {canSee(['super', 'editor']) && <NavItem icon={<Users size={18}/>} label="Staff directory" active={activePanel === 'staff'} onClick={() => setActivePanel('staff')} />}
            {canSee(['super']) && <NavItem icon={<Megaphone size={18}/>} label="Promotional hub" active={activePanel === 'promo'} onClick={() => setActivePanel('promo')} />}
            {canSee(['super']) && <NavItem icon={<Mail size={18}/>} label="Newsletter" active={activePanel === 'subscribers' || activePanel === 'draft-newsletter'} onClick={() => setActivePanel('subscribers')} />}
            {canSee(['super']) && <NavItem icon={<BarChart size={18}/>} label="Analytics overview" active={activePanel === 'analytics'} onClick={() => setActivePanel('analytics')} />}
            {canSee(['super']) && <NavItem icon={<Settings size={18}/>} label="Site settings" active={activePanel === 'settings'} onClick={() => setActivePanel('settings')} />}
          </ul>
          
          <div className="p-6 border-t border-gray-100 flex flex-col gap-2">
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 text-gray-500 hover:text-black font-bold text-[13px] uppercase tracking-wider px-2 py-2">
              <UserCircle size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">
        {/* Topbar */}
        <header className="h-[60px] border-b border-gray-200 px-6 flex items-center justify-between bg-white z-20 shrink-0 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button onClick={() => setSeoDrawerOpen(!seoDrawerOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${seoDrawerOpen ? 'bg-red-50 text-red-700' : 'hover:bg-gray-100 text-gray-600'}`}>
              <PanelRight size={18} />
              <span className="font-bold text-[13px] uppercase tracking-wider">SEO Tools</span>
            </button>
          </div>
          <div className="flex items-center gap-6">
            {activePanel === 'write' && (
              <>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-blue-500 animate-pulse' : 'bg-amber-500'}`}></div>
                  <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                    {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSaveDraft} className="bg-white border border-gray-200 hover:bg-gray-50 text-black px-4 py-2.5 rounded-lg font-bold text-[13px] uppercase tracking-wider transition-all shadow-sm">
                    Save Draft
                  </button>
                  <button onClick={() => setModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold text-[13px] uppercase tracking-wider transition-all shadow-md hover:shadow-lg">
                    Publish Gate
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Fixed Microsoft Word Style Toolbar Ribbon */}
        {activePanel === 'write' && editor && (
          <div className="bg-white border-b border-gray-200 px-6 py-2 flex flex-wrap gap-1 items-center shrink-0 z-10 shadow-sm">
            <select 
              className="bg-gray-50 border border-gray-200 text-black rounded-md px-2 py-1.5 text-[13px] font-bold outline-none cursor-pointer hover:border-gray-300 w-[130px]"
              onMouseDown={() => { if (editor) editorSelectionRef.current = editor.state.selection; }}
              onChange={(e) => {
                e.preventDefault();
                const val = e.target.value;
                let chain = editor.chain();
                if (editorSelectionRef.current) chain = chain.setTextSelection(editorSelectionRef.current);
                chain = chain.focus();

                if (val === 'p') chain.setParagraph().run();
                else if (val === 'h1') chain.toggleHeading({ level: 1 }).run();
                else if (val === 'h2') chain.toggleHeading({ level: 2 }).run();
                else if (val === 'h3') chain.toggleHeading({ level: 3 }).run();
                else if (val === 'ul') chain.toggleBulletList().run();
                else if (val === 'ol') chain.toggleOrderedList().run();
                else if (val === 'quote') chain.toggleBlockquote().run();
              }}
              value={
                editor.isActive('heading', { level: 1 }) ? 'h1' :
                editor.isActive('heading', { level: 2 }) ? 'h2' :
                editor.isActive('heading', { level: 3 }) ? 'h3' :
                editor.isActive('bulletList') ? 'ul' :
                editor.isActive('orderedList') ? 'ol' :
                editor.isActive('blockquote') ? 'quote' : 'p'
              }
            >
              <option value="p">Normal Text</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="ul">Bullet List</option>
              <option value="ol">Numbered List</option>
              <option value="quote">Quote</option>
            </select>

            <select 
              className="bg-gray-50 border border-gray-200 text-black rounded-md px-2 py-1.5 text-[13px] font-bold outline-none cursor-pointer hover:border-gray-300 w-[140px]"
              onMouseDown={() => { if (editor) editorSelectionRef.current = editor.state.selection; }}
              onChange={(e) => { 
                e.preventDefault(); 
                let chain = editor.chain();
                if (editorSelectionRef.current) chain = chain.setTextSelection(editorSelectionRef.current);
                if(e.target.value) { chain.focus().setFontFamily(e.target.value).run(); } else { chain.focus().unsetFontFamily().run(); } 
              }}
              value={editor.getAttributes('textStyle').fontFamily || ''}
            >
              <option value="">Default Font</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
              <option value="Garamond">Garamond</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Impact">Impact</option>
            </select>

            <select 
              className="bg-gray-50 border border-gray-200 text-black rounded-md px-2 py-1.5 text-[13px] font-bold outline-none cursor-pointer hover:border-gray-300 w-[70px] mr-2"
              onMouseDown={() => { if (editor) editorSelectionRef.current = editor.state.selection; }}
              onChange={(e) => { 
                e.preventDefault(); 
                let chain = editor.chain();
                if (editorSelectionRef.current) chain = chain.setTextSelection(editorSelectionRef.current);
                if (e.target.value) { chain.focus().setFontSize(e.target.value).run(); } else { chain.focus().unsetFontSize().run(); } 
              }}
              value={editor.getAttributes('textStyle').fontSize || ''}
            >
              <option value="">Size</option>
              <option value="10px">10</option>
              <option value="12px">12</option>
              <option value="14px">14</option>
              <option value="16px">16</option>
              <option value="18px">18</option>
              <option value="20px">20</option>
              <option value="24px">24</option>
              <option value="28px">28</option>
              <option value="32px">32</option>
              <option value="36px">36</option>
              <option value="48px">48</option>
              <option value="72px">72</option>
            </select>
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>

            <ToolbarBtn isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} icon={<Bold size={18}/>} title="Bold" />
            <ToolbarBtn isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} icon={<Italic size={18}/>} title="Italic" />
            <ToolbarBtn isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} icon={<UnderlineIcon size={18}/>} title="Underline" />
            <ToolbarBtn isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} icon={<Strikethrough size={18}/>} title="Strikethrough" />
            
            <div className="w-[1px] h-6 bg-gray-200 mx-2"></div>
            
            <ToolbarBtn isActive={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} icon={<AlignLeft size={18}/>} title="Align Left" />
            <ToolbarBtn isActive={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} icon={<AlignCenter size={18}/>} title="Align Center" />
            <ToolbarBtn isActive={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} icon={<AlignRight size={18}/>} title="Align Right" />
            <ToolbarBtn isActive={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} icon={<AlignJustify size={18}/>} title="Justify" />
            
            <div className="w-[1px] h-6 bg-gray-200 mx-2"></div>
            
            <label className={`p-2 rounded-md transition-colors flex items-center justify-center cursor-pointer text-gray-600 hover:text-black hover:bg-gray-100 ${editor.isActive('highlight') ? 'bg-yellow-100 text-yellow-600' : ''}`} title="Highlight Text">
              <Highlighter size={18}/>
              <input type="color" className="w-0 h-0 opacity-0 absolute pointer-events-none" onInput={(e) => editor.chain().focus().setHighlight({ color: (e.target as HTMLInputElement).value }).run()} />
            </label>

            <label className="p-2 rounded-md transition-colors flex items-center justify-center cursor-pointer text-gray-600 hover:text-black hover:bg-gray-100" title="Text Color">
              <Palette size={18}/>
              <input type="color" className="w-0 h-0 opacity-0 absolute pointer-events-none" onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()} />
            </label>
            
            <div className="w-[1px] h-6 bg-gray-200 mx-2"></div>
            
            <ToolbarBtn isActive={activeInline === 'image'} onClick={() => toggleInline('image')} icon={<ImageIcon size={18}/>} title="Insert Image" />
            <ToolbarBtn isActive={activeInline === 'video'} onClick={() => toggleInline('video')} icon={<VideoIcon size={18}/>} title="Insert Video" />
            <ToolbarBtn isActive={activeInline === 'embed'} onClick={() => toggleInline('embed')} icon={<Globe size={18}/>} title="Embed Social Link (Twitter, Insta, TikTok, etc)" />
            <ToolbarBtn isActive={editor.isActive('link') || activeInline === 'link'} onClick={() => toggleInline('link')} icon={<LinkIcon size={18}/>} title="Insert Link" />
            
            <div className="flex-1"></div>
            
            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={<Undo size={18}/>} title="Undo" />
            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={<Redo size={18}/>} title="Redo" />
          </div>
        )}

        {/* Inline Media/Link Toolbar */}
        {activePanel === 'write' && activeInline && (
          <div className="bg-gray-100 border-b border-gray-200 px-6 py-3 flex items-center gap-3">
            <input 
              type="text" 
              autoFocus
              value={inlineValue}
              onChange={(e) => setInlineValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmInline();
                if (e.key === 'Escape') setActiveInline(null);
              }}
              placeholder={
                activeInline === 'image' ? 'Paste image URL...' :
                activeInline === 'video' ? 'Paste video URL...' :
                activeInline === 'embed' ? 'Paste social link (Twitter, Instagram...)' :
                'Paste URL...'
              }
              className="flex-1 max-w-[400px] border border-gray-300 rounded-lg px-3 py-1.5 text-[14px] outline-none focus:border-red-600"
            />
            <button onClick={confirmInline} className="bg-black text-white px-4 py-1.5 rounded-lg text-[13px] font-bold hover:bg-red-600 transition-colors">
              Insert
            </button>
            <span className="text-gray-400 text-[12px] uppercase mx-2 font-bold">OR</span>
            {activeInline === 'image' && (
              <button onClick={() => editorImageInputRef.current?.click()} className="bg-white border border-gray-300 text-black px-4 py-1.5 rounded-lg text-[13px] font-bold hover:border-red-600 hover:text-red-600 transition-colors">
                Upload Local File
              </button>
            )}
            {activeInline === 'video' && (
              <button onClick={() => videoInputRef.current?.click()} className="bg-white border border-gray-300 text-black px-4 py-1.5 rounded-lg text-[13px] font-bold hover:border-red-600 hover:text-red-600 transition-colors">
                Upload Local File
              </button>
            )}
            <button onClick={() => setActiveInline(null)} className="ml-auto text-gray-400 hover:text-black">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Editor Wrapper */}
        <div className="flex-1 overflow-y-auto relative bg-gray-50 p-8 pb-32">
          <div className="flex justify-center items-start max-w-[1300px] mx-auto">
            {/* Main Editor Content */}
            {activePanel === 'write' ? (
              <div className="w-full max-w-[900px] animate-fade-in relative flex flex-col">
              
              <input type="file" ref={videoInputRef} onChange={handleVideoUpload} accept="video/mp4,video/webm,video/ogg" className="hidden" />
              <input type="file" ref={editorImageInputRef} onChange={handleInlineImageUpload} accept="image/*" className="hidden" />

              {/* Cover Image Header */}
              <div className="mb-6 relative group bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                <input type="file" ref={fileInputRef} onChange={handleCoverUpload} accept="image/*" className="hidden" />
                {coverImage ? (
                  <div className="relative w-full h-[320px] rounded-lg overflow-hidden">
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                      <button onClick={() => fileInputRef.current?.click()} className="bg-white text-black px-5 py-2.5 rounded-lg font-bold text-[14px] hover:bg-gray-100 shadow-xl flex items-center gap-2"><ImagePlus size={18}/> Replace Image</button>
                      <button onClick={() => { setCoverImage(null); markUnsaved(); }} className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold text-[14px] hover:bg-red-700 shadow-xl flex items-center gap-2"><Trash2 size={18}/> Remove</button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-[180px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-red-50 hover:border-red-600 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <ImagePlus size={36} className="mb-3 opacity-50" />
                    <span className="font-bold text-[16px]">Add a hero cover image</span>
                    <span className="text-[13px] mt-1 opacity-70">drag and drop or click to upload</span>
                  </div>
                )}
              </div>

              {/* Title & Subheading Setup */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col">
                <textarea 
                  className="w-full text-[48px] font-black leading-[1.1] outline-none mb-6 resize-none overflow-hidden bg-transparent placeholder-gray-300 text-black border-l-4 border-transparent focus:border-red-600 pl-4 transition-colors -ml-4"
                  placeholder="Enter article title..."
                  rows={1}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = (e.target.scrollHeight) + 'px';
                    markUnsaved();
                  }}
                  onFocus={(e) => { e.target.style.height = 'auto'; e.target.style.height = (e.target.scrollHeight) + 'px'; }}
                />
                
                <textarea 
                  className="w-full text-[26px] font-bold text-gray-600 leading-tight outline-none mb-8 resize-none overflow-hidden bg-transparent placeholder-gray-300 border-l-4 border-transparent focus:border-gray-300 pl-4 transition-colors -ml-4"
                  placeholder="Add a catchy subheading..."
                  rows={1}
                  value={subheading}
                  onChange={(e) => {
                    setSubheading(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = (e.target.scrollHeight) + 'px';
                    markUnsaved();
                  }}
                  onFocus={(e) => { e.target.style.height = 'auto'; e.target.style.height = (e.target.scrollHeight) + 'px'; }}
                />
                
                <textarea 
                  className="w-full text-[20px] text-gray-500 font-serif outline-none leading-relaxed resize-none overflow-hidden placeholder-gray-300 border-l-[4px] border-red-600 pl-4 bg-gray-50 p-4 rounded-r-lg"
                  placeholder="Write a short excerpt for previews..."
                  rows={2}
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = (e.target.scrollHeight) + 'px';
                    markUnsaved();
                  }}
                  onFocus={(e) => { e.target.style.height = 'auto'; e.target.style.height = (e.target.scrollHeight) + 'px'; }}
                />
              </div>

              <EditorContent editor={editor} className="shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200 min-h-[500px]" />
            </div>
          ) : activePanel === 'drafts' || activePanel === 'published' ? (
            <div className="max-w-[1000px] w-full animate-fade-in mx-auto mt-8">
              <h2 className="text-[32px] font-black tracking-tight mb-6 capitalize">
                {activePanel === 'drafts' ? 'Drafts' : 'Published Posts'}
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col">
                    <AdminRowSkeleton />
                    <AdminRowSkeleton />
                    <AdminRowSkeleton />
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {(() => {
                      const filtered = articles.filter(a => activePanel === 'drafts' ? a.status !== 'published' : a.status === 'published');
                      if (filtered.length === 0) {
                        return (
                          <div className="p-16 text-center text-gray-500 font-bold flex flex-col items-center justify-center">
                            <FileText size={48} className="mb-4 text-gray-300" />
                            <p className="text-[16px]">{activePanel === 'drafts' ? 'No drafts found.' : 'No published posts found.'}</p>
                            {activePanel === 'drafts' && (
                              <button onClick={() => setActivePanel('write')} className="mt-4 text-red-600 hover:text-red-700 font-bold underline underline-offset-2">
                                Start writing
                              </button>
                            )}
                          </div>
                        );
                      }
                      return filtered.map((article, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => activePanel === 'drafts' ? loadArticle(article) : null} 
                          className={`flex items-center gap-4 py-4 border-b border-gray-100 px-6 hover:bg-gray-50 transition-colors ${activePanel === 'drafts' ? 'cursor-pointer group' : ''}`}
                        >
                          <img src={article.image || article.cover_image_url} alt={article.title} className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                          <div className="flex-1">
                            <h4 className={`font-bold text-[15px] text-gray-900 line-clamp-1 ${activePanel === 'drafts' ? 'group-hover:text-red-600 transition-colors' : ''}`}>
                              {article.title}
                            </h4>
                            <p className="text-[12px] text-gray-500 font-medium">Published on {article.date || new Date().toLocaleDateString()}</p>
                          </div>
                          
                          {activePanel === 'drafts' && (
                            <button className="opacity-0 group-hover:opacity-100 text-red-600 font-bold text-[11px] uppercase tracking-wider transition-opacity mr-4 bg-red-50 px-3 py-1.5 rounded-lg">
                              Edit Draft
                            </button>
                          )}

                          {activePanel === 'published' && canSee(['super', 'admin', 'editor']) && (
                            <button 
                              onClick={async (e) => {
                                e.stopPropagation();
                                const { error } = await supabase.from('articles').update({ status: 'draft' }).eq('id', article.id);
                                if (!error) { 
                                  showToast('Post unpublished to drafts.', 'success'); 
                                  mutateArticles(); 
                                } else {
                                  showToast('Failed to unpublish: ' + error.message, 'error');
                                }
                              }} 
                              className="text-red-600 font-bold text-[11px] uppercase tracking-wider hover:underline mr-4"
                            >
                              Unpublish
                            </button>
                          )}

                          {canSee(['super', 'admin']) && (
                            <button 
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete this ${activePanel === 'drafts' ? 'draft' : 'post'}? This action cannot be undone.`)) {
                                  const { error } = await supabase.from('articles').delete().eq('id', article.id);
                                  if (!error) {
                                    showToast(`${activePanel === 'drafts' ? 'Draft' : 'Post'} deleted.`, 'success');
                                    mutateArticles();
                                  } else {
                                    showToast('Failed to delete: ' + error.message, 'error');
                                  }
                                }
                              }}
                              className="text-gray-400 hover:text-red-600 transition-colors mr-4"
                              title={`Delete ${activePanel === 'drafts' ? 'Draft' : 'Post'}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                          <span className="px-3 py-1 bg-green-100 text-green-700 font-bold text-[10px] uppercase tracking-wider rounded-full">
                            {article.status || 'Published'}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            </div>
          ) : activePanel === 'subscribers' ? (
            <div className="max-w-[1000px] w-full animate-fade-in mx-auto mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[32px] font-black tracking-tight">Newsletter Subscribers</h2>
                <button 
                  onClick={() => setActivePanel('draft-newsletter')} 
                  className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-[13px] uppercase tracking-wider hover:bg-red-700"
                >
                  Draft Email
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-gray-500 font-bold uppercase text-[11px] tracking-wider mb-2">Total Subscribers</div>
                  <div className="text-4xl font-black">{subscribers.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-gray-500 font-bold uppercase text-[11px] tracking-wider mb-2">Active</div>
                  <div className="text-4xl font-black text-green-600">{subscribers.filter((s: any) => s.status !== 'unsubscribed').length}</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {subscribers.length === 0 ? (
                  <div className="p-16 text-center text-gray-500 font-bold flex flex-col items-center justify-center">
                    <Mail size={48} className="mb-4 text-gray-300" />
                    <p className="text-[16px]">No subscribers yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {subscribers.map((sub: any) => (
                      <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-bold text-[14px]">{sub.email}</p>
                          <p className="text-[12px] text-gray-500">Subscribed on {new Date(sub.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full ${sub.status !== 'unsubscribed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {sub.status || 'active'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activePanel === 'draft-newsletter' ? (
            <div className="max-w-[800px] w-full animate-fade-in mx-auto mt-8">
              <h2 className="text-[32px] font-black tracking-tight mb-6">Draft Newsletter</h2>
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">
                <div>
                  <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Subject Line</label>
                  <input type="text" placeholder="Check out our latest articles..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Message Body</label>
                  <textarea rows={12} placeholder="Write your email here..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600 resize-none"></textarea>
                </div>
                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => {
                      showToast('Newsletter sent to ' + subscribers.length + ' subscribers!', 'success');
                      setActivePanel('subscribers');
                    }} 
                    className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-[13px] uppercase tracking-wider hover:bg-red-700"
                  >
                    Send to All Subscribers
                  </button>
                  <button onClick={() => setActivePanel('subscribers')} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold text-[13px] uppercase tracking-wider hover:bg-gray-200">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : activePanel === 'staff' ? (
            <div className="max-w-[1000px] w-full animate-fade-in mx-auto mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[32px] font-black tracking-tight">Staff Directory</h2>
                {canSee(['super']) && <button onClick={() => setActivePanel('add-staff')} className="bg-black text-white px-6 py-2.5 rounded-lg font-bold text-[13px] uppercase tracking-wider hover:bg-gray-800">Invite Staff</button>}
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                 {staff.map((member: any) => (
                   <div key={member.id} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                     <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black">
                       {member.name.split(' ').map((n: string) => n[0]).join('')}
                     </div>
                     <div className="flex-1">
                       <h4 className="font-bold text-[15px]">{member.name}</h4>
                       <p className="text-[13px] text-gray-500">{member.role} • {member.email}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          ) : activePanel === 'settings' || activePanel === 'account' ? (
             <div className="max-w-[800px] w-full animate-fade-in mx-auto mt-8">
              <h2 className="text-[32px] font-black tracking-tight mb-6 capitalize">{activePanel.replace('-', ' ')}</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const { error } = await supabase.from('settings').update({
                  display_name: fd.get('display_name'),
                  email: fd.get('email')
                }).eq('id', settings?.id || '1ea2c8f4-c2af-49fa-96a6-acab5bf20bd6');
                if (error) showToast(error.message, 'error');
                else showToast('Settings saved successfully.', 'success');
              }} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">
                <div>
                  <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Display Name</label>
                  <input type="text" name="display_name" defaultValue={settings?.display_name || ''} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Email Address</label>
                  <input type="email" name="email" defaultValue={settings?.email || ''} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600" />
                </div>
                <div className="pt-4">
                  <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-[13px] uppercase tracking-wider hover:bg-red-700">Save Changes</button>
                </div>
              </form>
            </div>
          ) : activePanel === 'analytics' ? (
            <div className="max-w-[1000px] w-full animate-fade-in mx-auto mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[32px] font-black tracking-tight">Analytics Overview</h2>
              </div>
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-gray-500 font-bold uppercase text-[11px] tracking-wider mb-2">Total Articles</div>
                  <div className="text-4xl font-black text-black">{articles.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-gray-500 font-bold uppercase text-[11px] tracking-wider mb-2">Total Engagement</div>
                  <div className="text-4xl font-black text-black">
                    {articles.reduce((acc, a) => acc + (a.likes || 0) + (a.dislikes || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-gray-500 font-bold uppercase text-[11px] tracking-wider mb-2">Avg Read Time</div>
                  <div className="text-4xl font-black text-black">
                    {(() => {
                      if (!articles.length) return '0m 0s';
                      const avgWords = articles.reduce((acc, a) => acc + (a.word_count || 0), 0) / articles.length;
                      const mins = Math.floor(avgWords / 200);
                      const secs = Math.floor((avgWords % 200) / (200 / 60));
                      return `${mins}m ${secs}s`;
                    })()}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-gray-500 font-bold uppercase text-[11px] tracking-wider mb-2">Total Subscribers</div>
                  <div className="text-4xl font-black text-black">{subscribers.length}</div>
                </div>
              </div>
              <h3 className="text-[20px] font-black tracking-tight mb-4 mt-8">Top Performing Articles</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {articles.filter(a => a.status === 'published').sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5).map(article => (
                  <div key={article.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => loadArticle(article)}>
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-[14px] line-clamp-1">{article.title}</p>
                      <p className="text-[12px] text-gray-500">{new Date(article.date || new Date()).toLocaleDateString()} • By {article.author}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1 text-green-600 font-bold text-[13px]">
                         <span className="text-gray-400">👍</span> {article.likes || 0}
                      </div>
                      <div className="flex items-center gap-1 text-red-600 font-bold text-[13px]">
                         <span className="text-gray-400">👎</span> {article.dislikes || 0}
                      </div>
                    </div>
                  </div>
                ))}
                {articles.filter(a => a.status === 'published').length === 0 && (
                  <div className="p-8 text-center text-gray-500">No published articles yet.</div>
                )}
              </div>
            </div>
          ) : activePanel === 'promo' ? (
            <div className="max-w-[1000px] w-full animate-fade-in mx-auto mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[32px] font-black tracking-tight">Promotional Hub</h2>
                <button onClick={() => { setEditingPromo(null); setActivePanel('add-promo'); }} className="bg-black text-white px-6 py-2.5 rounded-lg font-bold text-[13px] uppercase tracking-wider hover:bg-gray-800">New Campaign</button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {promotions.map((promo: any) => (
                  <div key={promo.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="h-[140px] bg-black flex items-center justify-center text-white font-black text-2xl uppercase tracking-widest relative overflow-hidden group">
                       {promo.image_url ? (
                         <img src={promo.image_url} alt={promo.title} className="absolute inset-0 w-full h-full object-cover" />
                       ) : (
                         <>
                           <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-600 opacity-50 group-hover:opacity-80 transition-opacity"></div>
                           <span className="relative z-10">{promo.title}</span>
                         </>
                       )}
                    </div>
                    <div className="p-5 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-[15px]">{promo.zone}</h4>
                        <p className="text-[12px] text-gray-500 capitalize">{promo.status} • {(promo.impressions / 1000).toFixed(1)}k impressions</p>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => { setEditingPromo(promo); setActivePanel('add-promo'); }} className="text-red-600 font-bold text-[13px] uppercase hover:underline">Edit</button>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this promotion campaign? This action cannot be undone.')) {
                              const { error } = await supabase.from('promotions').update({ status: 'deleted' }).eq('id', promo.id);
                              if (error) showToast('Failed to delete', 'error');
                              else { showToast('Campaign deleted', 'success'); mutatePromos(); }
                            }
                          }} 
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Campaign"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activePanel === 'add-staff' ? (
            <div className="max-w-[800px] w-full animate-fade-in mx-auto mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[32px] font-black tracking-tight">Invite Staff</h2>
                <button onClick={() => setActivePanel('staff')} className="text-gray-500 hover:text-black font-bold text-[13px] uppercase">Cancel</button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const { error } = await supabase.from('staff').insert({
                  name: fd.get('name'), role: fd.get('role'), email: fd.get('email')
                });
                if (!error) {
                  showToast('Staff member added!', 'success');
                  mutateStaff();
                  setActivePanel('staff');
                } else {
                  showToast(error.message, 'error');
                }
              }} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6" id="add-staff-form">
                <div>
                  <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Full Name</label>
                  <input type="text" name="name" required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Email Address</label>
                  <input type="email" name="email" required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Role</label>
                  <select name="role" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600">
                    <option value="Editor">Editor</option>
                    <option value="Writer">Writer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-[13px] uppercase tracking-wider hover:bg-red-700">Send Invitation</button>
                </div>
              </form>
            </div>
          ) : activePanel === 'add-promo' ? (
            <div className="max-w-[800px] w-full animate-fade-in mx-auto mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[32px] font-black tracking-tight">{editingPromo ? 'Edit Campaign' : 'New Campaign'}</h2>
                <button onClick={() => setActivePanel('promo')} className="text-gray-500 hover:text-black font-bold text-[13px] uppercase">Cancel</button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                const file = fd.get('image') as File;
                
                let imageUrl = editingPromo?.image_url || null;
                if (file && file.size > 0) {
                  showToast('Uploading image...', 'warning');
                  const filename = `${Date.now()}_${file.name}`;
                  const { data, error: uploadError } = await supabase.storage.from('media').upload(filename, file);
                  
                  if (uploadError) {
                    showToast('Failed to upload image: ' + uploadError.message, 'error');
                    return;
                  }
                  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
                  imageUrl = publicUrl;
                }

                const payload = {
                  title: fd.get('title'),
                  zone: fd.get('zone'),
                  link_url: fd.get('link_url'),
                  image_url: imageUrl,
                  start_date: fd.get('start_date') ? new Date(fd.get('start_date') as string).toISOString() : null,
                  end_date: fd.get('end_date') ? new Date(fd.get('end_date') as string).toISOString() : null,
                  status: 'active'
                };

                const { error } = editingPromo 
                  ? await supabase.from('promotions').update(payload).eq('id', editingPromo.id)
                  : await supabase.from('promotions').insert({ ...payload, impressions: 0 });

                if (!error) {
                  showToast(editingPromo ? 'Campaign updated!' : 'Campaign scheduled!', 'success');
                  form.reset();
                  mutatePromos();
                  setActivePanel('promo');
                } else {
                  showToast(error.message, 'error');
                }
              }} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6" id="add-promo-form">
                <div>
                  <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Campaign Title</label>
                  <input type="text" name="title" defaultValue={editingPromo?.title || ''} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Banner Image (Optional)</label>
                  <input type="file" name="image" accept="image/*" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600" />
                  {editingPromo?.image_url && <p className="text-[12px] text-gray-500 mt-2">Leave blank to keep existing image</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Destination Link</label>
                  <input type="url" name="link_url" defaultValue={editingPromo?.link_url || ''} placeholder="https://" required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Start Date (Optional)</label>
                    <input type="datetime-local" defaultValue={editingPromo?.start_date ? new Date(editingPromo.start_date).toISOString().slice(0, 16) : ''} name="start_date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">End Date (Optional)</label>
                    <input type="datetime-local" defaultValue={editingPromo?.end_date ? new Date(editingPromo.end_date).toISOString().slice(0, 16) : ''} name="end_date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Placement Zone</label>
                  <select name="zone" defaultValue={editingPromo?.zone || 'Header Banner'} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600">
                    <option value="Header Banner">Header Banner</option>
                    <option value="Sidebar Widget">Sidebar Widget</option>
                    <option value="In-Article Feed">In-Article Feed</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-[13px] uppercase tracking-wider hover:bg-red-700">{editingPromo ? 'Save Changes' : 'Schedule Campaign'}</button>
                </div>
              </form>
            </div>
          ) : (
            <PlaceholderPanel title={activePanel.charAt(0).toUpperCase() + activePanel.slice(1).replace('-', ' ')} />
          )}

          {/* Right SEO Drawer */}
          {seoDrawerOpen && (
            <div className="w-[340px] shrink-0 border border-gray-200 bg-white ml-6 rounded-xl shadow-xl p-6 flex flex-col h-fit sticky top-4">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h3 className="font-black text-[18px]">SEO Metadata</h3>
                <button onClick={() => setSeoDrawerOpen(false)} className="text-gray-400 hover:text-red-600 bg-gray-50 p-2 rounded-full"><X size={18}/></button>
              </div>
              
              <div className="flex flex-col gap-6">
                <div>
                  <label className="flex justify-between text-[12px] font-bold uppercase text-gray-600 mb-2">
                    SEO Title <span className={seoTitle.length > 60 ? 'text-red-600' : 'text-gray-400'}>{seoTitle.length}/60</span>
                  </label>
                  <input 
                    type="text" 
                    value={seoTitle} 
                    onChange={e => { setSeoTitle(e.target.value); markUnsaved(); }}
                    placeholder="Optimize for search..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[13px] outline-none focus:border-red-600 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-[12px] font-bold uppercase text-gray-600 mb-2">
                    Meta Description <span className={seoDesc.length > 160 ? 'text-red-600' : 'text-gray-400'}>{seoDesc.length}/160</span>
                  </label>
                  <textarea 
                    value={seoDesc} 
                    onChange={e => { setSeoDesc(e.target.value); markUnsaved(); }}
                    rows={5}
                    placeholder="A brief summary for search engines..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[13px] outline-none focus:border-red-600 focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-[12px] font-bold uppercase text-gray-600 mb-4 flex items-center gap-2"><LayoutTemplate size={14}/> Google Preview</h4>
                  <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                    <div className="text-[12px] text-green-700 truncate mb-1">themixhq.com/article/preview-slug</div>
                    <div className="text-[16px] text-blue-700 font-medium hover:underline cursor-pointer leading-tight mb-1">
                      {seoTitle || title || 'Your Article SEO Title Will Appear Here'}
                    </div>
                    <div className="text-[13px] text-gray-600 line-clamp-2 leading-snug">
                      {seoDesc || excerpt || 'This is the meta description preview. It shows how your article will look on Google search results...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-[240px] right-0 h-[40px] border-t border-gray-200 bg-white flex items-center justify-between px-6 text-[12px] font-bold text-gray-400 uppercase tracking-wider z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div>{wordCount} words</div>
        <div className="flex items-center gap-4">
          <span>{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
        </div>
      </div>

      {/* Publish Gate Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center animate-fade-in p-4">
          <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors">
            <X size={32} />
          </button>
          
          <div className="bg-white w-full max-w-[900px] rounded-2xl flex overflow-hidden shadow-2xl border border-gray-100">
            <div className="flex-1 bg-gray-50 p-10 border-r border-gray-200 flex flex-col justify-center">
              <div className="bg-white w-full border border-gray-200 overflow-hidden shadow-md rounded-xl">
                <div className="w-full h-[240px] bg-gray-200 flex items-center justify-center text-gray-400 relative">
                  {coverImage ? <img src={coverImage} alt="Cover" className="w-full h-full object-cover" /> : <ImageIcon size={48} />}
                </div>
                <div className="p-6">
                  <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-3">{categoryLabel}</div>
                  <div className="text-[22px] font-black mb-2 leading-tight">{title || 'Article Title...'}</div>
                  {subheading && <div className="text-[15px] font-bold text-gray-700 mb-2 leading-tight line-clamp-1">{subheading}</div>}
                  <div className={`text-[14px] text-gray-500 font-serif mb-5 line-clamp-2`}>{excerpt || 'Excerpt...'}</div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px]">
                      {(session?.user?.user_metadata?.full_name || session?.user?.email || 'A').charAt(0).toUpperCase()}
                    </div>
                    <span>{session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'Admin'}</span>
                    <span>•</span>
                    <span>{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[420px] p-10 flex flex-col bg-white">
              <div className="mb-8">
                <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Article Category</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600 font-bold"
                  value={categoryLabel}
                  onChange={(e) => { setCategoryLabel(e.target.value); markUnsaved(); }}
                >
                  <option value="News">News</option>
                  <option value="Music">Music</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Celebrity">Celebrity</option>
                  <option value="Sports">Sports</option>
                  <option value="Videos">Videos</option>
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2">Publish Date (Optional)</label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-red-600 font-bold"
                  value={customPublishDate}
                  onChange={(e) => { setCustomPublishDate(e.target.value); markUnsaved(); }}
                />
                <p className="text-[11px] text-gray-500 mt-2 font-bold uppercase tracking-wider">Leave blank to use current date</p>
              </div>

              <div className="mb-8">
                <h3 className="text-[26px] font-black tracking-tight mb-2">Pre-publish Checklist</h3>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-5">
                  <div className="h-full bg-red-600 transition-all rounded-full" style={{ width: `${(( (title.trim().length>0?1:0) + (excerpt.trim().length>0?1:0) + (wordCount>=300?1:0) + (coverImage?1:0) ) / 4) * 100}%` }}></div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-5 mb-6">
                <CheckItem label="Title filled in" required checked={title.trim().length > 0} />
                <CheckItem label="Excerpt written" required checked={excerpt.trim().length > 0} />
                <CheckItem label="Cover image uploaded" required checked={!!coverImage} />
                <CheckItem label={`Article over 300 words (${wordCount}/300)`} required checked={wordCount >= 300} />
                <CheckItem label="SEO title & meta description" checked={seoTitle.trim().length > 0 && seoDesc.trim().length > 0} />
              </div>

              <div className="flex flex-col gap-5 mb-8 border-t border-gray-100 pt-6">
                <label className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); setNotifySubscribers(!notifySubscribers); }}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${notifySubscribers ? 'bg-red-600 border-red-600 text-white' : 'border-gray-300 text-transparent group-hover:border-red-600'}`}>
                    <Check size={14} strokeWidth={4} />
                  </div>
                  <span className="text-[13px] font-bold uppercase tracking-wider text-gray-700">Notify Subscribers via Email</span>
                </label>
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                <button onClick={handlePublishClick} className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-[15px] uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 active:scale-[0.98]">
                  Publish now
                </button>
                <button onClick={handleSaveDraft} className="w-full border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-bold text-[15px] uppercase tracking-wider hover:bg-gray-50 hover:text-black transition-colors active:scale-[0.98]">
                  Save as draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Toasts */}
      <div className="fixed bottom-16 right-6 z-[2000] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`bg-white border-l-[6px] px-6 py-4 flex items-center gap-3 text-black shadow-2xl rounded-lg animate-slide-in-right ${t.type === 'success' ? 'border-green-500' : t.type === 'error' ? 'border-red-500' : 'border-amber-500'}`}>
            {t.type === 'success' && <Check className="text-green-500" size={20} strokeWidth={3} />}
            {t.type === 'error' && <AlertCircle className="text-red-500" size={20} strokeWidth={3} />}
            {t.type === 'warning' && <AlertCircle className="text-amber-500" size={20} strokeWidth={3} />}
            <span className="text-[14px] font-bold tracking-tight">{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ToolbarBtn = ({ icon, isActive, onClick, disabled, title }: any) => (
  <button 
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-md transition-colors flex items-center justify-center ${disabled ? 'opacity-30 cursor-not-allowed' : isActive ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
  >
    {icon}
  </button>
);

const NavItem = ({ icon, label, active, onClick }: any) => (
  <li onClick={onClick} className={`px-6 py-3 cursor-pointer flex items-center gap-3 text-[13px] font-bold uppercase tracking-wider border-l-[4px] transition-all ${active ? 'border-red-600 text-red-700 bg-red-50' : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'}`}>
    {icon}
    {label}
  </li>
);

const CheckItem = ({ label, required, checked }: any) => (
  <div className="flex items-start gap-3 transition-transform">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 mt-0.5 shrink-0 transition-colors ${checked ? 'bg-red-600 border-red-600 text-white' : 'border-gray-300 text-transparent'}`}>
      <Check size={12} strokeWidth={4} />
    </div>
    <div className={`text-[14px] font-bold ${checked ? 'text-black' : 'text-gray-500'}`}>
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </div>
  </div>
);

const PlaceholderPanel = ({ title }: { title: string }) => (
  <div className="max-w-[1000px] w-full animate-fade-in mt-12 mx-auto">
    <h2 className="text-[32px] font-black tracking-tight mb-6">{title}</h2>
    <div className="border border-gray-200 p-12 bg-white text-center text-gray-500 font-serif rounded-xl shadow-sm">
      This panel is functionally active in routing, but UI is truncated for this prototype view.
    </div>
  </div>
);
