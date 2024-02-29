export class Channel {
    name: string;
    creator: string;
    idDB: string;
    description: string;
    members: {}[];

    constructor(obj?: any) {
        this.creator = obj ? obj.creator : '';
        this.name = obj ? obj.name : '';
        this.idDB = obj ? obj.idDB : '';
        this.description = obj ? obj.description : '';
        this.members = obj ? obj.members : [];
    }

    toJSON() {
        return {
            "name": this.name,
            "creator": this.creator,
            "idDB": this.idDB,
            "description": this.description,
            "members": this.members
        }
    }
}