# ATOS: A Thought Organization System
- [ATOS: A Thought Organization System](#atos-a-thought-organization-system)
  - [System Overview](#system-overview)
  - [System Features:](#system-features)
  - [Install the dependencies](#install-the-dependencies)
    - [Start the app in development mode (hot-code reloading, error reporting, etc.)](#start-the-app-in-development-mode-hot-code-reloading-error-reporting-etc)
    - [Lint the files](#lint-the-files)
    - [Format the files](#format-the-files)
    - [Build the app for production](#build-the-app-for-production)
    - [Customize the configuration](#customize-the-configuration)
  - [Dev Goals](#dev-goals)
    - [Todos:](#todos)
      - [by file](#by-file)
    - [other todos](#other-todos)
  - [AI Suggestions](#ai-suggestions)
    - [UI Enhancements](#ui-enhancements)
      - [Notifications:](#notifications)
      - [Dialogs:](#dialogs)
      - [Breadcrumbs:](#breadcrumbs)
    - [Performance](#performance)
      - [Recursive Functions:](#recursive-functions)
      - [API Calls:](#api-calls)
  - [Overall Suggestions](#overall-suggestions)
    - [Issues and Suggestions:](#issues-and-suggestions)
      - [1. **Error Handling in `getApiData`**:](#1-error-handling-in-getapidata)
      - [3. **`onChange` Function**:](#3-onchange-function)
      - [5. **Hardcoded Strings**:](#5-hardcoded-strings)
      - [6. **Performance Optimization**:](#6-performance-optimization)
      - [7. **JSONEditor.vue Props Filtering**:](#7-jsoneditorvue-props-filtering)
      - [8. **CSS Improvements**:](#8-css-improvements)
    - [Additional Suggestions:](#additional-suggestions)
    - [Summary:](#summary)

## System Overview

- a system for me to organize my thoughts.
- It is a visual tree, albeit upside down, that simulates my thinking patterns and logic systems.
- It is an ever-evolving project that I hope to be working on the day I leave.

## System Features:

- Simple file system structure for visualizing my essence to the most frivolous whims
- Drill down based on ST Logic
- The system works by "_Bubblen  my categories naturally to the top".


## Install the dependencies

<details>
  <summary>Details</summary>

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).


  </details>

## Dev Goals
<details>
  <summary> In Process Dev Goals</summary>
  
### Todos:
#### by file
- NodeModelEditor.vue
  - [ ] assess the need for notification on page
  - [ ] Styling ( two column layout)
  - [x] ***Save with ID***
   
- ApiViewer.vue
  - [ ] is the subscript operator, which you use to denote a child element of the current element (by name or index).

- thoughts.js (STORE)
  - [ ] Add error handling for actions like addNode, updateNodeById, and removeNodeById to handle edge cases (e.g., invalid IDs).


### other todos
- [ ] Add settings page for:
  - [ ] Save to local vs save to backend (file for now)
  - [ ] themes
  - [ ] Add StoryBook for documentation and prototyping

## AI Suggestions
  
### UI Enhancements
- [ ] The ```queryBasics``` dialog is informative, but consider adding examples or a live preview for JSONPath queries.
- [ ] use the global dialog for ``` queryBasics```
  
#### Notifications:

- [ ] Notifications are used effectively, but consider adding more user feedback for actions like updateNodeById and removeNodeById.

#### Dialogs:

- [ ] Ensure dialogs are accessible and provide clear instructions to the user.
#### Breadcrumbs:

- [ ] The breadcrumbs in ThoughtsRoot.vue are functional, but clicking on a breadcrumb could collapse unrelated nodes. Ensure the behavior is intuitive.

### Performance
#### Recursive Functions:

 - [ ] Functions like getLabelPath, updateNodeById, and removeNodeById could be optimized for large trees by using iterative approaches or memoization.
#### API Calls:

- [ ] The getThoughts action fetches data from an API. Consider adding a debounce mechanism to prevent excessive calls.

## Overall Suggestions
- [ ] Add unit tests for critical functions like updateNodeById, removeNodeById, and getLabelPath.
Use TypeScript or JSDoc comments to define types for better maintainability.
- [ ] Ensure consistent error handling and logging across the codebase.
- [ ] Optimize recursive functions for better performance with large datasets.
- [ ] Improve form validation and reactivity in NodeModelEditor.vue.
 
- [ ] :star: ***Hardcoded Strings*** - Strings like "Loading..." and "Failed to fetch API data." are hardcoded. Use a localization library or constants for better maintainability  (e.g., vue-i18n). 
- [ ] Here is a review of the provided code:



### Issues and Suggestions:

#### 1. **Error Handling in `getApiData`**:
   - The `getApiData` function does not handle errors from `thoughtStore.getThoughts(url)`. If the API call fails, the user won't receive feedback.
   - **Suggestion**: Add error handling to display meaningful messages to the user.

   ```javascript
   const getApiData = async (url) => {
     const barRef = bar.value;
     barRef.start();
     try {
       await thoughtStore.getThoughts(url);
     } catch (err) {
       console.error('Error fetching API data:', err);
       thoughtStore.error.value = 'Failed to fetch API data.';
     } finally {
       barRef.stop();
     }
   };
   ```

---


#### 3. **`onChange` Function**:
   - The `onChange` function uses `this.content`, which is not defined in the `script setup` context.
   - **Suggestion**: Remove `this.content` or replace it with a reactive variable.

   ```javascript
   const onChange = (content) => {
     console.log('onChange', content);
     // Handle content changes here
   };
   ```

---

#### 5. **Hardcoded Strings**:
   - Strings like `"Loading..."` and `"Failed to fetch API data."` are hardcoded.
   - **Suggestion**: Use a localization library or constants for better maintainability.

---

#### 6. **Performance Optimization**:
   - The `watch` on `thoughtStore.currentUrl` triggers `getApiData` on every change. If the API call is expensive, this could lead to performance issues.
   - **Suggestion**: Debounce the API call or add a condition to prevent unnecessary calls.

---

#### 7. **JSONEditor.vue Props Filtering**:
   - The `filterProps` function is unnecessarily complex.
   - **Suggestion**: Simplify the filtering logic.

   ```javascript
   function filterProps(props, prevProps) {
     return Object.fromEntries(
       Object.entries(props).filter(([key, value]) => 
         supportedPropNamesSet.has(key) && value !== prevProps[key]
       )
     );
   }
   ```

---

#### 8. **CSS Improvements**:
   - The `pre` styles in ApiViewer.vue could use a more modern approach for responsiveness.
  
---

### Additional Suggestions:

1. **Unit Tests**:
   - Add unit tests for critical functions like `getApiData` and `queryJSONPath` to ensure reliability.

2. **Accessibility**:
   - Ensure all interactive elements (e.g., buttons, toggles) are accessible with proper ARIA attributes.

---

### Summary:
The code is well-written and functional but could benefit from improved error handling, performance optimizations, and minor refactoring for clarity and maintainability.
</details>

