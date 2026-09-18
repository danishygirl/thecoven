(() => {
  const data = window.COVEN_CONTENT;
  const app = document.getElementById('app');
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.menu-toggle');

  const routes = ['home', 'personagens', 'desafios', 'mapa', 'episodios', 'deck', 'bestiario'];
  const state = { character: 0, location: 0, episode: 0, wonder: 0, beast: 0 };

  const safeRoute = () => {
    const hash = location.hash.replace('#', '') || 'home';
    return routes.includes(hash) ? hash : 'home';
  };

  const go = (route) => { location.hash = route; };
  const formatXp = (n) => new Intl.NumberFormat('pt-BR').format(n);

  function hydrateShell() {
    document.title = data.meta.title;
    const footer = document.getElementById('footer-season');
    if (footer) footer.textContent = `${data.meta.season} · ${data.meta.city}`;
  }

  function setActiveNav(route) {
    document.querySelectorAll('[data-route]').forEach(el => el.classList.toggle('active', el.dataset.route === route));
  }

  function renderHome() {
    const h = data.home;
    return `
      <section class="view home-view">
        <div class="hero-backdrop"></div>
        <div class="hero-content">
          <div class="hero-copy ornate-frame">
            <h1>${h.title}</h1>
            <p>${h.body}</p>
            <div class="hero-actions">
              <button class="btn primary" data-go="episodios">${h.primaryCta}</button>
              <button class="btn" data-go="personagens">${h.secondaryCta}</button>
              <button class="btn" data-go="bestiario">Abrir bestiário</button>
            </div>
          </div>
          <div class="quick-stack">
            ${h.quickLinks.map(q => `
              <button class="quick-card ornate-frame" data-go="${q.route}">
                <span><small>${q.label}</small><strong>${q.value}</strong></span><b>›</b>
              </button>
            `).join('')}
          </div>
        </div>
      </section>`;
  }

  function characterDetail(c) {
    return `
      <img class="portrait-mini" src="${c.image}" alt="Retrato estilizado de ${c.name}">
      <div class="role">${c.role}</div>
      <h2>${c.name}</h2>
      <div class="badges"><span class="badge">${c.faction}</span><span class="badge">${formatXp(c.xp)} XP</span><span class="badge">${c.status}</span></div>
      <blockquote>“${c.quote}”</blockquote>
      <p>${c.bio}</p>
      <div class="badges">${c.traits.map(t => `<span class="badge">${t}</span>`).join('')}</div>
      <div class="secret"><strong>Informação do narrador</strong><p>${c.secret}</p></div>`;
  }

  function renderCharacters() {
    return `
      <section class="view">
        <header class="section-head"><h1 class="page-title">Personagens</h1><div class="hud-number">${String(data.characters.length).padStart(2,'0')}</div></header>
        <div class="split-layout">
          <div class="character-grid">
            ${data.characters.map((c,i) => `
              <article class="character-card ornate-frame ${i===state.character?'active':''}" data-character="${i}">
                <img src="${c.image}" alt="Retrato estilizado de ${c.name}">
                <div class="character-info"><small>${c.status}</small><h3>${c.name}</h3><p>${c.role}</p></div>
              </article>`).join('')}
          </div>
          <aside class="panel detail-panel ornate-frame" id="character-detail">${characterDetail(data.characters[state.character])}</aside>
        </div>
      </section>`;
  }

  function renderChallenges() {
    return `
      <section class="view">
        <header class="section-head"><h1 class="page-title">Desafios</h1><div class="hud-number">${formatXp(data.meta.xp)} XP</div></header>
        <div class="challenge-grid">
          ${data.challenges.map(c => {
            const pct = Math.min(100, Math.round((c.progress / c.goal) * 100));
            return `<article class="challenge-card ornate-frame">
              <div class="challenge-tier"><span>${c.tier}</span><span>+${c.xp} XP</span></div>
              <h3>${c.title}</h3><p>${c.description}</p>
              <div class="progress" aria-label="Progresso ${c.progress} de ${c.goal}"><span style="width:${pct}%"></span></div>
              <div class="challenge-foot"><span>${c.progress} / ${c.goal}</span><span>${pct}%</span></div>
              <div class="reward">${c.reward}</div>
            </article>`;
          }).join('')}
        </div>
      </section>`;
  }

  function locationStage(l) {
    return `<img src="${l.image}" alt="Ilustração de ${l.name}"><div class="location-overlay"><div><h2>${l.name}</h2><p>${l.description}</p><div class="badges">${l.hooks.map(h => `<span class="badge">${h}</span>`).join('')}</div></div><div class="danger"><small>RISCO</small><strong>${l.danger}</strong></div></div>`;
  }

  function renderMap() {
    return `
      <section class="view">
        <header class="section-head"><h1 class="page-title">Mapa</h1><div class="hud-number">${String(data.locations.length).padStart(2,'0')}</div></header>
        <div class="map-layout">
          <div class="location-list">${data.locations.map((l,i) => `<button class="location-item ornate-frame ${i===state.location?'active':''}" data-location="${i}"><small>${l.type}</small><strong>${l.name}</strong></button>`).join('')}</div>
          <div class="map-stage ornate-frame" id="map-stage">${locationStage(data.locations[state.location])}</div>
        </div>
      </section>`;
  }

  function episodeDetail(e) {
    const locked = e.status !== 'DISPONÍVEL';
    return `<h2>${e.title}</h2><div class="playbar"><button class="play" ${locked?'disabled':''} aria-label="${locked?'Episódio bloqueado':'Reproduzir narração'}">${locked?'×':'▶'}</button><div class="wave"><span></span></div><small>${e.duration}</small></div><p>${e.summary}</p><p class="transcript">${e.transcript}</p>`;
  }

  function renderEpisodes() {
    return `
      <section class="view">
        <header class="section-head"><h1 class="page-title">Episódios</h1><div class="hud-number">REC</div></header>
        <div class="episodes">
          <div class="episode-list">${data.episodes.map((e,i)=>`<button class="episode-row ornate-frame ${i===state.episode?'active':''}" data-episode="${i}"><span class="ep-num">${e.number}</span><span><h3>${e.title}</h3><small>${e.duration}</small></span><span class="status">${e.status}</span></button>`).join('')}</div>
          <aside class="panel recording ornate-frame" id="recording">${episodeDetail(data.episodes[state.episode])}</aside>
        </div>
      </section>`;
  }

  function wonderDetail(w) {
    return `<div class="big-symbol">${w.symbol}</div><h2>${w.name}</h2><p>${w.description}</p><div class="statline"><span>Prova</span><strong>${w.trial}</strong></div><div class="statline"><span>Custo</span><strong>${w.cost}</strong></div><div class="statline"><span>Nível</span><strong>${w.level}</strong></div>`;
  }

  function renderDeck() {
    return `
      <section class="view">
        <header class="section-head"><h1 class="page-title">Sete Maravilhas</h1><div class="hud-number">7 / 7</div></header>
        <div class="deck-shell">
          <div class="deck-grid">${data.wonders.map((w,i)=>`<article class="wonder-card ornate-frame ${i===state.wonder?'active':''}" data-wonder="${i}"><span class="card-rarity">${w.rarity}</span><span class="card-symbol">${w.symbol}</span><span class="card-name">${w.name}</span></article>`).join('')}</div>
          <aside class="panel deck-detail ornate-frame" id="deck-detail">${wonderDetail(data.wonders[state.wonder])}</aside>
        </div>
      </section>`;
  }

  function beastDetail(b) {
    return `
      <div class="bestiary-feature-image ornate-frame"><img src="${b.image}" alt="${b.name}"></div>
      <div class="bestiary-copy">
        <h2>${b.name}</h2>
        <div class="beast-row"><span>Nome</span><strong>${b.name}</strong></div>
        <div class="beast-row"><span>Espécie</span><strong>${b.species}</strong></div>
        <div class="beast-row beast-description"><span>Descrição</span><p>${b.description}</p></div>
        <div class="beast-row"><span>Ataque</span><div><strong>${b.attack}</strong><p>${b.attackText}</p></div></div>
        <div class="beast-row"><span>Defesa</span><div><strong>${b.defense}</strong><p>${b.defenseText}</p></div></div>
        <div class="beast-row"><span>Poder</span><div><strong>${b.power}</strong><p>${b.powerText}</p></div></div>
      </div>`;
  }

  function renderBestiary() {
    return `
      <section class="view bestiary-view">
        <header class="section-head bestiary-head"><h1 class="page-title">Bestiário</h1><div class="hud-number">${String(data.bestiary.length).padStart(2,'0')}</div></header>
        <div class="bestiary-layout">
          <div class="bestiary-grid">
            ${data.bestiary.map((b,i)=>`
              <button class="beast-card ornate-frame ${i===state.beast?'active':''}" data-beast="${i}" aria-label="Abrir ficha de ${b.name}">
                <img src="${b.image}" alt="${b.name}">
                <span class="beast-card-name">${b.name}</span>
              </button>`).join('')}
          </div>
          <aside class="bestiary-detail ornate-frame" id="bestiary-detail">${beastDetail(data.bestiary[state.beast])}</aside>
        </div>
      </section>`;
  }

  function bind() {
    document.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => go(el.dataset.go)));

    document.querySelectorAll('[data-character]').forEach(el => el.addEventListener('click', () => {
      state.character = +el.dataset.character;
      document.querySelectorAll('[data-character]').forEach((x,i)=>x.classList.toggle('active', i===state.character));
      document.getElementById('character-detail').innerHTML = characterDetail(data.characters[state.character]);
    }));

    document.querySelectorAll('[data-location]').forEach(el => el.addEventListener('click', () => {
      state.location = +el.dataset.location;
      document.querySelectorAll('[data-location]').forEach((x,i)=>x.classList.toggle('active', i===state.location));
      document.getElementById('map-stage').innerHTML = locationStage(data.locations[state.location]);
    }));

    document.querySelectorAll('[data-episode]').forEach(el => el.addEventListener('click', () => {
      state.episode = +el.dataset.episode;
      document.querySelectorAll('[data-episode]').forEach((x,i)=>x.classList.toggle('active', i===state.episode));
      document.getElementById('recording').innerHTML = episodeDetail(data.episodes[state.episode]);
      bindPlay();
    }));

    document.querySelectorAll('[data-wonder]').forEach(el => el.addEventListener('click', () => {
      state.wonder = +el.dataset.wonder;
      document.querySelectorAll('[data-wonder]').forEach((x,i)=>x.classList.toggle('active', i===state.wonder));
      document.getElementById('deck-detail').innerHTML = wonderDetail(data.wonders[state.wonder]);
    }));

    document.querySelectorAll('[data-beast]').forEach(el => el.addEventListener('click', () => {
      state.beast = +el.dataset.beast;
      document.querySelectorAll('[data-beast]').forEach((x,i)=>x.classList.toggle('active', i===state.beast));
      document.getElementById('bestiary-detail').innerHTML = beastDetail(data.bestiary[state.beast]);
    }));

    bindPlay();
  }

  function bindPlay() {
    const play = document.querySelector('.play:not([disabled])');
    if (!play) return;
    play.addEventListener('click', () => {
      const wave = play.parentElement.querySelector('.wave');
      const isPlaying = wave.classList.toggle('playing');
      play.textContent = isPlaying ? 'Ⅱ' : '▶';
      if (!isPlaying) {
        wave.querySelector('span').style.transition = 'none';
        wave.querySelector('span').style.width = '0';
        requestAnimationFrame(()=> { wave.querySelector('span').style.transition = ''; });
      }
    });
  }

  function render() {
    const route = safeRoute();
    setActiveNav(route);
    const views = {
      home: renderHome,
      personagens: renderCharacters,
      desafios: renderChallenges,
      mapa: renderMap,
      episodios: renderEpisodes,
      deck: renderDeck,
      bestiario: renderBestiary
    };
    app.innerHTML = views[route]();
    bind();
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    window.scrollTo({ top:0, behavior:'instant' });
  }

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  window.addEventListener('hashchange', render);
  hydrateShell();
  render();
})();
