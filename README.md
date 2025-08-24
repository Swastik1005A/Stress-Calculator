# Student Stress Predictor - Flask Backend

A complete web application for predicting student stress levels using XGBoost machine learning model.

## Features

- 🎯 **Interactive Web Interface** - Beautiful, responsive design
- 🤖 **AI-Powered Predictions** - XGBoost model integration
- 📱 **Mobile Responsive** - Works on all devices
- 🔒 **Form Validation** - Complete data validation
- 📊 **Visual Results** - Beautiful probability bars and confidence scores

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Prepare Your Model
- Save your trained XGBoost model as `model.pkl` in the project root
- Ensure the model expects 24 features (2 personal + 22 questions)

### 3. Run the Application
```bash
python app.py
```

### 4. Access the Application
Open your browser and go to: `http://localhost:5000`

## File Structure

```
StudentStress/
├── app.py              # Flask backend application
├── index.html          # Main HTML template
├── style.css           # CSS styling
├── script.js           # Frontend JavaScript
├── requirements.txt    # Python dependencies
├── model.pkl          # Your trained XGBoost model
└── README.md          # This file
```

## API Endpoints

- `GET /` - Main application page
- `POST /predict` - Submit stress prediction form
- `GET /health` - Health check endpoint

## Model Requirements

Your XGBoost model should:
- Accept 24 features (gender, age + 22 questionnaire answers)
- Output 3 classes (0: Low Stress, 1: Moderate Stress, 2: High Stress)
- Have a `predict()` and `predict_proba()` method

## Features

### Frontend
- Modern, responsive design
- Interactive sidebar navigation
- Complete stress questionnaire (22 questions)
- Form validation and error handling

### Backend
- Flask REST API
- XGBoost model integration
- JSON data processing
- Error handling and validation

### Results Display
- Stress level prediction
- Confidence percentage
- Probability bars for all stress levels
- Professional medical disclaimer
- Option to start new prediction

## Usage

1. Fill out personal information (gender, age)
2. Complete all 22 stress questionnaire questions
3. Submit the form
4. View AI-generated stress prediction results
5. See confidence levels and probability breakdowns

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Flask (Python)
- **Machine Learning**: XGBoost, scikit-learn
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is for educational purposes.
