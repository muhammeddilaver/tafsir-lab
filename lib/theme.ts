export const THEME_KEY = "theme";

/**
 * Runs in <head> before first paint: an explicit choice from an earlier visit
 * is put back on <html> so the page never flashes the system theme first.
 * With nothing stored the attribute stays off and the CSS follows the system.
 */
export const themeBootstrap = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
