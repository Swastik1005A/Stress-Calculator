from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import os

app = Flask(__name__)

# Load the trained XGBoost model
def load_model():
    try:
        with open('model.pkl', 'rb') as file:
            model = pickle.load(file)
        return model
    except FileNotFoundError:
        print("Model file 'model.pkl' not found!")
        return None

# Load the model when the app starts
model = load_model()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get form data
        data = request.get_json()
        
        # Extract features from the form
        features = []
        
        # Personal information
        gender = int(data.get('gender', 0))
        age = int(data.get('age', 20))
        
        # Add gender and age to features
        features.extend([gender, age])
        
        # Extract questionnaire answers (22 questions)
        question_mapping = {
            'stress-life': 'stress_life',
            'heartbeat': 'heartbeat',
            'anxiety': 'anxiety',
            'sleep': 'sleep',
            'headaches': 'headaches',
            'irritation': 'irritation',
            'concentration': 'concentration',
            'sadness': 'sadness',
            'illness': 'illness',
            'loneliness': 'loneliness',
            'workload': 'workload',
            'competition': 'competition',
            'relationship': 'relationship',
            'professors': 'professors',
            'work-env': 'work_env',
            'relaxation': 'relaxation',
            'home-env': 'home_env',
            'academic-confidence': 'academic_confidence',
            'subject-confidence': 'subject_confidence',
            'extracurricular': 'extracurricular',
            'attendance': 'attendance',
            'weight': 'weight'
        }
        
        # Process each question
        for question_id, feature_name in question_mapping.items():
            value = data.get(question_id, '')
            if value == '':
                return jsonify({'error': f'Missing answer for question: {question_id}'}), 400
            
            # Convert to integer
            try:
                features.append(int(value))
            except ValueError:
                return jsonify({'error': f'Invalid value for question: {question_id}'}), 400
        
        # Ensure we have exactly 24 features (2 personal + 22 questions)
        if len(features) != 24:
            return jsonify({'error': f'Expected 24 features, got {len(features)}'}), 400
        
        # Convert to numpy array and reshape for prediction
        features_array = np.array(features).reshape(1, -1)
        
        # Make prediction
        if model is None:
            return jsonify({'error': 'Model not loaded. Please check model.pkl file.'}), 500
        
        prediction = model.predict(features_array)[0]
        prediction_proba = model.predict_proba(features_array)[0]
        
        # Map prediction to stress level
        stress_levels = {
            2: "Low Stress",
            1: "Moderate Stress", 
            0: "High Stress"
        }
        
        result = {
            'prediction': int(prediction),
            'stress_level': stress_levels.get(int(prediction), "Unknown"),
            'confidence': float(max(prediction_proba)),
            'probabilities': {
                'low_stress': float(prediction_proba[2]),
                'moderate_stress': float(prediction_proba[1]),
                'high_stress': float(prediction_proba[0])
            }
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
