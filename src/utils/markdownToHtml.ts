
export function markdownToHtml(markdown: string): string {
  // Very simple markdown parser - could be replaced with a proper library like marked
  let html = markdown
    // Headers
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold my-2">$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-bold my-2">$1</h4>')
    
    // Bold, italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Lists
    .replace(/^\s*-\s*(.*)/gm, '<li class="ml-4">$1</li>')
    
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-jungle hover:underline">$1</a>')
    
    // Paragraphs
    .replace(/^\s*(\n)?(.+)/gm, function(m) {
      return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p class="mb-4">' + m + '</p>';
    })
    
    // Convert line breaks to <br>
    .replace(/\n/g, '<br>');
  
  // Convert lists
  html = html.replace(/<li class="ml-4">(.*?)<\/li>/g, function(match) {
    if (!html.includes('<ul>')) {
      html = html.replace(match, '<ul class="list-disc ml-6 my-4">' + match + '</ul>');
    }
    return match;
  });
  
  return html;
}
