import os
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

def generate_synthetic_dataset(num_samples=10000):
    """
    Generates a synthetic dataset of code snippets for vulnerability classification.
    0 = Secure, 1 = Vulnerable
    """
    print(f"Generating synthetic dataset of {num_samples} code snippets...")
    
    secure_patterns = [
        "def calculate_sum(a, b): return a + b",
        "for i in range(10): print(i)",
        "class User: def __init__(self, name): self.name = name",
        "return list(filter(lambda x: x > 0, numbers))",
        "import math; result = math.sqrt(144)",
        "def get_user_data(user_id): return db.query(User).filter(id=user_id).first()",
        "try: process_data() except Exception as e: log.error(e)",
        "def render_template(context): return template.render(**context)",
        "app.listen(3000, () => console.log('Server running'))",
        "const isActive = status === 'active' ? true : false;"
    ]
    
    vulnerable_patterns = [
        "eval(user_input)",
        "exec(request.body)",
        "query = 'SELECT * FROM users WHERE username = ' + user_input",
        "os.system('ping ' + target_ip)",
        "import hashlib; h = hashlib.md5(password.encode())",
        "subprocess.Popen(user_command, shell=True)",
        "yaml.load(uploaded_file, Loader=yaml.Loader)", # Unsafe yaml load
        "pickle.loads(untrusted_data)",
        "return HttpResponse(request.GET.get('redirect_url'))", # Open redirect
        "password = 'admin_password_123' # Hardcoded secret"
    ]
    
    data = []
    labels = []
    
    # We will mix and match these patterns with some random noise to create 10,000 samples
    for i in range(num_samples):
        is_vulnerable = np.random.choice([0, 1])
        
        if is_vulnerable:
            base_code = np.random.choice(vulnerable_patterns)
            # Add some random variable names or noise to make the dataset diverse
            noise = f"\nvar_{i} = {np.random.randint(1, 100)}\n"
            data.append(noise + base_code)
            labels.append(1)
        else:
            base_code = np.random.choice(secure_patterns)
            noise = f"\nvar_{i} = {np.random.randint(1, 100)}\n"
            data.append(noise + base_code)
            labels.append(0)
            
    return pd.DataFrame({"code": data, "label": labels})

def train_and_save_model():
    print("--- Starting AIML Model Training Pipeline ---")
    
    # 1. Prepare Data
    df = generate_synthetic_dataset(10000)
    X = df['code']
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 2. Build Pipeline (TF-IDF + Random Forest)
    print("Extracting features using TF-IDF...")
    vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    print("Training Random Forest Classifier...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train_vec, y_train)
    
    # 3. Evaluate Model
    y_pred = clf.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    print("\n--- Model Evaluation ---")
    print(f"Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # 4. Save Model
    os.makedirs("ml_models", exist_ok=True)
    
    joblib.dump(vectorizer, "ml_models/tfidf_vectorizer.pkl")
    joblib.dump(clf, "ml_models/rf_classifier.pkl")
    print("\nModel successfully saved to ml_models/rf_classifier.pkl")
    print("Vectorizer successfully saved to ml_models/tfidf_vectorizer.pkl")
    print("--- Training Complete ---")

if __name__ == "__main__":
    train_and_save_model()
