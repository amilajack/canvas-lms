define((require) => {
  const EventStore = require('../stores/events');
  const config = require('../config');
  let update;

  const onChange = function () {
    update({
      submission: EventStore.getSubmission(),
      questions: EventStore.getQuestions(),
      events: EventStore.getAll(),
      isLoading: EventStore.isLoading(),
      attempt: EventStore.getAttempt(),
      availableAttempts: EventStore.getAvailableAttempts(),
    });
  };

  /**
   * @class Events.Core.Controller
   * @private
   *
   * The controller is responsible for keeping the UI up-to-date with the
   * data layer.
   */
  var Controller = {

    /**
     * Start listening to data updates.
     *
     * @param {Function} onUpdate
     *        A callback to notify when new data comes in.
     *
     * @param {Object} onUpdate.props
     *        A set of props ready for injecting into the app layout.
     *
     * @param {Object} onUpdate.props.quizStatistics
     *        Quiz statistics.
     *        See Stores.Statistics#getQuizStatistics().
     *
     * @param {Object} onUpdate.props.quizReports
     *        Quiz reports.
     *        See Stores.Statistics#getQuizReports().
     */
    start (onUpdate) {
      update = onUpdate;
      EventStore.addChangeListener(onChange);

      if (config.loadOnStartup) {
        Controller.load();
      }
    },

    /**
     * Load initial application data; quiz statistics and reports.
     */
    load () {
      EventStore.loadInitialData().then(EventStore.load.bind(EventStore));
    },

    /**
     * Stop listening to data changes.
     */
    stop () {
      update = undefined;
    }
  };

  return Controller;
});
