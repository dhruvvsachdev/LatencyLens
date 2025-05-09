from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        uploaded_file = request.files['file']

        if not uploaded_file.filename.endswith('.npz'):
            return jsonify({'error': 'Please upload a valid .npz file'}), 400

        data = np.load(uploaded_file)

        if 'nodes' not in data or 'edges' not in data:
            return jsonify({'error': 'Missing "nodes" or "edges" in .npz file'}), 400

        nodes = data['nodes'].tolist()
        edges = data['edges'].tolist()

        graph_data = {
            'nodes': [{'id': str(node)} for node in nodes],
            'links': [{'source': str(edge[0]), 'target': str(edge[1])} for edge in edges]
        }

        return jsonify(graph_data)

    except Exception as e:
        return jsonify({'error': f'Failed to process file: {str(e)}'}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
