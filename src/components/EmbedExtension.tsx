import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';

export interface EmbedOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (options: { src: string }) => ReturnType;
    }
  }
}

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^&?]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Twitter / X
  const twitterMatch = url.match(/(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/);
  if (twitterMatch) return `https://twitframe.com/show?url=${encodeURIComponent(url)}`;

  // Instagram
  const igMatch = url.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
  if (igMatch) return `https://www.instagram.com/p/${igMatch[1]}/embed`;

  // TikTok
  const tiktokMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (tiktokMatch) return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;

  // Facebook Post
  if (url.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`;
  }

  // Spotify
  if (url.includes('spotify.com')) {
    const sMatch = url.match(/spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
    if (sMatch) return `https://open.spotify.com/embed/${sMatch[1]}/${sMatch[2]}`;
  }

  // Fallback (generic iframe)
  return url;
};

const EmbedComponent = (props: any) => {
  const { node } = props;
  const originalUrl = node.attrs.src;
  const embedUrl = getEmbedUrl(originalUrl);

  return (
    <NodeViewWrapper className="social-embed-wrapper my-6 relative group" data-drag-handle>
      <div className="absolute -left-4 top-0 bottom-0 w-4 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" contentEditable={false}>
        <div className="w-1.5 h-8 bg-gray-300 rounded-full"></div>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col items-center p-4">
        {/* We use a generic iframe for all embeds */}
        <iframe 
          src={embedUrl} 
          className="w-full min-h-[400px] border-none rounded-lg bg-white shadow-inner"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          scrolling="no"
        ></iframe>
        <div className="text-[11px] text-gray-400 mt-3 font-mono break-all">{originalUrl}</div>
      </div>
    </NodeViewWrapper>
  );
};

export const SocialEmbed = Node.create<EmbedOptions>({
  name: 'socialEmbed',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-social-embed]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const originalUrl = HTMLAttributes.src;
    const embedUrl = getEmbedUrl(originalUrl);
    
    return [
      'div', 
      mergeAttributes({ 'data-social-embed': true, class: 'social-embed-container w-full my-8 flex flex-col items-center' }, HTMLAttributes),
      [
        'iframe',
        {
          src: embedUrl,
          class: 'w-full max-w-[800px] min-h-[400px] md:min-h-[500px] rounded-xl shadow-md border border-gray-200 bg-gray-50',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowfullscreen: 'true',
          scrolling: 'no'
        }
      ]
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedComponent)
  },

  addCommands() {
    return {
      setEmbed: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
});
