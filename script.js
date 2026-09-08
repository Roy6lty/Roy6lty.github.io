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
    setupCourseReader();
    setupNetworkInspector();
    setupNetworkScene();
    setupLoadTestScene();
});

const courseChapters = [
    {
        kicker: 'CHAPTER 01 / FOUNDATION', title: 'A container is a process first.', description: 'Before there is a network, there is a process. Learn why PID 1 controls the container\'s lifetime and why this lab begins with sleep.', time: '10 min', focus: 'container lifecycle', layer: 'process', goal: 'Keep a diagnostic container alive and make its lifecycle visible.', model: 'A container lives while its PID 1 process lives.', type: 'process', diagramKicker: 'PROCESS / LIFECYCLE', caption: 'The container is not a small virtual machine. Its main process is the thing keeping it alive.', command: 'bash scripts/compose-stage.sh 01 up -d --build', check: 'What keeps the container alive?', commandNote: 'Run from the root of the cloned docker-subnet repository. Read the chapter README before starting the stack.', steps: [
            ['Build', 'Start an Alpine container with <code>sleep infinity</code> as its command.'],
            ['Inspect', 'Check the running container and identify the process holding PID 1.'],
            ['Prove it', 'Stop the process and watch the container exit with it.']
        ]
    },
    {
        kicker: 'CHAPTER 02 / FOUNDATION', title: 'Give the lab real boundaries.', description: 'Create six user-defined bridge networks and assign each one a predictable CIDR. Isolation is the first useful network behavior to observe.', time: '15 min', focus: 'CIDR and IPAM', layer: 'subnets', goal: 'Separate public, application, and database tiers before adding a route between them.', model: 'A bridge network is a boundary until a device deliberately connects it.', type: 'subnets', diagramKicker: 'TOPOLOGY / SIX BRIDGES', caption: 'The six subnets exist side by side, but no packet can cross between them yet.', command: 'bash scripts/compose-stage.sh 02 up -d --build', check: 'Which networks can talk to each other right now?', commandNote: 'Compare the Compose IPAM declarations with docker network inspect and record the assigned gateways.', steps: [
            ['Build', 'Add the public_a, public_b, app_a, app_b, db_a, and db_b networks.'],
            ['Inspect', 'List each subnet and the container address Docker assigned inside it.'],
            ['Prove it', 'Try a cross-network ping. The isolation is the expected result.']
        ]
    },
    {
        kicker: 'CHAPTER 03 / FOUNDATION', title: 'Look inside a network namespace.', description: 'A container gets its own interfaces, routing table, neighbor cache, and loopback device. These are the local facts every packet decision starts from.', time: '15 min', focus: 'interfaces and routes', layer: 'namespace', goal: 'Read the network namespace as evidence instead of treating the container as a black box.', model: 'The route table decides where a packet can go next.', type: 'namespace', diagramKicker: 'NAMESPACE / LOCAL VIEW', caption: 'The container only knows its own interface and directly connected route until you teach it more.', command: 'bash scripts/compose-stage.sh 03 exec app-a-test ip addr', check: 'What does app-a-test know about the rest of the lab?', commandNote: 'Run the command from the cloned repository root. The Compose runner resolves the container by service name.', steps: [
            ['Build', 'Keep the six isolated networks from the previous chapter.'],
            ['Inspect', 'Read ip addr, ip route, and ip neigh from inside one test container.'],
            ['Prove it', 'Find the interface, connected route, and next-hop information that are actually present.']
        ]
    },
    {
        kicker: 'CHAPTER 04 / FOUNDATION', title: 'Permission is part of the network.', description: 'Root inside a container is still restricted. Add CAP_NET_ADMIN and see the difference between being root and being allowed to change network state.', time: '12 min', focus: 'Linux capabilities', layer: 'permissions', goal: 'Make route and interface changes possible without giving the lab unrestricted host access.', model: 'Container root is not the same as unrestricted host root.', type: 'capability', diagramKicker: 'CAPABILITY / NET_ADMIN', caption: 'The command can be correct and still fail when the namespace does not have the capability to apply it.', command: 'bash scripts/compose-stage.sh 04 up -d --build', check: 'Why did adding a route fail before NET_ADMIN?', commandNote: 'Compare the failed route command with the same command after the capability is present.', steps: [
            ['Build', 'Add NET_ADMIN to diagnostic containers that need to change their routes.'],
            ['Inspect', 'Check the container capability set and run a route modification.'],
            ['Prove it', 'Remove the capability in a controlled copy and observe the permission failure.']
        ]
    },
    {
        kicker: 'CHAPTER 05 / ROUTING FABRIC', title: 'Add a device that can see every subnet.', description: 'A multi-homed router attaches to all six networks. Its connected routes appear automatically, but forwarding must be explicitly enabled.', time: '18 min', focus: 'IPv4 forwarding', layer: 'router', goal: 'Turn six isolated bridges into a topology with a deliberate forwarding point.', model: 'A router is an endpoint on every subnet and a forwarder between them.', type: 'router', diagramKicker: 'ROUTER / MULTI-HOMED', caption: 'The router is attached to every subnet. It can only forward traffic after ip_forward is enabled.', command: 'bash scripts/compose-stage.sh 05 up -d --build', check: 'Which routes did Linux install automatically on the router?', commandNote: 'Inspect the router interfaces and verify net.ipv4.ip_forward before testing traffic.', steps: [
            ['Build', 'Attach lab-router to all six bridges with a .2 address on each one.'],
            ['Inspect', 'Read its connected routes and check the forwarding sysctl.'],
            ['Prove it', 'Send a packet to the router from one subnet and watch where it can forward.']
        ]
    },
    {
        kicker: 'CHAPTER 06 / ROUTING FABRIC', title: 'Teach endpoints about the next hop.', description: 'The router knows the topology, but ordinary containers do not. Add routes through the router and learn why the return path matters just as much.', time: '20 min', focus: 'static routing', layer: 'route table', goal: 'Connect remote subnets with explicit next-hop routes from each sender.', model: 'Routing says where a packet goes; the return route brings the answer home.', type: 'routing', diagramKicker: 'ROUTE / NEXT HOP', caption: 'app-a uses the router address on its own subnet, 10.10.11.2, as the next hop.', command: 'bash scripts/compose-stage.sh 06 up -d --build', check: 'Why must app-a use 10.10.11.2 as its gateway?', commandNote: 'After testing the forward path, inspect the destination route table before calling a timeout a firewall problem.', steps: [
            ['Build', 'Add remote subnet routes to the test containers through their local router address.'],
            ['Inspect', 'Use ip route get to see the chosen interface and next hop.'],
            ['Prove it', 'Break the destination return route and observe a connection that hangs.']
        ]
    },
    {
        kicker: 'CHAPTER 07 / ROUTING FABRIC', title: 'Watch the packet cross the router.', description: 'A route table is a prediction. tcpdump gives you evidence of ingress, forwarding, egress, and the reply returning through the topology.', time: '15 min', focus: 'packet tracing', layer: 'evidence', goal: 'Trace one request across multiple interfaces instead of inferring the path from a ping result.', model: 'A packet path is a sequence of observable interface events.', type: 'packet', diagramKicker: 'PACKET / OBSERVATION', caption: 'Capture the ingress and egress events separately. The reply must make the trip back.', command: 'bash scripts/compose-stage.sh 07 up -d --build', check: 'Which interface sees the packet first, and where does it leave?', commandNote: 'Use tcpdump -i any -nn so names and service ports do not hide the evidence.', steps: [
            ['Build', 'Keep the router and static routes from the previous chapters.'],
            ['Inspect', 'Capture ICMP or TCP traffic on the router with tcpdump.'],
            ['Prove it', 'Match the capture order to the route table prediction.']
        ]
    },
    {
        kicker: 'CHAPTER 08 / ROUTING FABRIC', title: 'Make allowed traffic explicit.', description: 'Forwarding alone is too permissive for a useful topology. Add a default-deny FORWARD policy, then allow only the paths and ports the lab needs.', time: '22 min', focus: 'iptables and conntrack', layer: 'firewall', goal: 'Separate a route that exists from a flow the firewall is willing to permit.', model: 'The route chooses the path; the firewall chooses whether the flow may use it.', type: 'firewall', diagramKicker: 'FIREWALL / FORWARD', caption: 'A packet can reach the router and still be dropped because the FORWARD chain has no matching allow rule.', command: 'bash scripts/compose-stage.sh 08 up -d --build', check: 'What does ESTABLISHED,RELATED save you from writing?', commandNote: 'Inspect counters with iptables -L FORWARD -n -v --line-numbers after each test.', steps: [
            ['Build', 'Set FORWARD to DROP and add narrow rules for HTTP and PostgreSQL traffic.'],
            ['Inspect', 'Watch rule counters and connection state while a request runs.'],
            ['Prove it', 'Attempt a port that is not allowed and compare the drop with an accepted flow.']
        ]
    },
    {
        kicker: 'CHAPTER 09 / ROUTING FABRIC', title: 'Hide the private tiers from egress.', description: 'Mark app and database networks internal. The services remain reachable through the lab topology, but Docker no longer gives them normal internet egress.', time: '13 min', focus: 'private boundaries', layer: 'internal subnet', goal: 'Create a meaningful difference between a public bridge and a private internal network.', model: 'Private is a property of the boundary, not a promise that no route can ever exist.', type: 'private', diagramKicker: 'PRIVATE / INTERNAL', caption: 'The internal flag removes normal Docker egress. A later chapter will add an intentional exit through NAT.', command: 'bash scripts/compose-stage.sh 09 up -d --build', check: 'What disappeared from the private container route table?', commandNote: 'Compare ip route before and after internal: true. Do not add the default route until the NAT chapter.', steps: [
            ['Build', 'Set app_a, app_b, db_a, and db_b to internal Docker networks.'],
            ['Inspect', 'Compare their connected routes with the public tier.'],
            ['Prove it', 'Test a public address and distinguish missing egress from a service failure.']
        ]
    },
    {
        kicker: 'CHAPTER 10 / ROUTING FABRIC', title: 'Give private services a controlled exit.', description: 'Build a separate NAT gateway and follow the packet as routing chooses an interface and MASQUERADE rewrites the source address afterward.', time: '24 min', focus: 'NAT and egress', layer: 'translation', goal: 'Make private egress work without exposing the private source addresses outside the lab.', model: 'Routing chooses the interface; NAT modifies the packet afterward.', type: 'nat', diagramKicker: 'NAT / EGRESS PATH', caption: 'The private source becomes the gateway address on the public side, then the reply is translated back.', command: 'bash scripts/compose-stage.sh 10 up -d --build', check: 'Why can a NAT rule have zero counters even when it exists?', commandNote: 'Use ip route get 8.8.8.8 to verify the egress interface before debugging MASQUERADE.', steps: [
            ['Build', 'Attach nat-gateway to both app networks and a public NAT network.'],
            ['Inspect', 'Add the private default route and inspect the POSTROUTING rule counters.'],
            ['Prove it', 'Break the gateway default route and compare routing failure with translation failure.']
        ]
    },
    {
        kicker: 'CHAPTER 11 / SERVICES', title: 'Separate names from reachability.', description: 'Docker provides an embedded DNS resolver on user-defined networks. Compare a raw IP request with a hostname request so the failure modes stay distinct.', time: '16 min', focus: 'Docker DNS', layer: 'discovery', goal: 'Know when to investigate DNS instead of changing a route that is already working.', model: 'IP connectivity and name resolution are two different paths.', type: 'dns', diagramKicker: 'DNS / NAME TO IP', caption: 'A container asks 127.0.0.11 for a name. Docker resolves it through its service and upstream DNS model.', command: 'bash scripts/compose-stage.sh 11 up -d --build', check: 'If 8.8.8.8 works but a hostname fails, which layer is suspect?', commandNote: 'Inspect /etc/resolv.conf and test the raw IP before changing routes.', steps: [
            ['Build', 'Keep the user-defined networks and add the DNS-aware service topology.'],
            ['Inspect', 'Read the resolver configuration and query a service name.'],
            ['Prove it', 'Preserve IP reachability while intentionally breaking hostname resolution.']
        ]
    },
    {
        kicker: 'CHAPTER 12 / SERVICES', title: 'Put an HTTP boundary in front.', description: 'Nginx becomes the public edge and opens a second connection to the app tier. The diagram makes the two TCP conversations visible.', time: '20 min', focus: 'reverse proxy', layer: 'HTTP', goal: 'Expose the app through a public-facing service without placing the app on the public network.', model: 'A reverse proxy terminates one connection and creates another.', type: 'proxy', diagramKicker: 'NGINX / TWO CONNECTIONS', caption: 'The client talks to Nginx. Nginx talks to the app through the router. These are separate TCP connections.', command: 'bash scripts/compose-stage.sh 12 up -d --build', check: 'Why is this not one client TCP connection all the way to the app?', commandNote: 'Use nginx -t before reload and verify the router rule for the app port.', steps: [
            ['Build', 'Attach Nginx to the public network and configure the app upstream.'],
            ['Inspect', 'Follow the request from public-a-test to Nginx and then to app-a-test.'],
            ['Prove it', 'Stop Nginx and observe public-path failure while the app remains present.']
        ]
    },
    {
        kicker: 'CHAPTER 13 / SERVICES', title: 'Make the database a routed service.', description: 'Place PostgreSQL on the database tier and test it from the app tier. A successful forward route still needs a working return route.', time: '22 min', focus: 'PostgreSQL primary', layer: 'database', goal: 'Connect the application tier to a writable database without flattening the network.', model: 'A TCP handshake proves a path and a listener, not a complete database session.', type: 'database', diagramKicker: 'DATABASE / RETURN PATH', caption: 'The app request reaches the primary through the router. The primary must know how to return traffic to the app subnet.', command: 'bash scripts/compose-stage.sh 13 up -d --build', check: 'What does a hanging nc connection tell you to inspect next?', commandNote: 'Use nc -vz -w 3 before testing SQL. A timeout, refusal, and authentication error mean different layers.', steps: [
            ['Build', 'Add the PostgreSQL primary to db_a with a fixed address.'],
            ['Inspect', 'Test port 5432 and inspect the primary route table.'],
            ['Prove it', 'Remove the return route, reproduce the hang, and restore it.']
        ]
    },
    {
        kicker: 'CHAPTER 14 / SERVICES', title: 'See what PostgreSQL is doing.', description: 'PostgreSQL is a multi-process server. Inspect the main process, background workers, and client backends instead of treating the database as one PID.', time: '14 min', focus: 'process model', layer: 'runtime', goal: 'Connect a service-level request to the operating-system processes that handle it.', model: 'One database service can be a coordinated group of OS processes.', type: 'postgres', diagramKicker: 'POSTGRES / PROCESS TREE', caption: 'The main server coordinates background processes and a backend process for each client connection.', command: 'bash scripts/compose-stage.sh 14 up -d --build', check: 'Which process handles an individual client connection?', commandNote: 'Use ps inside the PostgreSQL container and compare the process list before and during a client session.', steps: [
            ['Build', 'Keep the primary running and create a client connection from the app tier.'],
            ['Inspect', 'List the checkpointer, WAL writer, autovacuum, and backend processes.'],
            ['Prove it', 'Open a second session and watch another client backend appear.']
        ]
    },
    {
        kicker: 'CHAPTER 15 / RECOVERY', title: 'Copy the primary, then stream the changes.', description: 'Initialize a physical standby with pg_basebackup and let PostgreSQL stream WAL from the primary into a second database region.', time: '30 min', focus: 'physical replication', layer: 'WAL', goal: 'Build a read-only replica that receives the primary\'s physical changes across the routed topology.', model: 'Base backup creates the copy; WAL streaming keeps the copy current.', type: 'replication', diagramKicker: 'REPLICATION / WAL STREAM', caption: 'The replica starts with a physical copy, then replays WAL as the primary continues to write.', command: 'bash scripts/compose-stage.sh 15 up -d --build', check: 'What proves the replica is streaming rather than just copied once?', commandNote: 'Verify pg_stat_replication on the primary and pg_is_in_recovery on the replica.', steps: [
            ['Build', 'Prepare the replica data directory and permit the replication connection.'],
            ['Inspect', 'Run pg_basebackup with -R and read the generated standby configuration.'],
            ['Prove it', 'Insert on the primary and observe the row arrive on the read-only replica.']
        ]
    },
    {
        kicker: 'CHAPTER 16 / RECOVERY', title: 'Move runtime fixes into startup.', description: 'Manual routes and firewall rules disappear when a container is recreated. Wrap the base entrypoint so required runtime state is applied idempotently on every start.', time: '20 min', focus: 'entrypoints', layer: 'persistence', goal: 'Make the network and database setup repeatable instead of relying on a lucky running container.', model: 'Persistent behavior belongs in the image, entrypoint, Compose file, or volume.', type: 'persistence', diagramKicker: 'STARTUP / IDEMPOTENT STATE', caption: 'The wrapper restores the route, delegates to the image entrypoint, and keeps postgres as the final process.', command: 'bash scripts/compose-stage.sh 16 up -d --build --wait', check: 'Which state survives recreation, and which state must be rebuilt?', commandNote: 'Recreate the replica and verify the route and standby behavior return without a manual shell session.', steps: [
            ['Build', 'Add the route wrapper and install the runtime tools in the image.'],
            ['Inspect', 'Read the startup logs and verify the route was replaced before PostgreSQL starts.'],
            ['Prove it', 'Recreate the container and confirm the same behavior returns.']
        ]
    },
    {
        kicker: 'CHAPTER 17 / RECOVERY', title: 'Break it on purpose, then explain it.', description: 'The final chapter turns the whole lab into a repeatable test surface. Failure is now a way to locate the layer that made a request stop working.', time: '25 min', focus: 'failure testing', layer: 'validation', goal: 'Use routing, firewall, DNS, service, and replication checks to prove the final topology.', model: 'A useful system makes failure visible, local, and recoverable.', type: 'failure', diagramKicker: 'VALIDATION / LAYER CHECKS', caption: 'Each check narrows the fault domain. Start with the packet path, then move up to the service and data layers.', command: 'bash scripts/compose-stage.sh 17 up -d --build --wait', check: 'Which layer failed first: route, policy, listener, protocol, or data?', commandNote: 'Run the routing, firewall, NAT, and replication test scripts from the repository root.', steps: [
            ['Build', 'Start the complete topology and run the final Compose stage.'],
            ['Inspect', 'Run the focused checks for routing, firewalling, NAT, and replication.'],
            ['Prove it', 'Break one layer, identify the first failed observation, and recover the lab.']
        ]
    }
];

function setupCourseReader() {
    const reader = document.querySelector('[data-course-reader]');
    if (!reader) return;

    const buttons = [...reader.querySelectorAll('[data-course-chapter]')];
    const previous = reader.querySelector('#course-prev');
    const next = reader.querySelector('#course-next');
    const copyButton = reader.querySelector('#copy-command');
    const total = courseChapters.length;
    const ids = {
        progress: reader.querySelector('#course-progress-label'),
        fill: reader.querySelector('#course-progress-fill'),
        kicker: reader.querySelector('#lesson-kicker'),
        title: reader.querySelector('#lesson-title'),
        description: reader.querySelector('#lesson-description'),
        time: reader.querySelector('#lesson-time'),
        focus: reader.querySelector('#lesson-focus'),
        layer: reader.querySelector('#lesson-layer'),
        goal: reader.querySelector('#lesson-goal'),
        steps: reader.querySelector('#lesson-steps'),
        model: reader.querySelector('#lesson-model'),
        diagramKicker: reader.querySelector('#diagram-kicker'),
        diagram: reader.querySelector('#course-diagram'),
        diagramCaption: reader.querySelector('#diagram-caption'),
        command: reader.querySelector('#lesson-command'),
        commandNote: reader.querySelector('#command-note'),
        checkpoint: reader.querySelector('#lesson-checkpoint'),
        nextTitle: reader.querySelector('#next-chapter-title')
    };

    const hashMatch = window.location.hash.match(/^#chapter-(\d{2})$/);
    let currentIndex = hashMatch ? Math.max(0, Math.min(total - 1, Number(hashMatch[1]) - 1)) : 0;

    const selectChapter = (index, updateHash = true) => {
        currentIndex = Math.max(0, Math.min(total - 1, index));
        const chapter = courseChapters[currentIndex];
        const chapterNumber = String(currentIndex + 1).padStart(2, '0');
        const progress = total > 1 ? (currentIndex / (total - 1)) * 100 : 100;

        buttons.forEach((button, buttonIndex) => {
            button.classList.toggle('is-active', buttonIndex === currentIndex);
            button.classList.toggle('is-visited', buttonIndex < currentIndex);
            if (buttonIndex === currentIndex) button.setAttribute('aria-current', 'step');
            else button.removeAttribute('aria-current');
        });
        ids.progress.textContent = `${chapterNumber} / ${String(total).padStart(2, '0')}`;
        ids.fill.style.width = `${Math.max(4, progress)}%`;
        ids.kicker.textContent = chapter.kicker;
        ids.title.textContent = chapter.title;
        ids.description.textContent = chapter.description;
        ids.time.textContent = chapter.time;
        ids.focus.textContent = chapter.focus;
        ids.layer.textContent = chapter.layer;
        ids.goal.textContent = chapter.goal;
        ids.steps.innerHTML = chapter.steps.map((step, stepIndex) => `<div class="course-step"><span>${String(stepIndex + 1).padStart(2, '0')}</span><div><strong>${step[0]}</strong><p>${step[1]}</p></div></div>`).join('');
        ids.model.textContent = chapter.model;
        ids.diagramKicker.textContent = chapter.diagramKicker;
        ids.diagram.innerHTML = courseDiagram(chapter.type);
        ids.diagram.setAttribute('aria-label', `${chapter.title} diagram`);
        ids.diagramCaption.textContent = chapter.caption;
        ids.command.textContent = chapter.command;
        ids.commandNote.innerHTML = chapter.commandNote.replace('docker-subnet', '<code>docker-subnet</code>');
        ids.checkpoint.textContent = chapter.check;
        ids.nextTitle.textContent = currentIndex === total - 1 ? 'Restart the course' : courseChapters[currentIndex + 1].title;
        previous.disabled = currentIndex === 0;
        previous.querySelector('strong').textContent = currentIndex === 0 ? 'Start' : courseChapters[currentIndex - 1].title;
        next.querySelector('small').textContent = currentIndex === total - 1 ? 'Back to first' : 'Next chapter';
        if (updateHash) history.replaceState(null, '', `#chapter-${chapterNumber}`);
    };

    buttons.forEach((button) => button.addEventListener('click', () => {
        selectChapter(Number(button.dataset.courseChapter));
        reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    previous.addEventListener('click', () => selectChapter(currentIndex - 1));
    next.addEventListener('click', () => selectChapter(currentIndex === total - 1 ? 0 : currentIndex + 1));
    copyButton.addEventListener('click', async () => {
        const originalLabel = 'Copy command';
        try {
            await navigator.clipboard.writeText(courseChapters[currentIndex].command);
            copyButton.textContent = 'Copied';
        } catch {
            copyButton.textContent = 'Select command';
        }
        window.setTimeout(() => { copyButton.textContent = originalLabel; }, 1600);
    });
    selectChapter(currentIndex, false);
}

function diagramBox(x, y, width, height, title, copy, className = '') {
    return `<g class="diagram-box ${className}" transform="translate(${x} ${y})"><rect width="${width}" height="${height}" rx="2"></rect><text class="diagram-title" x="18" y="30">${title}</text><text class="diagram-copy" x="18" y="54">${copy}</text></g>`;
}

function diagramShell(content) {
    return `<svg class="course-diagram-svg" viewBox="0 0 760 340" aria-hidden="true">${content}</svg>`;
}

function courseDiagram(type) {
    if (type === 'process') return diagramShell(`${diagramBox(70, 76, 245, 145, 'docker container', 'isolated namespace', 'diagram-accent')}<rect class="diagram-chip" x="92" y="164" width="78" height="32" rx="1"></rect><text class="diagram-chip-text" x="131" y="185">PID 1</text><text class="diagram-copy" x="189" y="184">sleep infinity</text><path class="diagram-line diagram-accent-line" d="M315 148 H438"></path><path class="diagram-arrow" d="M430 140 L442 148 L430 156"></path>${diagramBox(454, 76, 235, 145, 'container state', 'running')}<circle class="diagram-dot" cx="493" cy="181" r="7"></circle><text class="diagram-copy" x="512" y="185">process stays alive</text><text class="diagram-caption" x="70" y="270">the process is the lifecycle anchor</text>`);
    if (type === 'subnets') return diagramShell(`<rect class="diagram-dashed" x="40" y="25" width="680" height="260" rx="2"></rect><text class="diagram-small" x="58" y="49">docker host / six user-defined bridges</text>${diagramBox(58, 68, 300, 70, 'public_a', '10.10.1.0/24', 'diagram-orange')}${diagramBox(402, 68, 300, 70, 'public_b', '10.10.2.0/24', 'diagram-orange')}${diagramBox(58, 160, 300, 70, 'app_a', '10.10.11.0/24 / internal', 'diagram-accent')}${diagramBox(402, 160, 300, 70, 'app_b', '10.10.12.0/24 / internal', 'diagram-accent')}${diagramBox(58, 252, 300, 70, 'db_a', '10.10.21.0/24 / internal', 'diagram-blue')}${diagramBox(402, 252, 300, 70, 'db_b', '10.10.22.0/24 / internal', 'diagram-blue')}`);
    if (type === 'namespace') return diagramShell(`${diagramBox(55, 80, 190, 155, 'container', 'app-a-test', 'diagram-accent')}<rect class="diagram-chip" x="76" y="148" width="98" height="30" rx="1"></rect><text class="diagram-chip-text" x="125" y="167">eth0 / .10</text><path class="diagram-line diagram-accent-line" d="M245 157 H355"></path><path class="diagram-arrow" d="M347 149 L359 157 L347 165"></path>${diagramBox(375, 80, 155, 155, 'local facts', 'namespace')}<text class="diagram-copy" x="393" y="160">ip route</text><text class="diagram-copy" x="393" y="181">ip neigh</text><text class="diagram-copy" x="393" y="202">loopback</text>${diagramBox(555, 80, 150, 155, 'next hop', 'not known yet', 'diagram-orange')}<text class="diagram-caption" x="55" y="273">each container starts with a local view</text>`);
    if (type === 'capability') return diagramShell(`${diagramBox(58, 78, 220, 150, 'route command', 'ip route add ...', 'diagram-orange')}<path class="diagram-line diagram-orange-line" d="M278 153 H365"></path><path class="diagram-arrow" d="M357 145 L369 153 L357 161"></path>${diagramBox(390, 78, 315, 150, 'container permission set', 'can this namespace change state?')}<rect class="diagram-chip" x="412" y="154" width="112" height="31" rx="1"></rect><text class="diagram-chip-text" x="468" y="174">NET_ADMIN</text><text class="diagram-copy" x="540" y="174">allow route change</text><text class="diagram-caption" x="58" y="273">root identity and network capability are separate controls</text>`);
    if (type === 'router' || type === 'routing') return diagramShell(`<path class="diagram-dashed" d="M105 89 H272 M105 170 H272 M105 251 H272 M488 89 H655 M488 170 H655 M488 251 H655"></path>${diagramBox(52, 56, 220, 66, 'public_a', '10.10.1.0/24', 'diagram-orange')}${diagramBox(52, 137, 220, 66, 'app_a', '10.10.11.0/24', 'diagram-accent')}${diagramBox(52, 218, 220, 66, 'db_a', '10.10.21.0/24', 'diagram-blue')}<path class="diagram-line diagram-accent-line" d="M272 170 H488"></path><path class="diagram-arrow" d="M480 162 L492 170 L480 178"></path>${diagramBox(315, 108, 170, 125, 'lab-router', type === 'routing' ? 'next hop .2' : 'ip_forward = 1', 'diagram-accent')}${diagramBox(488, 56, 220, 66, 'app_b', '10.10.12.0/24', 'diagram-accent')}${diagramBox(488, 218, 220, 66, 'db_b', '10.10.22.0/24', 'diagram-blue')}<text class="diagram-caption" x="52" y="316">${type === 'routing' ? 'endpoints must be taught to use the router' : 'one multi-homed node sees every subnet'}</text>`);
    if (type === 'packet') return diagramShell(`${diagramBox(45, 115, 145, 80, 'source', 'public-a', 'diagram-orange')}<path class="diagram-line diagram-orange-line" d="M190 155 H292"></path><circle class="diagram-orange-dot" cx="240" cy="155" r="7"></circle><path class="diagram-arrow" d="M284 147 L296 155 L284 163"></path>${diagramBox(300, 85, 160, 140, 'router', 'ingress -> egress', 'diagram-accent')}<path class="diagram-line diagram-accent-line" d="M460 155 H565"></path><circle class="diagram-dot" cx="510" cy="155" r="7"></circle><path class="diagram-arrow" d="M557 147 L569 155 L557 163"></path>${diagramBox(574, 115, 145, 80, 'destination', 'app-b', 'diagram-accent')}<text class="diagram-caption" x="45" y="270">capture ingress, forward, egress, then the return flow</text>`);
    if (type === 'firewall') return diagramShell(`${diagramBox(45, 118, 150, 76, 'app-a', 'tcp / 5432', 'diagram-accent')}<path class="diagram-line diagram-accent-line" d="M195 156 H300"></path><path class="diagram-arrow" d="M292 148 L304 156 L292 164"></path>${diagramBox(310, 76, 155, 160, 'FORWARD', 'default DROP', 'diagram-orange')}<rect class="diagram-chip" x="330" y="139" width="114" height="31" rx="1"></rect><text class="diagram-chip-text" x="387" y="159">ALLOW 5432</text><path class="diagram-line diagram-orange-line" d="M465 156 H565"></path><path class="diagram-arrow" d="M557 148 L569 156 L557 164"></path>${diagramBox(574, 118, 145, 76, 'db-a', 'listener', 'diagram-blue')}<text class="diagram-caption" x="45" y="275">route exists + rule matches = flow is allowed</text>`);
    if (type === 'private') return diagramShell(`<rect class="diagram-dashed" x="35" y="45" width="440" height="220" rx="2"></rect><text class="diagram-small" x="52" y="68">internal: true / private zone</text>${diagramBox(62, 98, 170, 80, 'app_a', '10.10.11.0/24', 'diagram-accent')}${diagramBox(280, 98, 170, 80, 'db_a', '10.10.21.0/24', 'diagram-blue')}<path class="diagram-line diagram-accent-line" d="M232 138 H280"></path><path class="diagram-arrow" d="M272 130 L284 138 L272 146"></path><path class="diagram-dashed" d="M475 155 H555"></path>${diagramBox(570, 98, 150, 80, 'internet', 'no default path', 'diagram-orange')}<text class="diagram-caption" x="52" y="235">private services can talk deliberately, not automatically</text>`);
    if (type === 'nat') return diagramShell(`${diagramBox(38, 118, 145, 78, 'app_a', '10.10.11.10', 'diagram-accent')}<path class="diagram-line diagram-accent-line" d="M183 157 H288"></path><path class="diagram-arrow" d="M280 149 L292 157 L280 165"></path>${diagramBox(296, 82, 170, 150, 'nat-gateway', '10.10.11.3 -> .30.2', 'diagram-accent')}<rect class="diagram-chip" x="318" y="161" width="124" height="30" rx="1"></rect><text class="diagram-chip-text" x="380" y="180">MASQUERADE</text><path class="diagram-line diagram-orange-line" d="M466 157 H570"></path><path class="diagram-arrow" d="M562 149 L574 157 L562 165"></path>${diagramBox(578, 118, 144, 78, 'public', 'source rewritten', 'diagram-orange')}<text class="diagram-caption" x="38" y="276">route first, rewrite second</text>`);
    if (type === 'dns') return diagramShell(`${diagramBox(42, 116, 145, 82, 'service', 'api by name', 'diagram-accent')}<path class="diagram-line diagram-accent-line" d="M187 157 H270"></path><path class="diagram-arrow" d="M262 149 L274 157 L262 165"></path>${diagramBox(278, 116, 130, 82, '127.0.0.11', 'resolver', 'diagram-accent')}<path class="diagram-line diagram-accent-line" d="M408 157 H490"></path><path class="diagram-arrow" d="M482 149 L494 157 L482 165"></path>${diagramBox(498, 116, 220, 82, 'Docker DNS', 'name -> 10.10.11.10', 'diagram-blue')}<text class="diagram-caption" x="42" y="257">a hostname request follows a different path than a raw IP request</text>`);
    if (type === 'proxy') return diagramShell(`${diagramBox(30, 118, 140, 78, 'client', 'public-a-test', 'diagram-orange')}<path class="diagram-line diagram-orange-line" d="M170 157 H270"></path><path class="diagram-arrow" d="M262 149 L274 157 L262 165"></path>${diagramBox(278, 78, 145, 158, 'nginx', ':80 -> upstream', 'diagram-orange')}<path class="diagram-line diagram-accent-line" d="M423 157 H520"></path><path class="diagram-arrow" d="M512 149 L524 157 L512 165"></path>${diagramBox(528, 118, 190, 78, 'app-a-test', ':8000', 'diagram-accent')}<text class="diagram-small" x="188" y="137">connection 1</text><text class="diagram-small" x="445" y="137">connection 2</text><text class="diagram-caption" x="30" y="270">the proxy creates a new connection to the app</text>`);
    if (type === 'database') return diagramShell(`${diagramBox(40, 118, 150, 78, 'app-a', 'client / nc', 'diagram-accent')}<path class="diagram-line diagram-accent-line" d="M190 157 H290"></path><path class="diagram-arrow" d="M282 149 L294 157 L282 165"></path>${diagramBox(300, 78, 145, 158, 'lab-router', 'forward :5432', 'diagram-accent')}<path class="diagram-line diagram-blue-line" d="M445 157 H550"></path><path class="diagram-arrow" d="M542 149 L554 157 L542 165"></path>${diagramBox(560, 118, 160, 78, 'primary', '10.10.21.20', 'diagram-blue')}<text class="diagram-caption" x="40" y="270">the return route completes the TCP handshake</text>`);
    if (type === 'postgres') return diagramShell(`${diagramBox(60, 100, 190, 120, 'postgres', 'main server', 'diagram-blue')}<path class="diagram-line diagram-blue-line" d="M250 130 H360 M250 190 H360"></path><path class="diagram-arrow" d="M352 122 L364 130 L352 138"></path><path class="diagram-arrow" d="M352 182 L364 190 L352 198"></path>${diagramBox(370, 70, 160, 70, 'background', 'WAL / vacuum', 'diagram-blue')}${diagramBox(370, 170, 160, 70, 'client backend', 'one session', 'diagram-accent')}${diagramBox(550, 170, 160, 70, 'client backend', 'another session', 'diagram-accent')}<path class="diagram-line diagram-accent-line" d="M530 205 H545"></path><text class="diagram-caption" x="60" y="279">one service, several coordinated operating-system processes</text>`);
    if (type === 'replication') return diagramShell(`${diagramBox(48, 110, 180, 95, 'primary', 'writes WAL', 'diagram-blue')}<path class="diagram-line diagram-accent-line" d="M228 157 H370"></path><path class="diagram-arrow" d="M362 149 L374 157 L362 165"></path><rect class="diagram-chip" x="260" y="137" width="92" height="30" rx="1"></rect><text class="diagram-chip-text" x="306" y="157">WAL stream</text>${diagramBox(390, 110, 180, 95, 'replica', 'replays WAL', 'diagram-accent')}<path class="diagram-line diagram-blue-line" d="M570 157 H700"></path><path class="diagram-arrow" d="M692 149 L704 157 L692 165"></path>${diagramBox(600, 110, 120, 95, 'read only', 'standby', 'diagram-orange')}<text class="diagram-caption" x="48" y="267">base backup gives the starting state; WAL gives the ongoing state</text>`);
    if (type === 'persistence') return diagramShell(`${diagramBox(34, 112, 135, 88, 'docker', 'create', 'diagram-orange')}<path class="diagram-line diagram-orange-line" d="M169 156 H250"></path><path class="diagram-arrow" d="M242 148 L254 156 L242 164"></path>${diagramBox(260, 78, 155, 156, 'entrypoint', 'route replace', 'diagram-accent')}<path class="diagram-line diagram-accent-line" d="M415 156 H500"></path><path class="diagram-arrow" d="M492 148 L504 156 L492 164"></path>${diagramBox(510, 112, 210, 88, 'postgres', 'final PID 1', 'diagram-blue')}<text class="diagram-caption" x="34" y="270">recreation runs the same setup instead of relying on manual state</text>`);
    return diagramShell(`${diagramBox(35, 102, 150, 110, 'routing', 'path + return', 'diagram-accent')}${diagramBox(205, 102, 150, 110, 'policy', 'iptables / DNS', 'diagram-orange')}${diagramBox(375, 102, 150, 110, 'service', 'listener / SQL', 'diagram-blue')}${diagramBox(545, 102, 175, 110, 'data', 'replication / recovery', 'diagram-accent')}<path class="diagram-line diagram-accent-line" d="M185 157 H205 M355 157 H375 M525 157 H545"></path><circle class="diagram-dot" cx="195" cy="157" r="5"></circle><circle class="diagram-dot" cx="365" cy="157" r="5"></circle><circle class="diagram-dot" cx="535" cy="157" r="5"></circle><text class="diagram-caption" x="35" y="270">start at the first failed layer, not the loudest symptom</text>`);
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
