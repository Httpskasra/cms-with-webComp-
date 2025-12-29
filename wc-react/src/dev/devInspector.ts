// wc-react/src/dev/devInspector.ts

export function attachDevInspector(hostEl: HTMLElement, componentId: string) {
    
  if (typeof __DEV__ === "undefined" || !__DEV__) return;

  const panelId = `cti-dev-panel-${componentId}`;

  // جلوگیری از چندبار ساختن
  if (hostEl.querySelector(`#${panelId}`)) return;

  const panel = document.createElement("div");
  panel.id = panelId;

  panel.style.position = "fixed";
  panel.style.right = "12px";
  panel.style.bottom = "12px";
  panel.style.zIndex = "2147483647";
  panel.style.fontFamily = "ui-sans-serif, system-ui, -apple-system";
  panel.style.width = "340px";
  panel.style.maxWidth = "calc(100vw - 24px)";

  panel.innerHTML = `
    <div style="
      background: rgba(15, 15, 15, 0.92);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 12px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.35);
      overflow: hidden;
    ">
      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.12);
      ">
        <div style="display:flex; gap:8px; align-items:center;">
          <span style="
            display:inline-flex; align-items:center; justify-content:center;
            width:28px; height:28px; border-radius:10px;
            background: rgba(255,255,255,0.12);
          ">⚙️</span>
          <div>
            <div style="font-size: 13px; font-weight: 700;">Dev Inspector</div>
            <div style="font-size: 11px; opacity: .75;">${componentId}</div>
          </div>
        </div>
        <button data-cti-close style="
          all:unset; cursor:pointer;
          padding: 6px 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.10);
          font-size: 12px;
        ">Hide</button>
      </div>

      <div style="padding: 10px 12px;">
        <div style="font-size: 12px; margin-bottom: 6px; opacity:.85;">data-config (JSON)</div>
        <textarea data-cti-json style="
          width:100%;
          height:140px;
          resize: vertical;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
          color: #fff;
          padding: 8px;
          outline: none;
          font-size: 12px;
          line-height: 1.4;
        "></textarea>

        <div style="display:flex; gap:8px; margin-top: 10px;">
          <button data-cti-apply style="
            all:unset; cursor:pointer;
            padding: 8px 10px;
            border-radius: 10px;
            background: rgba(0, 180, 255, 0.22);
            border: 1px solid rgba(0, 180, 255, 0.35);
            font-size: 12px;
            font-weight: 700;
            text-align:center;
            flex:1;
          ">Apply</button>

          <button data-cti-refresh style="
            all:unset; cursor:pointer;
            padding: 8px 10px;
            border-radius: 10px;
            background: rgba(255,255,255,0.10);
            border: 1px solid rgba(255,255,255,0.14);
            font-size: 12px;
            text-align:center;
            flex:1;
          ">Reload</button>
        </div>

        <div data-cti-error style="margin-top: 10px; font-size: 12px; color: #ffb4b4; display:none;"></div>
      </div>
    </div>
  `;

  // مقداردهی اولیه textarea
  const textarea = panel.querySelector(
    "textarea[data-cti-json]"
  ) as HTMLTextAreaElement;
  const getConfigText = () => hostEl.getAttribute("data-config") || "{}";
  textarea.value = getConfigText();

  const errorEl = panel.querySelector("[data-cti-error]") as HTMLDivElement;
  const showError = (msg: string) => {
    errorEl.style.display = "block";
    errorEl.textContent = msg;
  };
  const clearError = () => {
    errorEl.style.display = "none";
    errorEl.textContent = "";
  };

  // Hide
  panel.querySelector("[data-cti-close]")?.addEventListener("click", () => {
    panel.remove();
  });

  // Reload: textarea را از attribute دوباره پر کن
  panel.querySelector("[data-cti-refresh]")?.addEventListener("click", () => {
    clearError();
    textarea.value = getConfigText();
  });

  // Apply: JSON را validate کن و attribute را set کن + rerender signal
  panel.querySelector("[data-cti-apply]")?.addEventListener("click", () => {
    clearError();
    try {
      const parsed = JSON.parse(textarea.value || "{}");
      hostEl.setAttribute("data-config", JSON.stringify(parsed));

      // یک event داخلی برای اینکه WC بدونه rerender کن
      hostEl.dispatchEvent(
        new CustomEvent("cti:dev:config-changed", { bubbles: false })
      );
    } catch (e: any) {
      showError(e?.message || "Invalid JSON");
    }
  });

  document.body.appendChild(panel);
}
