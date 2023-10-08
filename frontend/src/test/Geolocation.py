from robot.api.deco import keyword
from selenium import webdriver

@keyword
def create_firefox_driver_with_geolocation(latitude, longitude):
    options = webdriver.FirefoxOptions()
    profile = webdriver.FirefoxProfile()
    profile.set_preference("permissions.default.geo", 1)
    profile.set_preference("geo.prompt.testing", True)
    profile.set_preference("geo.prompt.testing.allow", True)
    profile.set_preference("geo.provider.network.url", f"data:application/json,{{\"location\": {{\"lat\": {latitude}, \"lng\": {longitude}}}, \"accuracy\": 100.0}}")
    options.profile = profile
    driver = webdriver.Firefox(options=options)
    return driver