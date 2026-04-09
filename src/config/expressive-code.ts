const toneColdTheme = {
  name: 'tone-cold',
  type: 'dark',
  colors: {
    'editor.background': '#1c2029',
    'editor.foreground': '#deebf8',
    'editor.selectionBackground': '#5f95f633',
  },
  tokenColors: [
    {
      settings: {
        foreground: '#deebf8',
      },
    },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: {
        foreground: '#7d8a9c',
        fontStyle: 'italic',
      },
    },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier'],
      settings: {
        foreground: '#a9cbff',
      },
    },
    {
      scope: ['entity.name.function', 'support.function', 'variable.function'],
      settings: {
        foreground: '#7fd5ff',
      },
    },
    {
      scope: ['string', 'constant.other.symbol'],
      settings: {
        foreground: '#8de4ea',
      },
    },
    {
      scope: ['constant.numeric', 'constant.language.boolean', 'constant.language.null'],
      settings: {
        foreground: '#95bbff',
      },
    },
    {
      scope: ['entity.name.tag', 'support.class.component'],
      settings: {
        foreground: '#8fc3ff',
      },
    },
    {
      scope: [
        'entity.other.attribute-name',
        'support.type.property-name',
        'variable.other.property',
      ],
      settings: {
        foreground: '#c8ddff',
      },
    },
    {
      scope: ['punctuation', 'meta.brace', 'meta.delimiter'],
      settings: {
        foreground: '#aebdcc',
      },
    },
    {
      scope: ['markup.inserted', 'diff.header.to-file', 'punctuation.definition.inserted'],
      settings: {
        foreground: '#91e2d3',
      },
    },
    {
      scope: ['markup.deleted', 'diff.header.from-file', 'punctuation.definition.deleted'],
      settings: {
        foreground: '#ffa2ad',
      },
    },
  ],
};

export const toneExpressiveCodeOptions = {
  themes: [toneColdTheme],
  defaultProps: {
    wrap: true,
    preserveIndent: true,
  },
  styleOverrides: {
    borderRadius: '8px',
    borderWidth: '1px',
    borderColor: 'color-mix(in srgb, #deebf8 11%, transparent)',
    codeBackground: '#1c2029',
    codeFontFamily: 'var(--font-mono)',
    codeFontSize: 'var(--text-footnote)',
    codeLineHeight: '1.74',
    codePaddingBlock: '1.05rem',
    codePaddingInline: '1.25rem',
    uiFontFamily: 'var(--font-sans)',
    uiFontSize: 'var(--text-caption-1)',
    uiFontWeight: '600',
    scrollbarThumbColor: 'color-mix(in srgb, #deebf8 24%, transparent)',
    frames: {
      frameBoxShadowCssValue: 'none',
      editorTabBarBackground: '#202633',
      editorActiveTabBackground: '#1c2029',
      editorActiveTabForeground: 'color-mix(in srgb, #deebf8 74%, transparent)',
      editorActiveTabBorderColor: 'transparent',
      editorActiveTabIndicatorTopColor: 'transparent',
      editorActiveTabIndicatorBottomColor: 'transparent',
      editorTabBarBorderBottomColor: 'color-mix(in srgb, #deebf8 8%, transparent)',
      inlineButtonForeground: 'color-mix(in srgb, #deebf8 64%, transparent)',
      inlineButtonBorder: 'color-mix(in srgb, #deebf8 16%, transparent)',
      terminalTitlebarBackground: '#202633',
      terminalTitlebarForeground: 'color-mix(in srgb, #deebf8 62%, transparent)',
      terminalTitlebarDotsForeground: 'color-mix(in srgb, #deebf8 46%, transparent)',
      terminalTitlebarDotsOpacity: '0.42',
    },
  },
};
