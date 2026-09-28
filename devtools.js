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
    .__dt_row .k{flex:0 0 34%;color:#b7ac93;word-break:break-all;}
    .__dt_row .v{flex:1;color:#f2cf7e;font-weight:bold;word-break:break-all;}
    .__dt_row button{background:#1a3a28;border:1px solid #d4af37;color:#f2cf7e;border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;}
    .__dt_row button:hover{background:#d4af37;color:#2a1e05;}
    .__dt_row button.danger{background:#3a1a1a;border-color:#b8342a;color:#d9534a;}
    .__dt_row input.__dt_in{background:#000;color:#0f0;border:1px solid #8a6f2a;border-radius:4px;padding:4px;font-size:11px;font-family:monospace;min-width:0;}
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

  function fmt(v){
    if(v === null || v === undefined || v === "") return "";
    if(typeof v === "object"){ try { return JSON.stringify(v); } catch(e){ return "[obj]"; } }
    return String(v);
  }
  function getField(field){
    try {
      var c = JSON.parse(readLS("zolotoy_stol_clicker") || "{}") || {};
      return c[field];
    } catch(e){ return undefined; }
  }
  function escapeAttr(s){
    return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  // ====== ВКЛАДКА ПЕРЕМЕННЫЕ ======
  function renderVars(){
    var h = "";

    // БАЛАНС
    h += '<div class="__dt_section"><h4>💰 Баланс</h4>';
    h += '<div class="__dt_row">' +
         '<span class="k">zolotoy_stol_balance</span>' +
         '<input class="__dt_in" data-store="zolotoy_stol_balance" value="' + escapeAttr(readLS("zolotoy_stol_balance")||"") + '">' +
         '<button class="__dt_apply_ls" data-store="zolotoy_stol_balance">OK</button>' +
         '</div>';
    h += '</div>';

    // КЛИКЕР
    h += '<div class="__dt_section"><h4>👆 Кликер (zolotoy_stol_clicker)</h4>';
    ["totalClicks","totalEarned","xp","skin","upgBought","bizOwned"].forEach(function(f){
      h += '<div class="__dt_row">' +
           '<span class="k">' + f + '</span>' +
           '<input class="__dt_in" data-field="' + f + '" value="' + escapeAttr(fmt(getField(f))) + '">' +
           '<button class="__dt_apply_field" data-field="' + f + '">OK</button>' +
           '</div>';
    });
    ["upgrades","biz","ach"].forEach(function(f){
      h += '<div class="__dt_row">' +
           '<span class="k">' + f + ' (JSON)</span>' +
           '<input class="__dt_in" data-field="' + f + '" value="' + escapeAttr(fmt(getField(f))) + '">' +
           '<button class="__dt_apply_field" data-field="' + f + '" data-json="1">OK</button>' +
           '</div>';
    });
    h += '</div>';

    body.innerHTML = h;

    body.querySelectorAll(".__dt_apply_ls").forEach(function(b){
      b.onclick = function(){
        var key = b.dataset.store;
        var inp = body.querySelector('.__dt_in[data-store="' + key + '"]');
        var v = inp.value;
        if(v === "") return;
        localStorage.setItem(key, v);
        sessionStorage.setItem("__dt_auto", "1");
        location.reload();
      };
    });

    body.querySelectorAll(".__dt_apply_field").forEach(function(b){
      b.onclick = function(){
        var f = b.dataset.field;
        var inp = body.querySelector('.__dt_in[data-field="' + f + '"]');
        var v = inp.value;
        var c;
        try { c = JSON.parse(readLS("zolotoy_stol_clicker") || "{}") || {}; } catch(e){ c = {}; }

        if(b.dataset.json === "1"){
          try { c[f] = JSON.parse(v); }
          catch(e){ alert("Плохой JSON: " + e.message); return; }
        } else {
          var num = Number(v);
          c[f] = (v !== "" && !isNaN(num)) ? num : v;
        }

        localStorage.setItem("zolotoy_stol_clicker", JSON.stringify(c));
        sessionStorage.setItem("__dt_auto", "1");
        location.reload();
      };
    });
  }

  // ====== ВКЛАДКА DOM ======
  function renderDom(){
    var h = '<div class="__dt_section"><h4>🎛 Ставки (data-атрибуты)</h4>';
    ["slotbet","roubet","bjbet"].forEach(function(a){
      h += '<div style="font-size:11px;color:#b7ac93;margin:6px 0 3px;">data-' + a + '</div>';
      q("[data-"+a+"]").forEach(function(el,i){
        h += '<div class="__dt_row"><span class="k">#'+i+' ['+escapeAttr(el.textContent)+']</span>' +
             '<input class="__dt_in" data-attr="'+a+'" data-idx="'+i+'" value="' + escapeAttr(el.getAttribute("data-"+a)) + '">' +
             '<button class="__dt_apply_attr" data-attr="'+a+'" data-idx="'+i+'">OK</button></div>';
      });
    });
    h += '</div>';
    h += '<div class="__dt_section"><h4>🎯 Все чипы</h4>';
    q(".chip-btn").forEach(function(el,i){
      h += '<div class="__dt_row"><span class="k">chip#'+i+'</span>' +
           '<input class="__dt_in" data-chip="'+i+'" value="' + escapeAttr(el.textContent) + '">' +
           '<button class="__dt_apply_chip" data-idx="'+i+'">OK</button></div>';
    });
    h += '</div>';
    body.innerHTML = h;

    body.querySelectorAll(".__dt_apply_attr").forEach(function(b){
      b.onclick = function(){
        var a = b.dataset.attr, i = +b.dataset.idx;
        var inp = body.querySelector('.__dt_in[data-attr="'+a+'"][data-idx="'+i+'"]');
        var v = inp.value;
        var els = document.querySelectorAll('[data-'+a+']');
        if(!els[i]) return;
        els[i].setAttribute('data-'+a, v);
        els[i].textContent = v;
      };
    });

    body.querySelectorAll(".__dt_apply_chip").forEach(function(b){
      b.onclick = function(){
        var i = +b.dataset.idx;
        var inp = body.querySelector('.__dt_in[data-chip="'+i+'"]');
        var els = document.querySelectorAll('.chip-btn');
        if(els[i]) els[i].textContent = inp.value;
      };
    });
  }

  // ====== ВКЛАДКА КОНСОЛЬ ======
  function renderConsole(){
    body.innerHTML =
      '<div class="__dt_section"><h4>⚡ JS-консоль</h4>' +
      '<textarea id="__dt_console" placeholder="// любой код"></textarea>' +
      '<button id="__dt_run" style="margin-top:8px;width:100%;padding:9px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;cursor:pointer;">▶ Выполнить</button></div>' +
      '<div class="__dt_section"><h4>📋 Быстрые команды</h4><div class="__dt_quick">' +
      '<button id="__dt_q1">+100M баланс</button>' +
      '<button id="__dt_q2">+900T баланс</button>' +
      '<button id="__dt_q3">Ур. 50</button>' +
      '<button id="__dt_q4">Max апгрейды</button>' +
      '<button id="__dt_q5">Max бизнесы</button>' +
      '<button id="__dt_q6" class="dark">Все ачивки</button>' +
      '<button id="__dt_q7" class="danger">Сброс</button>' +
      '</div></div>';

    document.getElementById("__dt_run").onclick = function(){
      try { eval(document.getElementById("__dt_console").value); }
      catch(e){ alert("Error: " + e.message); }
    };
    function reload(){ sessionStorage.setItem("__dt_auto","1"); location.reload(); }
    document.getElementById("__dt_q1").onclick = function(){ localStorage.setItem("zolotoy_stol_balance","100000000"); reload(); };
    document.getElementById("__dt_q2").onclick = function(){ localStorage.setItem("zolotoy_stol_balance","900000000000000"); reload(); };
    document.getElementById("__dt_q3").onclick = function(){ var c=JSON.parse(localStorage.getItem("zolotoy_stol_clicker")||"{}"); c.xp=999999; localStorage.setItem("zolotoy_stol_clicker",JSON.stringify(c)); reload(); };
    document.getElementById("__dt_q4").onclick = function(){ var c=JSON.parse(localStorage.getItem("zolotoy_stol_clicker")||"{}"); c.upgrades={power:100,gold:1,crit:3}; localStorage.setItem("zolotoy_stol_clicker",JSON.stringify(c)); reload(); };
    document.getElementById("__dt_q5").onclick = function(){ var c=JSON.parse(localStorage.getItem("zolotoy_stol_clicker")||"{}"); c.biz={kiosk:999,cafe:999,casinoB:999}; localStorage.setItem("zolotoy_stol_clicker",JSON.stringify(c)); reload(); };
    document.getElementById("__dt_q6").onclick = function(){ var c=JSON.parse(localStorage.getItem("zolotoy_stol_clicker")||"{}"); c.ach={c100:1,c1000:1,c10000:1,c100000:1,c500000:1,c1m:1,e500:1,e5k:1,e50k:1,lvl5:1,lvl10:1,firstUp:1,crit:1,biz:1}; localStorage.setItem("zolotoy_stol_clicker",JSON.stringify(c)); reload(); };
    document.getElementById("__dt_q7").onclick = function(){ if(confirm("Сбросить ВСЁ?")){ localStorage.removeItem("zolotoy_stol_balance"); localStorage.removeItem("zolotoy_stol_clicker"); reload(); } };
  }

  // ====== ВКЛАДКА БЫСТРО ======
  function renderQuick(){
    body.innerHTML =
      '<div class="__dt_section"><h4>🎛 Сменить ставку на 1 000 000</h4><div class="__dt_quick">' +
      '<button id="__dt_qs1">Слоты</button>' +
      '<button id="__dt_qs2">Рулетка</button>' +
      '<button id="__dt_qs3">Блэкджек</button>' +
      '</div></div>' +
      '<div class="__dt_section"><h4>🏷 Сменить название игры</h4>' +
      '<div class="__dt_row"><input id="__dt_title" class="__dt_in" style="flex:1;" placeholder="Новое название">' +
      '<button id="__dt_title_ok">OK</button></div></div>';
    document.getElementById("__dt_qs1").onclick = function(){ var e=document.querySelectorAll("[data-slotbet]"); if(e[3]){e[3].setAttribute("data-slotbet","1000000");e[3].textContent="1M";} };
    document.getElementById("__dt_qs2").onclick = function(){ var e=document.querySelectorAll("[data-roubet]"); if(e[3]){e[3].setAttribute("data-roubet","1000000");e[3].textContent="1M";} };
    document.getElementById("__dt_qs3").onclick = function(){ var e=document.querySelectorAll("[data-bjbet]"); if(e[3]){e[3].setAttribute("data-bjbet","1000000");e[3].textContent="1M";} };
    document.getElementById("__dt_title_ok").onclick = function(){
      var v = document.getElementById("__dt_title").value;
      if(!v) return;
      document.querySelectorAll(".brand-name,.game-title").forEach(function(e){ e.textContent = v; });
    };
  }

  function setTab(name){
    q(".__dt_tab").forEach(function(x){ x.classList.toggle("active", x.dataset.tab === name); });
    if(name === "vars") renderVars();
    else if(name === "dom") renderDom();
    else if(name === "console") renderConsole();
    else if(name === "quick") renderQuick();
  }

  q(".__dt_tab").forEach(function(tab){
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
