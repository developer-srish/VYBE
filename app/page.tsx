'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, ChevronDown, Download, FlipHorizontal2, GalleryHorizontalEnd, Headphones, ImagePlus, Layers3, Mic2, Music2, Play, Plus, RotateCcw, Search, Settings2, Sparkles, Square, Upload, Video, Volume2, X, Zap, Scissors, SlidersHorizontal, Type, Smile, WandSparkles } from 'lucide-react';

type Tab = 'camera'|'latest'|'music'|'edit';
type Filter = {name:string; css:string};
const filters:Filter[] = [
 {name:'Original',css:'none'}, {name:'Cinema',css:'contrast(1.14) saturate(.88) brightness(.92)'}, {name:'Glow',css:'brightness(1.08) saturate(1.25) contrast(1.03)'}, {name:'Noir',css:'grayscale(1) contrast(1.22)'}, {name:'Warm',css:'sepia(.18) saturate(1.28) hue-rotate(-8deg)'}, {name:'Cool',css:'saturate(.9) hue-rotate(12deg) brightness(1.02)'}, {name:'Dream',css:'brightness(1.06) saturate(.84) blur(.2px)'}
];
const demoEdits = [
 {title:'Neon nights',author:'@vybe',tag:'TRENDING',grad:'linear-gradient(145deg,#131a32,#5d2f8f 55%,#0b0b10)'},
 {title:'Slow motion',author:'@editlab',tag:'NEW',grad:'linear-gradient(145deg,#10221e,#277c70 55%,#070b0b)'},
 {title:'Golden hour',author:'@framebyframe',tag:'POPULAR',grad:'linear-gradient(145deg,#4a2712,#e38a2d 58%,#160d08)'},
 {title:'City pulse',author:'@motionfx',tag:'NEW',grad:'linear-gradient(145deg,#101827,#2462a6 55%,#080a0e)'}
];

export default function Home(){
 const [tab,setTab]=useState<Tab>('camera');
 const [stream,setStream]=useState<MediaStream|null>(null);
 const [recording,setRecording]=useState(false);
 const [recorded,setRecorded]=useState<string|null>(null);
 const [file,setFile]=useState<File|null>(null);
 const [mediaUrl,setMediaUrl]=useState<string|null>(null);
 const [filter,setFilter]=useState(0);
 const [facing,setFacing]=useState<'user'|'environment'>('environment');
 const [duration,setDuration]=useState(0);
 const [trim,setTrim]=useState<[number,number]>([0,10]);
 const [music,setMusic]=useState<File|null>(null);
 const [musicUrl,setMusicUrl]=useState<string|null>(null);
 const [playingMusic,setPlayingMusic]=useState(false);
 const [flash,setFlash]=useState(false);
 const [toast,setToast]=useState('');
 const videoRef=useRef<HTMLVideoElement>(null);
 const mediaRef=useRef<HTMLVideoElement>(null);
 const recorderRef=useRef<MediaRecorder|null>(null);
 const chunksRef=useRef<Blob[]>([]);
 const musicRef=useRef<HTMLAudioElement>(null);
 const timerRef=useRef<number|null>(null);
 const fileInput=useRef<HTMLInputElement>(null);
 const musicInput=useRef<HTMLInputElement>(null);

 const showToast=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(''),2200)};
 const startCamera=async()=>{
   try{
    stream?.getTracks().forEach(t=>t.stop());
    const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:facing,width:{ideal:1080},height:{ideal:1920}},audio:true});
    setStream(s); if(videoRef.current){videoRef.current.srcObject=s; await videoRef.current.play();}
   }catch(e){showToast('Camera permission was blocked. Use HTTPS and allow camera + microphone.');}
 };
 useEffect(()=>{if(tab==='camera'&&!stream) startCamera(); return()=>{};},[tab,facing]);
 useEffect(()=>()=>{stream?.getTracks().forEach(t=>t.stop()); if(timerRef.current)clearInterval(timerRef.current)},[stream]);
 const beginRecord=()=>{
   if(!stream)return showToast('Start the camera first');
   const options=MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?{mimeType:'video/webm;codecs=vp9,opus'}:undefined;
   const r=new MediaRecorder(stream,options); chunksRef.current=[]; recorderRef.current=r;
   r.ondataavailable=e=>{if(e.data.size)chunksRef.current.push(e.data)};
   r.onstop=()=>{const blob=new Blob(chunksRef.current,{type:r.mimeType||'video/webm'}); const url=URL.createObjectURL(blob);setRecorded(url);setFile(new File([blob],'vybe-recording.webm',{type:blob.type}));setMediaUrl(url);setTab('edit');setDuration(0);setTrim([0,10]);};
   r.start(250); setRecording(true); setDuration(0); const started=Date.now(); timerRef.current=window.setInterval(()=>setDuration(Math.floor((Date.now()-started)/1000)),250);
 };
 const stopRecord=()=>{recorderRef.current?.stop();setRecording(false);if(timerRef.current)clearInterval(timerRef.current)};
 const pickVideo=(f:File)=>{if(!f.type.startsWith('video/'))return; const url=URL.createObjectURL(f);setFile(f);setMediaUrl(url);setRecorded(null);setTab('edit');setDuration(0);setTrim([0,10]);};
 const onVideoLoad=()=>{const d=mediaRef.current?.duration||10;setDuration(d);setTrim([0,Math.min(10,d)])};
 const toggleMusic=()=>{if(!musicRef.current)return; if(playingMusic){musicRef.current.pause();setPlayingMusic(false)}else{musicRef.current.currentTime=0;musicRef.current.play();setPlayingMusic(true)}};
 const chooseMusic=(f:File)=>{if(!f.type.startsWith('audio/'))return;const u=URL.createObjectURL(f);setMusic(f);setMusicUrl(u);showToast('Music added to your edit')};
 const exportVideo=async()=>{
   if(!mediaUrl||!mediaRef.current)return;
   const v=mediaRef.current; const canvas=document.createElement('canvas'); canvas.width=720;canvas.height=1280;const ctx=canvas.getContext('2d');if(!ctx)return;
   const out=canvas.captureStream(30); let audioContext:AudioContext|undefined; let dest:MediaStreamAudioDestinationNode|undefined;
   try{audioContext=new AudioContext();dest=audioContext.createMediaStreamDestination();const src=audioContext.createMediaElementSource(v);src.connect(dest);src.connect(audioContext.destination);dest.stream.getAudioTracks().forEach(t=>out.addTrack(t));}catch{}
   const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?'video/webm;codecs=vp9,opus':'video/webm'; const rec=new MediaRecorder(out,{mimeType:mime});const chunks:Blob[]=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
   const start=Math.max(0,trim[0]), end=Math.min(duration||v.duration,trim[1]);v.currentTime=start; await v.play();
   rec.start(250); const draw=()=>{ctx.filter=filters[filter].css==='none'?'none':filters[filter].css;ctx.drawImage(v,0,0,canvas.width,canvas.height);if(v.currentTime<end&& !v.paused)requestAnimationFrame(draw)};draw();
   await new Promise<void>(resolve=>{const stop=()=>{v.removeEventListener('timeupdate',stop);rec.stop();v.pause();resolve()};v.addEventListener('timeupdate',()=>{if(v.currentTime>=end)stop()})});
   await new Promise(r=>setTimeout(r,350));const blob=new Blob(chunks,{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='vybe-edit.webm';a.click();showToast('Exported your edited video');audioContext?.close();
 };
 const durationLabel=(s:number)=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
 const activeMedia=mediaUrl||recorded;
 return <main className="app">
   {toast&&<div className="toast">{toast}</div>}
   {tab==='camera'&&<section className="cameraScreen">
     <video ref={videoRef} className="cameraPreview" playsInline muted style={{filter:flash?'brightness(1.15)':undefined}} />
     <div className="cameraShade"/>
     <header className="cameraTop"><button className="brand" onClick={()=>showToast('VYBE Studio')}>VYBE<span>•</span></button><div className="topActions"><button className={flash?'active':''} onClick={()=>setFlash(!flash)}><Zap size={19}/></button><button onClick={()=>showToast('Settings coming next')}><Settings2 size={19}/></button></div></header>
     {recording&&<div className="recordingPill"><i/> REC {durationLabel(duration)}</div>}
     <div className="cameraControls"><button className="roundSmall" onClick={()=>setFacing(facing==='user'?'environment':'user')}><FlipHorizontal2/></button><button className={'shutter '+(recording?'recording':'')} onClick={recording?stopRecord:beginRecord}><span/></button><button className="roundSmall" onClick={()=>fileInput.current?.click()}><GalleryHorizontalEnd/></button></div>
     <div className="cameraModes"><button className="selected">VIDEO</button><button>PHOTO</button><button>PORTRAIT</button></div>
   </section>}
   {tab==='latest'&&<Latest onUse={(g)=>{showToast(`Template “${g}” selected`);setTab('camera')}}/>}
   {tab==='music'&&<MusicPanel music={music} musicUrl={musicUrl} playing={playingMusic} onToggle={toggleMusic} onPick={()=>musicInput.current?.click()} />}
   {tab==='edit'&&<Editor activeMedia={activeMedia} mediaRef={mediaRef} filter={filter} setFilter={setFilter} duration={duration} trim={trim} setTrim={setTrim} onLoad={onVideoLoad} onExport={exportVideo} music={music} musicUrl={musicUrl} playing={playingMusic} onToggleMusic={toggleMusic} onAddMusic={()=>musicInput.current?.click()} />}
   <input ref={fileInput} hidden type="file" accept="video/*,image/*" onChange={e=>{const f=e.target.files?.[0];if(f&&f.type.startsWith('video/'))pickVideo(f)}}/>
   <input ref={musicInput} hidden type="file" accept="audio/*" onChange={e=>{const f=e.target.files?.[0];if(f)chooseMusic(f)}}/>
   {tab!=='camera'&&<button className="floatingCamera" onClick={()=>setTab('camera')}><Camera size={21}/></button>}
   <nav className="bottomNav">
    <button className={tab==='latest'?'active':''} onClick={()=>setTab('latest')}><Sparkles/><span>Latest</span></button>
    <button className={tab==='music'?'active':''} onClick={()=>setTab('music')}><Music2/><span>Music</span></button>
    <button className="create" onClick={()=>setTab('camera')}><Plus/></button>
    <button className={tab==='edit'?'active':''} onClick={()=>activeMedia?setTab('edit'):showToast('Record or import a video first')}><Scissors/><span>Edit</span></button>
    <button onClick={()=>fileInput.current?.click()}><ImagePlus/><span>Gallery</span></button>
   </nav>
 </main>
}

function Latest({onUse}:{onUse:(s:string)=>void}){return <section className="page latestPage"><header className="pageHead"><div><p className="eyebrow">DISCOVER</p><h1>Latest edits</h1></div><button className="iconBtn"><Search/></button></header><div className="heroCard"><div className="heroCopy"><span className="pill">TODAY'S DROP</span><h2>Make it<br/><em>move.</em></h2><p>Fresh templates, transitions and sounds for your next edit.</p><button onClick={()=>onUse('Motion Pack')}>Try the pack <ChevronDown size={16}/></button></div><div className="heroOrb">✦</div></div><div className="sectionTitle"><h3>Trending now</h3><span>See all</span></div><div className="editGrid">{demoEdits.map((e,i)=><button className="editCard" key={e.title} onClick={()=>onUse(e.title)}><div className="fakeThumb" style={{background:e.grad}}><div className="gridLines"/><span>{i===0?'▶':i===1?'↗':i===2?'✦':'●'}</span><small>{e.tag}</small></div><strong>{e.title}</strong><p>{e.author}</p></button>)}</div><div className="sectionTitle"><h3>Quick tools</h3></div><div className="toolRow"><Tool icon={<WandSparkles/>} text="Auto style"/><Tool icon={<Layers3/>} text="Transitions"/><Tool icon={<SlidersHorizontal/>} text="Color"/><Tool icon={<Type/>} text="Text"/></div></section>}
function Tool({icon,text}:{icon:React.ReactNode;text:string}){return <div className="tool"><span>{icon}</span><small>{text}</small></div>}

function MusicPanel({music,musicUrl,playing,onToggle,onPick}:{music:File|null;musicUrl:string|null;playing:boolean;onToggle:()=>void;onPick:()=>void}){const tracks=[['Night Drive','VYBE Original','2:14'],['Afterglow','Mira Vale','2:31'],['Rush Hour','Kairo','1:48'],['Golden','Lune','2:07'],['No Signal','SØM','1:56']];return <section className="page musicPage"><header className="pageHead"><div><p className="eyebrow">AUDIO</p><h1>Music</h1></div><button className="iconBtn" onClick={onPick}><Upload/></button></header><div className="musicHero"><div className="disc"><Music2/></div><div><span className="pill">YOUR AUDIO</span><h2>{music?.name||'Add a sound'}</h2><p>{music?'Ready for your edit':'Import any audio file from your phone.'}</p></div><button onClick={musicUrl?onToggle:onPick} className="playBtn">{playing?<Square/>:<Play/>}</button></div><div className="sectionTitle"><h3>For you</h3><span>Fresh</span></div><div className="trackList">{tracks.map((t,i)=><button className="track" key={t[0]} onClick={onPick}><span className="trackNum">{String(i+1).padStart(2,'0')}</span><span className="wave">{Array.from({length:12},(_,j)=><i key={j} style={{height:`${10+(j*7+i*5)%28}px`}}/>)}</span><span className="trackInfo"><strong>{t[0]}</strong><small>{t[1]}</small></span><time>{t[2]}</time><Play size={15}/></button>)}</div><p className="hint"><Headphones size={14}/> Add your own audio to keep the app copyright-safe.</p></section>}

function Editor({activeMedia,mediaRef,filter,setFilter,duration,trim,setTrim,onLoad,onExport,music,musicUrl,playing,onToggleMusic,onAddMusic}:{activeMedia:string|null;mediaRef:React.RefObject<HTMLVideoElement|null>;filter:number;setFilter:(n:number)=>void;duration:number;trim:[number,number];setTrim:(v:[number,number])=>void;onLoad:()=>void;onExport:()=>void;music:File|null;musicUrl:string|null;playing:boolean;onToggleMusic:()=>void;onAddMusic:()=>void}){return <section className="page editorPage"><header className="editorHead"><button className="iconBtn"><X/></button><div><span>EDITING</span><strong>New edit</strong></div><button className="exportBtn" onClick={onExport}><Download size={17}/> Export</button></header><div className="previewWrap">{activeMedia?<video ref={mediaRef} src={activeMedia} className="editPreview" playsInline controls onLoadedMetadata={onLoad} style={{filter:filters[filter].css}}/>:<div className="emptyPreview"><Video/><p>Record or import a video</p></div>}<div className="previewBadge">9:16</div></div><div className="timeline"><div className="timelineTop"><strong>Trim</strong><span>{duration?`${trim[0].toFixed(1)}s — ${trim[1].toFixed(1)}s`:'Set video length'}</span></div><input aria-label="Trim start" type="range" min="0" max={Math.max(duration,.1)} step="0.1" value={trim[0]} onChange={e=>setTrim([Math.min(+e.target.value,trim[1]-.1),trim[1]])}/><input aria-label="Trim end" type="range" min="0" max={Math.max(duration,.1)} step="0.1" value={trim[1]} onChange={e=>setTrim([trim[0],Math.max(+e.target.value,trim[0]+.1)])}/><div className="filmstrip">{Array.from({length:9},(_,i)=><span key={i} style={{background:`linear-gradient(${120+i*9}deg,hsl(${220+i*11} 55% ${18+i*2}%),#111)`}}/>)}</div></div><div className="editorTools"><button><Scissors/><span>Trim</span></button><button onClick={()=>setFilter((filter+1)%filters.length)}><WandSparkles/><span>Effects</span></button><button onClick={onAddMusic}><Music2/><span>Music</span></button><button><Type/><span>Text</span></button><button><SlidersHorizontal/><span>Adjust</span></button><button><Smile/><span>Sticker</span></button></div><div className="filterSection"><div className="sectionTitle"><h3>Looks</h3><span>{filters[filter].name}</span></div><div className="filters">{filters.map((f,i)=><button className={i===filter?'selected':''} key={f.name} onClick={()=>setFilter(i)}><span style={{filter:f.css,background:'linear-gradient(145deg,#252535,#0d0d12)'}}>Aa</span><small>{f.name}</small></button>)}</div></div><div className="audioBar"><div className="audioIcon"><Volume2/></div><div><strong>{music?.name||'Add music'}</strong><small>{music?'Audio track':'No audio track yet'}</small></div><button onClick={musicUrl?onToggleMusic:onAddMusic}>{playing?'Pause':'Add'}</button></div></section>}
