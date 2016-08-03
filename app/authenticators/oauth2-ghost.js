import Oauth2Authenticator from './oauth2';
import computed from 'ember-computed';

export default Oauth2Authenticator.extend({
    serverTokenEndpoint: computed('ghostPaths.apiRoot', function () {
        return `${this.get('ghostPaths.apiRoot')}/authentication/ghost`;
    })
});
