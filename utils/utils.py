import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.linear_model import ElasticNetCV
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error

def load_predictive_warfighting_data(file_path: str = "unh_hackathon_prompt_2_data.json") -> pd.DataFrame:
    """Load data from a CSV file into a pandas DataFrame."""
    return pd.read_json(file_path) 

def load_and_clean_warfighting_data(file_path: str) -> pd.DataFrame:
    """Load and clean the data."""
    df = pd.read_json(file_path)
    
    # Convert the string "NULL" to pd.NA
    df = df.replace("NULL", pd.NA)
    df = df.replace("N/A", pd.NA)

    # Convert numeric string columns
    for numeric_string_column in [
        "Enemy.Capability.Index",
        "EW_Capability",
        "Intel Confidence",
    ]:
        df[numeric_string_column] = pd.to_numeric(df[numeric_string_column])

    # Convert boolean string column
    df["response_success"] = df["response_success"].map({"Yes": 1, "No": 0, "1": 1, "0": 0})

    # Standardize threat type names
    # replace "msl" with "missile" and standardize case and whitespace
    
    df["Threat Type"] = df["Threat Type"].str.replace("msl", "missile", case=False, regex=True)
    df["Threat Type"] = df["Threat Type"].str.strip()  # Remove leading/trailing whitespace
    df["Threat Type"] = df["Threat Type"].str.lower()  # Convert to lowercase for consistency
    return df

def calculate_metrics(true_values, predictions, print_results=True):
    mae = mean_absolute_error(true_values, predictions)
    r2 = r2_score(true_values, predictions)
    rmse = np.sqrt(mean_squared_error(true_values, predictions))
    mape = np.mean(np.abs((true_values - predictions) / true_values)) * 100

    if print_results:
        print(f"Mean Absolute Error (MAE): {mae:.6f}")
        print(f"Root Mean Squared Error (RMSE): {rmse:.6f}")
        print(f"R² Score: {r2:.6f}")
        print(f"Mean Absolute Percentage Error (MAPE): {mape:.2f}%")  
    return mae, r2, rmse, mape