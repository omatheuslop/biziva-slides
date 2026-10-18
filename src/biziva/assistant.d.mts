export type AssistantOptions<T> = {
  title:string; description:string; placeholder:string; sourceUrl:string; instruction:string;
  parse(text:string):T; inspect():string[]; apply(data:T):void|Promise<void>;
};
export function mountAssistant<T>(host:HTMLElement,options:AssistantOptions<T>):()=>void;
export function parseJSON(text:string):unknown;
export function cleanText(value:unknown,max?:number):string;
