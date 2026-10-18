import type {Slide} from '../types/slides';
export type DeckDraft={title:string;bullets:string[];cta:string}[];
export function parseDeck(text:string):DeckDraft;
export function nativeSlides(draft:DeckDraft,width:number,ratio:number,id:()=>string):Slide[];
export function inspectDeck(slides:Slide[],width:number,ratio:number):string[];
