export type SlideBlock =
  | { type: 'bullets'; items: string[] }
  | { type: 'image'; src?: string; caption?: string }
  | { type: 'figure'; title: string; note?: string }
  | { type: 'text'; variant: 'subtitle' | 'body' | 'quote'; text: string };

export type Slide = {
  id: string;
  section: string;
  title: string;
  blocks: SlideBlock[];
  todo?: boolean;
};

export type SlideSection = {
  name: string;
  slideIds: string[];
};
