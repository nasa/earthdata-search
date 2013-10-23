# This module provides a method "shared_browser_session" which is purely
# used for tagging groups of specs which can be run together without
# reloading the page between each one.  Right now it does nothing, but
# should test performance get slow in the future, we can play with the
# idea of running multiple tests within the same browser context.
#
# Grouped specs should be able to be run in any order using the same
# browser session without reloading the page, resetting to some
# default state, or running "before" steps that are defined outside of
# the method block
module SharedBrowserSession
  def shared_browser_session
    yield
  end
end
