import { avatarGradients, colors } from './theme';

export type Post = {
  id: string;
  initials: string;
  gradient: [string, string];
  name: string;
  meta: string;
  time: string;
  imageColor: string;
  emoji: string;
  caption: string;
  likes: number;
  liked: boolean;
};

// Feed content, verbatim from the Figma frame (Parent App, Parent Feed).
export const posts: Post[] = [
  {
    id: 'p1',
    initials: 'SJ',
    gradient: avatarGradients.peach,
    name: 'Mrs. Sarah Johnson',
    meta: '2nd Grade · Room 14',
    time: '2h ago',
    imageColor: colors.postPeach,
    emoji: '🔬',
    caption:
      "Our Science Fair projects are really coming together! 🔬 Today we explored how plants grow toward light, every student had a prediction, and almost all of them were right.",
    likes: 15,
    liked: true,
  },
  {
    id: 'p2',
    initials: 'RP',
    gradient: avatarGradients.teal,
    name: 'Mr. Raj Patel',
    meta: 'PE · Gym & Field',
    time: 'Yesterday',
    imageColor: colors.postGreen,
    emoji: '🏃',
    caption:
      "Field Day was an absolute blast today! 🏃‍♀️ Every student gave 100%, we had relay races, tug of war, and the sack race was legendary. The teamwork made this PE teacher's heart full.",
    likes: 14,
    liked: false,
  },
  {
    id: 'p3',
    initials: 'MR',
    gradient: avatarGradients.purple,
    name: 'Ms. Maya Rivera',
    meta: 'Art · Studio 3',
    time: '2 days ago',
    imageColor: colors.postBlue,
    emoji: '🌻',
    caption:
      "Sunflower gallery week is officially open! 🌻 Every student created their own watercolor interpretation, no two are alike. We'll be displaying these in the hallway all month.",
    likes: 14,
    liked: false,
  },
];

export type ClassRow = {
  id: string;
  initials: string;
  gradient: [string, string];
  name: string;
  meta: string;
  school: string;
  unread: number;
  lastPost: string;
};

export const classes: ClassRow[] = [
  {
    id: 'c1',
    initials: 'SJ',
    gradient: avatarGradients.peach,
    name: 'Mrs. Sarah Johnson',
    meta: '2nd Grade · Room 14',
    school: 'Lincoln Elementary',
    unread: 3,
    lastPost: 'Last post: 2 hours ago',
  },
  {
    id: 'c2',
    initials: 'RP',
    gradient: avatarGradients.teal,
    name: 'Mr. Raj Patel',
    meta: 'PE · Gym & Field',
    school: 'Lincoln Elementary',
    unread: 1,
    lastPost: 'Last post: Yesterday',
  },
  {
    id: 'c3',
    initials: 'MR',
    gradient: avatarGradients.purple,
    name: 'Ms. Maya Rivera',
    meta: 'Art · Studio 3',
    school: 'Lincoln Elementary',
    unread: 3,
    lastPost: 'Last post: 2 days ago',
  },
];
