/** Scroll scenes derived from the reference process and portfolio passages. */
export function initMotion(initialPaused) {
  const gsap=window.gsap, ScrollTrigger=window.ScrollTrigger;
  let paused=initialPaused, context, entered=false;
  const root=document.documentElement;
  const canvas=document.getElementById('road-canvas');
  const ctx=canvas.getContext('2d');
  function drawRoad(progress=0) {
    if (!ctx) return;
    const width=canvas.width,height=canvas.height;
    ctx.clearRect(0,0,width,height); ctx.fillStyle='#fff';
    for(let row=0;row<95;row++) {
      const depth=((row/95+progress*.7)%1);
      const y=height*Math.pow(depth,1.7);
      const perspective=Math.pow(depth,1.35);
      const center=width*.32+Math.sin(depth*3+progress*5)*width*.035;
      const halfWidth=8+perspective*(40+progress*100);
      const count=Math.max(1,Math.floor(halfWidth/4));
      const marker=row%17===0;
      for(let col=-count;col<=count;col++) {
        const x=center+col*4.5*(marker?2:1);
        ctx.globalAlpha=.18+depth*.65;
        ctx.beginPath();ctx.arc(x,y,.45+perspective*1.6,0,Math.PI*2);ctx.fill();
      }
    }
    ctx.globalAlpha=1;
  }
  drawRoad(0);
  function rebuild() {
    context?.revert();
    root.classList.remove('motion-ready');
    if(paused || !gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    root.classList.add('motion-ready');
    context=gsap.context(()=>{
      if(!entered) {
        root.classList.add('arrival-ready');
        setTimeout(()=>root.classList.remove('arrival-ready'),1500);
        gsap.from('.studio-intro',{opacity:0,y:18,duration:.8,delay:.45,ease:'power3.out'});
        gsap.from('.studio-offer',{opacity:0,y:12,duration:.6,delay:.6,ease:'power3.out'});
        gsap.from('.studio-wordmark',{opacity:0,yPercent:30,duration:1.2,delay:.2,ease:'expo.out'});
        entered=true;
      }
      gsap.to('.sphere-stage',{yPercent:18,opacity:.4,ease:'none',scrollTrigger:{trigger:'.studio-hero',start:'top top',end:'bottom top',scrub:true}});
      document.querySelectorAll('.benefit-art').forEach(art=>{
        if(!art.children.length) for(let i=0;i<20;i++){const bar=document.createElement('span');bar.style.setProperty('--i',i);art.append(bar);}
        gsap.from(art.children,{scaleY:.15,opacity:.2,stagger:.025,duration:1,ease:'power3.out',scrollTrigger:{trigger:art,start:'top 88%',once:true}});
      });
      const process=document.querySelector('.process-region');
      const stage=process.querySelector('.process-stage');
      const heading=process.querySelector('.process-heading');
      const copies=[...process.querySelectorAll('.process-copy')];
      const marks=[...process.querySelectorAll('.process-progress span')];
      gsap.set(copies,{opacity:0});
      const processTimeline=gsap.timeline({scrollTrigger:{trigger:process,start:'top top',end:'bottom bottom',pin:stage,pinSpacing:false,scrub:.7,invalidateOnRefresh:true,onUpdate:self=>{
        drawRoad(self.progress);
        marks.forEach((mark,index)=>mark.classList.toggle('active',Math.min(2,Math.floor(self.progress*4))===index));
      }}});
      processTimeline.to(heading,{opacity:0,y:-35,duration:.5},.55);
      processTimeline.from('.process-date',{opacity:0,duration:.5},.7);
      copies.forEach((copy,index)=>{
        processTimeline.fromTo(copy,{opacity:0,y:25},{opacity:1,y:0,duration:.45,ease:'power2.out'},1+index*2.25);
        if(index<copies.length-1) processTimeline.to(copy,{opacity:0,y:-25,duration:.4,ease:'power2.in'},2.7+index*2.25);
      });
      processTimeline.to({}, {duration:1.1});
      const work=document.querySelector('.work-region');
      const workStage=work.querySelector('.work-stage');
      const planes=[...work.querySelectorAll('.work-plane')];
      gsap.set(work,{background:'transparent'});
      gsap.set('.work-title',{color:'#fff'});
      gsap.set('.work-title h2 span',{color:'#aaa'});
      gsap.set(planes,{opacity:0,transformPerspective:1400,transformOrigin:'center center'});
      const workTimeline=gsap.timeline({scrollTrigger:{trigger:work,start:'top top',end:'bottom bottom',pin:workStage,pinSpacing:false,scrub:1,invalidateOnRefresh:true,onUpdate:self=>{document.body.classList.toggle('light-nav',self.progress>.12);}}});
      workTimeline.to('.field-light',{opacity:1,duration:2},0).to('.work-title',{color:'#111',duration:2},0).to('.work-title h2 span',{color:'#fe4701',duration:2},0);
      workTimeline.fromTo('.work-title',{scale:.9},{scale:1,duration:3,ease:'none'},0);
      planes.forEach((plane,index)=>{
        const start=1+index*3.1;
        workTimeline.fromTo(plane,{xPercent:220,yPercent:-50,z:-650,rotationY:-65,rotationZ:7,opacity:0},{xPercent:75,yPercent:-50,z:-170,rotationY:-35,rotationZ:1,opacity:1,duration:2.5,ease:'none'},start);
        workTimeline.to(plane,{xPercent:-75,z:120,rotationY:25,rotationZ:-4,duration:3.2,ease:'none'},start+2.5);
        workTimeline.to(plane,{xPercent:-260,z:-300,rotationY:65,rotationZ:-8,opacity:0,duration:2.7,ease:'none'},start+5.7);
      });
      workTimeline.to('.work-title',{opacity:0,y:-30,duration:1},18.5);
      workTimeline.to({}, {duration:.8});
      ScrollTrigger.create({trigger:'.light-region',start:'top top',onEnter:()=>document.body.classList.add('light-nav'),onLeaveBack:()=>document.body.classList.remove('light-nav')});
      document.querySelectorAll('.config-heading,.faq-group,.addon-card,.plan-card,.footer-statement').forEach(element=>{
        gsap.from(element,{opacity:0,y:25,duration:.7,ease:'power3.out',scrollTrigger:{trigger:element,start:'top 94%',once:true}});
      });
      gsap.to('.work-halo',{xPercent:12,yPercent:8,duration:14,yoyo:true,repeat:-1,ease:'sine.inOut'});
    });
    ScrollTrigger.refresh();
    document.fonts?.ready.then(()=>ScrollTrigger.refresh());
  }
  rebuild();
  return {setPaused(value){if(value===paused)return;paused=value;rebuild();}};
}
