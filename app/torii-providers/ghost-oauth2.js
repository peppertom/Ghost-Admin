import Oauth2 from 'torii/providers/oauth2-code';

let GhostOauth2 = Oauth2.extend({

    name:    'ghost-oauth2',
    baseUrl: 'http://localhost:8080/oauth2/authorize',

    responseParams: ['code', 'state'],

    // we want to redirect to the ghost admin app by default
    redirectUri: window.location.href.replace(/(\/ghost)(.*)/, '$1')
});

export default GhostOauth2;
