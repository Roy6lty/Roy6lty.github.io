const topology = {
    'public-a-test': { tier: 'public', network: 'public_a', subnet: '10.10.1.0/24', address: '10.10.1.10', gateway: '10.10.1.1', description: 'Alpine 3.20 container with NET_ADMIN on the public edge.' },
    'public-b-test': { tier: 'public', network: 'public_b', subnet: '10.10.2.0/24', address: '10.10.2.10', gateway: '10.10.2.1', description: 'Second public bridge for testing edge segmentation.' },
    'app-a-test': { tier: 'app', network: 'app_a', subnet: '10.10.11.0/24', address: '10.10.11.10', gateway: '10.10.11.1', description: 'Internal application container on the first app bridge.' },
    'app-b-test': { tier: 'app', network: 'app_b', subnet: '10.10.12.0/24', address: '10.10.12.10', gateway: '10.10.12.1', description: 'Internal application container on the second app bridge.' },
    'db-a-test': { tier: 'db', network: 'db_a', subnet: '10.10.21.0/24', address: '10.10.21.10', gateway: '10.10.21.1', description: 'Internal database-tier container on the first DB bridge.' },
    'db-b-test': { tier: 'db', network: 'db_b', subnet: '10.10.22.0/24', address: '10.10.22.10', gateway: '10.10.22.1', description: 'Internal database-tier container on the second DB bridge.' }
};

const tierColors = { public: 0xff795d, app: 0xd9ff55, db: 0xa9c8ff };

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('reveal-ready');
    setupMenu();
    setupReveal();
    setupScrollMeter();
    setupStorySteps();
    normalizeSeriesRepositoryLinks();
    setupNetworkInspector();
    setupNetworkScene();
    setupLoadTestScene();
    const githubGrid = document.querySelector('#github-projects');
    if (githubGrid) loadRepositories(githubGrid);
});

function normalizeSeriesRepositoryLinks() {
    document.querySelectorAll('a[href="https://github.com/Roy6lty/ecommerce-k8-lab"]').forEach((link) => {
        link.href = 'https://github.com/Roy6lty/Network-series';
        if (link.textContent.includes('Open the lab repo') && link.firstChild) link.firstChild.nodeValue = 'Open the series repo ';
    });
}

function setupMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.primary-nav');
    if (!menuToggle || !nav) return;

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

function setupReveal() {
    const revealItems = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
}

function setupScrollMeter() {
    const meter = document.createElement('div');
    meter.className = 'scroll-meter';
    meter.setAttribute('aria-hidden', 'true');
    meter.innerHTML = '<span></span>';
    document.body.appendChild(meter);

    const updateScrollState = () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
        document.body.style.setProperty('--scroll-progress', progress.toFixed(3));
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
}

function setupStorySteps() {
    const section = document.querySelector('[data-story-section]');
    const steps = [...document.querySelectorAll('[data-story-step]')];
    if (!section || !steps.length) return;
    if (!('IntersectionObserver' in window)) {
        steps.forEach((step) => step.classList.add('is-current'));
        section.style.setProperty('--story-progress', '1');
        return;
    }

    const setActiveStep = (activeStep) => {
        steps.forEach((step, index) => step.classList.toggle('is-current', index === activeStep));
        section.style.setProperty('--story-progress', ((activeStep + 1) / steps.length).toFixed(2));
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveStep(steps.indexOf(entry.target));
        });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    steps.forEach((step) => observer.observe(step));
    setActiveStep(0);
}

function setupNetworkInspector() {
    const detail = document.querySelector('#network-detail');
    const buttons = document.querySelectorAll('.node-button');
    if (!detail || !buttons.length) return;

    const selectNode = (name) => {
        const node = topology[name];
        if (!node) return;
        buttons.forEach((button) => button.classList.toggle('is-selected', button.dataset.node === name));
        detail.innerHTML = `<span class="detail-label">selected container</span><h3>${name}</h3><p>${node.description}</p><div class="detail-row"><span>network</span><strong>${node.network}</strong></div><div class="detail-row"><span>address</span><strong>${node.address}</strong></div><div class="detail-row"><span>gateway</span><strong>${node.gateway}</strong></div>`;
    };

    buttons.forEach((button) => button.addEventListener('click', () => selectNode(button.dataset.node)));
    window.addEventListener('network-node-select', (event) => selectNode(event.detail));
}

async function setupNetworkScene() {
    const canvas = document.querySelector('#network-canvas');
    const status = document.querySelector('#network-status');
    if (!canvas) return;

    try {
        const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.177.0/build/three.module.js');
        createNetworkScene(THREE, canvas, status);
    } catch (error) {
        if (status) status.textContent = 'static map / WebGL unavailable';
        canvas.style.display = 'none';
    }
}

async function setupLoadTestScene() {
    const canvas = document.querySelector('#load-test-canvas');
    const status = document.querySelector('#load-scene-status');
    if (!canvas) return;

    try {
        const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.177.0/build/three.module.js');
        createLoadTestScene(THREE, canvas, status);
    } catch (error) {
        if (status) status.textContent = 'static concept / WebGL unavailable';
        canvas.style.display = 'none';
    }
}

function createNetworkScene(THREE, canvas, status) {
    const stage = canvas.closest('.network-stage');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
    camera.position.set(0, 0, 8.8);

    const topologyGroup = new THREE.Group();
    scene.add(topologyGroup);
    const meshByName = new Map();
    const pulseMeshes = [];
    const positions = {
        'public-a-test': [-2.45, 1.65, .25], 'public-b-test': [2.45, 1.65, -.15],
        'app-a-test': [-2.45, 0, .1], 'app-b-test': [2.45, 0, -.2],
        'db-a-test': [-2.45, -1.65, .2], 'db-b-test': [2.45, -1.65, -.1]
    };
    const hubs = { public: [0, 1.65, 0], app: [0, 0, 0], db: [0, -1.65, 0] };

    addStarField(THREE, scene);
    addTierRows(THREE, topologyGroup);

    Object.entries(topology).forEach(([name, node]) => {
        const position = positions[name];
        const hub = hubs[node.tier];
        const color = tierColors[node.tier];
        const nodeMesh = new THREE.Mesh(new THREE.SphereGeometry(.17, 20, 20), new THREE.MeshBasicMaterial({ color }));
        nodeMesh.position.set(...position);
        nodeMesh.userData.name = name;
        topologyGroup.add(nodeMesh);
        meshByName.set(name, nodeMesh);

        const glow = new THREE.Mesh(new THREE.SphereGeometry(.32, 16, 16), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .11 }));
        glow.position.copy(nodeMesh.position);
        topologyGroup.add(glow);

        const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...position), new THREE.Vector3(...hub)]);
        topologyGroup.add(new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .54 })));

        const pulse = new THREE.Mesh(new THREE.SphereGeometry(.045, 10, 10), new THREE.MeshBasicMaterial({ color }));
        pulse.userData = { from: new THREE.Vector3(...position), to: new THREE.Vector3(...hub), offset: Math.random() };
        topologyGroup.add(pulse);
        pulseMeshes.push(pulse);
    });

    Object.entries(hubs).forEach(([tier, position]) => {
        const color = tierColors[tier];
        const hub = new THREE.Mesh(new THREE.OctahedronGeometry(.23, 0), new THREE.MeshBasicMaterial({ color, wireframe: true }));
        hub.position.set(...position);
        topologyGroup.add(hub);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(.37, .008, 8, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .65 }));
        ring.position.set(...position);
        ring.rotation.x = Math.PI / 2;
        topologyGroup.add(ring);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let moved = false;
    let lastPointer = { x: 0, y: 0 };

    canvas.addEventListener('pointerdown', (event) => {
        isDragging = true;
        moved = false;
        lastPointer = { x: event.clientX, y: event.clientY };
        canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        const deltaX = event.clientX - lastPointer.x;
        const deltaY = event.clientY - lastPointer.y;
        if (Math.abs(deltaX) + Math.abs(deltaY) > 3) moved = true;
        topologyGroup.rotation.y += deltaX * .006;
        topologyGroup.rotation.x = Math.max(-.35, Math.min(.35, topologyGroup.rotation.x + deltaY * .003));
        lastPointer = { x: event.clientX, y: event.clientY };
    });
    canvas.addEventListener('pointerup', (event) => {
        if (!moved) {
            const bounds = canvas.getBoundingClientRect();
            pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObjects([...meshByName.values()])[0];
            if (hit?.object.userData.name) window.dispatchEvent(new CustomEvent('network-node-select', { detail: hit.object.userData.name }));
        }
        isDragging = false;
        canvas.releasePointerCapture(event.pointerId);
    });

    const resize = () => {
        const width = stage.clientWidth;
        const height = stage.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
    window.addEventListener('resize', resize);
    resize();
    if (status) status.textContent = '6 containers / 6 bridges';

    const clock = new THREE.Clock();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = () => {
        const elapsed = clock.getElapsedTime();
        if (!isDragging && !reduceMotion) topologyGroup.rotation.y += .0009;
        topologyGroup.children.forEach((child, index) => {
            if (child.geometry?.type === 'TorusGeometry') child.rotation.z = elapsed * .22 + index;
        });
        pulseMeshes.forEach((pulse) => {
            const progress = reduceMotion ? 0 : (elapsed * .18 + pulse.userData.offset) % 1;
            pulse.position.lerpVectors(pulse.userData.from, pulse.userData.to, progress);
        });
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();
}

function createLoadTestScene(THREE, canvas, status) {
    const stage = canvas.closest('.load-concept');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
    camera.position.set(0, 0, 8.4);
    const flow = new THREE.Group();
    scene.add(flow);
    const pulses = [];
    const nodes = {
        user: [-2.7, 1.45, .1, 'USER / UI', 0xff795d],
        api: [-1.05, 1.45, 0, 'API', 0xd9ff55],
        queue: [.65, .55, -.1, 'QUEUE', 0xd9ff55],
        workers: [2.25, .55, .1, 'WORKERS', 0xff795d],
        target: [2.25, -1.15, -.1, 'TARGET', 0xff795d],
        database: [-1.05, -.25, -.1, 'POSTGRES', 0xa9c8ff],
        metrics: [.65, -1.15, .1, 'METRICS', 0xa9c8ff],
        dashboard: [-.8, -1.95, 0, 'REPORT', 0xa9c8ff]
    };

    addStarField(THREE, scene);
    const positions = {};
    Object.entries(nodes).forEach(([name, [x, y, z, label, color]]) => {
        positions[name] = new THREE.Vector3(x, y, z);
        const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(.16, 1), new THREE.MeshBasicMaterial({ color, wireframe: true }));
        mesh.position.copy(positions[name]);
        flow.add(mesh);
        const glow = new THREE.Mesh(new THREE.SphereGeometry(.3, 14, 14), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .11 }));
        glow.position.copy(positions[name]);
        flow.add(glow);
        const labelSprite = makeLabel(THREE, label, color);
        labelSprite.position.set(x - .35, y + .27, z);
        labelSprite.scale.set(.95, .16, 1);
        flow.add(labelSprite);
    });

    [['user', 'api', 0xff795d], ['api', 'queue', 0xd9ff55], ['queue', 'workers', 0xd9ff55], ['workers', 'target', 0xff795d], ['workers', 'metrics', 0xa9c8ff], ['api', 'database', 0xa9c8ff], ['metrics', 'dashboard', 0xa9c8ff]].forEach(([fromName, toName, color]) => {
        const from = positions[fromName];
        const to = positions[toName];
        flow.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, to]), new THREE.LineBasicMaterial({ color, transparent: true, opacity: .58 })));
        const pulse = new THREE.Mesh(new THREE.SphereGeometry(.04, 8, 8), new THREE.MeshBasicMaterial({ color }));
        pulse.userData = { from, to, offset: Math.random() };
        flow.add(pulse);
        pulses.push(pulse);
    });

    let isDragging = false;
    let lastPointer = { x: 0, y: 0 };
    canvas.addEventListener('pointerdown', (event) => {
        isDragging = true;
        lastPointer = { x: event.clientX, y: event.clientY };
        canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        flow.rotation.y += (event.clientX - lastPointer.x) * .006;
        flow.rotation.x = Math.max(-.35, Math.min(.35, flow.rotation.x + (event.clientY - lastPointer.y) * .003));
        lastPointer = { x: event.clientX, y: event.clientY };
    });
    canvas.addEventListener('pointerup', (event) => {
        isDragging = false;
        canvas.releasePointerCapture(event.pointerId);
    });

    const resize = () => {
        const width = stage.clientWidth;
        const height = stage.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
    window.addEventListener('resize', resize);
    resize();
    if (status) status.textContent = '7 paths / target flow';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = new THREE.Clock();
    const animate = () => {
        const elapsed = clock.getElapsedTime();
        if (!isDragging && !reduceMotion) flow.rotation.y -= .0008;
        pulses.forEach((pulse) => {
            const progress = reduceMotion ? 0 : (elapsed * .16 + pulse.userData.offset) % 1;
            pulse.position.lerpVectors(pulse.userData.from, pulse.userData.to, progress);
        });
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();
}

function addTierRows(THREE, group) {
    [['PUBLIC / BRIDGE', 1.65, 0xff795d], ['APP / INTERNAL', 0, 0xd9ff55], ['DB / INTERNAL', -1.65, 0xa9c8ff]].forEach(([label, y, color]) => {
        const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: .12 });
        const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3.45, y - .48, -.45), new THREE.Vector3(3.45, y - .48, -.45)]);
        group.add(new THREE.Line(geometry, material));
        const sprite = makeLabel(THREE, label, color);
        sprite.position.set(-3.25, y + .38, -.45);
        group.add(sprite);
    });
}

function makeLabel(THREE, text, color) {
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 420;
    labelCanvas.height = 70;
    const context = labelCanvas.getContext('2d');
    context.font = '500 22px monospace';
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.fillText(text, 8, 42);
    const texture = new THREE.CanvasTexture(labelCanvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    sprite.scale.set(1.65, .27, 1);
    return sprite;
}

function addStarField(THREE, scene) {
    const points = [];
    for (let index = 0; index < 100; index += 1) {
        points.push((Math.random() - .5) * 10, (Math.random() - .5) * 6, (Math.random() - .5) * 2 - 1);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xf9fbf4, size: .018, transparent: true, opacity: .48 })));
}

const featuredRepositoryOrder = ['Fastapi-TodoApp', 'Stocka-Ecommerce', 'golang-projects', 'handyhive', 'inventory-management', 'Hardware-Pricing-Tool'];
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
            if (firstPriority !== -1 || secondPriority !== -1) return (firstPriority === -1 ? 99 : firstPriority) - (secondPriority === -1 ? 99 : secondPriority);
            return new Date(second.pushed_at) - new Date(first.pushed_at);
        }).slice(0, 6);
        if (!publicRepositories.length) throw new Error('No public repositories found');

        container.innerHTML = publicRepositories.map((repo, index) => {
            const topics = [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 3);
            const note = repositoryNotes[repo.name] || repo.description || 'A public project from my ongoing learning archive.';
            return `<article class="repo-card"><span class="repo-index">${String(index + 4).padStart(2, '0')}</span><div><p class="repo-type">${escapeHtml(repo.language || 'Repository')}</p><h3>${escapeHtml(repo.name.replace(/-/g, ' '))}</h3><p>${escapeHtml(note)}</p><div class="skill-tags repo-tags">${topics.map((topic) => `<span>${escapeHtml(topic)}</span>`).join('')}</div><a class="repo-link" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer">View repository <span aria-hidden="true">&#8599;</span></a></div></article>`;
        }).join('');
    } catch {
        container.innerHTML = '<article class="repo-card repo-loading"><span class="repo-index">04</span><div><p class="repo-type">GitHub archive</p><h3>Browse the public repository archive.</h3><p>See current projects, experiments, and work in progress on my GitHub profile.</p><a class="repo-link" href="https://github.com/Roy6lty" target="_blank" rel="noreferrer">Open GitHub profile <span aria-hidden="true">&#8599;</span></a></div></article>';
    }
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}
