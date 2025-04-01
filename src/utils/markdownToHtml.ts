
import DOMPurify from 'dompurify';
import { marked } from 'marked';

export const markdownToHtml = (markdown: string): string => {
  // First, replace the escaped newlines with actual newlines
  const cleanedMarkdown = markdown
    .replace(/\\n\\n/g, '\n\n')
    .replace(/\\n/g, '\n')
    .replace(/\n#{1,6} /g, match => match.replace(/\n/, '\n\n'))
    .replace(/\n- /g, '\n\n- ');

  // Convert markdown to HTML
  const rawHtml = marked(cleanedMarkdown);
  
  // Sanitize the HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);
  
  return sanitizedHtml;
};
