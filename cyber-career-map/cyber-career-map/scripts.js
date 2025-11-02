async function loadData() {
  const res = await fetch('data/roles.json');
  return res.json();
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function matchesQuery(role, q, domain) {
  const hay = (role.title + ' ' + role.domain + ' ' + role.summary + ' ' + role.skills.join(' ') + ' ' + role.certs.join(' ')).toLowerCase();
  const okQ = !q || hay.includes(q.toLowerCase());
  const okD = !domain || role.domain === domain;
  return okQ && okD;
}

function render(roles, q='', domain='') {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  roles.filter(r => matchesQuery(r, q, domain)).forEach(role => {
    const tpl = document.getElementById('roleCard').content.cloneNode(true);
    tpl.querySelector('.role-title').textContent = role.title;
    tpl.querySelector('.role-domain').textContent = role.domain;
    tpl.querySelector('.role-summary').textContent = role.summary;

    const skills = tpl.querySelector('.role-skills');
    role.skills.forEach(s => skills.appendChild(el('span', 'tag', s)));
    const certs = tpl.querySelector('.role-certs');
    role.certs.forEach(c => certs.appendChild(el('span', 'tag', c)));
    const links = tpl.querySelector('.role-links');
    role.links.forEach(l => {
      const li = el('li', null, '');
      const a = el('a', 'underline', l.label);
      a.href = l.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      li.appendChild(a); links.appendChild(li);
    });

    grid.appendChild(tpl);
  });
}

(async function(){
  const data = await loadData();
  const search = document.getElementById('search');
  const domainFilter = document.getElementById('domainFilter');

  function update() { render(data.roles, search.value, domainFilter.value); }
  search.addEventListener('input', update);
  domainFilter.addEventListener('change', update);

  document.getElementById('randomize').addEventListener('click', () => {
    const r = data.roles[Math.floor(Math.random() * data.roles.length)];
    search.value = r.title.split(' ')[0];
    update();
  });

  update();
})();