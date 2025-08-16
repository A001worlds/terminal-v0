import { Colors } from '../types'

export const getGitHubColors = (): Colors => ({
  bgDefault: '#010409',
  bgSubtle: '#21262d',
  bgInset: '#161b22',
  fgDefault: '#f0f6fc',
  fgMuted: '#8b949e',
  fgSubtle: '#6e7681',
  borderDefault: '#30363d',
  borderMuted: '#21262d',
  borderSubtle: '#161b22',
  accentFg: '#2f81f7',
  accentEmphasis: '#1f6feb',
  accentMuted: '#388bfd26',
  accentSubtle: '#388bfd1a',
  successFg: '#3fb950',
  successEmphasis: '#238636',
  successMuted: '#2ea04326',
  successSubtle: '#2ea0431a',
  attentionFg: '#d29922',
  attentionEmphasis: '#9e6a03',
  attentionMuted: '#bb800926',
  attentionSubtle: '#bb80091a',
  severeFg: '#db6d28',
  severeEmphasis: '#bc4c00',
  severeMuted: '#d1770f26',
  severeSubtle: '#d1770f1a',
  dangerFg: '#f85149',
  dangerEmphasis: '#da3633',
  dangerMuted: '#f8514926',
  dangerSubtle: '#f851491a',
  openFg: '#3fb950',
  openEmphasis: '#238636',
  openMuted: '#2ea04326',
  openSubtle: '#2ea0431a',
  closedFg: '#f85149',
  closedEmphasis: '#da3633',
  closedMuted: '#f8514926',
  closedSubtle: '#f851491a',
  doneFg: '#a5a5f5',
  doneEmphasis: '#8b949e',
  doneMuted: '#a5a5f526',
  doneSubtle: '#a5a5f51a',
  sponsorFg: '#db61a2',
  sponsorEmphasis: '#bf8700',
  sponsorMuted: '#db61a226',
  sponsorSubtle: '#db61a21a',
  canvasDefault: '#010409',
  canvasOverlay: '#161b22',
  canvasInset: '#0d1117',
  canvasSubtle: '#161b22',
  btnText: '#f0f6fc',
  btnBg: '#21262d',
  btnBorder: '#30363d',
  btnShadow: '#0000',
  btnInsetText: '#f0f6fc',
  btnInsetBg: '#0d1117',
  btnInsetBorder: '#21262d',
  btnPrimaryText: '#ffffff',
  btnPrimaryBg: '#238636',
  btnPrimaryBorder: '#30363d',
  btnPrimaryShadow: '#0000',
  btnOutlineText: '#2f81f7',
  btnOutlineBg: '#010409',
  btnOutlineBorder: '#1f6feb',
  btnDangerText: '#f0f6fc',
  btnDangerBg: '#da3633',
  btnDangerBorder: '#30363d',
  btnDangerShadow: '#0000',
  btnDangerOutlineText: '#f85149',
  btnDangerOutlineBg: '#010409',
  btnDangerOutlineBorder: '#f85149',
  btnInvisibleText: '#2f81f7',
  btnInvisibleBg: '#0000',
  btnInvisibleBorder: '#0000',
  avatarBg: '#161b22',
  avatarBorder: '#30363d',
  selectMenuBorder: '#30363d',
  selectMenuBg: '#161b22',
  selectMenuShadow: '#010409cc',
  overlayBg: '#161b22',
  overlayShadow: '#010409cc',
  topicTagBg: '#388bfd1a',
  topicTagBorder: '#0000',
  counterBg: '#30363d',
  counterBorder: '#0000',
  calendarGrid: '#21262d',
  diffBlobAdditionNumText: '#f0f6fc',
  diffBlobAdditionNumBg: '#238636',
  diffBlobAdditionFgNum: '#f0f6fc',
  diffBlobAdditionBgNum: '#2ea04340',
  diffBlobDeletionNumText: '#f0f6fc',
  diffBlobDeletionNumBg: '#da3633',
  diffBlobDeletionFgNum: '#f0f6fc',
  diffBlobDeletionBgNum: '#f8514940',
  diffBlobHunkNumBg: '#388bfd26',
  diffBlobExpansionBg: '#21262d',
  diffBlobSelectedBg: '#bb800926',
  searchKeywordHl: '#d29922',
  prettylightsCommentText: '#8b949e',
  prettylightsConstant: '#79c0ff',
  prettylightsEntity: '#d2a8ff',
  prettylightsStorageModifierImport: '#c9d1d9',
  prettylightsEntityTag: '#7ee787',
  prettylightsKeyword: '#ff7b72',
  prettylightsString: '#a5c9ea',
  prettylightsVariable: '#ffa657',
  prettylightsStringRegexp: '#7ee787',
  prettylightsSymbolSublimelinter: '#f85149',
  prettylightsCaretLine: '#161b22',
  prettylightsInvalidIllegal: '#f0f6fc',
  prettylightsMarkupBold: '#c9d1d9',
  prettylightsMarkupChanged: '#ffdfb6',
  prettylightsMarkupDeleted: '#ffdcd7',
  prettylightsMarkupInserted: '#aff5b4',
  prettylightsMarkupIgnored: '#8b949e',
  prettylightsMarkupHeading: '#1f6feb',
  prettylightsMarkupItalic: '#c9d1d9',
  prettylightsMarkupList: '#f2cc60',
  prettylightsMarkupQuote: '#8b949e',
  prettylightsMarkupRaw: '#b2dfdb',
  prettylightsMarkupSubheading: '#1f6feb'
})

export const getFileTypeColor = (fileType: string, colors: Colors): string => {
  if (fileType?.includes('pdf')) {
    return colors.dangerEmphasis
  } else if (fileType?.includes('csv') || fileType?.includes('excel') || fileType?.includes('spreadsheet')) {
    return colors.successEmphasis
  } else {
    return colors.fgMuted
  }
}

export const getStatusColor = (status: string, colors: Colors): string => {
  switch (status) {
    case 'complete':
      return colors.successEmphasis
    case 'uploading':
    case 'processing':
      return colors.accentEmphasis
    case 'error':
      return colors.dangerEmphasis
    default:
      return colors.fgMuted
  }
}