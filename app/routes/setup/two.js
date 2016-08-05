import Route from 'ember-route';
import injectService from 'ember-service/inject';
import {
    VersionMismatchError,
    isVersionMismatchError
} from 'ghost-admin/services/ajax';

export default Route.extend({

    session: injectService(),
    notifications: injectService(),

    sessionAuthenticated() {
        // noop - we don't want to redirect when authenticating during setup
    },

    actions: {
        authenticateWithGhostOrg() {
            let authStrategy = 'authenticator:oauth2-ghost';

            this.toggleProperty('controller.loggingIn');
            this.set('controller.flowErrors', '');

            this.get('torii')
                .open('ghost-oauth2', {type: 'setup'})
                .then((authentication) => {
                    console.log('Ghost.org authentication succeeded', authentication);
                    this.send('authenticate', authStrategy, [authentication]);
                })
                .catch((error) => {
                    console.log('Ghost.org authentication failed', error);
                    this.toggleProperty('controller.loggingIn');
                    this.set('controller.flowErrors', 'Authentication with Ghost.org denied or failed');
                });
        },

        authenticate(strategy, authentication) {
            // Authentication transitions to posts.index, we can leave spinner running unless there is an error
            this.get('session')
                .authenticate(strategy, ...authentication)
                .catch((error) => {
                    this.toggleProperty('controller.loggingIn');

                    if (error && error.errors) {
                        // we don't get back an ember-data/ember-ajax error object
                        // back so we need to pass in a null status in order to
                        // test against the payload
                        if (isVersionMismatchError(null, error)) {
                            let versionMismatchError = new VersionMismatchError(error);
                            return this.get('notifications').showAPIError(versionMismatchError);
                        }

                        error.errors.forEach((err) => {
                            err.message = err.message.htmlSafe();
                        });

                        this.set('controller.flowErrors', error.errors[0].message.string);
                    } else {
                        // Connection errors don't return proper status message, only req.body
                        this.get('notifications').showAlert('There was a problem on the server.', {type: 'error', key: 'session.authenticate.failed'});
                    }
                });
        }
    }
});
