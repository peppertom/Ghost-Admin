/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
import Oauth2GhostAuthenticator from './oauth2-ghost';
import computed from 'ember-computed';

export default Oauth2GhostAuthenticator.extend({
    serverTokenEndpoint: computed('ghostPaths.apiRoot', function () {
        return `${this.get('ghostPaths.apiRoot')}/authentication/invite/accept`;
    })
});
