export class User {
    name: string;
    email: string;
    password: string;
    iconPath: string;
    status: string;
    uid: string;
    idDB: string;
    talkID: {}[] = [];


    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.password = obj ? obj.password : '';
        this.iconPath = obj ? obj.iconPath : '';
        this.status = obj ? obj.status : '';
        this.uid = obj ? obj.uid : '';
        this.idDB = obj ? obj.idDB : '';
        this.talkID = obj ? obj.talkID : [];

    }

    toJSON() {
        return {
            "name": this.name,
            "email": this.email,
            "password": this.password,
            "iconPath": this.iconPath,
            "status": this.status,
            "uid": this.uid,
            "idDB": this.idDB,
            "talkID": this.talkID,
        }
    }

    getAktive() {
        return this.status == "Aktive";
    }
}