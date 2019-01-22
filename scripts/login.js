var login = new Vue({
    el: "#login",
    data: {
        formSubmitted: false,
        inputUserName: '',
        inputPassword: '',
        resultError: false,
        resultSuccess: false, 
        users: [{user:"ben", password:"ben"}]
    },
    methods: {
        clickLogin: function(){
            // try to find the user
            var user = this.findUser();

            if (user == undefined || user == null){
                resultError = true;
                return;
            }

            // verify the password
            var correctPassword = this.verifyPassword(user);

            if (user && correctPassword){
                this.resultSuccess = true;
            }
            else{
                this.resultError = true;
            }
        },
        findUser: function(){
            return _.find(this.users, function(user){
                return user.name == this.inputUserName;
            });
        },
        resetFormState: function(){
            this.formSubmitted = false;
            this.resultError = false;
            this.resultSuccess = false;
        },
        verifyPassword: function(user){
            return (user.password == this.inputPassword);
        }
    }
});