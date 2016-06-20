'use strict';

angular.module('miq.navigation').directive('miqVerticalNavigation', ['$location', '$rootScope', '$window', '$document', '$timeout',
  function(location, rootScope, $window, $document, $timeout) {

  var navigationController = ['$scope', function($scope) {

    $scope.clearActiveItems = function () {
      $scope.items.forEach(function (item) {
        item.isActive = false;
        if (item.children) {
          item.children.forEach(function (secondary) {
            secondary.isActive = false;
            if (secondary.children) {
              secondary.children.forEach(function(tertiary) {
                tertiary.isActive = false;
              });
            }
          });
        }
      });
    };

    $scope.setActiveItems = function () {
      var updatedRoute = "#" + location.path();
      //Setting active state on load
      $scope.items.forEach(function (topLevel) {
        if (updatedRoute.indexOf(topLevel.href) > -1) {
          topLevel.isActive = true;
        }
        if (topLevel.children) {
          topLevel.children.forEach(function (secondLevel) {
            if (updatedRoute.indexOf(secondLevel.href) > -1) {
              secondLevel.isActive = true;
              topLevel.isActive = true;
            }
            if (secondLevel.children) {
              secondLevel.children.forEach(function (thirdLevel) {
                if (updatedRoute.indexOf(thirdLevel.href) > -1) {
                  thirdLevel.isActive = true;
                  secondLevel.isActive = true;
                  topLevel.isActive = true;
                }
              });
            }
          });
        }
      });
    };

    rootScope.$on( "$routeChangeSuccess", function(event, next, current) {
      $scope.clearActiveItems();
      $scope.setActiveItems();
    });
  }];

  return {
    restrict: 'A',
    scope: {
      brandSrc: '@',
      brandAlt: '@',
      items: '=',
      navigateCallback: '=?',
      itemClickCallback: '=?'
    },
    replace: true,
    templateUrl: 'modules/app/directives/navigation/vertical-navigation.html',
    transclude: true,

    link: function($scope) {
      //wrapping this in a watcher to make sure state is set correctly
      $scope.$watch('items', function(newVal, oldVal){
        $scope.clearActiveItems();
        $scope.setActiveItems();
      }, true);

      var breakpoints = {
        'tablet': 768,
        'desktop': 1200
      }

      $scope.d = false;
      $scope.showMobileNav = false;
      $scope.showMobileSecondary = false;
      $scope.showMobileTertiary = false;
      $scope.hoverSecondaryNav = false;
      $scope.hoverTertiaryNav = false;
      $scope.collapsedSecondaryNav = false;
      $scope.collapsedTertiaryNav = false;
      $scope.navCollapsed = false;
      $scope.forceHidden = false;


      var bodyContentElement = $document.find('.container-pf-nav-pf-vertical');
      var explicitCollapse = false;
      var hoverDelay = 500;
      var hideDelay = hoverDelay + 200;

      var updateMobileMenu = function (selected, secondaryItem) {
        $scope.items.forEach(function (item) {
          item.isMobileItem = false;
          if (item.children) {
            item.children.forEach(function (secondaryItem) {
              secondaryItem.isMobileItem = false;
            });
          }
        });

        if (selected) {
          selected.isMobileItem = true;
          if (secondaryItem) {
            secondaryItem.isMobileItem = true;
            $scope.showMobileSecondary = false;
            $scope.showMobileTertiary = true;
          } else {
            $scope.showMobileSecondary = true;
            $scope.showMobileTertiary = false;
          }
        } else {
          $scope.showMobileSecondary = false;
          $scope.showMobileTertiary = false;
        }
      };

      var checkNavState = function () {
        var width = $window.innerWidth;

        // Check to see if we need to enter/exit the mobile state
        if (width < breakpoints.tablet) {
          $scope.inMobileState = true;

          if ($scope.inMobileState) {
            //Set the body class to the correct state
            bodyContentElement.removeClass('collapsed-nav');
            bodyContentElement.addClass('hidden-nav');

            // Reset the collapsed states
            updateSecondaryCollapsedState(false);
            updateTertiaryCollapsedState(false);

            explicitCollapse = false;
          }
        } else  {
          $scope.inMobileState = false;
          $scope.showMobileNav = false;

          // Set the body class back to the default
          bodyContentElement.removeClass('hidden-nav');
        }

        if (explicitCollapse) {
          $scope.navCollapsed = true;
          bodyContentElement.addClass('collapsed-nav');
        } else {
          $scope.navCollapsed = false;
          bodyContentElement.removeClass('collapsed-nav');
        }
      };

      var collapseMenu = function () {
        $scope.navCollapsed = true;

        //Set the body class to the correct state
        bodyContentElement.addClass('collapsed-nav');

        explicitCollapse = true;
      };

      var expandMenu = function () {
        $scope.navCollapsed = false;

        //Set the body class to the correct state
        bodyContentElement.removeClass('collapsed-nav');

        explicitCollapse = false;

        // Dispatch a resize event when showing the expanding then menu to
        // allow content to adjust to the menu sizing
        angular.element($window).triggerHandler('resize');
      };

      var forceHideSecondaryMenu = function () {
        $scope.forceHidden = true;
        $timeout(function () {
          $scope.forceHidden = false;
        }, 500);
      };

      var clearHoverStates = function () {
        $scope.hoverSecondaryNav = false;
        $scope.hoverTertiaryNav = false;
        $scope.items.forEach(function (item) {
          item.isHover = false;
          if (item.navHoverTimeout !== undefined) {
            $timeout.cancel(item.navHoverTimeout);
            item.navHoverTimeout = undefined;
          }
          if (item.navUnHoverTimeout !== undefined) {
            $timeout.cancel(item.navUnHoverTimeout);
            item.navUnHoverTimeout = undefined;
          }
          if (item.children && item.children.length > 0) {
            item.children.forEach(function (secondaryItem) {
              if (secondaryItem.isHover) {
                secondaryItem.isHover = false;
              }
              if (secondaryItem.navHoverTimeout !== undefined) {
                $timeout.cancel(secondaryItem.navHoverTimeout);
                secondaryItem.navHoverTimeout = undefined;
              }
              if (secondaryItem.navUnHoverTimeout !== undefined) {
                $timeout.cancel(secondaryItem.navUnHoverTimeout);
                secondaryItem.navUnHoverTimeout = undefined;
              }
            });
          }
        });
        if (!$scope.collapsedSecondaryNav && !$scope.collapsedTertiaryNav) {
          forceHideSecondaryMenu();
        }
      };

      $scope.handleNavBarToggleClick = function () {

        if ($scope.inMobileState) {
          // Toggle the mobile nav
          if ($scope.showMobileNav) {
            $scope.showMobileNav = false;
          } else {
            // Always start at the primary menu
            updateMobileMenu();
            $scope.showMobileNav = true;
          }
        } else if ($scope.navCollapsed) {
          expandMenu();
        } else {
          collapseMenu();
        }
      };

      var navigateToItem = function (item) {
        if (!item.children || item.children.length < 1) {
          $scope.showMobileNav = false;
          if (item.href) {
            var navTo = item.href;
            if (navTo.startsWith('#/')) {
              navTo = navTo.substring(2);
            }
            location.path(navTo);
          }
          if ($scope.navigateCallback) {
            $scope.navigateCallback(item);
          }
        }

        if ($scope.itemClickCallback) {
          $scope.itemClickCallback(item);
        }
      };

      $scope.handlePrimaryClick = function(item, event) {
        if ($scope.inMobileState) {
          if (item.children && item.children.length > 0) {
            updateMobileMenu(item);
          } else {
            updateMobileMenu();
          }
        } else if (!item.children || item.children.length < 1) {
          clearHoverStates();
        }

        navigateToItem(item);
      };

      $scope.handleSecondaryClick = function(primary, secondary, event) {
        if ($scope.inMobileState) {
          if (secondary.children && secondary.children.length > 0) {
            updateMobileMenu(primary, secondary);
          } else {
            updateMobileMenu();
          }
        } else if (!secondary.children || secondary.children.length < 1) {
          clearHoverStates();
        }

        navigateToItem(secondary);
      };

      $scope.handleTertiaryClick = function(primary, secondary, tertiary, event) {
        if ($scope.inMobileState) {
          updateMobileMenu();
        }

        clearHoverStates();

        navigateToItem(tertiary);
      };

      var primaryHover = function () {
        var hover = false;
        $scope.items.forEach(function (item) {
          if (item.isHover) {
            hover = true;
          }
        });
        return hover;
      };

      var secondaryHover = function () {
        var hover = false;
        $scope.items.forEach(function (item) {
          if (item.children && item.children.length > 0) {
            item.children.forEach(function (secondaryItem) {
              if (secondaryItem.isHover) {
                hover = true;
              }
            });
          }
        });
        return hover;
      };

      // Show secondary nav bar on hover of primary nav items
      $scope.handlePrimaryHover = function (item) {
        if (item.children && item.children.length > 0) {
          if (!$scope.inMobileState) {
            if (item.navUnHoverTimeout !== undefined) {
              $timeout.cancel(item.navUnHoverTimeout);
              item.navUnHoverTimeout = undefined;
            } else if ($scope.navHoverTimeout === undefined && !item.isHover) {
              item.navHoverTimeout = $timeout(function () {
                $scope.hoverSecondaryNav = true;
                item.isHover = true;
                item.navHoverTimeout = undefined;
              }, hoverDelay);
            }
          }
        }
      };

      $scope.handlePrimaryUnHover = function (item) {
        if (item.children && item.children.length > 0) {
          if (item.navHoverTimeout !== undefined) {
            $timeout.cancel(item.navHoverTimeout);
            item.navHoverTimeout = undefined;
          } else if (item.navUnHoverTimeout === undefined && item.isHover) {
            item.navUnHoverTimeout = $timeout(function () {
              item.isHover = false;
              if (!primaryHover()) {
                $scope.hoverSecondaryNav = false;
              }
              item.navUnHoverTimeout = undefined;
            }, hideDelay);
          }
        }
      };

      // Show tertiary nav bar on hover of secondary nav items
      $scope.handleSecondaryHover = function (item) {
        if (item.children && item.children.length > 0) {
          if (!$scope.inMobileState) {
            if (item.navUnHoverTimeout !== undefined) {
              $timeout.cancel(item.navUnHoverTimeout);
              item.navUnHoverTimeout = undefined;
            } else if ($scope.navHoverTimeout === undefined) {
              item.navHoverTimeout = $timeout(function () {
                $scope.hoverTertiaryNav = true;
                item.isHover = true;
                item.navHoverTimeout = undefined;
              }, hoverDelay);
            }
          }
        }
      };

      $scope.handleSecondaryUnHover = function (item) {
        if (item.children && item.children.length > 0) {
          if (item.navHoverTimeout !== undefined) {
            $timeout.cancel(item.navHoverTimeout);
            item.navHoverTimeout = undefined;
          } else if (item.navUnHoverTimeout === undefined) {
            item.navUnHoverTimeout = $timeout(function () {
              item.isHover = false;
              if (!secondaryHover()) {
                $scope.hoverTertiaryNav = false;
              }
             item.navUnHoverTimeout = undefined;
            }, hideDelay);
          }
        }
      };

      var updateSecondaryCollapsedState = function (setCollapsed, collapsedItem) {
        if (collapsedItem) {
          collapsedItem.secondaryCollapsed = setCollapsed;
        }
        if (setCollapsed) {
          $scope.collapsedSecondaryNav = true;

          bodyContentElement.addClass('collapsed-secondary-nav-pf');
        } else {
          // Remove any collapsed secondary menus
          if ($scope.items) {
            $scope.items.forEach(function (item) {
              item.secondaryCollasped = false;
            });
          }
          $scope.collapsedSecondaryNav = false;

          bodyContentElement.removeClass('collapsed-secondary-nav-pf');
        }
      };

      var updateTertiaryCollapsedState = function (setCollapsed, collapsedItem) {
        if (collapsedItem) {
          collapsedItem.tertiaryCollapsed = setCollapsed;
        }
        if (setCollapsed) {
          $scope.collapsedTertiaryNav = true;

          bodyContentElement.addClass('collapsed-tertiary-nav-pf');
          updateSecondaryCollapsedState(false);
        } else {
          // Remove any collapsed secondary menus
          if ($scope.items) {
            $scope.items.forEach(function (item) {
              if (item.children && item.children.length > 0) {
                item.children.forEach(function (secondaryItem) {
                  secondaryItem.tertiaryCollasped = false;
                });
              }
            });
          }
          $scope.collapsedTertiaryNav = false;

          bodyContentElement.removeClass('collapsed-tertiary-nav-pf');
        }
      };

      $scope.collapseSecondaryNav = function (item, event) {
        if ($scope.inMobileState) {
          updateMobileMenu();
        } else {
          if (item.secondaryCollapsed) {
            updateSecondaryCollapsedState(false, item);
            forceHideSecondaryMenu();
          } else {
            updateSecondaryCollapsedState(true, item);
          }
        }

        $scope.hoverSecondaryNav = false;
        event.stopImmediatePropagation();
      };

      $scope.collapseTertiaryNav = function (item, event) {
        if ($scope.inMobileState) {
          updateMobileMenu();
        } else {
          if (item.tertiaryCollapsed) {
            updateTertiaryCollapsedState(false, item);
            forceHideSecondaryMenu();
          } else {
            updateTertiaryCollapsedState(true, item);
          }
        }

        $scope.hoverSecondaryNav = false;
        $scope.hoverTertiaryNav = false;
        event.stopImmediatePropagation();
      };

      checkNavState();

      angular.element($window).bind('resize', function () {
        checkNavState();
      });

    },
    controller: navigationController
  };
}]);

