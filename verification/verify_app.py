from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Go to Home Page
        print("Navigating to home page...")
        page.goto("http://localhost:3000")
        page.wait_for_selector("text=Voda.NextJS")

        # Verify Sidebar and Dashboard
        assert page.is_visible("text=Dashboard")
        assert page.is_visible("text=New Request")

        print("Home page verified.")
        page.screenshot(path="verification/home_page.png")

        # 2. Navigate to New Request Page
        print("Navigating to New Request page...")
        page.click("text=New Request")
        page.wait_for_url("**/new")

        # Verify Form Elements
        assert page.is_visible("text=Project Details")
        assert page.is_visible("text=Scoring")
        assert page.is_visible("text=Score Preview")

        print("New Request page verified.")

        # 3. Fill Form and Verify Calculation
        print("Filling form...")
        page.fill("input[name='title']", "Test Project")
        page.fill("textarea[name='business_value']", "High value for verification")

        # Select Impact (assuming it's a select, playwight handles this via label or click)
        # Shadcn Select is a bit tricky, it uses a trigger button.
        # We need to click the trigger and then the option.

        # Select Impact 5
        page.click("button:has-text('Select impact')")
        page.click("div[role='option']:has-text('5 - High')")

        # Select Urgency 4
        page.click("button:has-text('Select urgency')")
        page.click("div[role='option']:has-text('4')")

        # Select Effort S (1)
        page.click("button:has-text('Select effort')")
        page.click("div[role='option']:has-text('S (1)')")

        # Verify Calculation: (5 * 4) / 1 = 20
        # The preview should update automatically
        print("Verifying calculation...")
        page.wait_for_timeout(1000) # Wait for state update

        # Look for the calculated score in the preview card
        # It's in a span with text-4xl
        score_element = page.locator("span.text-4xl")
        score = score_element.inner_text()
        print(f"Calculated Score: {score}")

        assert score == "20"

        page.screenshot(path="verification/new_request_filled.png")
        print("Calculation verified.")

        browser.close()

if __name__ == "__main__":
    verify_app()
