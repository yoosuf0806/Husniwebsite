const STORAGE_KEY = 'husni_site_data';
function getSiteData(){try{const r=localStorage.getItem(STORAGE_KEY);return r?JSON.parse(r):getDefaultData();}catch(e){return getDefaultData();}}
function getDefaultData(){return{sections:{about:true,projects:true,services:true,contact:true},content:{},seo:{title:'Husni Marikkar Architects | Residential Architecture & Interior Design London',description:'London-based architect offering bespoke home renovation, interior design and new build architecture. University of Westminster graduate. Free initial consultation.',keywords:'architect London, residential interior design UK, home renovation architect'},enquiries:[]};}
function saveSiteData(d){localStorage.setItem(STORAGE_KEY,JSON.stringify(d));}
function applyAdminSettings(){
  const data=getSiteData();
  if(data.sections){Object.entries(data.sections).forEach(([id,vis])=>{const el=document.getElementById('section-'+id);const wv=document.getElementById('wave-'+id);if(el)el.style.display=vis?'':'none';if(wv)wv.style.display=vis?'':'none';});}
  if(data.content){Object.entries(data.content).forEach(([key,val])=>{document.querySelectorAll('[data-content="'+key+'"]').forEach(el=>{el.innerHTML=val;});});}
  if(data.seo){if(data.seo.title)document.title=data.seo.title;const d=document.querySelector('meta[name="description"]');if(d&&data.seo.description)d.setAttribute('content',data.seo.description);}
}
function saveEnquiry(fd){const data=getSiteData();if(!data.enquiries)data.enquiries=[];data.enquiries.unshift({id:Date.now(),date:new Date().toISOString(),...fd,read:false});saveSiteData(data);}
window.HusniSite={getSiteData,saveSiteData,applyAdminSettings,saveEnquiry,STORAGE_KEY,getDefaultData};
