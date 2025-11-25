from bs4 import BeautifulSoup
import requests
class Website:
    links: list[str] = []
    body: str = None
    title: str = None
    url: str = None
    text: str = None

    def __init__(self, url: str):
        self.url = url
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        self.body = response.content
        soup = BeautifulSoup(self.body, "lxml")
        self.title = soup.find("title").text
        if soup.body:
            for irrelevant in soup.body(["script", "img", "style", "input"]):
                irrelevant.decompose()
        self.text = soup.get_text(separator="\n", strip=True)
        self.links = [link["href"] for link in soup.find_all("a") if link.get("href")]

    def get_content(self):
        return f"Title: {self.title}\n\nText: {self.text}\n\n"