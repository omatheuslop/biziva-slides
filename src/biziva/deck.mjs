import {parseJSON,cleanText} from './assistant.mjs'
export function parseDeck(text){
  const data=parseJSON(text)
  if(!Array.isArray(data.slides)||!data.slides.length||data.slides.length>8)throw Error('Use entre 1 e 8 slides por rascunho.')
  return data.slides.map(slide=>{
    if(!Array.isArray(slide.bullets)||!slide.bullets.length||slide.bullets.length>4)throw Error('Use entre 1 e 4 pontos por slide.')
    return {title:cleanText(slide.title,55),bullets:slide.bullets.map(value=>cleanText(value,70)),cta:cleanText(slide.cta,80)}
  })
}
const escape=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
export function nativeSlides(draft,width,ratio,id){
  const height=width*ratio
  return draft.map((slide,index)=>({
    id:id(),background:{type:'solid',color:'#101827'},
    elements:[
      {id:id(),type:'text',left:width*.065,top:height*.09,width:width*.87,height:height*.23,rotate:0,content:`<p style="font-size:${width*.042}px;font-weight:700;color:#D7F997">${escape(slide.title)}</p>`,defaultFontName:'Arial',defaultColor:'#D7F997',textType:'title'},
      {id:id(),type:'text',left:width*.065,top:height*.36,width:width*.87,height:height*.43,rotate:0,content:slide.bullets.map(text=>`<p style="font-size:${width*.024}px;color:#EEF2FA">• ${escape(text)}</p>`).join(''),defaultFontName:'Arial',defaultColor:'#EEF2FA',lineHeight:1.4,textType:'content'},
      {id:id(),type:'text',left:width*.065,top:height*.85,width:width*.8,height:height*.12,rotate:0,content:`<p style="font-size:${width*.019}px;color:#D7F997">${escape(slide.cta)}</p>`,defaultFontName:'Arial',defaultColor:'#D7F997',textType:'footer'},
      {id:id(),type:'text',left:width*.91,top:height*.88,width:width*.05,height:height*.06,rotate:0,content:`<p style="font-size:${width*.014}px;color:#A5B3CA">${index+1}</p>`,defaultFontName:'Arial',defaultColor:'#A5B3CA',textType:'footer'},
    ]
  }))
}
export function inspectDeck(slides,width,ratio){
  const issues=[];const height=width*ratio
  slides.forEach((slide,index)=>{
    const text=slide.elements.filter(element=>element.type==='text').map(element=>element.content.replace(/<[^>]*>/g,'')).join(' ')
    if(text.length>650)issues.push(`Slide ${index+1}: mais de 650 caracteres; considere dividir a mensagem.`)
    const outside=slide.elements.filter(element=>element.left<0||element.top<0||element.left+element.width>width+1||element.top+element.height>height+1)
    if(outside.length)issues.push(`Slide ${index+1}: ${outside.length} elementos ultrapassam a área. Verifique antes de exportar.`)
    if(!text.trim()&&!slide.elements.some(element=>element.type==='image'))issues.push(`Slide ${index+1}: sem texto ou imagem principal.`)
  })
  return issues
}
