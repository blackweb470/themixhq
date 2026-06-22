import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';

export interface VideoOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string }) => ReturnType;
    }
  }
}

const VideoComponent = (props: any) => {
  const { node } = props;
  const src = node.attrs.src;

  return (
    <NodeViewWrapper className="video-wrapper my-6 relative group" data-drag-handle>
      <div className="absolute -left-4 top-0 bottom-0 w-4 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" contentEditable={false}>
        <div className="w-1.5 h-8 bg-gray-300 rounded-full"></div>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm p-2 flex flex-col items-center">
        <video 
          src={src} 
          controls 
          className="w-full rounded-lg bg-black shadow-inner max-h-[600px] object-contain"
        />
      </div>
    </NodeViewWrapper>
  );
};

export const Video = Node.create<VideoOptions>({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

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
        tag: 'video',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes({ 
        controls: 'controls', 
        class: 'w-full rounded-xl bg-black shadow-lg max-h-[600px] object-contain my-8' 
      }, this.options.HTMLAttributes, HTMLAttributes),
      ['source', { src: HTMLAttributes.src }]
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoComponent)
  },

  addCommands() {
    return {
      setVideo: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
});
