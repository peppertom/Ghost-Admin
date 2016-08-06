import BaseValidator from './base';

export default BaseValidator.extend({
    properties: ['name', 'email', 'password'],

    name(model) {
        let usingPatronus = model.get('config.patronusAuth');
        let name = model.get('name');

        if (!usingPatronus && !validator.isLength(name, 1)) {
            model.get('errors').add('name', 'Please enter a name.');
            this.invalidate();
        }
    },

    email(model) {
        let usingPatronus = model.get('config.patronusAuth');
        let email = model.get('email');

        if (usingPatronus) {
            return;
        }

        if (validator.empty(email)) {
            model.get('errors').add('email', 'Please enter an email.');
            this.invalidate();
        } else if (!validator.isEmail(email)) {
            model.get('errors').add('email', 'Invalid Email.');
            this.invalidate();
        }
    },

    password(model) {
        let usingPatronus = model.get('config.patronusAuth');
        let password = model.get('password');

        if (!usingPatronus && !validator.isLength(password, 8)) {
            model.get('errors').add('password', 'Password must be at least 8 characters long');
            this.invalidate();
        }
    }
});
