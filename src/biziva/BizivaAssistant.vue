<template><div ref="host"></div></template>
<script lang="ts" setup>
import {onMounted,onBeforeUnmount,ref} from 'vue'
import {nanoid} from 'nanoid'
import {useSlidesStore,useSnapshotStore} from '@/store'
import {mountAssistant} from './assistant.mjs'
import {parseDeck,nativeSlides,inspectDeck} from './deck.mjs'
import type {Slide} from '@/types/slides'
const host=ref<HTMLDivElement>()
const slides=useSlidesStore()
const snapshot=useSnapshotStore()
let cleanup:(()=>void)|undefined
onMounted(()=>{
  cleanup=mountAssistant(host.value!,{
    title:'Biziva Slides',
    description:'Monte uma apresentação comercial com textos editáveis e visual escuro. Os slides atuais são preservados e a exportação PPTX continua disponível.',
    placeholder:'Apresente um serviço de criação de sites para restaurantes, sem inventar resultados ou preços…',
    sourceUrl:'https://github.com/omatheuslop/biziva-slides',
    instruction:'Retorne apenas JSON {"slides":[{"title":"Título","bullets":["Ponto claro"],"cta":"Próximo passo"}]}. Entre 1 e 8 slides. Até 4 bullets por slide. Limites: título 55, bullet 70 e cta 80 caracteres. Crie narrativa comercial com problema, proposta, benefícios e próximo passo. Não invente preço, estatísticas, depoimentos ou garantias. Sem HTML.',
    parse:parseDeck,
    inspect:()=>inspectDeck(slides.slides,slides.viewportSize,slides.viewportRatio),
    apply:(draft:{title:string;bullets:string[];cta:string}[])=>{
      if(!slides.slides.length)throw Error('Aguarde o carregamento da apresentação.')
      slides.addSlide(nativeSlides(draft,slides.viewportSize,slides.viewportRatio,()=>nanoid(10)) as Slide[])
      snapshot.addSnapshot()
    }
  })
})
onBeforeUnmount(()=>cleanup?.())
</script>
