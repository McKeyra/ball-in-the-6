/* Post System */

export interface PostAuthor {
  username: string;
  handle: string;
  avatarUrl: string;
  verified?: boolean;
}

export interface TeamData {
  name: string;
  score: number;
  logo: string;
  record: string;
  color: string;
}

export interface PlayPost {
  id: string;
  type: 'play';
  author: PostAuthor;
  imageUrl: string;
  caption: string;
  score: number;
  assists: number;
  timestamp: string;
}

export interface FullWidthPost {
  id: string;
  type: 'fullwidth';
  author: PostAuthor;
  imageUrl: string;
  caption: string;
  score: number;
  assists: number;
  timestamp: string;
}

export interface NoBleedPost {
  id: string;
  type: 'nobleed';
  author: PostAuthor;
  imageUrl: string;
  caption: string;
  score: number;
  assists: number;
  commentCount: number;
  timestamp: string;
}

export interface HeaderFillPost {
  id: string;
  type: 'headerfill';
  author: PostAuthor;
  imageUrl: string;
  caption: string;
  score: number;
  assists: number;
  drops: number;
  timestamp: string;
}

export interface SliderPost {
  id: string;
  type: 'slider';
  author: PostAuthor;
  imageUrls: string[];
  caption: string;
  score: number;
  assists: number;
  drops: number;
  timestamp: string;
}

export interface GameResultPost {
  id: string;
  type: 'game';
  teamA: TeamData;
  teamB: TeamData;
  gameStatus: string;
  venue: string;
  mvp: { name: string; stats: string; avatar: string };
  impactScore: number;
}

export type FeedPost = PlayPost | FullWidthPost | NoBleedPost | HeaderFillPost | SliderPost | GameResultPost;

export type FeedFilter = 'all' | 'plays' | 'games' | 'trending';

export interface Court {
  id: string;
  name: string;
  area: string;
  address: string;
  type: 'outdoor' | 'indoor';
  courts: number;
  activePlayers: number;
  hot: boolean;
  imageUrl: string;
  rating: number;
}

export interface Player {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  impactScore: number;
  assistsGiven: number;
  playsPosted: number;
  rank: number;
  streak: number;
  verified: boolean;
  color: string;
}

export type GameLevel = 'pro' | 'collegiate' | 'highschool' | 'elementary';

export interface Game {
  id: string;
  teamA: TeamData;
  teamB: TeamData;
  status: 'live' | 'upcoming' | 'final';
  level: GameLevel;
  venue: string;
  time: string;
  mvp?: { name: string; stats: string; avatar: string };
  impactScore?: number;
}
