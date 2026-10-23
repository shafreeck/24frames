import type {Demo} from './kit';
import {moves} from './moves';
import {frame} from './frame';
import {time} from './time';
import LegacyArt from './legacy';

const ALL: Record<string, Demo> = {...moves, ...frame, ...time};

const legacy = (dim: string, id: string): Demo => ({
  note: '结构示意。',
  art: () => <LegacyArt dim={dim} id={id} seed={0} />,
});

export function findDemo(id: string, dim: string): Demo {
  return ALL[id] ?? legacy(dim, id);
}

export function demoNote(id: string, dim: string) {
  return findDemo(id, dim).note;
}

export const demoIds = () => Object.keys(ALL);
