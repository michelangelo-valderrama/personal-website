import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './chunks/astro_-zwNVyMV.mjs';
import 'clsx';
import 'cssesc';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"api/addContact.json","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/addcontact.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/addContact\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"addContact.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/addContact.json.ts","pathname":"/api/addContact.json","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_astro/ec.6jtwr.css","pattern":"^\\/_astro\\/ec\\.6jtwr\\.css$","segments":[[{"content":"_astro","dynamic":false,"spread":false}],[{"content":"ec.6jtwr.css","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro-expressive-code/routes/styles.ts","pathname":"/_astro/ec.6jtwr.css","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_astro/ec.sgewm.js","pattern":"^\\/_astro\\/ec\\.sgewm\\.js$","segments":[[{"content":"_astro","dynamic":false,"spread":false}],[{"content":"ec.sgewm.js","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro-expressive-code/routes/scripts.ts","pathname":"/_astro/ec.sgewm.js","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://imangelo.dev","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/tokyo/Dev/projects/personal-website/src/layouts/Layout.astro",{"propagation":"in-tree","containsHead":false}],["/home/tokyo/Dev/projects/personal-website/src/pages/[article].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/[article]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/home/tokyo/Dev/projects/personal-website/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/home/tokyo/Dev/projects/personal-website/src/components/Articles.astro",{"propagation":"in-tree","containsHead":false}],["/home/tokyo/Dev/projects/personal-website/src/pages/rss.xml.js",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@js",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/pages/generic_Fw7_4DYR.mjs","/node_modules/astro-expressive-code/routes/scripts.ts":"chunks/pages/scripts_jLHlqVOJ.mjs","/node_modules/astro-expressive-code/routes/styles.ts":"chunks/pages/styles_TOY7bZjP.mjs","\u0000@astrojs-manifest":"manifest_JZkXe4O9.mjs","/home/tokyo/Dev/projects/personal-website/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_3wEZly-Z.mjs","\u0000@astro-page:node_modules/astro-expressive-code/routes/styles@_@ts":"chunks/styles_SsjXuwdv.mjs","\u0000@astro-page:node_modules/astro-expressive-code/routes/scripts@_@ts":"chunks/scripts_Tu1u5IQr.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_-bFlDALB.mjs","\u0000@astro-page:src/pages/api/addContact.json@_@ts":"chunks/addContact___vjgB47.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_8fvrf95f.mjs","\u0000@astro-page:src/pages/rss.xml@_@js":"chunks/rss_KkMgPqaR.mjs","\u0000@astro-page:src/pages/[article]@_@astro":"chunks/_article__LMFNgZc2.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/crear-shortcut-de-pico-8-en-linux.md?astroContentCollectionEntry=true":"chunks/crear-shortcut-de-pico-8-en-linux_a4X632AX.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/el-principio-del-universo.md?astroContentCollectionEntry=true":"chunks/el-principio-del-universo_kU0FdRWk.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/firefox-developer-edition-para-ubuntu.md?astroContentCollectionEntry=true":"chunks/firefox-developer-edition-para-ubuntu_Xqv-ydch.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/i18n-en-astro.md?astroContentCollectionEntry=true":"chunks/i18n-en-astro_IOYh5tEK.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8.md?astroContentCollectionEntry=true":"chunks/introduccion-al-desarrollo-de-videojuegos-con-pico-8_dol-Vzol.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/las-matematicas-no-son-una-ciencia.md?astroContentCollectionEntry=true":"chunks/las-matematicas-no-son-una-ciencia_FVxAgfVY.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/crear-shortcut-de-pico-8-en-linux.md?astroPropagatedAssets":"chunks/crear-shortcut-de-pico-8-en-linux_V4tratzy.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/el-principio-del-universo.md?astroPropagatedAssets":"chunks/el-principio-del-universo_gMGlJUuY.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/firefox-developer-edition-para-ubuntu.md?astroPropagatedAssets":"chunks/firefox-developer-edition-para-ubuntu_pDaaPzho.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/i18n-en-astro.md?astroPropagatedAssets":"chunks/i18n-en-astro_aVc_qY10.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8.md?astroPropagatedAssets":"chunks/introduccion-al-desarrollo-de-videojuegos-con-pico-8_OPjtpt74.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/las-matematicas-no-son-una-ciencia.md?astroPropagatedAssets":"chunks/las-matematicas-no-son-una-ciencia_8S0j9_QN.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/crear-shortcut-de-pico-8-en-linux.md":"chunks/crear-shortcut-de-pico-8-en-linux_bQyPVjKq.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/el-principio-del-universo.md":"chunks/el-principio-del-universo_vOpynqmj.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/firefox-developer-edition-para-ubuntu.md":"chunks/firefox-developer-edition-para-ubuntu_CWLpB8iM.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/i18n-en-astro.md":"chunks/i18n-en-astro_sh6o4RYx.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8.md":"chunks/introduccion-al-desarrollo-de-videojuegos-con-pico-8_hL3fO_QZ.mjs","/home/tokyo/Dev/projects/personal-website/src/content/articles/las-matematicas-no-son-una-ciencia.md":"chunks/las-matematicas-no-son-una-ciencia_ikKe-cub.mjs","@astrojs/react/client.js":"_astro/client.0Kgyhlda.js","/astro/hoisted.js?q=0":"_astro/hoisted.l-JsOPk0.js","/home/tokyo/Dev/projects/personal-website/src/components/newsletter":"_astro/newsletter.LKzz6qPd.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/geist-sans-latin-400-normal.IGqU2zmP.woff2","/_astro/geist-sans-latin-700-normal.ZjfbSKeQ.woff2","/_astro/geist-sans-latin-900-normal.MjN-0ajw.woff2","/_astro/source-serif-pro-cyrillic-ext-400-normal.bvWPRLCJ.woff2","/_astro/source-serif-pro-cyrillic-400-normal.Cg1JsLOj.woff2","/_astro/source-serif-pro-greek-400-normal.pzXjlXv8.woff2","/_astro/source-serif-pro-vietnamese-400-normal.n7jrHMfD.woff2","/_astro/source-serif-pro-latin-ext-400-normal.EtmkRwLX.woff2","/_astro/source-serif-pro-latin-400-normal.Lp08Dp40.woff2","/_astro/source-serif-pro-cyrillic-ext-600-normal.R8ex5f1w.woff2","/_astro/source-serif-pro-cyrillic-600-normal.pfSNSjO8.woff2","/_astro/source-serif-pro-greek-600-normal.lL5r3ADk.woff2","/_astro/source-serif-pro-vietnamese-600-normal.6PeqdNTs.woff2","/_astro/source-serif-pro-latin-ext-600-normal.OAVLrWLO.woff2","/_astro/source-serif-pro-latin-600-normal.JjaotO2c.woff2","/_astro/source-serif-pro-cyrillic-ext-700-normal.Bcw2kpSY.woff2","/_astro/source-serif-pro-cyrillic-700-normal.pO4u6JTz.woff2","/_astro/source-serif-pro-greek-700-normal.hveJOJyv.woff2","/_astro/source-serif-pro-vietnamese-700-normal.SZoHlR0E.woff2","/_astro/source-serif-pro-latin-ext-700-normal.fNbW4M73.woff2","/_astro/source-serif-pro-latin-700-normal.OnyTTykB.woff2","/_astro/source-serif-pro-cyrillic-ext-900-normal.2_IMW10j.woff2","/_astro/source-serif-pro-cyrillic-900-normal.1hYzyYlZ.woff2","/_astro/source-serif-pro-greek-900-normal._reb5qmA.woff2","/_astro/source-serif-pro-vietnamese-900-normal.LFGJleEh.woff2","/_astro/source-serif-pro-latin-ext-900-normal.SrydsC-O.woff2","/_astro/source-serif-pro-latin-900-normal.bRrR6PLR.woff2","/_astro/geist-sans-latin-400-normal.TmiGTQNr.woff","/_astro/geist-sans-latin-900-normal.aNzud-s6.woff","/_astro/geist-sans-latin-700-normal.o0nH2Hhz.woff","/_astro/source-serif-pro-cyrillic-ext-400-normal.Nsnbzw0Q.woff","/_astro/source-serif-pro-cyrillic-400-normal.Nt3PV3Gf.woff","/_astro/source-serif-pro-greek-400-normal.C4-y4KGX.woff","/_astro/source-serif-pro-vietnamese-400-normal.Z5Vb2ReW.woff","/_astro/source-serif-pro-latin-ext-400-normal.m4v6ZiDd.woff","/_astro/source-serif-pro-latin-400-normal.rWk874X5.woff","/_astro/source-serif-pro-cyrillic-ext-600-normal.YJRoe6p3.woff","/_astro/source-serif-pro-cyrillic-600-normal.auS6UVEC.woff","/_astro/source-serif-pro-greek-600-normal.WfLEQgHy.woff","/_astro/source-serif-pro-vietnamese-600-normal.3-aLl9QI.woff","/_astro/source-serif-pro-latin-ext-600-normal.ToezPy2l.woff","/_astro/source-serif-pro-latin-600-normal.mIsCaZde.woff","/_astro/source-serif-pro-cyrillic-ext-700-normal.pTbMoxvg.woff","/_astro/source-serif-pro-cyrillic-700-normal.zEIAv4VF.woff","/_astro/source-serif-pro-greek-700-normal.ESJFd8Rh.woff","/_astro/source-serif-pro-vietnamese-700-normal.a0hMsswE.woff","/_astro/source-serif-pro-latin-ext-700-normal.DpnoCkne.woff","/_astro/source-serif-pro-latin-700-normal.iM67iMjh.woff","/_astro/source-serif-pro-cyrillic-ext-900-normal.w2fJNlQC.woff","/_astro/source-serif-pro-cyrillic-900-normal.xbLkKbj2.woff","/_astro/source-serif-pro-greek-900-normal.mkq4eTT2.woff","/_astro/source-serif-pro-vietnamese-900-normal.lcBIJwe0.woff","/_astro/source-serif-pro-latin-ext-900-normal.uDdtq8Bw.woff","/_astro/source-serif-pro-latin-900-normal.T5Rciy8Q.woff","/_astro/_article_.hTjHnQxK.css","/banner.png","/favicon.svg","/robots.txt","/vercel-theme.json","/_astro/client.0Kgyhlda.js","/_astro/hoisted.l-JsOPk0.js","/_astro/index.EzDzGMy6.js","/_astro/newsletter.LKzz6qPd.js","/fonts/cascadia-code-pl.woff2","/images/icons/logo.svg","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/bunny.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/corazon.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/editor-de-codigo.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/editor-de-sprites.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/ejecutar-programa.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/ejemplo-rectangulo.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/ejemplo-sprite.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/hola-mundo.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/letras-reservadas.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/mini-cheat-sheet.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/screenshot-de-poom.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/sfx-1.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/sfx-2.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/sistema-de-coordenadas.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/squashy.png","/images/articles/introduccion-al-desarrollo-de-videojuegos-con-pico-8/terminal-pico8.png","/api/addContact.json","/index.html","/rss.xml"],"buildFormat":"directory"});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
