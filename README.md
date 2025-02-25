# Project Management Application

This is a React-based client application built with Next.js and designed to provide a seamless and responsive user experience. The app uses various modern libraries for state management, UI components, data visualization, and more.

## Features

- **Next.js** for server-side rendering and static site generation.
- **Material UI** and **Lucide React** for UI components and icons.
- **Redux Toolkit** and **Redux Persist** for state management and persistence.
- **Recharts** and **Gantt Task React** for interactive charts and task scheduling.
- **Date-fns** for handling dates and times.
- **Axios** for HTTP requests.
- **Tailwind CSS** for utility-first styling.
  
## Prerequisites

Make sure you have the following installed:

- **Node.js** (version >= 16.x)
- **npm** or **yarn**

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   ```

2. Install the dependencies:

   ```bash
   cd client
   npm install
   ```

3. Set up environment variables:

   - Create a `.env.local` file in the root directory.
   - Add the necessary configuration based on your environment.

## Development

To start the development server, run:

```bash
npm run dev
```

This will start the application on `http://localhost:3000` by default.

## Build and Production

To create a production build, run:

```bash
npm run build
```

After the build is complete, you can start the production server:

```bash
npm run start
```

## Linting

To run the linting tool (ESLint) and check for code style issues:

```bash
npm run lint
```

## Available Scripts

- **dev**: Starts the development server.
- **build**: Builds the project for production.
- **start**: Starts the production server.
- **lint**: Runs ESLint to check for any linting issues.

## Dependencies

The application uses the following dependencies:

- `@emotion/react`, `@emotion/styled`: For styling with Emotion.
- `@mui/material`: For Material UI components.
- `@mui/x-data-grid`: For the data grid.
- `@reduxjs/toolkit`, `react-redux`: For state management with Redux.
- `axios`: For making HTTP requests.
- `date-fns`: For date utilities.
- `dotenv`: For managing environment variables.
- `gantt-task-react`: For Gantt chart functionality.
- `lucide-react`: For icons.
- `next`: The Next.js framework for React.
- `numeral`: For number formatting.
- `react-dnd`, `react-dnd-html5-backend`: For drag-and-drop functionality.
- `recharts`: For charting.
- `redux-persist`: For persisting Redux state.

## Dev Dependencies

The development dependencies include tools for linting, formatting, and TypeScript support:

- `eslint`: Linting tool.
- `prettier`, `prettier-plugin-tailwindcss`: Code formatting tool.
- `tailwindcss`, `tailwind-merge`: Tailwind CSS utilities for styling.
- `typescript`: For TypeScript support.
- `@types/*`: TypeScript definitions for various libraries.

## Contributing

Feel free to fork this project, make improvements, and submit pull requests. Please ensure that your changes pass linting and formatting checks before submitting.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.