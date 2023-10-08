*** Settings ***
Library           SeleniumLibrary
Library           String
#Library           Geolocation.py
Test Teardown     Close All Browsers

*** Variables ***
${weatherItem}    xpath=//*[contains(@class, "weatherItem")]
${temp2}          xpath=//*[contains(@class, "weatherData")]/div[2]//*[contains(@class, "temp")]
#${latitude}        37.7749
#${longitude}       -122.4194

*** Keywords ***
Start Headless Firefox
    ${ff_options}       Evaluate         sys.modules['selenium.webdriver'].FirefoxOptions()    sys, selenium.webdriver
    Call Method         ${ff_options}    add_argument                    --headless
    Call Method         ${ff_options}    set_preference                  geo.enabled           ${FALSE}
    Create WebDriver    Firefox          options=${ff_options}

# Verify Geolocation
#     Execute Javascript    let coords;
#     Execute JavaScript    return window.navigator.geolocation.getCurrentPosition((position) => { coords = position.coords; });

#     Should Be Equal As Numbers    ${location.latitude}    ${latitude}
#     Should Be Equal As Numbers    ${location.longitude}    ${longitude}

*** Test Cases ***
The Weather Index Page can be Opened
    Start Headless Firefox
    Go To                               http://localhost:8000
    Wait Until Page Contains Element    ${weatherItem}                   timeout=15s

Check for JavaScript errors
    Start Headless Firefox
    Go To                               http://localhost:8000
    Wait Until Page Contains Element    ${weatherItem}                   timeout=15s
    ${errors}                           Execute JavaScript               return window.console.error
    Should Be Empty                     ${errors}

Check number of weather items
    Start Headless Firefox
    Go To                               http://localhost:8000
    Wait Until Page Contains Element    ${weatherItem}                   timeout=15s
    ${elements}                         Get WebElements                  css:div.weatherData>div.weatherItem
    ${num_elements}                     Get Length                       ${elements}
    Should Be Equal As Integers         ${num_elements}                  5

Check Temperature 2 Value
    Start Headless Firefox
    Go To                               http://localhost:8000
    Wait Until Page Contains Element    ${temp2}
    ${temp_text}=    Get Text           ${temp2}
    ${temp_match}  Get Regexp Matches   ${temp_text}                     \d+\.\d+

# Test Weather App with Geolocation
#     ${driver}    create_firefox_driver_with_geolocation    ${latitude}    ${longitude}

#     # Navigate to the page and verify the geolocation
#     Go To    http://localhost:8000

#     # Verify the weather items are displayed
#     Wait Until Page Contains Element    ${weatherItem}

#     # Verify the geolocation is working
#     # ${location}    Execute Async JavaScript    (async () => {
#     #     const getGeolocation = async () => {
#     #         return new Promise((resolve, reject) => {
#     #             window.navigator.geolocation.getCurrentPosition(
#     #                 (position) => {
#     #                     resolve(position.coords);
#     #                 },
#     #                 (error) => {
#     #                     reject(error);
#     #                 }
#     #             );
#     #         });
#     #     };
#     #     return await getGeolocation();
#     # })()

#     # Make sure JS does not contain errors.
#     ${errors}    Execute JavaScript    return window.console.error
#     Should Be Empty    ${errors}

#     # Check that there are 5 weather items
#     ${elements}    Get WebElements    css:div.weatherData>div.weatherItem
#     ${num_elements}    Get Length    ${elements}
#     Should Be Equal As Integers    ${num_elements}    5