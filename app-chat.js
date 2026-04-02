window.WinkApps=window.WinkApps||{};
window.isWinkSwiping=false;
window.isWinkApiLoading=false;

window.WinkApps['chat']={
/* 1. 数据中心 */
data:{characters:[],user:{avatar:'',name:'Wink'},masks:[],wallet:{cards:[],txs:[]},activeTab:'msg',currentCardIdx:0,bookmarks:[],apiConfig:{baseUrl:'https://api.openai.com/v1',apiKey:'',model:'gpt-3.5-turbo',temperature:0.8,presets:[]}},

loadData:function(){
try{const saved=localStorage.getItem('wink_chat_data');
if(saved){const parsed=JSON.parse(saved);
this.data.characters=parsed.characters||[];
this.data.user=parsed.user||{avatar:'',name:'Wink'};
this.data.masks=parsed.masks||[];
this.data.wallet=parsed.wallet||{cards:[],txs:[]};
this.data.bookmarks=parsed.bookmarks||[];
this.data.apiConfig=parsed.apiConfig||{baseUrl:'https://api.openai.com/v1',apiKey:'',model:'gpt-3.5-turbo',temperature:0.8,presets:[]};
}}catch(e){}
if(!this.data.wallet.cards||this.data.wallet.cards.length===0){
this.data.wallet.cards=[{id:'card_1',org:'WINK BLACK',no:'8888',balance:9999},{id:'card_2',org:'WINK PLATINUM',no:'6666',balance:2500},{id:'card_3',org:'WINK GOLD',no:'0000',balance:800}];this.saveData();}
},

saveData:function(){localStorage.setItem('wink_chat_data',JSON.stringify(this.data));},

render:function(container){
this.container=container;this.loadData();
const parentScreen=container.parentElement;if(parentScreen)parentScreen.style.setProperty('padding','0','important');
const parentHeader=container.previousElementSibling;if(parentHeader&&parentHeader.classList.contains('settings-header'))parentHeader.style.display='none';

container.innerHTML=`<div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;overflow:hidden;">
<style>@keyframes winkBlink{0%{opacity:.3;}50%{opacity:1;}100%{opacity:.3;}}</style>
<div style="flex:1;display:flex;flex-direction:column;padding:50px 24px 30px;position:relative;">
<div id="chatHeader" style="height:36px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;margin-bottom:16px;"></div>
<div id="chatContent" style="flex:1;overflow-y:auto;overflow-x:hidden;padding-bottom:20px;"></div>
<div style="height:60px;flex-shrink:0;background:var(--glass-bg);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border-radius:24px;border:1px solid var(--glass-border);display:flex;justify-content:space-around;align-items:center;padding:0 10px;z-index:10;">
<div onclick="WinkApps['chat'].switchTab('msg')" style="padding:10px;cursor:pointer;transition:transform 0.2s;color:var(--text-main);opacity:${this.data.activeTab==='msg'?'1':'0.3'};"><svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
<div onclick="WinkApps['chat'].switchTab('contact')" style="padding:10px;cursor:pointer;transition:transform 0.2s;color:var(--text-main);opacity:${this.data.activeTab==='contact'?'1':'0.3'};"><svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
<div onclick="WinkApps['chat'].switchTab('feed')" style="padding:10px;cursor:pointer;transition:transform 0.2s;color:var(--text-main);opacity:${this.data.activeTab==='feed'?'1':'0.3'};"><svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg></div>
<div onclick="WinkApps['chat'].switchTab('me')" style="padding:10px;cursor:pointer;transition:transform 0.2s;color:var(--text-main);opacity:${this.data.activeTab==='me'?'1':'0.3'};"><svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
</div></div>
<div id="chatSubPage" style="position:absolute;top:0;left:0;right:0;bottom:0;background:var(--theme-bg);z-index:50;transform:translateX(100%);transition:transform 0.4s cubic-bezier(0.2,0.8,0.2,1);display:flex;flex-direction:column;padding:50px 24px 30px;"></div>
<div id="chatFormPage" style="position:absolute;top:0;left:0;right:0;bottom:0;background:var(--theme-bg);z-index:100;transform:translateY(100%);transition:transform 0.4s cubic-bezier(0.2,0.8,0.2,1);display:flex;flex-direction:column;padding:50px 24px 30px;"></div>
<div id="chatRoomPage" style="position:absolute;top:0;left:0;right:0;bottom:0;background:var(--theme-bg);z-index:200;transform:translateX(100%);transition:transform 0.4s cubic-bezier(0.2,0.8,0.2,1);display:flex;flex-direction:column;padding:0;"></div>
<div id="chatSelectorModal" style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:900;display:none;flex-direction:column;justify-content:flex-end;opacity:0;transition:opacity 0.3s;">
<div id="selectorBox" style="background:var(--theme-bg);border-radius:24px 24px 0 0;padding:24px;transform:translateY(100%);transition:transform 0.3s cubic-bezier(0.2,0.8,0.2,1);display:flex;flex-direction:column;max-height:60vh;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
<div onclick="WinkApps['chat'].closeSelector()" style="opacity:0.6;font-weight:700;cursor:pointer;">Cancel</div>
<div id="selectorTitle" style="font-weight:bold;font-size:calc(16px * var(--font-scale));">Select</div><div style="width:45px;"></div></div>
<div id="selectorList" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;"></div></div></div>
<div id="chatAppModal" style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);z-index:999;display:none;justify-content:center;align-items:center;padding:24px;opacity:0;transition:opacity 0.3s;"></div></div>`;
this.renderCurrentTab();
},

exitChatApp:function(){
const parentScreen=this.container.parentElement;if(parentScreen)parentScreen.style.padding='';
const parentHeader=this.container.previousElementSibling;if(parentHeader)parentHeader.style.display='flex';
closeDynamicApp();
},

switchTab:function(tabName){this.data.activeTab=tabName;this.render(this.container);},

renderCurrentTab:function(){
const header=document.getElementById('chatHeader');const content=document.getElementById('chatContent');const tab=this.data.activeTab;
if(tab==='msg'){
header.innerHTML=`<div onclick="WinkApps['chat'].exitChatApp()" style="font-size:calc(26px * var(--font-scale));font-weight:800;cursor:pointer;letter-spacing:-0.5px;">Chat</div>
<div style="cursor:pointer;opacity:0.8;display:flex;align-items:center;"><svg viewBox="0 0 24 24" style="width:28px;height:28px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></div>`;
content.innerHTML=this.buildCharacterListHTML();
}else if(tab==='contact'){
header.innerHTML=`<div style="font-size:calc(22px * var(--font-scale));font-weight:700;"></div>
<div onclick="WinkApps['chat'].openCharForm()" style="cursor:pointer;opacity:0.8;display:flex;align-items:center;"><svg viewBox="0 0 24 24" style="width:28px;height:28px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></div>`;
content.innerHTML=this.buildGroupedContactHTML();setTimeout(()=>this.bindSwipeEvents(),50);
}else if(tab==='feed'){
header.innerHTML=`<div></div><div></div>`;content.innerHTML=`<div style="text-align:center;padding-top:50px;opacity:0.4;font-weight:bold;">Empty Feed</div>`;
}else if(tab==='me'){
header.innerHTML=`<div></div><div></div>`;content.innerHTML=this.buildMeHTML();
}
},

buildCharacterListHTML:function(){
if(this.data.characters.length===0)return `<div style="text-align:center;padding-top:50px;opacity:0.4;font-weight:bold;">Empty messages</div>`;
let html='<div style="display:flex;flex-direction:column;gap:12px;">';
this.data.characters.forEach(c=>{
let lastMsg='Start a conversation...';
if(c.messages&&c.messages.length>0){
let lM=c.messages[c.messages.length-1];
lastMsg=lM.role==='event'?'[💳 Gifted Card]':lM.content;
}
html+=`<div onclick="WinkApps['chat'].openChatRoom('${c.id}')" style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(255,255,255,0.2);border-radius:16px;border:1px solid var(--glass-border);cursor:pointer;">
<img src="${c.avatar||'https://ui-avatars.com/api/?name='+c.name+'&background=random'}" style="width:48px;height:48px;border-radius:14px;object-fit:cover;">
<div style="flex:1;overflow:hidden;"><div style="font-weight:700;font-size:calc(16px * var(--font-scale));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.name}</div>
<div style="font-size:calc(12px * var(--font-scale));opacity:0.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px;">${lastMsg}</div></div></div>`;
});return html+'</div>';
},

buildGroupedContactHTML:function(){
if(this.data.characters.length===0)return `<div style="text-align:center;padding-top:50px;opacity:0.4;font-weight:bold;">Empty contacts</div>`;
const groups={};
this.data.characters.forEach(c=>{let g=(c.group&&c.group.trim())?c.group.trim():'Default';if(!groups[g])groups[g]=[];groups[g].push(c);});
let html='<div style="display:flex;flex-direction:column;gap:16px;">';
for(let g in groups){if(groups[g].length===0)continue;
html+=`<div class="contact-group">
<div onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'flex':'none';" style="display:flex;justify-content:space-between;align-items:center;font-weight:700;opacity:0.7;margin-bottom:8px;cursor:pointer;padding:0 4px;font-size:calc(13px * var(--font-scale));">
<span>${g} (${groups[g].length})</span><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
<div style="display:flex;flex-direction:column;gap:10px;">${groups[g].map(c=>this.generateSwipeItemHTML(c,'char')).join('')}</div></div>`;
}return html+'</div>';
},

generateSwipeItemHTML:function(item,type){
let clickFn=type==='char'?`WinkApps['chat'].openCharForm('${item.id}')`:type==='mask'?`WinkApps['chat'].openMaskForm('${item.id}')`:`WinkApps['chat'].appModal('Bookmark content: <br><br>'+decodeURIComponent('${encodeURIComponent(item.content)}'))`;
let delFn=type==='char'?`WinkApps['chat'].askDeleteChar('${item.id}')`:type==='mask'?`WinkApps['chat'].askDeleteMask('${item.id}')`:`WinkApps['chat'].askDeleteBookmark('${item.id}')`;
let mainText=type==='bookmark'?item.title:item.name;
let subText=type==='char'?`Mask: ${item.userMask||'None'}`:type==='mask'?item.desc:item.content;
let fallbackName=type==='char'?item.name:type==='mask'?'Mask':'Bookmark';
let imgHtml=type==='bookmark'?`<div style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.2);display:flex;justify-content:center;align-items:center;"><svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none;"><polygon points="19 21 12 16 5 21 5 3 19 3 19 21"></polygon></svg></div>`:`<img src="${item.avatar||'https://ui-avatars.com/api/?name='+fallbackName+'&background=random'}" style="width:44px;height:44px;border-radius:12px;object-fit:cover;">`;

return `<div class="swipe-container" style="width:100%;overflow:hidden;border-radius:16px;">
<div class="swipe-wrapper" data-id="${item.id}" style="display:flex;width:100%;transform:translateX(0);transition:transform 0.3s cubic-bezier(0.2,0.8,0.2,1);">
<div onclick="${clickFn}" style="width:100%;flex-shrink:0;background:var(--glass-bg);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--glass-border);padding:12px;border-radius:16px;display:flex;align-items:center;gap:12px;cursor:pointer;">
${imgHtml}
<div style="flex:1;overflow:hidden;"><div style="font-weight:700;font-size:calc(15px * var(--font-scale));">${mainText}</div>
<div style="font-size:calc(11px * var(--font-scale));opacity:0.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">${subText}</div></div></div>
<div onclick="${delFn}" style="width:75px;flex-shrink:0;background:#e74c3c;color:#fff;display:flex;justify-content:center;align-items:center;font-weight:bold;cursor:pointer;border-radius:16px;margin-left:8px;font-size:calc(14px * var(--font-scale));">Del</div>
</div></div>`;
},

askDeleteChar:function(id){
this.appModal('Delete this character? 🥺','confirm','',(confirm)=>{
if(confirm){this.data.characters=this.data.characters.filter(c=>c.id!==id);this.saveData();this.renderCurrentTab();}
});
},

bindSwipeEvents:function(){
const wrappers=document.querySelectorAll('.swipe-wrapper');let startX=0,startY=0;
const resetSwipes=(exclude)=>{document.querySelectorAll('.swipe-wrapper').forEach(w=>{if(w!==exclude)w.style.transform='translateX(0)';});};
document.addEventListener('touchstart',(e)=>{if(!e.target.closest('.swipe-container'))resetSwipes(null);},{passive:true});
wrappers.forEach(wrapper=>{
wrapper.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;startY=e.touches[0].clientY;resetSwipes(wrapper);},{passive:true});
wrapper.addEventListener('touchmove',e=>{if(Math.abs(e.touches[0].clientX-startX)>10)window.isWinkSwiping=true;},{passive:true});
wrapper.addEventListener('touchend',e=>{
let dx=e.changedTouches[0].clientX-startX;let dy=e.changedTouches[0].clientY-startY;
setTimeout(()=>{window.isWinkSwiping=false;},50);
if(Math.abs(dy)>Math.abs(dx))return;
if(dx<-30)wrapper.style.transform='translateX(-83px)';
else if(dx>30)wrapper.style.transform='translateX(0)';
});});
},

buildMeHTML:function(){
const u=this.data.user;
return `<div style="display:flex;flex-direction:column;align-items:center;margin-top:10px;">
<input type="file" id="userAvatarInput" accept="image/*" style="display:none;" onchange="WinkApps['chat'].updateUserAvatar(event)">
<img onclick="document.getElementById('userAvatarInput').click()" src="${u.avatar||'https://ui-avatars.com/api/?name=User&background=random'}" style="width:80px;height:80px;border-radius:24px;object-fit:cover;border:2px solid var(--glass-border);box-shadow:0 10px 20px rgba(0,0,0,0.1);cursor:pointer;">
<div onclick="WinkApps['chat'].askUpdateUserName()" style="margin-top:16px;font-size:calc(22px * var(--font-scale));font-weight:800;display:flex;align-items:center;gap:6px;cursor:pointer;">
${u.name} <svg viewBox="0 0 24 24" style="width:14px;height:14px;opacity:0.5;stroke:currentColor;stroke-width:2;fill:none;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></div>
<div style="width:100%;margin-top:40px;display:flex;flex-direction:column;gap:12px;">
<div onclick="WinkApps['chat'].openMasksPage()" style="background:rgba(255,255,255,0.2);padding:16px 20px;border-radius:16px;font-weight:600;font-size:calc(15px * var(--font-scale));display:flex;justify-content:space-between;align-items:center;border:1px solid var(--glass-border);cursor:pointer;">面具 (Masks) <svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;stroke-width:2;fill:none;opacity:0.5;"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
<div onclick="WinkApps['chat'].openWalletPage()" style="background:rgba(255,255,255,0.2);padding:16px 20px;border-radius:16px;font-weight:600;font-size:calc(15px * var(--font-scale));display:flex;justify-content:space-between;align-items:center;border:1px solid var(--glass-border);cursor:pointer;">钱包 (Wallet) <svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;stroke-width:2;fill:none;opacity:0.5;"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
<div onclick="WinkApps['chat'].openBookmarksPage()" style="background:rgba(255,255,255,0.2);padding:16px 20px;border-radius:16px;font-weight:600;font-size:calc(15px * var(--font-scale));display:flex;justify-content:space-between;align-items:center;border:1px solid var(--glass-border);cursor:pointer;">收藏 (Bookmarks) <svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;stroke-width:2;fill:none;opacity:0.5;"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
<div onclick="WinkApps['chat'].openApiPage()" style="background:rgba(255,255,255,0.2);padding:16px 20px;border-radius:16px;font-weight:600;font-size:calc(15px * var(--font-scale));display:flex;justify-content:space-between;align-items:center;border:1px solid var(--glass-border);cursor:pointer;">API 配置 (Settings) <svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;stroke-width:2;fill:none;opacity:0.5;"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
<div style="background:rgba(255,255,255,0.2);padding:16px 20px;border-radius:16px;font-weight:600;font-size:calc(15px * var(--font-scale));display:flex;justify-content:space-between;align-items:center;border:1px solid var(--glass-border);opacity:0.6;">美化 (Themes - TBD) <svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;stroke-width:2;fill:none;opacity:0.5;"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
</div></div>`;
},

updateUserAvatar:function(e){
const file=e.target.files[0];
if(file){const reader=new FileReader();reader.onload=res=>{this.data.user.avatar=res.target.result;this.saveData();this.renderCurrentTab();};reader.readAsDataURL(file);}
},

/* 🌟 超强聊天室！ */
openChatRoom:function(charId){
if(window.isWinkSwiping)return;
const char=this.data.characters.find(c=>c.id===charId);if(!char)return;
char.messages=char.messages||[];
this.activeChar=char;

const page=document.getElementById('chatRoomPage');
page.innerHTML=`<div style="height:55px;padding:0 24px;display:flex;justify-content:space-between;align-items:center;background:var(--glass-bg);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border-bottom:1px solid var(--glass-border);flex-shrink:0;padding-top:15px;z-index:10;">
<div onclick="document.getElementById('chatRoomPage').style.transform='translateX(100%)';WinkApps['chat'].renderCurrentTab();" style="cursor:pointer;display:flex;align-items:center;font-weight:bold;opacity:0.8;"><svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"></polyline></svg> Back</div>
<div style="font-weight:800;font-size:calc(18px * var(--font-scale));display:flex;align-items:center;gap:8px;"><img src="${char.avatar||'https://ui-avatars.com/api/?name='+char.name+'&background=random'}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;"> ${char.name}</div>
<div style="width:24px;opacity:0.8;cursor:pointer;"><svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;stroke-width:2;fill:none;"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></div></div>
<div id="chatMessageList" style="flex:1;overflow-y:auto;padding:20px 24px 120px;display:flex;flex-direction:column;"></div>
<div style="position:absolute;bottom:20px;left:20px;right:20px;background:var(--glass-bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:28px;padding:8px 12px;display:flex;align-items:flex-end;gap:8px;box-shadow:0 10px 30px rgba(0,0,0,0.15);z-index:100;">
<div onclick="WinkApps['chat'].appModal('Menu coming soon! ✨')" style="padding:10px;cursor:pointer;opacity:0.7;display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 24 24" style="width:22px;height:22px;stroke:currentColor;stroke-width:2;fill:none;"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></div>
<textarea id="chatInput" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();WinkApps['chat'].sendMessage();}" oninput="this.style.height='24px';this.style.height=(this.scrollHeight)+'px';" placeholder="Type a message..." style="flex:1;height:24px;max-height:100px;background:transparent;border:none;outline:none;color:var(--text-main);font-family:inherit;font-weight:bold;font-size:calc(14px * var(--font-scale));resize:none;padding:2px 0;margin:10px 4px;line-height:1.4;overflow-y:auto;"></textarea>
<div onclick="WinkApps['chat'].triggerReply()" style="padding:10px;cursor:pointer;color:var(--text-main);opacity:0.8;display:flex;align-items:center;justify-content:center;" title="Force Reply"><svg viewBox="0 0 24 24" style="width:22px;height:22px;stroke:currentColor;stroke-width:2;fill:none;"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg></div>
<div onclick="WinkApps['chat'].sendMessage()" style="padding:10px;cursor:pointer;color:var(--text-main);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 24 24" style="width:22px;height:22px;stroke:currentColor;stroke-width:2;fill:none;stroke-linejoin:round;stroke-linecap:round;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></div>
</div>`;
page.style.transform='translateX(0)';
this.renderChatMessages();
},

/* 🌟 事件、记忆与平角气泡引擎！ */
renderChatMessages:function(){
const list=document.getElementById('chatMessageList');if(!list)return;
const char=this.activeChar;let msgs=char.messages;
let html=`<div style="text-align:center;opacity:0.4;font-size:12px;font-weight:bold;margin-bottom:16px;">Chat started with ${char.name}</div>`;

msgs.forEach((m,i)=>{
if(m.role==='event'){
html+=`<div style="display:flex;justify-content:center;margin-top:12px;margin-bottom:8px;"><div style="background:rgba(255,255,255,0.2);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid var(--glass-border);padding:10px 16px;border-radius:16px;font-size:calc(12px * var(--font-scale));font-weight:bold;opacity:0.8;text-align:center;line-height:1.4;">${m.content.replace(/\n/g,'<br>')}</div></div>`;
return;
}

let isUser=m.role==='user';
let prevMsg=null;for(let j=i-1;j>=0;j--){if(msgs[j].role!=='event'){prevMsg=msgs[j];break;}}
let nextMsg=null;for(let j=i+1;j<msgs.length;j++){if(msgs[j].role!=='event'){nextMsg=msgs[j];break;}}

let isTop=(!prevMsg||prevMsg.role!==m.role);
let isBottom=(!nextMsg||nextMsg.role!==m.role);

let radius='';
if(isUser){
if(isTop&&isBottom) radius='20px 20px 4px 20px';
else if(isTop) radius='20px 20px 4px 20px';
else if(isBottom) radius='20px 4px 20px 20px';
else radius='20px 4px 4px 20px';
}else{
if(isTop&&isBottom) radius='20px 20px 20px 4px';
else if(isTop) radius='20px 20px 20px 4px';
else if(isBottom) radius='4px 20px 20px 20px';
else radius='4px 20px 20px 4px';
}

let avatarHtml='';
if(!isUser){
if(isBottom) avatarHtml=`<img src="${char.avatar||'https://ui-avatars.com/api/?name='+char.name+'&background=random'}" style="width:30px;height:30px;border-radius:10px;object-fit:cover;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.1);">`;
else avatarHtml=`<div style="width:30px;height:30px;flex-shrink:0;"></div>`;
}

let contentHtml=m.isLoading?`<span style="animation:winkBlink 1.4s infinite;font-size:20px;line-height:0.8;">...</span>`:m.content;
let safeContent=encodeURIComponent(m.content||'');

if(isUser){
html+=`<div style="display:flex;justify-content:flex-end;margin-top:${isTop?12:2}px;"><div ondblclick="WinkApps['chat'].addBookmark(decodeURIComponent('${safeContent}'))" style="max-width:80%;background:var(--text-main);color:#fff;padding:10px 14px;border-radius:${radius};font-weight:600;font-size:calc(14px * var(--font-scale));box-shadow:0 4px 10px rgba(0,0,0,0.15);word-wrap:break-word;white-space:pre-wrap;line-height:1.4;">${contentHtml}</div></div>`;
}else{
html+=`<div style="display:flex;gap:10px;align-items:flex-end;margin-top:${isTop?12:2}px;max-width:85%;">${avatarHtml}<div ondblclick="WinkApps['chat'].addBookmark(decodeURIComponent('${safeContent}'))" style="background:rgba(255,255,255,0.6);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--glass-border);color:var(--text-main);padding:10px 14px;border-radius:${radius};font-weight:600;font-size:calc(14px * var(--font-scale));box-shadow:0 4px 10px rgba(0,0,0,0.05);word-wrap:break-word;white-space:pre-wrap;line-height:1.4;">${contentHtml}</div></div>`;
}
});

list.innerHTML=html;
setTimeout(()=>{list.scrollTop=list.scrollHeight;},50);
},

sendMessage:function(){
if(window.isWinkApiLoading)return;
const input=document.getElementById('chatInput');
const text=input.value.trim();if(!text)return;
input.value='';input.style.height='24px';
this.activeChar.messages.push({role:'user',content:text});
this.saveData();this.renderChatMessages();
},

/* 🌟 最强人设注入 + 自动切分气泡动画引擎！ */
triggerReply:async function(){
if(window.isWinkApiLoading)return;
let char=this.activeChar;let conf=this.data.apiConfig;
if(!conf.baseUrl||!conf.apiKey)return this.appModal('Please go to Settings to configure API URL and Key! 🥺');

window.isWinkApiLoading=true;
char.messages.push({role:'assistant',content:'',isLoading:true});
this.renderChatMessages();

try{
let uName=this.data.user.name;let uDesc="";
if(char.userMask){
let mObj=this.data.masks.find(x=>x.name===char.userMask);
if(mObj){uName=mObj.name;uDesc=mObj.desc;}else{uName=char.userMask;}
}

let sysPrompt=`[Roleplay Setup]
You are strictly engaging in a fictional text-message roleplay. Do NOT act like an AI.

<Character_Profile>
Name: ${char.name}
Persona: ${char.persona||'A casual friend.'}
</Character_Profile>

<User_Profile>
Name: ${uName}
${uDesc?'Persona: '+uDesc:''}
</User_Profile>

<Instructions>
1. Speak completely in character as ${char.name}.
2. This is a mobile chat app. Use short messages, internet slang, and natural texting tone.
3. CRITICAL: Real people send multiple short texts. You MUST split your response into distinct chat bubbles using "||". Example: "wait really? || tell me more || i'm so curious"
4. React naturally to the user.
</Instructions>`;

let apiMsgs=[{role:'system',content:sysPrompt}];
char.messages.forEach(m=>{
if(!m.isLoading){
if(m.role==='event') apiMsgs.push({role:'system',content:`[System Event occurred: ${m.content}]`});
else apiMsgs.push({role:m.role,content:m.content});
}
});
apiMsgs.push({role:'system',content:`[Reminder: Stay strictly in character as ${char.name}. Break your response into multiple texts using "||".]`});

let url=conf.baseUrl;if(!url.endsWith('/chat/completions'))url=url.replace(/\/$/,'')+'/chat/completions';
let res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+conf.apiKey},body:JSON.stringify({model:conf.model,messages:apiMsgs,temperature:conf.temperature})});
if(!res.ok)throw new Error("API Error: "+res.status);
let json=await res.json();let rawReply=json.choices[0].message.content;

char.messages.pop(); /* 移除等待框 */

/* 自动切割并执行真实打字动画！ */
let replies=rawReply.split(/\|\||\n\n/).map(s=>s.trim()).filter(s=>s);
for(let i=0;i<replies.length;i++){
if(i>0){
char.messages.push({role:'assistant',content:'',isLoading:true});this.renderChatMessages();
await new Promise(r=>setTimeout(r,600+Math.random()*800));
char.messages.pop();
}
char.messages.push({role:'assistant',content:replies[i]});
this.saveData();this.renderChatMessages();
}

}catch(e){
char.messages.pop();this.renderChatMessages();
this.appModal("API Failed: "+e.message+" 🥺");
}finally{
window.isWinkApiLoading=false;
}
},

addBookmark:function(text){
if(!text||text==='undefined')return;
this.appModal('Bookmark this message? ✨','confirm','',(confirm)=>{
if(confirm){
let title=text.substring(0,15)+(text.length>15?'...':'');
this.data.bookmarks.unshift({id:'bm_'+Date.now(),title:title,content:text});
this.saveData();this.appModal('Added to Bookmarks! 🥺');
}});
},

openCharForm:function(id=null){
if(window.isWinkSwiping)return;
const formPage=document.getElementById('chatFormPage');
let char={id:'char_'+Date.now(),avatar:'',name:'',group:'',persona:'',userMask:''};
if(id){const exist=this.data.characters.find(c=>c.id===id);if(exist)char={...exist};}
formPage.innerHTML=`<div style="height:36px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-shrink:0;">
<div onclick="document.getElementById('chatFormPage').style.transform='translateY(100%)'" style="cursor:pointer;opacity:0.6;font-weight:700;font-size:calc(16px * var(--font-scale));">Cancel</div>
<div onclick="WinkApps['chat'].saveChar('${char.id}')" style="cursor:pointer;font-weight:800;font-size:calc(16px * var(--font-scale));color:var(--text-main);">Save</div></div>
<div style="flex:1;overflow-y:auto;padding-bottom:40px;display:flex;flex-direction:column;gap:24px;">
<div style="align-self:center;position:relative;margin-bottom:10px;">
<input type="file" id="formAvatarInput" accept="image/*" style="display:none;" onchange="WinkApps['chat'].formPreviewAvatar(event,'formAvatarPreview','formAvatarData')">
<img id="formAvatarPreview" src="${char.avatar||'https://ui-avatars.com/api/?name=AI&background=random'}" style="width:84px;height:84px;border-radius:22px;object-fit:cover;border:2px solid var(--glass-border);box-shadow:0 8px 20px rgba(0,0,0,0.1);">
<div onclick="document.getElementById('formAvatarInput').click()" style="position:absolute;bottom:-8px;right:-8px;background:var(--text-main);color:#fff;border-radius:50%;width:32px;height:32px;display:flex;justify-content:center;align-items:center;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,0.2);"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></div></div>
<input type="hidden" id="formAvatarData" value="${char.avatar}">
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">Name</div>
<input type="text" id="formName" value="${char.name}" style="width:100%;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);font-family:inherit;color:var(--text-main);font-weight:bold;outline:none;font-size:calc(14px * var(--font-scale));"></div>
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">Group</div>
<input type="text" id="formGroup" value="${char.group}" placeholder="Empty for Default" style="width:100%;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);font-family:inherit;color:var(--text-main);outline:none;font-size:calc(14px * var(--font-scale));"></div>
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">Persona</div>
<textarea id="formPersona" style="width:100%;height:90px;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);font-family:inherit;color:var(--text-main);outline:none;resize:none;font-size:calc(14px * var(--font-scale));">${char.persona}</textarea></div>
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">User Mask</div>
<div onclick="WinkApps['chat'].openMaskSelector()" style="width:100%;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);color:var(--text-main);font-size:calc(14px * var(--font-scale));display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
<span id="formMaskDisplay" style="font-weight:bold;">${char.userMask||'Select a mask...'}</span><input type="hidden" id="formMaskValue" value="${char.userMask}">
<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;"><polyline points="6 9 12 15 18 9"></polyline></svg></div></div></div>`;
formPage.style.transform='translateY(0)';
},

formPreviewAvatar:function(e,previewId,dataId){
const file=e.target.files[0];
if(file){const reader=new FileReader();reader.onload=res=>{document.getElementById(previewId).src=res.target.result;document.getElementById(dataId).value=res.target.result;};reader.readAsDataURL(file);}
},

saveChar:function(id){
const name=document.getElementById('formName').value.trim();if(!name){this.appModal('Name cannot be empty! 🥺');return;}
const newChar={id:id,name:name,avatar:document.getElementById('formAvatarData').value,group:document.getElementById('formGroup').value.trim(),persona:document.getElementById('formPersona').value.trim(),userMask:document.getElementById('formMaskValue').value.trim()};
const index=this.data.characters.findIndex(c=>c.id===id);
if(index>-1){newChar.messages=this.data.characters[index].messages;this.data.characters[index]=newChar;}
else{newChar.messages=[];this.data.characters.unshift(newChar);}
this.saveData();document.getElementById('chatFormPage').style.transform='translateY(100%)';this.renderCurrentTab();
},

openMaskSelector:function(){
const modal=document.getElementById('chatSelectorModal');const list=document.getElementById('selectorList');
document.getElementById('selectorTitle').innerText='Select Mask';
if(this.data.masks.length===0){list.innerHTML=`<div style="text-align:center;padding:20px;opacity:0.5;">No masks available. Go create one in Me -> Masks!</div>`;
}else{list.innerHTML=this.data.masks.map(m=>`<div onclick="WinkApps['chat'].selectMask('${m.name}')" style="padding:12px 16px;background:rgba(255,255,255,0.4);border-radius:16px;border:1px solid var(--glass-border);font-weight:bold;font-size:calc(15px * var(--font-scale));cursor:pointer;display:flex;align-items:center;gap:12px;"><img src="${m.avatar||'https://ui-avatars.com/api/?name=Mask&background=random'}" style="width:36px;height:36px;border-radius:10px;object-fit:cover;">${m.name}</div>`).join('');
list.innerHTML+=`<div onclick="WinkApps['chat'].selectMask('')" style="padding:16px;background:transparent;border-radius:16px;border:1px dashed var(--glass-border);font-weight:bold;font-size:calc(15px * var(--font-scale));cursor:pointer;text-align:center;opacity:0.6;">Clear Mask</div>`;}
modal.style.display='flex';setTimeout(()=>{modal.style.opacity='1';document.getElementById('selectorBox').style.transform='translateY(0)';},10);
},

closeSelector:function(){
const modal=document.getElementById('chatSelectorModal');document.getElementById('selectorBox').style.transform='translateY(100%)';
modal.style.opacity='0';setTimeout(()=>{modal.style.display='none';},300);
},

selectMask:function(maskName){
document.getElementById('formMaskDisplay').textContent=maskName||'Select a mask...';document.getElementById('formMaskValue').value=maskName;this.closeSelector();
},

openBookmarksPage:function(){
const page=document.getElementById('chatSubPage');
page.innerHTML=`<div style="height:36px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-shrink:0;">
<div onclick="document.getElementById('chatSubPage').style.transform='translateX(100%)'" style="cursor:pointer;opacity:0.8;display:flex;align-items:center;font-weight:bold;"><svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"></polyline></svg> Back</div>
<div style="font-size:calc(20px * var(--font-scale));font-weight:700;">Bookmarks</div>
<div onclick="WinkApps['chat'].appModal('Double-tap any chat bubble to add a bookmark! ✨')" style="cursor:pointer;opacity:0.6;font-size:calc(14px * var(--font-scale));font-weight:bold;">Help</div></div>
<div id="bookmarksListContent" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;"></div>`;
page.style.transform='translateX(0)';this.renderBookmarksList();
},

renderBookmarksList:function(){
const container=document.getElementById('bookmarksListContent');
if(!this.data.bookmarks||this.data.bookmarks.length===0){container.innerHTML=`<div style="text-align:center;padding-top:50px;opacity:0.4;font-weight:bold;">No bookmarks yet.</div>`;return;}
container.innerHTML=this.data.bookmarks.map(b=>this.generateSwipeItemHTML(b,'bookmark')).join('');setTimeout(()=>this.bindSwipeEvents(),50);
},

askDeleteBookmark:function(id){
this.appModal('Delete this bookmark? 🥺','confirm','',(confirm)=>{if(confirm){this.data.bookmarks=this.data.bookmarks.filter(b=>b.id!==id);this.saveData();this.renderBookmarksList();}else{this.renderBookmarksList();}});
},

openApiPage:function(){
const page=document.getElementById('chatSubPage');const conf=this.data.apiConfig;
page.innerHTML=`<div style="height:36px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-shrink:0;">
<div onclick="document.getElementById('chatSubPage').style.transform='translateX(100%)'" style="cursor:pointer;opacity:0.8;display:flex;align-items:center;font-weight:bold;"><svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"></polyline></svg> Cancel</div>
<div style="font-size:calc(18px * var(--font-scale));font-weight:700;">API Settings</div>
<div onclick="WinkApps['chat'].saveApiConfig()" style="cursor:pointer;font-weight:800;font-size:calc(16px * var(--font-scale));color:var(--text-main);">Save</div></div>
<div style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:20px;padding-bottom:40px;">
<div style="display:flex;gap:10px;align-items:center;">
<div onclick="WinkApps['chat'].openPresetSelector()" style="flex:1;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);color:var(--text-main);font-weight:bold;font-size:calc(14px * var(--font-scale));display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
<span id="apiPresetDisplay">-- Load Preset --</span><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
<div onclick="WinkApps['chat'].askSaveApiPreset()" style="padding:14px 16px;border-radius:16px;background:var(--text-main);color:#fff;font-weight:bold;cursor:pointer;font-size:calc(13px * var(--font-scale));text-align:center;white-space:nowrap;">Save As</div></div>
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">Base URL</div>
<input type="text" id="apiBaseUrl" value="${conf.baseUrl}" placeholder="e.g. https://api.openai.com/v1" style="width:100%;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);font-family:inherit;color:var(--text-main);font-weight:bold;outline:none;font-size:calc(14px * var(--font-scale));"></div>
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">API Key (Bearer)</div>
<input type="password" id="apiKey" value="${conf.apiKey}" placeholder="sk-..." style="width:100%;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);font-family:inherit;color:var(--text-main);font-weight:bold;outline:none;font-size:calc(14px * var(--font-scale));"></div>
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">Model ID</div>
<div style="display:flex;gap:10px;">
<div style="flex:1;"><input type="text" id="apiModel" value="${conf.model}" placeholder="gpt-3.5-turbo" style="width:100%;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);font-family:inherit;color:var(--text-main);font-weight:bold;outline:none;font-size:calc(14px * var(--font-scale));"></div>
<div onclick="WinkApps['chat'].fetchApiModels()" style="padding:14px 16px;border-radius:16px;background:rgba(255,255,255,0.6);border:1px solid var(--glass-border);color:var(--text-main);font-weight:bold;cursor:pointer;font-size:calc(13px * var(--font-scale));display:flex;align-items:center;">Fetch</div>
</div></div>
<div style="display:flex;flex-direction:column;gap:6px;"><div style="display:flex;justify-content:space-between;align-items:center;padding:0 4px;"><span style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;">Temperature</span><span id="apiTempVal" style="font-weight:900;">${conf.temperature}</span></div>
<input type="range" id="apiTemp" min="0" max="2" step="0.1" value="${conf.temperature}" oninput="document.getElementById('apiTempVal').innerText=this.value" style="width:100%;margin:10px 0;accent-color:var(--text-main);">
<div style="display:flex;justify-content:space-between;opacity:0.5;font-size:calc(11px * var(--font-scale));padding:0 4px;"><span>0.0 (Precise)</span><span>2.0 (Creative)</span></div></div></div>`;
page.style.transform='translateX(0)';
},

openPresetSelector:function(){
const modal=document.getElementById('chatSelectorModal');const list=document.getElementById('selectorList');
document.getElementById('selectorTitle').innerText='Load Preset';
if(this.data.apiConfig.presets.length===0){list.innerHTML=`<div style="text-align:center;padding:20px;opacity:0.5;">No presets saved yet.</div>`;
}else{list.innerHTML=this.data.apiConfig.presets.map((p,i)=>`<div onclick="WinkApps['chat'].loadApiPreset(${i})" style="padding:16px;background:rgba(255,255,255,0.4);border-radius:16px;border:1px solid var(--glass-border);font-weight:bold;font-size:calc(15px * var(--font-scale));cursor:pointer;text-align:center;">${p.name}</div>`).join('');}
modal.style.display='flex';setTimeout(()=>{modal.style.opacity='1';document.getElementById('selectorBox').style.transform='translateY(0)';},10);
},

loadApiPreset:function(idx){
let p=this.data.apiConfig.presets[idx];
if(p){document.getElementById('apiBaseUrl').value=p.baseUrl;document.getElementById('apiKey').value=p.apiKey;document.getElementById('apiModel').value=p.model;document.getElementById('apiTemp').value=p.temperature;document.getElementById('apiTempVal').innerText=p.temperature;document.getElementById('apiPresetDisplay').innerText=p.name;}
this.closeSelector();
},

fetchApiModels:async function(){
let url=document.getElementById('apiBaseUrl').value.trim();let key=document.getElementById('apiKey').value.trim();
if(!url)return this.appModal("Base URL is required to fetch models! 🥺");
if(!url.endsWith('/v1'))url=url.replace(/\/$/,'')+'/v1';
const modal=document.getElementById('chatSelectorModal');const list=document.getElementById('selectorList');
document.getElementById('selectorTitle').innerText='Available Models';
list.innerHTML=`<div style="text-align:center;padding:30px;font-weight:bold;opacity:0.6;">Fetching models... ⏳</div>`;
modal.style.display='flex';setTimeout(()=>{modal.style.opacity='1';document.getElementById('selectorBox').style.transform='translateY(0)';},10);
try{
let res=await fetch(url+'/models',{headers:{'Authorization':'Bearer '+key}});
if(!res.ok)throw new Error("Status: "+res.status);
let json=await res.json();let models=json.data?json.data.map(m=>m.id):[];
if(models.length===0)throw new Error("No models returned.");
list.innerHTML=models.map(m=>`<div onclick="WinkApps['chat'].selectApiModel('${m}')" style="padding:14px;background:rgba(255,255,255,0.4);border-radius:16px;border:1px solid var(--glass-border);font-weight:bold;font-size:calc(14px * var(--font-scale));cursor:pointer;word-break:break-all;">${m}</div>`).join('');
}catch(e){
list.innerHTML=`<div style="text-align:center;padding:20px;color:#e74c3c;font-weight:bold;">Fetch failed: ${e.message} 🥺</div>`;
}
},

selectApiModel:function(m){
document.getElementById('apiModel').value=m;this.closeSelector();
},

saveApiConfig:function(){
let url=document.getElementById('apiBaseUrl').value.trim();let key=document.getElementById('apiKey').value.trim();let model=document.getElementById('apiModel').value.trim();let temp=parseFloat(document.getElementById('apiTemp').value);
if(!url||!model)return this.appModal("Base URL and Model ID are required! 🥺");
this.data.apiConfig.baseUrl=url;this.data.apiConfig.apiKey=key;this.data.apiConfig.model=model;this.data.apiConfig.temperature=temp;this.saveData();
document.getElementById('chatSubPage').style.transform='translateX(100%)';this.appModal("API Settings Saved! ✨");
},

askSaveApiPreset:function(){
this.appModal("Enter preset name:","prompt","My Preset",(name)=>{
if(name){
let preset={name:name,baseUrl:document.getElementById('apiBaseUrl').value.trim(),apiKey:document.getElementById('apiKey').value.trim(),model:document.getElementById('apiModel').value.trim(),temperature:parseFloat(document.getElementById('apiTemp').value)};
this.data.apiConfig.presets.push(preset);this.saveData();
document.getElementById('apiPresetDisplay').innerText=name;
}
});
},

openMasksPage:function(){
const page=document.getElementById('chatSubPage');
page.innerHTML=`<div style="height:36px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-shrink:0;">
<div onclick="document.getElementById('chatSubPage').style.transform='translateX(100%)'" style="cursor:pointer;opacity:0.8;display:flex;align-items:center;font-weight:bold;"><svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"></polyline></svg> Back</div>
<div style="font-size:calc(20px * var(--font-scale));font-weight:700;">Masks</div>
<div onclick="WinkApps['chat'].openMaskForm()" style="cursor:pointer;opacity:0.8;padding:4px;"><svg viewBox="0 0 24 24" style="width:26px;height:26px;stroke:currentColor;stroke-width:2.5;fill:none;stroke-linecap:round;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></div></div>
<div id="masksListContent" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;"></div>`;
page.style.transform='translateX(0)';this.renderMasksList();
},

renderMasksList:function(){
const container=document.getElementById('masksListContent');
if(this.data.masks.length===0){container.innerHTML=`<div style="text-align:center;padding-top:50px;opacity:0.4;font-weight:bold;">Empty masks</div>`;return;}
container.innerHTML=this.data.masks.map(m=>this.generateSwipeItemHTML(m,'mask')).join('');setTimeout(()=>this.bindSwipeEvents(),50);
},

openMaskForm:function(id=null){
if(window.isWinkSwiping)return;
const formPage=document.getElementById('chatFormPage');let mask={id:'mask_'+Date.now(),name:'',desc:'',avatar:''};
if(id){const exist=this.data.masks.find(m=>m.id===id);if(exist)mask={...exist};}
formPage.innerHTML=`<div style="height:36px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-shrink:0;">
<div onclick="document.getElementById('chatFormPage').style.transform='translateY(100%)'" style="cursor:pointer;opacity:0.6;font-weight:700;font-size:calc(16px * var(--font-scale));">Cancel</div>
<div onclick="WinkApps['chat'].saveMask('${mask.id}')" style="cursor:pointer;font-weight:800;font-size:calc(16px * var(--font-scale));color:var(--text-main);">Save</div></div>
<div style="flex:1;display:flex;flex-direction:column;gap:24px;">
<div style="align-self:center;position:relative;margin-bottom:10px;">
<input type="file" id="maskAvatarInput" accept="image/*" style="display:none;" onchange="WinkApps['chat'].formPreviewAvatar(event,'maskAvatarPreview','maskAvatarData')">
<img id="maskAvatarPreview" src="${mask.avatar||'https://ui-avatars.com/api/?name=Mask&background=random'}" style="width:84px;height:84px;border-radius:22px;object-fit:cover;border:2px solid var(--glass-border);box-shadow:0 8px 20px rgba(0,0,0,0.1);">
<div onclick="document.getElementById('maskAvatarInput').click()" style="position:absolute;bottom:-8px;right:-8px;background:var(--text-main);color:#fff;border-radius:50%;width:32px;height:32px;display:flex;justify-content:center;align-items:center;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,0.2);"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></div></div>
<input type="hidden" id="maskAvatarData" value="${mask.avatar}">
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">Mask Name</div>
<input type="text" id="maskName" value="${mask.name}" style="width:100%;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);font-family:inherit;color:var(--text-main);font-weight:bold;outline:none;font-size:calc(14px * var(--font-scale));"></div>
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">Description</div>
<textarea id="maskDesc" style="width:100%;height:90px;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);font-family:inherit;color:var(--text-main);outline:none;resize:none;font-size:calc(14px * var(--font-scale));">${mask.desc}</textarea></div></div>`;
formPage.style.transform='translateY(0)';
},

saveMask:function(id){
const name=document.getElementById('maskName').value.trim();if(!name){this.appModal('Mask name cannot be empty! 🥺');return;}
const newMask={id:id,name:name,desc:document.getElementById('maskDesc').value.trim(),avatar:document.getElementById('maskAvatarData').value};
const index=this.data.masks.findIndex(m=>m.id===id);
if(index>-1)this.data.masks[index]=newMask;else this.data.masks.unshift(newMask);
this.saveData();document.getElementById('chatFormPage').style.transform='translateY(100%)';this.renderMasksList();
},

askDeleteMask:function(id){
this.appModal('Delete this mask? 🥺','confirm','',(confirm)=>{if(confirm){this.data.masks=this.data.masks.filter(m=>m.id!==id);this.saveData();this.renderMasksList();}else{this.renderMasksList();}});
},

openWalletPage:function(){
const page=document.getElementById('chatSubPage');
if(this.data.currentCardIdx>=this.data.wallet.cards.length)this.data.currentCardIdx=0;

page.innerHTML=`<div style="height:36px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-shrink:0;">
<div onclick="document.getElementById('chatSubPage').style.transform='translateX(100%)'" style="cursor:pointer;opacity:0.8;display:flex;align-items:center;font-weight:bold;"><svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;stroke-width:2;fill:none;"><polyline points="15 18 9 12 15 6"></polyline></svg> Back</div>
<div style="font-size:calc(20px * var(--font-scale));font-weight:700;">Wallet</div><div style="width:24px;"></div></div>
<div style="height:280px;display:flex;margin-bottom:20px;position:relative;flex-shrink:0;">
<div style="width:60px;display:flex;flex-direction:column;justify-content:center;gap:20px;z-index:110;">
<div onclick="WinkApps['chat'].openCardForm()" title="添加卡片" style="width:48px;height:48px;border-radius:50%;background:var(--glass-bg);backdrop-filter:blur(10px);border:1px solid var(--glass-border);display:flex;justify-content:center;align-items:center;cursor:pointer;color:var(--text-main);"><svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></div>
<div onclick="WinkApps['chat'].askRechargeCard()" title="充值额度" style="width:48px;height:48px;border-radius:50%;background:var(--glass-bg);backdrop-filter:blur(10px);border:1px solid var(--glass-border);display:flex;justify-content:center;align-items:center;cursor:pointer;color:var(--text-main);"><svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none;"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
<div onclick="WinkApps['chat'].askGiftCard()" title="赠送卡片" style="width:48px;height:48px;border-radius:50%;background:var(--glass-bg);backdrop-filter:blur(10px);border:1px solid var(--glass-border);display:flex;justify-content:center;align-items:center;cursor:pointer;color:var(--text-main);"><svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none;"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg></div></div>
<div id="cards3DContainer" style="flex:1;position:relative;margin-right:-24px;"></div></div>
<div style="flex:1;background:var(--glass-bg);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border-top:1px solid var(--glass-border);border-radius:32px 32px 0 0;margin:0 -24px -30px -24px;padding:24px 24px 50px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -5px 20px rgba(0,0,0,0.05);">
<div style="font-weight:bold;font-size:calc(16px * var(--font-scale));margin-bottom:16px;flex-shrink:0;padding:0 4px;">Transactions</div>
<div id="txList" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;padding:0 4px;"></div></div>`;
page.style.transform='translateX(0)';this.renderCards3D();this.renderTxList();setTimeout(()=>this.bindCardSwipe(),50);
},

renderCards3D:function(){
const container=document.getElementById('cards3DContainer');if(!container)return;
const cards=this.data.wallet.cards;
if(cards.length===0){container.innerHTML=`<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;opacity:0.4;font-weight:bold;">No Cards Available</div>`;return;}

if(container.children.length!==cards.length||!document.getElementById('wc_'+cards[0].id)){
let html='';
cards.forEach(c=>{
let cardBg='linear-gradient(135deg, #2b2c33 0%, #0d0d12 100%)';
html+=`<div id="wc_${c.id}" style="position:absolute;width:270px;height:165px;right:-45px;top:45px;background:${cardBg};border-radius:24px;padding:20px 65px 20px 24px;color:#fff;display:flex;flex-direction:column;justify-content:space-between;transform-origin:right center;transition:all 0.5s cubic-bezier(0.2,0.8,0.2,1);will-change:transform,opacity,box-shadow;z-index:0;opacity:0;">
<div style="display:flex;justify-content:space-between;align-items:center;">
<svg viewBox="0 0 24 24" style="width:28px;height:28px;stroke:#F1C40F;stroke-width:1.5;fill:none;"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
<div style="font-weight:bold;font-size:16px;letter-spacing:1px;text-shadow:0 2px 4px rgba(0,0,0,0.5);">${c.org}</div></div>
<div style="font-family:monospace;font-size:20px;letter-spacing:3px;text-shadow:0 2px 4px rgba(0,0,0,0.5);">**** ${c.no.slice(-4)}</div>
<div style="display:flex;justify-content:space-between;align-items:flex-end;">
<div style="font-size:10px;opacity:0.8;text-transform:uppercase;">Balance</div>
<div id="wc_bal_${c.id}" style="font-size:24px;font-weight:800;text-shadow:0 2px 4px rgba(0,0,0,0.5);">$${c.balance}</div></div></div>`;
});
container.innerHTML=html;container.offsetHeight;
}else{
cards.forEach(c=>{const el=document.getElementById('wc_bal_'+c.id);if(el)el.innerText='$'+c.balance;});
}

const idx=this.data.currentCardIdx;const N=cards.length;
cards.forEach((c,i)=>{
let el=document.getElementById('wc_'+c.id);if(!el)return;
let diff=(i-idx+N)%N;
let tx=0,ty=0,rot=0,scale=1,z=100,op=1,shadow='none';

if(diff===0){
rot=0;scale=1;z=100;op=1;shadow='0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.2)';
}else if(diff===1){
rot=-14;scale=0.94;z=99;op=0.4;shadow='0 10px 20px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)';
}else if(diff===2&&N>=3){
rot=14;scale=0.88;z=98;op=0.15;shadow='0 10px 20px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)';
}else if(diff===N-1&&N>=3){
tx=-150;ty=-50;rot=-30;scale=1.05;z=101;op=0;
}else{
tx=0;ty=50;rot=30;scale=0.7;z=90;op=0;
}
el.style.transform=`translateX(${tx}px) translateY(${ty}px) scale(${scale}) rotateZ(${rot}deg)`;
el.style.zIndex=z;el.style.opacity=op;el.style.boxShadow=shadow;
});
},

bindCardSwipe:function(){
const container=document.getElementById('cards3DContainer');if(!container)return;
let startY=0,startX=0;
container.addEventListener('touchstart',e=>{startY=e.touches[0].clientY;startX=e.touches[0].clientX;},{passive:true});
container.addEventListener('touchend',e=>{
let dy=e.changedTouches[0].clientY-startY;let dx=e.changedTouches[0].clientX-startX;
if(Math.abs(dy)>30||Math.abs(dx)>30){
const len=this.data.wallet.cards.length;if(len<=1)return;
if(dy<-30||dx<-30){this.data.currentCardIdx=(this.data.currentCardIdx+1)%len;this.renderCards3D();
}else if(dy>30||dx>30){this.data.currentCardIdx=(this.data.currentCardIdx-1+len)%len;this.renderCards3D();
}}});
},

openCardForm:function(){
const formPage=document.getElementById('chatFormPage');
formPage.innerHTML=`<div style="height:36px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-shrink:0;">
<div onclick="document.getElementById('chatFormPage').style.transform='translateY(100%)'" style="cursor:pointer;opacity:0.6;font-weight:700;font-size:calc(16px * var(--font-scale));">Cancel</div>
<div onclick="WinkApps['chat'].saveCard()" style="cursor:pointer;font-weight:800;font-size:calc(16px * var(--font-scale));color:var(--text-main);">Add Card</div></div>
<div style="flex:1;display:flex;flex-direction:column;gap:24px;">
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">Organization (e.g. Visa)</div>
<input type="text" id="cardOrg" style="width:100%;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);font-family:inherit;color:var(--text-main);font-weight:bold;outline:none;font-size:calc(14px * var(--font-scale));"></div>
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">Card Number</div>
<input type="number" id="cardNo" placeholder="At least 4 digits" style="width:100%;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);font-family:inherit;color:var(--text-main);font-weight:bold;outline:none;font-size:calc(14px * var(--font-scale));"></div>
<div style="display:flex;flex-direction:column;gap:6px;"><div style="opacity:0.8;font-size:calc(13px * var(--font-scale));font-weight:bold;margin-left:4px;">Initial Balance</div>
<input type="number" id="cardBalance" value="0" style="width:100%;padding:14px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.4);font-family:inherit;color:var(--text-main);font-weight:bold;outline:none;font-size:calc(14px * var(--font-scale));"></div></div>`;
formPage.style.transform='translateY(0)';
},

saveCard:function(){
let org=document.getElementById('cardOrg').value.trim();let no=document.getElementById('cardNo').value.trim();let bal=parseFloat(document.getElementById('cardBalance').value)||0;
if(!org||no.length<4){this.appModal("Invalid Card Info! 🥺");return;}
this.data.wallet.cards.push({id:'card_'+Date.now(),org:org,no:no,balance:bal});this.saveData();
document.getElementById('chatFormPage').style.transform='translateY(100%)';this.data.currentCardIdx=this.data.wallet.cards.length-1;this.renderCards3D();
},

askRechargeCard:function(){
if(this.data.wallet.cards.length===0){this.appModal("No card to recharge! 🥺");return;}
let c=this.data.wallet.cards[this.data.currentCardIdx];
this.appModal(`Recharge ${c.org} (**${c.no.slice(-4)})`,'prompt','100',(amt)=>{
let val=parseFloat(amt);if(val>0){c.balance+=val;this.addTx(`Recharged card (**${c.no.slice(-4)})`,val);this.saveData();this.renderCards3D();this.renderTxList();}});
},

askGiftCard:function(){
if(this.data.wallet.cards.length===0){this.appModal("No card to gift! 🥺");return;}
if(this.data.characters.length===0){this.appModal("No characters to gift! 🥺");return;}
const modal=document.getElementById('chatSelectorModal');const list=document.getElementById('selectorList');
list.innerHTML=this.data.characters.map(c=>`<div onclick="WinkApps['chat'].doGiftCard('${c.id}')" style="padding:16px;background:rgba(255,255,255,0.4);border-radius:16px;border:1px solid var(--glass-border);font-weight:bold;font-size:calc(15px * var(--font-scale));cursor:pointer;text-align:center;display:flex;align-items:center;justify-content:center;gap:12px;"><img src="${c.avatar||'https://ui-avatars.com/api/?name='+c.name+'&background=random'}" style="width:30px;height:30px;border-radius:8px;object-fit:cover;">Gift to ${c.name}</div>`).join('');
modal.style.display='flex';setTimeout(()=>{modal.style.opacity='1';document.getElementById('selectorBox').style.transform='translateY(0)';},10);
},

doGiftCard:function(charId){
this.closeSelector();let card=this.data.wallet.cards.splice(this.data.currentCardIdx,1)[0];let char=this.data.characters.find(c=>c.id===charId);
this.addTx(`Gifted (**${card.no.slice(-4)}) to ${char.name}`,-card.balance);
if(this.data.currentCardIdx>0)this.data.currentCardIdx--;

/* 🌟 将赠卡事件写入聊天室记录！ */
char.messages=char.messages||[];
char.messages.push({role:'event',content:`💳 Gifted Card\nOrg: ${card.org}\nNo: **** ${card.no.slice(-4)}\nBalance: $${card.balance}`});

this.saveData();const container=document.getElementById('cards3DContainer');if(container)container.innerHTML='';
this.renderCards3D();this.renderTxList();this.appModal(`Successfully gifted to ${char.name}! ✨`);
},

addTx:function(desc,amt){
let time=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
this.data.wallet.txs.unshift({id:'tx_'+Date.now(),time:time,desc:desc,amount:amt});
},

renderTxList:function(){
const list=document.getElementById('txList');if(!list)return;
if(this.data.wallet.txs.length===0){list.innerHTML=`<div style="text-align:center;padding-top:20px;opacity:0.4;font-weight:bold;">No transactions</div>`;return;}
list.innerHTML=this.data.wallet.txs.map(tx=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:rgba(255,255,255,0.3);border-radius:12px;">
<div style="display:flex;flex-direction:column;gap:4px;"><div style="font-weight:bold;font-size:calc(14px * var(--font-scale));">${tx.desc}</div><div style="font-size:calc(11px * var(--font-scale));opacity:0.6;">${tx.time}</div></div>
<div style="font-weight:900;font-size:calc(16px * var(--font-scale));color:${tx.amount>=0?'var(--text-main)':'#e74c3c'}">${tx.amount>0?'+':''}${tx.amount}</div></div>`).join('');
},

appModal:function(title,type='alert',defaultValue='',callback=null){
const modalBox=document.getElementById('chatAppModal');
let innerHtml=`<div style="width:100%;background:var(--glass-bg);backdrop-filter:blur(25px);-webkit-backdrop-filter:blur(25px);border:1px solid var(--glass-border);border-radius:24px;padding:24px;display:flex;flex-direction:column;gap:16px;box-shadow:0 20px 40px rgba(0,0,0,0.15);">
<div style="font-size:calc(16px * var(--font-scale));font-weight:700;text-align:center;">${title}</div>`;
if(type==='prompt')innerHtml+=`<input type="text" id="appModalInput" value="${defaultValue}" style="width:100%;padding:12px;border-radius:12px;background:rgba(255,255,255,0.4);border:1px solid var(--glass-border);outline:none;font-family:inherit;color:var(--text-main);font-weight:bold;font-size:calc(14px * var(--font-scale));">`;
innerHtml+=`<div style="display:flex;gap:10px;margin-top:8px;">`;
if(type!=='alert')innerHtml+=`<button id="appModalCancel" style="flex:1;padding:12px;border-radius:12px;background:rgba(255,255,255,0.3);border:1px solid var(--glass-border);color:var(--text-main);font-weight:bold;font-family:inherit;cursor:pointer;font-size:calc(14px * var(--font-scale));transition:background 0.2s;">Cancel</button>`;
innerHtml+=`<button id="appModalConfirm" style="flex:1;padding:12px;border-radius:12px;background:var(--text-main);color:#fff;border:none;font-weight:bold;font-family:inherit;cursor:pointer;font-size:calc(14px * var(--font-scale));transition:opacity 0.2s;">OK</button></div></div>`;
modalBox.innerHTML=innerHtml;modalBox.style.display='flex';setTimeout(()=>{modalBox.style.opacity='1';},10);
const closeMyModal=()=>{modalBox.style.opacity='0';setTimeout(()=>{modalBox.style.display='none';},300);};
document.getElementById('appModalConfirm').onclick=()=>{let val=null;if(type==='prompt')val=document.getElementById('appModalInput').value.trim();closeMyModal();if(callback)callback(type==='prompt'?val:true);};
if(type!=='alert'){document.getElementById('appModalCancel').onclick=()=>{closeMyModal();if(type==='prompt'&&callback)callback(null);};}
},

askUpdateUserName:function(){
this.appModal('Enter new name','prompt',this.data.user.name,(newName)=>{if(newName!==null&&newName!==''){this.data.user.name=newName;this.saveData();this.renderCurrentTab();}});
}
};