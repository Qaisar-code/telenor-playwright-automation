Feature: Telenor Broadband


  Scenario: Verify broadband products are displayed for an address
    Given I navigate to Telenor website
    When I click Handla/Bredband
    When I enter address "Kungsgatan 103, Uppsala"
    Then featured product grid should not be empty