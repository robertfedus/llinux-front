import json
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173/"

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    drv = webdriver.Chrome(options=options)
    drv.implicitly_wait(5)
    yield drv
    drv.quit()

def test_login_sets_token(driver):
    with open("credentials.json", "r") as f:
        creds = json.load(f)
    email = creds["email"]
    password = creds["password"]

    driver.get(BASE_URL)
    driver.find_element(By.XPATH, "//button[normalize-space(.)='Login']").click()
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Email']"))
    )

    driver.find_element(By.XPATH, "//input[@placeholder='Email']").send_keys(email)
    driver.find_element(By.XPATH, "//input[@placeholder='Password']").send_keys(password)
    driver.find_element(By.XPATH, "//button[normalize-space(.)='Enter Account']").click()

    WebDriverWait(driver, 10).until(
        lambda d: d.execute_script("return localStorage.getItem('token')") is not None
    )
    token = driver.execute_script("return localStorage.getItem('token')")
    assert token and len(token) > 0, "Expected a non-empty token after login"
