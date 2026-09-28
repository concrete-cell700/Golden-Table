
DevTools.register({
  id: "builder",
  name: "🎨 Билдер",
  icon: "🎨",

  tab: function(container, config){
    container.innerHTML =
      '<div class="__dt_section"><h4>🎨 Создать элемент</h4><div class="__dt_quick">' +
      '<button id="b_add_btn">🔘 Кнопка</button>' +
      '<button id="b_add_text">📝 Текст</button>' +
      '<button id="b_add_img">🖼 Картинка</button>' +
      '<button id="b_add_panel">▭ Панель</button>' +
      '</div></div>' +
      '<div class="__dt_section"><h4>📋 Элементов: ' + (config.elements||[]).length + '</h4>' +
      '<div class="__dt_quick"><button class="danger" id="b_clear">🗑 Удалить все</button></div></div>';

    container.querySelector("#b_add_btn").onclick = function(){ addEl("button", config); };
    container.querySelector("#b_add_text").onclick = function(){ addEl("text", config); };
    container.querySelector("#b_add_img").onclick = function(){ addEl("image", config); };
    container.querySelector("#b_add_panel").onclick = function(){ addEl("panel", config); };
    container.querySelector("#b_clear").onclick = function(){ if(confirm("Удалить все?")){ config.elements = []; DevTools.setPluginConfig("builder", config); renderAll(); location.reload(); } };

    function addEl(type, cfg){
      cfg.elements = cfg.elements || [];
      cfg.elements.push({
        type: type,
        x: 20, y: 200,
        text: type === "button" ? "Кнопка" : type === "text" ? "Текст" : "",
        url: type === "image" ? "https://picsum.photos/200/200?r=" + Date.now() : "",
        styles: type === "button" ? {padding:"10px 16px",background:"#d4af37",color:"#2a1e05",borderRadius:"8px",fontWeight:"bold"} :
                type === "text" ? {color:"#f2cf7e",fontSize:"16px"} :
                type === "panel" ? {background:"rgba(13,31,23,0.9)",padding:"10px",borderRadius:"10px",color:"#f2cf7e",border:"1px solid #d4af37"} :
                {width:"100px",borderRadius:"8px"}
      });
      DevTools.setPluginConfig("builder", cfg);
      renderAll();
      location.reload();
    }

    function renderAll(){
      document.querySelectorAll(".__b_custom").forEach(function(e){ e.remove(); });
      (config.elements||[]).forEach(function(item){
        var el;
        if(item.type === "button"){ el = document.createElement("button"); el.textContent = item.text||"Кнопка"; el.onclick = function(){ alert(item.text||"Кнопка"); }; }
        else if(item.type === "text"){ el = document.createElement("div"); el.textContent = item.text||"Текст"; }
        else if(item.type === "image"){ el = document.createElement("img"); el.src = item.url||""; }
        else { el = document.createElement("div"); el.textContent = item.text||""; }
        el.className = "__b_custom";
        el.style.position = "fixed";
        el.style.left = (item.x||20) + "px";
        el.style.top = (item.y||200) + "px";
        el.style.zIndex = "99990";
        if(item.styles) Object.keys(item.styles).forEach(function(p){ try { el.style[p] = item.styles[p]; } catch(e){} });
        document.body.appendChild(el);
      });
    }
    // рисуем сразу
    renderAll();
  },

  onEnable: function(config){
    // отрисовка при включении
    (config.elements||[]).forEach(function(item){
      var el;
      if(item.type === "button"){ el = document.createElement("button"); el.textContent = item.text||"Кнопка"; }
      else if(item.type === "text"){ el = document.createElement("div"); el.textContent = item.text||"Текст"; }
      else if(item.type === "image"){ el = document.createElement("img"); el.src = item.url||""; }
      else { el = document.createElement("div"); el.textContent = item.text||""; }
      el.className = "__b_custom";
      el.style.position = "fixed";
      el.style.left = (item.x||20) + "px";
      el.style.top = (item.y||200) + "px";
      el.style.zIndex = "99990";
      if(item.styles) Object.keys(item.styles).forEach(function(p){ try { el.style[p] = item.styles[p]; } catch(e){} });
      document.body.appendChild(el);
    });
  },

  onDisable: function(){
    document.querySelectorAll(".__b_custom").forEach(function(e){ e.remove(); });
  }
});
