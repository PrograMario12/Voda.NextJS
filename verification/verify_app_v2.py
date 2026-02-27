from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Go to Home Page
        print("Navigating to home page...")
        page.goto("http://localhost:3000")

        # Verify Sidebar and Dashboard
        page.wait_for_selector("text=Voda.NextJS")

        # Verify dashboard links
        assert page.is_visible("text=Dashboard")

        print("Home page verified.")
        page.screenshot(path="verification/home_page.png")

        # 2. Navigate to New Request Page
        print("Navigating to New Request page...")
        # Use a more reliable selector for navigation if needed, but text is fine for sidebar
        page.click("text=New Request")
        page.wait_for_url("**/new")

        # Verify Form Elements
        page.wait_for_selector("text=Project Details")

        print("New Request page verified.")

        # 3. Fill Form and Verify Calculation
        print("Filling form...")

        # Fill text inputs
        page.fill("input[name='title']", "Test Project")
        page.fill("textarea[name='business_value']", "High value for verification")

        # Handling Shadcn Select components
        # Inspecting typical Shadcn select structure: it uses a trigger button with role="combobox" usually,
        # or we can find it by label.

        # Click Impact Trigger
        # "Select impact" is the placeholder text inside the trigger
        # We can try to find the button that contains this text.
        print("Selecting Impact...")
        page.click("button:has-text('Select impact')")
        # Wait for the dropdown content
        page.wait_for_selector("div[role='presentation']")
        # Click option 5
        page.click("div[role='option'] >> text=5")

        # Click Urgency Trigger
        print("Selecting Urgency...")
        page.click("button:has-text('Select urgency')")
        page.wait_for_selector("div[role='presentation']")
        # Click option 4
        page.click("div[role='option'] >> text=4")

        # Click Effort Trigger
        print("Selecting Effort...")
        # The default value for effort is M (3), so the text might not be "Select effort" but "M (3)" or similar if default is set.
        # Wait, in the code we set default to 'M'.
        # So we look for the trigger that likely displays "M (3)" or just the label "Effort".

        # Let's try to find the trigger by the label "Effort"
        # The structure is usually Label -> Button(Trigger)
        # We can use layout selectors or just look for the current value "M (3)"

        # Actually, let's verify what the default is.
        # In ProjectForm.tsx: defaultValues: { effort_size: 'M' }
        # So the trigger will show "M (3)"

        page.click("button:has-text('M (3)')")
        page.wait_for_selector("div[role='presentation']")
        # Click option S
        page.click("div[role='option'] >> text=S (1)")

        # Verify Calculation: (5 * 4) / 1 = 20
        # The preview should update automatically
        print("Verifying calculation...")
        page.wait_for_timeout(1000) # Wait for state update

        # Look for the calculated score in the preview card
        # It's in a span with text-4xl
        score_element = page.locator("span.text-4xl")
        score = score_element.inner_text()
        print(f"Calculated Score: {score}")

        if score != "20":
             print(f"Error: Expected 20, got {score}")
             # Take a screenshot to debug
             page.screenshot(path="verification/error_calculation.png")
             exit(1)

        # Take final screenshot
        page.screenshot(path="verification/new_request_filled.png")
        print("Calculation verified.")

        browser.close()

if __name__ == "__main__":
    try:
        from playwright.sync_api import sync_playwright
        verify_app()
    except Exception as e:
        print(f"An error occurred: {e}")
        exit(1)
