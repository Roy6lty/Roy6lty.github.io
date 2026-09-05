# Local Lab Progress

The portfolio currently uses browser-local persistence for course progress.

## Storage

Shared helper: `/labs/lab-progress.js`

Storage key:

```text
ayo-labs-progress-v1
```

Example model:

```json
{
  "version": 1,
  "labs": {
    "docker-networking": {
      "completedChapters": {
        "01": { "completedAt": "..." }
      },
      "chapterState": {
        "02": {
          "visited": true,
          "lastSectionId": "what-is-cidr",
          "checkpoint": {
            "answered": true,
            "reviewed": true,
            "selectedChoice": 1
          }
        }
      },
      "lastVisited": {
        "id": "02",
        "path": "/labs/docker-networking/cidr-bridges/",
        "sectionId": "what-is-cidr"
      },
      "preferences": {
        "catalogView": "list"
      }
    }
  }
}
```

## UX rules

1. Visiting a chapter means **In progress**, not complete.
2. Completion remains an explicit learner action after the chapter review.
3. The course landing page shows overall completion and a resume target.
4. The Lab Library shows compact progress for active labs.
5. The chapter rail shows completion/in-progress states.
6. The learner can export/import JSON to move progress without an account.
7. Resetting progress requires confirmation.
8. No cookie banner is required for this feature because the data remains in browser local storage and is not sent to a server.

## Future account migration

If cross-device accounts are added later, use an authenticated backend and store progress server-side. A cookie should identify the authenticated session; the database should hold the actual learning state. Preserve this versioned model so local progress can be migrated into an account.
