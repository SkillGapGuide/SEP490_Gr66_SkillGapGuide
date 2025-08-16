// src/console-shim.js
(function patchConsole() {
  const toSafeString = (v) => {
    try {
      if (v == null) return String(v);
      const t = typeof v;
      if (t === "string") return v;
      if (t === "number" || t === "boolean" || t === "bigint") return String(v);
      if (t === "symbol") return String(v);
      if (t === "function") return `[Function ${v.name || "anonymous"}]`;
      return (
        JSON.stringify(v, (_k, vv) => {
          if (typeof vv === "bigint") return vv.toString();
          if (typeof vv === "function") return undefined;
          if (typeof vv === "symbol") return String(vv);
          return vv;
        }) ?? Object.prototype.toString.call(v)
      );
    } catch {
      try { return Object.prototype.toString.call(v); } catch { return "[Unserializable]"; }
    }
  };

  ["log", "info", "warn", "error"].forEach((m) => {
    const orig = console[m] && console[m].bind(console);
    if (!orig) return;
    console[m] = (...args) => {
      if (args.length > 0 && typeof args[0] !== "string") args[0] = toSafeString(args[0]);
      for (let i = 1; i < args.length; i++) {
        if (typeof args[i] !== "string") args[i] = toSafeString(args[i]);
      }
      return orig(...args);
    };
  });
})();
