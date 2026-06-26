// Class Window, Parent App design tokens, lifted exactly from the Figma file
// (Class Window Mobile App, Parent App - Beta). Colors and type pulled from the
// design context so the prototype matches the source pixel for pixel.

export const colors = {
  appBg: '#fff8f0',
  white: '#ffffff',
  headerBg: '#ffffff',
  divider: '#f2e4d0',

  // brand orange family
  primary: '#f4845f',
  primaryAlt: '#f28665',
  primaryDeep: '#e06b45',
  brandSolid: '#f27850',

  // text
  textDark: '#2c1a0e',
  textDark2: '#2c1f14',
  textMuted: '#8c6e5d',
  textMuted2: '#71645b',
  textMuted3: '#a2887c',
  caption: '#5c3d2a',
  sectionLabel: '#f7a17a',

  // surfaces
  cardBorderPeach: '#f9b49a',
  pillInactive: '#faf0e4',
  reactionLikedBg: '#fde0d3',
  reactionDefaultBg: '#fff8f1',
  reactionDefaultBorder: '#f1e4d1',
  settingsIconBg: '#fef0e8',
  cardDivider: '#f5efe8',
  caughtUpIconBg: '#fde8df',
  navInactive: '#a8a29e',

  // neutral (report modal uses Untitled-UI greys)
  ink900: '#171717',
  ink700: '#404040',
  ink600: '#525252',
  borderSecondary: '#e5e5e5',
  borderPrimary: '#d4d4d4',
  overlay: '#0a0a0a',

  // post-image placeholder washes
  postPeach: '#fef0e0',
  postGreen: '#e8f5e8',
  postBlue: '#e8f0ff',
};

// Font family keys registered in App.tsx via useFonts()
export const font = {
  heading: 'Nunito-ExtraBold', // Nunito 800: greetings, names, headings
  headingBold: 'Nunito-Bold', // Nunito 700: card titles, section labels
  regular: 'NunitoSans-Regular',
  medium: 'NunitoSans-Medium',
  semibold: 'NunitoSans-SemiBold',
  bold: 'NunitoSans-Bold',
  extrabold: 'NunitoSans-ExtraBold',
};

// Avatar gradient pairs, matching the Figma 45deg linear gradients
export const avatarGradients: Record<string, [string, string]> = {
  peach: ['#f9b49a', '#f5b942'], // Mrs. Johnson
  teal: ['#7ec8c8', '#4aabab'], // Mr. Patel
  purple: ['#c4a8d4', '#9b73b5'], // Ms. Rivera
};

export const shadowCard = {
  shadowColor: '#2c1a0e',
  shadowOpacity: 0.09,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
};

export const shadowSoft = {
  shadowColor: '#2c1f14',
  shadowOpacity: 0.07,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};
