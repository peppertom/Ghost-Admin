import Route from 'ember-route';
import injectService from 'ember-service/inject';
import EmberObject from 'ember-object';
import styleBody from 'ghost-admin/mixins/style-body';
import Configuration from 'ember-simple-auth/configuration';
import DS from 'ember-data';
import {
    VersionMismatchError,
    isVersionMismatchError
} from 'ghost-admin/services/ajax';

const {Errors} = DS;

export default Route.extend(styleBody, {
    titleToken: 'Sign In',

    classNames: ['ghost-login'],

    session: injectService(),
    notifications: injectService(),

    beforeModel() {
        this._super(...arguments);

        if (this.get('session.isAuthenticated')) {
            this.transitionTo(Configuration.routeIfAlreadyAuthenticated);
        }
    },

    model() {
        return EmberObject.create({
            identification: '',
            password: '',
            errors: Errors.create()
        });
    },

    // the deactivate hook is called after a route has been exited.
    deactivate() {
        let controller = this.controllerFor('signin');

        this._super(...arguments);

        // clear the properties that hold the credentials when we're no longer on the signin screen
        controller.set('model.identification', '');
        controller.set('model.password', '');
    },

    actions: {
        oauthAuthentication() {
            let authStrategy = 'authenticator:oauth2';

            this.get('torii')
                .open('google-oauth2-bearer')
                .then((googleAuth) => {
                    let googleToken = googleAuth.authorizationToken.access_token;

                    console.log('Google authentication successful', googleAuth);

                    // Authentication transitions to posts.index, we can leave spinner running unless there is an error
                    this.get('session')
                        .authenticate(authStrategy, {token: googleToken})
                        .then(() => {
                            console.log('Ghost authentication successful');
                        })
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

                                if (error.errors[0].message.string.match(/user with that email/)) {
                                    this.get('controller.model.errors').add('identification', '');
                                }

                                if (error.errors[0].message.string.match(/password is incorrect/)) {
                                    this.get('controller.model.errors').add('password', '');
                                }
                            } else {
                                // Connection errors don't return proper status message, only req.body
                                this.get('notifications').showAlert('There was a problem on the server.', {type: 'error', key: 'session.authenticate.failed'});
                            }
                    });
                })
                .catch((error) => {
                    console.log('Google authentication failed', error);
                    this.set('controller.flowErrors', 'Authentication with Google denied or failed');
                });
        }
    }
});
