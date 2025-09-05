# NX Monorepo For React

![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![pnpm](https://img.shields.io/badge/pnpm-10.x-blue)
![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)
![NX](https://img.shields.io/badge/NX-21.x-orange)

This project is an **NX monorepo** using **React** with **Zustand** for state management. It is responsive and supports dark mode based on the system settings.

---

## Features

- **React with NX:** Monorepo setup for scalable development.  
- **State Management:** Using [Zustand](https://github.com/pmndrs/zustand).  
- **Dark Mode:** Automatically adapts to the system's dark/light mode.  
- **Responsive:** Works on all screen sizes including mobile, tablet, and desktop.  

---

## Prerequisites

Make sure you have **Node.js** installed. Then, install **pnpm** globally:

```bash
npm install -g pnpm
```

Verify the installation:

```bash
pnpm -v
```

---

## Getting Started

1. **Install dependencies**

```bash
pnpm install
```

2. **Start the React app**

```bash
pnpm start
```

The app will start on **[http://localhost:4200](http://localhost:4200)**.

---

## Additional Notes

* This monorepo is managed with **NX**, allowing you to easily scale and add multiple applications or libraries.
* **Zustand** is used for state management, providing a simple and efficient way to manage global state.
* The app automatically switches to dark mode if your system is set to dark mode.
* Fully **responsive UI**, tested on mobile, and desktop.

---

## License

[MIT](LICENSE)

