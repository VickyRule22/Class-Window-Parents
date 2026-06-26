# Class Window, Parent App (Beta) prototype

A beautiful, non-functional React Native + Expo prototype of the Class Window
parent experience. Text, color, type, the logo, and the wishlist illustration
are lifted directly from the Figma source (Class Window Mobile App, "Parent App -
Beta" frame, node 187:2242) so it matches pixel for pixel.

This is a visual prototype: tabs, the like button, and the report flow are
interactive, but nothing talks to a backend.

## Live link

Click through it on the web (no install):
**https://vickyrule22.github.io/classwindow-parent-app/**

(Hosted on GitHub Pages, set to `noindex` so it stays out of search results.
To re-deploy after changes, see "Re-deploy" below.)

## Screens

- **Home / Feed** : greeting, interactive class filter pills, teacher post cards
  with classroom photos, gradient avatars, tappable like, "You're all caught up".
- **Classes** : Lincoln Elementary roster with unread badges + "Add another class".
  Tapping a class jumps to the feed filtered to that teacher.
- **Wishlists** : "Wishlists Coming Soon!" empty state with the Figma illustration.
- **Profile** : parent card, notifications toggle, account settings, Sign Out.
- **Report a post** : two-step bottom-sheet modal (reason picker, then thank-you).

Tap the 3-dot menu on any post card to open the report modal. The feed photos in
`assets/figma/posts/` are AI-generated classroom scenes (candid, activity-focused,
no identifiable children).

## Run it

```bash
npm install
npx expo start
```

Then press `w` for web, `i` for the iOS simulator, or `a` for Android.

Or go straight to web:

```bash
npx expo start --web
```

Note: run each line on its own. Don't paste a line with a trailing
`# comment` into zsh, it treats the `#` as an argument and Expo errors with
"Invalid project root".

## Re-deploy

```bash
npx expo export -p web
cd dist && touch .nojekyll && cp index.html 404.html
printf 'User-agent: *\nDisallow: /\n' > robots.txt
# add the noindex meta to index.html, then push dist to the gh-pages branch
```

## Design tokens

Everything lives in `src/theme.ts` (colors, type, avatar gradients, shadows).
Fonts are Nunito (ExtraBold/Bold) for headings and Nunito Sans
(Regular/Medium/SemiBold/Bold/ExtraBold) for body, matching the Figma.

## Structure

```
App.tsx                      root: fonts, header, tab state, report modal
src/theme.ts                 design tokens
src/data.ts                  mock feed + class data (verbatim Figma copy)
src/components/               Logo, Avatar, AppHeader, BottomNav, PostCard, ClassCard, ReportModal
src/screens/                 Feed, Classes, Wishlists, Profile
assets/figma/                logo + wishlist illustration exported from Figma
```
