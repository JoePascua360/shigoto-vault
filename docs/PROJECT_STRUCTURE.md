# Project Structure

## Client

```bash
/app
├── assets
│   ├── hero-vault.jpg
│   └── not-found-bg.jpg
├── components
│   ├── dropdown-component.tsx
│   ├── dynamic-dialog.tsx
│   ├── error-page.tsx
│   ├── form
│   │   ├── edit-table-row.tsx
│   │   └── features
│   │   └── job-applications
│   │   ├── job-application-step-1-form-element.tsx
│   │   ├── job-application-step-2-form-element.tsx
│   │   └── job-application-step-3-form-element.tsx
│   ├── hero.tsx
│   ├── letters-pull-up.tsx
│   ├── loaders
│   │   └── table-skeleton-loader.tsx
│   ├── loading-button.tsx
│   ├── missing-page.tsx
│   ├── multi-select.tsx
│   ├── multi-step-form-wrapper.tsx
│   ├── navbar
│   │   ├── navbar-left-section.tsx
│   │   └── navbar-right-section.tsx
│   ├── navbar.tsx
│   ├── select-component.tsx
│   ├── sidebar
│   │   ├── app-sidebar.tsx
│   │   ├── current-date-display.tsx
│   │   └── nav-user.tsx
│   ├── spinner.tsx
│   ├── table
│   │   ├── data-table-footer.tsx
│   │   ├── data-table-headers.tsx
│   │   └── data-table.tsx
│   ├── tooltip-wrapper.tsx
│   ├── tree.tsx
│   └── ui
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── button.tsx
│   ├── calendar.tsx
│   ├── checkbox.tsx
│   ├── collapsible.tsx
│   ├── command.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── navigation-menu.tsx
│   ├── popover.tsx
│   ├── progress.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── sonner.tsx
│   ├── table.tsx
│   ├── textarea.tsx
│   └── tooltip.tsx
├── config
│   └── auth-client.ts
├── features
│   ├── company-list
│   └── job-applications
│   ├── add-job-applications
│   │   ├── add-job-application-form-elements.tsx
│   │   └── add-job-application.tsx
│   ├── import-job-applications
│   │   ├── import-job-application.tsx
│   │   └── import-link-job-application.tsx
│   ├── job-application-columns.tsx
│   └── update-multiple-job-application.tsx
├── hooks
│   ├── use-dialog.ts
│   └── use-mobile.ts
├── input.css
├── layouts
│   └── sidebar-layout.tsx
├── lib
│   └── utils.ts
├── root.tsx
├── routes
│   ├── dashboard.tsx
│   ├── home.tsx
│   ├── job-applications.tsx
│   └── signup.tsx
├── routes.ts
├── schema
├── stores
├── tests
│   ├── format-pathname.test.ts
│   └── show-toast.test.ts
├── themes
│   ├── mode-toggle.tsx
│   └── theme-provider.tsx
├── types
│   └── features
│   └── job-application
│   └── add-job-application-types.ts
└── utils
├── fetch-request-component.ts
├── format-pathname.ts
├── show-toast.ts
└── user-signup.ts
```

## Server

```bash
/server
├── app.ts
├── config
│   ├── Context.ts
│   ├── gemini-ai.ts
│   └── global-config.ts
├── db
│   └── index.ts
├── errors
│   ├── ApplicationError.ts
│   └── handleError.ts
├── job-applications
│   ├── job-application.controller.ts
│   ├── job-application.model.ts
│   ├── job-application.route.ts
│   ├── job-application.service.ts
│   └── types
│   └── job-application.types.ts
├── middlewares
│   ├── check-user-session.ts
│   └── schema-validation.ts
├── schema
├── scraping
│   └── jobstreet-scrape.ts
├── tests
│   └── query-input-argument-symbol.test.ts
└── utils
├── asyncHandler.ts
├── query-input-argument-symbol.ts
└── swagger.ts
```

### Structure Reference

Client [here](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md).

Server [here](https://alexkondov.com/tao-of-node/#structure-in-modules).
