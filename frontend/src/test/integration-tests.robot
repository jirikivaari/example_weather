*** Settings ***
Library     SeleniumLibrary


*** Test Cases ***
Run Firefox In Headless Mode
    Start Headless Firefox
    Go To    http://localhost:8000
    [Teardown]    Close All Browsers


*** Keywords ***
Start Headless Firefox
    ${ff_options}=    Evaluate    sys.modules['selenium.webdriver'].FirefoxOptions()    sys, selenium.webdriver
    Call Method    ${ff_options}    add_argument    --headless
    Create WebDriver    Firefox    options=${ff_options}
