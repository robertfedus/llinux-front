# test_register.py

import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173/"

def generate_unique_email():
    return f"testuser_{int(time.time() * 1000)}@example.com"

@pytest.fixture  # function‐scoped: new browser per test
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    drv = webdriver.Chrome(options=options)
    drv.implicitly_wait(5)
    yield drv
    drv.quit()

def test_register_sets_token(driver):
    email = generate_unique_email()
    password = "TestPassword123!"

    driver.get(BASE_URL)
    driver.find_element(By.XPATH, "//button[normalize-space(.)='Register']").click()
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Full Name']"))
    )

    driver.find_element(By.XPATH, "//input[@placeholder='Full Name']").send_keys("Test User")
    driver.find_element(By.XPATH, "//input[@placeholder='Email Address']").send_keys(email)
    driver.find_element(By.XPATH, "//input[@placeholder='Password']").send_keys(password)
    driver.find_element(By.XPATH, "//input[@placeholder='Confirm Password']").send_keys(password)
    driver.find_element(By.XPATH, "//button[normalize-space(.)='Create Account']").click()

    # wait for token to appear...
    WebDriverWait(driver, 10).until(
        lambda d: d.execute_script("return localStorage.getItem('token')") is not None
    )
    token = driver.execute_script("return localStorage.getItem('token')")
    assert token and len(token) > 0, "Expected a non-empty token in localStorage"

    # --- NEW: clear out the token and reload so subsequent tests start fresh ---
    driver.execute_script("localStorage.clear()")
    driver.refresh()
