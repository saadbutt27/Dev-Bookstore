from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

final_ratings = pd.read_csv("Final.csv")

pt=final_ratings.pivot_table(index='Book-Title', columns='User-ID', values='Book-Rating')
pt.fillna(0, inplace=True)

similarity_scores=cosine_similarity(pt)

similarity_scores.shape

# Function to recommend books
def recommend(book_name):
    try:
        # Check if the book_name exists in the index
        if book_name not in pt.index:
            raise ValueError(f"Book '{book_name}' not found in the index")

        # Fetch the index of the book
        index = np.where(pt.index == book_name)[0][0]

        # Get similarity scores for the book and sort them
        similar_items = sorted(list(enumerate(similarity_scores[index])), key=lambda x: x[1], reverse=True)[1:11]

        # Collect recommended books
        rec_books = [pt.index[i[0]].title() for i in similar_items]

        # print(rec_books)
        return rec_books

    except ValueError as ve:
        print(ve)
        return []
    except IndexError as ie:
        print(f"Index error: {ie}")
        return []

# print(f"""Recommended books: {recommend('Sacred Sins')}""")

@app.route('/recommend', methods=['GET'])
def recommend_books():
    book_name = request.args.get('book_name')
    
    if not book_name:
        return jsonify({'error': 'Book name is required'}), 400

    recommendations = recommend(book_name)
    
    if not recommendations:
        return jsonify({'error': f"No recommendations found for book '{book_name}'"}), 404

    return jsonify({'recommendations': recommendations}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)