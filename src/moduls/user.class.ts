export class User {
    name: string;
    email: string;
    password: string;
    iconPath: string;   
   

    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.password = obj ? obj.password : '';
        this.iconPath = obj ? obj.iconPath : '';    
        
    }

    toJSON() {
        return {
            "name" : this.name,
            "email" :this.email ,
            "password" :this.password ,
            "iconPath":this.iconPath ,
        }
    }
}