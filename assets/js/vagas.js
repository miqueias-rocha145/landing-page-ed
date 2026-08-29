(() => {
  const source = Array.isArray(window.ED_VAGAS) ? window.ED_VAGAS : [];
  const grid = document.getElementById('jobs-grid');
  const filters = document.getElementById('jobs-filters');
  const localSelect = document.getElementById('filter-local');
  const contractSelect = document.getElementById('filter-contract');
  const clearButton = document.getElementById('clear-filters');
  const noResults = document.getElementById('jobs-no-results');
  const emptyState = document.getElementById('jobs-empty');
  const counter = document.querySelector('[data-job-count]');

  if (!grid || !filters || !localSelect || !contractSelect) return;

  const normalize = (value) => String(value ?? '').trim();
  const prohibitedContent = /\b(?:sal[aá]rio|remunera(?:ç|c)[aã]o|a combinar)\b/i;
  const normalizeList = (value) => Array.isArray(value)
    ? value.map(normalize).filter(Boolean).slice(0, 4)
    : [];

  const parseDate = (value, endOfDay = false) => {
    const text = normalize(value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
    const date = new Date(`${text}T${endOfDay ? '23:59:59.999' : '00:00:00'}`);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const today = new Date();
  const seenCodes = new Set();
  const jobs = source
    .filter((job) => job && job.ativa === true)
    .map((job) => ({
      codigo: normalize(job.codigo),
      cargo: normalize(job.cargo),
      local: normalize(job.local),
      contrato: normalize(job.contrato),
      jornada: normalize(job.jornada),
      responsabilidades: normalizeList(job.responsabilidades),
      requisitos: normalizeList(job.requisitos),
      imagemFeed: normalize(job.imagemFeed),
      imagemStory: normalize(job.imagemStory),
      publicadaEm: normalize(job.publicadaEm),
      expiraEm: normalize(job.expiraEm)
    }))
    .filter((job) => {
      if (!job.codigo || !job.cargo || !job.local || !job.contrato || !job.imagemFeed) return false;
      if (!parseDate(job.publicadaEm)) return false;
      const expiresAt = parseDate(job.expiraEm, true);
      if (job.expiraEm && !expiresAt) return false;
      if (prohibitedContent.test(JSON.stringify(job))) return false;
      return !expiresAt || expiresAt >= today;
    })
    .sort((a, b) => {
      const dateA = parseDate(a.publicadaEm)?.getTime() ?? 0;
      const dateB = parseDate(b.publicadaEm)?.getTime() ?? 0;
      return dateB - dateA;
    })
    .filter((job) => {
      if (seenCodes.has(job.codigo)) return false;
      seenCodes.add(job.codigo);
      return true;
    })
    .slice(0, 24);

  const uniqueSorted = (items) => [...new Set(items)].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const addOptions = (select, values) => {
    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  };

  addOptions(localSelect, uniqueSorted(jobs.map((job) => job.local)));
  addOptions(contractSelect, uniqueSorted(jobs.map((job) => job.contrato)));

  const createFallback = (job) => {
    const fallback = document.createElement('div');
    fallback.className = 'job-card__fallback';
    fallback.hidden = true;

    const label = document.createElement('span');
    label.className = 'job-card__fallback-label';
    label.textContent = 'Vaga aberta';

    const title = document.createElement('strong');
    title.textContent = job.cargo;

    const details = document.createElement('span');
    details.textContent = [job.local, job.contrato, job.jornada].filter(Boolean).join(' • ');

    const action = document.createElement('span');
    action.className = 'job-card__fallback-action';
    action.textContent = 'Candidate-se pelo WhatsApp';

    fallback.append(label, title, details, action);
    return fallback;
  };

  const createJobCard = (job) => {
    const article = document.createElement('article');
    article.className = 'job-card reveal';

    const message = `Olá! Tenho interesse na vaga ${job.codigo} — ${job.cargo}. Gostaria de receber mais informações.`;
    const link = document.createElement('a');
    link.className = 'job-card__link';
    link.href = `https://wa.me/557381830606?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', `Candidatar-se à vaga ${job.codigo}, ${job.cargo}, pelo WhatsApp`);

    const image = document.createElement('img');
    image.className = 'job-card__image';
    image.src = job.imagemFeed;
    image.width = 1080;
    image.height = 1350;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.alt = `Arte da vaga ${job.codigo}: ${job.cargo}, em ${job.local}, contrato ${job.contrato}${job.jornada ? `, ${job.jornada}` : ''}.`;

    const fallback = createFallback(job);
    image.addEventListener('error', () => {
      image.hidden = true;
      fallback.hidden = false;
    }, { once: true });

    const description = document.createElement('span');
    description.className = 'visually-hidden';
    const responsibilities = job.responsabilidades.length
      ? ` Principais atividades: ${job.responsabilidades.join('; ')}.`
      : '';
    const requirements = job.requisitos.length
      ? ` Requisitos: ${job.requisitos.join('; ')}.`
      : '';
    description.textContent = `${job.cargo}. ${job.local}. ${job.contrato}. ${job.jornada}.${responsibilities}${requirements}`;

    link.append(image, fallback, description);
    article.append(link);
    return article;
  };

  const setCount = (visible, total) => {
    if (!counter) return;
    if (total === 0) {
      counter.textContent = 'Nenhuma oportunidade disponível';
      return;
    }
    if (visible === total) {
      counter.textContent = total === 1 ? '1 oportunidade disponível' : `${total} oportunidades disponíveis`;
      return;
    }
    counter.textContent = visible === 1 ? '1 vaga encontrada' : `${visible} vagas encontradas`;
  };

  const render = () => {
    const selectedLocal = localSelect.value;
    const selectedContract = contractSelect.value;
    const visibleJobs = jobs.filter((job) =>
      (!selectedLocal || job.local === selectedLocal)
      && (!selectedContract || job.contrato === selectedContract));

    grid.replaceChildren(...visibleJobs.map(createJobCard));
    setCount(visibleJobs.length, jobs.length);

    const hasJobs = jobs.length > 0;
    const hasResults = visibleJobs.length > 0;
    filters.hidden = !hasJobs;
    grid.hidden = !hasJobs || !hasResults;
    emptyState.hidden = hasJobs;
    noResults.hidden = !hasJobs || hasResults;

    if (window.lucide) window.lucide.createIcons({ 'stroke-width': 1.8 });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(() => {
        grid.querySelectorAll('.reveal').forEach((card, index) => {
          card.style.setProperty('--delay', `${Math.min(index * 70, 350)}ms`);
          card.classList.add('is-visible');
        });
      });
    } else {
      grid.querySelectorAll('.reveal').forEach((card) => card.classList.add('is-visible'));
    }
  };

  const clearFilters = () => {
    localSelect.value = '';
    contractSelect.value = '';
    render();
  };

  localSelect.addEventListener('change', render);
  contractSelect.addEventListener('change', render);
  clearButton?.addEventListener('click', clearFilters);
  document.querySelectorAll('[data-clear-filters]').forEach((button) => button.addEventListener('click', clearFilters));

  render();
})();
