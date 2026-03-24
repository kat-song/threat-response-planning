# TORPedo: Threat Operational Response Prediction Tool 
Using TORPedo, threat response operations can be planned with a newfound predictive precision. TORPedo allows the user to use any information about a new threat to predict the (probability of) success of a mission and its associated costs and days to stabilization. The tool will also predict the optimal allocation of forces to deploy, and give outcomes of similar missions in the past. The underlying models rely on a dataset sourced from __ask david__. 

This project originally started as an entry in Booz Allen's 2026 UNH Hackathon, winning second place overall. I'm continuing to build it out, implementing judges' suggestions and new ideas. Original repo: https://github.com/schiffman-ben/UNH-Hackathon-2026-Group-3/tree/main

The original prompt: Joint Commands require real-time decision intelligence to counter emerging threats. Build a risk assessment tool that transforms historical threat engagement into actionable predictions. Prevent costly mission failures. Optimize warfighter deployment. Dominate the decision space. 

## Structure
```
threat-response-planning/
├── Data/
│   └── unh_hackathon_prompt_2_data.json
├── docs/
│   └── data_dictionary.md
├── frontend/                          # React dashboard application
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   ├── pages/                     # Main dashboard page
│   │   ├── services/                  # API integration
│   │   └── data/                      # Form field configurations
│   ├── package.json                   # Frontend dependencies
│   └── README.md                      # Frontend-specific documentation
├── model-server/                      # FastAPI server for ML predictions
│   ├── main.py                        # API endpoints and model loading
│   ├── requirements.txt               # Python dependencies
│   ├── models/                        # Trained model files
│   ├── train_models.py                # Model training scripts
│   ├── evaluate_models.py             # Model evaluation and metrics
│   └── README.md                      # Model server documentation
├── notebooks/                         # Data exploration and analysis
│   ├── data_exploration.ipynb
│   ├── financial_loss_model_nn.ipynb
│   ├── model_metrics.ipynb
│   └── success_classification.ipynb
├── utils/                             # Shared utilities
├── docker-compose.yml                 # Multi-service orchestration
└── README.md                          # This file
```
## Development
1. Activate virtual environment with `source .venv/bin/activate`
2. To run website locally, frontend and model server can be run in any order. 

## Frontend
The `frontend` directory contains the React dashboard for visualizing operational response plans and interacting with the API.

### Features
- **Interactive Dashboard**: Configure threat scenarios and view real-time predictions
- **Model Explainability**: Color-coded confidence indicators (red→green spectrum) and percentage scores
- **Smart Formatting**: Whole numbers for days, 1-decimal precision for financial estimates
- **Random Scenario Generation**: One-click input randomization for testing
- **USWDS Design System**: Accessible, government-standard UI components

### Running the Frontend
1. Navigate to the `Frontend` directory:

```bash
cd frontend
```

2. Install dependencies
```bash
npm install
# or if using yarn:
yarn install
```

3. Start development server
```bash
npm start
```

4. The frontend will open at `http://localhost:3000` by default.

## Model Server
The `model-server` directory contains the code for an API that exposes endpoints to run predictions using
the model we develop. The `requirements.txt` file lists the dependencies needed to run the server, and the `main.py` 
file contains the main logic for loading the model and handling API requests.

To run the model server, navigate to the `model-server` directory and install the dependencies using:
```bash
python -m venv venv  # Create a virtual environment (optional but recommended)
source .venv/bin/activate  # Activate the virtual environment (Linux/Mac)
# For Windows, use: venv\Scripts\activate
pip install -r requirements.txt
``` 
Then, you can start the server with:
```bash
fastapi dev main.py
```
To get a prediction, send a POST request to the `/inference` endpoint. The body will be a JSON list,
containing the features for which you want to get a prediction. The keys in the JSON should match the feature names in the
data dictionary. By default, the host will be `localhost:8080`, so the full URL for the 
endpoint will be `http://localhost:8080/inference`.

For example, with input:

```json
[
    {
      "Threat Type": "air"
      "Aircraft Count": 0
      ...
    },
    ...
]
```

The response will be the predictions generated, like:
```json
[
    {
      "Financial_Loss_MUSD": 100.0,
      "actual_days_to_stabilization": 30,
      "response_success": true,
      "response_success_confidence": 0.85
    },
    ...
]
```
## Notebooks 
The notebooks are where data and models are explored. Model metrics are also calculated in a separate notebook. 

## TODO: 
- Clean up frontend 
    - ~~Add min and max ranges which appead in the info section, as well as bound user input (see frontend>data>fields.js)~~
    - ~~Remove DOW logo (liability reasonsss)~~
- Figure out how to host website on Github Pages 
- Clean up notebooks and model server by adding functions to utils.py 
- Consolidate model metrics in notebooks and READMEs 
- Improve models 
    - Prevent negative numbers with logistic transform 
- Add optimization / recommendations 
    - k-nearest neighbors ?? or some kind of clustering 
    - Implement NSGA-II 
    - Explore other industrial algorithms (forgot which ones the guy mentioned but yeah) 
- Add frontend features 
    - Model explainability (confidence score, color signals, significant features )
    - Page with model metrics 