'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

/**
 * Markdownコンテンツをレンダリングするコンポーネント
 * GitHub Flavored Markdownをサポート
 */
export function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  return (
    <div className={`prose prose-zinc dark:prose-invert max-w-none 
      prose-headings:font-mono prose-headings:tracking-tight 
      prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-code:font-mono prose-code:text-sm prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-border/50
      prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
      prose-img:rounded-lg prose-img:border prose-img:border-border/50
      prose-headings:text-primary prose-p:text-primary prose-li:text-primary prose-strong:text-primary
      text-primary glow-text
      ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // コードブロック (InlineはCSSクラスで対応、Blockはここで対応)
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            return isInline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <div className="relative group">
                <div className="absolute right-2 top-2 text-xs text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {match[1]}
                </div>
                <code
                  className={`${className} block overflow-x-auto p-4 text-sm font-mono`}
                  {...props}
                >
                  {children}
                </code>
              </div>
            );
          },
          // テーブル
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-lg border border-border">
              <table className="w-full text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50 text-muted-foreground font-medium">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-medium border-b border-border">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 border-b border-border last:border-0">{children}</td>
          ),
          // リンク
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
