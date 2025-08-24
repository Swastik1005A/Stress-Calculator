document.addEventListener('DOMContentLoaded', function() {
    const welcomeBtn = document.querySelector('.side-btn:nth-child(1)');
    const predictBtn = document.querySelector('.side-btn:nth-child(2)');
    const aboutBtn = document.querySelector('.side-btn:nth-child(3)');
    
    const welcomeSection = document.getElementById('welcome-section');
    const predictSection = document.getElementById('predict-section');
    const aboutSection = document.getElementById('about-section');
    
    const contentBox = document.querySelector('.content');
    
    function hideAllSections() {
        welcomeSection.style.display = 'none';
        predictSection.style.display = 'none';
        aboutSection.style.display = 'none';
    }
    
    function showSection(section) {
        hideAllSections();
        section.style.display = 'block';
    }
    
    welcomeBtn.addEventListener('click', function() {
        showSection(welcomeSection);
        contentBox.classList.remove('predict-mode');
    });
    
    predictBtn.addEventListener('click', function() {
        showSection(predictSection);
        contentBox.classList.add('predict-mode');
    });
    
    aboutBtn.addEventListener('click', function() {
        showSection(aboutSection);
        contentBox.classList.remove('predict-mode');
    });
    
    showSection(welcomeSection);
    
    // Form submission handling
    const submitBtn = document.querySelector('.submit-btn');
    const form = document.querySelector('#predict-section');
    
    submitBtn.addEventListener('click', function() {
        // Collect all form data
        const formData = {};
        
        // Get personal information
        const gender = document.getElementById('gender').value;
        const age = document.getElementById('age').value;
        
        if (!gender || !age) {
            alert('Please fill in both Gender and Age fields.');
            return;
        }
        
        formData.gender = gender;
        formData.age = age;
        
        // Get all questionnaire answers
        const questions = [
            'stress-life', 'heartbeat', 'anxiety', 'sleep', 'headaches',
            'irritation', 'concentration', 'sadness', 'illness', 'loneliness',
            'workload', 'competition', 'relationship', 'professors', 'work-env',
            'relaxation', 'home-env', 'academic-confidence', 'subject-confidence',
            'extracurricular', 'attendance', 'weight'
        ];
        
        let allAnswered = true;
        questions.forEach(questionId => {
            const value = document.getElementById(questionId).value;
            if (!value) {
                allAnswered = false;
                return;
            }
            formData[questionId] = value;
        });
        
        if (!allAnswered) {
            alert('Please answer all 22 questions in the questionnaire.');
            return;
        }
        
        // Show loading state
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Send data to Flask backend
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
            } else {
                // Display results
                displayResults(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while processing your request. Please try again.');
        })
        .finally(() => {
            // Reset button state
            submitBtn.textContent = 'Submit Data for Prediction';
            submitBtn.disabled = false;
        });
    });
    
    function displayResults(data) {
        // Create results section
        const resultsHTML = `
            <div class="results-section">
                <h2 class="font2">Your Stress Prediction Results</h2>
                <div class="result-card">
                    <div class="result-header">
                        <h3>Stress Level: ${data.stress_level}</h3>
                        <div class="confidence-badge">${Math.round(data.confidence * 100)}% Confidence</div>
                    </div>
                    
                    <div class="probability-bars">
                        <div class="prob-item">
                            <span>Low Stress:</span>
                            <div class="prob-bar">
                                <div class="prob-fill low" style="width: ${data.probabilities.low_stress * 100}%"></div>
                            </div>
                            <span class="prob-value">${Math.round(data.probabilities.low_stress * 100)}%</span>
                        </div>
                        <div class="prob-item">
                            <span>Moderate Stress:</span>
                            <div class="prob-bar">
                                <div class="prob-fill moderate" style="width: ${data.probabilities.moderate_stress * 100}%"></div>
                            </div>
                            <span class="prob-value">${Math.round(data.probabilities.moderate_stress * 100)}%</span>
                        </div>
                        <div class="prob-item">
                            <span>High Stress:</span>
                            <div class="prob-bar">
                                <div class="prob-fill high" style="width: ${data.probabilities.high_stress * 100}%"></div>
                            </div>
                            <span class="prob-value">${Math.round(data.probabilities.high_stress * 100)}%</span>
                        </div>
                    </div>
                    
                    <div class="result-message">
                        <p>Based on your responses, our AI model predicts you are experiencing <strong>${data.stress_level.toLowerCase()}</strong>.</p>
                        <p>Remember: This is a prediction tool and should not replace professional medical advice. If you're concerned about your stress levels, please consult with a healthcare provider.</p>
                    </div>
                    
                    <button class="new-prediction-btn" onclick="location.reload()">Start New Prediction</button>
                </div>
            </div>
        `;
        
        // Replace the form with results
        form.innerHTML = resultsHTML;
        
        // Scroll to top of results
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});