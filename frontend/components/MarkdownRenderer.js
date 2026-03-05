import CodeBlock from './CodeBlock';
import styles from '../styles/Home.module.css';

function renderInline(text, keyPrefix) {
  const pattern = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(pattern).filter(Boolean);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={key} className={styles.inlineCode}>
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }

    const match = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (match) {
      return (
        <a key={key} href={match[2]} target="_blank" rel="noreferrer">
          {match[1]}
        </a>
      );
    }

    return <span key={key}>{part}</span>;
  });
}

function flushParagraph(paragraphLines, blocks, keyPrefix) {
  if (paragraphLines.length === 0) return;
  const combined = paragraphLines.join(' ').trim();
  if (!combined) return;
  blocks.push(
    <p key={`${keyPrefix}-${blocks.length}`}>
      {renderInline(combined, `${keyPrefix}-inline-${blocks.length}`)}
    </p>
  );
  paragraphLines.length = 0;
}

function parseMarkdown(content) {
  const lines = content.split(/\r?\n/);
  const blocks = [];
  const paragraphLines = [];

  let inCodeBlock = false;
  let codeLang = '';
  let codeLines = [];
  let listBuffer = [];
  let listType = null;

  const flushList = () => {
    if (listBuffer.length === 0 || !listType) return;
    const Tag = listType;
    blocks.push(
      <Tag key={`list-${blocks.length}`}>
        {listBuffer.map((item, index) => (
          <li key={`li-${index}`}>{renderInline(item, `list-${blocks.length}-${index}`)}</li>
        ))}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  };

  lines.forEach((line) => {
    if (line.trim().startsWith('```')) {
      flushParagraph(paragraphLines, blocks, 'p');
      flushList();

      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.trim().replace('```', '').trim();
        codeLines = [];
      } else {
        blocks.push(
          <CodeBlock
            key={`code-${blocks.length}`}
            code={codeLines.join('\n')}
            language={codeLang}
          />
        );
        inCodeBlock = false;
        codeLang = '';
        codeLines = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (!line.trim()) {
      flushParagraph(paragraphLines, blocks, 'p');
      flushList();
      return;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph(paragraphLines, blocks, 'p');
      flushList();
      const level = headingMatch[1].length;
      const HeadingTag = `h${level}`;
      blocks.push(
        <HeadingTag key={`h-${blocks.length}`}>
          {renderInline(headingMatch[2], `h-inline-${blocks.length}`)}
        </HeadingTag>
      );
      return;
    }

    const unorderedMatch = line.match(/^[-*]\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph(paragraphLines, blocks, 'p');
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listBuffer.push(unorderedMatch[1]);
      return;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph(paragraphLines, blocks, 'p');
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listBuffer.push(orderedMatch[1]);
      return;
    }

    const quoteMatch = line.match(/^>\s+(.*)$/);
    if (quoteMatch) {
      flushParagraph(paragraphLines, blocks, 'p');
      flushList();
      blocks.push(
        <blockquote key={`quote-${blocks.length}`}>
          {renderInline(quoteMatch[1], `q-inline-${blocks.length}`)}
        </blockquote>
      );
      return;
    }

    paragraphLines.push(line);
  });

  flushParagraph(paragraphLines, blocks, 'p');
  flushList();

  if (inCodeBlock && codeLines.length > 0) {
    blocks.push(
      <CodeBlock key={`code-tail-${blocks.length}`} code={codeLines.join('\n')} language={codeLang} />
    );
  }

  return blocks;
}

export default function MarkdownRenderer({ content }) {
  return <div className={styles.markdown}>{parseMarkdown(content || '')}</div>;
}
