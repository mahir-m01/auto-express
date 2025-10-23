# Express Project Generator — Auto Express

<div style="text-align:center">
  <a href="https://www.npmjs.com/package/auto-express">
    <img src="https://img.shields.io/npm/v/auto-express?style=for-the-badge" alt="NPM Version">
  </a>
  <a href="https://www.npmjs.com/package/auto-express">
    <img src="https://img.shields.io/npm/dt/auto-express?style=for-the-badge" alt="NPM Downloads">
  </a>
  <a href="https://github.com/arya2004/auto-express/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/auto-express?style=for-the-badge" alt="License">
  </a>
  <a href="https://github.com/arya2004/auto-express/issues">
    <img src="https://img.shields.io/github/issues/arya2004/auto-express?style=for-the-badge" alt="GitHub issues">
  </a>
</div>

A lightweight generator/CLI for bootstrapping Express.js projects with options for API or MVC structure, database integration, and optional view engines.

---

## Features

- Create Express.js projects with either MVC or API layouts
- Database integration templates for MongoDB, PostgreSQL, MySQL, and SQL Server
- Optional view engine scaffolding (EJS, Pug, Handlebars)
- Example demo (weather model + controller + API endpoint)
- Interactive CLI to customize generated projects

---

## Installation

Install the generator globally to use it as a CLI tool:

```bash
npm install -g auto-express
```

---

## Usage

- Start the interactive CLI:

```bash
auto-express init
```

- Quickly generate a new API project:

```bash
auto-express new my-express-api
```

- Choose package manager (npm default, or pass `--pm yarn` / `--pm pnpm`):

```bash
auto-express new my-express-api --pm yarn
```

The CLI will show the correct install and start commands for the chosen package manager.

---

## Environment variables

Use a `.env` file and `dotenv` to store secrets like DB URLs and API keys.

Example `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mydb
```

Load variables in your `server.js` / `app.js`:

```js
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello from Auto Express 🚀'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
```

---

## Contributing

Contributions welcome — see `CONTRIBUTING.md` for guidelines on pull requests, issues, and coding standards.

---

## Code of Conduct

This project follows the `CODE_OF_CONDUCT.md` — please be respectful and welcoming.

---

## License

MIT. See `LICENSE` for details.

---

Happy coding! 🚀
