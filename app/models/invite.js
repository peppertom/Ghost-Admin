import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import computed from 'ember-computed';

export default Model.extend({
    token: attr('string'),
    email: attr('string'),
    expires: attr('number'),
    createdAtUTC: attr('moment-utc'),
    createdBy: attr('number'),
    updatedAtUTC: attr('moment-utc'),
    updatedBy: attr('number'),
    status: attr('string'),

    // TODO: remove once `gh-user-invited` is updated to work with invite
    // models instead of the current hacks which make invites look like
    // users
    invited: true,

    // TODO: replace with actual role once the server response is updated
    role: computed(function () {
        return this.store.peekAll('role').get('firstObject');
    }),

    resendInvite() {
        let fullInviteData = this.toJSON();
        let inviteData = {
            email: fullInviteData.email,
            roles: fullInviteData.roles
        };
        let inviteUrl = this.get('ghostPaths.url').api('invites');

        return this.get('ajax').post(inviteUrl, {
            data: JSON.stringify({invites: [inviteData]}),
            contentType: 'application/json'
        });
    }
});
