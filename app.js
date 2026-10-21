(() => {
  'use strict';
  const home=document.getElementById('home-view');
  const caseView=document.getElementById('case-view');
  const caseBody=document.getElementById('case-body');
  const cases=window.HR_CASES || [];
  const ui=window.HR_UI || {};
  const homeTitle=window.HR_SITE_TITLE || 'Hannah Reber · Digitale Strategie & Transformation';
  const escapeHTML=value=>String(value || '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function highlightText(value, phrases=[]) {
    let remaining=String(value || '');
    const result=[];
    while(remaining) {
      const matches=phrases.filter(phrase=>phrase).map(phrase=>({phrase,index:remaining.indexOf(phrase)})).filter(match=>match.index>=0).sort((a,b)=>a.index-b.index || b.phrase.length-a.phrase.length);
      const match=matches[0];
      if(!match) {result.push(escapeHTML(remaining));break;}
      result.push(escapeHTML(remaining.slice(0,match.index)),`<span class="text-marker">${escapeHTML(match.phrase)}</span>`);
      remaining=remaining.slice(match.index+match.phrase.length);
    }
    return result.join('');
  }
  let shownCase=null;
  let refreshInkGuards=()=>{};
  const navLinks=[...document.querySelectorAll('.site-header nav a:not([data-language-switch])')];
  function updateNavigation() {
    let current='';
    if(!home.hidden) {
      for(const section of document.querySelectorAll('.story-section')) {
        const rect=section.getBoundingClientRect();
        if(rect.top<=innerHeight*.4 && rect.bottom>100)current=section.id;
      }
    }
    navLinks.forEach(link=>{
      const active=link.hash==='#'+current;
      link.classList.toggle('is-current',active);
      if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    });
  }
  function route(initial=false) {
    const hash=location.hash.slice(1);
    const parts=hash.split('/');
    const id=(parts[0]==='fallstudie'||parts[0]==='projekte')?parts[1]:null;
    const selected=cases.find(c=>c.id===id);
    const wasCase=shownCase!==null;
    const previousCase=shownCase;
    if(selected) {
      home.hidden=true;caseView.hidden=false;
      if(shownCase!==selected.id) {
        caseBody.dataset.markerTone=selected.markerTone || 'yellow';
        const facts=Array.isArray(selected.facts) ? selected.facts : [];
        const overview=facts.length ? `<dl class="case-facts">${facts.map(fact=>`<div><dt>${escapeHTML(fact.label)}</dt><dd>${escapeHTML(fact.value)}</dd></div>`).join('')}</dl>` : `<p class="case-lede">${escapeHTML(selected.role)}</p>`;
        caseBody.innerHTML=`<header class="case-heading" data-ink-guard><h1 id="case-title" tabindex="-1">${escapeHTML(selected.title)}</h1><p class="project-name">${escapeHTML(selected.projectName)}</p>${overview}</header>${selected.sections.map(section=>`<section class="case-section" data-ink-guard><h2>${escapeHTML(section.title)}</h2><p data-marker-scope>${highlightText(section.text,section.highlights)}</p></section>`).join('')}<div class="case-end" data-ink-guard><a href="#fallstudien">${escapeHTML(ui.allCases || 'Alle Fallstudien')} <span aria-hidden="true">→</span></a></div>`;
        window.scrollTo({top:0,behavior:'instant'});
        if(!initial)document.getElementById('case-title').focus({preventScroll:true});
      }
      shownCase=selected.id;
      document.title=selected.shortTitle+' · Hannah Reber';
    } else {
      shownCase=null;home.hidden=false;caseView.hidden=true;
      document.title=homeTitle;
      if(wasCase || parts[0]==='projekte'||parts[0]==='lebenslauf' || ['start','arbeitsweise','fallstudien','skills','technical-background','werdegang','kontakt'].includes(hash)) {
        const isTechnicalLink=hash==='skills'||hash==='technical-background';
        const target=document.getElementById(isTechnicalLink?'technical-background':parts[0]==='projekte'?'fallstudien':parts[0]==='lebenslauf'?'werdegang':hash) || document.getElementById('start');
        if(isTechnicalLink && target.tagName==='DETAILS')target.open=true;
        requestAnimationFrame(()=>{
          target.scrollIntoView({behavior:'instant',block:'start'});
          if(wasCase && target.id==='fallstudien')home.querySelector(`.project-link[href="#fallstudie/${previousCase}"]`)?.focus({preventScroll:true});
          refreshInkGuards();updateNavigation();
        });
      }
    }
    requestAnimationFrame(()=>{refreshInkGuards();updateNavigation();});
  }
  window.addEventListener('hashchange',()=>route());
  document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();document.getElementById('main-content').focus();});
  document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{refreshInkGuards();updateNavigation();}));
  // The address is shown as a drawing; the native button still opens an email draft.
  document.getElementById('email-contact')?.addEventListener('click',()=>{
    const address=[112,111,115,116,64,104,97,110,110,97,104,114,101,98,101,114,46,100,101].map(code=>String.fromCharCode(code)).join('');
    window.location.href='mailto:'+address;
  });
  const dogQuote=document.getElementById('dog-quote');
  const nextDogQuote=document.getElementById('dog-quote-next');
  const dogImageButton=document.getElementById('dog-image-next');
  const dogQuotes=window.HR_DOG_QUOTES || [];
  if(dogQuote && nextDogQuote && dogQuotes.length>1) {
    let quoteIndex=0;
    nextDogQuote.hidden=false;
    function showNextDogQuote() {
      quoteIndex=(quoteIndex+1)%dogQuotes.length;
      dogQuote.textContent=dogQuotes[quoteIndex];
    }
    nextDogQuote.addEventListener('click',showNextDogQuote);
    if(dogImageButton) {
      dogImageButton.disabled=false;
      dogImageButton.addEventListener('click',showNextDogQuote);
    }
  }
  const canvas=document.getElementById('pointer-colour');
  const context=canvas.getContext('2d',{alpha:true});
  const toggle=document.getElementById('motion-toggle');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const readingEffect=()=>['wolken','fokus','atem','horizont','randlicht','reading-lab','reading-accents'].includes(document.documentElement.dataset.effect);
  let enabled=readingEffect() || !reduced.matches;
  let particles=[];
  let guards=[];
  let lastPoint=null;
  let animation=0;
  let previousFrame=0;
  let hueStep=0;
  const palette=[[69,110,251],[133,96,235],[237,112,175],[248,158,84]];
  function canvasAllowed() {
    const effect=document.documentElement.dataset.effect || 'original';
    return enabled && !reduced.matches && fine.matches && (effect==='original' || effect==='maus');
  }
  function clearCanvas() {
    if(animation)cancelAnimationFrame(animation);
    animation=0;particles=[];lastPoint=null;previousFrame=0;
    context?.clearRect(0,0,innerWidth,innerHeight);
  }
  function syncToggle() {
    toggle.textContent=enabled?(ui.motionOff || 'Farbspiel ausschalten'):(ui.motionOn || 'Farbspiel einschalten');
    toggle.setAttribute('aria-pressed',String(!enabled));
    document.documentElement.dataset.colour=enabled?'on':'off';
  }
  function refreshGuards() {
    guards=[...document.querySelectorAll('[data-ink-guard]')].map(element=>element.getBoundingClientRect()).filter(rect=>rect.width>0&&rect.height>0&&rect.bottom>-80&&rect.top<innerHeight+80).map(rect=>({left:rect.left-12,right:rect.right+12,top:rect.top-12,bottom:rect.bottom+12}));
  }
  refreshInkGuards=refreshGuards;
  function distanceToContent(x,y) {
    let nearest=160;
    for(const rect of guards) {
      const dx=Math.max(rect.left-x,0,x-rect.right);
      const dy=Math.max(rect.top-y,0,y-rect.bottom);
      nearest=Math.min(nearest,Math.hypot(dx,dy));
    }
    return nearest;
  }
  function resizeCanvas() {
    const scale=Math.min(devicePixelRatio || 1,1.5);
    canvas.width=Math.ceil(innerWidth*scale);canvas.height=Math.ceil(innerHeight*scale);
    canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';
    context?.setTransform(scale,0,0,scale,0,0);
    particles=[];lastPoint=null;refreshGuards();
  }
  function paint(now) {
    animation=0;
    if(!canvasAllowed() || !context) {clearCanvas();return;}
    if(now-previousFrame<30) {animation=requestAnimationFrame(paint);return;}
    previousFrame=now;
    context.clearRect(0,0,innerWidth,innerHeight);
    particles=particles.filter(p=>now-p.born<p.life);
    for(const p of particles) {
      const age=(now-p.born)/p.life;
      const x=p.x+p.vx*age*8,y=p.y+p.vy*age*8;
      const quiet=document.documentElement.dataset.effect==='maus';
      const radius=Math.min(p.radius*(quiet?.75:1)*(1+age*.55),distanceToContent(x,y)*.88);
      if(radius<5)continue;
      const alpha=(quiet?.19:.28)*Math.pow(1-age,1.7);
      const gradient=context.createRadialGradient(x,y,0,x,y,radius);
      gradient.addColorStop(0,`rgba(${p.colour},${alpha})`);
      gradient.addColorStop(.45,`rgba(${p.colour},${alpha*.46})`);
      gradient.addColorStop(1,`rgba(${p.colour},0)`);
      context.fillStyle=gradient;context.beginPath();context.arc(x,y,radius,0,Math.PI*2);context.fill();
    }
    if(particles.length)animation=requestAnimationFrame(paint);
  }
  function addInk(x,y,vx,vy,now) {
    const distance=distanceToContent(x,y);
    if(distance<14)return;
    const phase=(hueStep++/27)%palette.length;
    const start=palette[Math.floor(phase)],end=palette[(Math.floor(phase)+1)%palette.length];
    const fraction=phase%1;
    const colour=start.map((channel,i)=>Math.round(channel+(end[i]-channel)*fraction)).join(',');
    particles.push({x,y,vx,vy,born:now,life:1800,radius:Math.min(54,22+Math.hypot(vx,vy)*.8),colour});
    if(particles.length>100)particles.splice(0,particles.length-100);
  }
  document.addEventListener('pointermove',event=>{
    if(!canvasAllowed() || event.pointerType!=='mouse' || !context)return;
    const now=performance.now(),x=event.clientX,y=event.clientY;
    if(lastPoint && now-lastPoint.time<150) {
      const dx=x-lastPoint.x,dy=y-lastPoint.y;
      const length=Math.hypot(dx,dy);
      if(length>1&&length<320) {
        const steps=Math.min(18,Math.ceil(length/8));
        for(let i=1;i<=steps;i++)addInk(lastPoint.x+dx*i/steps,lastPoint.y+dy*i/steps,dx/steps,dy/steps,now);
      }
    } else addInk(x,y,0,0,now);
    lastPoint={x,y,time:now};
    if(!animation && particles.length)animation=requestAnimationFrame(paint);
  },{passive:true});
  document.addEventListener('pointerdown',event=>{
    if(canvasAllowed() && event.pointerType==='mouse' && !event.target.closest('a,button,summary,input,textarea,[data-ink-guard]'))event.preventDefault();
  });
  document.addEventListener('pointerleave',()=>{lastPoint=null;},{passive:true});
  toggle.addEventListener('click',()=>{
    enabled=!enabled;syncToggle();
    if(!canvasAllowed())clearCanvas();
  });
  reduced.addEventListener('change',event=>{if(!readingEffect())enabled=!event.matches;syncToggle();if(!canvasAllowed())clearCanvas();});
  fine.addEventListener('change',()=>{if(!canvasAllowed())clearCanvas();});
  window.addEventListener('hr-colour-preview-change',()=>{clearCanvas();refreshGuards();});
  let scrollFrame=0;
  window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;refreshGuards();updateNavigation();});},{passive:true});
  window.addEventListener('resize',()=>{resizeCanvas();updateNavigation();},{passive:true});
  window.addEventListener('load',refreshGuards);
  resizeCanvas();syncToggle();route(true);
})();
