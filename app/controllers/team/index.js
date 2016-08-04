import Controller from 'ember-controller';
import injectService from 'ember-service/inject';

export default Controller.extend({

    showInviteUserModal: false,

    users: null,
    invites: null,

    session: injectService(),

    actions: {
        toggleInviteUserModal() {
            this.toggleProperty('showInviteUserModal');
        }
    }
});
