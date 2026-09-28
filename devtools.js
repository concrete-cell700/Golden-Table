(function(){
  "use strict";
  if(window.__devtoolsLoaded) return;
  window.__devtoolsLoaded = true;

  var CONFIG_KEY = "__dt_config";
  var SCRIPTS_URL = "https://concrete-cell700.github.io/Golden-Table/scripts.json";
  var PLUGINS_URL = "https://concrete-cell700.github.io/Golden-Table/plugins.json";

  // ========== КОНФИГ ==========
  function loadConfig(){
    try {
      var c = JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}") || {};
      if(!c.plugins) c.plugins = {};
      if(!c.scripts) c.scripts = {};
      if(!c.inspector) c.inspector = {};
      if(!c.custom) c.custom = {};
      return c;
    } catch(e){
      return { plugins: {}, scripts: {}, inspector: {}, custom: {} };
    }
  }
  function saveConfig(c){
    try { localStorage.setItem(CONFIG_KEY, JSON.stringify(c)); } catch(e){}
  }
  var config = loadConfig();

  // API для плагинов
  window.DevTools = {
    version: "1.0",
    _plugins: {},
    _pluginTabs: [],

    register: function(def){
      if(!def || !def.id) return;
      this._plugins[def.id] = def;
      // если таб — добавляем
      if(typeof def.tab === "function"){
        this._pluginTabs.push(def);
        addPluginTab(def);
      }
      // запускаем onEnable если включён
      var pconf = config.plugins[def.id];
      if(pconf && pconf.enabled && typeof def.onEnable === "function"){
        try { def.onEnable(pconf.data || {}); } catch(e){}
      }
    },

    getPluginConfig: function(id){
      if(!config.plugins[id]) config.plugins[id] = { enabled: false, data: {} };
      if(!config.plugins[id].data) config.plugins[id].data = {};
      return config.plugins[id].data;
    },
    setPluginConfig: function(id, data){
      if(!config.plugins[id]) config.plugins[id] = { enabled: false, data: {} };
      config.plugins[id].data = data;
      saveConfig(config);
    },

    toast: function(text){
      var t = document.createElement("div");
      t.textContent = text;
      t.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0d1f17;border:1px solid #d4af37;color:#f2cf7e;padding:10px 18px;border-radius:8px;z-index:100001;font-size:12px;font-family:Georgia,serif;max-width:90%;text-align:center;";
      document.body.appendChild(t);
      setTimeout(function(){ t.remove(); }, 2500);
    },

    getConfig: function(){ return JSON.parse(JSON.stringify(config)); },
    setConfig: function(c){ config = c; saveConfig(config); }
  };

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
    .__dt_tab{flex:1;padding:9px 4px;text-align:center;font-size:11px;cursor:pointer;color:#b7ac93;border-bottom:2px solid transparent;min-width:50px;}
    .__dt_tab.active{color:#f2cf7e;border-bottom-color:#d4af37;}
    #__dt_body{flex:1;overflow-y:auto;padding:10px;}
    .__dt_section{margin-bottom:14px;}
    .__dt_section>h4{margin:0 0 6px;font-size:12px;color:#f2cf7e;font-family:Georgia,serif;border-bottom:1px dashed #8a6f2a;padding-bottom:4px;}
    .__dt_row{display:flex;align-items:center;gap:6px;padding:5px 6px;background:#0d1f17;border:1px solid #1e3a2a;border-radius:6px;margin-bottom:4px;font-size:11px;}
    .__dt_row .k{flex:0 0 34%;color:#b7ac93;word-break:break-all;}
    .__dt_row .v{flex:1;color:#f2cf7e;font-weight:bold;word-break:break-all;}
    .__dt_row button{background:#1a3a28;border:1px solid #d4af37;color:#f2cf7e;border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;}
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
    .__dt_caret{color:#d4af37;font-size:14px;font-weight:bold;}
    .__dt_script_cat_body{display:none;padding:6px;}
    .__dt_script_cat.open .__dt_script_cat_body{display:block;}
    .__dt_script_item{background:#0d1f17;border:1px solid #1e3a2a;border-radius:5px;margin-bottom:4px;padding:6px;}
    .__dt_script_head{display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;}
    .__dt_script_name{color:#f2cf7e;font-size:11px;font-family:Georgia,serif;font-weight:bold;flex:1;word-break:break-word;min-width:100px;}
    .__dt_script_apply{background:linear-gradient(180deg,#4c8c5c,#245933);border:1px solid #d4af37;color:#f2cf7e;border-radius:5px;padding:4px 8px;font-size:10px;font-weight:bold;cursor:pointer;flex:none;}
    .__dt_script_desc{color:#b7ac93;font-size:10px;margin-top:5px;line-height:1.4;}
    .__dt_toggle{position:relative;width:40px;height:22px;background:#3a1a1a;border-radius:11px;cursor:pointer;transition:background .2s;flex:none;}
    .__dt_toggle.on{background:#4c8c5c;}
    .__dt_toggle::after{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;background:#ece2c8;border-radius:50%;transition:left .2s;}
    .__dt_toggle.on::after{left:20px;}
    .__dt_plugin{border:1px solid #1e3a2a;border-radius:6px;padding:8px;margin-bottom:6px;background:#0d1f17;}
    .__dt_plugin_head{display:flex;justify-content:space-between;align-items:center;gap:8px;}
    .__dt_plugin_name{color:#f2cf7e;font-size:12px;font-family:Georgia,serif;font-weight:bold;}
    .__dt_plugin_desc{color:#b7ac93;font-size:10px;margin-top:6px;line-height:1.4;}
    .__dt_plugin_actions{margin-top:6px;display:flex;gap:6px;}
    .__dt_plugin_actions button{flex:1;padding:5px;background:#1a3a28;border:1px solid #d4af37;color:#f2cf7e;border-radius:5px;font-size:10px;cursor:pointer;}
    .__dt_plugin_actions button.danger{background:#3a1a1a;border-color:#b8342a;color:#d9534a;}
    #__dt_inspector_overlay{position:fixed;pointer-events:none;border:2px dashed #d4af37;background:rgba(212,175,55,.15);z-index:99997;display:none;}
    #__dt_inspector_hint{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0d1f17;border:2px solid #d4af37;padding:10px 20px;border-radius:8px;color:#f2cf7e;font-family:Georgia,serif;font-size:14px;z-index:100000;display:none;}
    .__dt_prop{display:flex;align-items:center;gap:4px;padding:3px 4px;font-size:10px;border-bottom:1px solid #1e3a2a;cursor:pointer;}
    .__dt_prop:hover{background:#1a3a28;}
    .__dt_prop .pn{flex:0 0 45%;color:#b7ac93;word-break:break-all;}
    .__dt_prop .pv{flex:1;color:#f2cf7e;word-break:break-all;text-align:right;}
    .__dt_prop .pe{color:#d9534a;font-size:9px;padding:0 4px;}
    .__dt_badge{display:inline-block;background:#4c8c5c;color:#f2cf7e;font-size:9px;padding:1px 5px;border-radius:3px;margin-left:4px;}
  `;
  document.head.appendChild(css);

  // ========== ИНСПЕКТОР ==========
  function cleanSelector(sel){
    if(!sel) return "body";
    var s = String(sel).trim().replace(/\s*[>+~]\s*$/, "").trim();
    if(s === "body >" || s === "body" || s === "" || s === ">") return "body";
    if(s === "html >" || s === "html") return "html";
    return s;
  }
  function applyInspectorChanges(){
    var saved = config.inspector || {};
    var ok = 0, fail = 0;
    Object.keys(saved).forEach(function(rawSel){
      try {
        var sel = cleanSelector(rawSel);
        var el = document.querySelector(sel);
        if(!el){ fail++; return; }
        var s = saved[rawSel];
        if(s.html !== undefined) el.innerHTML = s.html;
        if(s.className !== undefined) el.className = s.className;
        if(s.styles) Object.keys(s.styles).forEach(function(p){ try { el.style[p] = s.styles[p]; } catch(e){} });
        if(s.attrs) Object.keys(s.attrs).forEach(function(a){ try { el.setAttribute(a, s.attrs[a]); } catch(e){} });
        ok++;
      } catch(e){ fail++; }
    });
    return { ok: ok, fail: fail };
  }
  function recordChange(sel, key, value){
    if(!sel) return;
    var c = loadConfig();
    if(!c.inspector[sel]) c.inspector[sel] = {};
    if(key === "style"){
      if(!c.inspector[sel].styles) c.inspector[sel].styles = {};
      c.inspector[sel].styles[value.prop] = value.val;
    } else if(key === "attr"){
      if(!c.inspector[sel].attrs) c.inspector[sel].attrs = {};
      c.inspector[sel].attrs[value.name] = value.val;
    } else {
      c.inspector[sel][key] = value;
    }
    config = c;
    saveConfig(config);
  }
  function removeChange(sel){
    var c = loadConfig();
    delete c.inspector[sel];
    config = c;
    saveConfig(config);
  }

  // применяем сохранённые стили при старте + повтор
  (function(){
    applyInspectorChanges();
    [300, 800, 1500, 3000, 5000].forEach(function(ms){ setTimeout(applyInspectorChanges, ms); });
    setInterval(applyInspectorChanges, 3000);
  })();

  // ========== КНОПКА И ПАНЕЛЬ ==========
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
      '<div class="__dt_tab" data-tab="plugins">Плагины</div>' +
      '<div class="__dt_tab" data-tab="config">Конфиг</div>' +
      '<div class="__dt_tab" data-tab="quick">Быстро</div>' +
    '</div>' +
    '<div id="__dt_body"></div>';
  document.body.appendChild(panel);

  var overlay = document.createElement("div");
  overlay.id = "__dt_inspector_overlay";
  document.body.appendChild(overlay);
  var hint = document.createElement("div");
  hint.id = "__dt_inspector_hint";
  hint.textContent = "🎯 Тапни по элементу";
  document.body.appendChild(hint);

  var body = document.getElementById("__dt_body");
  var tabsContainer = document.getElementById("__dt_tabs");

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
  function rgbToHex(rgb){
    if(!rgb) return "#000000";
    var m = rgb.match(/\d+/g);
    if(!m || m.length < 3) return "#000000";
    return "#" + [m[0],m[1],m[2]].map(function(x){ var h = parseInt(x).toString(16); return h.length === 1 ? "0" + h : h; }).join("");
  }

  // ========== ФИКС СЕЛЕКТОР ==========
  function makeSelector(el){
    if(!el || !el.tagName) return null;
    if(el === document.body) return "body";
    if(el === document.documentElement) return "html";
    if(el.id) return "#" + el.id;
    var attrs = el.attributes;
    for(var i=0;i<attrs.length;i++){
      var a = attrs[i];
      if(a.name.indexOf("data-") === 0){
        var s = el.tagName.toLowerCase() + "[" + a.name + '="' + a.value + '"]';
        try { if(document.querySelectorAll(s).length === 1) return s; } catch(e){}
      }
    }
    var path = [], cur = el;
    while(cur && cur !== document.body && cur.nodeType === 1){
      var tag = cur.tagName.toLowerCase();
      var parent = cur.parentElement;
      if(!parent) break;
      var idx = 1, sib = cur;
      while(sib.previousElementSibling){ sib = sib.previousElementSibling; if(sib.tagName === cur.tagName) idx++; }
      path.unshift(tag + ":nth-of-type(" + idx + ")");
      cur = parent;
    }
    var result = "body > " + path.join(" > ");
    result = result.replace(/\s*>\s*$/, "").trim();
    return result;
  }

  // ========== ИНСПЕКТОР UI ==========
  var inspectMode = false, selectedEl = null;
  function startInspect(){ inspectMode = true; hint.style.display = "block"; document.addEventListener("click", onInspectClick, true); document.addEventListener("mousemove", onInspectMove, true); document.addEventListener("touchmove", onInspectMove, true); }
  function stopInspect(){ inspectMode = false; hint.style.display = "none"; overlay.style.display = "none"; document.removeEventListener("click", onInspectClick, true); document.removeEventListener("mousemove", onInspectMove, true); document.removeEventListener("touchmove", onInspectMove, true); }
  function onInspectMove(e){
    if(!inspectMode) return;
    var x = e.clientX, y = e.clientY;
    if(e.touches && e.touches[0]){ x = e.touches[0].clientX; y = e.touches[0].clientY; }
    var el = document.elementFromPoint(x, y);
    if(!el || el.closest("#__dt_panel") || el === btn || el.closest("#__dt_inspector_hint")) return;
    var r = el.getBoundingClientRect();
    overlay.style.display = "block";
    overlay.style.left = r.left + "px"; overlay.style.top = r.top + "px";
    overlay.style.width = r.width + "px"; overlay.style.height = r.height + "px";
  }
  function onInspectClick(e){
    if(!inspectMode) return;
    if(e.target.closest("#__dt_panel") || e.target === btn || e.target.closest("#__dt_inspector_hint")) return;
    e.preventDefault(); e.stopPropagation();
    selectedEl = e.target;
    stopInspect();
    panel.classList.add("open");
    setTab("dom");
  }

  function renderDomInspector(){
    var c = loadConfig();
    var savedCount = Object.keys(c.inspector).length;

    var h = '<div class="__dt_section"><h4>🎯 Инспектор</h4><button class="__dt_quick" id="__dt_pick" style="width:100%;padding:10px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;cursor:pointer;">🎯 Выбрать элемент</button></div>';

    if(savedCount > 0){
      h += '<div class="__dt_section"><h4>💾 Сохранено: ' + savedCount + '</h4><div class="__dt_quick"><button class="danger" id="__dt_clear_all">🗑 Сбросить все</button></div></div>';
    }

    if(!selectedEl){
      h += '<div style="color:#b7ac93;font-size:11px;text-align:center;padding:20px;">Тапни «Выбрать элемент», потом тапни по элементу</div>';
      body.innerHTML = h;
      document.getElementById("__dt_pick").onclick = function(){ panel.classList.remove("open"); startInspect(); };
      if(savedCount > 0) document.getElementById("__dt_clear_all").onclick = function(){ if(confirm("Удалить все сохранения?")){ var c2 = loadConfig(); c2.inspector = {}; config = c2; saveConfig(config); location.reload(); } };
      return;
    }

    var sel = makeSelector(selectedEl);
    var wasSaved = c.inspector[sel] !== undefined;

    h += '<div class="__dt_section"><h4>✅ ' + selectedEl.tagName.toLowerCase() + (wasSaved ? ' <span class="__dt_badge">СОХРАНЁН</span>' : '') + '</h4>';
    h += '<div class="__dt_row"><span class="k">Селектор</span><span class="v" style="font-size:9px;">' + escapeAttr(sel||"—") + '</span></div></div>';

    h += '<div class="__dt_quick" style="margin-bottom:10px;">';
    h += '<button id="__dt_pick2">🎯 Другой</button>';
    h += '<button id="__dt_parent">⬆ Родитель</button>';
    h += '<button class="danger" id="__dt_remove">🗑 Удалить</button>';
    if(wasSaved) h += '<button class="danger" id="__dt_reset_el">↺ Сбросить</button>';
    h += '</div>';

    h += '<div class="__dt_section"><h4>📝 Текст</h4><div class="__dt_row" style="flex-direction:column;align-items:stretch;"><textarea class="__dt_in" id="__dt_html">' + escapeAttr(selectedEl.innerHTML) + '</textarea><button id="__dt_apply_html" style="margin-top:6px;">💾 Применить и сохранить</button></div></div>';
    h += '<div class="__dt_section"><h4>🏷 Классы</h4><div class="__dt_row"><input class="__dt_in" id="__dt_class" value="' + escapeAttr(selectedEl.className||"") + '"><button id="__dt_apply_class">💾</button></div></div>';

    h += '<div class="__dt_section"><h4>🔖 Атрибуты</h4>';
    var attrs = selectedEl.attributes;
    if(attrs.length === 0) h += '<div style="color:#b7ac93;font-size:10px;padding:6px;">Нет атрибутов</div>';
    else for(var i=0; i<attrs.length; i++){
      var a = attrs[i];
      h += '<div class="__dt_row"><span class="k">' + escapeAttr(a.name) + '</span><input class="__dt_in" data-attrname="' + escapeAttr(a.name) + '" value="' + escapeAttr(a.value) + '"><button class="__dt_apply_attr" data-attrname="' + escapeAttr(a.name) + '">💾</button></div>';
    }
    h += '</div>';

    h += '<div class="__dt_section"><h4>🎨 Быстрые стили</h4>';
    var cs = getComputedStyle(selectedEl);
    h += '<div class="__dt_row"><span class="k">color</span><input class="__dt_in" type="color" id="__dt_c_color" value="' + rgbToHex(cs.color) + '"><button id="__dt_apply_color">💾</button></div>';
    h += '<div class="__dt_row"><span class="k">background</span><input class="__dt_in" type="color" id="__dt_c_bg" value="' + rgbToHex(cs.backgroundColor) + '"><button id="__dt_apply_bg">💾</button></div>';
    h += '<div class="__dt_row"><span class="k">font-size</span><input class="__dt_in" id="__dt_c_fs" value="' + escapeAttr(cs.fontSize) + '"><button id="__dt_apply_fs">💾</button></div>';
    h += '<div class="__dt_row"><span class="k">font-weight</span><input class="__dt_in" id="__dt_c_fw" value="' + escapeAttr(cs.fontWeight) + '"><button id="__dt_apply_fw">💾</button></div>';
    h += '<div class="__dt_row"><span class="k">border-radius</span><input class="__dt_in" id="__dt_c_br" value="' + escapeAttr(cs.borderRadius) + '"><button id="__dt_apply_br">💾</button></div>';
    h += '<div class="__dt_row"><span class="k">padding</span><input class="__dt_in" id="__dt_c_pad" value="' + escapeAttr(cs.padding) + '"><button id="__dt_apply_pad">💾</button></div>';
    h += '</div>';

    h += '<div class="__dt_section"><h4>📋 Все CSS</h4>';
    var props = ["color","backgroundColor","fontSize","fontWeight","fontFamily","textAlign","padding","margin","border","borderRadius","boxShadow","opacity","display","position","width","height","transform","transition","backgroundImage","background","letterSpacing","lineHeight","textShadow","textDecoration","cursor","zIndex"];
    props.forEach(function(p){
      h += '<div class="__dt_prop" data-cssprop="' + p + '"><span class="pn">' + p + '</span><span class="pv">' + escapeAttr(cs[p]||"") + '</span><span class="pe">✏</span></div>';
    });
    h += '</div>';

    body.innerHTML = h;

    document.getElementById("__dt_pick").onclick = function(){ panel.classList.remove("open"); startInspect(); };
    document.getElementById("__dt_pick2").onclick = function(){ panel.classList.remove("open"); startInspect(); };
    document.getElementById("__dt_parent").onclick = function(){ if(selectedEl && selectedEl.parentElement){ selectedEl = selectedEl.parentElement; renderDomInspector(); } };
    document.getElementById("__dt_remove").onclick = function(){ if(!selectedEl) return; if(!confirm("Удалить?")) return; selectedEl.remove(); selectedEl = null; renderDomInspector(); };
    if(wasSaved) document.getElementById("__dt_reset_el").onclick = function(){ if(!confirm("Сбросить?")) return; removeChange(sel); location.reload(); };

    document.getElementById("__dt_apply_html").onclick = function(){ var v = document.getElementById("__dt_html").value; selectedEl.innerHTML = v; recordChange(sel, "html", v); alert("✅ Сохранено"); renderDomInspector(); };
    document.getElementById("__dt_apply_class").onclick = function(){ var v = document.getElementById("__dt_class").value; selectedEl.className = v; recordChange(sel, "className", v); alert("✅ Сохранено"); };
    body.querySelectorAll(".__dt_apply_attr").forEach(function(b){
      b.onclick = function(){ var n = b.dataset.attrname; var inp = body.querySelector('input[data-attrname="' + n + '"]'); selectedEl.setAttribute(n, inp.value); recordChange(sel, "attr", {name: n, val: inp.value}); alert("✅ Сохранено"); };
    });
    function applyStyle(prop, val){ selectedEl.style[prop] = val; recordChange(sel, "style", {prop: prop, val: val}); }
    document.getElementById("__dt_apply_color").onclick = function(){ applyStyle("color", document.getElementById("__dt_c_color").value); alert("✅"); };
    document.getElementById("__dt_apply_bg").onclick = function(){ applyStyle("backgroundColor", document.getElementById("__dt_c_bg").value); alert("✅"); };
    document.getElementById("__dt_apply_fs").onclick = function(){ applyStyle("fontSize", document.getElementById("__dt_c_fs").value); alert("✅"); };
    document.getElementById("__dt_apply_fw").onclick = function(){ applyStyle("fontWeight", document.getElementById("__dt_c_fw").value); alert("✅"); };
    document.getElementById("__dt_apply_br").onclick = function(){ applyStyle("borderRadius", document.getElementById("__dt_c_br").value); alert("✅"); };
    document.getElementById("__dt_apply_pad").onclick = function(){ applyStyle("padding", document.getElementById("__dt_c_pad").value); alert("✅"); };
    body.querySelectorAll(".__dt_prop").forEach(function(p){
      p.onclick = function(){ var prop = p.dataset.cssprop; var cur = selectedEl.style[prop] || getComputedStyle(selectedEl)[prop] || ""; var v = prompt(prop + ":", cur); if(v === null) return; applyStyle(prop, v); alert("✅ Сохранено"); renderDomInspector(); };
    });
  }

  // ========== ПЕРЕМЕННЫЕ ==========
  function renderVars(){
    var h = "";
    h += '<div class="__dt_section"><h4>💰 Баланс</h4>';
    h += '<div class="__dt_row"><span class="k">balance</span><input class="__dt_in" data-store="zolotoy_stol_balance" value="' + escapeAttr(readLS("zolotoy_stol_balance")||"") + '"><button class="__dt_apply_ls" data-store="zolotoy_stol_balance">OK</button></div></div>';
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
      b.onclick = function(){ var k = b.dataset.store; var inp = body.querySelector('.__dt_in[data-store="' + k + '"]'); if(inp.value === "") return; localStorage.setItem(k, inp.value); location.reload(); };
    });
    body.querySelectorAll(".__dt_apply_field").forEach(function(b){
      b.onclick = function(){
        var f = b.dataset.field; var inp = body.querySelector('.__dt_in[data-field="' + f + '"]'); var v = inp.value; var c;
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
      var c; try { c = JSON.parse(readLS("zolotoy_stol_clicker") || "{}") || {}; } catch(e){ c = {}; }
      ["totalClicks","totalEarned","xp","skin","upgBought","bizOwned"].forEach(function(f){
        var inp = body.querySelector('.__dt_in[data-field="' + f + '"]'); if(!inp || inp.value === "") return;
        var n = Number(inp.value); c[f] = !isNaN(n) ? n : inp.value;
      });
      ["upgrades","biz","ach"].forEach(function(f){
        var inp = body.querySelector('.__dt_in[data-field="' + f + '"]'); if(!inp || inp.value === "") return;
        try { c[f] = JSON.parse(inp.value); } catch(e){ alert("Bad JSON " + f); }
      });
      localStorage.setItem("zolotoy_stol_clicker", JSON.stringify(c));
      location.reload();
    };
  }

  // ========== КОНСОЛЬ ==========
  var scriptsCache = null;
  function loadScripts(cb){
    fetch(SCRIPTS_URL + "?t=" + Date.now())
      .then(function(r){ return r.json(); })
      .then(function(data){ scriptsCache = data; try { localStorage.setItem("__dt_scripts_cache", JSON.stringify(data)); } catch(e){} cb(data, null); })
      .catch(function(err){
        try { var c = JSON.parse(localStorage.getItem("__dt_scripts_cache") || "null"); if(c){ scriptsCache = c; cb(c, "offline"); return; } } catch(e){}
        cb(null, err.message);
      });
  }

  function renderConsole(){
    body.innerHTML =
      '<div class="__dt_section"><h4>⚡ JS-консоль</h4><textarea id="__dt_console" placeholder="// любой код"></textarea><button id="__dt_run" style="margin-top:8px;width:100%;padding:9px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;cursor:pointer;">▶ Выполнить</button></div>' +
      '<div class="__dt_section"><h4>📦 Скрипты с GitHub</h4><div id="__dt_scripts_container" style="color:#b7ac93;font-size:11px;padding:8px;text-align:center;">Загрузка...</div><button id="__dt_reload_scripts" style="margin-top:6px;width:100%;padding:6px;background:#1a3a28;border:1px solid #d4af37;border-radius:6px;color:#f2cf7e;font-size:11px;cursor:pointer;">🔄 Обновить список</button></div>';

    document.getElementById("__dt_run").onclick = function(){ try { eval(document.getElementById("__dt_console").value); } catch(e){ alert("Error: " + e.message); } };
    var container = document.getElementById("__dt_scripts_container");
    document.getElementById("__dt_reload_scripts").onclick = function(){ container.innerHTML = '<div style="text-align:center;padding:8px;color:#b7ac93;font-size:11px;">Загрузка...</div>'; loadScripts(renderList); };
    loadScripts(renderList);

    function renderList(data, err){
      if(err || !data){ container.innerHTML = '<div style="color:#d9534a;font-size:11px;padding:8px;text-align:center;">Ошибка: ' + (err||"нет данных") + '</div>'; return; }
      var cats = data.categories || [];
      var h = "";
      cats.forEach(function(cat){
        h += '<div class="__dt_script_cat"><div class="__dt_script_cat_head">📁 ' + escapeAttr(cat.title) + ' <span style="color:#b7ac93;font-size:10px;">(' + (cat.scripts||[]).length + ')</span><span class="__dt_caret">+</span></div><div class="__dt_script_cat_body">';
        (cat.scripts||[]).forEach(function(s, i){
          var sid = s.id || (cat.title + "_" + i);
          var isAuto = config.scripts[sid] && config.scripts[sid].autoload;
          h += '<div class="__dt_script_item"><div class="__dt_script_head">' +
               '<span class="__dt_script_name">' + escapeAttr(s.name) + '</span>' +
               '<div class="__dt_toggle' + (isAuto ? " on" : "") + '" data-script-toggle="' + escapeAttr(sid) + '"></div>' +
               '<button class="__dt_script_apply" data-cat="' + escapeAttr(cat.title) + '" data-idx="' + i + '">▶ Запустить</button>' +
               '</div><div class="__dt_script_desc">' + escapeAttr(s.description||"") + '</div></div>';
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
          var c = cats.filter(function(x){ return x.title === b.dataset.cat; })[0];
          if(!c || !c.scripts[+b.dataset.idx]) return;
          var ta = document.getElementById("__dt_console");
          ta.value = c.scripts[+b.dataset.idx].code;
          ta.scrollIntoView({behavior:"smooth", block:"center"});
          ta.style.boxShadow = "0 0 20px #d4af37";
          setTimeout(function(){ ta.style.boxShadow = ""; }, 1000);
          setTimeout(function(){ try { eval(c.scripts[+b.dataset.idx].code); } catch(err){ alert("Ошибка: " + err.message); } }, 200);
        };
      });
      // тумблеры автозагрузки скриптов
      container.querySelectorAll("[data-script-toggle]").forEach(function(t){
        t.onclick = function(e){
          e.stopPropagation();
          var sid = t.dataset.scriptToggle;
          var c = loadConfig();
          if(!c.scripts[sid]) c.scripts[sid] = {};
          c.scripts[sid].autoload = !c.scripts[sid].autoload;
          config = c; saveConfig(config);
          t.classList.toggle("on", c.scripts[sid].autoload);
        };
      });
    }
  }

  // ========== ПЛАГИНЫ ==========
  var pluginsRegistry = null;
  function loadPluginsRegistry(cb){
    fetch(PLUGINS_URL + "?t=" + Date.now())
      .then(function(r){ return r.json(); })
      .then(function(data){ pluginsRegistry = data; try { localStorage.setItem("__dt_plugins_cache", JSON.stringify(data)); } catch(e){} cb(data, null); })
      .catch(function(err){
        try { var c = JSON.parse(localStorage.getItem("__dt_plugins_cache") || "null"); if(c){ pluginsRegistry = c; cb(c, "offline"); return; } } catch(e){}
        cb(null, err.message);
      });
  }

  function loadPlugin(plugin){
    if(!plugin || !plugin.url) return;
    if(window.__dtLoadedPlugins && window.__dtLoadedPlugins[plugin.id]) return;
    window.__dtLoadedPlugins = window.__dtLoadedPlugins || {};
    window.__dtLoadedPlugins[plugin.id] = true;
    var s = document.createElement("script");
    s.src = plugin.url + "?t=" + Date.now();
    s.onerror = function(){ DevTools.toast("❌ Плагин не загрузился: " + plugin.name); };
    document.body.appendChild(s);
  }

  function addPluginTab(plugin){
    // проверяем, нет ли уже
    if(tabsContainer.querySelector('[data-tab="plugin_' + plugin.id + '"]')) return;
    var t = document.createElement("div");
    t.className = "__dt_tab";
    t.dataset.tab = "plugin_" + plugin.id;
    t.textContent = plugin.name;
    // вставляем перед "Конфиг"
    var configTab = tabsContainer.querySelector('[data-tab="config"]');
    if(configTab) tabsContainer.insertBefore(t, configTab);
    else tabsContainer.appendChild(t);

    t.onclick = function(){ setTab("plugin_" + plugin.id); };
  }

  function renderPlugins(){
    var h = '<div class="__dt_section"><h4>🔌 Плагины</h4><div id="__dt_plugins_list" style="color:#b7ac93;font-size:11px;padding:8px;text-align:center;">Загрузка...</div><button id="__dt_reload_plugins" style="margin-top:6px;width:100%;padding:6px;background:#1a3a28;border:1px solid #d4af37;border-radius:6px;color:#f2cf7e;font-size:11px;cursor:pointer;">🔄 Обновить список</button></div>';
    body.innerHTML = h;

    document.getElementById("__dt_reload_plugins").onclick = function(){ loadPluginsRegistry(renderPluginsList); };
    loadPluginsRegistry(renderPluginsList);

    function renderPluginsList(data, err){
      var container = document.getElementById("__dt_plugins_list");
      if(err || !data){ container.innerHTML = '<div style="color:#d9534a;text-align:center;padding:8px;">Ошибка: ' + (err||"нет данных") + '</div>'; return; }
      var list = data.plugins || [];
      if(!list.length){ container.innerHTML = '<div style="text-align:center;padding:8px;">Плагинов нет</div>'; return; }
      var hh = "";
      list.forEach(function(p){
        var pc = config.plugins[p.id] || { enabled: false };
        var enabled = pc.enabled;
        hh += '<div class="__dt_plugin"><div class="__dt_plugin_head">' +
              '<span class="__dt_plugin_name">' + escapeAttr(p.name) + '</span>' +
              '<div class="__dt_toggle' + (enabled ? " on" : "") + '" data-plugin-toggle="' + escapeAttr(p.id) + '"></div>' +
              '</div>' +
              '<div class="__dt_plugin_desc">' + escapeAttr(p.description||"") + '</div>' +
              '<div class="__dt_plugin_actions">' +
              '<button data-plugin-load="' + escapeAttr(p.id) + '">▶ Загрузить сейчас</button>' +
              '</div></div>';
      });
      container.innerHTML = hh;
      container.querySelectorAll("[data-plugin-toggle]").forEach(function(t){
        t.onclick = function(){
          var id = t.dataset.pluginToggle;
          var c = loadConfig();
          if(!c.plugins[id]) c.plugins[id] = { enabled: false, data: {} };
          c.plugins[id].enabled = !c.plugins[id].enabled;
          config = c; saveConfig(config);
          t.classList.toggle("on", c.plugins[id].enabled);
          DevTools.toast(c.plugins[id].enabled ? "🔌 " + id + " включён" : "🔌 " + id + " выключен");
          if(c.plugins[id].enabled){
            var p = list.filter(function(x){ return x.id === id; })[0];
            if(p) loadPlugin(p);
          } else {
            location.reload();
          }
        };
      });
      container.querySelectorAll("[data-plugin-load]").forEach(function(b){
        b.onclick = function(){
          var p = list.filter(function(x){ return x.id === b.dataset.pluginLoad; })[0];
          if(p) loadPlugin(p);
        };
      });
    }
  }

  // ========== КОНФИГ ==========
  function renderConfig(){
    var c = loadConfig();
    var jsonStr = JSON.stringify(c, null, 2);
    var size = new Blob([JSON.stringify(c)]).size;
    var pluginsCount = Object.keys(c.plugins).length;
    var scriptsCount = Object.keys(c.scripts).length;
    var inspectorCount = Object.keys(c.inspector).length;

    var h = '<div class="__dt_section"><h4>⚙ Конфиг</h4>';
    h += '<div class="__dt_row"><span class="k">Размер</span><span class="v">' + size + ' байт</span></div>';
    h += '<div class="__dt_row"><span class="k">Плагины</span><span class="v">' + pluginsCount + '</span></div>';
    h += '<div class="__dt_row"><span class="k">Скрипты</span><span class="v">' + scriptsCount + '</span></div>';
    h += '<div class="__dt_row"><span class="k">Инспектор</span><span class="v">' + inspectorCount + '</span></div>';
    h += '</div>';

    h += '<div class="__dt_section"><h4>💾 Экспорт / Импорт</h4><div class="__dt_quick">' +
         '<button id="__dt_cfg_copy">📋 Скопировать</button>' +
         '<button id="__dt_cfg_paste">📥 Вставить</button>' +
         '<button id="__dt_cfg_download">📁 В файл</button>' +
         '<button id="__dt_cfg_upload">📂 Из файла</button>' +
         '</div></div>';

    h += '<div class="__dt_section"><h4>📄 JSON</h4><textarea class="__dt_in" id="__dt_cfg_json" style="min-height:250px;width:100%;font-size:10px;">' + escapeAttr(jsonStr) + '</textarea>';
    h += '<button class="__dt_apply_all" id="__dt_cfg_save" style="margin-top:6px;">✅ Сохранить (применить JSON)</button></div>';

    h += '<div class="__dt_section"><h4>🧹 Сброс</h4><div class="__dt_quick">' +
         '<button class="danger" id="__dt_cfg_reset">🗑 Сбросить ВЕСЬ конфиг</button>' +
         '</div></div>';

    body.innerHTML = h;

    document.getElementById("__dt_cfg_copy").onclick = function(){
      var txt = JSON.stringify(loadConfig());
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(txt).then(function(){ alert("✅ Скопировано"); }).catch(function(){ fallbackCopy(txt); });
      } else fallbackCopy(txt);
    };
    document.getElementById("__dt_cfg_paste").onclick = function(){
      var txt = prompt("Вставь JSON конфига:");
      if(!txt) return;
      try {
        var obj = JSON.parse(txt);
        config = obj; saveConfig(config);
        alert("✅ Применено. Перезагружаю...");
        location.reload();
      } catch(e){ alert("❌ Плохой JSON: " + e.message); }
    };
    document.getElementById("__dt_cfg_download").onclick = function(){
      var blob = new Blob([JSON.stringify(loadConfig(), null, 2)], {type: "application/json"});
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "devtools-config.json";
      a.click();
      setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
    };
    document.getElementById("__dt_cfg_upload").onclick = function(){
      var inp = document.createElement("input");
      inp.type = "file"; inp.accept = ".json,application/json";
      inp.onchange = function(){
        var f = inp.files[0]; if(!f) return;
        var r = new FileReader();
        r.onload = function(){
          try {
            config = JSON.parse(r.result); saveConfig(config);
            alert("✅ Импортировано. Перезагружаю...");
            location.reload();
          } catch(e){ alert("❌ Ошибка: " + e.message); }
        };
        r.readAsText(f);
      };
      inp.click();
    };
    document.getElementById("__dt_cfg_save").onclick = function(){
      try {
        config = JSON.parse(document.getElementById("__dt_cfg_json").value);
        saveConfig(config);
        alert("✅ Сохранено. Перезагружаю...");
        location.reload();
      } catch(e){ alert("❌ Плохой JSON: " + e.message); }
    };
    document.getElementById("__dt_cfg_reset").onclick = function(){
      if(!confirm("Сбросить ВЕСЬ конфиг?")) return;
      localStorage.removeItem(CONFIG_KEY);
      location.reload();
    };
  }
  function fallbackCopy(text){
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); alert("✅ Скопировано"); } catch(e){ alert("❌ Не скопировалось"); }
    ta.remove();
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

  // ========== ПЕРЕКЛЮЧЕНИЕ ТАБОВ ==========
  function setTab(name){
    q(".__dt_tab").forEach(function(x){ x.classList.toggle("active", x.dataset.tab === name); });
    if(name === "vars") renderVars();
    else if(name === "dom") renderDomInspector();
    else if(name === "console") renderConsole();
    else if(name === "plugins") renderPlugins();
    else if(name === "config") renderConfig();
    else if(name === "quick") renderQuick();
    else if(name.indexOf("plugin_") === 0){
      var id = name.replace("plugin_", "");
      var plugin = DevTools._plugins[id];
      if(plugin && typeof plugin.tab === "function"){
        body.innerHTML = "";
        var pc = DevTools.getPluginConfig(id);
        try { plugin.tab(body, pc); } catch(e){ body.innerHTML = '<div style="color:#d9534a;padding:10px;">Ошибка плагина: ' + e.message + '</div>'; }
      } else {
        body.innerHTML = '<div style="color:#b7ac93;padding:10px;text-align:center;">Плагин не загружен</div>';
      }
    }
  }

  tabsContainer.querySelectorAll(".__dt_tab").forEach(function(t){
    t.onclick = function(){ setTab(t.dataset.tab); };
  });
  document.getElementById("__dt_close").onclick = function(){ panel.classList.remove("open"); if(inspectMode) stopInspect(); };
  btn.onclick = function(){ panel.classList.toggle("open"); if(panel.classList.contains("open")) setTab("vars"); };
  window.__devtools = { toggle: function(){ btn.onclick(); } };
  setTab("vars");

  // ========== ЗАПУСК: автозагрузка плагинов и скриптов ==========
  (function autoStart(){
    // плагины
    loadPluginsRegistry(function(data){
      if(!data || !data.plugins) return;
      data.plugins.forEach(function(p){
        var pc = config.plugins[p.id];
        if(pc && pc.enabled){
          loadPlugin(p);
        }
      });
    });
    // скрипты с autoload
    loadScripts(function(data){
      if(!data || !data.categories) return;
      data.categories.forEach(function(cat){
        (cat.scripts||[]).forEach(function(s, i){
          var sid = s.id || (cat.title + "_" + i);
          if(config.scripts[sid] && config.scripts[sid].autoload){
            try { eval(s.code); } catch(e){}
          }
        });
      });
    });
  })();
})();
