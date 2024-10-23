# Kiosk AI Receptionist

- An innovative virtual receptionist system utilizing Metahuman technology to create a lifelike, interactive digital assistant.
  This AI-powered kiosk provides natural conversation capabilities while offering various utilities including weather updates, calendar tracking, faculty schedules, and student laboratory timetables,.. Designed to enhance user experience and streamline information access at the Research Institute of Posts and Telecommunication

# About the Repo

- This is the Frontend part of the project

# Project structure

```
└── 📁kiosk_frontend
    └── 📁public
    └── 📁src  // Main folder
        └── 📁assets // Media item, icon,..
        └── 📁components
            └── 📁ui // Shadcn components and other reusable component that use shadcn
            └── AIChat.tsx // Normal component for pages
            └── AIModel.tsx
            ...
        └── 📁context
        └── 📁data
        └── 📁hooks
        └── 📁layouts // layout for different page type: root, admin,...
        └── 📁lib
        └── 📁pages // Single page where the components are imported
        └── 📁router
        └── 📁sampleData
        └── 📁services
        └── 📁types // Typescript type
        └── 📁utils // utility function, variable,...
        └── App.css
        └── App.tsx
        └── index.css
        └── main.tsx
        └── vite-env.d.ts
```

# Component structure

```
"use client" 
- Importing
// Libraries
// Components and Icons
// Contexts and Hooks
// Interfaces and utils
// Assets

- Main
// Refs
// States, Variables
// Contexts
// Effects 
// Handlers
// API Calls
// Utilities
// Memoized Components
// Render functions
// Main renders

- Export
```

# Naming conventions
- Always use meaningfull name
- Use Camel case naming conventions
- For interfaces, use prefix "I"
- For folders and files :
    - Folder and Components -> Capitalized
    - Single file -> CamelCase ( Except App )
....
