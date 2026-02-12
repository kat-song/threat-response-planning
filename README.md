# UNH-Hackathon-2026-Group-3
This repository is for Group 3 in Booz Allen's 2026 UNH Hackathon 


## Structure
```{code}
|-- Data                                  # For data and data dictionary storage. May add subdirectories
|  |-- unh_hackathon_prompt_2_data.json   
|  |-- Prompt 2 Data Dictionary.pdf       
|-- Notebooks                             # For data exploration and manipulation
|  |-- data_correllation_exploration.ipynb
|-- Frontend                              # Placeholder for whatever we create as our frontend deliverable
|-- README.md
|--docs # Contains documentation for the project
|--model-server # API that exposes endpoints to run predictions
|--|-- requirements.txt # Dependencies for the model server
|--|-- main.py # Main file for the model server, contains API endpoints and logic to load and run the model
```

## Model Server
The `model-server` directory contains the code for an API that exposes endpoints to run predictions using
the model we develop. The `requirements.txt` file lists the dependencies needed to run the server, and the `main.py` 
file contains the main logic for loading the model and handling API requests.

To run the model server, navigate to the `model-server` directory and install the dependencies using:
```bash
python -m venv venv  # Create a virtual environment (optional but recommended)
source venv/bin/activate  # Activate the virtual environment (Linux/Mac)
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
      "response_success": true
    },
    ...
]
```
