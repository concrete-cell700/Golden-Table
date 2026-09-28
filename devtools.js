(function(){
  "use strict";
  if(window.__devtoolsLoaded) return;
  window.__devtoolsLoaded = true;

  var css = document.createElement("style");
  css.textContent = `
    #__dt_btn{position:fixed;top:70px;right:10px;z-index:99999;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f2cf7e,#8a6f2a);border:2px solid #d4af37;color:#2a1e05;font-size:22px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.6);}
    #__dt_panel{position:fixed;top:0;right:0;width:92%;max-width:420px;height:100%;background:#0a1712;border-left:1px solid #d4af37;z-index:99998;display:none;flex-direction:column;font-family:monospace;color:#ece2c8;box-shadow:-6px 0 20px rgba(0,0,0,.7);}
    #__dt_panel.open{display:flex;}
    #__dt_head{padding:12px;background:#0d1f17;border-bottom:1px solid #d4af37;display:flex;justify-content:space-between;align-items:center;font-family:Georgia,serif;color:#f2cf7e;}
    #__dt_head b{font-size:15px;}
    #__dt_close{background:none;border:none;color:#d9534a;font-size:22px;cursor:pointer;}
    #__dt_tabs{display:flex;background:#0d1f17;border-bottom:1px solid #8a6f2a;}
    .__dt_tab{flex:1;padding:9px 4px;text-align:center;font-size:11px;cursor:pointer;color:#b7ac93;border-bottom:2px solid transparent;}
    .__dt_tab.active{color:#f2cf7e;border-bottom-color:#d4af37;}
    #__dt_body{flex:1;overflow-y:auto;padding:10px;}
    .__dt_section{margin-bottom:14px;}
    .__dt_section>h4{margin:0 0 6px;font-size:12px;color:#f2cf7e;font-family:Georgia,serif;border-bottom:1px dashed #8a6f2a;padding-bottom:4px;}
    .__dt_row{display:flex;align-items:center;gap:6px;padding:5px 6px;background:#0d1f17;border:1px solid #1e3a2a;border-radius:6px;margin-bottom:4px;font-size:11px;}
    .__dt_row .k{flex:0 0 42%;color:#b7ac93;word-break:break-all;}
    .__dt_row .v{flex:1;color:#f2cf7e;font-weight:bold;word-break:break-all;}
    .__dt_row button{background:#1a3a28;border:1px solid #d4af37;color:#f2cf7e;border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;}
    .__dt_row button:hover{background:#d4af37;color:#2a1e05;}
    .__dt_row button.danger{background:#3a1a1a;border-color:#b8342a;color:#d9534a;}
    #__dt_console{width:100%;background:#000;color:#0f0;border:1px solid #d4af37;border-radius:6px;padding:8px;font-family:monospace;font-size:12px;min-height:90px;resize:vertical;box-sizing:border-box;}
    .__dt_quick{display:flex;flex-wrap:wrap;gap:6px;}
    .__dt_quick button{flex:1;min-width:90px;padding:8px 6px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;font-size:11px;cursor:pointer;}
    .__dt_quick button.danger{background:linear-gradient(180deg,#d9534a,#b8342a);color:#ece2c8;}
    .__dt_quick button.dark{background:#1b1b1b;color:#ece2c8;border:1px solid #8a6f2a;}
  `;
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.id = "__dt_btn";
  btn.innerHTML = "⚙";
  document.body.appendChild(btn);

  var panel = document.createElement("div");
  panel.id = "__dt_panel";
  panel.innerHTML =
    '<div id="__dt_head"><b>⚙ DEVTOOLS</b><button id="__dt_close">✕</button></div>' +
    '<div id="__dt_tabs">' +
      '<div class="__dt_tab active" data-tab="vars">Переменные</div>' +
      '<div class="__dt_tab" data-tab="dom">DOM</div>' +
      '<div class="__dt_tab" data-tab="console">Консоль</div>' +
      '<div class="__dt_tab" data-tab="quick">Быстро</div>' +
    '</div>' +
    '<div id="__dt_body"></div>';
  document.body.appendChild(panel);

  var body = document.getElementById("__dt_body");
  function q(sel){ return document.querySelectorAll(sel); }
  function readLS(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }

  // ========== ВКЛАДКА: ПЕРЕМЕННЫЕ (как кнопки в консоли — setItem + reload) ==========
  function renderVars(){
    var h = "";
    h += '<div class="__dt_section"><h4>💰 Баланс</h4>';
    h += '<div class="__dt_row"><span class="k">balance</span><span class="v">' + (readLS("zolotoy_stol_balance")||"—") + '</span>' +
         '<button onclick="var v=prompt(\'Баланс:\',localStorage.getItem(\'zolotoy_stol_balance\'));if(v!==null){localStorage.setItem(\'zolotoy_stol_balance\',v);location.reload();}">✏</button></div>';
    h += '</div>';

    var c = {};
    try { c = JSON.parse(readLS("zolotoy_stol_clicker")||"{}") || {}; } catch(e){}

    h += '<div class="__dt_section"><h4>👆 Кликер</h4>';
    h += '<div class="__dt_row"><span class="k">totalClicks</span><span class="v">' + (c.totalClicks!==undefined?c.totalClicks:"—") + '</span>' +
         '<button onclick="var v=prompt(\'totalClicks:\',\'\');if(v===null)return;var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');c.totalClicks=v;localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();">✏</button></div>';
    h += '<div class="__dt_row"><span class="k">totalEarned</span><span class="v">' + (c.totalEarned!==undefined?c.totalEarned:"—") + '</span>' +
         '<button onclick="var v=prompt(\'totalEarned:\',\'\');if(v===null)return;var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');c.totalEarned=v;localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();">✏</button></div>';
    h += '<div class="__dt_row"><span class="k">xp</span><span class="v">' + (c.xp!==undefined?c.xp:"—") + '</span>' +
         '<button onclick="var v=prompt(\'xp:\',\'\');if(v===null)return;var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');c.xp=v;localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();">✏</button></div>';
    h += '<div class="__dt_row"><span class="k">level</span><span class="v">' + (c.level!==undefined?c.level:"—") + '</span>' +
         '<button onclick="var v=prompt(\'level:\',\'\');if(v===null)return;var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');c.level=v;localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();">✏</button></div>';
    h += '<div class="__dt_row"><span class="k">skin</span><span class="v">' + (c.skin!==undefined?c.skin:"—") + '</span>' +
         '<button onclick="var v=prompt(\'skin:\',\'\');if(v===null)return;var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');c.skin=v;localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();">✏</button></div>';
    h += '<div class="__dt_row"><span class="k">upgBought</span><span class="v">' + (c.upgBought!==undefined?c.upgBought:"—") + '</span>' +
         '<button onclick="var v=prompt(\'upgBought:\',\'\');if(v===null)return;var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');c.upgBought=v;localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();">✏</button></div>';
    h += '<div class="__dt_row"><span class="k">bizOwned</span><span class="v">' + (c.bizOwned!==undefined?c.bizOwned:"—") + '</span>' +
         '<button onclick="var v=prompt(\'bizOwned:\',\'\');if(v===null)return;var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');c.bizOwned=v;localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();">✏</button></div>';
    h += '<div class="__dt_row"><span class="k">upgrades</span><span class="v">' + JSON.stringify(c.upgrades||{}) + '</span>' +
         '<button onclick="var v=prompt(\'upgrades (JSON):\',JSON.stringify(JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\').upgrades||{}));if(v===null)return;var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');try{c.upgrades=JSON.parse(v);localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();}catch(e){alert(\'Bad JSON\')}">✏</button></div>';
    h += '<div class="__dt_row"><span class="k">biz</span><span class="v">' + JSON.stringify(c.biz||{}) + '</span>' +
         '<button onclick="var v=prompt(\'biz (JSON):\',JSON.stringify(JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\').biz||{}));if(v===null)return;var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');try{c.biz=JSON.parse(v);localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();}catch(e){alert(\'Bad JSON\')}">✏</button></div>';
    h += '<div class="__dt_row"><span class="k">ach</span><span class="v">' + Object.keys(c.ach||{}).length + ' шт.</span>' +
         '<button onclick="var v=prompt(\'ach (JSON):\',JSON.stringify(JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\').ach||{}));if(v===null)return;var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');try{c.ach=JSON.parse(v);localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();}catch(e){alert(\'Bad JSON\')}">✏</button></div>';
    h += '</div>';
    body.innerHTML = h;
  }

  // ========== ВКЛАДКА: DOM ==========
  function renderDom(){
    var h = '<div class="__dt_section"><h4>🎛 Ставки (data-атрибуты)</h4>';
    ["slotbet","roubet","bjbet"].forEach(function(a){
      h += '<div style="font-size:11px;color:#b7ac93;margin:6px 0 3px;">data-' + a + '</div>';
      q("[data-"+a+"]").forEach(function(el,i){
        h += '<div class="__dt_row"><span class="k">#'+i+' ['+el.textContent+']</span><span class="v">'+el.getAttribute("data-"+a)+'</span>' +
             '<button onclick="(function(){var v=prompt(\'Номинал:\',\'' + el.getAttribute("data-"+a) + '\');if(v===null)return;var els=document.querySelectorAll(\'[data-'+a+']\');els['+i+'].setAttribute(\'data-'+a+'\',v);els['+i+'].textContent=v;})()">✏</button></div>';
      });
    });
    h += '</div>';
    h += '<div class="__dt_section"><h4>🎯 Все чипы</h4>';
    q(".chip-btn").forEach(function(el,i){
      h += '<div class="__dt_row"><span class="k">chip#'+i+'</span><span class="v">'+el.textContent+'</span>' +
           '<button onclick="(function(){var v=prompt(\'Текст:\',\'' + el.textContent + '\');if(v!==null)document.querySelectorAll(\'.chip-btn\')['+i+'].textContent=v;})()">✏</button></div>';
    });
    h += '</div>';
    h += '<div class="__dt_section"><h4>🔎 Любой элемент</h4>' +
         '<div class="__dt_row"><span class="k">CSS-селектор</span><input id="__dt_sel" style="flex:1;background:#000;color:#0f0;border:1px solid #8a6f2a;border-radius:4px;padding:4px;font-size:11px;" placeholder=".num-cell"></div>' +
         '<div class="__dt_row"><button onclick="(function(){var s=document.getElementById(\'__dt_sel\').value;var el=document.querySelector(s);if(!el){alert(\'Не найдено\');return;}var v=prompt(\'innerHTML:\',el.innerHTML);if(v!==null)el.innerHTML=v;})()">✏ innerHTML</button>' +
         '<button onclick="(function(){var s=document.getElementById(\'__dt_sel\').value;var el=document.querySelector(s);if(!el){alert(\'Не найдено\');return;}var v=prompt(\'value:\',el.value||\'\');if(v!==null)el.value=v;})()">✏ value</button>' +
         '<button class="danger" onclick="(function(){var s=document.getElementById(\'__dt_sel\').value;document.querySelectorAll(s).forEach(function(e){e.remove();});})()">🗑 Удалить</button></div></div>';
    body.innerHTML = h;
  }

  // ========== ВКЛАДКА: КОНСОЛЬ ==========
  function renderConsole(){
    body.innerHTML =
      '<div class="__dt_section"><h4>⚡ JS-консоль</h4>' +
      '<textarea id="__dt_console" placeholder="// любой код"></textarea>' +
      '<button class="__dt_quick" style="margin-top:8px;width:100%;padding:9px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;cursor:pointer;" onclick="(function(){try{eval(document.getElementById(\'__dt_console\').value);}catch(e){alert(\'Error: \'+e.message)}})()">▶ Выполнить</button></div>' +
      '<div class="__dt_section"><h4>📋 Быстрые команды</h4><div class="__dt_quick">' +
      '<button onclick="localStorage.setItem(\'zolotoy_stol_balance\',\'9999999\');location.reload();">+9.9M баланс</button>' +
      '<button onclick="localStorage.setItem(\'zolotoy_stol_balance\',\'900000000000000\');location.reload();">+900T баланс</button>' +
      '<button onclick="(function(){var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');c.xp=999999;c.level=50;localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();})()">Ур. 50</button>' +
      '<button onclick="(function(){var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');c.upgrades={power:100,gold:1,crit:3};localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();})()">Max апгрейды</button>' +
      '<button onclick="(function(){var c=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');c.biz={kiosk:999,cafe:999,casinoB:999};localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(c));location.reload();})()">Max бизнесы</button>' +
      '<button class="dark" onclick="(function(){var s=JSON.parse(localStorage.getItem(\'zolotoy_stol_clicker\')||\'{}\');s.ach={c100:1,c1000:1,c10000:1,c100000:1,c500000:1,c1m:1,e500:1,e5k:1,e50k:1,lvl5:1,lvl10:1,firstUp:1,crit:1,biz:1};localStorage.setItem(\'zolotoy_stol_clicker\',JSON.stringify(s));location.reload();})()">Все ачивки</button>' +
      '<button class="danger" onclick="if(confirm(\'Сбросить ВСЁ?\')){localStorage.removeItem(\'zolotoy_stol_balance\');localStorage.removeItem(\'zolotoy_stol_clicker\');location.reload();}">Сброс</button>' +
      '</div></div>';
  }

  // ========== ВКЛАДКА: БЫСТРО ==========
  function renderQuick(){
    body.innerHTML =
      '<div class="__dt_section"><h4>🎛 Сменить ставку на 1 000 000</h4><div class="__dt_quick">' +
      '<button onclick="document.querySelectorAll(\'[data-slotbet]\')[3].setAttribute(\'data-slotbet\',\'1000000\');document.querySelectorAll(\'[data-slotbet]\')[3].textContent=\'1M\';alert(\'Слоты OK\')">Слоты</button>' +
      '<button onclick="document.querySelectorAll(\'[data-roubet]\')[3].setAttribute(\'data-roubet\',\'1000000\');document.querySelectorAll(\'[data-roubet]\')[3].textContent=\'1M\';alert(\'Рулетка OK\')">Рулетка</button>' +
      '<button onclick="document.querySelectorAll(\'[data-bjbet]\')[3].setAttribute(\'data-bjbet\',\'1000000\');document.querySelectorAll(\'[data-bjbet]\')[3].textContent=\'1M\';alert(\'Блэкджек OK\')">Блэкджек</button>' +
      '</div></div>' +
      '<div class="__dt_section"><h4>🏷 Сменить название игры</h4>' +
      '<div class="__dt_row"><input id="__dt_title" style="flex:1;background:#000;color:#0f0;border:1px solid #8a6f2a;border-radius:4px;padding:4px;font-size:11px;" placeholder="Новое название">' +
      '<button onclick="var v=document.getElementById(\'__dt_title\').value;if(v)document.querySelectorAll(\'.brand-name,.game-title\').forEach(function(e){e.textContent=v;});">OK</button></div></div>';
  }

  function setTab(name){
    document.querySelectorAll(".__dt_tab").forEach(function(x){ x.classList.toggle("active", x.dataset.tab === name); });
    if(name === "vars") renderVars();
    else if(name === "dom") renderDom();
    else if(name === "console") renderConsole();
    else if(name === "quick") renderQuick();
  }

  document.querySelectorAll(".__dt_tab").forEach(function(tab){
    tab.onclick = function(){ setTab(tab.dataset.tab); };
  });
  document.getElementById("__dt_close").onclick = function(){ panel.classList.remove("open"); };
  btn.onclick = function(){
    panel.classList.toggle("open");
    if(panel.classList.contains("open")) setTab("vars");
  };

  window.__devtools = { toggle: function(){ btn.onclick(); } };
  setTab("vars");
})();

/* ===== АВТОЗАГРУЗКА ПОСЛЕ RELOAD ===== */
(function(){
  if(sessionStorage.getItem('__dt_auto') === '1' && !document.getElementById('__dt_btn')){
    var s = document.createElement('script');
    s.src = 'https://concrete-cell700.github.io/Golden-Table/devtools.js?v=' + Date.now();
    document.body.appendChild(s);
  }
})();
