from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from typing import Dict, Any

import modal
import os

class SummarizeWebpageRequest(BaseModel):
    url: str

base_image = modal.Image.debian_slim().pip_install("fastapi[standard]")

app = modal.App("miindy-web-summarizer", image=base_image)

# Image with web scraping and text processing capabilities
scraper_image = base_image.pip_install(
    "beautifulsoup4==4.12.2",
    "requests==2.31.0"
)

# Image with the miindy agent
agent_image = base_image.pip_install(
    "google-adk[database]==0.3.0",
    "google-genai",
    "litellm",
)

auth_scheme = HTTPBearer()

@app.function(image=scraper_image)
def scrape_webpage(url: str) -> Dict[str, Any]:
    from bs4 import BeautifulSoup

    import requests
    import re
    
    try:
        response = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        response.raise_for_status()
        
        # Parse the HTMLe
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.extract()
            
        # Extract title
        title = soup.title.text.strip() if soup.title else "No title found"
        
        # Extract meta description
        meta_desc = ""
        meta_tag = soup.find("meta", attrs={"name": "description"})
        if meta_tag and "content" in meta_tag.attrs:
            meta_desc = meta_tag["content"]
            
        # Extract main content - prioritize article or main tags
        main_content = ""
        priority_tags = soup.find(["article", "main"])
        
        if priority_tags:
            main_content = priority_tags.get_text(separator=' ', strip=True)
        else:
            # Fallback to paragraphs if no main content container is identified
            paragraphs = soup.find_all('p')
            main_content = ' '.join([p.get_text(strip=True) for p in paragraphs])
            
        # Extract headings
        headings = []
        for tag in soup.find_all(re.compile('^h[1-3]$')):
            headings.append(tag.get_text(strip=True))
            
        # Clean up the extracted text
        main_content = re.sub(r'\s+', ' ', main_content).strip()
        
        return {
            "url": url,
            "title": title,
            "meta_description": meta_desc,
            "headings": headings,
            "main_content": main_content[:10000]  # Limit content length
        }
        
    except Exception as e:
        return {
            "url": url,
            "error": str(e),
            "title": "",
            "meta_description": "",
            "headings": [],
            "main_content": ""
        }

@app.function(image=agent_image, secrets=[modal.Secret.from_name("miindy-secret")])
def summarize_with_miindy_agent(webpage_content: Dict[str, Any]) -> Dict[str, str]:
    from google.adk.agents import Agent
    from google.adk.runners import InMemoryRunner
    from google.genai.types import Part, UserContent

    url = webpage_content["url"]
    title = webpage_content["title"]
    headings = webpage_content["headings"]
    main_content = webpage_content["main_content"]

    prompt = f"""
    You are a helpful assistant that summarizes the company based on the contents of its webpage.
    You are given the url, title, headings, and main content of a company's webpage.
    Keep the summary to 2-3 sentences.

    Webpage: {url}
    Title: {title}

    Key Headings:
    {', '.join(headings[:5]) if headings else 'None found'}

    Content:
    {main_content[:5000]}
    
    Task: Provide a concise, informative summary of this webpage in 2-3 paragraphs.
    Focus on the main points, key information, and the purpose of the page.
    """

    root_agent = Agent(
        name="miindy_agent",
        model="gemini-2.0-flash",
        description="Summarizer agent",
        instruction=prompt
    )

    runner = InMemoryRunner(agent=root_agent)

    session = runner.session_service.create_session(
        app_name=runner.app_name, user_id="test_user"
    )

    content = UserContent(parts=[Part(text=prompt)])
    
    for event in runner.run(
        user_id=session.user_id, session_id=session.id, new_message=content
    ):
        for part in event.content.parts:
            print(part.text)

    return {
        "url": url,
        "title": title,
        "summary": event.content.parts[0].text
    }


@app.cls(gpu="L40S", timeout=900, retries=0, scaledown_window=20, secrets=[modal.Secret.from_name("miindy-secret")])
class Miindy:
    @modal.enter()
    def load_models(self):
        pass

    @modal.fastapi_endpoint(method="POST")
    def summarize_webpage(self, request: SummarizeWebpageRequest, token: HTTPAuthorizationCredentials = Depends(auth_scheme)):
        if token.credentials != os.environ["AUTH_TOKEN"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Incorrect bearer token", headers={"WWW-Authenticate": "Bearer"})
        
        webpage_content = scrape_webpage.remote(request.url)
        summary = summarize_with_miindy_agent.remote(webpage_content)
        return summary

@app.local_entrypoint()
def main():
    import requests
    import os

    miindy = Miindy()

    url = miindy.summarize_webpage.get_web_url

    payload = { 
        "url": "http://modal.com"
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ['AUTH_TOKEN']}"
    }

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    result = response.json()
    print(result)