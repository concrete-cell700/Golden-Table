(function(){
  "use strict";
  if(window.__devtoolsLoaded) return;
  window.__devtoolsLoaded = true;

  var SCRIPTS_URL = "https://concrete-cell700.github.io/Golden-Table/scripts.json";

  // ========== СТИЛИ ==========
  var css = document.createElement("style");
  css.textContent = `
    #__dt_btn{position:fixed;top:70px;right:10px;z-index:99999;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f2cf7e,#8a6f2a);border:2px solid #d4af37;color:#2a1e05;font-size:22px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.6);}
    #__dt_panel{position:fixed;top:0;right:0;width:92%;max-width:420px;height:100%;background:#0a1712;border-left:1px solid #d4af37;z-index:99998;display:none;flex-direction:column;font-family:monospace;color:#ece2c8;box-shadow:-6px 0 20px rgba(0,0,0,.7);}
    #__dt_panel.open{display:flex;}
    #__dt_head{padding:12px;background:#0d1f17;border-bottom:1px solid #d4af37;display:flex;justify-content:space-between;align-items:center;font-family:Georgia,serif;color:#f2cf7e;}
    #__dt_head b{font-size:15px;}
    #__dt_close{background:none;border:none;color:#d9534a;font-size:22px;cursor:pointer;}
    #__dt_tabs{display:flex;background:#0d1f17;border-bottom:1px solid #8a6f2a;flex-wrap:wrap;}
    .__dt_tab{flex:1;padding:9px 4px;text-align:center;font-size:11px;cursor:pointer;color:#b7ac93;border-bottom:2px solid transparent;min-width:60px;}
    .__dt_tab.active{color:#f2cf7e;border-bottom-color:#d4af37;}
    #__dt_body{flex:1;overflow-y:auto;padding:10px;}
    .__dt_section{margin-bottom:14px;}
    .__dt_section>h4{margin:0 0 6px;font-size:12px;color:#f2cf7e;font-family:Georgia,serif;border-bottom:1px dashed #8a6f2a;padding-bottom:4px;}
    .__dt_row{display:flex;align-items:center;gap:6px;padding:5px 6px;background:#0d1f17;border:1px solid #1e3a2a;border-radius:6px;margin-bottom:4px;font-size:11px;}
    .__dt_row .k{flex:0 0 34%;color:#b7ac93;word-break:break-all;}
    .__dt_row .v{flex:1;color:#f2cf7e;font-weight:bold;word-break:break-all;}
    .__dt_row button{background:#1a3a28;border:1px solid #d4af37;color:#f2cf7e;border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;}
    .__dt_row button.danger{background:#3a1a1a;border-color:#b8342a;color:#d9534a;}
    .__dt_row input.__dt_in,.__dt_row textarea.__dt_in{background:#000;color:#0f0;border:1px solid #8a6f2a;border-radius:4px;padding:4px;font-size:11px;font-family:monospace;min-width:0;box-sizing:border-box;}
    .__dt_row textarea.__dt_in{width:100%;min-height:60px;resize:vertical;}
    #__dt_console{width:100%;background:#000;color:#0f0;border:1px solid #d4af37;border-radius:6px;padding:8px;font-family:monospace;font-size:12px;min-height:90px;resize:vertical;box-sizing:border-box;}
    .__dt_quick{display:flex;flex-wrap:wrap;gap:6px;}
    .__dt_quick button{flex:1;min-width:90px;padding:8px 6px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;font-size:11px;cursor:pointer;}
    .__dt_quick button.danger{background:linear-gradient(180deg,#d9534a,#b8342a);color:#ece2c8;}
    .__dt_quick button.dark{background:#1b1b1b;color:#ece2c8;border:1px solid #8a6f2a;}
    .__dt_apply_all{width:100%;padding:12px;margin-top:10px;background:linear-gradient(180deg,#4c8c5c,#245933);border:1px solid #d4af37;border-radius:8px;color:#f2cf7e;font-weight:bold;font-size:13px;cursor:pointer;font-family:Georgia,serif;}
    .__dt_script_cat{margin-bottom:6px;border:1px solid #1e3a2a;border-radius:6px;overflow:hidden;background:#0a1712;}
    .__dt_script_cat_head{padding:7px 9px;background:#0d1f17;color:#f2cf7e;font-size:12px;font-family:Georgia,serif;cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none;}
    .__dt_script_cat_head:active{background:#123524;}
    .__dt_caret{color:#d4af37;font-size:14px;font-weight:bold;}
    .__dt_script_cat_body{display:none;padding:6px;}
    .__dt_script_cat.open .__dt_script_cat_body{display:block;}
    .__dt_script_item{background:#0d1f17;border:1px solid #1e3a2a;border-radius:5px;margin-bottom:4px;padding:6px;}
    .__dt_script_head{display:flex;justify-content:space-between;align-items:center;gap:6px;}
    .__dt_script_name{color:#f2cf7e;font-size:11px;font-family:Georgia,serif;font-weight:bold;flex:1;word-break:break-word;}
    .__dt_script_apply{background:linear-gradient(180deg,#4c8c5c,#245933);border:1px solid #d4af37;color:#f2cf7e;border-radius:5px;padding:4px 8px;font-size:10px;font-weight:bold;cursor:pointer;flex:none;}
    .__dt_script_apply:hover{background:linear-gradient(180deg,#5c9c6c,#346943);}
    .__dt_script_desc{color:#b7ac93;font-size:10px;margin-top:5px;line-height:1.4;padding-left:2px;}
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
      '<div class="__dt_tab active" data-tab="vars">Перем.</div>' +
      '<div class="__dt_tab" data-tab="dom">Инспектор</div>' +
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
    try { var c = JSON.parse(readLS("zolotoy_stol_clicker") || "{}") || {}; return c[field]; }
    catch(e){ return undefined; }
  }
  function escapeAttr(s){
    return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  // ========== ПЕРЕМЕННЫЕ ==========
  function renderVars(){
    var h = "";
    h += '<div class="__dt_section"><h4>💰 Баланс</h4>';
    h += '<div class="__dt_row"><span class="k">balance</span><input class="__dt_in" data-store="zolotoy_stol_balance" value="' + escapeAttr(readLS("zolotoy_stol_balance")||"") + '"><button class="__dt_apply_ls" data-store="zolotoy_stol_balance">OK</button></div>';
    h += '</div>';
    h += '<div class="__dt_section"><h4>👆 Кликер</h4>';
    ["totalClicks","totalEarned","xp","level","skin","upgBought","bizOwned"].forEach(function(f){
      h += '<div class="__dt_row"><span class="k">' + f + '</span><input class="__dt_in" data-field="' + f + '" value="' + escapeAttr(fmt(getField(f))) + '"><button class="__dt_apply_field" data-field="' + f + '">OK</button></div>';
    });
    ["upgrades","biz","ach"].forEach(function(f){
      h += '<div class="__dt_row"><span class="k">' + f + ' (JSON)</span><input class="__dt_in" data-field="' + f + '" value="' + escapeAttr(fmt(getField(f))) + '"><button class="__dt_apply_field" data-field="' + f + '" data-json="1">OK</button></div>';
    });
    h += '</div>';
    h += '<button class="__dt_apply_all">✅ ПРИМЕНИТЬ ВСЁ</button>';
    body.innerHTML = h;

    body.querySelectorAll(".__dt_apply_ls").forEach(function(b){
      b.onclick = function(){
        var k = b.dataset.store;
        var inp = body.querySelector('.__dt_in[data-store="' + k + '"]');
        if(inp.value === "") return;
        localStorage.setItem(k, inp.value);
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
        if(b.dataset.json === "1"){ try { c[f] = JSON.parse(v); } catch(e){ alert("Bad JSON"); return; } }
        else { var n = Number(v); c[f] = (v !== "" && !isNaN(n)) ? n : v; }
        localStorage.setItem("zolotoy_stol_clicker", JSON.stringify(c));
        location.reload();
      };
    });
    body.querySelector(".__dt_apply_all").onclick = function(){
      var balInp = body.querySelector('.__dt_in[data-store="zolotoy_stol_balance"]');
      if(balInp.value !== "") localStorage.setItem("zolotoy_stol_balance", balInp.value);
      var c;
      try { c = JSON.parse(readLS("zolotoy_stol_clicker") || "{}") || {}; } catch(e){ c = {}; }
      ["totalClicks","totalEarned","xp","skin","upgBought","bizOwned"].forEach(function(f){
        var inp = body.querySelector('.__dt_in[data-field="' + f + '"]');
        if(!inp || inp.value === "") return;
        var n = Number(inp.value); c[f] = !isNaN(n) ? n : inp.value;
      });
      ["upgrades","biz","ach"].forEach(function(f){
        var inp = body.querySelector('.__dt_in[data-field="' + f + '"]');
        if(!inp || inp.value === "") return;
        try { c[f] = JSON.parse(inp.value); } catch(e){ alert("Bad JSON " + f); }
      });
      localStorage.setItem("zolotoy_stol_clicker", JSON.stringify(c));
      location.reload();
    };
  }

  // ========== ИНСПЕКТОР ==========
  var inspectMode = false, selectedEl = null;
  var overlay = document.createElement("div");
  overlay.id = "__dt_inspector_overlay";
  overlay.style.cssText = "position:fixed;pointer-events:none;border:2px dashed #d4af37;background:rgba(212,175,55,.15);z-index:99997;display:none;";
  document.body.appendChild(overlay);
  var hint = document.createElement("div");
  hint.id = "__dt_inspector_hint";
  hint.textContent = "🎯 Тапни по элементу";
  hint.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0d1f17;border:2px solid #d4af37;padding:10px 20px;border-radius:8px;color:#f2cf7e;font-family:Georgia,serif;font-size:14px;z-index:100000;display:none;";
  document.body.appendChild(hint);

  function startInspect(){ inspectMode = true; hint.style.display = "block"; document.addEventListener("click", onInspectClick, true); document.addEventListener("mousemove", onInspectMove, true); }
  function stopInspect(){ inspectMode = false; hint.style.display = "none"; overlay.style.display = "none"; document.removeEventListener("click", onInspectClick, true); document.removeEventListener("mousemove", onInspectMove, true); }
  function onInspectMove(e){ if(!inspectMode) return; var el = document.elementFromPoint(e.clientX, e.clientY); if(!el || el.closest("#__dt_panel") || el === btn) return; var r = el.getBoundingClientRect(); overlay.style.display = "block"; overlay.style.left = r.left + "px"; overlay.style.top = r.top + "px"; overlay.style.width = r.width + "px"; overlay.style.height = r.height + "px"; }
  function onInspectClick(e){ if(!inspectMode) return; if(e.target.closest("#__dt_panel") || e.target === btn) return; e.preventDefault(); e.stopPropagation(); selectedEl = e.target; stopInspect(); panel.classList.add("open"); renderDomInspector(); }

  function renderDomInspector(){
    var h = '<div class="__dt_section"><h4>🎯 Инспектор</h4><button class="__dt_quick" id="__dt_pick" style="width:100%;padding:10px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;cursor:pointer;">🎯 Выбрать элемент</button></div>';
    if(!selectedEl){ h += '<div style="color:#b7ac93;font-size:11px;text-align:center;padding:20px;">Тапни «Выбрать элемент», потом тапни по любому элементу</div>'; body.innerHTML = h; document.getElementById("__dt_pick").onclick = function(){ panel.classList.remove("open"); startInspect(); }; return; }
    h += '<div class="__dt_section"><h4>✅ ' + selectedEl.tagName.toLowerCase() + '</h4></div>';
    h += '<div class="__dt_section"><h4>📝 Текст</h4><div class="__dt_row" style="flex-direction:column;align-items:stretch;"><textarea class="__dt_in" id="__dt_el_html">' + escapeAttr(selectedEl.innerHTML) + '</textarea><button id="__dt_apply_html" style="margin-top:6px;">Применить</button></div></div>';
    h += '<div class="__dt_section"><h4>🎨 Быстрые стили</h4>';
    var cs = getComputedStyle(selectedEl);
    h += '<div class="__dt_row"><span class="k">color</span><input class="__dt_in" type="color" id="__dt_c_color" value="' + rgbToHex(cs.color) + '"><button id="__dt_apply_color">OK</button></div>';
    h += '<div class="__dt_row"><span class="k">background</span><input class="__dt_in" type="color" id="__dt_c_bg" value="' + rgbToHex(cs.backgroundColor) + '"><button id="__dt_apply_bg">OK</button></div>';
    h += '<div class="__dt_row"><span class="k">font-size</span><input class="__dt_in" id="__dt_c_fs" value="' + escapeAttr(cs.fontSize) + '"><button id="__dt_apply_fs">OK</button></div>';
    h += '</div>';
    body.innerHTML = h;
    document.getElementById("__dt_pick").onclick = function(){ panel.classList.remove("open"); startInspect(); };
    document.getElementById("__dt_apply_html").onclick = function(){ selectedEl.innerHTML = document.getElementById("__dt_el_html").value; };
    document.getElementById("__dt_apply_color").onclick = function(){ selectedEl.style.color = document.getElementById("__dt_c_color").value; };
    document.getElementById("__dt_apply_bg").onclick = function(){ selectedEl.style.backgroundColor = document.getElementById("__dt_c_bg").value; };
    document.getElementById("__dt_apply_fs").onclick = function(){ selectedEl.style.fontSize = document.getElementById("__dt_c_fs").value; };
  }

  function rgbToHex(rgb){ if(!rgb) return "#000000"; var m = rgb.match(/\d+/g); if(!m || m.length < 3) return "#000000"; return "#" + [m[0],m[1],m[2]].map(function(x){ var h = parseInt(x).toString(16); return h.length === 1 ? "0" + h : h; }).join(""); }

  // ========== ЗАГРУЗКА СКРИПТОВ ==========
  function loadScripts(cb){
    fetch(SCRIPTS_URL + "?t=" + Date.now())
      .then(function(r){ return r.json(); })
      .then(function(data){ try{ localStorage.setItem("__dt_scripts_cache", JSON.stringify(data)); }catch(e){} cb(data, null); })
      .catch(function(err){
        try { var cache = JSON.parse(localStorage.getItem("__dt_scripts_cache") || "null"); if(cache){ cb(cache, "offline"); return; } } catch(e){}
        cb(null, err.message);
      });
  }

  // ========== КОНСОЛЬ ==========
  function renderConsole(){
    body.innerHTML =
      '<div class="__dt_section"><h4>⚡ JS-консоль</h4><textarea id="__dt_console" placeholder="// любой код"></textarea><button id="__dt_run" style="margin-top:8px;width:100%;padding:9px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;cursor:pointer;">▶ Выполнить</button></div>' +
      '<div class="__dt_section"><h4>📦 Скрипты с GitHub</h4><div id="__dt_scripts_container" style="color:#b7ac93;font-size:11px;padding:8px;text-align:center;">Загрузка...</div><button id="__dt_reload_scripts" style="margin-top:6px;width:100%;padding:6px;background:#1a3a28;border:1px solid #d4af37;border-radius:6px;color:#f2cf7e;font-size:11px;cursor:pointer;">🔄 Обновить список</button></div>';

    document.getElementById("__dt_run").onclick = function(){
      try { eval(document.getElementById("__dt_console").value); } catch(e){ alert("Error: " + e.message); }
    };

    var container = document.getElementById("__dt_scripts_container");
    document.getElementById("__dt_reload_scripts").onclick = function(){
      container.innerHTML = '<div style="color:#b7ac93;font-size:11px;padding:8px;text-align:center;">Загрузка...</div>';
      loadScripts(renderScriptsList);
    };
    loadScripts(renderScriptsList);

    function renderScriptsList(data, err){
      if(err || !data){ container.innerHTML = '<div style="color:#d9534a;font-size:11px;padding:8px;text-align:center;">Ошибка: ' + (err || "нет данных") + '</div>'; return; }
      var cats = data.categories || [];
      if(cats.length === 0){ container.innerHTML = '<div style="color:#b7ac93;font-size:11px;padding:8px;text-align:center;">Скриптов нет</div>'; return; }
      var h = "";
      cats.forEach(function(cat){
        h += '<div class="__dt_script_cat"><div class="__dt_script_cat_head">📁 ' + escapeAttr(cat.title) + ' <span style="color:#b7ac93;font-size:10px;">(' + (cat.scripts||[]).length + ')</span><span class="__dt_caret">+</span></div><div class="__dt_script_cat_body">';
        (cat.scripts||[]).forEach(function(s, i){
          h += '<div class="__dt_script_item"><div class="__dt_script_head"><span class="__dt_script_name">' + escapeAttr(s.name) + '</span><button class="__dt_script_apply" data-cat="' + escapeAttr(cat.title) + '" data-idx="' + i + '">▶ Вставить</button></div><div class="__dt_script_desc">' + escapeAttr(s.description||"") + '</div></div>';
        });
        h += '</div></div>';
      });
      container.innerHTML = h;
      container.querySelectorAll(".__dt_script_cat_head").forEach(function(head){
        head.onclick = function(){ var cat = head.parentNode; cat.classList.toggle("open"); head.querySelector(".__dt_caret").textContent = cat.classList.contains("open") ? "−" : "+"; };
      });
      container.querySelectorAll(".__dt_script_apply").forEach(function(b){
        b.onclick = function(e){
          e.stopPropagation();
          var catTitle = b.dataset.cat, idx = +b.dataset.idx;
          var cat = cats.filter(function(c){ return c.title === catTitle; })[0];
          if(!cat || !cat.scripts[idx]) return;
          var ta = document.getElementById("__dt_console");
          if(ta){
            ta.value = cat.scripts[idx].code;
            ta.scrollIntoView({behavior:"smooth", block:"center"});
            ta.style.boxShadow = "0 0 20px #d4af37";
            setTimeout(function(){ ta.style.boxShadow = ""; }, 1000);
            var msg = document.createElement("div");
            msg.textContent = "✅ Скрипт вставлен. Нажми ▶ Выполнить";
            msg.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0d1f17;border:1px solid #d4af37;color:#f2cf7e;padding:8px 16px;border-radius:8px;z-index:100000;font-size:12px;font-family:Georgia,serif;";
            document.body.appendChild(msg);
            setTimeout(function(){ msg.remove(); }, 2000);
          }
        };
      });
    }
  }

  // ========== БЫСТРО ==========
  function renderQuick(){
    body.innerHTML =
      '<div class="__dt_section"><h4>🎛 Номиналы 1M</h4><div class="__dt_quick"><button id="__dt_qs1">Слоты</button><button id="__dt_qs2">Рулетка</button><button id="__dt_qs3">Блэкджек</button><button id="__dt_qs4">Все</button></div></div>' +
      '<div class="__dt_section"><h4>🏷 Название игры</h4><div class="__dt_row"><input id="__dt_title" class="__dt_in" style="flex:1;" placeholder="Новое название"><button id="__dt_title_ok">OK</button></div></div>';
    document.getElementById("__dt_qs1").onclick = function(){ var e=q("[data-slotbet]"); if(e[3]){e[3].setAttribute("data-slotbet","1000000");e[3].textContent="1M";} };
    document.getElementById("__dt_qs2").onclick = function(){ var e=q("[data-roubet]"); if(e[3]){e[3].setAttribute("data-roubet","1000000");e[3].textContent="1M";} };
    document.getElementById("__dt_qs3").onclick = function(){ var e=q("[data-bjbet]"); if(e[3]){e[3].setAttribute("data-bjbet","1000000");e[3].textContent="1M";} };
    document.getElementById("__dt_qs4").onclick = function(){ ['slotbet','roubet','bjbet'].forEach(function(a){var e=q("[data-"+a+"]");if(e[3]){e[3].setAttribute("data-"+a,"1000000");e[3].textContent="1M";}}); };
    document.getElementById("__dt_title_ok").onclick = function(){ var v = document.getElementById("__dt_title").value; if(!v) return; q(".brand-name,.game-title").forEach(function(e){ e.textContent = v; }); };
  }

  function setTab(name){
    q(".__dt_tab").forEach(function(x){ x.classList.toggle("active", x.dataset.tab === name); });
    if(name === "vars") renderVars();
    else if(name === "dom") renderDomInspector();
    else if(name === "console") renderConsole();
    else if(name === "quick") renderQuick();
  }

  q(".__dt_tab").forEach(function(t){ t.onclick = function(){ setTab(t.dataset.tab); }; });
  document.getElementById("__dt_close").onclick = function(){ panel.classList.remove("open"); if(inspectMode) stopInspect(); };
  btn.onclick = function(){ panel.classList.toggle("open"); if(panel.classList.contains("open")) setTab("vars"); };
  window.__devtools = { toggle: function(){ btn.onclick(); } };
  setTab("vars");
})();
