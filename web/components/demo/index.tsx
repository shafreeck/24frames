import type {Demo} from './kit';
import {moves} from './moves';
import {frame} from './frame';
import {time} from './time';
import {looks} from './looks';
import {craft} from './craft';

const ALL: Record<string, Demo> = {...moves, ...frame, ...time, ...looks, ...craft};

// 新条目还没画演示时的占位：一个空取景框，不报错
const placeholder = (): Demo => ({
  note: '这一条的演示线稿还没画。',
  art: () => <rect className="sa-acc sa-dash" x={40} y={30} width={240} height={120} rx={4} />,
});

export function findDemo(id: string, _dim?: string): Demo {
  return ALL[id] ?? placeholder();
}

export function demoNote(id: string, dim: string) {
  return findDemo(id, dim).note;
}

export const demoIds = () => Object.keys(ALL);
