import pytest
import sys

if __name__ == "__main__":
    code = pytest.main(["-q", "test_register.py"])
    if code != 0:
        sys.exit(code)
    sys.exit(pytest.main(["-q", "test_login.py"]))
