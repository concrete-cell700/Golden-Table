(function(){
  "use strict";
  if(window.__devtoolsLoaded) return;
  window.__devtoolsLoaded = true;

  // ====== СИСТЕМА СОХРАНЕНИЯ ======
  var STORAGE_KEY = "__dt_changes";
  function loadChanges(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {}; } catch(e){ return {}; }
  }
  function saveChanges(obj){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch(e){}
  }
  function getSelector(el){
    if(!el || !el.tagName) return null;
    // Уникальный селектор: id > data-атрибут > nth-child путь
    if(el.id) return "#" + el.id;
    // ищем уникальный атрибут data-*
    var attrs = el.attributes;
    for(var i=0; i<attrs.length; i++){
      var a = attrs[i];
      if(a.name.indexOf("data-") === 0){
        var sel = el.tagName.toLowerCase() + "[" + a.name + "=\"" + a.value + "\"]";
        if(document.querySelectorAll(sel).length === 1) return sel;
      }
    }
    // путь через nth-child
    var path = [];
    var cur = el;
    while(cur && cur !== document.body && cur.nodeType === 1){
      var tag = cur.tagName.toLowerCase();
      var parent = cur.parentElement;
      if(!parent){ path.unshift(tag); break; }
      var idx = 1;
      var sib = cur;
      while(sib.previousElementSibling){
        sib = sib.previousElementSibling;
        if(sib.tagName === cur.tagName) idx++;
      }
      path.unshift(tag + ":nth-of-type(" + idx + ")");
      cur = parent;
    }
    return "body > " + path.join(" > ");
  }
  function applyChanges(){
    var changes = loadChanges();
    Object.keys(changes).forEach(function(sel){
      try {
        var el = document.querySelector(sel);
        if(!el) return;
        var ch = changes[sel];
        if(ch.html !== undefined) el.innerHTML = ch.html;
        if(ch.className !== undefined) el.className = ch.className;
        if(ch.attrs){
          Object.keys(ch.attrs).forEach(function(a){
            try { el.setAttribute(a, ch.attrs[a]); } catch(e){}
          });
        }
        if(ch.styles){
          Object.keys(ch.styles).forEach(function(p){
            try { el.style[p] = ch.styles[p]; } catch(e){}
          });
        }
      } catch(e){}
    });
  }
  // Применяем сразу при загрузке devtools.js
  applyChanges();

  function recordChange(sel, key, value){
    var ch = loadChanges();
    if(!ch[sel]) ch[sel] = {};
    if(key === "style"){
      if(!ch[sel].styles) ch[sel].styles = {};
      ch[sel].styles[value.prop] = value.val;
    } else if(key === "attr"){
      if(!ch[sel].attrs) ch[sel].attrs = {};
      ch[sel].attrs[value.name] = value.val;
    } else {
      ch[sel][key] = value;
    }
    saveChanges(ch);
  }
  function removeChange(sel){
    var ch = loadChanges();
    delete ch[sel];
    saveChanges(ch);
  }
  function clearAllChanges(){
    localStorage.removeItem(STORAGE_KEY);
  }

  // ====== СТИЛИ ПАНЕЛИ ======
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
    .__dt_row button:hover{background:#d4af37;color:#2a1e05;}
    .__dt_row button.danger{background:#3a1a1a;border-color:#b8342a;color:#d9534a;}
    .__dt_row input.__dt_in,.__dt_row textarea.__dt_in{background:#000;color:#0f0;border:1px solid #8a6f2a;border-radius:4px;padding:4px;font-size:11px;font-family:monospace;min-width:0;box-sizing:border-box;}
    .__dt_row textarea.__dt_in{width:100%;min-height:60px;resize:vertical;}
    #__dt_console{width:100%;background:#000;color:#0f0;border:1px solid #d4af37;border-radius:6px;padding:8px;font-family:monospace;font-size:12px;min-height:90px;resize:vertical;box-sizing:border-box;}
    .__dt_quick{display:flex;flex-wrap:wrap;gap:6px;}
    .__dt_quick button{flex:1;min-width:90px;padding:8px 6px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;font-size:11px;cursor:pointer;}
    .__dt_quick button.danger{background:linear-gradient(180deg,#d9534a,#b8342a);color:#ece2c8;}
    .__dt_quick button.dark{background:#1b1b1b;color:#ece2c8;border:1px solid #8a6f2a;}
    .__dt_apply_all{width:100%;padding:12px;margin-top:10px;background:linear-gradient(180deg,#4c8c5c,#245933);border:1px solid #d4af37;border-radius:8px;color:#f2cf7e;font-weight:bold;font-size:13px;cursor:pointer;font-family:Georgia,serif;}
    .__dt_apply_all:hover{background:linear-gradient(180deg,#5c9c6c,#346943);}
    #__dt_inspector_overlay{position:fixed;pointer-events:none;border:2px dashed #d4af37;background:rgba(212,175,55,.15);z-index:99997;display:none;transition:all .05s;}
    #__dt_inspector_hint{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0d1f17;border:2px solid #d4af37;padding:10px 20px;border-radius:8px;color:#f2cf7e;font-family:Georgia,serif;font-size:14px;z-index:100000;box-shadow:0 4px 20px rgba(0,0,0,.8);display:none;}
    .__dt_style_group{margin-bottom:8px;padding:6px;background:#0d1f17;border:1px solid #1e3a2a;border-radius:6px;}
    .__dt_prop{display:flex;align-items:center;gap:4px;padding:3px 4px;font-size:10px;border-bottom:1px solid #1e3a2a;cursor:pointer;}
    .__dt_prop:last-child{border-bottom:none;}
    .__dt_prop:hover{background:#1a3a28;}
    .__dt_prop .pn{flex:0 0 45%;color:#b7ac93;word-break:break-all;}
    .__dt_prop .pv{flex:1;color:#f2cf7e;word-break:break-all;text-align:right;}
    .__dt_prop .pe{color:#d9534a;font-size:9px;padding:0 4px;}
    .__dt_badge{display:inline-block;background:#4c8c5c;color:#f2cf7e;font-size:9px;padding:1px 5px;border-radius:3px;margin-left:4px;}
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

  var overlay = document.createElement("div");
  overlay.id = "__dt_inspector_overlay";
  document.body.appendChild(overlay);

  var hint = document.createElement("div");
  hint.id = "__dt_inspector_hint";
  hint.textContent = "🎯 Тапни по элементу на странице";
  document.body.appendChild(hint);

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
  function shortSelector(el){
    if(!el || !el.tagName) return "—";
    var s = el.tagName.toLowerCase();
    if(el.id) s += "#" + el.id;
    if(el.className && typeof el.className === "string"){
      var cls = el.className.trim().split(/\s+/).slice(0, 3).join(".");
      if(cls) s += "." + cls;
    }
    return s;
  }
  function rgbToHex(rgb){
    if(!rgb) return "#000000";
    var m = rgb.match(/\d+/g);
    if(!m || m.length < 3) return "#000000";
    return "#" + [m[0],m[1],m[2]].map(function(x){
      var h = parseInt(x).toString(16);
      return h.length === 1 ? "0" + h : h;
    }).join("");
  }

  // ========== ИНСПЕКТОР ==========
  var inspectMode = false;
  var selectedEl = null;

  function startInspect(){
    inspectMode = true;
    selectedEl = null;
    hint.style.display = "block";
    document.addEventListener("mousemove", onInspectMove, true);
    document.addEventListener("touchmove", onInspectMove, true);
    document.addEventListener("click", onInspectClick, true);
    document.addEventListener("touchstart", onInspectTouch, true);
  }
  function stopInspect(){
    inspectMode = false;
    hint.style.display = "none";
    overlay.style.display = "none";
    document.removeEventListener("mousemove", onInspectMove, true);
    document.removeEventListener("touchmove", onInspectMove, true);
    document.removeEventListener("click", onInspectClick, true);
    document.removeEventListener("touchstart", onInspectTouch, true);
  }
  function onInspectMove(e){
    if(!inspectMode) return;
    var el = document.elementFromPoint(e.clientX, e.clientY);
    if(!el || el.id === "__dt_inspector_overlay" || el.closest("#__dt_panel") || el === btn || el.closest("#__dt_inspector_hint")) return;
    showOverlay(el);
  }
  function onInspectTouch(e){
    if(!inspectMode) return;
    var t = e.touches[0];
    if(!t) return;
    var el = document.elementFromPoint(t.clientX, t.clientY);
    if(!el || el.closest("#__dt_panel") || el === btn) return;
    showOverlay(el);
  }
  function onInspectClick(e){
    if(!inspectMode) return;
    if(e.target.closest("#__dt_panel") || e.target === btn || e.target.closest("#__dt_inspector_hint")) return;
    e.preventDefault();
    e.stopPropagation();
    selectedEl = e.target;
    stopInspect();
    panel.classList.add("open");
    renderDomInspector();
  }
  function showOverlay(el){
    var r = el.getBoundingClientRect();
    overlay.style.display = "block";
    overlay.style.left = r.left + "px";
    overlay.style.top = r.top + "px";
    overlay.style.width = r.width + "px";
    overlay.style.height = r.height + "px";
  }

  // ========== РЕНДЕР ИНСПЕКТОРА ==========
  function renderDomInspector(){
    var h = "";

    h += '<div class="__dt_section"><h4>🎯 Инспектор</h4>';
    h += '<button class="__dt_quick" id="__dt_pick" style="width:100%;padding:10px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;cursor:pointer;">🎯 Выбрать элемент (тап по странице)</button>';
    h += '</div>';

    // Список сохранённых изменений
    var saved = loadChanges();
    var savedCount = Object.keys(saved).length;
    if(savedCount > 0){
      h += '<div class="__dt_section"><h4>💾 Сохранено изменений: ' + savedCount + '</h4>';
      h += '<div class="__dt_quick"><button class="danger" id="__dt_clear_saved">🗑 Сбросить ВСЕ сохранения</button></div>';
      h += '</div>';
    }

    if(!selectedEl){
      h += '<div style="color:#b7ac93;font-size:11px;text-align:center;padding:20px;">Тапни «Выбрать элемент», потом тапни по любому элементу на странице</div>';
      body.innerHTML = h;
      document.getElementById("__dt_pick").onclick = function(){ panel.classList.remove("open"); startInspect(); };
      if(savedCount > 0){
        document.getElementById("__dt_clear_saved").onclick = function(){
          if(!confirm("Удалить все сохранённые изменения?")) return;
          clearAllChanges();
          location.reload();
        };
      }
      return;
    }

    var sel = getSelector(selectedEl);
    var wasSaved = saved[sel] !== undefined;

    h += '<div class="__dt_section"><h4>✅ Выбран ' + (wasSaved ? '<span class="__dt_badge">СОХРАНЁН</span>' : '') + '</h4>';
    h += '<div class="__dt_row"><span class="k">Селектор</span><span class="v" style="font-size:9px;">' + escapeAttr(sel || "—") + '</span></div>';
    h += '<div class="__dt_row"><span class="k">Тег</span><span class="v">' + selectedEl.tagName.toLowerCase() + '</span></div>';
    h += '</div>';

    h += '<div class="__dt_quick" style="margin-bottom:10px;">' +
         '<button id="__dt_pick2">🎯 Другой</button>' +
         '<button id="__dt_reselect_parent">⬆ Родитель</button>' +
         '<button class="danger" id="__dt_remove_el">🗑 Удалить</button>' +
         '</div>';

    if(wasSaved){
      h += '<div class="__dt_quick" style="margin-bottom:10px;">' +
           '<button class="danger" id="__dt_reset_el">↺ Сбросить этот элемент</button>' +
           '</div>';
    }

    h += '<div class="__dt_section"><h4>📝 Текст</h4>';
    h += '<div class="__dt_row" style="flex-direction:column;align-items:stretch;">' +
         '<textarea class="__dt_in" id="__dt_el_html">' + escapeAttr(selectedEl.innerHTML) + '</textarea>' +
         '<button id="__dt_apply_html" style="margin-top:6px;">💾 Применить и сохранить</button>' +
         '</div>';
    h += '</div>';

    h += '<div class="__dt_section"><h4>🏷 Классы</h4>';
    h += '<div class="__dt_row">' +
         '<input class="__dt_in" id="__dt_el_class" value="' + escapeAttr(selectedEl.className || "") + '">' +
         '<button id="__dt_apply_class">💾</button>' +
         '</div>';
    h += '</div>';

    h += '<div class="__dt_section"><h4>🔖 Атрибуты</h4>';
    var attrs = selectedEl.attributes;
    if(attrs.length === 0){
      h += '<div style="color:#b7ac93;font-size:10px;padding:6px;">Атрибутов нет</div>';
    } else {
      for(var i=0; i<attrs.length; i++){
        var a = attrs[i];
        h += '<div class="__dt_row"><span class="k">' + escapeAttr(a.name) + '</span>' +
             '<input class="__dt_in" data-attrname="' + escapeAttr(a.name) + '" value="' + escapeAttr(a.value) + '">' +
             '<button class="__dt_apply_attr2" data-attrname="' + escapeAttr(a.name) + '">💾</button></div>';
      }
    }
    h += '</div>';

    h += '<div class="__dt_section"><h4>🎨 Быстрые стили</h4>';
    var cs = getComputedStyle(selectedEl);
    h += '<div class="__dt_row"><span class="k">color</span>' +
         '<input class="__dt_in" type="color" id="__dt_c_color" value="' + rgbToHex(cs.color) + '">' +
         '<button id="__dt_apply_color">💾</button></div>';
    h += '<div class="__dt_row"><span class="k">background</span>' +
         '<input class="__dt_in" type="color" id="__dt_c_bg" value="' + rgbToHex(cs.backgroundColor) + '">' +
         '<button id="__dt_apply_bg">💾</button></div>';
    h += '<div class="__dt_row"><span class="k">font-size</span>' +
         '<input class="__dt_in" id="__dt_c_fs" value="' + escapeAttr(cs.fontSize) + '">' +
         '<button id="__dt_apply_fs">💾</button></div>';
    h += '<div class="__dt_row"><span class="k">font-weight</span>' +
         '<input class="__dt_in" id="__dt_c_fw" value="' + escapeAttr(cs.fontWeight) + '">' +
         '<button id="__dt_apply_fw">💾</button></div>';
    h += '<div class="__dt_row"><span class="k">border-radius</span>' +
         '<input class="__dt_in" id="__dt_c_br" value="' + escapeAttr(cs.borderRadius) + '">' +
         '<button id="__dt_apply_br">💾</button></div>';
    h += '<div class="__dt_row"><span class="k">padding</span>' +
         '<input class="__dt_in" id="__dt_c_pad" value="' + escapeAttr(cs.padding) + '">' +
         '<button id="__dt_apply_pad">💾</button></div>';
    h += '</div>';

    h += '<div class="__dt_section"><h4>📋 Все CSS (тапни → 💾)</h4>';
    var cssProps = [
      "color","backgroundColor","fontSize","fontWeight","fontFamily","textAlign",
      "padding","margin","border","borderRadius","boxShadow","opacity",
      "display","position","width","height","transform","transition",
      "backgroundImage","background","letterSpacing","lineHeight",
      "textShadow","textDecoration","cursor","zIndex"
    ];
    h += '<div class="__dt_style_group">';
    cssProps.forEach(function(p){
      var v = cs[p] || "";
      h += '<div class="__dt_prop" data-cssprop="' + p + '">' +
           '<span class="pn">' + p + '</span>' +
           '<span class="pv">' + escapeAttr(v) + '</span>' +
           '<span class="pe">✏💾</span>' +
           '</div>';
    });
    h += '</div></div>';

    body.innerHTML = h;

    // Обработчики
    document.getElementById("__dt_pick").onclick = function(){ panel.classList.remove("open"); startInspect(); };
    document.getElementById("__dt_pick2").onclick = function(){ panel.classList.remove("open"); startInspect(); };
    document.getElementById("__dt_reselect_parent").onclick = function(){
      if(selectedEl && selectedEl.parentElement){
        selectedEl = selectedEl.parentElement;
        renderDomInspector();
      }
    };
    document.getElementById("__dt_remove_el").onclick = function(){
      if(!selectedEl) return;
      if(!confirm("Удалить элемент?")) return;
      selectedEl.remove();
      selectedEl = null;
      renderDomInspector();
    };
    if(wasSaved){
      document.getElementById("__dt_reset_el").onclick = function(){
        if(!confirm("Сбросить изменения этого элемента?")) return;
        removeChange(sel);
        location.reload();
      };
    }

    // ТЕКСТ — сохранить
    document.getElementById("__dt_apply_html").onclick = function(){
      var v = document.getElementById("__dt_el_html").value;
      selectedEl.innerHTML = v;
      recordChange(sel, "html", v);
      alert("✅ Сохранено. Применится после перезагрузки.");
      renderDomInspector();
    };

    // КЛАССЫ — сохранить
    document.getElementById("__dt_apply_class").onclick = function(){
      var v = document.getElementById("__dt_el_class").value;
      selectedEl.className = v;
      recordChange(sel, "className", v);
      alert("✅ Сохранено.");
      renderDomInspector();
    };

    // АТРИБУТЫ — сохранить
    body.querySelectorAll(".__dt_apply_attr2").forEach(function(b){
      b.onclick = function(){
        var name = b.dataset.attrname;
        var inp = body.querySelector('input[data-attrname="' + name + '"]');
        selectedEl.setAttribute(name, inp.value);
        recordChange(sel, "attr", {name: name, val: inp.value});
        alert("✅ Сохранено.");
      };
    });

    // СТИЛИ — сохранить
    function applyAndSaveStyle(prop, val){
      selectedEl.style[prop] = val;
      recordChange(sel, "style", {prop: prop, val: val});
    }
    document.getElementById("__dt_apply_color").onclick = function(){
      applyAndSaveStyle("color", document.getElementById("__dt_c_color").value);
      alert("✅ Сохранено.");
    };
    document.getElementById("__dt_apply_bg").onclick = function(){
      applyAndSaveStyle("backgroundColor", document.getElementById("__dt_c_bg").value);
      alert("✅ Сохранено.");
    };
    document.getElementById("__dt_apply_fs").onclick = function(){
      applyAndSaveStyle("fontSize", document.getElementById("__dt_c_fs").value);
      alert("✅ Сохранено.");
    };
    document.getElementById("__dt_apply_fw").onclick = function(){
      applyAndSaveStyle("fontWeight", document.getElementById("__dt_c_fw").value);
      alert("✅ Сохранено.");
    };
    document.getElementById("__dt_apply_br").onclick = function(){
      applyAndSaveStyle("borderRadius", document.getElementById("__dt_c_br").value);
      alert("✅ Сохранено.");
    };
    document.getElementById("__dt_apply_pad").onclick = function(){
      applyAndSaveStyle("padding", document.getElementById("__dt_c_pad").value);
      alert("✅ Сохранено.");
    };

    // CSS-свойства по тапу
    body.querySelectorAll(".__dt_prop").forEach(function(p){
      p.onclick = function(){
        var prop = p.dataset.cssprop;
        var cur = selectedEl.style[prop] || getComputedStyle(selectedEl)[prop] || "";
        var v = prompt(prop + ":", cur);
        if(v === null) return;
        applyAndSaveStyle(prop, v);
        alert("✅ Сохранено.");
        renderDomInspector();
      };
    });
  }

  // ====== ВКЛАДКА ПЕРЕМЕННЫЕ ======
  function renderVars(){
    var h = "";

    h += '<div class="__dt_section"><h4>💰 Баланс</h4>';
    h += '<div class="__dt_row">' +
         '<span class="k">zolotoy_stol_balance</span>' +
         '<input class="__dt_in" data-store="zolotoy_stol_balance" value="' + escapeAttr(readLS("zolotoy_stol_balance")||"") + '">' +
         '<button class="__dt_apply_ls" data-store="zolotoy_stol_balance">OK</button>' +
         '</div>';
    h += '</div>';

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

    h += '<button class="__dt_apply_all">✅ ПРИМЕНИТЬ ВСЁ</button>';

    body.innerHTML = h;

    body.querySelectorAll(".__dt_apply_ls").forEach(function(b){
      b.onclick = function(){
        var key = b.dataset.store;
        var inp = body.querySelector('.__dt_in[data-store="' + key + '"]');
        var v = inp.value;
        if(v === "") return;
        localStorage.setItem(key, v);
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
          catch(e){ alert("Плохой JSON для " + f + ": " + e.message); return; }
        } else {
          var num = Number(v);
          c[f] = (v !== "" && !isNaN(num)) ? num : v;
        }

        localStorage.setItem("zolotoy_stol_clicker", JSON.stringify(c));
        location.reload();
      };
    });

    body.querySelector(".__dt_apply_all").onclick = function(){
      var balInp = body.querySelector('.__dt_in[data-store="zolotoy_stol_balance"]');
      if(balInp && balInp.value !== ""){
        localStorage.setItem("zolotoy_stol_balance", balInp.value);
      }

      var c;
      try { c = JSON.parse(readLS("zolotoy_stol_clicker") || "{}") || {}; } catch(e){ c = {}; }

      var errors = [];

      ["totalClicks","totalEarned","xp","skin","upgBought","bizOwned"].forEach(function(f){
        var inp = body.querySelector('.__dt_in[data-field="' + f + '"]');
        if(!inp) return;
        var v = inp.value;
        if(v === "") return;
        var num = Number(v);
        c[f] = (v !== "" && !isNaN(num)) ? num : v;
      });

      ["upgrades","biz","ach"].forEach(function(f){
        var inp = body.querySelector('.__dt_in[data-field="' + f + '"]');
        if(!inp) return;
        var v = inp.value;
        if(v === "") return;
        try { c[f] = JSON.parse(v); }
        catch(e){ errors.push(f + ": " + e.message); }
      });

      localStorage.setItem("zolotoy_stol_clicker", JSON.stringify(c));

      if(errors.length > 0){
        alert("Ошибки в JSON:\n" + errors.join("\n") + "\n\nОстальное применено.");
      }

      location.reload();
    };
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
      '<button id="__dt_q8" class="danger">Сброс CSS</button>' +
      '</div></div>';

    document.getElementById("__dt_run").onclick = function(){
      try { eval(document.getElementById("__dt_console").value); }
      catch(e){ alert("Error: " + e.message); }
    };
    function reload(){ location.reload(); }
    document.getElementById("__dt_q1").onclick = function(){ localStorage.setItem("zolotoy_stol_balance","100000000"); reload(); };
    document.getElementById("__dt_q2").onclick = function(){ localStorage.setItem("zolotoy_stol_balance","900000000000000"); reload(); };
    document.getElementById("__dt_q3").onclick = function(){ var c=JSON.parse(localStorage.getItem("zolotoy_stol_clicker")||"{}"); c.xp=999999; localStorage.setItem("zolotoy_stol_clicker",JSON.stringify(c)); reload(); };
    document.getElementById("__dt_q4").onclick = function(){ var c=JSON.parse(localStorage.getItem("zolotoy_stol_clicker")||"{}"); c.upgrades={power:100,gold:1,crit:3}; localStorage.setItem("zolotoy_stol_clicker",JSON.stringify(c)); reload(); };
    document.getElementById("__dt_q5").onclick = function(){ var c=JSON.parse(localStorage.getItem("zolotoy_stol_clicker")||"{}"); c.biz={kiosk:999,cafe:999,casinoB:999}; localStorage.setItem("zolotoy_stol_clicker",JSON.stringify(c)); reload(); };
    document.getElementById("__dt_q6").onclick = function(){ var c=JSON.parse(localStorage.getItem("zolotoy_stol_clicker")||"{}"); c.ach={c100:1,c1000:1,c10000:1,c100000:1,c500000:1,c1m:1,e500:1,e5k:1,e50k:1,lvl5:1,lvl10:1,firstUp:1,crit:1,biz:1}; localStorage.setItem("zolotoy_stol_clicker",JSON.stringify(c)); reload(); };
    document.getElementById("__dt_q7").onclick = function(){ if(confirm("Сбросить ВСЁ (включая CSS-изменения)?")){ localStorage.removeItem("zolotoy_stol_balance"); localStorage.removeItem("zolotoy_stol_clicker"); localStorage.removeItem(STORAGE_KEY); reload(); } };
    document.getElementById("__dt_q8").onclick = function(){ if(confirm("Удалить все сохранённые CSS/HTML изменения?")){ clearAllChanges(); reload(); } };
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
    else if(name === "dom") renderDomInspector();
    else if(name === "console") renderConsole();
    else if(name === "quick") renderQuick();
  }

  q(".__dt_tab").forEach(function(tab){
    tab.onclick = function(){ setTab(tab.dataset.tab); };
  });
  document.getElementById("__dt_close").onclick = function(){
    panel.classList.remove("open");
    if(inspectMode) stopInspect();
  };
  btn.onclick = function(){
    panel.classList.toggle("open");
    if(panel.classList.contains("open")) setTab("vars");
  };

  window.__devtools = { toggle: function(){ btn.onclick(); } };
  setTab("vars");
})();
