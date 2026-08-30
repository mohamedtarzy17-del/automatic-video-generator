"""
UNSEEN SYSTEM - AUTOMATED YOUTUBE UPLOADER ENGINE
===================================================
Automates uploading rendered MP4 videos, 1280x720 thumbnails,
titles, descriptions, and tags directly to YouTube via YouTube Data API v3.
"""

import os
import json
import argparse
from typing import Optional, List

# Check if google-api-python-client is installed
try:
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.oauth2.credentials import Credentials
    GOOGLE_API_AVAILABLE = True
except ImportError:
    GOOGLE_API_AVAILABLE = False

SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

class YouTubeUploader:
    def __init__(self, client_secrets_file: str = "client_secrets.json", token_file: str = "token.json"):
        self.client_secrets_file = client_secrets_file
        self.token_file = token_file
        self.youtube = None

    def authenticate(self):
        """Authenticates with YouTube Data API v3 using OAuth2 credentials."""
        if not GOOGLE_API_AVAILABLE:
            raise ImportError(
                "google-api-python-client or google-auth-oauthlib is missing.\n"
                "Install with: pip install google-api-python-client google-auth-oauthlib google-auth-httplib2"
            )

        creds = None
        if os.path.exists(self.token_file):
            creds = Credentials.from_authorized_user_file(self.token_file, SCOPES)
        
        if not creds or not creds.valid:
            if os.path.exists(self.client_secrets_file):
                flow = InstalledAppFlow.from_client_secrets_file(self.client_secrets_file, SCOPES)
                creds = flow.run_local_server(port=0)
                with open(self.token_file, 'w') as token:
                    token.write(creds.to_json())
            else:
                print(f"⚠️ Warning: '{self.client_secrets_file}' not found.")
                print("To enable real YouTube uploads, download your OAuth 2.0 Client Secret JSON from Google Cloud Console.")
                return False

        self.youtube = build('youtube', 'v3', credentials=creds)
        print("✅ Successfully authenticated with YouTube API v3!")
        return True

    def upload_video(
        self,
        video_path: str,
        title: str,
        description: str,
        tags: Optional[List[str]] = None,
        category_id: str = "27",  # 27 = Education, 28 = Science & Tech
        privacy_status: str = "unlisted",  # 'public', 'unlisted', 'private'
        thumbnail_path: Optional[str] = None
    ):
        """Uploads a video MP4 file and sets title, description, tags, and thumbnail."""
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found at: {video_path}")

        print(f"\n🚀 Initiating YouTube Upload for: '{title}'...")
        print(f"📄 Video File: {video_path}")
        print(f"🔒 Privacy Status: {privacy_status}")

        if not self.youtube:
            auth_success = self.authenticate()
            if not auth_success:
                print("\n📋 UPLOAD PREVIEW METADATA (Dry Run / Secrets Missing):")
                print(f"  Title: {title}")
                print(f"  Category: {category_id}")
                print(f"  Tags: {tags or []}")
                print(f"  Thumbnail: {thumbnail_path}")
                print(f"  Description:\n{description}")
                return None

        body = {
            'snippet': {
                'title': title,
                'description': description,
                'tags': tags or ["unseen system", "explainer", "education"],
                'categoryId': category_id
            },
            'status': {
                'privacyStatus': privacy_status,
                'selfDeclaredMadeForKids': False
            }
        }

        media = MediaFileUpload(video_path, chunksize=-1, resumable=True, mimetype="video/mp4")
        request = self.youtube.videos().insert(part=','.join(body.keys()), body=body, media_body=media)

        response = None
        while response is None:
            status, response = request.next_chunk()
            if status:
                print(f"  Upload Progress: {int(status.progress() * 100)}%")

        video_id = response.get('id')
        video_url = f"https://youtu.be/{video_id}"
        print(f"🎉 VIDEO UPLOADED SUCCESSFULLY! Video URL: {video_url}")

        # Set Custom Thumbnail if provided
        if thumbnail_path and os.path.exists(thumbnail_path):
            print(f"🖼️ Uploading custom thumbnail: {thumbnail_path}...")
            self.youtube.thumbnails().set(
                videoId=video_id,
                media_body=MediaFileUpload(thumbnail_path)
            ).execute()
            print("✅ Custom thumbnail applied successfully!")

        return video_url

def main():
    parser = argparse.ArgumentParser(description="Upload video to YouTube")
    parser.add_argument("--video", type=str, required=True, help="Path to MP4 video file")
    parser.add_argument("--title", type=str, required=True, help="Video Title")
    parser.add_argument("--description", type=str, default="Subscribe to UNSEEN SYSTEM for weekly stories.", help="Video Description")
    parser.add_argument("--thumbnail", type=str, help="Path to 1280x720 thumbnail image")
    parser.add_argument("--privacy", type=str, default="unlisted", choices=["public", "unlisted", "private"])

    args = parser.parse_args()

    uploader = YouTubeUploader()
    uploader.upload_video(
        video_path=args.video,
        title=args.title,
        description=args.description,
        thumbnail_path=args.thumbnail,
        privacy_status=args.privacy
    )

if __name__ == "__main__":
    main()
