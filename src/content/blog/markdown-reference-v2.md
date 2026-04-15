---
title: 'Markdown You Will Actually Use'
description: 'A short reference for the prose elements the theme styles. Headings, links, lists, tables, code, callouts.'
pubDate: '2026-02-01'
category: 'Markdown'
heroImage: '../../assets/tone-sample-glass-building.jpg'
---

Use this post as a cheat sheet for the prose surface. Open it in two windows: source on one side, rendered post on the other.

## Headings

Start posts at `##`. The page title is the only `h1`.

```markdown
## Section

### Subsection
```

## Inline text

The inline elements the theme styles:

```markdown
A [link](https://astro.build), **bold**, _italic_, `inline code`,
<kbd>⌘</kbd> + <kbd>K</kbd>, and <mark>highlighted</mark> text.
```

Renders as:

A [link](https://astro.build), **bold**, _italic_, `inline code`, <kbd>⌘</kbd> + <kbd>K</kbd>, and <mark>highlighted</mark> text.

Use `<mark>` for a phrase that needs attention inside a paragraph. For a whole block, use a callout.

## Lists

Ordered when sequence matters, bullets otherwise.

```markdown
1. First step.
2. Second step.
3. Third step.

- One useful example
- One clear tradeoff
- One next step
```

Nested lists work, but keep them shallow:

- Section
  - Subsection
  - Another subsection
- Section

## Quotes

Blockquotes are styled as a pause, not as general emphasis.

```markdown
> A writing surface should disappear while the reader moves through it.
```

> A writing surface should disappear while the reader moves through it.

With attribution:

```markdown
> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike</cite>
```

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike</cite>

## Tables

For compact reference data:

```markdown
| Element | Use                           |
| ------- | ----------------------------- |
| Heading | Structure the article         |
| Quote   | Pause on a specific idea      |
| Code    | Show exact commands or values |
```

| Element | Use                           |
| ------- | ----------------------------- |
| Heading | Structure the article         |
| Quote   | Pause on a specific idea      |
| Code    | Show exact commands or values |

If a table needs sorting or interaction, move it outside the article.

## Code blocks

Always add the language. Highlighting is provided by `astro-expressive-code` with the bundled `tone-cold` theme.

````markdown
```ts
const site = { title: 'Astro Tone' };
```
````

Renders as:

```ts
const site = { title: 'Astro Tone' };
```

Terminal:

```bash
npm run build
```

JSON config:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

Astro components use the same surface:

```astro
---
const title = 'Quiet defaults';
---

<section class="intro">
  <h2>{title}</h2>
  <slot />
</section>
```

## Images

Reference images from `src/assets/` with a relative path. Astro processes them at build time (resize, AVIF/WebP, dimensions emitted in the markup).

```markdown
![Description for screen readers](../../assets/tone-sample-blue-architecture.jpg)
_Optional caption goes here._
```

Click an image in a rendered post to open the lightbox. Text in `_italics_` immediately after the image is treated as the caption.

## Callouts

Plain HTML with classes. The theme styles three tones:

```html
<div class="callout callout-note">
  <p>Use for extra context.</p>
</div>

<div class="callout callout-tip">
  <p>Use for a small recommendation.</p>
</div>

<div class="callout callout-warning">
  <p>Use for limits or likely mistakes.</p>
</div>
```

<div class="callout callout-note">
  <p>Use for extra context.</p>
</div>

<div class="callout callout-tip">
  <p>Use for a small recommendation.</p>
</div>

<div class="callout callout-warning">
  <p>Use for limits or likely mistakes.</p>
</div>

## Small HTML you can use inline

```markdown
<abbr title="Cascading Style Sheets">CSS</abbr>

H<sub>2</sub>O · x<sup>2</sup>

Press <kbd>Esc</kbd>
```

<abbr title="Cascading Style Sheets">CSS</abbr> is the language that carries most of the visual system. H<sub>2</sub>O and x<sup>2</sup> read naturally inline. Press <kbd>Esc</kbd> to close any open dialog in the theme.

## Dividers

Use a divider only when a section break needs more force than a heading.

```markdown
---
```

---

## Footnotes

```markdown
The first half of the work is easy.[^1]

[^1]: The second half is what actually ships.
```

The first half of the work is easy.[^1]

[^1]: The second half is what actually ships.

Keep footnotes short. If a note grows past a sentence, put it in the body.

## What the theme does not style

If you use `<details>`, `<summary>`, or `<aside>` outside a callout, default browser styling applies. Either add your own CSS in `src/styles/prose.css` or wrap the element in an MDX component.
