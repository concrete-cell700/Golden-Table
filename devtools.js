(function(){
  "use strict";
  if (window.__devtools) return;

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

  var LS_BAL = "zolotoy_stol_balance";
  var LS_CLICK = "zolotoy_stol_clicker";

  var btn = document.createElement("button");
  btn.id = "__dt_btn";
  btn.textContent = "⚙";
  document.body.appendChild(btn);

  var panel = document.createElement("div");
  panel.id = "__dt_panel";
  panel.innerHTML =
    '<div id="__dt_head"><b>DEVTOOLS</b><button id="__dt_close">✕</button></div>' +
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

  function lsGet(key){ return localStorage.getItem(key); }
  function lsSet(key, val){ localStorage.setItem(key, String(val)); }

  function clickerGet(){
    try {
      var raw = localStorage.getItem(LS_CLICK);
      return raw ? JSON.parse(raw) : {};
    } catch(e){ return {}; }
  }
  function clickerSet(obj){ localStorage.setItem(LS_CLICK, JSON.stringify(obj)); }

  function clickerEdit(field, promptLabel){
    var v = prompt(promptLabel, "");
    if (v === null) return;
    var obj = clickerGet();
    obj[field] = v;
    clickerSet(obj);
    setTab("vars");
  }

  function clickerEditJSON(field, promptLabel){
    var obj = clickerGet();
    var v = prompt(promptLabel, JSON.stringify(obj[field] || {}));
    if (v === null) return;
    try {
      obj[field] = JSON.parse(v);
    } catch(e){ alert("Bad JSON"); return; }
    clickerSet(obj);
    setTab("vars");
  }

  function updateBalanceUI(val){
    var el = document.getElementById("balanceDisplay");
    if (!el) return;
    var n = parseFloat(val);
    el.textContent = isNaN(n)
      ? String(val)
      : n.toLocaleString("ru-RU", {minimumFractionDigits:1, maximumFractionDigits:1});
  }

  function row(label, value, act){
    var shown = (value === null || value === undefined || value === "") ? "—" : String(value);
    return '<div class="__dt_row"><span class="k">' + label + '</span>' +
           '<span class="v">' + shown + '</span>' +
           '<button data-act="' + act + '">✏</button></div>';
  }

  function renderVars(){
    var c = clickerGet();
    var h = "";
    h += '<div class="__dt_section"><h4>Баланс</h4>';
    h += row("balance", lsGet(LS_BAL), "v-bal");
    h += '</div>';
    h += '<div class="__dt_section"><h4>Кликер</h4>';
    h += row("totalClicks", c.totalClicks, "v-clicks");
    h += row("totalEarned", c.totalEarned, "v-earned");
    h += row("xp", c.xp, "v-xp");
    h += row("level", c.level, "v-level");
    h += row("skin", c.skin, "v-skin");
    h += row("upgBought", c.upgBought, "v-upgbought");
    h += row("bizOwned", c.bizOwned, "v-bizowned");
    h += row("upgrades", JSON.stringify(c.upgrades || {}), "v-upgrades");
    h += row("biz", JSON.stringify(c.biz || {}), "v-biz");
    h += row("ach", Object.keys(c.ach || {}).length + " шт.", "v-ach");
    h += '</div>';
    body.innerHTML = h;
  }

  function renderDom(){
    var h = '<div class="__dt_section"><h4>Ставки</h4>';
    ["slotbet","roubet","bjbet"].forEach(function(a){
      h += '<div style="font-size:11px;color:#b7ac93;margin:6px 0 3px;">data-' + a + '</div>';
      q("[data-" + a + "]").forEach(function(el, i){
        h += '<div class="__dt_row"><span class="k">#' + i + ' [' + el.textContent + ']</span>' +
             '<span class="v">' + el.getAttribute("data-" + a) + '</span>' +
             '<button data-act="set-attr" data-attr="' + a + '" data-idx="' + i + '">✏</button></div>';
      });
    });
    h += '</div>';
    h += '<div class="__dt_section"><h4>Любой элемент</h4>' +
         '<div class="__dt_row"><span class="k">CSS</span><input id="__dt_sel" style="flex:1;background:#000;color:#0f0;border:1px solid #8a6f2a;border-radius:4px;padding:4px;font-size:11px;" placeholder=".num-cell"></div>' +
         '<div class="__dt_row"><button data-act="edit-html">innerHTML</button>' +
         '<button data-act="edit-value">value</button>' +
         '<button class="danger" data-act="del-el">Удалить</button></div></div>';
    body.innerHTML = h;
  }

  function renderConsole(){
    body.innerHTML =
      '<div class="__dt_section"><h4>JS-консоль</h4>' +
      '<textarea id="__dt_console" placeholder="// любой код"></textarea>' +
      '<button class="__dt_quick" style="margin-top:8px;width:100%;padding:9px;" data-act="run-js">Выполнить</button></div>' +
      '<div class="__dt_section"><h4>Быстрые команды</h4><div class="__dt_quick">' +
      '<button data-act="q-bal">+9.9M баланс</button>' +
      '<button data-act="q-bal900">+900T баланс</button>' +
      '<button data-act="q-lvl">Ур. 50</button>' +
      '<button data-act="q-upg">Max апгрейды</button>' +
      '<button data-act="q-biz">Max бизнесы</button>' +
      '<button class="dark" data-act="q-ach">Все ачивки</button>' +
      '<button class="dark" data-act="bet-all">Ставки 1M</button>' +
      '<button class="danger" data-act="q-reset">Сброс</button>' +
      '</div></div>';
  }

  function renderQuick(){
    body.innerHTML =
      '<div class="__dt_section"><h4>Сменить номинал</h4><div class="__dt_quick">' +
      '<button data-act="bet-slots">Слоты 1M</button>' +
      '<button data-act="bet-rou">Рулетка 1M</button>' +
      '<button data-act="bet-bj">Блэкджек 1M</button>' +
      '<button data-act="bet-all">Все 1M</button>' +
      '</div></div>' +
      '<div class="__dt_section"><h4>Название игры</h4>' +
      '<div class="__dt_row"><input id="__dt_title" style="flex:1;background:#000;color:#0f0;border:1px solid #8a6f2a;border-radius:4px;padding:4px;font-size:11px;" placeholder="Новое название">' +
      '<button data-act="set-title">OK</button></div></div>';
  }

  function setBet(attr, label){
    var els = q("[data-" + attr + "]");
    if (!els.length) return;
    var last = els[els.length - 1];
    last.setAttribute("data-" + attr, "1000000");
    last.textContent = label;
  }

  body.addEventListener("click", function(e){
    var t = e.target.closest("[data-act]");
    if (!t) return;
    var act = t.dataset.act;
    var v;

    switch (act) {
      case "v-bal":
        v = prompt("Баланс:", lsGet(LS_BAL) || "1000000");
        if (v === null) return;
        lsSet(LS_BAL, v);
        updateBalanceUI(v);
        setTab("vars");
        return;

      case "v-clicks":    clickerEdit("totalClicks", "totalClicks:");    return;
      case "v-earned":    clickerEdit("totalEarned", "totalEarned:");    return;
      case "v-xp":        clickerEdit("xp", "xp:");                      return;
      case "v-level":     clickerEdit("level", "level:");                return;
      case "v-skin":      clickerEdit("skin", "skin:");                  return;
      case "v-upgbought": clickerEdit("upgBought", "upgBought:");        return;
      case "v-bizowned":  clickerEdit("bizOwned", "bizOwned:");          return;

      case "v-upgrades": clickerEditJSON("upgrades", "upgrades (JSON):"); return;
      case "v-biz":      clickerEditJSON("biz", "biz (JSON):");           return;
      case "v-ach":      clickerEditJSON("ach", "ach (JSON):");           return;

      case "set-attr": {
        var attr = t.dataset.attr;
        var idx = parseInt(t.dataset.idx, 10);
        var el = q("[data-" + attr + "]")[idx];
        if (!el) return;
        v = prompt("Значение:", el.getAttribute("data-" + attr));
        if (v === null) return;
        el.setAttribute("data-" + attr, v);
        el.textContent = v;
        return;
      }

      case "edit-html": {
        var s = document.getElementById("__dt_sel").value;
        var e1 = document.querySelector(s);
        if (!e1) { alert("Не найдено"); return; }
        v = prompt("innerHTML:", e1.innerHTML);
        if (v !== null) e1.innerHTML = v;
        return;
      }

      case "edit-value": {
        var s2 = document.getElementById("__dt_sel").value;
        var e2 = document.querySelector(s2);
        if (!e2) { alert("Не найдено"); return; }
        v = prompt("value:", e2.value || "");
        if (v !== null) e2.value = v;
        return;
      }

      case "del-el": {
        var s3 = document.getElementById("__dt_sel").value;
        q(s3).forEach(function(el){ el.remove(); });
        return;
      }

      case "run-js":
        try {
          eval(document.getElementById("__dt_console").value);
        } catch(err){
          alert("Error: " + err.message);
        }
        return;

      case "q-bal":
        lsSet(LS_BAL, "9900000");
        updateBalanceUI("9900000");
        return;

      case "q-bal900":
        lsSet(LS_BAL, "900000000000000");
        updateBalanceUI("900000000000000");
        return;

      case "q-lvl": {
        var cl = clickerGet();
        cl.xp = 999999;
        cl.level = 50;
        clickerSet(cl);
        return;
      }

      case "q-upg": {
        var cu = clickerGet();
        cu.upgrades = {power:100, gold:1, crit:3};
        clickerSet(cu);
        return;
      }

      case "q-biz": {
        var cb = clickerGet();
        cb.biz = {kiosk:999, cafe:999, casinoB:999};
        clickerSet(cb);
        return;
      }

      case "q-ach": {
        var ca = clickerGet();
        ca.ach = {
          c100:1, c1000:1, c10000:1, c100000:1, c500000:1, c1m:1,
          e500:1, e5k:1, e50k:1,
          lvl5:1, lvl10:1, firstUp:1, crit:1, biz:1
        };
        clickerSet(ca);
        return;
      }

      case "q-reset":
        if (confirm("Сбросить всё?")) {
          localStorage.removeItem(LS_BAL);
          localStorage.removeItem(LS_CLICK);
          location.reload();
        }
        return;

      case "bet-slots": setBet("slotbet", "1M"); return;
      case "bet-rou":   setBet("roubet",   "1M"); return;
      case "bet-bj":    setBet("bjbet",    "1M"); return;

      case "bet-all":
        setBet("slotbet", "1M");
        setBet("roubet",   "1M");
        setBet("bjbet",    "1M");
        return;

      case "set-title": {
        var nv = document.getElementById("__dt_title").value;
        if (nv) q(".brand-name,.game-title").forEach(function(el){ el.textContent = nv; });
        return;
      }
    }
  });

  function setTab(name){
    q(".__dt_tab").forEach(function(x){
      x.classList.toggle("active", x.dataset.tab === name);
    });
    if (name === "vars") renderVars();
    else if (name === "dom") renderDom();
    else if (name === "console") renderConsole();
    else if (name === "quick") renderQuick();
  }

  q(".__dt_tab").forEach(function(tab){
    tab.addEventListener("click", function(){ setTab(tab.dataset.tab); });
  });

  document.getElementById("__dt_close").addEventListener("click", function(){
    panel.classList.remove("open");
  });

  btn.addEventListener("click", function(){
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) setTab("vars");
  });

  window.__devtools = {
    toggle: function(){ btn.click(); }
  };

  setTab("vars");
})();
