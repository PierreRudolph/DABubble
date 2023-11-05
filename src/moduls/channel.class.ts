export class Channel {
    name: string;
    description: string;
    members: [];

    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.description = obj ? obj.description : '';
        this.members = obj ? obj.members : [];
    }

    toJSON() {
        return {
            "name": this.name,
            "description": this.description,
            "members": this.members
        }
    }
}