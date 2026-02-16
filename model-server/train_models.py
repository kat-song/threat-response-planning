"""Train PCA + Logistic Regression models for each threat type."""
import pandas as pd
import numpy as np
import pickle
from pathlib import Path
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import accuracy_score


def load_and_clean_data(file_path: str) -> pd.DataFrame:
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
    
    return df


def normalize_threat_type(threat_type: str) -> str:
    """Normalize threat types."""
    threat_type = threat_type.strip().lower()
    if threat_type == "msl":
        return "missile"
    return threat_type


def train_model_for_threat_type(threat_df, threat_name, max_components=26, 
                                val_fraction=0.2, random_state=42):
    """
    Train a Logistic Regression model with PCA for a specific threat type.
    
    Args:
        threat_df: DataFrame for a specific threat type
        threat_name: Name of the threat type
        max_components: Maximum number of PCA components to test
        val_fraction: Fraction of data to use for validation
        random_state: Random seed for reproducibility
    
    Returns:
        Dictionary with trained models and metadata
    """
    print(f"\n{'='*70}")
    print(f"Training model for {threat_name.upper()} threat type")
    print(f"{'='*70}")
    
    # Prepare the data
    exclude_cols = ["Threat Type", "response_success", "actual_days_to_stabilization", 
                   "Financial_Loss_MUSD", "Season"]
    numeric_cols = [col for col in threat_df.columns 
                   if col not in exclude_cols and threat_df[col].dtype in ['int64', 'float64']]
    
    # Get features and target
    X = threat_df[numeric_cols].fillna(threat_df[numeric_cols].median())
    y = threat_df["response_success"]
    
    # Split into train and validation
    val_size = int(len(X) * val_fraction)
    indices = np.arange(len(X))
    np.random.seed(random_state)
    np.random.shuffle(indices)
    
    val_indices = indices[:val_size]
    train_indices = indices[val_size:]
    
    X_train, X_val = X.iloc[train_indices], X.iloc[val_indices]
    y_train, y_val = y.iloc[train_indices], y.iloc[val_indices]
    
    # Calculate median values for imputation
    median_values = X_train.median()
    
    # Standardize
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    
    # Determine maximum possible components
    max_possible_components = min(max_components, X_train_scaled.shape[1], X_train_scaled.shape[0])
    
    # First, fit PCA with all components to get all eigenvalues
    pca_full = PCA(n_components=max_possible_components)
    pca_full.fit(X_train_scaled)
    all_explained_variance_ratio = pca_full.explained_variance_ratio_
    
    # Test different numbers of components to find the best
    best_accuracy = 0
    best_n_components = 1
    best_model = None
    best_pca = None
    
    print(f"Testing {max_possible_components} different PCA configurations...")
    
    for n_comp in range(1, max_possible_components + 1):
        # Apply PCA with n_comp components
        pca = PCA(n_components=n_comp)
        X_train_pca = pca.fit_transform(X_train_scaled)
        X_val_pca = pca.transform(X_val_scaled)
        
        # Train Logistic Regression
        lr = LogisticRegression(random_state=random_state, max_iter=10000)
        lr.fit(X_train_pca, y_train)
        
        # Evaluate on validation set
        val_acc = accuracy_score(y_val, lr.predict(X_val_pca))
        
        if val_acc > best_accuracy:
            best_accuracy = val_acc
            best_n_components = n_comp
            best_model = lr
            best_pca = pca
    
    # Report best configuration
    print(f"\nBest Configuration:")
    print(f"  Number of components: {best_n_components}")
    print(f"  Validation accuracy: {best_accuracy:.4f}")
    cumulative_variance = np.sum(best_pca.explained_variance_ratio_) * 100
    print(f"  Cumulative variance explained: {cumulative_variance:.2f}%")
    
    # Package the model components
    model_package = {
        'threat_type': threat_name,
        'scaler': scaler,
        'pca': best_pca,
        'model': best_model,
        'n_components': best_n_components,
        'feature_names': numeric_cols,
        'median_values': median_values,
        'validation_accuracy': best_accuracy,
        'cumulative_variance_explained': cumulative_variance
    }
    
    return model_package


def main():
    """Main training function."""
    # Load and prepare data
    data_path = "../Data/unh_hackathon_prompt_2_data.json"
    print(f"Loading data from {data_path}...")
    df = load_and_clean_data(data_path)
    
    # Normalize threat types
    df["Threat Type"] = df["Threat Type"].apply(normalize_threat_type)
    
    # Define train fraction (use 80% for training, 20% for testing)
    TRAIN_FRACTION = 0.8
    train_size = int(len(df) * TRAIN_FRACTION)
    train_df = df.iloc[:train_size]
    test_df = df.iloc[train_size:]
    
    print(f"\nData split:")
    print(f"  Training samples: {len(train_df)}")
    print(f"  Test samples: {len(test_df)}")
    
    # Create threat-specific dataframes
    threat_types = ['cyber', 'missile', 'hybrid', 'air', 'naval']
    threat_dfs = {}
    
    for threat_name in threat_types:
        threat_dfs[threat_name] = train_df[train_df["Threat Type"] == threat_name].copy()
        print(f"  {threat_name.capitalize()}: {len(threat_dfs[threat_name])} samples")
    
    # Train a model for each threat type
    models = {}
    for threat_name, threat_df in threat_dfs.items():
        model_package = train_model_for_threat_type(
            threat_df, 
            threat_name, 
            max_components=26,
            val_fraction=0.2,
            random_state=42
        )
        models[threat_name] = model_package
    
    # Save all models
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    print(f"\n{'='*70}")
    print("Saving models...")
    print(f"{'='*70}")
    
    for threat_name, model_package in models.items():
        model_path = models_dir / f"{threat_name}_model.pkl"
        with open(model_path, 'wb') as f:
            pickle.dump(model_package, f)
        print(f"  Saved {threat_name} model to {model_path}")
    
    # Save summary
    summary = {
        'threat_types': threat_types,
        'model_info': {
            threat_name: {
                'n_components': pkg['n_components'],
                'validation_accuracy': pkg['validation_accuracy'],
                'variance_explained': pkg['cumulative_variance_explained']
            }
            for threat_name, pkg in models.items()
        }
    }
    
    summary_path = models_dir / "model_summary.pkl"
    with open(summary_path, 'wb') as f:
        pickle.dump(summary, f)
    print(f"\n  Saved model summary to {summary_path}")
    
    print(f"\n{'='*70}")
    print("MODEL TRAINING COMPLETE")
    print(f"{'='*70}")
    
    # Print summary table
    print("\nModel Summary:")
    print(f"{'Threat Type':<15} {'Components':<12} {'Val Accuracy':<15} {'Variance Explained':<20}")
    print("-" * 70)
    for threat_name in threat_types:
        info = summary['model_info'][threat_name]
        print(f"{threat_name.capitalize():<15} {info['n_components']:<12} {info['validation_accuracy']:.4f}         {info['variance_explained']:.2f}%")


if __name__ == "__main__":
    main()
