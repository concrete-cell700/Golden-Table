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

  // ====== БЕЗОПАСНОЕ ЧТЕНИЕ ======
  function tryJSON(str){
    try { return JSON.parse(str || "{}") || {}; } catch(e){ return {}; }
  }
  function fmt(v){
    if(v === null || v === undefined || v === "") return "—";
    if(typeof v === "object"){ try { return JSON.stringify(v); } catch(e){ return "[obj]"; } }
    return String(v);
  }
  // безопасно достать одно поле из кликера
  function getField(field){
    try {
      var c = tryJSON(readLS("zolotoy_stol_clicker"));
      return c[field];
    } catch(e){ return undefined; }
  }
  // безопасно записать одно поле в кликер
  function setField(field, value){
    var c = tryJSON(readLS("zolotoy_stol_clicker"));
    c[field] = value;
    try { localStorage.setItem("zolotoy_stol_clicker", JSON.stringify(c)); return true; }
    catch(e){ return false; }
  }

  // ====== ВКЛАДКА ПЕРЕМЕННЫЕ ======
  function renderVars(){
    var h = "";

    // Баланс
    h += '<div class="__dt_section"><h4>💰 Баланс</h4>';
    h += '<div class="__dt_row"><span class="k">balance</span><span class="v">' + fmt(readLS("zolotoy_stol_balance")) + '</span>' +
         '<button data-field="balance" data-json="0">✏</button></div>';
    h += '</div>';

    // Кликер — каждое поле отдельно
    h += '<div class="__dt_section"><h4>👆 Кликер</h4>';
    ["totalClicks","totalEarned","xp","level","skin","upgBought","bizOwned"].forEach(function(f){
      h += '<div class="__dt_row"><span class="k">' + f + '</span><span class="v">' + fmt(getField(f)) + '</span>' +
           '<button data-field="' + f + '" data-json="0">✏</button></div>';
    });
    ["upgrades","biz","ach"].forEach(function(f){
      h += '<div class="__dt_row"><span class="k">' + f + '</span><span class="v">' + fmt(getField(f)) + '</span>' +
           '<button data-field="' + f + '" data-json="1">✏</button></div>';
    });
    h += '</div>';

    body.innerHTML = h;
  }

  // ====== ВКЛАДКА DOM ======
  function renderDom(){
    var h = '<div class="__dt_section"><h4>🎛 Ставки</h4>';
    ["slotbet","roubet","bjbet"].forEach(function(a){
      h += '<div style="font-size:11px;color:#b7ac93;margin:6px 0 3px;">data-' + a + '</div>';
      q("[data-"+a+"]").forEach(function(el,i){
        h += '<div class="__dt_row"><span class="k">#'+i+' ['+el.textContent+']</span><span class="v">'+el.getAttribute("data-"+a)+'</span>' +
             '<button data-attr="'+a+'" data-idx="'+i+'">✏</button></div>';
      });
    });
    h += '</div>';
    h += '<div class="__dt_section"><h4>🔎 Любой элемент</h4>' +
         '<div class="__dt_row"><span class="k">CSS</span><input id="__dt_sel" style="flex:1;background:#000;color:#0f0;border:1px solid #8a6f2a;border-radius:4px;padding:4px;font-size:11px;" placeholder=".num-cell"></div>' +
         '<div class="__dt_row"><button data-edit="html">✏ innerHTML</button>' +
         '<button data-edit="value">✏ value</button>' +
         '<button class="danger" data-edit="del">🗑 Удалить</button></div></div>';
    body.innerHTML = h;
  }

  // ====== ВКЛАДКА КОНСОЛЬ ======
  function renderConsole(){
    body.innerHTML =
      '<div class="__dt_section"><h4>⚡ JS-консоль</h4>' +
      '<textarea id="__dt_console" placeholder="// любой код"></textarea>' +
      '<button class="__dt_quick" style="margin-top:8px;width:100%;padding:9px;" data-quick="run">▶ Выполнить</button></div>' +
      '<div class="__dt_section"><h4>📋 Быстрые команды</h4><div class="__dt_quick">' +
      '<button data-quick="bal9m">+9.9M баланс</button>' +
      '<button data-quick="bal900t">+900T баланс</button>' +
      '<button data-quick="lvl">Ур. 50</button>' +
      '<button data-quick="upg">Max апгрейды</button>' +
      '<button data-quick="biz">Max бизнесы</button>' +
      '<button class="dark" data-quick="ach">Все ачивки</button>' +
      '<button class="dark" data-quick="betall">Ставки 1M</button>' +
      '<button class="danger" data-quick="reset">Сброс</button>' +
      '</div></div>';
  }

  // ====== ВКЛАДКА БЫСТРО ======
  function renderQuick(){
    body.innerHTML =
      '<div class="__dt_section"><h4>🎛 Номиналы</h4><div class="__dt_quick">' +
      '<button data-quick="bet-slots">Слоты 1M</button>' +
      '<button data-quick="bet-rou">Рулетка 1M</button>' +
      '<button data-quick="bet-bj">Блэкджек 1M</button>' +
      '<button data-quick="betall">Все 1M</button>' +
      '</div></div>' +
      '<div class="__dt_section"><h4>🏷 Название</h4>' +
      '<div class="__dt_row"><input id="__dt_title" style="flex:1;background:#000;color:#0f0;border:1px solid #8a6f2a;border-radius:4px;padding:4px;font-size:11px;" placeholder="Новое название">' +
      '<button data-quick="title">OK</button></div></div>';
  }

  // ====== ЕДИНЫЙ ОБРАБОТЧИК ======
  body.addEventListener("click", function(e){

    // ---- ПЕРЕМЕННЫЕ ----
    var bField = e.target.closest("[data-field]");
    if(bField){
      var field = bField.dataset.field;
      var isJSON = bField.dataset.json === "1";
      var cur;

      if(field === "balance"){
        cur = readLS("zolotoy_stol_balance") || "1000000";
      } else {
        var val = getField(field);
        if(isJSON) cur = JSON.stringify(val || {});
        else cur = (val !== undefined && val !== null) ? String(val) : "";
      }

      var v = prompt(field + ":", cur);
      if(v === null) return;

      if(field === "balance"){
        localStorage.setItem("zolotoy_stol_balance", v);
      } else if(isJSON){
        try { setField(field, JSON.parse(v)); }
        catch(err){ alert("Bad JSON для " + field); return; }
      } else {
        setField(field, v); // строкой — большие числа ок
      }

      sessionStorage.setItem('__dt_auto','1');
      location.reload();
      return;
    }

    // ---- DOM: ставки ----
    var bAttr = e.target.closest("[data-attr]");
    if(bAttr){
      var a = bAttr.dataset.attr, i = bAttr.dataset.idx;
      var el = q("[data-"+a+"]")[i];
      var v2 = prompt("Значение:", el.getAttribute("data-"+a));
      if(v2 === null) return;
      el.setAttribute("data-"+a, v2);
      el.textContent = v2;
      return;
    }

    // ---- DOM: любой элемент ----
    var bEdit = e.target.closest("[data-edit]");
    if(bEdit){
      var edit = bEdit.dataset.edit;
      var sel = document.getElementById("__dt_sel").value;
      if(edit === "html"){
        var e1 = document.querySelector(sel);
        if(!e1){ alert("Не найдено"); return; }
        var vh = prompt("innerHTML:", e1.innerHTML);
        if(vh !== null) e1.innerHTML = vh;
      } else if(edit === "value"){
        var e2 = document.querySelector(sel);
        if(!e2){ alert("Не найдено"); return; }
        var vv = prompt("value:", e2.value || "");
        if(vv !== null) e2.value = vv;
      } else if(edit === "del"){
        q(sel).forEach(function(el){ el.remove(); });
      }
      return;
    }

    // ---- БЫСТРЫЕ КОМАНДЫ ----
    var bQuick = e.target.closest("[data-quick]");
    if(bQuick){
      var act = bQuick.dataset.quick;
      var c, v3;

      if(act === "run"){
        try { eval(document.getElementById("__dt_console").value); }
        catch(err){ alert("Error: " + err.message); }
        return;
      }
      if(act === "bal9m"){
        localStorage.setItem("zolotoy_stol_balance","9999999");
      } else if(act === "bal900t"){
        localStorage.setItem("zolotoy_stol_balance","900000000000000");
      } else if(act === "lvl"){
        c = tryJSON(readLS("zolotoy_stol_clicker")); c.xp=999999; c.level=50;
        localStorage.setItem("zolotoy_stol_clicker", JSON.stringify(c));
      } else if(act === "upg"){
        c = tryJSON(readLS("zolotoy_stol_clicker")); c.upgrades={power:100,gold:1,crit:3};
        localStorage.setItem("zolotoy_stol_clicker", JSON.stringify(c));
      } else if(act === "biz"){
        c = tryJSON(readLS("zolotoy_stol_clicker")); c.biz={kiosk:999,cafe:999,casinoB:999};
        localStorage.setItem("zolotoy_stol_clicker", JSON.stringify(c));
      } else if(act === "ach"){
        c = tryJSON(readLS("zolotoy_stol_clicker"));
        c.ach = {c100:1,c1000:1,c10000:1,c100000:1,c500000:1,c1m:1,e500:1,e5k:1,e50k:1,lvl5:1,lvl10:1,firstUp:1,crit:1,biz:1};
        localStorage.setItem("zolotoy_stol_clicker", JSON.stringify(c));
      } else if(act === "reset"){
        if(!confirm("Сбросить всё?")) return;
        localStorage.removeItem("zolotoy_stol_balance");
        localStorage.removeItem("zolotoy_stol_clicker");
      } else if(act === "bet-slots"){
        var els = q("[data-slotbet]"); els[3].setAttribute("data-slotbet","1000000"); els[3].textContent="1M";
        return;
      } else if(act === "bet-rou"){
        var els2 = q("[data-roubet]"); els2[3].setAttribute("data-roubet","1000000"); els2[3].textContent="1M";
        return;
      } else if(act === "bet-bj"){
        var els3 = q("[data-bjbet]"); els3[3].setAttribute("data-bjbet","1000000"); els3[3].textContent="1M";
        return;
      } else if(act === "betall"){
        var a1 = q("[data-slotbet]"); a1[3].setAttribute("data-slotbet","1000000"); a1[3].textContent="1M";
        var b1 = q("[data-roubet]"); b1[3].setAttribute("data-roubet","1000000"); b1[3].textContent="1M";
        var c1 = q("[data-bjbet]"); c1[3].setAttribute("data-bjbet","1000000"); c1[3].textContent="1M";
        return;
      } else if(act === "title"){
        var nv = document.getElementById("__dt_title").value;
        if(nv){ q(".brand-name,.game-title").forEach(function(e){ e.textContent = nv; }); }
        return;
      }

      sessionStorage.setItem('__dt_auto','1');
      location.reload();
      return;
    }
  });

  // ====== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК ======
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
