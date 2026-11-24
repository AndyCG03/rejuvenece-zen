// Pantalla de carga: un ensō (el círculo del logo) se dibuja en verde y dorado alrededor
// del logo mientras el sitio carga. Va en el HTML estático, así que aparece al instante,
// antes de que cargue JavaScript. Se retira con el evento `load` (máx. 4 s).

const dismiss = `(function(){
  var d=document,root=d.documentElement,start=Date.now(),MIN=1600,MAX=4000,done=false;
  root.classList.add('is-loading');
  function hide(){
    if(done)return;done=true;
    var el=d.getElementById('zen-loader');
    root.classList.remove('is-loading');
    if(!el)return;
    el.classList.add('is-done');
    setTimeout(function(){el.parentNode&&el.parentNode.removeChild(el);},1100);
  }
  function ready(){setTimeout(hide,Math.max(0,MIN-(Date.now()-start)));}
  if(d.readyState==='complete')ready();else window.addEventListener('load',ready);
  setTimeout(hide,MAX);
})();`;

export default function Loader() {
  return (
    <>
      <div id="zen-loader" className="zl" role="status" aria-live="polite" aria-label="Cargando Rejuvenece Zen Spa">
        <div className="zl-glow" aria-hidden />
        <div className="zl-mark">
          <svg className="zl-enso" viewBox="0 0 200 200" aria-hidden>
            <defs>
              <linearGradient id="zl-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#3f5f3b" />
                <stop offset=".55" stopColor="#7d8f5f" />
                <stop offset="1" stopColor="#c9a86a" />
              </linearGradient>
            </defs>
            <circle className="zl-track" cx="100" cy="100" r="92" />
            <circle className="zl-stroke" cx="100" cy="100" r="92" pathLength={100} />
          </svg>
          <img className="zl-logo" src="/assets/imagenes/logo-cuadrado.png" alt="" width={500} height={400} />
        </div>
        <p className="zl-text">Respira. <em>Llegaste a tu refugio.</em></p>
        <span className="zl-bar" aria-hidden><i /></span>
      </div>
      <noscript><style>{`#zen-loader{display:none}`}</style></noscript>
      <script dangerouslySetInnerHTML={{ __html: dismiss }} />
    </>
  );
}
