
import DOMPurify from 'dompurify';
import { marked } from 'marked';

export const markdownToHtml = (markdown: string): string => {
  // First, replace the escaped newlines with actual newlines
  const cleanedMarkdown = markdown
    .replace(/\\n\\n/g, '\n\n')
    .replace(/\\n/g, '\n')
    .replace(/\n#{1,6} /g, match => match.replace(/\n/, '\n\n'))
    .replace(/\n- /g, '\n\n- ');

  // Configure marked options for better styling
  marked.setOptions({
    breaks: true,        // Add <br> on single line breaks
    gfm: true,           // Enable GitHub Flavored Markdown
    headerIds: true,     // Enable header IDs for linking
    mangle: false,       // Don't mangle header IDs
    smartLists: true,    // Use smarter list behavior
    smartypants: true,   // Use "smart" typographic punctuation
  });

  // Convert markdown to HTML
  const rawHtml = marked(cleanedMarkdown);
  
  // Sanitize the HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);
  
  return sanitizedHtml;
};
