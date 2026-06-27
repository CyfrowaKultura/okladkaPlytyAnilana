import asyncio
from playwright.async_api import async_playwright
import os

async def generate_pdf():
    file_url = f"file://{os.path.abspath('invitation.html')}"
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(file_url)
        await page.pdf(
            path="Zaproszenie_Anilana_3D.pdf",
            format="A4",
            print_background=True
        )
        await browser.close()

if __name__ == "__main__":
    asyncio.run(generate_pdf())
