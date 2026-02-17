"""Comprehensive evaluation of trained PCA + Logistic Regression models."""
import pandas as pd
import numpy as np
import pickle
from pathlib import Path
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix, classification_report


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


def evaluate_model_on_dataset(model_package, X, y, dataset_name="Dataset"):
    """
    Evaluate a single model on a dataset.
    
    Args:
        model_package: Dictionary containing trained model components
        X: Feature DataFrame
        y: True labels
        dataset_name: Name for display purposes
    
    Returns:
        Dictionary with evaluation metrics
    """
    scaler = model_package['scaler']
    pca = model_package['pca']
    model = model_package['model']
    feature_names = model_package['feature_names']
    median_values = model_package['median_values']
    
    # Ensure features are in the correct order
    X_ordered = X[feature_names].fillna(median_values)
    
    # Apply transformations
    X_scaled = scaler.transform(X_ordered)
    X_pca = pca.transform(X_scaled)
    
    # Get predictions
    y_pred = model.predict(X_pca)
    y_proba = model.predict_proba(X_pca)
    
    # Calculate metrics
    accuracy = accuracy_score(y, y_pred)
    precision = precision_score(y, y_pred, zero_division=0)
    recall = recall_score(y, y_pred, zero_division=0)
    
    # Confusion matrix
    tn, fp, fn, tp = confusion_matrix(y, y_pred).ravel()
    
    return {
        'dataset': dataset_name,
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'true_positives': int(tp),
        'true_negatives': int(tn),
        'false_positives': int(fp),
        'false_negatives': int(fn),
        'n_samples': len(y),
        'n_positive': int(y.sum()),
        'n_negative': int(len(y) - y.sum())
    }


def evaluate_all_models(data_path: str, models_dir: Path):
    """
    Evaluate all trained models on train and test datasets.
    
    Args:
        data_path: Path to the data file
        models_dir: Directory containing trained models
    
    Returns:
        Dictionary with comprehensive evaluation results
    """
    print("="*80)
    print("MODEL EVALUATION: PCA + LOGISTIC REGRESSION")
    print("="*80)
    
    # Load data
    print(f"\nLoading data from {data_path}...")
    df = load_and_clean_data(data_path)
    df["Threat Type"] = df["Threat Type"].apply(normalize_threat_type)
    
    # Split into train and test (same as training)
    TRAIN_FRACTION = 0.8
    train_size = int(len(df) * TRAIN_FRACTION)
    train_df = df.iloc[:train_size]
    test_df = df.iloc[train_size:]
    
    print(f"  Training samples: {len(train_df)}")
    print(f"  Test samples: {len(test_df)}")
    
    # Prepare features
    exclude_cols = ["Threat Type", "response_success", "actual_days_to_stabilization", 
                   "Financial_Loss_MUSD", "Season"]
    
    # Load models
    threat_types = ['cyber', 'missile', 'hybrid', 'air', 'naval']
    models = {}
    
    print(f"\nLoading models from {models_dir}...")
    for threat_name in threat_types:
        model_path = models_dir / f"{threat_name}_model.pkl"
        with open(model_path, 'rb') as f:
            models[threat_name] = pickle.load(f)
        print(f"  Loaded {threat_name} model")
    
    # Evaluate each model
    all_results = []
    
    for threat_name in threat_types:
        print(f"\n{'='*80}")
        print(f"Evaluating {threat_name.upper()} Model")
        print(f"{'='*80}")
        
        model_package = models[threat_name]
        
        # Get threat-specific data
        train_threat = train_df[train_df["Threat Type"] == threat_name].copy()
        test_threat = test_df[test_df["Threat Type"] == threat_name].copy()
        
        print(f"  Train samples: {len(train_threat)}")
        print(f"  Test samples: {len(test_threat)}")
        
        # Get features and labels
        numeric_cols = [col for col in train_threat.columns 
                       if col not in exclude_cols and train_threat[col].dtype in ['int64', 'float64']]
        
        X_train = train_threat[numeric_cols]
        y_train = train_threat["response_success"]
        
        X_test = test_threat[numeric_cols]
        y_test = test_threat["response_success"]
        
        # Evaluate on train set
        train_results = evaluate_model_on_dataset(
            model_package, X_train, y_train, "Train"
        )
        train_results['threat_type'] = threat_name
        all_results.append(train_results)
        
        print(f"\n  Train Set Performance:")
        print(f"    Accuracy:  {train_results['accuracy']:.4f}")
        print(f"    Precision: {train_results['precision']:.4f}")
        print(f"    Recall:    {train_results['recall']:.4f}")
        
        # Evaluate on test set
        if len(test_threat) > 0:
            test_results = evaluate_model_on_dataset(
                model_package, X_test, y_test, "Test"
            )
            test_results['threat_type'] = threat_name
            all_results.append(test_results)
            
            print(f"\n  Test Set Performance:")
            print(f"    Accuracy:  {test_results['accuracy']:.4f}")
            print(f"    Precision: {test_results['precision']:.4f}")
            print(f"    Recall:    {test_results['recall']:.4f}")
            print(f"\n  Confusion Matrix (Test):")
            print(f"    True Positives:  {test_results['true_positives']}")
            print(f"    True Negatives:  {test_results['true_negatives']}")
            print(f"    False Positives: {test_results['false_positives']}")
            print(f"    False Negatives: {test_results['false_negatives']}")
        else:
            print(f"\n  No test samples available for {threat_name}")
    
    # Create comprehensive results DataFrame
    results_df = pd.DataFrame(all_results)
    
    # Calculate overall metrics (weighted by number of samples)
    print(f"\n{'='*80}")
    print("OVERALL PERFORMANCE SUMMARY")
    print(f"{'='*80}")
    
    for dataset_name in ['Train', 'Test']:
        dataset_results = results_df[results_df['dataset'] == dataset_name]
        
        if len(dataset_results) > 0:
            # Weighted average
            total_samples = dataset_results['n_samples'].sum()
            weighted_accuracy = (dataset_results['accuracy'] * dataset_results['n_samples']).sum() / total_samples
            weighted_precision = (dataset_results['precision'] * dataset_results['n_samples']).sum() / total_samples
            weighted_recall = (dataset_results['recall'] * dataset_results['n_samples']).sum() / total_samples
            
            print(f"\n{dataset_name} Set Overall (Weighted Average):")
            print(f"  Total Samples: {total_samples}")
            print(f"  Accuracy:      {weighted_accuracy:.4f}")
            print(f"  Precision:     {weighted_precision:.4f}")
            print(f"  Recall:        {weighted_recall:.4f}")
    
    # Per-threat-type summary table
    print(f"\n{'='*80}")
    print("PER-THREAT-TYPE DETAILED RESULTS")
    print(f"{'='*80}\n")
    
    # Create pivot tables for easier viewing
    for metric in ['accuracy', 'precision', 'recall']:
        print(f"\n{metric.upper()} by Threat Type:")
        pivot = results_df.pivot(index='threat_type', columns='dataset', values=metric)
        print(pivot.to_string())
    
    # Sample counts
    print(f"\nSAMPLE COUNTS by Threat Type:")
    pivot = results_df.pivot(index='threat_type', columns='dataset', values='n_samples')
    print(pivot.to_string())
    
    # Create detailed summary table
    print(f"\n{'='*80}")
    print("COMPLETE RESULTS TABLE")
    print(f"{'='*80}\n")
    
    summary_df = results_df[[
        'threat_type', 'dataset', 'n_samples', 
        'accuracy', 'precision', 'recall',
        'true_positives', 'true_negatives', 
        'false_positives', 'false_negatives'
    ]].copy()
    
    # Format for display
    summary_df['accuracy'] = summary_df['accuracy'].apply(lambda x: f"{x:.4f}")
    summary_df['precision'] = summary_df['precision'].apply(lambda x: f"{x:.4f}")
    summary_df['recall'] = summary_df['recall'].apply(lambda x: f"{x:.4f}")
    
    print(summary_df.to_string(index=False))
    
    print(f"\n{'='*80}")
    print("EVALUATION COMPLETE")
    print(f"{'='*80}")
    
    # Save results to CSV
    results_path = models_dir / "evaluation_results.csv"
    results_df.to_csv(results_path, index=False)
    print(f"\nResults saved to {results_path}")
    
    return results_df


def main():
    """Main evaluation function."""
    data_path = "../Data/unh_hackathon_prompt_2_data.json"
    models_dir = Path("models")
    
    results = evaluate_all_models(data_path, models_dir)


if __name__ == "__main__":
    main()
