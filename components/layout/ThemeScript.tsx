/**
 * Inline script injected before first paint to apply the saved theme
 * and prevent flash of wrong theme on load.
 * Runs synchronously in <head> — must stay tiny and dependency-free.
 */

const THEME_INIT = `(function(){try{
  var t=localStorage.getItem('theme');
  var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(t==='dark'||(t===null&&d))document.documentElement.setAttribute('data-theme','dark');
  else if(t==='light')document.documentElement.setAttribute('data-theme','light');
}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />;
}
