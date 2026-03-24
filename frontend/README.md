# TORPedo Frontend - Threat Operational Response Dashboard

A React-based dashboard for the TORPedo (Threat Operational Response Prediction) tool, providing real-time decision intelligence for threat response operations.

## Overview

This frontend application serves as the user interface for TORPedo, allowing military planners to:

- Configure threat assessment parameters and force posture
- Run predictive models for mission success probability
- View financial loss estimates and stabilization timelines
- Visualize confidence scores with color-coded indicators
- Generate randomized inputs for scenario planning

## Features

### Dashboard Components
- **Threat & Environment Configuration**: Input fields for threat type, enemy capabilities, weather conditions, and operational constraints
- **Force Allocation Panel**: Configure available assets, budget, and readiness scores
- **Operational Capability Scores**: Set readiness, resilience, and confidence indicators
- **Live Summary Panel**: Real-time display of model predictions including:
  - Response success probability with confidence-based color coding (red→green spectrum)
  - Financial loss estimates (1 decimal precision)
  - Days to stabilization (whole number format)

### Key Functionality
- **Randomize Inputs**: Generate valid test scenarios with one click
- **Real-time Inference**: Connects to the model server API for live predictions
- **Responsive Design**: USWDS-based styling for accessibility and mobile compatibility
- **Form Validation**: Input bounds and type checking based on data dictionary

## Technology Stack

- **React 19** - Modern React with hooks and concurrent features
- **React Router DOM** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **USWDS (U.S. Web Design System)** - Government-standard UI components
- **Create React App** - Build tooling and development server

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Access to the TORPedo model server API (typically running on port 8000)

### Installation
```bash
cd frontend
npm install
```

### Running the Application
```bash
npm start
```

The application will start on `http://localhost:3000` and automatically connect to the model server at `http://localhost:8000`.

### Testing
```bash
npm test
```

Runs the test suite in interactive watch mode.

### Build for Production
```bash
npm run build
```

Creates an optimized production build in the `build` folder.

## API Integration

The frontend communicates with the FastAPI model server through the following endpoints:

- `POST /inference` - Run predictions on threat scenarios
- Request format: Array of threat configuration objects
- Response format: Array of prediction results with confidence scores

## Configuration

### Environment Variables
- `REACT_APP_API_URL` - Model server URL (defaults to `http://localhost:8000`)

### Data Fields
Field definitions and validation rules are configured in `src/data/fields.js`, including:
- Input types (number, select, text)
- Min/max ranges and step values
- Field descriptions and labels

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.jsx      # Application header with navigation
│   │   ├── Footer.jsx      # Application footer
│   │   └── InfoTooltip.jsx # Contextual help tooltips
│   ├── context/            # React context providers
│   │   └── Theme.jsx       # Theme and styling context
│   ├── data/               # Configuration data
│   │   └── fields.js       # Form field definitions
│   ├── pages/              # Page components
│   │   └── Dashboard.jsx   # Main dashboard interface
│   ├── services/           # API integration
│   │   └── api.js          # Model server communication
│   └── App.js              # Main application component
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Related Documentation

- [Main Project README](../README.md) - Overview of the complete TORPedo system
- [Model Server README](../model-server/README.md) - API documentation and model details
- [Data Dictionary](../docs/data_dictionary.md) - Input/output field specifications


React info below: 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).