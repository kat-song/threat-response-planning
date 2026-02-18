"""Generate visualizations for model evaluation results."""
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path


def visualize_evaluation_results(results_path: Path):
    """
    Create comprehensive visualizations of model evaluation results.
    
    Args:
        results_path: Path to the evaluation_results.csv file
    """
    # Load results
    results_df = pd.read_csv(results_path)
    
    # Create figure with subplots
    fig = plt.figure(figsize=(20, 12))
    
    # 1. Accuracy comparison (Train vs Test) by threat type
    ax1 = plt.subplot(2, 3, 1)
    threat_types = results_df['threat_type'].unique()
    x = np.arange(len(threat_types))
    width = 0.35
    
    train_acc = []
    test_acc = []
    for threat in threat_types:
        train_val = results_df[(results_df['threat_type'] == threat) & 
                              (results_df['dataset'] == 'Train')]['accuracy'].values[0]
        test_val = results_df[(results_df['threat_type'] == threat) & 
                             (results_df['dataset'] == 'Test')]['accuracy'].values[0]
        train_acc.append(train_val)
        test_acc.append(test_val)
    
    ax1.bar(x - width/2, train_acc, width, label='Train', alpha=0.8, color='steelblue')
    ax1.bar(x + width/2, test_acc, width, label='Test', alpha=0.8, color='coral')
    ax1.set_xlabel('Threat Type', fontweight='bold', fontsize=11)
    ax1.set_ylabel('Accuracy', fontweight='bold', fontsize=11)
    ax1.set_title('Accuracy: Train vs Test by Threat Type', fontweight='bold', fontsize=13)
    ax1.set_xticks(x)
    ax1.set_xticklabels([t.capitalize() for t in threat_types])
    ax1.legend()
    ax1.grid(True, alpha=0.3, axis='y')
    ax1.set_ylim([0.85, 1.0])
    
    # 2. Precision comparison
    ax2 = plt.subplot(2, 3, 2)
    train_prec = []
    test_prec = []
    for threat in threat_types:
        train_val = results_df[(results_df['threat_type'] == threat) & 
                              (results_df['dataset'] == 'Train')]['precision'].values[0]
        test_val = results_df[(results_df['threat_type'] == threat) & 
                             (results_df['dataset'] == 'Test')]['precision'].values[0]
        train_prec.append(train_val)
        test_prec.append(test_val)
    
    ax2.bar(x - width/2, train_prec, width, label='Train', alpha=0.8, color='steelblue')
    ax2.bar(x + width/2, test_prec, width, label='Test', alpha=0.8, color='coral')
    ax2.set_xlabel('Threat Type', fontweight='bold', fontsize=11)
    ax2.set_ylabel('Precision', fontweight='bold', fontsize=11)
    ax2.set_title('Precision: Train vs Test by Threat Type', fontweight='bold', fontsize=13)
    ax2.set_xticks(x)
    ax2.set_xticklabels([t.capitalize() for t in threat_types])
    ax2.legend()
    ax2.grid(True, alpha=0.3, axis='y')
    ax2.set_ylim([0.85, 1.0])
    
    # 3. Recall comparison
    ax3 = plt.subplot(2, 3, 3)
    train_rec = []
    test_rec = []
    for threat in threat_types:
        train_val = results_df[(results_df['threat_type'] == threat) & 
                              (results_df['dataset'] == 'Train')]['recall'].values[0]
        test_val = results_df[(results_df['threat_type'] == threat) & 
                             (results_df['dataset'] == 'Test')]['recall'].values[0]
        train_rec.append(train_val)
        test_rec.append(test_val)
    
    ax3.bar(x - width/2, train_rec, width, label='Train', alpha=0.8, color='steelblue')
    ax3.bar(x + width/2, test_rec, width, label='Test', alpha=0.8, color='coral')
    ax3.set_xlabel('Threat Type', fontweight='bold', fontsize=11)
    ax3.set_ylabel('Recall', fontweight='bold', fontsize=11)
    ax3.set_title('Recall: Train vs Test by Threat Type', fontweight='bold', fontsize=13)
    ax3.set_xticks(x)
    ax3.set_xticklabels([t.capitalize() for t in threat_types])
    ax3.legend()
    ax3.grid(True, alpha=0.3, axis='y')
    ax3.set_ylim([0.85, 1.0])
    
    # 4. Test set metrics comparison (grouped by metric)
    ax4 = plt.subplot(2, 3, 4)
    metrics = ['Accuracy', 'Precision', 'Recall']
    x_pos = np.arange(len(threat_types))
    width = 0.25
    
    for i, metric in enumerate(metrics):
        values = []
        for threat in threat_types:
            val = results_df[(results_df['threat_type'] == threat) & 
                           (results_df['dataset'] == 'Test')][metric.lower()].values[0]
            values.append(val)
        offset = (i - 1) * width
        ax4.bar(x_pos + offset, values, width, label=metric, alpha=0.8)
    
    ax4.set_xlabel('Threat Type', fontweight='bold', fontsize=11)
    ax4.set_ylabel('Score', fontweight='bold', fontsize=11)
    ax4.set_title('Test Set: All Metrics by Threat Type', fontweight='bold', fontsize=13)
    ax4.set_xticks(x_pos)
    ax4.set_xticklabels([t.capitalize() for t in threat_types])
    ax4.legend()
    ax4.grid(True, alpha=0.3, axis='y')
    ax4.set_ylim([0.85, 1.0])
    
    # 5. Sample distribution
    ax5 = plt.subplot(2, 3, 5)
    train_samples = []
    test_samples = []
    for threat in threat_types:
        train_n = results_df[(results_df['threat_type'] == threat) & 
                           (results_df['dataset'] == 'Train')]['n_samples'].values[0]
        test_n = results_df[(results_df['threat_type'] == threat) & 
                          (results_df['dataset'] == 'Test')]['n_samples'].values[0]
        train_samples.append(train_n)
        test_samples.append(test_n)
    
    ax5.bar(x - width/2, train_samples, width, label='Train', alpha=0.8, color='steelblue')
    ax5.bar(x + width/2, test_samples, width, label='Test', alpha=0.8, color='coral')
    ax5.set_xlabel('Threat Type', fontweight='bold', fontsize=11)
    ax5.set_ylabel('Number of Samples', fontweight='bold', fontsize=11)
    ax5.set_title('Sample Distribution by Threat Type', fontweight='bold', fontsize=13)
    ax5.set_xticks(x)
    ax5.set_xticklabels([t.capitalize() for t in threat_types])
    ax5.legend()
    ax5.grid(True, alpha=0.3, axis='y')
    
    # 6. Confusion Matrix Summary (Test Set)
    ax6 = plt.subplot(2, 3, 6)
    test_results = results_df[results_df['dataset'] == 'Test']
    
    metrics_to_plot = ['true_positives', 'true_negatives', 'false_positives', 'false_negatives']
    colors_cm = ['#2ecc71', '#3498db', '#e74c3c', '#f39c12']
    labels_cm = ['True Pos', 'True Neg', 'False Pos', 'False Neg']
    
    x_pos = np.arange(len(threat_types))
    width = 0.2
    
    for i, (metric, color, label) in enumerate(zip(metrics_to_plot, colors_cm, labels_cm)):
        values = []
        for threat in threat_types:
            val = test_results[test_results['threat_type'] == threat][metric].values[0]
            values.append(val)
        offset = (i - 1.5) * width
        ax6.bar(x_pos + offset, values, width, label=label, alpha=0.8, color=color)
    
    ax6.set_xlabel('Threat Type', fontweight='bold', fontsize=11)
    ax6.set_ylabel('Count', fontweight='bold', fontsize=11)
    ax6.set_title('Test Set: Confusion Matrix Breakdown', fontweight='bold', fontsize=13)
    ax6.set_xticks(x_pos)
    ax6.set_xticklabels([t.capitalize() for t in threat_types])
    ax6.legend(fontsize=9)
    ax6.grid(True, alpha=0.3, axis='y')
    
    plt.suptitle('Model Evaluation: PCA + Logistic Regression\nComprehensive Performance Analysis', 
                 fontsize=16, fontweight='bold', y=0.995)
    plt.tight_layout()
    
    # Save figure
    output_path = Path("models/evaluation_visualizations.png")
    plt.savefig(output_path, dpi=150, bbox_inches='tight')
    print(f"\nVisualization saved to {output_path}")
    
    plt.show()
    
    # Create summary statistics table
    print("\n" + "="*80)
    print("SUMMARY STATISTICS")
    print("="*80)
    
    for dataset_name in ['Train', 'Test']:
        dataset_results = results_df[results_df['dataset'] == dataset_name]
        
        if len(dataset_results) > 0:
            print(f"\n{dataset_name} Set Statistics:")
            print(f"  Mean Accuracy:  {dataset_results['accuracy'].mean():.4f} (±{dataset_results['accuracy'].std():.4f})")
            print(f"  Mean Precision: {dataset_results['precision'].mean():.4f} (±{dataset_results['precision'].std():.4f})")
            print(f"  Mean Recall:    {dataset_results['recall'].mean():.4f} (±{dataset_results['recall'].std():.4f})")
            print(f"  Best Accuracy:  {dataset_results['accuracy'].max():.4f} ({dataset_results.loc[dataset_results['accuracy'].idxmax(), 'threat_type']})")
            print(f"  Worst Accuracy: {dataset_results['accuracy'].min():.4f} ({dataset_results.loc[dataset_results['accuracy'].idxmin(), 'threat_type']})")


def main():
    """Main visualization function."""
    results_path = Path("models/evaluation_results.csv")
    
    if not results_path.exists():
        print(f"Error: Results file not found at {results_path}")
        print("Please run evaluate_models.py first.")
        return
    
    print("Generating evaluation visualizations...")
    visualize_evaluation_results(results_path)
    print("\nVisualization complete!")


if __name__ == "__main__":
    main()
