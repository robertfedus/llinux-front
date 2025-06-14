# test.py

import pytest
import sys

if __name__ == "__main__":
    # Run register first; it will clear + reload at end
    code = pytest.main(["-q", "test_register.py"])
    if code != 0:
        sys.exit(code)
    # Then run login in its own fresh browser
    sys.exit(pytest.main(["-q", "test_login.py"]))
