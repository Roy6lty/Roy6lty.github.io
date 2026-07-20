document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.primary-nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const revealItems = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    const githubGrid = document.querySelector('#github-projects');
    if (githubGrid) loadRepositories(githubGrid);

    setupCosmicScroll();
});

function setupCosmicScroll() {
    const meter = document.createElement('div');
    meter.className = 'scroll-meter';
    meter.setAttribute('aria-hidden', 'true');
    meter.innerHTML = '<span></span>';
    document.body.appendChild(meter);

    const shootingStar = document.querySelector('.shooting-star');
    let previousScroll = window.scrollY;
    let lastStarTime = 0;

    const updateScrollState = () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
        document.body.style.setProperty('--scroll-progress', progress.toFixed(3));
        document.body.style.setProperty('--paper', colorBlend(getTheme().paperStart, getTheme().paperEnd, progress));
        document.body.style.setProperty('--paper-deep', colorBlend(getTheme().deepStart, getTheme().deepEnd, progress));
        if (document.body.classList.contains('page-projects')) {
            document.body.style.setProperty('--moon-offset', `${Math.round(progress * -24)}px`);
        }
    };

    window.addEventListener('scroll', () => {
        updateScrollState();
        const now = Date.now();
        if (shootingStar && Math.abs(window.scrollY - previousScroll) > 12 && now - lastStarTime > 2200) {
            shootingStar.classList.remove('is-travelling');
            void shootingStar.offsetWidth;
            shootingStar.classList.add('is-travelling');
            lastStarTime = now;
        }
        previousScroll = window.scrollY;
    }, { passive: true });

    updateScrollState();
}

function getTheme() {
    const page = document.body.className;
    if (page.includes('page-about')) {
        return { paperStart: '#f5f3ee', paperEnd: '#f3e5bd', deepStart: '#ebe8df', deepEnd: '#e8d8a9' };
    }
    if (page.includes('page-projects')) {
        return { paperStart: '#f5f3ee', paperEnd: '#e4eaf3', deepStart: '#ebe8df', deepEnd: '#d8e0ec' };
    }
    if (page.includes('page-contact')) {
        return { paperStart: '#f5f3ee', paperEnd: '#f0e5e1', deepStart: '#ebe8df', deepEnd: '#ead9d4' };
    }
    return { paperStart: '#f5f3ee', paperEnd: '#e8e9f3', deepStart: '#ebe8df', deepEnd: '#dfe1ed' };
}

function colorBlend(start, end, amount) {
    const startRgb = hexToRgb(start);
    const endRgb = hexToRgb(end);
    const channels = startRgb.map((channel, index) => Math.round(channel + (endRgb[index] - channel) * amount));
    return `rgb(${channels.join(', ')})`;
}

function hexToRgb(hex) {
    return [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
}

const featuredRepositoryOrder = [
    'Fastapi-TodoApp',
    'Stocka-Ecommerce',
    'golang-projects',
    'handyhive',
    'inventory-management',
    'Hardware-Pricing-Tool'
];

const repositoryNotes = {
    'Fastapi-TodoApp': 'Backend project with FastAPI, authentication, Celery, Redis, and SQLite.',
    'Stocka-Ecommerce': 'Full-stack commerce project with Flask, MongoDB, Redis, and Python.',
    'golang-projects': 'A public Go code archive showing continued systems and language practice.',
    handyhive: 'A Python project from my application-building archive.',
    'inventory-management': 'An inventory management tool built as a practical application project.',
    'Hardware-Pricing-Tool': 'A practical pricing tool from my public application archive.'
};

async function loadRepositories(container) {
    try {
        const response = await fetch('https://api.github.com/users/Roy6lty/repos?sort=updated&per_page=100');
        if (!response.ok) throw new Error('GitHub request failed');

        const repositories = await response.json();
        const publicRepositories = repositories.filter((repo) => !repo.fork).sort((first, second) => {
            const firstPriority = featuredRepositoryOrder.indexOf(first.name);
            const secondPriority = featuredRepositoryOrder.indexOf(second.name);
            if (firstPriority !== -1 || secondPriority !== -1) {
                return (firstPriority === -1 ? 99 : firstPriority) - (secondPriority === -1 ? 99 : secondPriority);
            }
            return new Date(second.pushed_at) - new Date(first.pushed_at);
        }).slice(0, 6);

        if (!publicRepositories.length) throw new Error('No public repositories found');

        container.innerHTML = publicRepositories.map((repo, index) => {
            const topics = [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 3);
            const note = repositoryNotes[repo.name] || repo.description || 'A public project and part of my ongoing learning archive.';
            return `
            <article class="repo-card">
                <span class="repo-index">${String(index + 2).padStart(2, '0')}</span>
                <div>
                    <p class="repo-type">${escapeHtml(repo.language || 'Repository')}</p>
                    <h3>${escapeHtml(repo.name.replace(/-/g, ' '))}</h3>
                    <p>${escapeHtml(note)}</p>
                    <div class="skill-tags repo-tags">${topics.map((topic) => `<span>${escapeHtml(topic)}</span>`).join('')}</div>
                    <a class="repo-link" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer">View repository <span aria-hidden="true">&#8599;</span></a>
                </div>
            </article>
        `; }).join('');
    } catch {
        container.innerHTML = `
            <article class="repo-card repo-loading">
                <span class="repo-index">02</span>
                <div>
                    <p class="repo-type">GitHub archive</p>
                    <h3>Browse the public repository archive.</h3>
                    <p>See current projects, experiments, and work in progress on my GitHub profile.</p>
                    <a class="repo-link" href="https://github.com/Roy6lty" target="_blank" rel="noreferrer">Open GitHub profile <span aria-hidden="true">&#8599;</span></a>
                </div>
            </article>
        `;
    }
}

function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    })[character]);
}
