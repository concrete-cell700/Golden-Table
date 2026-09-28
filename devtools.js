(function () {
  "use strict";
  if (window.__devtools) return;

  var LS_BAL = "zolotoy_stol_balance";
  var LS_CLICK = "zolotoy_stol_clicker";

  var css = document.createElement("style");
  css.textContent = [
    "#__dt_btn{position:fixed;top:70px;right:10px;z-index:99999;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f2cf7e,#8a6f2a);border:2px solid #d4af37;color:#2a1e05;font-size:13px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.6);}",
    "#__dt_panel{position:fixed;top:0;right:0;width:92%;max-width:420px;height:100%;background:#0a1712;border-left:1px solid #d4af37;z-index:99998;display:none;flex-direction:column;font-family:monospace;color:#ece2c8;box-shadow:-6px 0 20px rgba(0,0,0,.7);}",
    "#__dt_panel.open{display:flex;}",
    "#__dt_head{padding:12px;background:#0d1f17;border-bottom:1px solid #d4af37;display:flex;justify-content:space-between;align-items:center;font-family:Georgia,serif;color:#f2cf7e;}",
    "#__dt_head b{font-size:15px;}",
    "#__dt_close{background:none;border:none;color:#d9534a;font-size:20px;cursor:pointer;}",
    "#__dt_tabs{display:flex;background:#0d1f17;border-bottom:1px solid #8a6f2a;}",
    ".__dt_tab{flex:1;padding:9px 4px;text-align:center;font-size:11px;cursor:pointer;color:#b7ac93;border-bottom:2px solid transparent;}",
    ".__dt_tab.active{color:#f2cf7e;border-bottom-color:#d4af37;}",
    "#__dt_body{flex:1;overflow-y:auto;padding:10px;}",
    ".__dt_section{margin-bottom:14px;}",
    ".__dt_section>h4{margin:0 0 6px;font-size:12px;color:#f2cf7e;font-family:Georgia,serif;border-bottom:1px dashed #8a6f2a;padding-bottom:4px;}",
    ".__dt_row{display:flex;align-items:center;gap:6px;padding:5px 6px;background:#0d1f17;border:1px solid #1e3a2a;border-radius:6px;margin-bottom:4px;font-size:11px;}",
    ".__dt_row .k{flex:0 0 34%;color:#b7ac93;word-break:break-all;}",
    ".__dt_row button{background:#1a3a28;border:1px solid #d4af37;color:#f2cf7e;border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;}",
    ".__dt_row button:hover{background:#d4af37;color:#2a1e05;}",
    ".__dt_row button.danger{background:#3a1a1a;border-color:#b8342a;color:#d9534a;}",
    ".__dt_row input.__dt_in{background:#000;color:#0f0;border:1px solid #8a6f2a;border-radius:4px;padding:4px;font-size:11px;font-family:monospace;min-width:0;flex:1;}",
    "#__dt_console{width:100%;background:#000;color:#0f0;border:1px solid #d4af37;border-radius:6px;padding:8px;font-family:monospace;font-size:12px;min-height:90px;resize:vertical;box-sizing:border-box;}",
    ".__dt_quick{display:flex;flex-wrap:wrap;gap:6px;}",
    ".__dt_quick button{flex:1;min-width:90px;padding:8px 6px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;font-size:11px;cursor:pointer;}",
    ".__dt_quick button.danger{background:linear-gradient(180deg,#d9534a,#b8342a);color:#ece2c8;}",
    ".__dt_quick button.dark{background:#1b1b1b;color:#ece2c8;border:1px solid #8a6f2a;}",
    ".__dt_run{width:100%;margin-top:8px;padding:9px;background:linear-gradient(180deg,#f2cf7e,#d4af37);border:none;border-radius:6px;color:#2a1e05;font-weight:bold;cursor:pointer;}",
    ".__dt_apply_all{width:100%;padding:12px;margin-top:10px;background:linear-gradient(180deg,#4c8c5c,#245933);border:1px solid #d4af37;border-radius:8px;color:#f2cf7e;font-weight:bold;font-size:13px;cursor:pointer;font-family:Georgia,serif;}",
    ".__dt_apply_all:hover{background:linear-gradient(180deg,#5c9c6c,#346943);}"
  ].join("\n");
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.id = "__dt_btn";
  btn.textContent = "DT";
  document.body.appendChild(btn);

  var panel = document.createElement("div");
  panel.id = "__dt_panel";

  var head = document.createElement("div");
  head.id = "__dt_head";
  var headTitle = document.createElement("b");
  headTitle.textContent = "DEVTOOLS";
  var headClose = document.createElement("button");
  headClose.id = "__dt_close";
  headClose.textContent = "X";
  head.appendChild(headTitle);
  head.appendChild(headClose);

  var tabs = document.createElement("div");
  tabs.id = "__dt_tabs";
  [
    { id: "vars", label: "Переменные" },
    { id: "dom", label: "DOM" },
    { id: "console", label: "Консоль" },
    { id: "quick", label: "Быстро" }
  ].forEach(function (tab, i){
    var el = document.createElement("div");
    el.className = "__dt_tab" + (i === 0 ? " active" : "");
    el.dataset.tab = tab.id;
    el.textContent = tab.label;
    tabs.appendChild(el);
  });

  var body = document.createElement("div");
  body.id = "__dt_body";

  panel.appendChild(head);
  panel.appendChild(tabs);
  panel.appendChild(body);
  document.body.appendChild(panel);

  function el(tag, attrs, text){
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k){ n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }

  function readLS(key){
    return localStorage.getItem(key);
  }
  function writeLS(key, val){
    localStorage.setItem(key, String(val));
  }
  function clickerRead(){
    try {
      var obj = JSON.parse(readLS(LS_CLICK) || "{}");
      return (obj && typeof obj === "object") ? obj : {};
    } catch (e){ return {}; }
  }
  function clickerWrite(obj){
    writeLS(LS_CLICK, JSON.stringify(obj));
  }
  function parseNumOrString(v){
    var n = Number(v);
    return (v !== "" && !isNaN(n)) ? n : v;
  }
  function reload(){ location.reload(); }

  function section(title){
    var s = document.createElement("div");
    s.className = "__dt_section";
    var h = document.createElement("h4");
    h.textContent = title;
    s.appendChild(h);
    return s;
  }

  function fieldRow(label, inputAttrs, buttonAttrs, buttonLabel){
    var row = document.createElement("div");
    row.className = "__dt_row";
    var k = document.createElement("span");
    k.className = "k";
    k.textContent = label;
    var inp = document.createElement("input");
    inp.className = "__dt_in";
    Object.keys(inputAttrs || {}).forEach(function (a){ inp.setAttribute(a, inputAttrs[a]); });
    var b = document.createElement("button");
    Object.keys(buttonAttrs || {}).forEach(function (a){ b.setAttribute(a, buttonAttrs[a]); });
    b.textContent = buttonLabel;
    row.appendChild(k);
    row.appendChild(inp);
    row.appendChild(b);
    return row;
  }

  // ===== Вкладка "Переменные" =====

  var VAR_FIELDS = ["totalClicks","totalEarned","xp","skin","upgBought","bizOwned"];
  var JSON_FIELDS = ["upgrades","biz","ach"];

  function renderVars(){
    body.textContent = "";

    var balSection = section("Баланс");
    balSection.appendChild(fieldRow(
      LS_BAL,
      { "data-store": LS_BAL, value: readLS(LS_BAL) || "" },
      { "data-apply-ls": LS_BAL },
      "OK"
    ));
    body.appendChild(balSection);

    var c = clickerRead();

    var clickSection = section("Кликер");
    VAR_FIELDS.forEach(function (f){
      clickSection.appendChild(fieldRow(
        f,
        { "data-field": f, value: c[f] == null ? "" : String(c[f]) },
        { "data-apply-field": f, "data-json": "0" },
        "OK"
      ));
    });
    JSON_FIELDS.forEach(function (f){
      var v = c[f] == null ? "" : JSON.stringify(c[f]);
      clickSection.appendChild(fieldRow(
        f + " (JSON)",
        { "data-field": f, value: v },
        { "data-apply-field": f, "data-json": "1" },
        "OK"
      ));
    });
    body.appendChild(clickSection);

    var applyAll = document.createElement("button");
    applyAll.className = "__dt_apply_all";
    applyAll.textContent = "Применить всё";
    applyAll.addEventListener("click", applyAllVars);
    body.appendChild(applyAll);

    body.querySelectorAll("[data-apply-ls]").forEach(function (b){
      b.addEventListener("click", function (){
        var key = b.dataset.applyLs;
        var inp = body.querySelector('[data-store="' + key + '"]');
        if (!inp || inp.value === "") return;
        writeLS(key, inp.value);
        reload();
      });
    });

    body.querySelectorAll("[data-apply-field]").forEach(function (b){
      b.addEventListener("click", function (){
        var f = b.dataset.applyField;
        var isJson = b.dataset.json === "1";
        var inp = body.querySelector('[data-field="' + f + '"]');
        if (!inp) return;
        var v = inp.value;
        var obj = clickerRead();

        if (isJson){
          try { obj[f] = JSON.parse(v); }
          catch (e){ alert("Некорректный JSON для " + f); return; }
        } else {
          obj[f] = parseNumOrString(v);
        }
        clickerWrite(obj);
        reload();
      });
    });
  }

  function applyAllVars(){
    var balInp = body.querySelector('[data-store="' + LS_BAL + '"]');
    if (balInp && balInp.value !== "") writeLS(LS_BAL, balInp.value);

    var obj = clickerRead();
    var errors = [];

    VAR_FIELDS.forEach(function (f){
      var inp = body.querySelector('[data-field="' + f + '"]');
      if (!inp || inp.value === "") return;
      obj[f] = parseNumOrString(inp.value);
    });

    JSON_FIELDS.forEach(function (f){
      var inp = body.querySelector('[data-field="' + f + '"]');
      if (!inp || inp.value === "") return;
      try { obj[f] = JSON.parse(inp.value); }
      catch (e){ errors.push(f); }
    });

    clickerWrite(obj);
    if (errors.length) alert("Некорректный JSON: " + errors.join(", "));
    reload();
  }

  // ===== Вкладка "DOM" =====

  function renderDom(){
    body.textContent = "";

    var betsSection = section("Ставки");
    ["slotbet","roubet","bjbet"].forEach(function (a){
      var label = document.createElement("div");
      label.style.cssText = "font-size:11px;color:#b7ac93;margin:6px 0 3px;";
      label.textContent = "data-" + a;
      betsSection.appendChild(label);

      document.querySelectorAll("[data-" + a + "]").forEach(function (node, i){
        betsSection.appendChild(fieldRow(
          "#" + i + " [" + node.textContent + "]",
          { "data-attr": a, "data-idx": String(i), value: node.getAttribute("data-" + a) },
          { "data-apply-attr": a, "data-idx": String(i) },
          "OK"
        ));
      });
    });
    body.appendChild(betsSection);

    var chipsSection = section("Чипы");
    document.querySelectorAll(".chip-btn").forEach(function (node, i){
      chipsSection.appendChild(fieldRow(
        "chip#" + i,
        { "data-chip": String(i), value: node.textContent },
        { "data-apply-chip": String(i) },
        "OK"
      ));
    });
    body.appendChild(chipsSection);

    body.querySelectorAll("[data-apply-attr]").forEach(function (b){
      b.addEventListener("click", function (){
        var a = b.dataset.applyAttr;
        var i = parseInt(b.dataset.idx, 10);
        var inp = body.querySelector('[data-attr="' + a + '"][data-idx="' + i + '"]');
        var node = document.querySelectorAll("[data-" + a + "]")[i];
        if (!inp || !node) return;
        node.setAttribute("data-" + a, inp.value);
        node.textContent = inp.value;
      });
    });

    body.querySelectorAll("[data-apply-chip]").forEach(function (b){
      b.addEventListener("click", function (){
        var i = parseInt(b.dataset.applyChip, 10);
        var inp = body.querySelector('[data-chip="' + i + '"]');
        var node = document.querySelectorAll(".chip-btn")[i];
        if (inp && node) node.textContent = inp.value;
      });
    });
  }

  // ===== Вкладка "Консоль" =====

  function renderConsole(){
    body.textContent = "";

    var conSection = section("JS-консоль");
    var ta = document.createElement("textarea");
    ta.id = "__dt_console";
    ta.placeholder = "// любой код";
    var run = document.createElement("button");
    run.className = "__dt_run";
    run.textContent = "Выполнить";
    run.addEventListener("click", function (){
      try { eval(ta.value); }
      catch (e){ alert("Error: " + e.message); }
    });
    conSection.appendChild(ta);
    conSection.appendChild(run);
    body.appendChild(conSection);

    var quickSection = section("Быстрые команды");
    var wrap = document.createElement("div");
    wrap.className = "__dt_quick";

    [
      { id: "bal100m", label: "+100M баланс",      cls: "" },
      { id: "bal900t", label: "+900T баланс",      cls: "" },
      { id: "lvl50",   label: "Ур. 50",            cls: "" },
      { id: "upg",     label: "Max апгрейды",      cls: "" },
      { id: "biz",     label: "Max бизнесы",       cls: "" },
      { id: "ach",     label: "Все ачивки",        cls: "dark" },
      { id: "reset",   label: "Сброс",             cls: "danger" }
    ].forEach(function (item){
      var b = document.createElement("button");
      b.dataset.quick = item.id;
      b.textContent = item.label;
      if (item.cls) b.className = item.cls;
      wrap.appendChild(b);
    });
    quickSection.appendChild(wrap);
    body.appendChild(quickSection);

    wrap.addEventListener("click", function (e){
      var b = e.target.closest("[data-quick]");
      if (!b) return;
      var action = b.dataset.quick;
      var c;

      switch (action){
        case "bal100m":
          writeLS(LS_BAL, "100000000");
          break;
        case "bal900t":
          writeLS(LS_BAL, "900000000000000");
          break;
        case "lvl50":
          c = clickerRead();
          c.xp = 999999;
          c.level = 50;
          clickerWrite(c);
          break;
        case "upg":
          c = clickerRead();
          c.upgrades = { power: 100, gold: 1, crit: 3 };
          clickerWrite(c);
          break;
        case "biz":
          c = clickerRead();
          c.biz = { kiosk: 999, cafe: 999, casinoB: 999 };
          clickerWrite(c);
          break;
        case "ach":
          c = clickerRead();
          c.ach = {
            c100: 1, c1000: 1, c10000: 1, c100000: 1, c500000: 1, c1m: 1,
            e500: 1, e5k: 1, e50k: 1,
            lvl5: 1, lvl10: 1, firstUp: 1, crit: 1, biz: 1
          };
          clickerWrite(c);
          break;
        case "reset":
          if (!confirm("Сбросить всё?")) return;
          localStorage.removeItem(LS_BAL);
          localStorage.removeItem(LS_CLICK);
          break;
      }
      reload();
    });
  }

  // ===== Вкладка "Быстро" =====

  function setBet(attr, label){
    var nodes = document.querySelectorAll("[data-" + attr + "]");
    if (!nodes.length) return;
    var last = nodes[nodes.length - 1];
    last.setAttribute("data-" + attr, "1000000");
    last.textContent = label;
  }

  function renderQuick(){
    body.textContent = "";

    var betSection = section("Ставка 1 000 000");
    var wrap = document.createElement("div");
    wrap.className = "__dt_quick";
    [
      { attr: "slotbet", label: "Слоты" },
      { attr: "roubet",  label: "Рулетка" },
      { attr: "bjbet",   label: "Блэкджек" }
    ].forEach(function (item){
      var b = document.createElement("button");
      b.dataset.setBet = item.attr;
      b.textContent = item.label;
      wrap.appendChild(b);
    });
    wrap.addEventListener("click", function (e){
      var b = e.target.closest("[data-set-bet]");
      if (b) setBet(b.dataset.setBet, "1M");
    });
    betSection.appendChild(wrap);
    body.appendChild(betSection);

    var titleSection = section("Название игры");
    var row = document.createElement("div");
    row.className = "__dt_row";
    var inp = document.createElement("input");
    inp.id = "__dt_title";
    inp.className = "__dt_in";
    inp.placeholder = "Новое название";
    var ok = document.createElement("button");
    ok.id = "__dt_title_ok";
    ok.textContent = "OK";
    ok.addEventListener("click", function (){
      var v = inp.value;
      if (!v) return;
      document.querySelectorAll(".brand-name,.game-title").forEach(function (n){
        n.textContent = v;
      });
    });
    row.appendChild(inp);
    row.appendChild(ok);
    titleSection.appendChild(row);
    body.appendChild(titleSection);
  }

  // ===== Табы =====

  function setTab(name){
    document.querySelectorAll(".__dt_tab").forEach(function (x){
      x.classList.toggle("active", x.dataset.tab === name);
    });
    if (name === "vars") renderVars();
    else if (name === "dom") renderDom();
    else if (name === "console") renderConsole();
    else if (name === "quick") renderQuick();
  }

  document.querySelectorAll(".__dt_tab").forEach(function (tab){
    tab.addEventListener("click", function (){ setTab(tab.dataset.tab); });
  });

  headClose.addEventListener("click", function (){
    panel.classList.remove("open");
  });

  btn.addEventListener("click", function (){
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) setTab("vars");
  });

  window.__devtools = {
    toggle: function (){ btn.click(); }
  };

  setTab("vars");
})();
