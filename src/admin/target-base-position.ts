/// <reference path='../common/models.ts' />
/// <reference path='../common/messaging.ts' />
/// <reference path='shared_directives.ts'/>

import angular = require('angular');

import Models = require('../common/models');
import Messaging = require('../common/messaging');
import Shared = require('./shared_directives');

class TargetBasePositionController {

  public targetBasePosition: number;

  constructor(
    $scope: ng.IScope,
    $log: ng.ILogService,
    subscriberFactory: Shared.SubscriberFactory
  ) {
    var update = (value : Models.TargetBasePositionValue) => {
      if (value == null) return;
      this.targetBasePosition = value.data;
    };

    var subscriberTargetBasePosition = subscriberFactory.getSubscriber($scope, Messaging.Topics.TargetBasePosition)
      .registerDisconnectedHandler(() => this.targetBasePosition = null)
      .registerSubscriber(update, us => us.forEach(update));

    $scope.$on('$destroy', () => {
      subscriberTargetBasePosition.disconnect();
    });
  }
}

export var targetBasePositionDirective = 'targetBasePositionDirective';

angular.module(targetBasePositionDirective, [Shared.sharedDirectives])
  .directive('targetBasePosition', (): ng.IDirective => { return {
    template: '<span>{{ targetBasePositionScope.targetBasePosition|number:2 }}</span>',
    restrict: 'E',
    transclude: false,
    controller: ['$scope', '$log', 'subscriberFactory', TargetBasePositionController],
    controllerAs: 'targetBasePositionScope',
    scope: {},
    bindToController: true
  }});
