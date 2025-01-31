from flask import Blueprint, jsonify, request
from flask_socketio import emit
import requests
from dotenv import load_dotenv
import os
import base64
import time
from .. import socketio

llm = Blueprint('llm', __name__)
load_dotenv()

api_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
api_token1=os.getenv('IMAGE_TOKEN')
API_URL = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it"
headers = {"Authorization": f"Bearer {api_token}"}

API_URL_IMAGE = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev"
headers2 = {"Authorization": f"Bearer {api_token1}"}

def query(payload):
    start_time = time.time()
    response = requests.post(API_URL, headers=headers, json=payload)
    elapsed_time = time.time() - start_time
    if response.status_code == 200:
        return response.json(), elapsed_time
    else:
        return {"error": f"HTTP {response.status_code}: {response.text}"}, elapsed_time

def query2(payload, max_retries=3, delay=5):
    for attempt in range(max_retries):
        start_time = time.time()
        response = requests.post(API_URL_IMAGE, headers=headers2, json=payload)
        elapsed_time = time.time() - start_time
        if response.status_code == 200:
            return response.content, elapsed_time
        elif attempt < max_retries - 1:
            time.sleep(delay * (2 ** attempt))
        else:
            return {"error": f"HTTP {response.status_code}: {response.text}"}, elapsed_time

def generate_image_task(cleaned_text1):
    try:
        
        sio = socketio.server
        
        
        sio.emit('status', {'message': 'Generating image...'})
        
        image_bytes, elapsed_time = query2({"inputs": cleaned_text1})
        sio.emit('status', {'message': f'Image generation took {elapsed_time:.2f} seconds.'})

        if isinstance(image_bytes, dict) and "error" in image_bytes:
            sio.emit('image_response', {'error': 'Failed to generate an image.'})
            return

        
        encoded_image = base64.b64encode(image_bytes).decode('utf-8')
        sio.emit('image_response', {'image': encoded_image})
    except Exception as e:
        sio.emit('image_response', {'error': f'Unexpected error occurred while generating the image: {str(e)}'})

@socketio.on('message')
def handle_message(msg):
    try:
        
        emit('status', {'message': 'Processing text generation...'})
        print(msg)
        print("Startd text gen")
        output, elapsed_time = query({"inputs": f"{msg}"})
        emit('status', {'message': f'Text generation took {elapsed_time:.2f} seconds.'})

        if "error" in output:
            emit('text_response', {'error': 'An error occurred while processing your request.'})
            return

        generated_text = output[0]['generated_text']
        cleaned_text = ' '.join(generated_text.split())

        
        emit('text_response', {'text': cleaned_text})

        
        emit('status', {'message': 'Processing text summary generation...'})
        output2, elapsed_time_summary = query({"inputs": f"Create a 50 words summary of the whole plot: {cleaned_text}"})
        emit('status', {'message': f'Text summary generation took {elapsed_time_summary:.2f} seconds.'})

        generated_text1 = output2[0]['generated_text']
        cleaned_text1 = ' '.join(generated_text1.split())
        print('Started image gen')

        
        socketio.start_background_task(generate_image_task, cleaned_text1)
        print('Stopped image gen')

    except Exception as e:
        emit('error', {'message': f'Failed to process the request: {str(e)}'})
