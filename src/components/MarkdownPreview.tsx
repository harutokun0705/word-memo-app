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
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // コードブロックのスタイリング
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            return isInline ? (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className={`${className} block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono`}
                {...props}
              >
                {children}
              </code>
            );
          },
          // プリフォーマットのスタイリング
          pre: ({ children }) => (
            <pre className="bg-muted rounded-lg overflow-x-auto">{children}</pre>
          ),
          // テーブルのスタイリング
          table: ({ children }) => (
            <table className="border-collapse border border-border w-full">
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 bg-muted text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2">{children}</td>
          ),
          // リンクのスタイリング
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
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
