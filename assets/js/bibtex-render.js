(function () {
  'use strict';

  // -------------------------------------------------------------------
  // BibTeX Parser
  // -------------------------------------------------------------------
  function parseBibtex(text) {
    const entries = [];
    // Strip line comments
    text = text.replace(/^%.*$/gm, '');

    let i = 0;
    while (i < text.length) {
      const atIdx = text.indexOf('@', i);
      if (atIdx === -1) break;
      i = atIdx + 1;

      // Entry type (article, inproceedings, ...)
      const typeStart = i;
      while (i < text.length && /\w/.test(text[i])) i++;
      const type = text.slice(typeStart, i).toLowerCase();
      if (!type) continue;

      // Skip whitespace to opening brace
      while (i < text.length && /\s/.test(text[i])) i++;
      if (i >= text.length || text[i] !== '{') continue;
      i++; // consume '{'

      // Entry key (up to first comma)
      while (i < text.length && /\s/.test(text[i])) i++;
      const keyStart = i;
      while (i < text.length && text[i] !== ',' && text[i] !== '}') i++;
      const key = text.slice(keyStart, i).trim();
      if (text[i] === ',') i++;

      // Read all fields until the matching closing brace
      const fieldsStart = i;
      let depth = 1;
      while (i < text.length && depth > 0) {
        if (text[i] === '{') depth++;
        else if (text[i] === '}') depth--;
        i++;
      }
      const fieldsText = text.slice(fieldsStart, i - 1);
      const fields = parseFields(fieldsText);
      entries.push({ type, key, ...fields });
    }
    return entries;
  }

  function parseFields(text) {
    const fields = {};
    let i = 0;
    while (i < text.length) {
      // Skip whitespace and commas
      while (i < text.length && /[\s,]/.test(text[i])) i++;
      if (i >= text.length) break;

      // Field name
      const nameStart = i;
      while (i < text.length && /[\w-]/.test(text[i])) i++;
      const name = text.slice(nameStart, i).toLowerCase();
      if (!name) { i++; continue; }

      // Skip whitespace then '='
      while (i < text.length && /\s/.test(text[i])) i++;
      if (i >= text.length || text[i] !== '=') continue;
      i++;
      while (i < text.length && /\s/.test(text[i])) i++;

      // Field value: {braced}, "quoted", or bare number
      let value = '';
      if (i < text.length && text[i] === '{') {
        let depth = 0;
        const start = i + 1;
        while (i < text.length) {
          if (text[i] === '{') depth++;
          else if (text[i] === '}') {
            depth--;
            if (depth === 0) { value = text.slice(start, i); i++; break; }
          }
          i++;
        }
      } else if (i < text.length && text[i] === '"') {
        i++;
        const start = i;
        while (i < text.length && text[i] !== '"') i++;
        value = text.slice(start, i);
        i++;
      } else {
        const start = i;
        while (i < text.length && /[^\s,}]/.test(text[i])) i++;
        value = text.slice(start, i);
      }

      fields[name] = value.trim();
    }
    return fields;
  }

  // -------------------------------------------------------------------
  // Formatting helpers
  // -------------------------------------------------------------------
  function formatAuthors(authorStr) {
    if (!authorStr) return '';
    return authorStr
      .split(/\s+and\s+/i)
      .map(a => a.trim())
      .join(', ');
  }

  function renderEntry(entry, num) {
    const title   = (entry.title || 'Untitled').replace(/[{}]/g, '');
    const authors = formatAuthors(entry.author);
    const year    = entry.year || '';
    const venue   = (entry.journal || entry.booktitle || '').replace(/[{}]/g, '');
    const volume  = entry.volume  ? `, vol.&nbsp;${entry.volume}`  : '';
    const number  = entry.number  ? `, no.&nbsp;${entry.number}`   : '';
    const pages   = entry.pages   ? `, pp.&nbsp;${entry.pages.replace('--', '&ndash;')}` : '';

    let links = '';
    if (entry.doi) {
      links += ` <a class="pub-link" href="https://doi.org/${entry.doi}" target="_blank" rel="noopener">[DOI]</a>`;
    }
    if (entry.url) {
      links += ` <a class="pub-link" href="${entry.url}" target="_blank" rel="noopener">[PDF]</a>`;
    }

    const citation =
      `<span class="pub-num">[${num}]</span> ` +
      `${authors}. ` +
      `&ldquo;<span class="pub-title">${title}</span>.&rdquo; ` +
      `<span class="pub-venue">${venue}</span>${volume}${number}${pages}, ${year}.` +
      links;

    return `<li class="pub-item">${citation}</li>`;
  }

  // -------------------------------------------------------------------
  // Category config  (order defines display order)
  // -------------------------------------------------------------------
  const CATEGORIES = [
    { key: 'SCIE',       label: 'International Journal (SCIE)' },
    { key: 'SCOPUS',     label: 'International Journal (SCOPUS)' },
    { key: 'Conference', label: 'International Conference' },
    { key: 'Domestic',   label: 'Domestic (국내)' },
  ];

  function getCategory(entry) {
    const kw = (entry.keywords || entry.category || '').toLowerCase();
    for (const cat of CATEGORIES) {
      if (kw.includes(cat.key.toLowerCase())) return cat.key;
    }
    if (entry.type === 'article') return 'SCIE';
    if (entry.type === 'inproceedings') return 'Conference';
    return null;
  }

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------
  function render(entries, container) {
    // Group and sort by year descending
    const groups = {};
    entries.forEach(e => {
      const cat = getCategory(e);
      if (!cat) return;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(e);
    });
    Object.values(groups).forEach(g =>
      g.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0))
    );

    let html = '';
    CATEGORIES.forEach(cat => {
      const items = groups[cat.key];
      if (!items || items.length === 0) return;

      html += `<section class="pub-section">`;
      html += `<h2 class="pub-category-heading">${cat.label}</h2>`;
      html += `<ul class="pub-list">`;
      items.forEach((entry, idx) => {
        html += renderEntry(entry, items.length - idx);
      });
      html += `</ul></section>`;
    });

    container.innerHTML = html || '<p>No publications found.</p>';
  }

  // -------------------------------------------------------------------
  // Bootstrap
  // -------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('pub-list');
    if (!container) return;

    const bibUrl = container.dataset.bibUrl;
    if (!bibUrl) { container.innerHTML = '<p>BibTeX URL not set.</p>'; return; }

    fetch(bibUrl)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(text => render(parseBibtex(text), container))
      .catch(err => {
        container.innerHTML = '<p>Failed to load publications.</p>';
        console.error('bibtex-render:', err);
      });
  });
})();
