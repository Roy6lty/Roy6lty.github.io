# Docker Network Series — Course Site Review and Alignment

## Purpose

This review compares the static portfolio course reader with the executable Docker networking course source. The goal is to keep the website visually concise without stripping out the reasoning, troubleshooting, and failure-driven learning that make the course useful.

## Main mismatch found

The existing course reader had the correct broad chapter progression, but it created a second, much smaller curriculum inside `network-series.js`.

A detailed source chapter could contain many tasks, expected observations, route comparisons, failure experiments, recovery commands, and mental models while the web page reduced it to:

1. three generic step cards;
2. one visible expected answer;
3. one break-it card.

Chapter 06 made the problem obvious: the maintained lesson contains a baseline stage, route inspection, `ip route get`, router forwarding checks, forward-path tests, return-path tests, persistence experiments, and separate forward/return route failures. Those distinctions are the lesson. Compressing them into three cards makes the site look clean while weakening the course.

Chapter 15 exposed a second issue: terminal context. Some commands run on the host, some open a shell inside `postgres-replica`, some run inside that shell, and some belong in a PostgreSQL session. Without visible context a learner can copy a correct command into the wrong environment.

## Design decision

The website now uses two layers instead of choosing between “short” and “complete.”

### Layer 1 — guided experiment

This is the course UI. It contains:

- current lab state;
- what the stage changes;
- the eight-step teaching loop;
- a prediction interaction;
- local topology diagram;
- a minimum diagnostic run;
- explicit execution context on commands;
- intentional break and restore;
- review checkpoint with hidden expected observation;
- explicit chapter completion.

This layer keeps the experience approachable and interactive.

### Layer 2 — complete chapter notes

The maintained chapter README is rendered into a local HTML fragment and loaded below the guided experiment. This preserves:

- detailed conceptual explanations;
- actual learner questions and misconceptions;
- all task sequences;
- expected and negative observations;
- troubleshooting steps;
- persistence details;
- failure analysis;
- cleanup and reset instructions.

The website no longer asks the learner to leave the course page just to recover information that was removed from the web version.

## Information architecture

The course map is grouped by what is being built, not only by chapter number:

### Foundation — 01 to 04

Process lifecycle, bridge/CIDR boundaries, network namespaces, Linux capabilities.

### Routing and packet flow — 05 to 07

Multi-homed router, endpoint static routes, packet tracing.

### Traffic control and egress — 08 to 11

Stateful firewalling, private networks, NAT, Docker DNS.

### Service and data tier — 12 to 16

Nginx, PostgreSQL primary, PostgreSQL process model, physical replication, persistent startup.

### Failure and cloud mapping — 17

System-wide checks, controlled failures, recovery, and conceptual VPC mapping.

Chapter 05B remains visibly optional and standalone because it teaches multi-hop routing without belonging to the cumulative six-subnet stack.

## Course page design

### Hero

The hero answers three things immediately:

- which chapter this is;
- what capability is being added;
- what mental model should survive the lesson.

It should not try to contain the whole explanation.

### Run-locally notice

Every chapter explicitly says that the web page teaches and tracks progress while commands run in the learner's own Docker environment. This avoids visually implying that terminal-looking blocks are hosted shells.

### Lab state

The learner sees the expected state before starting the experiment. This is important in a cumulative lab because a failure caused by an earlier incomplete stage should not be mistaken for a new concept failure.

### Prediction

Prediction is placed before the topology/commands. A learner chooses what they think Linux, Docker, iptables, NAT, DNS, Nginx, or PostgreSQL will do. The response explains the model, but the learner still has to run the experiment.

The interaction is deliberately lightweight. It is not a graded exam.

### Topology

All chapter diagrams are copied into `network-series/diagrams/` and loaded locally. Localhost preview and the deployed portfolio therefore do not depend on `raw.githubusercontent.com` for the core teaching visual.

### Guided run

The three-card path remains, but it is now framed honestly as the **minimum diagnostic path**, not “the chapter.” This gives a learner a short route through the experiment while the full source detail remains available below.

### Execution context

Command blocks now label contexts such as:

```text
HOST
HOST -> app-a-test
HOST -> opens shell in postgres-replica
POSTGRES-REPLICA SHELL
PSQL SESSION
```

This is especially important for routing and replication chapters.

### Break and restore

The course keeps failure as a first-class section. The restore command is shown with the failure so learners are less likely to leave a cumulative lab in a broken state and then misdiagnose the following chapter.

### Full lesson notes

The full README is generated as static HTML and loaded locally. It is styled for long technical reading rather than card browsing:

- readable line length;
- clear heading hierarchy;
- horizontal table overflow;
- terminal blocks with copy controls;
- inline-code treatment;
- visual emphasis for observation, failure, and mental-model headings.

The generator demotes README headings by one level so the page keeps one logical `h1`.

### Review checkpoint

The expected observation is hidden by default. The learner must choose to reveal it. Chapter completion is then an explicit action and is stored in `localStorage` for the current browser.

This is better than treating a URL visit as evidence of understanding.

## Course map design

The course landing page now explains the learning method before listing chapters.

It includes:

- the full `build -> predict -> test -> break -> observe -> explain -> fix -> retest` loop;
- the final Chapter 17 topology;
- the packet-path mental model;
- prerequisites and local-environment warning;
- module-based chapter grouping;
- browser-local completion count;
- continue-from-next-incomplete behavior.

The page is intended to communicate that the learner is building **one system that grows**, not consuming 17 unrelated Docker articles.

## Source-of-truth workflow

The maintained Docker course remains the source of truth.

Generated web lesson fragments and SVGs are refreshed with:

```bash
python3 network-series/generate-course-content.py /path/to/docker-subnet
```

The generator reads each chapter `README.md`, renders it for the course reader, adjusts heading hierarchy, and copies the chapter SVG.

This avoids manually maintaining a detailed explanation once in the Docker repository and again in the portfolio.

## What should not be added yet

### Fake browser terminal

Learners currently run commands locally. Do not build a terminal-looking interactive surface that implies commands execute on the website.

A real hosted lab should be a separate project with disposable isolated environments, lifecycle control, quotas, network policy, and browser terminal access.

### Heavy account/progress backend

Browser-local completion is enough for the current portfolio/course version. User accounts, synced progress, cohorts, certificates, and analytics should only be added when there is a real product need.

### Decorative animation that hides topology

Animation is useful when it demonstrates packet movement, route choice, NAT translation, or failure. It should not compete with the diagram or turn the course into a visual demo without diagnostic value.

## Recommended next passes

### Pass 2 — per-task interactive checkpoints

The complete source contains more natural prediction points than one question per chapter. Promote selected moments into interactive Yes/No or multiple-choice checkpoints, especially:

- valid versus invalid next hop;
- forward versus return path;
- routing versus filtering;
- new connection versus established reply;
- raw IP versus DNS;
- route selection versus NAT translation;
- TCP reachability versus application authentication;
- base backup versus ongoing WAL replay.

Do not turn every paragraph into a quiz.

### Pass 3 — packet-path visualization

Add small focused diagrams for the exact packet currently being tested. For example, Chapter 07 could highlight ingress and egress interfaces as the learner runs `tcpdump`; Chapter 10 could show source IP before and after MASQUERADE.

Reuse a single canonical topology and highlight the active path rather than redrawing the network with a different visual grammar in every lesson.

### Pass 4 — lab-state verification helpers

Give each chapter a compact “you should currently have” block with expected services, networks, routes, or health states. This should be derived from the cumulative Compose stage where practical.

### Pass 5 — recovery index

Create a troubleshooting page organized by symptom:

```text
container exits
permission denied
no route
packet reaches router but not destination
TCP times out
raw IP works but hostname fails
Nginx returns upstream error
PostgreSQL port opens but login fails
replica is not streaming
state disappears after recreate
```

Each symptom should point back to the layer and chapter that teaches it.

## Validation performed

- Generated all 18 detailed lesson fragments (17 core + 05B).
- Copied all 18 SVG topology diagrams locally.
- Kept one page-level `h1` by demoting generated README headings.
- Checked `network-series.js` syntax with Node.
- Kept the static GitHub Pages deployment model; no framework or backend was introduced.
