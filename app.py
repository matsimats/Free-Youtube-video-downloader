from flask import Flask, request, send_file
from pytube import YouTube
import tempfile
import os
from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=["*"])

download_counts = {}  # Słownik przechowujący liczbę pobrań dla różnych adresów IP

@app.route('/download', methods=['GET'])
def download_video():
    url = request.args.get('url')
    if not url:
        return "URL is missing", 400

    try:
        yt = YouTube(url)
        video_stream = yt.streams.get_highest_resolution()

        temp_file = tempfile.NamedTemporaryFile(delete=False)
        temp_file.close()

        with open(temp_file.name, 'wb') as f:
            video_stream.download(output_path=os.path.dirname(temp_file.name), filename=os.path.basename(temp_file.name))

        return send_file(
            temp_file.name,
            as_attachment=True,
            download_name=f"{yt.title}.mp4",
            mimetype='video/mp4'
        )
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True)
