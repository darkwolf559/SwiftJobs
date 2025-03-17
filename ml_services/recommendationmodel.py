import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

# Sample data generation functions
def generate_sample_users(num_users=1000):
    users = []
    skills_pool = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'MongoDB', 
                  'SQL', 'Data Analysis', 'Machine Learning', 'UI/UX', 'Product Management',
                  'Digital Marketing', 'Content Writing', 'Accounting', 'Sales']
    
    locations = ['Gampaha', 'Galle', 'Homagama', 'Kalutara', 'Maharagama', 'Remote']
    categories = ['Software Development', 'Data Science', 'Design', 'Marketing', 
                 'Finance', 'Sales', 'Customer Support', 'Product Management']
    
    for i in range(num_users):
        num_skills = np.random.randint(2, 8)
        user_skills = np.random.choice(skills_pool, num_skills, replace=False).tolist()
        
        num_interests = np.random.randint(1, 5)
        user_interests = np.random.choice(categories, num_interests, replace=False).tolist()
        
        num_locations = np.random.randint(1, 3)
        preferred_locations = np.random.choice(locations, num_locations, replace=False).tolist()
        
        users.append({
            'userId': f'user_{i}',
            'skills': user_skills,
            'interests': user_interests,
            'preferredLocations': preferred_locations,
            'preferredCategories': user_interests  # Using same as interests for simplicity
        })
    
    return pd.DataFrame(users)
